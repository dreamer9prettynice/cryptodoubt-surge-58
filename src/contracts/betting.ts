import { 
    Address, 
    Cell,
    Contract
} from '@ton/core';
import { TonClient4 } from '@ton/ton';
import { BettingContract } from './BettingContract';
import { createCustomProvider } from './provider';
import { BetResult, BetStatus } from './types';

const BETTING_CONTRACT_ADDRESS = 'EQevdolaf_AjNINQPmYWBWq9w1NWw1vQOFYuRqObrvrQB3';

const client = new TonClient4({
    endpoint: 'https://toncenter.com/api/v2/jsonRPC'
});

const provider = createCustomProvider(client);

export const getBettingContract = () => {
    return new BettingContract(
        Address.parse(BETTING_CONTRACT_ADDRESS)
    );
};

export const createBet = async (
    title: string,
    amount: number,
    expirationHours: number
): Promise<BetResult> => {
    const contract = getBettingContract();
    const amountInNano = BigInt(amount);
    
    return {
        contractAddress: BETTING_CONTRACT_ADDRESS,
        amount: amountInNano,
        expirationTime: Date.now() + (expirationHours * 60 * 60 * 1000)
    };
};

export const participateInBet = async (
    amount: number,
    choice: 'yes' | 'no'
): Promise<BetResult> => {
    const contract = getBettingContract();
    const amountInNano = BigInt(amount);
    
    return {
        contractAddress: BETTING_CONTRACT_ADDRESS,
        amount: amountInNano,
        choice
    };
};

export const resolveBet = async (outcome: 'yes' | 'no'): Promise<BetResult> => {
    const contract = getBettingContract();
    return {
        contractAddress: BETTING_CONTRACT_ADDRESS,
        amount: BigInt(0),
        choice: outcome
    };
};

export const getBetStatus = async (): Promise<BetStatus | null> => {
    const contract = getBettingContract();
    try {
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
        return await contract.getParticipants(provider);
    } catch (error) {
        console.error("Error fetching participants:", error);
        return null;
    }
};