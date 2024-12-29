# Betting Smart Contract Deployment

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

4. Create and fund your wallet:
```bash
ton-cli wallet create
# Fund your wallet with test TON tokens
```

5. Deploy the contract:
```bash
ton-cli deploy build/betting.cell --wallet <your_wallet_address> --params "{}"
```

## Contract Structure
The betting contract is located in `contracts/Betting.fc`. It implements the core betting functionality including:
- Bet creation
- Participation
- Result resolution
- Fund distribution

## Development
- Modify the contract code in `contracts/Betting.fc`
- Run `npm run compile` to compile changes
- Test using `npm test`
- Deploy using the deployment steps above