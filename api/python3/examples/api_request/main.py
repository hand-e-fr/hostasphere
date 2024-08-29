from profiler.core import Profiler
import requests

profiler = Profiler(
    endpoint_url='http://localhost:5000',
    license_id='1234',
    license_secret='567'
)

@profiler.probe()
def fetch_data_from_api(api_url):
    response = requests.get(api_url)
    return response.json()

if __name__ == "__main__":
    fetch_data_from_api("https://jsonplaceholder.typicode.com/todos/1")