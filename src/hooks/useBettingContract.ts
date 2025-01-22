import { useState } from 'react';
import { useTonConnectUI } from '@tonconnect/ui-react';
import { createBet, participateInBet } from '../contracts/betting';
import { useToast } from './use-toast';

export const useBettingContract = () => {
    const [tonConnectUI] = useTonConnectUI();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const connectWallet = async () => {
        try {
            await tonConnectUI.connectWallet();
        } catch (error: any) {
            toast({
                title: "Connection Failed",
                description: error.message || "Failed to connect wallet",
                variant: "destructive"
            });
        }
    };

    const createNewBet = async (
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
            const betData = await createBet(title, amount, expirationHours);
            
            await tonConnectUI.sendTransaction({
                validUntil: Date.now() + 5 * 60 * 1000,
                messages: [
                    {
                        address: betData.to,
                        amount: betData.amount.toString(),
                        payload: betData.payload.toBoc().toString('base64')
                    }
                ]
            });
            
            toast({
                title: "Success",
                description: "Your bet has been created successfully"
            });

            return betData;
        } catch (error: any) {
            toast({
                title: "Error",
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
            const participationData = await participateInBet(betId, amount, choice);
            
            await tonConnectUI.sendTransaction({
                validUntil: Date.now() + 5 * 60 * 1000,
                messages: [
                    {
                        address: participationData.to,
                        amount: participationData.amount.toString(),
                        payload: participationData.payload.toBoc().toString('base64')
                    }
                ]
            });
            
            toast({
                title: "Success",
                description: "You have successfully participated in the bet"
            });
            
            return true;
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to participate in bet",
                variant: "destructive"
            });
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        connectWallet,
        createNewBet,
        participate,
        isLoading,
        isConnected: tonConnectUI.connected
    };
};