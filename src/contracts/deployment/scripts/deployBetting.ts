import { toNano } from '@ton/core';
import { Betting } from '../wrappers/Betting';
import { compile, NetworkProvider } from '@ton-community/blueprint';

export async function run(provider: NetworkProvider) {
    const betting = provider.open(
        Betting.createFromConfig({
            betId: "bet_" + Date.now().toString(),
            title: "Test Bet",
            amount: toNano('1'),
            expirationTime: Math.floor(Date.now() / 1000) + 3600, // 1 hour from now
            creatorAddress: provider.sender().address!
        }, await compile('Betting'))
    );

    await betting.sendDeploy(provider.sender());

    await provider.waitForDeploy(betting.address);

    console.log('Deployed betting contract at address:', betting.address);
}