import { 
    Address, 
    beginCell,
    Cell
} from '@ton/core';
import { TonClient4 } from '@ton/ton';
import { BettingContract } from './BettingContract';

const BETTING_CONTRACT_ADDRESS = 'EQCWHFymtBHttnHvFLodTNPM37EE5C2LgkDE1_2hIj-cKtsQ';
const MIN_BET = BigInt(100000000); // 0.1 TON

const client = new TonClient4({
    endpoint: 'https://toncenter.com/api/v2/jsonRPC'
});

export const getBettingContract = () => {
    return new BettingContract(
        Address.parse(BETTING_CONTRACT_ADDRESS)
    );
};

interface BetResult {
    to: string;
    amount: bigint;
    payload: Cell;
    contractAddress: string; // Added for compatibility
}

export const createBet = async (
    title: string,
    amount: number,
    expirationHours: number
): Promise<BetResult> => {
    if (BigInt(amount) < MIN_BET) {
        throw new Error('Minimum bet amount is 0.1 TON');
    }

    const message = beginCell()
        .storeUint(1, 32) // op: create bet
        .storeRef(beginCell().storeBuffer(Buffer.from(title)).endCell())
        .storeUint(expirationHours * 3600, 64) // convert hours to seconds
        .endCell();

    return {
        to: BETTING_CONTRACT_ADDRESS,
        amount: BigInt(amount),
        payload: message,
        contractAddress: BETTING_CONTRACT_ADDRESS
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

    const message = beginCell()
        .storeUint(2, 32) // op: place bet
        .storeUint(betId, 32)
        .storeUint(choice === 'yes' ? 1 : 0, 1)
        .endCell();

    return {
        to: BETTING_CONTRACT_ADDRESS,
        amount: BigInt(amount),
        payload: message,
        contractAddress: BETTING_CONTRACT_ADDRESS
    };
};