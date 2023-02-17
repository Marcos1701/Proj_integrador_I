import requests
import requests_cache
from bs4 import BeautifulSoup

requests_cache.install_cache('arq_cache')

r = requests.get('http://www.ifpi.edu.br', verify = False)

soup = BeautifulSoup(r.text, 'html.parser')
cabecalhos = soup.find_all('h3')
print(r.text)
