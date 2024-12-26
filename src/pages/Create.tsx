import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { WalletConnectionAlert } from "@/components/WalletConnectionAlert";
import { CreateBetForm } from "@/components/CreateBetForm";
import { useWalletTransaction } from "@/hooks/use-wallet-transaction";
import type { z } from "zod";

type BetFormValues = z.infer<typeof import("@/components/CreateBetForm").betFormSchema>;

const Create = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { handleTransaction, isWalletConnected } = useWalletTransaction();

  const onSubmit = async (data: BetFormValues) => {
    try {
      // Wallet connection check
      if (!isWalletConnected) {
        toast({
          title: "Wallet Required",
          description: "You must connect your TON wallet to create a bet",
          variant: "destructive",
        });
        return;
      }

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

      // After successful transaction, create the bet
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

  return (
    <div className="min-h-screen bg-betting-dark text-white p-6 pb-20">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-lg mx-auto"
      >
        <h1 className="text-2xl font-bold mb-6">Create New Bet</h1>
        
        {!isWalletConnected && <WalletConnectionAlert />}

        <CreateBetForm 
          onSubmit={onSubmit}
          isWalletConnected={isWalletConnected}
          isSubmitting={false}
        />
      </motion.div>
    </div>
  );
};

export default Create;