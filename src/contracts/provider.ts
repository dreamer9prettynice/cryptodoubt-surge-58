import { 
    Address, 
    Cell, 
    ContractProvider, 
    Sender, 
    OpenedContract,
    ContractState,
    SendMode,
    Transaction,
    beginCell,
    Contract
} from '@ton/core';
import { TonClient4 } from '@ton/ton';

export const createCustomProvider = (client: TonClient4): ContractProvider => ({
    async getState(): Promise<ContractState> {
        const block = await client.getLastBlock();
        const contractAddress = process.env.REACT_APP_BETTING_CONTRACT_ADDRESS || '';
        const parsedAddress = Address.parse(contractAddress);
        console.log('Getting state for contract:', parsedAddress.toString());
        
        const state = await client.getAccount(
            parsedAddress.toString(),
            Number(block.last.seqno) // Convert seqno to number
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
        const contractAddress = process.env.REACT_APP_BETTING_CONTRACT_ADDRESS || '';
        const parsedAddress = Address.parse(contractAddress);
        console.log('Running method:', method, 'with args:', args);
        
        const result = await client.runMethod(
            parsedAddress.toString(),
            Number(block.last.seqno), // Convert seqno to number
            method,
            args
        );
        return { stack: result.reader };
    },

    async external(message: Cell) {
        console.log('Sending external message');
        await client.sendMessage(message.toBoc());
    },

    async internal(via: Sender, message: { 
        value: string | bigint,
        bounce?: boolean,
        sendMode?: SendMode,
        body?: string | Cell
    }) {
        let messageCell: Cell;
        if (typeof message.body === 'string') {
            messageCell = beginCell()
                .storeUint(0, 32)
                .storeBuffer(Buffer.from(message.body))
                .endCell();
        } else if (message.body instanceof Cell) {
            messageCell = message.body;
        } else {
            messageCell = beginCell().endCell();
        }
        
        console.log('Sending internal message');
        await client.sendMessage(messageCell.toBoc());
    },

    async getTransactions(
        address: Address,
        lt: bigint,
        hash: Buffer
    ): Promise<Transaction[]> {
        console.log('Getting transactions for address:', address.toString());
        const transactions = await client.getAccountTransactions(
            address.toString(),
            lt.toString(),
            hash.toString('base64')
        );
        
        return transactions.map(transaction => {
            const tx = transaction.tx;
            return {
                ...tx,
                lt: BigInt(tx.lt || '0'),
                prevLt: undefined
            } as Transaction;
        });
    },

    open<T extends Contract>(contract: T): OpenedContract<T> {
        return {
            address: contract.address,
            init: undefined,
            balance: BigInt(0),
            get: this.get.bind(this),
            external: this.external.bind(this),
            internal: this.internal.bind(this)
        } as OpenedContract<T>;
    }
});