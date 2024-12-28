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
        readonly config?: BettingConfig,
        readonly init?: { code: Cell; data: Cell }
    ) {}

    static createFromConfig(config: BettingConfig, code: Cell, workchain = 0) {
        const data = beginCell()
            .storeStringTail(config.betId)
            .storeStringTail(config.title)
            .storeCoins(config.amount)
            .storeUint(config.expirationTime, 64)
            .storeAddress(config.creatorAddress)
            .endCell();

        const init = { code, data };
        return new BettingContract(contractAddress(workchain, init), config, init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint = toNano('0.05')) {
        await provider.internal(via, {
            value,
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
                .storeUint(1, 32)
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
                .storeUint(2, 32)
                .storeStringTail(outcome)
                .endCell()
        });
    }
}