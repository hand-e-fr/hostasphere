from profiler.core import Profiler
import requests
from bs4 import BeautifulSoup

profiler = Profiler(
    address='localhost:50051',
    token='hsp_0d6d562910026e3ba0b511dd2c99a47d374f810055003c149eb5fbcdad693319'
)

@profiler.probe()
def scrape_website(url):
    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'html.parser')
    return soup.title.string

if __name__ == "__main__":
    scrape_website("https://fr.wikipedia.org/wiki/Wikip%C3%A9dia")