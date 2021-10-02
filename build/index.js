'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var axios = require('axios');
var ethers = require('ethers');
var lodash = require('lodash');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var axios__default = /*#__PURE__*/_interopDefaultLegacy(axios);

const {
  keccak256,
  defaultAbiCoder,
  toUtf8Bytes,
  solidityPack
} = require("ethers/lib/utils");
const { ecsign } = require("ethereumjs-util");
const PERMIT_TYPEHASH = {
  token: keccak256(toUtf8Bytes("Permit(address owner,address spender,uint256 value,uint256 nonce,uint256 deadline)")),
  nft: keccak256(toUtf8Bytes("Permit(address owner,address spender,uint256 tokenId,uint256 nonce,uint256 deadline)"))
};
const sign = (digest, privateKey) => {
  return ecsign(Buffer.from(digest.slice(2), "hex"), privateKey);
};
function getPermitDigest(name, address, chainId, approve, nonce, deadline, contractType) {
  const DOMAIN_SEPARATOR = getDomainSeparator(name, address, chainId);
  return keccak256(solidityPack(["bytes1", "bytes1", "bytes32", "bytes32"], [
    "0x19",
    "0x01",
    DOMAIN_SEPARATOR,
    keccak256(defaultAbiCoder.encode(["bytes32", "address", "address", "uint256", "uint256", "uint256"], [
      PERMIT_TYPEHASH[contractType],
      approve.owner,
      approve.spender,
      approve.value || approve.tokenId,
      nonce,
      deadline
    ]))
  ]));
}
function getDomainSeparator(name, contractAddress, chainId) {
  return keccak256(defaultAbiCoder.encode(["bytes32", "bytes32", "bytes32", "uint256", "address"], [
    keccak256(toUtf8Bytes("EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)")),
    keccak256(toUtf8Bytes(name)),
    keccak256(toUtf8Bytes("1")),
    chainId,
    contractAddress
  ]));
}

const { createLogger, format, transports } = require("winston");
const logFormat = format.combine(format.timestamp(), format.printf(({ level, message, timestamp }) => {
  return `[${level}] - ${message}`;
}));
const logger = createLogger({
  level: "debug",
  format: logFormat,
  transports: [
    new transports.Console()
  ]
});

const ERROR_TYPE = {
  NOT_INITIALIZE: "SDK not initialized",
  API_KEY_NOT_AUTHENTICATED: "API Key not authenticated"
};

var CustomERC20 = {
  abi: [
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_maxSupply",
          type: "uint256"
        },
        {
          internalType: "string",
          name: "_name",
          type: "string"
        },
        {
          internalType: "string",
          name: "_symbol",
          type: "string"
        },
        {
          internalType: "address",
          name: "_owner",
          type: "address"
        },
        {
          internalType: "address",
          name: "_delegate",
          type: "address"
        }
      ],
      stateMutability: "nonpayable",
      type: "constructor"
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "owner",
          type: "address"
        },
        {
          indexed: true,
          internalType: "address",
          name: "spender",
          type: "address"
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "value",
          type: "uint256"
        }
      ],
      name: "Approval",
      type: "event"
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "from",
          type: "address"
        },
        {
          indexed: true,
          internalType: "address",
          name: "to",
          type: "address"
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "value",
          type: "uint256"
        }
      ],
      name: "Transfer",
      type: "event"
    },
    {
      inputs: [],
      name: "DOMAIN_SEPARATOR",
      outputs: [
        {
          internalType: "bytes32",
          name: "",
          type: "bytes32"
        }
      ],
      stateMutability: "view",
      type: "function",
      constant: true
    },
    {
      inputs: [],
      name: "PERMIT_TYPEHASH",
      outputs: [
        {
          internalType: "bytes32",
          name: "",
          type: "bytes32"
        }
      ],
      stateMutability: "view",
      type: "function",
      constant: true
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "owner",
          type: "address"
        },
        {
          internalType: "address",
          name: "spender",
          type: "address"
        }
      ],
      name: "allowance",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256"
        }
      ],
      stateMutability: "view",
      type: "function",
      constant: true
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "spender",
          type: "address"
        },
        {
          internalType: "uint256",
          name: "wad",
          type: "uint256"
        }
      ],
      name: "approve",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool"
        }
      ],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "guy",
          type: "address"
        }
      ],
      name: "balanceOf",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256"
        }
      ],
      stateMutability: "view",
      type: "function",
      constant: true
    },
    {
      inputs: [],
      name: "decimals",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256"
        }
      ],
      stateMutability: "view",
      type: "function",
      constant: true
    },
    {
      inputs: [],
      name: "name",
      outputs: [
        {
          internalType: "string",
          name: "",
          type: "string"
        }
      ],
      stateMutability: "view",
      type: "function",
      constant: true
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "",
          type: "address"
        }
      ],
      name: "nonces",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256"
        }
      ],
      stateMutability: "view",
      type: "function",
      constant: true
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "owner",
          type: "address"
        },
        {
          internalType: "address",
          name: "spender",
          type: "address"
        },
        {
          internalType: "uint256",
          name: "amount",
          type: "uint256"
        },
        {
          internalType: "uint256",
          name: "deadline",
          type: "uint256"
        },
        {
          internalType: "uint8",
          name: "v",
          type: "uint8"
        },
        {
          internalType: "bytes32",
          name: "r",
          type: "bytes32"
        },
        {
          internalType: "bytes32",
          name: "s",
          type: "bytes32"
        }
      ],
      name: "permit",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [],
      name: "symbol",
      outputs: [
        {
          internalType: "string",
          name: "",
          type: "string"
        }
      ],
      stateMutability: "view",
      type: "function",
      constant: true
    },
    {
      inputs: [],
      name: "totalSupply",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256"
        }
      ],
      stateMutability: "view",
      type: "function",
      constant: true
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "dst",
          type: "address"
        },
        {
          internalType: "uint256",
          name: "wad",
          type: "uint256"
        }
      ],
      name: "transfer",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool"
        }
      ],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "src",
          type: "address"
        },
        {
          internalType: "address",
          name: "dst",
          type: "address"
        },
        {
          internalType: "uint256",
          name: "wad",
          type: "uint256"
        }
      ],
      name: "transferFrom",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool"
        }
      ],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [],
      name: "version",
      outputs: [
        {
          internalType: "string",
          name: "",
          type: "string"
        }
      ],
      stateMutability: "pure",
      type: "function",
      constant: true
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "to",
          type: "address"
        },
        {
          internalType: "uint256",
          name: "mintQuantity",
          type: "uint256"
        }
      ],
      name: "mint",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_addr",
          type: "address"
        }
      ],
      name: "addDelegate",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_addr",
          type: "address"
        }
      ],
      name: "removeDelegate",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_newOwner",
          type: "address"
        }
      ],
      name: "changeOwner",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_maxSupply",
          type: "uint256"
        }
      ],
      name: "changeMaxSupply",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "from",
          type: "address"
        },
        {
          internalType: "address",
          name: "to",
          type: "address"
        },
        {
          internalType: "uint256",
          name: "amount",
          type: "uint256"
        }
      ],
      name: "transferToken",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool"
        }
      ],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_addr",
          type: "address"
        }
      ],
      name: "getDelegateStatus",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool"
        }
      ],
      stateMutability: "view",
      type: "function",
      constant: true
    },
    {
      inputs: [],
      name: "getVersion",
      outputs: [
        {
          internalType: "string",
          name: "",
          type: "string"
        }
      ],
      stateMutability: "view",
      type: "function",
      constant: true
    },
    {
      inputs: [],
      name: "getChainId",
      outputs: [
        {
          internalType: "uint256",
          name: "chain",
          type: "uint256"
        }
      ],
      stateMutability: "view",
      type: "function",
      constant: true
    }
  ]
};

var PablockToken = {
  abi: [
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_maxSupply",
          type: "uint256"
        }
      ],
      stateMutability: "nonpayable",
      type: "constructor"
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "owner",
          type: "address"
        },
        {
          indexed: true,
          internalType: "address",
          name: "spender",
          type: "address"
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "value",
          type: "uint256"
        }
      ],
      name: "Approval",
      type: "event"
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "from",
          type: "address"
        },
        {
          indexed: true,
          internalType: "address",
          name: "to",
          type: "address"
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "value",
          type: "uint256"
        }
      ],
      name: "Transfer",
      type: "event"
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "owner",
          type: "address"
        },
        {
          internalType: "address",
          name: "spender",
          type: "address"
        }
      ],
      name: "allowance",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256"
        }
      ],
      stateMutability: "view",
      type: "function",
      constant: true
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "spender",
          type: "address"
        },
        {
          internalType: "uint256",
          name: "amount",
          type: "uint256"
        }
      ],
      name: "approve",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool"
        }
      ],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "account",
          type: "address"
        }
      ],
      name: "balanceOf",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256"
        }
      ],
      stateMutability: "view",
      type: "function",
      constant: true
    },
    {
      inputs: [],
      name: "decimals",
      outputs: [
        {
          internalType: "uint8",
          name: "",
          type: "uint8"
        }
      ],
      stateMutability: "view",
      type: "function",
      constant: true
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "spender",
          type: "address"
        },
        {
          internalType: "uint256",
          name: "subtractedValue",
          type: "uint256"
        }
      ],
      name: "decreaseAllowance",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool"
        }
      ],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "spender",
          type: "address"
        },
        {
          internalType: "uint256",
          name: "addedValue",
          type: "uint256"
        }
      ],
      name: "increaseAllowance",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool"
        }
      ],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [],
      name: "name",
      outputs: [
        {
          internalType: "string",
          name: "",
          type: "string"
        }
      ],
      stateMutability: "view",
      type: "function",
      constant: true
    },
    {
      inputs: [],
      name: "totalSupply",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256"
        }
      ],
      stateMutability: "view",
      type: "function",
      constant: true
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "recipient",
          type: "address"
        },
        {
          internalType: "uint256",
          name: "amount",
          type: "uint256"
        }
      ],
      name: "transfer",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool"
        }
      ],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "sender",
          type: "address"
        },
        {
          internalType: "address",
          name: "recipient",
          type: "address"
        },
        {
          internalType: "uint256",
          name: "amount",
          type: "uint256"
        }
      ],
      name: "transferFrom",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool"
        }
      ],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "to",
          type: "address"
        },
        {
          internalType: "uint256",
          name: "mintQuantity",
          type: "uint256"
        }
      ],
      name: "requestToken",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_contract",
          type: "address"
        }
      ],
      name: "addContractToWhitelist",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_contract",
          type: "address"
        }
      ],
      name: "removeContractFromWhitelist",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_newOwner",
          type: "address"
        }
      ],
      name: "changeOwner",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_maxSupply",
          type: "uint256"
        }
      ],
      name: "changeMaxSupply",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [],
      name: "unlimitedApprove",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "amount",
          type: "uint256"
        },
        {
          internalType: "address",
          name: "addr",
          type: "address"
        }
      ],
      name: "receiveAndBurn",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool"
        }
      ],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_contract",
          type: "address"
        }
      ],
      name: "getContractStatus",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool"
        }
      ],
      stateMutability: "view",
      type: "function",
      constant: true
    },
    {
      inputs: [],
      name: "getVersion",
      outputs: [
        {
          internalType: "string",
          name: "",
          type: "string"
        }
      ],
      stateMutability: "view",
      type: "function",
      constant: true
    }
  ]
};

var PablockNFT = {
  abi: [
    {
      inputs: [
        {
          internalType: "string",
          name: "_tokenName",
          type: "string"
        },
        {
          internalType: "string",
          name: "_tokenSymbol",
          type: "string"
        },
        {
          internalType: "address",
          name: "_contractAddr",
          type: "address"
        }
      ],
      stateMutability: "nonpayable",
      type: "constructor"
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "owner",
          type: "address"
        },
        {
          indexed: true,
          internalType: "address",
          name: "approved",
          type: "address"
        },
        {
          indexed: true,
          internalType: "uint256",
          name: "tokenId",
          type: "uint256"
        }
      ],
      name: "Approval",
      type: "event"
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "owner",
          type: "address"
        },
        {
          indexed: true,
          internalType: "address",
          name: "operator",
          type: "address"
        },
        {
          indexed: false,
          internalType: "bool",
          name: "approved",
          type: "bool"
        }
      ],
      name: "ApprovalForAll",
      type: "event"
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "from",
          type: "address"
        },
        {
          indexed: true,
          internalType: "string",
          name: "uri",
          type: "string"
        },
        {
          indexed: false,
          internalType: "uint256[]",
          name: "indexes",
          type: "uint256[]"
        }
      ],
      name: "TokenGeneration",
      type: "event"
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "from",
          type: "address"
        },
        {
          indexed: true,
          internalType: "address",
          name: "to",
          type: "address"
        },
        {
          indexed: true,
          internalType: "uint256",
          name: "tokenId",
          type: "uint256"
        }
      ],
      name: "Transfer",
      type: "event"
    },
    {
      inputs: [],
      name: "DOMAIN_SEPARATOR",
      outputs: [
        {
          internalType: "bytes32",
          name: "",
          type: "bytes32"
        }
      ],
      stateMutability: "view",
      type: "function",
      constant: true
    },
    {
      inputs: [],
      name: "PERMIT_TYPEHASH",
      outputs: [
        {
          internalType: "bytes32",
          name: "",
          type: "bytes32"
        }
      ],
      stateMutability: "view",
      type: "function",
      constant: true
    },
    {
      inputs: [],
      name: "TRANSFER_TYPEHASH",
      outputs: [
        {
          internalType: "bytes32",
          name: "",
          type: "bytes32"
        }
      ],
      stateMutability: "view",
      type: "function",
      constant: true
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "to",
          type: "address"
        },
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256"
        }
      ],
      name: "approve",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "owner",
          type: "address"
        }
      ],
      name: "balanceOf",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256"
        }
      ],
      stateMutability: "view",
      type: "function",
      constant: true
    },
    {
      inputs: [],
      name: "baseURI",
      outputs: [
        {
          internalType: "string",
          name: "",
          type: "string"
        }
      ],
      stateMutability: "view",
      type: "function",
      constant: true
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256"
        }
      ],
      name: "getApproved",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address"
        }
      ],
      stateMutability: "view",
      type: "function",
      constant: true
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "owner",
          type: "address"
        },
        {
          internalType: "address",
          name: "operator",
          type: "address"
        }
      ],
      name: "isApprovedForAll",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool"
        }
      ],
      stateMutability: "view",
      type: "function",
      constant: true
    },
    {
      inputs: [],
      name: "name",
      outputs: [
        {
          internalType: "string",
          name: "",
          type: "string"
        }
      ],
      stateMutability: "view",
      type: "function",
      constant: true
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256"
        }
      ],
      name: "ownerOf",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address"
        }
      ],
      stateMutability: "view",
      type: "function",
      constant: true
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "from",
          type: "address"
        },
        {
          internalType: "address",
          name: "to",
          type: "address"
        },
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256"
        }
      ],
      name: "safeTransferFrom",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "from",
          type: "address"
        },
        {
          internalType: "address",
          name: "to",
          type: "address"
        },
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256"
        },
        {
          internalType: "bytes",
          name: "_data",
          type: "bytes"
        }
      ],
      name: "safeTransferFrom",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "operator",
          type: "address"
        },
        {
          internalType: "bool",
          name: "approved",
          type: "bool"
        }
      ],
      name: "setApprovalForAll",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "bytes4",
          name: "interfaceId",
          type: "bytes4"
        }
      ],
      name: "supportsInterface",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool"
        }
      ],
      stateMutability: "view",
      type: "function",
      constant: true
    },
    {
      inputs: [],
      name: "symbol",
      outputs: [
        {
          internalType: "string",
          name: "",
          type: "string"
        }
      ],
      stateMutability: "view",
      type: "function",
      constant: true
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "index",
          type: "uint256"
        }
      ],
      name: "tokenByIndex",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256"
        }
      ],
      stateMutability: "view",
      type: "function",
      constant: true
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "owner",
          type: "address"
        },
        {
          internalType: "uint256",
          name: "index",
          type: "uint256"
        }
      ],
      name: "tokenOfOwnerByIndex",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256"
        }
      ],
      stateMutability: "view",
      type: "function",
      constant: true
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256"
        }
      ],
      name: "tokenURI",
      outputs: [
        {
          internalType: "string",
          name: "",
          type: "string"
        }
      ],
      stateMutability: "view",
      type: "function",
      constant: true
    },
    {
      inputs: [],
      name: "totalSupply",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256"
        }
      ],
      stateMutability: "view",
      type: "function",
      constant: true
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "contractAddr",
          type: "address"
        }
      ],
      name: "initialize",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "to",
          type: "address"
        },
        {
          internalType: "uint256",
          name: "quantity",
          type: "uint256"
        },
        {
          internalType: "string",
          name: "_uri",
          type: "string"
        }
      ],
      name: "generateToken",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "from",
          type: "address"
        },
        {
          internalType: "address",
          name: "to",
          type: "address"
        },
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256"
        }
      ],
      name: "transferFrom",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "owner",
          type: "address"
        },
        {
          internalType: "address",
          name: "spender",
          type: "address"
        },
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256"
        },
        {
          internalType: "uint256",
          name: "deadline",
          type: "uint256"
        },
        {
          internalType: "uint8",
          name: "v",
          type: "uint8"
        },
        {
          internalType: "bytes32",
          name: "r",
          type: "bytes32"
        },
        {
          internalType: "bytes32",
          name: "s",
          type: "bytes32"
        }
      ],
      name: "requestPermit",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [],
      name: "getVersion",
      outputs: [
        {
          internalType: "string",
          name: "",
          type: "string"
        }
      ],
      stateMutability: "view",
      type: "function",
      constant: true
    },
    {
      inputs: [],
      name: "getPablockTokenAddress",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address"
        }
      ],
      stateMutability: "view",
      type: "function",
      constant: true
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "addr",
          type: "address"
        }
      ],
      name: "getNonces",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256"
        }
      ],
      stateMutability: "view",
      type: "function",
      constant: true
    },
    {
      inputs: [],
      name: "getChainId",
      outputs: [
        {
          internalType: "uint256",
          name: "chain",
          type: "uint256"
        }
      ],
      stateMutability: "view",
      type: "function",
      constant: true
    }
  ]
};

var config = {
  ENDPOINT_LOCAL: "http://127.0.0.1:8082",
  ENDPOINT_MUMBAI: "http://127.0.0.1:8082",
  ENDPOINT_POLYGON: "http://127.0.0.1:8082",
  RPC_PROVIDER_LOCAL: "http://127.0.0.1:7545",
  RPC_PROVIDER_MUMBAI: "https://polygon-mumbai.infura.io/v3/98084ec8ac4d49e181f0ffc83562f6f6",
  PABLOCK_TOKEN_ADDRESS_LOCAL: "0x345B60e0D77b17AF10BF099778BE466D030E18df",
  PABLOCK_NFT_ADDRESS_LOCAL: "0x1C25F7507C09B9616e13343Fc5E5C1ba9082323A",
  PABLOCK_NOTARIZATION_ADDRESS_LOCAL: "0xFDd1a4f58fF4c725e585DD5dD443F56c642Ee1a4",
  PABLOCK_TOKEN_ADDRESS_MUMBAI: "0x9D0d991c90112C2805F250cD7B5D399c5e834088",
  PABLOCK_ADDRESS_LOCAL: "0xfc8CFa30350f7B195f2b5c6F350f76720bfD89f4"
};

class PablockSDK {
  constructor(sdkOptions) {
    if (!sdkOptions.config?.debugMode) {
      logger.transports[0].silent = true;
    }
    this.env = sdkOptions.config?.env || "MUMBAI";
    logger.info(`Working environment: ${this.env}`);
    if (sdkOptions.apiKey) {
      this.apiKey = sdkOptions.apiKey;
    } else {
      console.error("[Error] API key is required, please insert one!");
      process.exit(1);
    }
    this.provider = new ethers.ethers.providers.JsonRpcProvider(config[`RPC_PROVIDER_${this.env}`]);
    if (sdkOptions.privateKey) {
      this.wallet = new ethers.ethers.Wallet(sdkOptions.privateKey);
    } else {
      this.wallet = ethers.ethers.Wallet.createRandom();
    }
    logger.info("Finished initialization");
  }
  async init() {
    try {
      let { status, data } = await axios__default['default'].get(`${config[`ENDPOINT_${this.env}`]}/generateJWT/${this.apiKey}/${this.wallet.address}`);
      if (status === 200) {
        this.authToken = data.authToken;
      } else {
        throw ERROR_TYPE.API_KEY_NOT_AUTHENTICATED;
      }
    } catch (error) {
      logger.info("[Error] ", error);
      throw ERROR_TYPE.API_KEY_NOT_AUTHENTICATED;
    }
  }
  getAuthToken() {
    logger.info(`Your auth token is: ${this.authToken}`);
    if (this.authToken) {
      return this.authToken;
    } else {
      console.error("[Error] run sdk.init() if you don't already do that, otherwise check if your API key is correct");
      return null;
    }
  }
  getApiKey() {
    logger.info(`Your API key is: ${this.apiKey}`);
    return this.apiKey;
  }
  getWalletAddress() {
    return this.wallet.address;
  }
  async getPablockTokenBalance(address = this.wallet.address) {
    const pablockToken = new ethers.ethers.Contract(config[`PABLOCK_TOKEN_ADDRESS_${this.env}`], PablockToken.abi, this.provider);
    const balance = parseInt((await pablockToken.balanceOf(address)).toString());
    logger.info(`User has ${balance} PTK`);
    return balance;
  }
  async getMaticBalance(address = this.wallet.address) {
    const balance = parseInt((await this.provider.getBalance(address)).toString());
    logger.info(`User has ${balance} MATIC`);
    return balance;
  }
  async sendPermit(contractAddress, spender, value, deadline, abi = CustomERC20.abi) {
    const contract = new ethers.ethers.Contract(contractAddress, abi, this.provider);
    const approve = {
      owner: this.wallet.address,
      spender,
      value
    };
    const nonce = parseInt((await contract.nonces(approve.owner)).toString());
    const digest = getPermitDigest(await contract.name(), contract.address, parseInt(await contract.getChainId()), approve, nonce, deadline, "token");
    const { v, r, s } = sign(digest, Buffer.from(this.wallet.privateKey.substring(2), "hex"));
    const tx = await contract.populateTransaction.permit(approve.owner, approve.spender, approve.value, deadline, v, r, s);
    let { status, data } = await axios__default['default'].post("http://127.0.0.1:8082/sendPermit", { tx, contractAddress, address: this.wallet?.address }, {
      headers: {
        Authorization: `Bearer ${this.authToken}`
      }
    });
    return data;
  }
  async requestToken(amount, contractAddress) {
    logger.info(`Request ${amount} token from ${this.wallet.address}`);
    let { status, data } = await axios__default['default'].post(`${config[`ENDPOINT_${this.env}`]}/mintToken`, { contractAddress, to: this.wallet.address, amount }, {
      headers: {
        Authorization: `Bearer ${this.authToken}`
      }
    });
    logger.info(`Request token status: ${status}`);
    return data;
  }
  async mintNFT(amount, uri, contractAddress = config[`PABLOCK_NFT_ADDRESS_${this.env}`], webhookUrl) {
    let { status, data } = await axios__default['default'].post(`${config[`ENDPOINT_${this.env}`]}/mintNFT`, { to: this.wallet.address, amount, uri, contractAddress, webhookUrl }, {
      headers: {
        Authorization: `Bearer ${this.authToken}`
      }
    });
    logger.info(status, data);
    return data;
  }
  async sendNFT(to, tokenId, deadline, contractAddress = config[`PABLOCK_NFT_ADDRESS_${this.env}`]) {
    try {
      const customERC721 = new ethers.ethers.Contract(contractAddress, PablockNFT.abi, this.provider);
      const approve = {
        owner: this.wallet.address,
        spender: config[`PABLOCK_ADDRESS_${this.env}`],
        tokenId
      };
      const nonce = parseInt((await customERC721.getNonces(approve.owner)).toString());
      const digest = getPermitDigest(await customERC721.name(), customERC721.address, parseInt(await customERC721.getChainId()), approve, nonce, deadline, "nft");
      const { v, r, s } = sign(digest, Buffer.from(this.wallet.privateKey.substring(2), "hex"));
      const tx = await customERC721.populateTransaction.requestPermit(approve.owner, approve.spender, approve.tokenId, deadline, v, r, s);
      let { status, data } = await axios__default['default'].post("http://127.0.0.1:8082/transferNFT", { tx, to, tokenId, contractAddress }, {
        headers: {
          Authorization: `Bearer ${this.authToken}`
        }
      });
      return data;
    } catch (err) {
      logger.error(`NFTTransfer error: ${err} `);
      return null;
    }
  }
  async executeNotarization() {
    try {
      const data = await this.sendPermit(config[`PABLOCK_TOKEN_ADDRESS_${this.env}`], config[`PABLOCK_ADDRESS_${this.env}`], 1, 1657121546e3, PablockToken.abi);
      logger.info("Execute transaction: ", data);
      return data;
    } catch (err) {
      logger.error(`Notarization error: ${err} `);
      return null;
    }
  }
  async getOwnedNFT(contractAddresses, ownerAddress = this.wallet.address) {
    let tokenOfOwner = {};
    for (const addr of contractAddresses) {
      let contract = new ethers.ethers.Contract(addr, PablockNFT.abi, this.wallet.connect(this.provider));
      let balance = await contract.balanceOf(ownerAddress);
      logger.info(`User has ${balance} NFTs in ${addr} contract`);
      let tokenIds = [];
      for (const i of lodash.range(balance)) {
        const tokenId = await contract.tokenOfOwnerByIndex(ownerAddress, i);
        logger.info(`Token: ${await contract.baseURI()}`);
        tokenIds.push({
          tokenId: tokenId.toString(),
          tokenURI: await contract.tokenURI(tokenId.toString())
        });
      }
      tokenOfOwner[addr] = tokenIds;
    }
    return tokenOfOwner;
  }
  async checkJWTValidity() {
    let { status, data } = await axios__default['default'].get(`${config[`ENDPOINT_${this.env}`]}/checkJWT`, {
      headers: {
        Authorization: `Bearer ${this.authToken}`
      }
    });
    logger.info(status, data);
    return data;
  }
  async getAPIVersion() {
    let { data } = await axios__default['default'].get(`${config[`ENDPOINT_${this.env}`]}/getVersion`);
    return data;
  }
}

exports.PablockSDK = PablockSDK;
//# sourceMappingURL=index.js.map
