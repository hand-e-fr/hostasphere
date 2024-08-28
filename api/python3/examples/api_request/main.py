from profiler import probe
import requests

@probe()
def fetch_data_from_api(api_url):
    response = requests.get(api_url)
    return response.json()

if __name__ == "__main__":
    fetch_data_from_api("https://jsonplaceholder.typicode.com/todos/1")