# Bcode SDK

Bcode SDK is a set of tool to help developer interact with Bcode API.

Written in Typescript and tested with Jest

## Installation

From source code:

```
npm install git+https://github.com/bcode-tech/bcode-sdk.git
```

From npm:

```
npm install --save @bcode-tech/bcode-sdk
```

## Usage

First you need to call the constructor, if you want to generate a new Wallet every time you can implemented like this:

```
const { BcodeSDK } = require("@bcode-tech/bcode-sdk")

(async () => {

    const sdk = new BcodeSDK({
        apiKey: <your-api-key>,
        config: { env: <environment>, debugMode: true },
    });

    await sdk.init()
})()
```

Otherwise if you already have a private key that you want to use you can use:

```
const { BcodeSDK } = require("@bcode-tech/bcode-sdk")

(async () => {

    const sdk = new BcodeSDK({
        apiKey: <your-api-key>,
        privateKey: <private-key>,
        config: { env: <environment>, debugMode: true },
    });

    await sdk.init()
})()
```

It's possible to change private key later:

```
const { BcodeSDK } = require("@bcode-tech/bcode-sdk")

(async () => {

    const sdk = new BcodeSDK({
        apiKey: <your-api-key>,
        privateKey: <private-key>,
        config: { env: <environment>, debugMode: true },
    });

    await sdk.init()

    sdk.setPrivateKey("private_key")
})()
```

Constructor config object parameters:

| Param     | Default value | Options         |
| --------- | ------------- | --------------- |
| env       | MUMBAI        | MUMBAI, POLYGON |
| debugMode | false         | true, false     |

## Test

For running test you need to create privateKeys.json, with an array of at least 3 privateKeys to submit to test script.

## Functions

- [init()](#init)
- [setPrivateKey()](#setPrivateKey)
- [setMnemonicPhrase()](#setMnemonicPhrase)
- [resetWallet()](#resetWallet)
- [regenerateWallet()](#regenerateWallet)
- [getAuthToken()](#getAuthToken)
- [getApiKey()](#getApiKey)
- [getWalletAddress()](#getWalletAddress)
- [getBcodeTokenBalance()](#getBcodeTokenBalance)
- [getMaticBalance()](#getMaticBalance)
- [requestToken()](#requestToken)
- [prepareTransaction()](#prepareTransaction)
- [executeTransaction()](#executeTransaction)
- [executeAsyncTransaction()](#executeAsyncTransaction)
- [notarizeHash()](#notarizeHash)
- [checkBundleNotarization()](#checkBundleNotarization)
- [mintBcodeNFT()](#mintBcodeNFT)
- [sendBcodeNFT()](#sendBcodeNFT)
- [getOwnedNFT()](#getOwnedNFT)
- [checkJWTValidity()](#checkJWTValidity)
- [getAPIVersion()](#getAPIVersion)

### [init()](#init)

Initilize user wallet and configure

---

### [setPrivateKey()](#setPrivateKey)

Set private key after creation, to enable auth logic

#### Params

| Param      | Default value      |
| ---------- | ------------------ |
| privateKey | Wallet private key |

---

### [setMnemonicPhrase()](#setMnemonicPhrase)

Set mnemonic phrase after creation, to enable auth logic

#### Params

| Param    | Default value          |
| -------- | ---------------------- |
| mnemonic | Wallet mnemonic phrase |

---

### [resetWallet()](#resetWallet)

Reset wallet to null and delete private key

---

### [regenerateWallet()](#regenerateWallet)

Generate new wallet after creation or after deleting previous one

---

### [getAuthToken()](#getAuthToken)

Returns authToken received from Bcode API to authenticate call, it depends on API Key used.

---

### [getAPIKey()](#getAPIKey)

Returns apiKey used in contructor, just for reference.

---

### [getWalletAddress(address)](#getWalletAddress)

Returns address for generated wallet.

### [getBcodeTokenBalance(address)](#getBcodeTokenBalance)

Return Bcode Token (PTK) balance of current wallet or the specified address.

#### Params

| Param   | Default value |
| ------- | ------------- |
| address | user address  |

---

### [getMaticBalance()](#getMaticBalance)

Return MATIC balance of the current wallet or the specidfied address.

#### Params

| Param   | Default value |
| ------- | ------------- |
| address | user address  |

---

### [requestToken(amount, contractAddress)](#requestToken)

Function for request minting of CustomERC20 token.

| Param           | Descriptioon                          |
| --------------- | ------------------------------------- |
| amount          | Token quantity to mint                |
| contractAddress | Address of CustomERC20 token contract |

---

### [prepareTransaction(contractObj, functionName, params)](#prepareTransaction)

Prepare transaction that need to be executed through meta transaction.

| Param        | Default value                 | Description                                   |
| ------------ | ----------------------------- | --------------------------------------------- |
| contractObj  | Array with Bcode NFT Contract | Array of interested contract addresses        |
| functionName | Current user address          | Wallet address of NFT owner                   |
| params       | Array                         | Array of original prams for contract function |

Example:

```js
const tx = await sdk.prepareTransaction(
  {
    address: config[`TEST_META_TX_${env}`],
    abi: testMetaTxAbi,
    name: "TestMetaTransaction",
    version: "0.0.1",
  },
  "increment",
  []
));
```

---

### [executeTransaction(tx, optionals)](#executeTransaction)

Prepare transaction that need to be executed through meta transaction.

| Param     | Description                                 |
| --------- | ------------------------------------------- |
| tx        | Array of interested contract addresses      |
| optionals | Object with webhookUrl, secret and metadata |

Example:

```js
type MetaTransaction = {
  contractAddress: string;
  userAddress: string;
  functionSignature: string;
  r: string;
  s: string;
  v: any;
};

type Optionals = {
  webhookUrl: string | null;
  metadata: { [key: string]: any } | null;
  secret: string | null;
};

async executeTransaction(tx: MetaTransaction, optionals: Optionals | null)
```

---

### [executeAsyncTransaction(tx, optionals)](#executeAsyncTransaction)

Prepare transaction that need to be executed through meta transaction in async mode. API return a requestId
needed to refetch transaction status later.

| Param     | Description                                 |
| --------- | ------------------------------------------- |
| tx        | Array of interested contract addresses      |
| optionals | Object with webhookUrl, secret and metadata |

Example:

```js
type MetaTransaction = {
  contractAddress: string;
  userAddress: string;
  functionSignature: string;
  r: string;
  s: string;
  v: any;
};

type Optionals = {
  webhookUrl: string | null;
  metadata: { [key: string]: any } | null;
  secret: string | null;
};

async executeAsyncTransaction(tx: MetaTransaction, optionals: Optionals | null)
```

---

### [notarizeHash(hash, optionals)](#executeAsyncTransaction)

Request meta transaction notarization, return notarization receipt.

| Param     | Description                                 |
| --------- | ------------------------------------------- |
| hash      | Hash of document to notarize                |
| optionals | Object with webhookUrl, secret and metadata |

Example:

```js
type Optionals = {
  webhookUrl: string | null;
  metadata: { [key: string]: any } | null;
  secret: string | null;
};

async notarizeHash(hash: string, optionals: Optionals | null)
```

### [mintPablockNFT(amount, uri, contractAddress, webhookUrl)](#mintPablockNFT)

Function for request mint of an NFT.

| Param          | Default value      | Description                                         |
| -------------- | ------------------ | --------------------------------------------------- |
| amount         | none               | Amount of NFT to mint                               |
| uri            | none               | URI of NFT resources                                |
| contractAddres | Bcode NFT Contract | Address of CustomNFT contract                       |
| webhookUrl     | null               | URL of webhook endpoint on which receive a response |

---

### [sendBcodeNFT(to, tokenId, deadline, contractAddress)](#sendBcodeNFT)

Function for send NFT. It has a built-in permit request to allow Bcode to transfer NFT for user wallet.

| Param           | Default value      | Description                   |
| --------------- | ------------------ | ----------------------------- |
| to              | none               | Receiver of NFT               |
| tokenId         | none               | TokenID of NFT to transfer    |
| contractAddress | Bcode NFT Contract | Address of CustomNFT contract |

---

### [getOwnedNFT(contractAddresses, ownerAddress)](#getOwnedNFT)

Function that returns all NFT for the passes contract addresses for the given owner address.

| Param             | Default value                 | Description                            |
| ----------------- | ----------------------------- | -------------------------------------- |
| contractAddresses | Array with Bcode NFT Contract | Array of interested contract addresses |
| ownerAddress      | Current user address          | Wallet address of NFT owner            |

---

### [checkJWTValidity()](#checkJWTValidity)

Function that check if fetched JWT is still valid

---

### [getAPIVersion()](#getAPIVersion)

Returns Bcode API service version, just to check if the service is available

## Utility

Inside the PablockSDK we had embed a set of tools to handle critic logic easily.

### Hash

Hash allow the devloper to generate PablockAPI compatible hash with SHA256 algorithm.

```js
import { Hash } from "pablock-sdk";

const hash = Hash.fromString("try-me");

const imageHash = Hash.fromBuffer(Buffer.from("try-me"));
```

### QRCode

PablockSDK has integrate [QRCode](https://github.com/soldair/node-qrcode) library, to easy generate QRCode of string.

```js
import { QRCode } from "pablock-sdk";

QRCode.fromString("try-me").print();

QRCode.fromString("try-me").buffer();
```

Made with ❤️ by BCode
