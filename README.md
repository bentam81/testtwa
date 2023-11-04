# testtwa
* based on https://ton-community.github.io/tutorials/02-contract/
* from https://github.com/ton-community/twa-template

# Overview
* react based TWA-ready web app
* test TON wallet integration
* test TON Smart Contract integration

# Prerequesities
* `npm create vite@latest testtwa -- --template react-ts`
* `npm install`
   * tested with Node.js v18.17.1
* `npm install ton ton-core ton-crypto`
   * "RPC(HTTP) based API" Typescript SDK
   * for TON BlockChain Network access (e.g. open an existing TON Smart Contract)
   * Data provider is an RPC provided by third-party services
   * change data provider in `src/hook/useTonClient.ts`
     * 1. recommend to use toncenter API (by TON community)
       * `@tonapibot` to apply for Mainnet/Testnet 10tps API key
       * https://toncenter.com/
     * 2. for casual DEV, easiest is to use Orbs Network (no registration no API Key)
       * `npm install @orbs-network/ton-access`
       * https://www.orbs.com/ton-access/
* `npm install vite-plugin-node-polyfills`
* `npm i @tonconnect/ui-react@2.0.0-beta.2`
    * version 2.0.0-beta.2 for
      * latest TON Space wallet support (a Telegram Wallet Extension, to be launched in Nov2023)
      * bug fixes for 3rd p[arty wallet integration]
    * A TON Connect compatible wallet
      * [Tonkeeper](https://tonkeeper.com/)
        * switch to testnet: "Settings", rapidly tap the "Version" value at the bottom of the settings, 5 quick taps should open up the Dev Menu, "Switch to Testnet", Select "TESTNET"
      * Telegram Wallet from `@wallet`, enable TON Space Beta
        * no testnet now
* `npm install @twa-dev/sdk`
* ngrok to expose local service to public
* `@botfather` /newbot for Telegram bot id
    * /mybots, Bot settings, Menu button, Edit menu button URL, enter ngrok URL


# Run
* `npm run dev`
* my local instance:
  * `@ben_test_ton_bot`
  * https://t.me/ben_test_ton_bot

# Wallet Integration
* @tonconnect/ui-react@2.0.0-beta.2 is needed for the latest Telegram Wallet and TON Space updates
* `src/main.tsx`: TonConnectUIProvider actionsConfiguration twaReturnUrl controls where to return when wallet actions finishes
* "Return strategy (optional) specifies return strategy for the deeplink when user signs/declines the request."
    * https://github.com/ton-connect/sdk/tree/main/packages/ui#add-the-return-strategy
* https://docs.ton.org/develop/dapps/ton-connect/react


# Smart Contract Integration
* change test Smart Contract address in:
    * `src/hook/BWcontract.ts`: `BwAddr`
* Smart Contract definition/interface
    * NO ABI in TON
    * https://ton-community.github.io/tutorials/02-contract/
        * "The recommended way to interact with contracts is to create a small TypeScript class that will implement the interaction interface with the contract. "
        * "Anyone who wants to access the contract from TypeScript would simply use this interface class. This is excellent for separation of responsibilities within your team. The developer of the contract can provide this class to the developer of the client to abstract away implementation details such as how messages should be encoded in the binary level."
    * https://github.com/toncenter/tonweb/tree/master/src/contract
        * "ABI and json interface of contract not yet invented in TON"
    * e.g. 
        * `src/bw_ts/bwSettle.ts`: `sendUserWithdrawal()`
        * `src/bw_ts/bwUserJettonAccount.ts`: `getJettonBalance()`
