# Lisk-Roulette
Proof of Concept Roulette Dapp created using Lisk SDK.

# Demo
[View Demo Here](https://roulette.delegate.moosty.com)

# Run a Node
### Requirements
- node v10
- postgres v10

### Installation
```
git clone https://github.com/corbifex/lisk-roulette.git
cd ./lisk-roulette/node
npm install
```
configure `node/config/testnet/config.json`
### Start node
```
npm run build
node dist/index.js
```

# Run local client
### Installation
```
git clone https://github.com/corbifex/lisk-roulette.git
cd ./lisk-roulette/client
npm install
```

### Start client
configure custom node locations at:
    `client/src/actions/transmit-transactions.js:5`

`client/src/App.js:23`
```
npm run start
```
