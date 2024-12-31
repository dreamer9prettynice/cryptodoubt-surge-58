import { Address, beginCell, Cell, toNano } from '@ton/core';
import { BettingContract } from '../BettingContract';
import { NetworkProvider } from '@ton/blueprint';

export async function deployBettingContract(networkProvider: NetworkProvider, initialData: {
    betId: string;
    title: string;
    amount: string;
    expirationTime: number;
    creatorAddress: string;
}) {
    const contractCode = Cell.fromBoc(Buffer.from('... contract code here ...', 'base64'))[0];

    const betting = BettingContract.createForDeploy(contractCode, {
        betId: initialData.betId,
        title: initialData.title,
        amount: toNano(initialData.amount),
        expirationTime: initialData.expirationTime,
        creatorAddress: Address.parse(initialData.creatorAddress)
    });

    // Get contract provider from network provider
    const provider = networkProvider.open(betting);
    
    // Deploy contract using provider
    await betting.sendDeploy(provider, networkProvider.sender());

    return betting;
}