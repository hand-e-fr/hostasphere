from profiler.core import Profiler
import requests
from bs4 import BeautifulSoup

profiler = Profiler(
    address='localhost:50051',
    token='shs_qsdsq8d79qdsq65d4q6d84sqd68qsd64qsd48q68sf'
)

@profiler.probe()
def scrape_website(url):
    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'html.parser')
    return soup.title.string

if __name__ == "__main__":
    scrape_website("https://fr.wikipedia.org/wiki/Wikip%C3%A9dia")