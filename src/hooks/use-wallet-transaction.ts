import { useTonConnectUI } from "@tonconnect/ui-react";
import { useToast } from "@/hooks/use-toast";

export const useWalletTransaction = () => {
  const [tonConnectUI] = useTonConnectUI();
  const { toast } = useToast();

  const handleTransaction = async (amount: number) => {
    try {
      if (!tonConnectUI.connected) {
        toast({
          title: "Wallet Not Connected",
          description: "Please connect your TON wallet to create a bet",
          variant: "destructive",
        });
        return false;
      }

      // Simulated transaction logic
      toast({
        title: "Transaction Confirmed",
        description: `Successfully prepared ${amount} USDT for betting`,
      });
      return true;
    } catch (error: any) {
      console.error("Transaction error:", error);
      toast({
        title: "Transaction Failed",
        description: error.message || "Failed to process transaction",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    handleTransaction,
    isWalletConnected: tonConnectUI.connected,
  };
};