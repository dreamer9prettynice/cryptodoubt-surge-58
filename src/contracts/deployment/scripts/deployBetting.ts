import { NetworkProvider } from '@ton-community/blueprint';
import { Address, toNano } from '@ton/core';
import { BettingContract } from '../../BettingContract';

export async function run(provider: NetworkProvider) {
    const betting = provider.open(BettingContract.createFromConfig({
        betId: "bet_" + Date.now().toString(),
        title: "Test Bet",
        amount: toNano('1'),
        expirationTime: Math.floor(Date.now() / 1000) + 3600,
        creatorAddress: Address.parse(provider.sender().address!.toString())
    }));

    const cell = await provider.compile('Betting');
    
    await betting.sendDeploy(provider.sender(), toNano('0.05'));
    
    console.log('Deployed betting contract at address:', betting.address.toString());
    console.log('Contract deployed to mainnet successfully');
}