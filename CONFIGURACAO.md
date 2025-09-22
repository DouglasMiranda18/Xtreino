# 🔧 Configuração do XTREINO HKS

## ⚡ Setup Rápido

### 1. Firebase
1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Crie um novo projeto
3. Ative o Firestore Database
4. Copie as credenciais e cole em `script.js`:

```javascript
const firebaseConfig = {
    apiKey: "SUA_API_KEY_AQUI",
    authDomain: "seu-projeto.firebaseapp.com",
    projectId: "seu-projeto-id",
    storageBucket: "seu-projeto.appspot.com",
    messagingSenderId: "123456789",
    appId: "seu-app-id"
};
```

### 2. Mercado Pago
1. Acesse [Mercado Pago Developers](https://www.mercadopago.com.br/developers)
2. Crie uma aplicação
3. Copie o Access Token e cole em `script.js`:

```javascript
const MERCADO_PAGO_ACCESS_TOKEN = "SEU_ACCESS_TOKEN_AQUI";
```

### 3. Deploy
- **Vercel**: `vercel --prod`
- **Netlify**: Arraste a pasta para netlify.com
- **GitHub Pages**: Ative nas configurações do repositório

## 🎯 Funcionalidades

✅ **Agenda de Treinos** - Inscrições com vagas limitadas  
✅ **Pagamentos** - Mercado Pago (PIX + Cartão)  
✅ **Ranking** - Tempo real com pontuação  
✅ **Resultados** - Lançamento por mapa  
✅ **Admin** - Painel completo (senha: hardkills2024)  

## 💰 Valores

- **Inscrição**: R$ 0,50 por time
- **Vagas**: 12 times por horário
- **Mapas**: 3 quedas (Bermuda, Purgatório, Kalahari)
- **Horários**: Segunda a Sábado (19h-23h)

## 🚀 Pronto para Produção!

O sistema está 100% funcional e pronto para uso real!
