import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useTonConnectUI } from "@tonconnect/ui-react";
import { Loader2 } from "lucide-react";

const betFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  reason: z.string().min(10, "Reason must be at least 10 characters"),
  amount: z.number().min(1, "Amount must be greater than 0"),
  expiration: z.number().min(1, "Expiration must be at least 1 hour"),
});

type BetFormValues = z.infer<typeof betFormSchema>;

const Create = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [tonConnectUI] = useTonConnectUI();

  const form = useForm<BetFormValues>({
    resolver: zodResolver(betFormSchema),
    defaultValues: {
      title: "",
      reason: "",
      amount: undefined,
      expiration: undefined,
    },
  });

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

      // Here we would typically interact with a smart contract
      // For now, we'll simulate a successful transaction
      // In production, you would:
      // 1. Deploy a smart contract for the bet
      // 2. Generate a unique pool address for this bet
      // 3. Send the transaction to that address

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

  const onSubmit = async (data: BetFormValues) => {
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

      // After successful transaction, create the bet
      const { error } = await supabase.from("bets").insert({
        creator_id: user.id,
        title: data.title,
        reason: data.reason,
        expiration_time: expirationDate.toISOString(),
        total_amount: data.amount,
        // In production, these would come from the smart contract
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
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter bet title"
                      className="bg-betting-secondary/20 border-betting-primary/20"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reason</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Explain your bet"
                      className="bg-betting-secondary/20 border-betting-primary/20"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount (USDT)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter bet amount"
                      className="bg-betting-secondary/20 border-betting-primary/20"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="expiration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expiration (hours)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter expiration time"
                      className="bg-betting-secondary/20 border-betting-primary/20"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              className="w-full bg-betting-primary hover:bg-betting-primary/80 flex items-center justify-center gap-2"
              disabled={form.formState.isSubmitting || !tonConnectUI.connected}
            >
              {form.formState.isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Bet'
              )}
            </Button>
          </form>
        </Form>
      </motion.div>
    </div>
  );
};

export default Create;