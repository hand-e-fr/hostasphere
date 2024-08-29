from profiler.core import Profiler
import requests

profiler = Profiler(
    address='localhost:50051',
    token='shs_qsdsq8d79qdsq65d4q6d84sqd68qsd64qsd48q68sf'
)

@profiler.probe()
def fetch_data_from_api(api_url):
    response = requests.get(api_url)
    return response.json()

if __name__ == "__main__":
    fetch_data_from_api("https://jsonplaceholder.typicode.com/todos/1")