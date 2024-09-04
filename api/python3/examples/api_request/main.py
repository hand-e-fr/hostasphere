import requests

from profiler.core import Profiler

profiler = Profiler(
    address='localhost:50051',
    token='hsp_0d6d562910026e3ba0b511dd2c99a47d374f810055003c149eb5fbcdad693319'
)


@profiler.track()
def fetch_data_from_api(api_url):
    response = requests.get(api_url)
    return response.json()


if __name__ == "__main__":
    fetch_data_from_api("https://jsonplaceholder.typicode.com/todos/1")
