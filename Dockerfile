# Usa uma imagem base, por exemplo, o Node.js 18
FROM node:20-alpine3.20

# Define o diretório de trabalho dentro do contêiner
WORKDIR /usr/src/app

# Copia os arquivos de dependência e instala
COPY . .

# Executa o comando para instalação node_modules
RUN npm install

#Executa o comando para executar para converter o typescript
RUN npm run build

# Expõe a porta que a sua aplicação vai usar
EXPOSE 3333

# Comando para rodar a aplicação quando o contêiner iniciar
CMD ["npm", "start"]