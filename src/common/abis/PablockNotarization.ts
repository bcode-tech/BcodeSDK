export default {
  abi: [
    {
      inputs: [
        {
          internalType: "address",
          name: "_pablockToken",
          type: "address",
        },
      ],
      stateMutability: "nonpayable",
      type: "constructor",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "bytes32",
          name: "hash",
          type: "bytes32",
        },
        {
          indexed: false,
          internalType: "string",
          name: "uri",
          type: "string",
        },
      ],
      name: "Notarize",
      type: "event",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "contractAddr",
          type: "address",
        },
      ],
      name: "initialize",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "bytes32",
          name: "hash",
          type: "bytes32",
        },
        {
          internalType: "string",
          name: "uri",
          type: "string",
        },
      ],
      name: "notarize",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
  ],
};
