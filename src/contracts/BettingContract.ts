import { Address, Contract, ContractProvider, TupleReader, beginCell } from '@ton/core';

export class BettingContract implements Contract {
    constructor(readonly address: Address) {}

    async getBetInfo(provider: ContractProvider, betId: number) {
        const { stack } = await provider.get('get_bet_info', [
            { type: 'int', value: BigInt(betId) }
        ]);
        return {
            id: Number(stack.readBigNumber()),
            totalYesAmount: stack.readBigNumber(),
            totalNoAmount: stack.readBigNumber(),
            endTime: Number(stack.readBigNumber()),
            isResolved: stack.readBoolean()
        };
    }

    async getUserBetAmount(provider: ContractProvider, userAddress: Address, betId: number) {
        const { stack } = await provider.get('get_user_bet_amount', [
            { type: 'slice', cell: beginCell().storeAddress(userAddress).endCell() },
            { type: 'int', value: BigInt(betId) }
        ]);
        return {
            yesAmount: stack.readBigNumber(),
            noAmount: stack.readBigNumber()
        };
    }
}