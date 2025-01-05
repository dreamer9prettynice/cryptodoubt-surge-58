import { 
    Address, 
    Cell, 
    Contract, 
    ContractProvider, 
    Sender, 
    OpenedContract,
    ContractState,
    SendMode
} from '@ton/core';
import { TonClient4 } from '@ton/ton';
import { Buffer } from 'buffer';

export const createCustomProvider = (client: TonClient4): ContractProvider => ({
    async getState(): Promise<ContractState> {
        const state = await client.getAccount(
            Address.parse(process.env.BETTING_CONTRACT_ADDRESS || ''),
            await client.getLastBlock()
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
    },

    async get(method: string, args: any[]) {
        const lastBlock = await client.getLastBlock();
        const result = await client.runMethod(
            Address.parse(process.env.BETTING_CONTRACT_ADDRESS || ''),
            method,
            args,
            lastBlock
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
            cell.bits.writeString(message.body);
        } else if (message.body instanceof Cell) {
            cell.bits.writeBytes(message.body.toBoc());
        }
        await client.sendMessage(cell.toBoc());
    },

    open<T extends Contract>(contract: T): OpenedContract<T> {
        return contract as OpenedContract<T>;
    }
});