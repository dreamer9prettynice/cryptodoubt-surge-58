import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useTonConnectUI } from "@tonconnect/ui-react";
import type { BetFormValues } from "./CreateBetForm";

export function useCreateBet() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [tonConnectUI] = useTonConnectUI();

  const handleTransaction = async (amount: number) => {
    try {
      if (!tonConnectUI.connected) {
        return false;
      }

      // Simulated successful transaction
      toast({
        title: "Transaction confirmed",
        description: `Successfully transferred ${amount} USDT`,
      });
      return true;
    } catch (error: any) {
      console.error("Transaction error:", error);
      toast({
        title: "Transaction failed",
        description: error.message || "Failed to process transaction",
        variant: "destructive",
      });
      return false;
    }
  };

  const createBet = async (data: BetFormValues) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to create a bet",
          variant: "destructive",
        });
        return;
      }

      const transactionSuccess = await handleTransaction(data.amount);
      if (!transactionSuccess) return;

      const expirationDate = new Date();
      expirationDate.setHours(expirationDate.getHours() + data.expiration);

      const { error } = await supabase.from("bets").insert({
        creator_id: user.id,
        title: data.title,
        reason: data.reason,
        expiration_time: expirationDate.toISOString(),
        total_amount: data.amount,
        contract_address: "simulated_contract_address",
        pool_address: "simulated_pool_address",
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Your bet has been created",
      });

      navigate("/bets");
    } catch (error: any) {
      console.error("Error creating bet:", error);
      toast({
        title: "Error",
        description: "Failed to create bet. Please try again.",
        variant: "destructive",
      });
    }
  };

  return { createBet };
}