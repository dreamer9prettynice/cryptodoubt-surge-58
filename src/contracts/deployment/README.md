# Betting Smart Contract Deployment (Mainnet)

## Setup
1. Install TON CLI:
```bash
npm install -g ton-cli
```

2. Install dependencies:
```bash
npm install
```

3. Compile the contract:
```bash
npm run compile
```

4. Create and fund your wallet for mainnet:
```bash
ton-cli wallet create --mainnet
# Fund your wallet with real TON tokens
```

5. Deploy the contract to mainnet:
```bash
ton-cli deploy build/betting.cell --network mainnet --wallet <your_wallet_address> --params "{}"
```

## Important Notes
- This deployment is configured for TON mainnet
- Ensure you have sufficient TON tokens in your wallet
- Double-check all parameters before deployment
- Keep your wallet keys secure

## Contract Structure
The betting contract implements:
- Bet creation
- Participation
- Result resolution
- Fund distribution

## Development
- Modify contract code in `contracts/Betting.fc`
- Run `npm run compile` to compile changes
- Test thoroughly before mainnet deployment
- Deploy using the deployment steps above