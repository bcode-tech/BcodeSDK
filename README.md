# Pablock SDK

Pablock SDK is a set of tool to help developer interact with Pablock API.

Written in Typescript and tested with Jest

## Installation

From source code:

```
npm install git+https://github.com/bcode-tech/pablock-sdk.git
```

From npm:

```
npm install --save pablock-sdk
```

## Usage

First you need to call the constructor, if you want to generate a new Wallet every time you can implemented like this:

```
const { PablockSDK } = require("pablock-sdk")

(async () => {

    const sdk = new PablockSDK({
        apiKey: <your-api-key>,
        config: { env: <environment>, debugMode: true },
    });

    await sdk.init()
})
```

Otherwise if you already have a private key that you want to use you can use:

```
const { PablockSDK } = require("pablock-sdk")

(async () => {

    const sdk = new PablockSDK({
        apiKey: <your-api-key>,
        privateKey: <private-key>,
        config: { env: <environment>, debugMode: true },
    });

    await sdk.init()
})
```

Constructor config object parameters:

| Param     | Default value | Options                |
| --------- | ------------- | ---------------------- |
| env       | MUMBAI        | LOCAL, MUMBAI, POLYGON |
| debugMode | false         | true, false            |

### Test

For running test you need to create privateKeys.json, with an array of at least 3 privateKeys to submit to test script.

## Functions

- [init()](#createtext-options)
- [getAuthToken()](#tocanvascanvaselement-text-options-cberror)
- [getApiKey()](#todataurltext-options-cberror-url)
- [getWalletAddress()](#tostringtext-options-cberror-string)
- [getPablockTokenBalance()](#tostringtext-options-cberror-string)
- [getMaticBalance()](#tostringtext-options-cberror-string)
- [sendPermit()](#tostringtext-options-cberror-string)
- [requestToken()](#tostringtext-options-cberror-string)
- [mintNFT()](#tostringtext-options-cberror-string)
- [sendNFT()](#tostringtext-options-cberror-string)
- [getOwnedNFT()](#tostringtext-options-cberror-string)
- [checkJWTValidity()](#tostringtext-options-cberror-string)
- [getAPIVersion()](#tostringtext-options-cberror-string)

#### `init()`

Initilize user wallet and configure

---

#### `getAuthToken()`

Returns authToken received from Pablock API to authenticate call, it depends on API Key used.

---

#### `getAPIKey()`

Returns apiKey used in contructor, just for reference.

---

#### `getWalletAddress(address)`

Returns address for generated wallet.

#### `getPablockTokenBalance(address)`

Return Pablock Token (PTK) balance of current wallet or the specified address.

### Params

| Param   | Default value |
| ------- | ------------- |
| address | user address  |

---

#### `getMaticBalance()`

Return MATIC balance of the current wallet or the specidfied address.

### Params

| Param   | Default value |
| ------- | ------------- |
| address | user address  |

---

#### `sendPermit(contractAddress, spender, value, deadline)`

Function that allow to send a permit request to Pablock API service to set the allowance for future token transfer. Enable a mechanism of Gasless transaction through Pablock service.

| Param           | Descriptioon                                                |
| --------------- | ----------------------------------------------------------- |
| contractAddress | Address of ERC20 token, with integrated Pablock Logic in it |
| spender         | Address of spender wallet, typically Pablock Wallet address |
| value           | Amount of token to set allowance                            |
| deadline        | Deadline of the allowance permission                        |

---

#### `requestToken(amount, contractAddress)`

Function for request minting of CustomERC20 token.

| Param           | Descriptioon                          |
| --------------- | ------------------------------------- |
| amount          | Token quantity to mint                |
| contractAddress | Address of CustomERC20 token contract |

---

#### `mintNFT(amount, uri, contractAddress, webhookUrl)`

Function for request mint of an NFT.

| Param          | Default value        | Description                                         |
| -------------- | -------------------- | --------------------------------------------------- |
| amount         | none                 | Amount of NFT to mint                               |
| uri            | none                 | URI of NFT resources                                |
| contractAddres | Pablock NFT Contract | Address of CustomNFT contract                       |
| webhookUrl     | null                 | URL of webhook endpoint on which receive a response |

---

#### `sendNFT(to, tokenId, deadline, contractAddress)`

Function for send NFT. It has a built-in permit request to allow Pablock to transfer NFT for user wallet.

| Param           | Default value        | Description                   |
| --------------- | -------------------- | ----------------------------- |
| to              | none                 | Receiver of NFT               |
| tokenId         | none                 | TokenID of NFT to transfer    |
| contractAddress | Pablock NFT Contract | Address of CustomNFT contract |

---

#### `getOwnedNFT(contractAddresses, ownerAddress)`

Function that returns all NFT for the passes contract addresses for the given owner address.

| Param             | Default value                   | Description                            |
| ----------------- | ------------------------------- | -------------------------------------- |
| contractAddresses | Array with Pablock NFT Contract | Array of interested contract addresses |
| ownerAddress      | Current user address            | Wallet address of NFT owner            |

---

#### `checkJWTValidity()`

Function that check if fetched JWT is still valid

---

#### `getAPIVersion()`

Returns Pablock API service version, just to check if the service is available

Made with ❤️ by BCode
