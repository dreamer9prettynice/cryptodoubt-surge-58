import { Blockchain, SandboxContract } from '@ton-community/sandbox';
import { toNano } from '@ton/core';
import { BettingContract } from '../../BettingContract';
import '@ton-community/test-utils';

describe('Betting Contract', () => {
    let blockchain: Blockchain;
    let betting: SandboxContract<BettingContract>;
    let deployer: any;
    
    beforeEach(async () => {
        blockchain = await Blockchain.create();
        deployer = await blockchain.treasury('deployer');
        
        const bettingContract = await BettingContract.createFromConfig(
            {
                betId: "test_bet",
                title: "Test Bet",
                amount: toNano('1'),
                expirationTime: Math.floor(Date.now() / 1000) + 3600,
                creatorAddress: deployer.address
            },
            await blockchain.compile('Betting')
        );

        betting = blockchain.openContract(bettingContract);
        const deployResult = await betting.sendDeploy(deployer.getSender(), toNano('0.05'));
        expect(deployResult.transactions).toBeDefined();
    });

    it('should deploy', async () => {
        const deployed = await blockchain.getContract(betting.address);
        expect(deployed.account).toBeDefined();
    });

    it('should accept bets', async () => {
        const betResult = await betting.sendBet(
            deployer.getSender(),
            {
                amount: toNano('1'),
                choice: 'yes'
            }
        );
        expect(betResult.transactions).toBeDefined();
    });
});