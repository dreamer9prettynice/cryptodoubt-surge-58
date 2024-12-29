import { Blockchain } from '@ton-community/sandbox';
import { Address, Cell, toNano } from '@ton/core';
import { BettingContract } from '../../BettingContract';
import '@ton-community/test-utils';
import { compileFunc } from '@ton-community/func-js';
import * as fs from 'fs';
import * as path from 'path';

describe('Betting Contract (Mainnet)', () => {
    let blockchain: Blockchain;
    let contract: BettingContract;
    let deployer: any;
    
    beforeEach(async () => {
        blockchain = await Blockchain.create();
        deployer = await blockchain.treasury('deployer');

        // Compile contract with correct config
        const contractPath = path.resolve(__dirname, '../contracts/Betting.fc');
        const source = fs.readFileSync(contractPath, 'utf8');
        const result = await compileFunc({
            sources: { 'Betting.fc': source },
            targets: ['Betting.fc']
        });

        if (result.status === 'error') {
            throw new Error(`Compilation failed: ${result.message}`);
        }
        
        // Create and deploy contract with proper Cell conversion
        contract = BettingContract.createFromConfig({
            betId: "test_bet",
            title: "Test Bet",
            amount: toNano('1'),
            expirationTime: Math.floor(Date.now() / 1000) + 3600,
            creatorAddress: deployer.address
        }, Cell.fromBoc(Buffer.from(result.codeBoc, 'base64'))[0]);

        const deployResult = await blockchain.sendMessage(
            deployer.getSender(),
            {
                to: contract.address,
                value: toNano('0.05'),
                init: contract.init
            }
        );

        expect(deployResult.transactions).toBeDefined();
    });

    it('should accept bets', async () => {
        const sender = await blockchain.treasury('sender');
        const betAmount = toNano('1');
        
        const betResult = await blockchain.sendMessage(
            sender.getSender(),
            {
                to: contract.address,
                value: betAmount,
                body: { op: 'bet', choice: 'yes' }
            }
        );

        expect(betResult.transactions).toBeDefined();
    });
});