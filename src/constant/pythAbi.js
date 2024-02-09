export const PYTH_ABI = [
  {
    inputs: [
      {
        internalType: "uint8",
        name: "index",
        type: "uint8"
      }
    ],
    name: "InvalidPrice",
    type: "error"
  },
  {
    inputs: [
      {
        internalType: "uint8",
        name: "invalidIndex",
        type: "uint8"
      }
    ],
    name: "InvalidTokenIndex",
    type: "error"
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "symbol",
        type: "string"
      }
    ],
    name: "SymbolAlreadyRegistered",
    type: "error"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "chainlinkAddress",
        type: "address"
      }
    ],
    name: "UnableToReadOraclePriceDuringRegistry",
    type: "error"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address"
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address"
      }
    ],
    name: "OwnershipTransferred",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "string",
        name: "symbol",
        type: "string"
      },
      {
        indexed: false,
        internalType: "uint8",
        name: "index",
        type: "uint8"
      }
    ],
    name: "TokenRegistered",
    type: "event"
  },
  {
    inputs: [
      {
        internalType: "uint8",
        name: "_index",
        type: "uint8"
      },
      {
        internalType: "bytes[]",
        name: "priceUpdateData",
        type: "bytes[]"
      }
    ],
    name: "getPrice",
    outputs: [
      {
        internalType: "uint256",
        name: "price",
        type: "uint256"
      },
      {
        internalType: "uint8",
        name: "decimal",
        type: "uint8"
      }
    ],
    stateMutability: "payable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_symbol",
        type: "string"
      },
      {
        internalType: "bytes32",
        name: "priceID",
        type: "bytes32"
      }
    ],
    name: "registerToken",
    outputs: [
      {
        internalType: "uint8",
        name: "index",
        type: "uint8"
      }
    ],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address"
      }
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8"
      }
    ],
    name: "chainlinkOracles",
    outputs: [
      {
        internalType: "contract AggregatorV3Interface",
        name: "",
        type: "address"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint8",
        name: "_index",
        type: "uint8"
      }
    ],
    name: "getSymbol",
    outputs: [
      {
        internalType: "string",
        name: "symbol",
        type: "string"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_symbol",
        type: "string"
      }
    ],
    name: "getTokenIndex",
    outputs: [
      {
        internalType: "uint8",
        name: "index",
        type: "uint8"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    name: "priceIDList",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8"
      }
    ],
    name: "symbols",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "tokenCount",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8"
      }
    ],
    stateMutability: "view",
    type: "function"
  }
]