import { NetworkProvider } from '@ton-community/blueprint';
import { Address, toNano } from '@ton/core';
import { BettingContract } from '../../BettingContract';
import { compileFunc } from '@ton-community/func-js';
import * as fs from 'fs';
import * as path from 'path';

export async function run(provider: NetworkProvider, args: string[]) {
    const contractPath = path.resolve(__dirname, '../contracts/Betting.fc');
    const source = fs.readFileSync(contractPath, 'utf8');
    
    // Compile the contract
    const result = await compileFunc({
        sources: { 'Betting.fc': source },
        entryPoints: ['Betting.fc'],
    });

    if (result.status === 'error') {
        throw new Error(`Compilation failed: ${result.message}`);
    }

    // Create contract instance
    const betting = provider.open(await BettingContract.createFromConfig({
        betId: "bet_" + Date.now().toString(),
        title: "Test Bet",
        amount: toNano('1'),
        expirationTime: Math.floor(Date.now() / 1000) + 3600,
        creatorAddress: Address.parse(args[0] || provider.sender().address!.toString())
    }, result.codeBoc));

    // Deploy the contract
    await betting.sendDeploy(provider.sender(), toNano('0.05'));
    
    console.log('Deployed betting contract at address:', betting.address.toString());
}