import { useContractRead, useContractWrite, useTransaction } from 'wagmi';
import { parseEther } from 'viem';
import { contractAbi } from '@/contracts/abi';

const CONTRACT_ADDRESS = 'YOUR_CONTRACT_ADDRESS';

export const useEthereumContract = () => {
  const { data: bets, isLoading: isLoadingBets } = useContractRead({
    abi: contractAbi,
    functionName: 'getAllBets',
  });

  const { write: createBet } = useContractWrite({
    abi: contractAbi,
    functionName: 'createBet',
  });

  const { write: participateInBet } = useContractWrite({
    abi: contractAbi,
    functionName: 'participateInBet',
  });

  const handleCreateBet = async (
    title: string,
    amount: number,
    expirationHours: number
  ) => {
    try {
      const tx = await createBet({
        args: [title, parseEther(amount.toString()), BigInt(expirationHours * 3600)],
      });
      return tx;
    } catch (error) {
      console.error('Error creating bet:', error);
      throw error;
    }
  };

  const handleParticipate = async (
    betId: string,
    choice: boolean,
    amount: number
  ) => {
    try {
      const tx = await participateInBet({
        args: [BigInt(betId), choice, parseEther(amount.toString())],
      });
      return tx;
    } catch (error) {
      console.error('Error participating in bet:', error);
      throw error;
    }
  };

  return {
    bets,
    isLoadingBets,
    createBet: handleCreateBet,
    participateInBet: handleParticipate,
  };
};