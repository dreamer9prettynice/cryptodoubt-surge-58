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
        const state = await client.getAccount(Address.parse(process.env.BETTING_CONTRACT_ADDRESS || ''));
        return {
            balance: BigInt(state.account.balance.coins),
            last: {
                lt: BigInt(state.account.last?.lt || '0'),
                hash: Buffer.from(state.account.last?.hash || '', 'base64')
            },
            state: state.account.state.type === 'active' ? {
                type: 'active',
                code: Buffer.from(state.account.state.code || '', 'base64'),
                data: Buffer.from(state.account.state.data || '', 'base64')
            } : state.account.state.type === 'frozen' ? {
                type: 'frozen',
                stateHash: Buffer.from(state.account.state.stateHash, 'base64')
            } : {
                type: 'uninit'
            }
        };
    },

    async get(method: string, args: any[]) {
        const result = await client.runMethod(
            Address.parse(process.env.BETTING_CONTRACT_ADDRESS || ''),
            method,
            args
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
        if (message.body instanceof Cell) {
            cell.writeCell(message.body);
        } else if (message.body) {
            cell.bits.writeString(message.body);
        }
        await client.sendMessage(cell.toBoc());
    },

    async open<T extends Contract>(contract: T): Promise<OpenedContract<T>> {
        return contract as OpenedContract<T>;
    }
});