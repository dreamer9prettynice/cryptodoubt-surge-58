import { NetworkProvider } from '@ton-community/blueprint';
import { Address, Cell, toNano, beginCell } from 'ton-core';
import { BettingContract } from '../../BettingContract';
import { compileFunc } from '@ton-community/func-js';
import * as fs from 'fs';
import * as path from 'path';

export async function run(provider: NetworkProvider) {
    // Read and compile the contract
    const contractPath = path.resolve(__dirname, '../contracts/Betting.fc');
    const source = fs.readFileSync(contractPath, 'utf8');
    
    const result = await compileFunc({
        sources: { 'Betting.fc': source },
        targets: ['Betting.fc']
    });

    if (result.status === 'error') {
        throw new Error(`Compilation failed: ${result.message}`);
    }

    // Create contract instance
    const contract = BettingContract.createFromConfig({
        betId: "bet_" + Date.now().toString(),
        title: "Initial Bet",
        amount: toNano('1'),
        expirationTime: Math.floor(Date.now() / 1000) + 3600,
        creatorAddress: provider.sender().address!
    }, Cell.fromBoc(Buffer.from(result.codeBoc, 'base64'))[0]);

    // Deploy the contract
    await provider.deploy(contract, toNano('0.05'));
    
    console.log('Contract deployed successfully!');
    console.log('Contract address:', contract.address.toString());
}

// Execute deployment if running directly
if (require.main === module) {
    run().catch(console.error);
}