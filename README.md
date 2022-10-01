# ocr-api
API de OCR simples feita com Fastify e Tesseract.js

## Iniciando
Depois de instalar as depedências, simplesmente inicia com `npm run start`.

Nota: **Você deve instalar o Esrun antes disso.** `npm install @digitak/esrun`

## Como alterar a porta?
Basta alterar a variavel de ambiente `PORT` (se não tiver ela, a porta padrão será `3030`).

# Como fazer as requests
Basta fazer um POST para a rota principal, enviando um `multipart/form-data`, pode ser até 4 imagens.

# Nota
O Tesseract é muito antigo e lerdo, então não espere respostas rápidas da API.