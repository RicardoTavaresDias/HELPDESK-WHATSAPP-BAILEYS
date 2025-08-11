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
# ENV PORT=3334
# ENV SECRET=e5e9fa1ba31ecd1ae84f75caaa474f3a663f05f4
# ENV GEMINI_API_KEY=AIzaSyCsrByOiFE_h3t-Hxl82-0OpMW_J0ZzF1I
# ENV USER_DB=helpdesk_ws7e_user
# ENV HOST_DB=dpg-d272j8ruibrs739nr50g-a.oregon-postgres.render.com
# ENV DATABASE=helpdesk_ws7e
# ENV PASSWORD=8Kw1TZutWbzUjoccCODkUHaFxMxqXMSR
# ENV PORT_DB=5432

# Expõe a porta que a sua aplicação vai usar
EXPOSE 3334

# Comando para rodar a aplicação quando o contêiner iniciar
CMD ["npm", "start"]