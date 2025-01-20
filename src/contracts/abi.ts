export const contractAbi = [
  // This will be replaced with the actual contract ABI
  {
    "inputs": [],
    "name": "getAllBets",
    "outputs": [{"type": "tuple[]"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"type": "string", "name": "title"},
      {"type": "uint256", "name": "amount"},
      {"type": "uint256", "name": "expirationTime"}
    ],
    "name": "createBet",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {"type": "uint256", "name": "betId"},
      {"type": "bool", "name": "choice"},
      {"type": "uint256", "name": "amount"}
    ],
    "name": "participateInBet",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  }
] as const;