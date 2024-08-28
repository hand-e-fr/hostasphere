from profiler import probe
import requests
from bs4 import BeautifulSoup

@probe()
def scrape_website(url):
    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'html.parser')
    return soup.title.string

if __name__ == "__main__":
    scrape_website("https://fr.wikipedia.org/wiki/Wikip%C3%A9dia")