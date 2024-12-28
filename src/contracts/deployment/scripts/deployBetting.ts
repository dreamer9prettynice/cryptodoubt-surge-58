import { toNano } from '@ton/core';
import { NetworkProvider } from '@ton-community/blueprint';
import { BettingContract } from '../../BettingContract';

export async function run(provider: NetworkProvider) {
    const betting = provider.open(await BettingContract.createFromConfig(
        {
            betId: "bet_" + Date.now().toString(),
            title: "Test Bet",
            amount: toNano('1'),
            expirationTime: Math.floor(Date.now() / 1000) + 3600,
            creatorAddress: provider.sender().address!
        },
        await provider.compile('Betting')
    ));

    await betting.sendDeploy(provider.sender(), toNano('0.05'));
    await provider.waitForDeploy(betting.address);

    console.log('Deployed betting contract at address:', betting.address);
}