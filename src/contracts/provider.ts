import { 
    Address, 
    Cell, 
    Contract, 
    ContractProvider, 
    Sender, 
    OpenedContract,
    ContractState,
    SendMode,
    Transaction
} from '@ton/core';
import { TonClient4 } from '@ton/ton';
import { Buffer } from 'buffer';

export const createCustomProvider = (client: TonClient4): ContractProvider => ({
    async getState(): Promise<ContractState> {
        const block = await client.getLastBlock();
        const state = await client.getAccount(
            Address.parse(process.env.BETTING_CONTRACT_ADDRESS || ''),
            block
        );
        
        if (!state.account.state) {
            return {
                balance: BigInt(state.account.balance.coins),
                last: {
                    lt: BigInt(state.account.last?.lt || '0'),
                    hash: Buffer.from(state.account.last?.hash || '', 'base64')
                },
                state: { type: 'uninit' }
            };
        }

        if (state.account.state.type === 'active') {
            return {
                balance: BigInt(state.account.balance.coins),
                last: {
                    lt: BigInt(state.account.last?.lt || '0'),
                    hash: Buffer.from(state.account.last?.hash || '', 'base64')
                },
                state: {
                    type: 'active',
                    code: Buffer.from(state.account.state.code || '', 'base64'),
                    data: Buffer.from(state.account.state.data || '', 'base64')
                }
            };
        }

        if (state.account.state.type === 'frozen') {
            return {
                balance: BigInt(state.account.balance.coins),
                last: {
                    lt: BigInt(state.account.last?.lt || '0'),
                    hash: Buffer.from(state.account.last?.hash || '', 'base64')
                },
                state: {
                    type: 'frozen',
                    stateHash: Buffer.from(state.account.state.stateHash, 'base64')
                }
            };
        }

        throw new Error('Invalid account state');
    },

    async get(method: string, args: any[]) {
        const block = await client.getLastBlock();
        const result = await client.runMethod(
            Address.parse(process.env.BETTING_CONTRACT_ADDRESS || ''),
            method,
            args,
            block
        );
        return { stack: result.reader };
    },

    async external(message: Cell) {
        await client.sendMessage(message.toBoc());
    },

    async internal(via: Sender, message: { 
        value: string | bigint,
        bounce?: boolean,
        sendMode?: SendMode,
        body?: string | Cell
    }) {
        const cell = new Cell();
        if (typeof message.body === 'string') {
            cell.bits.writeUint8String(message.body);
        } else if (message.body instanceof Cell) {
            cell.bits.writeBuffer(Buffer.from(message.body.toBoc()));
        }
        await client.sendMessage(cell.toBoc());
    },

    open<T extends Contract>(contract: T): OpenedContract<T> {
        return contract as OpenedContract<T>;
    },

    async getTransactions(
        address: Address,
        lt: bigint,
        hash: Buffer,
        limit: number = 100
    ): Promise<Transaction[]> {
        const block = await client.getLastBlock();
        const transactions = await client.getAccountTransactions(
            address,
            lt.toString(),
            hash.toString('base64'),
            limit
        );
        return transactions.map(tx => ({
            ...tx,
            lt: BigInt(tx.lt),
            prevLt: tx.prevLt ? BigInt(tx.prevLt) : undefined
        })) as unknown as Transaction[];
    }
});