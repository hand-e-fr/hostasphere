from profiler.core import Profiler
import requests
from bs4 import BeautifulSoup

profiler = Profiler(
    endpoint_url='http://localhost:5000',
    license_id='1234',
    license_secret='567'
)

@profiler.probe()
def scrape_website(url):
    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'html.parser')
    return soup.title.string

if __name__ == "__main__":
    scrape_website("https://fr.wikipedia.org/wiki/Wikip%C3%A9dia")