# 📖 Solo Leveling GO - README

Um jogo estilo **Solo Leveling** usando **React Native + Expo** onde
você explora o mapa, encontra **dungeons**, luta contra **monstros** e
coleta **loot**.

------------------------------------------------------------------------

## 🚀 Pré-requisitos

Antes de começar, você precisa ter instalado:

-   [Node.js (LTS)](https://nodejs.org/)\
-   [Expo CLI](https://docs.expo.dev/get-started/installation/)\
-   Um celular com o aplicativo **Expo Go** (Android/iOS)

------------------------------------------------------------------------

## 📦 Instalação do Projeto

1.  **Clone o repositório** ou crie o projeto:

    ``` bash
    git clone https://github.com/felipegomes14/solo-dungeon-go.git
    cd solo-leveling-go
    ```

    ou, se já tiver um projeto Expo criado:

    ``` bash
    npx create-expo-app solo-leveling-go
    cd solo-leveling-go
    ```

2.  **Instale as dependências necessárias**:

    ``` bash
    npm install react-native-maps expo-location
    ```

    ou com yarn:

    ``` bash
    yarn add react-native-maps expo-location
    ```

------------------------------------------------------------------------

## ▶️ Rodando o Projeto

1.  Inicie o servidor de desenvolvimento:

    ``` bash
    npx expo start
    ```

2.  Abra o aplicativo **Expo Go** no seu celular.

3.  Escaneie o **QR Code** que aparece no terminal ou no navegador.

4.  O app abrirá exibindo o **mapa** e suas **dungeons**.

------------------------------------------------------------------------

## ⚔️ Como Jogar

-   Caminhe até uma **dungeon fixa** (ex.: São Paulo, Nova York, Paris)
    ou ajuste as coordenadas no código para sua região.\
-   Quando entrar no raio da dungeon, um **monstro aleatório**
    aparecerá.\
-   Você pode:
    -   **Atacar** → causa dano no inimigo.\
    -   **Fugir** → sai da dungeon sem recompensas.\
-   Ao derrotar monstros você ganha:
    -   **XP** → para upar de nível.\
    -   **Gold** → para comprar futuros itens.\
    -   **Loots raros** como Poções de Cura.

------------------------------------------------------------------------

## 📌 Notas

-   Ative a **localização (GPS)** do celular antes de abrir o app.\
-   Para testar sem precisar viajar até São Paulo/Nova York/Paris 😅,
    ajuste o arquivo `App.js` em `dungeonsFixas` para coordenadas
    próximas da sua casa.
