from flask import Flask, jsonify, request
from flask_cors import CORS
from llm_price_scraper.enums import DataSources
from llm_price_scraper.scrapers import LlmPricingScraper
from functools import cmp_to_key
import time

app = Flask(__name__)
CORS(app)

cache = {}

CACHE_TIMEOUT = 3600

def is_cache_valid(cached_time):
    """Check if cache is still valid."""
    current_time = time.time()
    return (current_time - cached_time) < CACHE_TIMEOUT

@app.route('/api/pricing/', methods=['GET'])
def get_pricing():
    source = request.args.get('source', default='docsbot', type=str)

    model_name_filter = request.args.get('model_name', default=None, type=str)
    sort_by = request.args.get('sort_by', default=None, type=str)
    order = request.args.get('order', default='asc', type=str)

    try:
        source_enum_value = None
        if source.lower() == DataSources.DOCSBOT.value:
            source_enum_value = DataSources.DOCSBOT
        elif source.lower() == DataSources.BOTGENUITY.value:
            source_enum_value = DataSources.BOTGENUITY
        elif source.lower() == DataSources.HUGGINGFACE.value:
            source_enum_value = DataSources.HUGGINGFACE
        elif source.lower() == DataSources.HUHUHANG.value:
            source_enum_value = DataSources.HUHUHANG
        else:
            return jsonify(
                {"error": f"Source '{source}' is not supported."}), 400

        cache_entry = cache.get(source_enum_value)
        if cache_entry and is_cache_valid(cache_entry['time']):
            results = cache_entry['data']
        else:
            results = LlmPricingScraper.scrape(source_enum_value)
            cache[source_enum_value] = {
                'data': results,
                'time': time.time()
            }

        pricing_data = [
            {
                "model": result.model,
                "provider": result.provider,
                "input_tokens_price": result.input_tokens_price,
                "output_tokens_price": result.output_tokens_price,
                "context": result.context,
                "source": result.source,
                "updated": result.updated
            }
            for result in results
        ]

        if model_name_filter:
            pricing_data = [
                item for item in pricing_data if model_name_filter.lower() in item['model'].lower()
            ]

        if sort_by:
            if sort_by not in pricing_data[0]:
                return jsonify({"error": f"Cannot sort by '{sort_by}'."}), 400

            reverse = True if order.lower() == 'desc' else False
            pricing_data = sorted(pricing_data, key=lambda x: x[sort_by], reverse=reverse)

        return jsonify({"pricing_data": pricing_data}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=False, host='0.0.0.0', port=5000)
