import { useState } from 'react';
import { useTonConnectUI } from '@tonconnect/ui-react';
import { getBettingContract, participateInBet } from '../contracts/betting';
import { useToast } from './use-toast';

export const useBettingContract = () => {
    const [tonConnectUI] = useTonConnectUI();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const createBet = async (
        title: string,
        amount: number,
        expirationHours: number
    ) => {
        if (!tonConnectUI.connected) {
            toast({
                title: "Wallet not connected",
                description: "Please connect your TON wallet to create a bet",
                variant: "destructive"
            });
            return null;
        }

        setIsLoading(true);
        try {
            const contract = getBettingContract();
            
            toast({
                title: "Bet created",
                description: "Your bet has been created successfully"
            });

            return contract;
        } catch (error: any) {
            toast({
                title: "Error creating bet",
                description: error.message || "Failed to create bet",
                variant: "destructive"
            });
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    const participate = async (
        betId: number,
        amount: number,
        choice: 'yes' | 'no'
    ) => {
        if (!tonConnectUI.connected) {
            toast({
                title: "Wallet not connected",
                description: "Please connect your TON wallet to participate",
                variant: "destructive"
            });
            return false;
        }

        setIsLoading(true);
        try {
            const result = await participateInBet(betId, amount, choice);
            
            await tonConnectUI.sendTransaction({
                validUntil: Date.now() + 5 * 60 * 1000,
                messages: [
                    {
                        address: result.contractAddress,
                        amount: result.amount.toString(),
                    }
                ]
            });
            
            toast({
                title: "Participation successful",
                description: "You have successfully participated in the bet"
            });
            
            return true;
        } catch (error: any) {
            toast({
                title: "Error participating",
                description: error.message || "Failed to participate in bet",
                variant: "destructive"
            });
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const getBetDetails = async (betId: number) => {
        try {
            const contract = getBettingContract();
            return await contract.getBetInfo(provider, betId);
        } catch (error: any) {
            console.error("Error fetching bet details:", error);
            return null;
        }
    };

    return {
        createBet,
        participate,
        getBetDetails,
        isLoading
    };
};