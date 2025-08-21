# HELPDESK-WHATSAPP-BAILEYS
API para atendimento automatizado via WhatsApp integrado com Inteligência Artificial (IA), desenvolvida para otimizar o suporte técnico, gerenciamento de chamados e interações em tempo real. Este projeto foi criado para empresas que buscam eficiência no atendimento ao cliente, reduzindo tempos de resposta e automatizando fluxos repetitivos, como abertura de tickets e consultas a sistemas internos.

## 📝 Visão Geral
O HELPDESK-WHATSAPP-BAILEYS é uma solução robusta e escalável construída com tecnologias modernas, focada em integrar o WhatsApp como canal principal de comunicação. Utilizando a biblioteca Baileys para conexão com o WhatsApp Web, a API permite:
- **Atendimento 24/7**: Respostas automáticas e inteligentes baseadas em IA para dúvidas comuns.
- **Gerenciamento de Chamados**: Abertura, atualização e encerramento de tickets diretamente via chat.
- **Integração com Sistemas Internos**: Consulta a bancos de dados, CRMs ou ERPs para fornecer informações personalizadas.
- **Personalização Avançada**: Comandos customizáveis para diferentes perfis de usuários (clientes, técnicos e administradores).

Essa API é ideal para helpdesks, service desks e equipes de suporte que desejam elevar a experiência do usuário, minimizando a dependência de atendentes humanos para tarefas rotineiras. Ela pode ser integrada a plataformas existentes, como GLPI ou sistemas proprietários, e suporta escalabilidade para alto volume de interações.

## 🚀 Tecnologias
- **Node.js**: Ambiente de execução para o backend, garantindo performance assíncrona e eficiente.
- **TypeScript**: Tipagem estática para maior segurança, legibilidade e manutenção do código.
- **Express.js**: Framework web leve e flexível para definição de rotas e middlewares.
- **Baileys**: Biblioteca para integração multi-dispositivo com o WhatsApp Web, permitindo envio/recebimento de mensagens sem API oficial.
- **Gemini AI (ou equivalente)**: Integração com modelos de IA para processamento de linguagem natural (NLP), geração de respostas inteligentes e análise de intenções.
- **Zod**: Validação de schemas para entradas de dados seguras e consistentes.
- **Axios**: Cliente HTTP para integrações com APIs externas, como bancos de dados ou serviços de IA.
- **Docker**: Containerização para deploy consistente em ambientes locais, cloud ou on-premise.
- **TS-Node**: Execução direta de código TypeScript no Node.js durante desenvolvimento.

## 🏗️ Arquitetura
O projeto adota uma arquitetura modular e orientada a domínios, seguindo princípios de Clean Architecture para separação de responsabilidades:
- **Camada de Apresentação**: Rotas Express.js para endpoints HTTP e integração WebSocket para tempo real.
- **Camada de Negócios**: Lógica de comandos (ex.: /abrir-chamado, /consultar-status) processada por controladores e serviços.
- **Camada de Dados**: Repositórios para acesso a bancos (ex.: PostgreSQL via Prisma) e integrações externas (IA, WhatsApp).
- **Middlewares**: Autenticação (JWT ou sessão Baileys), autorização por perfil, tratamento de erros e logging.
- **Integração com IA**: Fluxo de mensagens é roteado para modelos de IA para análise semântica, sugestão de respostas e automação de ações (ex.: criar ticket baseado em descrição do problema).
- **Escalabilidade**: Suporte a clusters Node.js e balanceamento de carga para múltiplas instâncias WhatsApp.
- **Segurança**: Criptografia de dados sensíveis, validação de entradas com Zod e conformidade com LGPD/GDPR para privacidade de conversas.

A estrutura promove testabilidade, com módulos independentes que facilitam a adição de novas funcionalidades, como notificações push ou integração com outros canais (ex.: Telegram).

## ⚙️ Setup e Configuração
### Pré-requisitos
- Node.js (>= 18.x)
- npm (>= 9.x)
- Docker e Docker Compose (opcional, para containerização)
- Conta WhatsApp ativa (para autenticação via QR Code durante setup inicial)
- Chave API para integração com IA (ex.: Google Gemini ou OpenAI)

### 1. Clone o repositório
```bash
git clone https://github.com/RicardoTavaresDias/HELPDESK-WHATSAPP-BAILEYS
cd HELPDESK-WHATSAPP-BAILEYS
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure as variáveis de ambiente
Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:
```env
PORT=3000  # Porta do servidor Express
SECRET=sua_chave_segura  # Segredo para autenticação JWT, tem que ser a mesma da API HELPDESK
GEMINI_API_KEY=sua_chave_api_ia  # Chave para integração com IA (ex.: Gemini)
USER_DB=usuario_postgres
HOST_DB=host_postgres
DATABASE=name_database_postgres
PASSWORD=senha_postgres
PORT_DB=5432 #ou a porta desejada no momento da configuração do postgres
```

### 4. Execute as migrações do banco (se aplicável)
Se utilizando Prisma ou outro ORM:
```bash
npx prisma migrate dev
```

### 5. Inicie o projeto
**Desenvolvimento:**
```bash
npm run dev  # Com hot reload via TS-Node
```
**Produção:**
```bash
npm start
```
**Com Docker:**
```bash
docker-compose up --build
```
**Docker Local:**
```bash
# Cria imagem
docker build -t api_chatbot_ai . 

 # Roda a aplicação
docker run -p 3000:3000 api_chatbot_ai

# Rodar com variavel de ambiente pelo docker => sem o nome no containers
docker run --env-file .env -p 3000:3000 api_chatbot_ai 

# Esse dar nome no containers mais variavel de ambiente
docker run --name api_chatbot_ai_container --env-file .env -p 3000:3000 api_chatbot_ai
```


A API estará disponível em `http://localhost:3000`. Durante o primeiro start, escaneie o QR Code exibido no console para autenticar o WhatsApp.

## 📚 Scripts Disponíveis
- `npm run dev`: Executa em modo desenvolvimento com recarregamento automático.
- `npm start`: Inicia o servidor em modo produção.
- `npm test`: Executa testes unitários e de integração com Jest.
- `npm run lint`: Verifica o código com ESLint para padrões de qualidade.
- `npm run build`: Compila o TypeScript para JavaScript (para deploy).

## 🌐 Funcionalidades Detalhadas
### Atendimento via WhatsApp
- **Conexão Multi-Dispositivo**: Suporte a múltiplas sessões WhatsApp sem necessidade de telefone físico conectado.
- **Comandos Customizados**:
  - `/ajuda`: Lista comandos disponíveis.
  - `/abrir-chamado [descrição]`: Abre um ticket automaticamente e atribui a um técnico disponível.
  - `/status [id-chamado]`: Consulta o status de um chamado.
  - `/consultar [pergunta]`: Envia pergunta para IA e responde com informações de sistemas internos.
- **Fluxo de Conversa**: Mensagens são processadas em tempo real; IA detecta intenções (ex.: "problema com impressora" → abre chamado específico).

### Integração com IA
- **Processamento de Linguagem Natural**: Usa modelos como Gemini para entender contexto, sugerir respostas e automatizar ações.
- **Respostas Personalizadas**: Baseadas em histórico de conversas e dados do usuário.
- **Automação Avançada**: Integração com APIs externas para ações como envio de e-mails ou atualizações em CRMs.

### Gerenciamento de Chamados
- **Abertura Automática**: Com whatsapp aberura de chamados pela IA.
- **Atualização e Encerramento**: Técnicos recebem notificações; status é atualizado em tempo real.
- **Histórico**: Armazenado em banco para relatórios e auditoria.

### Segurança e Logs
- **Autenticação**: Sessões WhatsApp criptografadas; JWT para endpoints API.
- **Logging**: Registros detalhados de interações, erros e métricas de performance.

## 📖 Fluxo de Uso Exemplo
1. Inicie a API e autentique o WhatsApp via QR Code.
2. Envie uma mensagem para o número conectado: "/abrir-chamado Meu computador não liga".
3. A IA processa, abre um chamado e responde: "Chamado #123 aberto. Técnico será atribuído em breve."
4. Consulte status: "/status 123" → "Em andamento. Detalhes: ..."

## 📌 Observações
- **Limitações do WhatsApp**: Respeite as políticas do WhatsApp; evite spam para não ser banido.
- **Integração com Banco de Dados**: Opcional, mas recomendado para persistência de chamados (ex.: PostgreSQL).
- **Erros Comuns**: Verifique logs se a conexão Baileys falhar; reinicie para novo QR Code.
- **Escalabilidade**: Para produção, use PM2 ou Kubernetes para múltiplas instâncias.

## 🤝 Contribuindo
Contribuições são bem-vindas! Siga estes passos:
1. Faça um fork do repositório.
2. Crie uma branch: `git checkout -b feature/nova-funcionalidade`.
3. Commit: `git commit -m 'feat: adiciona nova funcionalidade'`.
4. Push: `git push origin feature/nova-funcionalidade`.
5. Abra um Pull Request.

Consulte [CONTRIBUTING.md](CONTRIBUTING.md) para diretrizes detalhadas, incluindo padrões de código e convenções de commit.

## 📄 Licença
Este projeto é licenciado sob a [MIT License](LICENSE). Sinta-se livre para usar, modificar e distribuir.

## 🙌 Agradecimentos
- À comunidade **Baileys** e **Node.js** pela base sólida.
- Inspiração em soluções de helpdesk automatizado como Zendesk e Intercom.
- Contribuidores e usuários que testam e sugerem melhorias.

Para mais informações, entre em contato via issues no GitHub ou e-mail: ricardotavaresdias@example.com.