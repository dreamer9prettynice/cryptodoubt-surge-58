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
import { Loader2 } from "lucide-react";
import { useTonConnectUI } from "@tonconnect/ui-react";
import { useToast } from "@/hooks/use-toast";
import { createBet } from "@/contracts/betting";

export const betFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  reason: z.string().min(10, "Reason must be at least 10 characters"),
  amount: z.number().min(1, "Amount must be greater than 0"),
  expiration: z.number().min(1, "Expiration must be at least 1 hour"),
});

type BetFormValues = z.infer<typeof betFormSchema>;

interface CreateBetFormProps {
  onSubmit: (data: BetFormValues) => Promise<void>;
}

export const CreateBetForm = ({ onSubmit }: CreateBetFormProps) => {
  const [tonConnectUI] = useTonConnectUI();
  const { toast } = useToast();

  const form = useForm<BetFormValues>({
    resolver: zodResolver(betFormSchema),
    defaultValues: {
      title: "",
      reason: "",
      amount: undefined,
      expiration: undefined,
    },
  });

  const handleSubmit = async (data: BetFormValues) => {
    try {
      const result = await createBet(data.title, data.amount, data.expiration);
      
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
        title: "Success",
        description: "Bet created successfully",
      });

      await onSubmit(data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create bet",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
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

        <div className="space-y-4">
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
          
          {!tonConnectUI.connected && (
            <p className="text-sm text-center text-betting-primary/80">
              Connect your TON wallet to create a bet
            </p>
          )}
        </div>
      </form>
    </Form>
  );
};
