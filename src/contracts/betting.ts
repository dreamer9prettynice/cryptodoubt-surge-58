import { BettingContract, BettingConfig } from './BettingContract';
import { Address, toNano, Cell, beginCell } from '@ton/core';

// Using the deployed contract address
const BETTING_CONTRACT_ADDRESS = 'EQevdolaf_AjNINQPmYWBWq9w1NWw1vQOFYuRqObrvrQB3';

export const getBettingContract = () => {
    return new BettingContract(
        Address.parse(BETTING_CONTRACT_ADDRESS)
    );
};

export const participateInBet = async (
    amount: number,
    choice: 'yes' | 'no'
) => {
    const contract = getBettingContract();
    
    // Convert amount to nanoTONs
    const amountInNano = toNano(amount.toString());
    
    return {
        contractAddress: BETTING_CONTRACT_ADDRESS,
        amount: amountInNano,
        choice
    };
};

export const getBetStatus = async () => {
    const contract = getBettingContract();
    
    // In production, this would fetch actual contract state
    return {
        totalAmount: toNano('1000000'),
        yesAmount: toNano('600000'),
        noAmount: toNano('400000'),
        status: 'active',
        expirationTime: Date.now() + 86400000 // 24 hours from now
    };
};
