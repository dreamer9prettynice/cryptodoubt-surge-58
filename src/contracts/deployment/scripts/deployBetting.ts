import { NetworkProvider } from '@ton-community/blueprint';
import { Address, Cell, toNano, beginCell } from 'ton-core';
import { BettingContract } from '../../BettingContract';
import { compileFunc } from '@ton-community/func-js';
import * as fs from 'fs';
import * as path from 'path';

export async function run(provider: NetworkProvider) {
    const contractPath = path.resolve(__dirname, '../contracts/Betting.fc');
    const source = fs.readFileSync(contractPath, 'utf8');
    
    const result = await compileFunc({
        sources: { 'Betting.fc': source },
        targets: ['Betting.fc']
    });

    if (result.status === 'error') {
        throw new Error(`Compilation failed: ${result.message}`);
    }

    const contract = BettingContract.createFromConfig({
        betId: "bet_" + Date.now().toString(),
        title: "Test Bet",
        amount: toNano('1'),
        expirationTime: Math.floor(Date.now() / 1000) + 3600,
        creatorAddress: provider.sender().address!
    }, Cell.fromBoc(Buffer.from(result.codeBoc, 'base64'))[0]);

    await provider.deploy(contract, {
        value: toNano('0.05'),
        bounce: false
    });
    
    console.log('Deployed betting contract at address:', contract.address.toString());
}