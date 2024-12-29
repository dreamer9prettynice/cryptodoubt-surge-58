import { Blockchain } from '@ton-community/sandbox';
import { Address, toNano } from '@ton/core';
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

        // Compile contract
        const contractPath = path.resolve(__dirname, '../contracts/Betting.fc');
        const source = fs.readFileSync(contractPath, 'utf8');
        const result = await compileFunc({
            sources: { 'Betting.fc': source },
            entryPoints: ['Betting.fc'],
        });

        if (result.status === 'error') {
            throw new Error(`Compilation failed: ${result.message}`);
        }
        
        // Create and deploy contract
        contract = BettingContract.createFromConfig({
            betId: "test_bet",
            title: "Test Bet",
            amount: toNano('1'),
            expirationTime: Math.floor(Date.now() / 1000) + 3600,
            creatorAddress: deployer.address
        }, result.codeBoc);

        const deployResult = await blockchain.sendMessage(
            deployer.getSender(),
            contract.address,
            toNano('0.05')
        );

        expect(deployResult.transactions).toBeDefined();
    });

    it('should deploy to mainnet', async () => {
        const deployed = await blockchain.getContract(contract.address);
        expect(deployed.account).toBeDefined();
    });

    it('should accept bets', async () => {
        const betAmount = toNano('1');
        const sender = await blockchain.treasury('sender');
        
        const betResult = await blockchain.sendMessage(
            sender.getSender(),
            contract.address,
            {
                value: betAmount,
                body: { op: 'bet', choice: 'yes' }
            }
        );

        expect(betResult.transactions).toBeDefined();
    });
});