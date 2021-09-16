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

## Functions

Made with ❤️ by BCode
