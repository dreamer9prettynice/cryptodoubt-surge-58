import { Blockchain, SandboxContract } from '@ton-community/sandbox';
import { toNano } from '@ton/core';
import { Betting } from '../wrappers/Betting';
import '@ton-community/test-utils';
import { compile } from '@ton-community/blueprint';

describe('Betting', () => {
    let blockchain: Blockchain;
    let betting: SandboxContract<Betting>;
    
    beforeEach(async () => {
        blockchain = await Blockchain.create();
        
        betting = blockchain.openContract(
            Betting.createFromConfig({
                betId: "test_bet",
                title: "Test Bet",
                amount: toNano('1'),
                expirationTime: Math.floor(Date.now() / 1000) + 3600,
                creatorAddress: blockchain.sender.address
            }, await compile('Betting'))
        );

        await betting.sendDeploy(blockchain.sender);
    });

    it('should deploy', async () => {
        const deployed = await blockchain.getContract(betting.address);
        expect(deployed.account).toBeDefined();
    });

    it('should accept bets', async () => {
        const result = await betting.sendBet(blockchain.sender, {
            amount: toNano('1'),
            choice: 'yes'
        });
        expect(result.transactions).toBeDefined();
    });
});