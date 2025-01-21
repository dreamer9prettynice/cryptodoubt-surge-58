import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useTonConnectUI } from "@tonconnect/ui-react";
import { CreateBetForm } from "@/components/create-bet/CreateBetForm";
import { Database } from "@/integrations/supabase/types";

type Bet = Database['public']['Tables']['bets']['Insert'];

const Create = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [tonConnectUI] = useTonConnectUI();

  const handleTransaction = async (amount: number) => {
    try {
      if (!tonConnectUI.connected) {
        toast({
          title: "Wallet not connected",
          description: "Please connect your TON wallet first",
          variant: "destructive",
        });
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

  const onSubmit = async (data: any) => {
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

      // First, attempt the transaction
      const transactionSuccess = await handleTransaction(data.amount);
      if (!transactionSuccess) return;

      const expirationDate = new Date();
      expirationDate.setHours(expirationDate.getHours() + data.expiration);

      const betData: Bet = {
        creator_id: user.id,
        title: data.title,
        reason: data.reason,
        expiration_time: expirationDate.toISOString(),
        total_amount: data.amount,
        contract_address: "simulated_contract_address",
        pool_address: "simulated_pool_address",
      };

      // After successful transaction, create the bet
      const { error } = await supabase
        .from("bets")
        .insert(betData);

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

  return (
    <div className="min-h-screen bg-betting-dark text-white p-6 pb-20">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-lg mx-auto"
      >
        <h1 className="text-2xl font-bold mb-6">Create New Bet</h1>
        <CreateBetForm onSubmit={onSubmit} />
      </motion.div>
    </div>
  );
};

export default Create;