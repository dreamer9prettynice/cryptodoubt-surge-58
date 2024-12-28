import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from '@ton/core';

export type BettingConfig = {
    betId: string;
    title: string;
    amount: bigint;
    expirationTime: number;
    creatorAddress: Address;
};

export class Betting implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromConfig(config: BettingConfig, code: Cell, workchain = 0) {
        const data = beginCell()
            .storeStringTail(config.betId)
            .storeStringTail(config.title)
            .storeCoins(config.amount)
            .storeCoins(0n) // yes_amount
            .storeCoins(0n) // no_amount
            .storeUint(config.expirationTime, 64)
            .storeAddress(config.creatorAddress)
            .storeStringTail("active")
            .storeDict(null)
            .endCell();

        const init = { code, data };
        return new Betting(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender) {
        await provider.internal(via, {
            value: "0.05", // Initial balance
            bounce: false
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
                .storeUint(1, 32) // op for betting
                .storeStringTail(opts.choice)
                .endCell()
        });
    }

    async sendResolve(
        provider: ContractProvider,
        via: Sender,
        outcome: 'yes' | 'no'
    ) {
        await provider.internal(via, {
            value: "0.05",
            bounce: true,
            body: beginCell()
                .storeUint(2, 32) // op for resolving
                .storeStringTail(outcome)
                .endCell()
        });
    }
}