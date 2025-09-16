Um jogo mobile de RPG com realidade aumentada onde você explora dungeons baseadas em sua localização real! Derrote monstros, colete tesouros e evolua seu personagem no mundo real.

## ✨ Características

- 🗺️ **Mapa baseado em localização real**
- ⚔️ **Sistema de combate por turnos**
- 🎒 **Inventário e equipamentos completos**
- 🏰 **Dungeons geradas proceduralmente**
- 🛒 **Sistema de loja e economia**
- 📱 **Interface intuitiva e responsiva**

## 📋 Pré-requisitos

Antes de começar, você precisa ter instalado:
- 📦 **Node.js** (versão 16 ou superior)
- 📱 **Expo Go** app no celular
- 🌐 **Conexão com internet**

## 🚀 Como Baixar e Executar

### 1️⃣ **Clone o projeto**
```bash
git clone https://github.com/felipegomes14/solo-dungeon-go.git
cd solo-dungeon-go
2️⃣ Instale as dependências
bash
npm install
# ou se preferir yarn
yarn install
3️⃣ Execute a aplicação
bash
npx expo start
4️⃣ No seu celular
📲 Abra o app Expo Go

📷 Escaneie o QR code que aparecer no terminal

📍 Permita acesso à localização

🎮 Comece a jogar!

🎮 Comandos Úteis
bash
# Iniciar normalmente
npx expo start

# Limpar cache (se tiver problemas)
npx expo start --clear

# Executar no Android
npx expo start --android

# Executar no iOS (apenas macOS)
npx expo start --ios

# Executar no navegador
npx expo start --web

# Verificar versão do Expo
npx expo --version
📱 Como Jogar
🗺️ Exploração
🚶‍♂️ Ande pelo mundo real para encontrar dungeons

📍 Toque nos marcadores coloridos no mapa

🏰 Dungeons aparecem aleatoriamente ao seu redor

⚔️ Combate
⚔️ Ataque - Causa dano básico aos monstros

🛡️ Defender - Reduz dano recebido

🔥 Habilidades - Ataques especiais que usam mana

🧪 Itens - Use poções e scrolls durante a batalha

🏆 Progressão
⭐ Ganhe XP derrotando monstros

📈 Suba de nível para ficar mais forte

🎁 Encontre equipamentos raros

💰 Complete dungeons para ganhar recompensas

🛠️ Tecnologias Utilizadas
React Native - Framework mobile

Expo - Plataforma de desenvolvimento

React Native Maps - Mapas e geolocalização

Expo Location - Acesso à localização GPS

JavaScript - Lógica do jogo

📦 Estrutura do Projeto
text
solo-dungeon-go/
├── App.js                 # Componente principal
├── ClassSelection.js      # Seleção de classes
├── Inventory.js          # Sistema de inventário
├── Combat.js             # Sistema de combate
├── EquipamentScreen.js    # Gerenciamento de equipamentos
├── ShopScreen.js         # Loja do jogo
├── PuzzleGame.js         # Mini-game de puzzle
├── QuizGame.js           # Mini-game de quiz
├── DungeonConfirmation.js # Confirmação de entrada
└── package.json          # Dependências do projeto
⚠️ Dicas Importantes
✅ Para melhor experiência:
📍 Permita acesso à localização

🌳 Use em áreas abertas and parques

🚶‍♂️ Movimente-se fisicamente para explorar

📶 Conecte-se à internet para carregar mapas

❌ Problemas comuns:
Se o app não carregar: npx expo start --clear

Se não encontrar dungeons: ande mais um pouco

Se crashar: reinicie o app Expo Go

🐛 Reportar Problemas
Encontrou um bug? Quer sugerir uma melhoria?

📋 Abra uma issue no GitHub

👥 Contribuição
Contribuições são sempre bem-vindas!

Faça um fork do projeto

Crie uma branch para sua feature (git checkout -b feature/AmazingFeature)

Commit suas mudanças (git commit -m 'Add some AmazingFeature')

Push para a branch (git push origin feature/AmazingFeature)

Abra um Pull Request

📄 Licença
Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

🙋‍♂️ Suporte
Precisa de ajuda? Entre em contato:

📧 Email: [lpegomes14@gmail.com]

💬 Issues: GitHub Issues