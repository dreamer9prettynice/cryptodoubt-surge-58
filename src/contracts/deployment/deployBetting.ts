import { Address, beginCell, Cell, toNano, Sender } from '@ton/core';
import { BettingContract } from '../BettingContract';
import { NetworkProvider } from '@ton/blueprint';

export async function deployBettingContract(provider: NetworkProvider, initialData: {
    betId: string;
    title: string;
    amount: string;
    expirationTime: number;
    creatorAddress: string;
}) {
    // Compile the contract
    const contractCode = Cell.fromBoc(Buffer.from('... contract code here ...', 'base64'))[0];

    // Create contract instance
    const betting = BettingContract.createForDeploy(contractCode, {
        betId: initialData.betId,
        title: initialData.title,
        amount: toNano(initialData.amount),
        expirationTime: initialData.expirationTime,
        creatorAddress: Address.parse(initialData.creatorAddress)
    });

    // Deploy contract using provider
    await betting.sendDeploy(provider, provider.sender());

    return betting;
}