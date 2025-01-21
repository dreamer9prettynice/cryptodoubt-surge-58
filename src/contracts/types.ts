import { Address } from '@ton/core';

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

export interface BetInfo {
    id: number;
    totalYesAmount: bigint;
    totalNoAmount: bigint;
    endTime: number;
    isResolved: boolean;
}

export interface UserBetAmount {
    yesAmount: bigint;
    noAmount: bigint;
}

export interface CustomProvider {
    getState(): Promise<any>;
    get(method: string, args: any[]): Promise<any>;
    external(message: any): Promise<void>;
    internal(via: any, message: any): Promise<void>;
}