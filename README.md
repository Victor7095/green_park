# Green Park

## Descrição do Projeto
Projeto implementado como parte do Desafio Técnico Backend NodeJS

## Tecnologias utilizadas
- NodeJS
- Hapi
- Sequelize
- SQLite
- Typescript
- csv-parse: para leitura de arquivos CSV
- mozilla/pdf.js: para leitura de arquivos PDF
- pdf-lib: para escrita de arquivos PDF

## Como rodar a aplicação
1. Clone o repositório
2. Instale as dependências com `npm install`
3. Rode a aplicação com `npm start:dev`
4. Executar o script `src/assets/lotes.sql` para inserir os lotes no banco de dados
5. Acessar a aplicação em `http://localhost:3000`

## Endpoints
- `GET /boletos`: retorna todos os boletos
  - Parâmetros:
    - `nome`: nome do boleto a ser filtrado
    - `valor_inicial`: valor inicial do boleto a ser filtrado
    - `valor_final`: valor final do boleto a ser filtrado
    - `id_lote`: ID do lote a ser filtrado
    - `relatorio`: se for igual a `1`, retorna o relatório em PDF

- `POST /receber-boleto-csv`: recebe um arquivo CSV com os boletos a serem inseridos no banco de dados
  - Parâmetros:
    - `file`: arquivo CSV com os boletos a serem inseridos

- `POST /receber-boleto-pdf`: recebe um arquivo PDF com os boletos a serem inseridos no banco de dados
  - Parâmetros:
    - `file`: arquivo PDF com os boletos a serem inseridos