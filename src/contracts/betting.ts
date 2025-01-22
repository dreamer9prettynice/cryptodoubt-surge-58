import { 
    Address, 
    beginCell,
    Cell
} from '@ton/core';
import { TonClient4 } from '@ton/ton';
import { BettingContract } from './BettingContract';

const BETTING_CONTRACT_ADDRESS = 'EQCWHFymtBHttnHvFLodTNPM37EE5C2LgkDE1_2hIj-cKtsQ';
const USDT_CONTRACT_ADDRESS = 'EQBynBO23ywHy_CgarY9NK9FTz0yDsG82PtcbSTQgGoXwiuA'; // TON USDT contract
const MIN_BET = BigInt(1000000); // 1 USDT (6 decimals)

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
    contractAddress: string;
}

export const createBet = async (
    title: string,
    amount: number,
    expirationHours: number
): Promise<BetResult> => {
    if (BigInt(amount * 1000000) < MIN_BET) {
        throw new Error('Minimum bet amount is 1 USDT');
    }

    const message = beginCell()
        .storeUint(1, 32) // op: create bet
        .storeRef(beginCell().storeBuffer(Buffer.from(title)).endCell())
        .storeUint(expirationHours * 3600, 64) // convert hours to seconds
        .storeAddress(Address.parse(USDT_CONTRACT_ADDRESS))
        .storeCoins(BigInt(amount * 1000000)) // Convert to USDT decimals
        .endCell();

    return {
        to: BETTING_CONTRACT_ADDRESS,
        amount: BigInt(0.1 * 1000000000), // 0.1 TON for gas
        payload: message,
        contractAddress: BETTING_CONTRACT_ADDRESS
    };
};

export const participateInBet = async (
    betId: number,
    amount: number,
    choice: 'yes' | 'no'
): Promise<BetResult> => {
    if (BigInt(amount * 1000000) < MIN_BET) {
        throw new Error('Minimum bet amount is 1 USDT');
    }

    const message = beginCell()
        .storeUint(2, 32) // op: place bet
        .storeUint(betId, 32)
        .storeUint(choice === 'yes' ? 1 : 0, 1)
        .storeAddress(Address.parse(USDT_CONTRACT_ADDRESS))
        .storeCoins(BigInt(amount * 1000000)) // Convert to USDT decimals
        .endCell();

    return {
        to: BETTING_CONTRACT_ADDRESS,
        amount: BigInt(0.1 * 1000000000), // 0.1 TON for gas
        payload: message,
        contractAddress: BETTING_CONTRACT_ADDRESS
    };
};

export const formatUSDTAmount = (amount: bigint): string => {
    return (Number(amount) / 1000000).toFixed(2);
};