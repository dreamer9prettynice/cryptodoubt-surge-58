import { useState } from 'react';
import { useTonConnectUI } from '@tonconnect/ui-react';
import { createBettingContract, participateInBet, getBetStatus } from '../contracts/betting';
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
            const walletAddress = tonConnectUI.account?.address;
            if (!walletAddress) throw new Error("No wallet address found");

            const contract = await createBettingContract({
                betId: `bet_${Date.now()}`,
                title,
                expirationHours,
                creatorAddress: walletAddress
            });

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
        contractAddress: string,
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
            await participateInBet(
                contractAddress,
                amount,
                choice
            );
            
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

    const getBetDetails = async (contractAddress: string) => {
        try {
            return await getBetStatus(contractAddress);
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