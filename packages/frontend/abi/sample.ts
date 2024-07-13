export default [
  {
    inputs: [
      {
        internalType: "string",
        name: "repo",
        type: "string",
      },
      {
        internalType: "address",
        name: "contributor",
        type: "address",
      },
    ],
    name: "contributeToProject",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "contributor",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "maintainer",
        type: "address",
      },
    ],
    name: "ContributionReceived",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "string",
        name: "repo",
        type: "string",
      },
      {
        indexed: false,
        internalType: "address",
        name: "maintainer",
        type: "address",
      },
    ],
    name: "GithubRepoAdded",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "repo",
        type: "string",
      },
      {
        internalType: "address",
        name: "maintainer",
        type: "address",
      },
    ],
    name: "liquidateProject",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "repo",
        type: "string",
      },
      {
        internalType: "address",
        name: "maintainer",
        type: "address",
      },
    ],
    name: "registerProject",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    stateMutability: "payable",
    type: "fallback",
  },
  {
    stateMutability: "payable",
    type: "receive",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    name: "contribution",
    outputs: [
      {
        internalType: "address",
        name: "contributor",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "total_contributions",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "level",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "repo",
        type: "string",
      },
    ],
    name: "getProjectMaintainer",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    name: "github_repo",
    outputs: [
      {
        internalType: "address payable",
        name: "maintainer",
        type: "address",
      },
      {
        internalType: "bool",
        name: "registered",
        type: "bool",
      },
      {
        internalType: "string",
        name: "github_repo",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "stored_value",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    name: "tasks",
    outputs: [
      {
        internalType: "string",
        name: "milestone",
        type: "string",
      },
      {
        internalType: "string",
        name: "sticker_id",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;
