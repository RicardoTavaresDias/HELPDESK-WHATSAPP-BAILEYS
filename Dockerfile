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

# Definir variáveis de ambiente no container
# ENV PORT=
# ENV SECRET=
# ENV GEMINI_API_KEY=
# ENV USER_DB=
# ENV HOST_DB=
# ENV DATABASE=
# ENV PASSWORD=
# ENV PORT_DB=

# Expõe a porta que a sua aplicação vai usar
EXPOSE 3334

# Comando para rodar a aplicação quando o contêiner iniciar
CMD ["npm", "start"]