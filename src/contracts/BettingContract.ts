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
            .storeStringRefTail(initialData.betId)
            .storeStringRefTail(initialData.title)
            .storeCoins(toNano('0'))  // Initial total amount
            .storeCoins(toNano('0'))  // Initial yes amount
            .storeCoins(toNano('0'))  // Initial no amount
            .storeUint(initialData.expirationTime, 64)
            .storeAddress(initialData.creatorAddress)
            .storeStringRefTail('active')  // Initial status
            .storeDict(null)  // Empty participants dictionary
            .storeAddress(Address.parse('UQCoiSY0kAz82hVFaeh5d8gzdRy-j1nY2nbbG4dUM5y7ph2m'))  // Yes pool
            .storeAddress(Address.parse('UQBY-TCqDyLeyMdv-KHcwutKQTL9SLf5ByQ24zbNZKddAphP'))  // No pool
            .endCell();
        return new BettingContract(contractAddress(0, { code, data }), { code, data });
    }

    async sendDeploy(provider: ContractProvider, via: Sender) {
        await provider.internal(via, {
            value: toNano('0.05'),
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
                .storeUint(1, 32)  // op code for betting
                .storeStringRefTail(opts.choice)
                .endCell()
        });
    }

    async sendJoinBet(
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
                .storeUint(3, 32)  // op code for joining bet
                .storeStringRefTail(opts.choice)
                .storeCoins(opts.amount)
                .endCell()
        });
    }

    async sendResolve(
        provider: ContractProvider,
        via: Sender,
        outcome: 'yes' | 'no'
    ) {
        await provider.internal(via, {
            value: toNano('0.05'),
            bounce: true,
            body: beginCell()
                .storeUint(2, 32)  // op code for resolving
                .storeStringRefTail(outcome)
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

    async getParticipants(provider: ContractProvider) {
        const { stack } = await provider.get('get_participants', []);
        return stack.readCell();
    }
}