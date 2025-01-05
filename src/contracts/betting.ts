import { BettingContract } from './BettingContract';
import { Address, toNano } from '@ton/core';
import { TonClient } from '@ton/ton';

// Using the deployed contract address
const BETTING_CONTRACT_ADDRESS = 'EQevdolaf_AjNINQPmYWBWq9w1NWw1vQOFYuRqObrvrQB3';

// Initialize TON Client with API key
const client = new TonClient({
    endpoint: 'https://toncenter.com/api/v2/jsonRPC',
    apiKey: 'your_api_key_here' // You should use an environment variable for this
});

export const getBettingContract = () => {
    return new BettingContract(
        Address.parse(BETTING_CONTRACT_ADDRESS)
    );
};

export const createBet = async (
    title: string,
    amount: number,
    expirationHours: number
) => {
    const contract = getBettingContract();
    const amountInNano = toNano(amount.toString());
    
    return {
        contractAddress: BETTING_CONTRACT_ADDRESS,
        amount: amountInNano,
        expirationTime: Date.now() + (expirationHours * 60 * 60 * 1000)
    };
};

export const participateInBet = async (
    amount: number,
    choice: 'yes' | 'no'
) => {
    const contract = getBettingContract();
    const amountInNano = toNano(amount.toString());
    
    return {
        contractAddress: BETTING_CONTRACT_ADDRESS,
        amount: amountInNano,
        choice
    };
};

export const resolveBet = async (outcome: 'yes' | 'no') => {
    const contract = getBettingContract();
    return {
        contractAddress: BETTING_CONTRACT_ADDRESS,
        outcome
    };
};

export const getBetStatus = async () => {
    const contract = getBettingContract();
    try {
        const provider = await client.getProvider();
        const status = await contract.getStatus(provider);
        return {
            totalAmount: status.totalAmount,
            yesAmount: status.yesAmount,
            noAmount: status.noAmount,
            status: status.status,
            expirationTime: status.expirationTime
        };
    } catch (error) {
        console.error("Error fetching bet status:", error);
        return null;
    }
};

export const getParticipants = async () => {
    const contract = getBettingContract();
    try {
        const provider = await client.getProvider();
        return await contract.getParticipants(provider);
    } catch (error) {
        console.error("Error fetching participants:", error);
        return null;
    }
};