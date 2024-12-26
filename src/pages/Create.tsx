import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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

  const form = useForm<BetFormValues>({
    resolver: zodResolver(betFormSchema),
    defaultValues: {
      title: "",
      reason: "",
      amount: undefined,
      expiration: undefined,
    },
  });

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

      const expirationDate = new Date();
      expirationDate.setHours(expirationDate.getHours() + data.expiration);

      const { error } = await supabase.from("bets").insert({
        creator_id: user.id,
        title: data.title,
        reason: data.reason,
        expiration_time: expirationDate.toISOString(),
        total_amount: data.amount,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Your bet has been created",
      });

      navigate("/bets");
    } catch (error) {
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
                    <Textarea
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
              className="w-full bg-betting-primary hover:bg-betting-primary/80"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? "Creating..." : "Create Bet"}
            </Button>
          </form>
        </Form>
      </motion.div>
    </div>
  );
};

export default Create;