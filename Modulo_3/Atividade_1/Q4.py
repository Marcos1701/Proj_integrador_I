from bs4 import BeautifulSoup
import requests


print("Digite a url da imagem a seguir: ")
site = input('=> ')

resposta = requests.get(site)

soap = BeautifulSoup(resposta.text, 'html.parser')

tag_imagem = soap.find('img')
if tag_imagem is not None:

    url_img = tag_imagem.get('src')
    retorno = requests.get(url_img)
    with open("img.png", 'wb') as f:
        f.write(retorno.content)
else:
    print('img aparentemente não encontada...')
