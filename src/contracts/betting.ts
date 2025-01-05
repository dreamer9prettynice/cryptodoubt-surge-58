import { 
    Address, 
    beginCell, 
    Cell, 
    Contract, 
    contractAddress, 
    ContractProvider, 
    Sender, 
    SendMode,
    toNano,
    TupleReader,
    OpenedContract,
    Transaction
} from '@ton/core';
import { TonClient4 } from '@ton/ton';
import { BettingContract } from './BettingContract';

// Using the deployed contract address
const BETTING_CONTRACT_ADDRESS = 'EQevdolaf_AjNINQPmYWBWq9w1NWw1vQOFYuRqObrvrQB3';

// Initialize TON Client with API key
const client = new TonClient4({
    endpoint: 'https://toncenter.com/api/v2/jsonRPC'
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
        const provider: ContractProvider = {
            getState: async () => {
                const state = await client.getState(Address.parse(BETTING_CONTRACT_ADDRESS));
                return {
                    ...state,
                    last: {
                        lt: BigInt(state.lastTransaction?.lt || '0'),
                        hash: state.lastTransaction?.hash || Buffer.from([])
                    }
                };
            },
            get: async (name: string, args: any[]) => {
                const result = await client.runMethod(
                    Address.parse(BETTING_CONTRACT_ADDRESS),
                    name,
                    args
                );
                return { stack: result.stack };
            },
            external: async (message) => {
                await client.sendMessage(message);
            },
            internal: async (via, message) => {
                await client.sendMessage(message);
            },
            open: async <T extends Contract>(contract: T): Promise<OpenedContract<T>> => {
                return contract as OpenedContract<T>;
            },
            getTransactions: async (
                address: Address,
                lt: bigint,
                hash: Buffer,
                limit?: number
            ): Promise<Transaction[]> => {
                const txs = await client.getTransactions(address, lt, hash, limit);
                return txs as Transaction[];
            }
        };
        
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
        const provider: ContractProvider = {
            getState: async () => {
                const state = await client.getState(Address.parse(BETTING_CONTRACT_ADDRESS));
                return {
                    ...state,
                    last: {
                        lt: BigInt(state.lastTransaction?.lt || '0'),
                        hash: state.lastTransaction?.hash || Buffer.from([])
                    }
                };
            },
            get: async (name: string, args: any[]) => {
                const result = await client.runMethod(
                    Address.parse(BETTING_CONTRACT_ADDRESS),
                    name,
                    args
                );
                return { stack: result.stack };
            },
            external: async (message) => {
                await client.sendMessage(message);
            },
            internal: async (via, message) => {
                await client.sendMessage(message);
            },
            open: async <T extends Contract>(contract: T): Promise<OpenedContract<T>> => {
                return contract as OpenedContract<T>;
            },
            getTransactions: async (
                address: Address,
                lt: bigint,
                hash: Buffer,
                limit?: number
            ): Promise<Transaction[]> => {
                const txs = await client.getTransactions(address, lt, hash, limit);
                return txs as Transaction[];
            }
        };
        return await contract.getParticipants(provider);
    } catch (error) {
        console.error("Error fetching participants:", error);
        return null;
    }
};