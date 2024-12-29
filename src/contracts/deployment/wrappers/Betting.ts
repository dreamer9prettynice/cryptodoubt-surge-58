import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, toNano } from 'ton-core';

export type BettingConfig = {
    betId: string;
    title: string;
    amount: bigint;
    expirationTime: number;
    creatorAddress: Address;
};

export class Betting implements Contract {
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
        return new Betting(contractAddress(workchain, init), config, init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender) {
        await provider.internal(via, {
            value: toNano('0.05'),
            bounce: false,
            body: beginCell().endCell()
        });
    }

    async sendBet(provider: ContractProvider, via: Sender, opts: { amount: bigint; choice: 'yes' | 'no' }) {
        await provider.internal(via, {
            value: opts.amount,
            bounce: true,
            body: beginCell()
                .storeUint(1, 32)
                .storeStringTail(opts.choice)
                .endCell()
        });
    }
}