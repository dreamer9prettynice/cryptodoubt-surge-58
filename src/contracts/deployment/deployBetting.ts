import { Address, beginCell, Cell, toNano } from '@ton/core';
import { BettingContract } from '../BettingContract';
import { NetworkProvider } from '@ton/blueprint';
import { compileFuncToB64 } from '../utils/compiler';

export async function deployBettingContract(networkProvider: NetworkProvider, initialData: {
    betId: string;
    title: string;
    amount: string;
    expirationTime: number;
    creatorAddress: string;
}) {
    // Read and compile the contract code
    const contractCode = await compileFuncToB64('betting.fc');
    const cell = Cell.fromBoc(Buffer.from(contractCode, 'base64'))[0];

    const betting = BettingContract.createForDeploy(cell, {
        betId: initialData.betId,
        title: initialData.title,
        amount: toNano(initialData.amount),
        expirationTime: initialData.expirationTime,
        creatorAddress: Address.parse(initialData.creatorAddress)
    });

    // Deploy contract using provider
    const openedContract = networkProvider.open(betting);
    await betting.sendDeploy(openedContract.provider, networkProvider.sender());

    return betting;
}