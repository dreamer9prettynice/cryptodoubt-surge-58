import { Address, Contract, ContractProvider, TupleReader } from '@ton/core';

export class BettingContract implements Contract {
    constructor(readonly address: Address) {}

    async getBetInfo(provider: ContractProvider, betId: number) {
        const { stack } = await provider.get('get_bet_info', [{type: 'int', value: betId}]);
        return {
            id: stack.readNumber(),
            totalYesAmount: stack.readBigNumber(),
            totalNoAmount: stack.readBigNumber(),
            endTime: stack.readNumber(),
            isResolved: stack.readBoolean()
        };
    }

    async getUserBetAmount(provider: ContractProvider, userAddress: Address, betId: number) {
        const { stack } = await provider.get('get_user_bet_amount', [
            {type: 'slice', value: userAddress},
            {type: 'int', value: betId}
        ]);
        return {
            yesAmount: stack.readBigNumber(),
            noAmount: stack.readBigNumber()
        };
    }
}