# Scan Vulnerabilidade WP

## Execute o seguinte comando antes de testar as funções abaixo
```
npm install
```

## Acesse a pasta /src
## Como executar a função obterVersaoPluginsWp:

```
node obterVersaoPluginsWp.js {informe aqui a url do site wordpress}
```

Essa função deverá retornar uma lista de plugins e suas respectivas versões.
## Como executar a função obterVersaoWP:

```
node obterVersaoWP.js {Coloque aqui a URL desejada}
```
Essa função deverá retornar a versão do WordPress usado na url alvo.
## Como executar a função obterTema:

```
node obterTema.js {Coloque aqui a URL desejada}
```
Essa função deverá retornar duas mensagens informando o nome do tema e sua versão.

## Como executar a função infoPlugins:
1. Na pasta raíz do projeto e execute o comando:
```
docker compose up -d
```
2. Ainda na raiz do projeto crie um arquivo **.env** e defina a variável de ambiente a seguir:
```
HOST=adicione aqui o endereço IP da sua máquina
```
3. Certifique-se de que os documentos CVEs foram carregados no MongoDB, verifique em __localhost:8081__ para verificar se existe o schema __cves__ no MongoDB e se está devidamente populado. Caso contrário acesse a documentação do projeto __DataLoadCVE__ e siga a documentação do projeto para prosseguir.
4. Volte novamente a pasta src/ e execute o comando abaixo:
```
node infoPlugins.js {informe aqui a url do site wordpress}
```

## Como executar a função inforTema:
1. Na pasta raíz do projeto e execute o comando:
```
docker compose up -d
```
2. Ainda na raiz do projeto crie um arquivo **.env** e defina a variável de ambiente a seguir:
```
HOST=adicione aqui o endereço IP da sua máquina
```
3. Volte novamente a pasta src/ e execute o comando abaixo:
```
node inforTema.js {informe aqui a url do site wordpress}
```

## Como executar a função inforVersaoWp:
1. Na pasta raíz do projeto e execute o comando :
```
docker compose up -d
```
2. Ainda na raiz do projeto crie um arquivo **.env** e defina a variável de ambiente a seguir:
```
HOST=adicione aqui o endereço IP da sua máquina
```
3. Volte novamente a pasta src/ e execute o comando abaixo:
```
node inforVersaoWp.js {informe aqui a url do site wordpress}
```
## Como executar a função gerarRelatorio:
1. Na pasta raíz do projeto e execute o comando :
```
docker compose up -d
```
2. Ainda na raiz do projeto crie um arquivo **.env** e defina a variável de ambiente a seguir:
```
HOST=adicione aqui o endereço IP da sua máquina
```
3. Volte novamente a pasta src/ e execute o comando abaixo:
```
node gerarRelatorio.js {informe aqui a url do site wordpress}
```

## Como executar a função downloadWp:
1. Na pasta raíz do projeto e execute o comando :
```
docker compose up -d
```
2. Ainda na raiz do projeto crie um arquivo **.env** e defina a variável de ambiente a seguir:
```
HOST=adicione aqui o endereço IP da sua máquina
```
3. Volte novamente a pasta src/ e execute o comando abaixo:
```
node downloadWp.js {versão existente do wordpress}
```
Exemplo:
```
node downloadWp.js 6.2
```