import { 
    Address, 
    Cell, 
    Contract, 
    ContractProvider, 
    Sender, 
    OpenedContract,
    Transaction,
    SendMode
} from '@ton/core';

export interface BetStatus {
    totalAmount: bigint;
    yesAmount: bigint;
    noAmount: bigint;
    status: string;
    expirationTime: number;
}

export interface BetResult {
    contractAddress: string;
    amount: bigint;
    choice?: 'yes' | 'no';
    expirationTime?: number;
}

export interface CustomProvider extends ContractProvider {
    getTransactions(
        address: Address,
        lt: bigint,
        hash: Buffer,
        limit?: number
    ): Promise<Transaction[]>;
}