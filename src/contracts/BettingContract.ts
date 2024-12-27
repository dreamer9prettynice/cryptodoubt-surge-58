import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from '@ton/core';

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
            .storeString(initialData.betId)
            .storeString(initialData.title)
            .storeCoins(initialData.amount)
            .storeUint(initialData.expirationTime, 64)
            .storeAddress(initialData.creatorAddress)
            .endCell();
        return new BettingContract(contractAddress(0, { code, data }), { code, data });
    }

    async sendDeploy(provider: ContractProvider, via: Sender) {
        await provider.internal(via, {
            value: "0.01", // Initial balance for contract
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
            value: opts.amount.toString(),
            bounce: true,
            body: beginCell()
                .storeUint(1, 32) // op code for betting
                .storeString(opts.choice)
                .endCell()
        });
    }
}