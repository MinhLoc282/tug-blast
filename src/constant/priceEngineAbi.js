export const PRICE_ENGINE_ABI = [
    {
      inputs: [
        {
          internalType: "address",
          name: "tugStorageAddress",
          type: "address"
        }
      ],
      stateMutability: "nonpayable",
      type: "constructor"
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "startTime",
          type: "uint256"
        },
        {
          internalType: "uint256",
          name: "endTime",
          type: "uint256"
        },
        {
          internalType: "uint256",
          name: "currentTime",
          type: "uint256"
        }
      ],
      name: "IllegalTimeWindow",
      type: "error"
    },
    {
      inputs: [
        {
          internalType: "uint8",
          name: "sideRequested",
          type: "uint8"
        }
      ],
      name: "InvalidTugSide",
      type: "error"
    },
    {
      inputs: [
        {
          internalType: "uint8",
          name: "tokenIndex",
          type: "uint8"
        }
      ],
      name: "UnableToFetchPrice",
      type: "error"
    },
    {
      inputs: [],
      name: "getSharePriceDecimal",
      outputs: [
        {
          internalType: "uint8",
          name: "decimals",
          type: "uint8"
        }
      ],
      stateMutability: "pure",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_startTime",
          type: "uint256"
        },
        {
          internalType: "uint256",
          name: "_endTime",
          type: "uint256"
        },
        {
          internalType: "uint256",
          name: "_purchaseTime",
          type: "uint256"
        },
        {
          internalType: "uint256",
          name: "_token0StartPrice",
          type: "uint256"
        },
        {
          internalType: "uint256",
          name: "_token1StartPrice",
          type: "uint256"
        },
        {
          internalType: "uint8",
          name: "_token0Index",
          type: "uint8"
        },
        {
          internalType: "uint8",
          name: "_token1Index",
          type: "uint8"
        },
        {
          internalType: "uint8",
          name: "_buyDirection",
          type: "uint8"
        },
        {
          internalType: "uint256",
          name: "token0Price",
          type: "uint256"
        },
        {
          internalType: "uint256",
          name: "token1Price",
          type: "uint256"
        }
      ],
      name: "getUsdPerShare",
      outputs: [
        {
          internalType: "uint256",
          name: "price",
          type: "uint256"
        }
      ],
      stateMutability: "pure",
      type: "function"
    },
    {
      inputs: [],
      name: "tugStorage",
      outputs: [
        {
          internalType: "contract TugStorageInterface",
          name: "",
          type: "address"
        }
      ],
      stateMutability: "view",
      type: "function"
    }
  ]