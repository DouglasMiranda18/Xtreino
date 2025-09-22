# XTREINO HKS - Sistema Profissional de Torneios

Sistema completo de gerenciamento de torneios Free Fire com integração de pagamentos via Mercado Pago e painel administrativo.

## 🚀 Funcionalidades

- **Agenda de Treinos**: Sistema de inscrições com horários e vagas limitadas
- **Sistema de Pagamento**: Integração completa com Mercado Pago (PIX e Cartão)
- **Ranking em Tempo Real**: Classificação automática dos times
- **Resultados das Quedas**: Acompanhamento de resultados por mapa
- **Painel Administrativo**: Controle total do sistema
- **Design Responsivo**: Interface moderna e profissional

## 🛠️ Tecnologias Utilizadas

- **HTML5** - Estrutura principal
- **Tailwind CSS** - Estilização responsiva
- **JavaScript Vanilla** - Funcionalidades interativas
- **Firebase Firestore** - Banco de dados em tempo real
- **Mercado Pago API** - Sistema de pagamentos
- **Font Awesome** - Ícones

## 📦 Instalação

1. **Clone o repositório**:
```bash
git clone <url-do-repositorio>
cd xtreino-freefire
```

2. **Abra o arquivo `index.html`** diretamente no navegador ou use um servidor local:
```bash
# Usando Python
python -m http.server 8000

# Usando Node.js
npx serve .

# Usando PHP
php -S localhost:8000
```

3. **Acesse**: `http://localhost:8000` ou abra `index.html` diretamente

## 🔧 Configuração do Firebase

### 1. Criar Projeto no Firebase

1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Clique em "Adicionar projeto"
3. Digite o nome do projeto
4. Siga as instruções para criar o projeto

### 2. Configurar Firestore Database

1. No painel do Firebase, vá para "Firestore Database"
2. Clique em "Create database"
3. Escolha "Start in test mode" (para desenvolvimento)
4. Escolha uma localização para o banco de dados

### 3. Obter Configurações do Projeto

1. No painel do Firebase, vá para "Project settings" (ícone de engrenagem)
2. Role para baixo até "Your apps"
3. Clique em "Web" (ícone `</>`)
4. Digite um nome para o app
5. Copie as configurações do `firebaseConfig`

### 4. Atualizar Configurações

Edite o arquivo `script.js` e substitua as configurações:

```javascript
const firebaseConfig = {
    apiKey: "sua-api-key-aqui",
    authDomain: "seu-projeto.firebaseapp.com",
    projectId: "seu-projeto-id",
    storageBucket: "seu-projeto.appspot.com",
    messagingSenderId: "123456789",
    appId: "seu-app-id"
};
```

## 💳 Configuração do Mercado Pago

### 1. Criar Conta no Mercado Pago

1. Acesse [Mercado Pago](https://www.mercadopago.com.br/)
2. Crie uma conta empresarial
3. Complete a verificação de documentos

### 2. Obter Access Token

1. No painel do Mercado Pago, vá para "Desenvolvedores"
2. Clique em "Suas integrações"
3. Crie uma aplicação
4. Copie seu Access Token de produção

### 3. Atualizar Configurações

Edite o arquivo `script.js` e substitua:

```javascript
const MERCADO_PAGO_ACCESS_TOKEN = "seu-access-token-do-mercado-pago";
```

## 📱 Estrutura do Projeto

```
xtreino-freefire/
├── index.html          # Página principal
├── script.js           # JavaScript com todas as funcionalidades
├── README.md           # Documentação
└── public/             # Arquivos estáticos (se necessário)
```

## 🎯 Funcionalidades Detalhadas

### Agenda de Treinos
- **Horários**: Segunda a Sábado, 19h às 23h
- **Mapas**: Bermuda, Purgatório, Kalahari (3 quedas por sessão)
- **Vagas**: Máximo 12 times por horário
- **Valor**: R$ 0,50 por time

### Sistema de Pagamento
- **Métodos**: PIX e Cartão de Crédito/Débito
- **Processamento**: Via Asaas
- **Confirmação**: Automática via webhook
- **Vencimento**: 24 horas

### Ranking
- **Pontuação**: 1º lugar (10pts), 2º lugar (6pts), 3º lugar (4pts), 4º lugar (2pts), 5º lugar (1pt)
- **Kills**: +1 ponto por eliminação
- **Atualização**: Tempo real

### Painel Administrativo
- **Senha**: `hardkills2024`
- **Funcionalidades**:
  - Gerenciar inscrições
  - Lançar resultados
  - Atualizar ranking
  - Estatísticas em tempo real

## 🔒 Segurança

- **Firebase Rules**: Configure regras de segurança no Firestore
- **API Keys**: Mantenha as chaves seguras
- **HTTPS**: Use sempre em produção
- **Validação**: Dados validados no frontend e backend

## 🚀 Deploy

### Vercel (Recomendado)

1. Instale a CLI da Vercel:
```bash
npm i -g vercel
```

2. Faça login:
```bash
vercel login
```

3. Deploy:
```bash
vercel
```

### Netlify

1. Faça upload dos arquivos para o Netlify
2. Configure as variáveis de ambiente se necessário
3. Deploy automático

### GitHub Pages

1. Faça push para o GitHub
2. Vá para Settings > Pages
3. Selecione a branch main
4. Deploy automático

## 📊 Monitoramento

- **Firebase Console**: Monitore uso e erros
- **Asaas Dashboard**: Acompanhe pagamentos
- **Console do Navegador**: Logs de debug

## 🛠️ Desenvolvimento

### Estrutura do Código

- **HTML**: Estrutura semântica
- **CSS**: Tailwind com classes customizadas
- **JavaScript**: Modular e organizado
- **Firebase**: Real-time database

### Adicionando Novas Funcionalidades

1. **Frontend**: Adicione HTML/CSS/JS
2. **Backend**: Use Firebase Firestore
3. **Pagamentos**: Integre com Asaas
4. **Testes**: Teste localmente primeiro

## 📞 Suporte

- **Email**: admin@hardkills.com.br
- **WhatsApp**: (11) 99999-9999
- **Discord**: https://discord.gg/exemplo

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

---

**Desenvolvido com ❤️ para a comunidade Free Fire**

*Sistema profissional de torneios com tecnologia de ponta*