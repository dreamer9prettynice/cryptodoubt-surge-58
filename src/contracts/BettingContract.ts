import { 
    Address, 
    beginCell, 
    Cell, 
    Contract, 
    contractAddress, 
    ContractProvider, 
    Sender, 
    SendMode,
    toNano 
} from '@ton/core';

export type BettingConfig = {
    betId: string;
    title: string;
    amount: bigint;
    expirationTime: number;
    creatorAddress: Address;
};

export class BettingContract implements Contract {
    constructor(
        readonly address: Address,
        readonly init?: { code: Cell; data: Cell }
    ) {}

    static createForDeploy(code: Cell, initialData: BettingConfig): BettingContract {
        const data = beginCell()
            .storeStringTail(initialData.betId)
            .storeStringTail(initialData.title)
            .storeCoins(initialData.amount)
            .storeUint(initialData.expirationTime, 64)
            .storeAddress(initialData.creatorAddress)
            .endCell();
        return new BettingContract(contractAddress(0, { code, data }), { code, data });
    }

    async sendDeploy(provider: ContractProvider, via: Sender) {
        await provider.internal(via, {
            value: toNano('0.05'), // Initial balance for contract
            bounce: false,
            body: beginCell().endCell(),
        });
    }

    async sendBet(
        provider: ContractProvider,
        via: Sender,
        opts: {
            amount: bigint;
            choice: 'yes' | 'no';
        }
    ) {
        await provider.internal(via, {
            value: opts.amount,
            bounce: true,
            body: beginCell()
                .storeUint(1, 32) // op code for betting
                .storeStringTail(opts.choice)
                .endCell()
        });
    }

    async getStatus(provider: ContractProvider) {
        const { stack } = await provider.get('get_status', []);
        return {
            totalAmount: stack.readBigNumber(),
            yesAmount: stack.readBigNumber(),
            noAmount: stack.readBigNumber(),
            status: stack.readString(),
            expirationTime: stack.readNumber()
        };
    }

    async resolveOutcome(
        provider: ContractProvider,
        via: Sender,
        outcome: 'yes' | 'no'
    ) {
        await provider.internal(via, {
            value: toNano('0.05'),
            bounce: true,
            body: beginCell()
                .storeUint(2, 32) // op code for resolving
                .storeStringTail(outcome)
                .endCell()
        });
    }
}