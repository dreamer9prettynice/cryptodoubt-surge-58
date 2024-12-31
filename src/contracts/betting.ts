import { BettingContract, BettingConfig } from './BettingContract';
import { Address, toNano } from '@ton/core';

const DEPLOYED_CONTRACT_ADDRESS = 'EQBvL1b1vvi-yXP_leOiX3tsOBawWItXOf9FmB0xCl6chsx5';

export const createBettingContract = async (config: {
    betId: string;
    title: string;
    amount: number;
    expirationHours: number;
    creatorAddress: string;
}) => {
    const bettingConfig: BettingConfig = {
        betId: config.betId,
        title: config.title,
        amount: toNano(config.amount.toString()),
        expirationTime: Math.floor(Date.now() / 1000) + (config.expirationHours * 3600),
        creatorAddress: Address.parse(config.creatorAddress)
    };

    const contract = new BettingContract(
        Address.parse(DEPLOYED_CONTRACT_ADDRESS)
    );

    return {
        contractAddress: contract.address.toString(),
        config: bettingConfig,
        contract
    };
};

export const participateInBet = async (
    amount: number,
    choice: 'yes' | 'no'
) => {
    const contract = new BettingContract(
        Address.parse(DEPLOYED_CONTRACT_ADDRESS)
    );

    return {
        contractAddress: DEPLOYED_CONTRACT_ADDRESS,
        amount: toNano(amount.toString()),
        choice
    };
};

export const getBetStatus = async () => {
    const contract = new BettingContract(
        Address.parse(DEPLOYED_CONTRACT_ADDRESS)
    );

    return {
        totalAmount: toNano('1000000'),
        yesAmount: toNano('600000'),
        noAmount: toNano('400000'),
        status: 'active',
        expirationTime: Date.now() + 86400000 // 24 hours from now
    };
};