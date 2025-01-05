import { 
    Address, 
    Cell, 
    Contract, 
    ContractProvider, 
    Sender, 
    OpenedContract,
    Transaction,
    TupleReader
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
) => {
    const contract = getBettingContract();
    const amountInNano = BigInt(amount);
    
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
        const customProvider: ContractProvider = {
            async getState() {
                const state = await client.getAccountState(Address.parse(BETTING_CONTRACT_ADDRESS));
                return {
                    balance: state.balance,
                    last: {
                        lt: BigInt(state.lastTransaction?.lt || '0'),
                        hash: Buffer.from(state.lastTransaction?.hash || '')
                    },
                    state: state.state,
                    code: state.code ? Buffer.from(state.code) : null,
                    data: state.data ? Buffer.from(state.data) : null
                };
            },
            async get(name: string, args: any[]) {
                const result = await client.runMethod(
                    Address.parse(BETTING_CONTRACT_ADDRESS),
                    name
                );
                return { 
                    stack: new TupleReader(result.result)
                };
            },
            async external(message: Cell) {
                await client.sendFile(Buffer.from(message.toBoc()));
            },
            async internal(via: Sender, message: { 
                value: string | bigint,
                bounce?: boolean,
                body?: string | Cell
            }) {
                const cell = new Cell();
                if (message.body instanceof Cell) {
                    cell.writeCell(message.body);
                } else if (message.body) {
                    cell.writeString(message.body);
                }
                await client.sendFile(Buffer.from(cell.toBoc()));
            },
            async open<T extends Contract>(contract: T): Promise<OpenedContract<T>> {
                return contract as OpenedContract<T>;
            },
            async getTransactions(
                address: Address,
                lt: bigint,
                hash: Buffer
            ): Promise<Transaction[]> {
                const txs = await client.getTransactions(
                    address,
                    {
                        lt: lt.toString(),
                        hash: hash.toString('hex')
                    },
                    10
                );
                return txs as unknown as Transaction[];
            }
        };
        
        const status = await contract.getStatus(customProvider);
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
        const customProvider: ContractProvider = {
            async getState() {
                const state = await client.getAccountState(Address.parse(BETTING_CONTRACT_ADDRESS));
                return {
                    balance: state.balance,
                    last: {
                        lt: BigInt(state.lastTransaction?.lt || '0'),
                        hash: Buffer.from(state.lastTransaction?.hash || '')
                    },
                    state: state.state,
                    code: state.code ? Buffer.from(state.code) : null,
                    data: state.data ? Buffer.from(state.data) : null
                };
            },
            async get(name: string, args: any[]) {
                const result = await client.runMethod(
                    Address.parse(BETTING_CONTRACT_ADDRESS),
                    name
                );
                return { 
                    stack: new TupleReader(result.result)
                };
            },
            async external(message: Cell) {
                await client.sendFile(Buffer.from(message.toBoc()));
            },
            async internal(via: Sender, message: { 
                value: string | bigint,
                bounce?: boolean,
                body?: string | Cell
            }) {
                const cell = new Cell();
                if (message.body instanceof Cell) {
                    cell.writeCell(message.body);
                } else if (message.body) {
                    cell.writeString(message.body);
                }
                await client.sendFile(Buffer.from(cell.toBoc()));
            },
            async open<T extends Contract>(contract: T): Promise<OpenedContract<T>> {
                return contract as OpenedContract<T>;
            },
            async getTransactions(
                address: Address,
                lt: bigint,
                hash: Buffer
            ): Promise<Transaction[]> {
                const txs = await client.getTransactions(
                    address,
                    {
                        lt: lt.toString(),
                        hash: hash.toString('hex')
                    },
                    10
                );
                return txs as unknown as Transaction[];
            }
        };
        return await contract.getParticipants(customProvider);
    } catch (error) {
        console.error("Error fetching participants:", error);
        return null;
    }
};