import { 
    Address, 
    Cell,
    Contract,
    beginCell
} from '@ton/core';
import { TonClient4 } from '@ton/ton';
import { BettingContract } from './BettingContract';
import { createCustomProvider } from './provider';
import { BetResult, BetStatus, BetInfo, UserBetAmount } from './types';

const BETTING_CONTRACT_ADDRESS = 'EQCWHFymtBHttnHvFLodTNPM37EE5C2LgkDE1_2hIj-cKts';
const MIN_BET = BigInt(100000000); // 0.1 TON

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
    if (BigInt(amount) < MIN_BET) {
        throw new Error('Minimum bet amount is 0.1 TON');
    }

    const contract = getBettingContract();
    const message = beginCell()
        .storeUint(1, 32) // op: create bet
        .storeRef(beginCell().storeString(title))
        .storeUint(expirationHours * 3600, 64) // convert hours to seconds
        .endCell();

    return {
        contractAddress: BETTING_CONTRACT_ADDRESS,
        amount: BigInt(amount),
        expirationTime: Date.now() + (expirationHours * 60 * 60 * 1000)
    };
};

export const participateInBet = async (
    betId: number,
    amount: number,
    choice: 'yes' | 'no'
): Promise<BetResult> => {
    if (BigInt(amount) < MIN_BET) {
        throw new Error('Minimum bet amount is 0.1 TON');
    }

    const contract = getBettingContract();
    const message = beginCell()
        .storeUint(2, 32) // op: place bet
        .storeUint(betId, 32)
        .storeUint(choice === 'yes' ? 1 : 0, 1)
        .endCell();

    return {
        contractAddress: BETTING_CONTRACT_ADDRESS,
        amount: BigInt(amount),
        choice
    };
};

export const resolveBet = async (
    betId: number,
    outcome: 'yes' | 'no'
): Promise<BetResult> => {
    const contract = getBettingContract();
    const message = beginCell()
        .storeUint(3, 32) // op: resolve bet
        .storeUint(betId, 32)
        .storeUint(outcome === 'yes' ? 1 : 0, 1)
        .endCell();

    return {
        contractAddress: BETTING_CONTRACT_ADDRESS,
        amount: BigInt(0)
    };
};

export const getBetInfo = async (betId: number): Promise<BetInfo | null> => {
    const contract = getBettingContract();
    try {
        const result = await contract.getBetInfo(provider, betId);
        return {
            id: result.id,
            totalYesAmount: result.totalYesAmount,
            totalNoAmount: result.totalNoAmount,
            endTime: result.endTime,
            isResolved: result.isResolved
        };
    } catch (error) {
        console.error("Error fetching bet info:", error);
        return null;
    }
};

export const getUserBetAmount = async (
    userAddress: string,
    betId: number
): Promise<UserBetAmount | null> => {
    const contract = getBettingContract();
    try {
        const result = await contract.getUserBetAmount(
            provider,
            Address.parse(userAddress),
            betId
        );
        return {
            yesAmount: result.yesAmount,
            noAmount: result.noAmount
        };
    } catch (error) {
        console.error("Error fetching user bet amount:", error);
        return null;
    }
};