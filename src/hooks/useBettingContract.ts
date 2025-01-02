import { useState } from 'react';
import { useTonConnectUI } from '@tonconnect/ui-react';
import { getBettingContract, participateInBet, getBetStatus } from '../contracts/betting';
import { useToast } from './use-toast';
import { toNano } from '@ton/core';

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
            const result = await participateInBet(amount, choice);
            
            // Send transaction using TonConnect
            await tonConnectUI.sendTransaction({
                validUntil: Date.now() + 5 * 60 * 1000, // 5 minutes
                messages: [
                    {
                        address: result.contractAddress,
                        amount: result.amount.toString(),
                        payload: result.choice
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

    const getBetDetails = async () => {
        try {
            return await getBetStatus();
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