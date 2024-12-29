import { Blockchain } from '@ton-community/sandbox';
import { Address, Cell, toNano, beginCell } from 'ton-core';
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

        const contractPath = path.resolve(__dirname, '../contracts/Betting.fc');
        const source = fs.readFileSync(contractPath, 'utf8');
        const result = await compileFunc({
            sources: { 'Betting.fc': source },
            targets: ['Betting.fc']
        });

        if (result.status === 'error') {
            throw new Error(`Compilation failed: ${result.message}`);
        }
        
        contract = BettingContract.createFromConfig({
            betId: "test_bet",
            title: "Test Bet",
            amount: toNano('1'),
            expirationTime: Math.floor(Date.now() / 1000) + 3600,
            creatorAddress: deployer.address
        }, Cell.fromBoc(Buffer.from(result.codeBoc, 'base64'))[0]);

        const deployResult = await blockchain.sendMessage({
            source: deployer.address,
            dest: contract.address,
            value: toNano('0.05'),
            bounce: false,
            body: beginCell().endCell()
        });

        expect(deployResult.transactions).toBeDefined();
    });

    it('should accept bets', async () => {
        const sender = await blockchain.treasury('sender');
        const betAmount = toNano('1');
        
        const betResult = await blockchain.sendMessage({
            source: sender.address,
            dest: contract.address,
            value: betAmount,
            bounce: true,
            body: beginCell()
                .storeUint(1, 32)  // op for betting
                .storeStringTail('yes')
                .endCell()
        });

        expect(betResult.transactions).toBeDefined();
    });
});