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

const betFormSchema = z.object({
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

  const form = useForm<BetFormValues>({
    resolver: zodResolver(betFormSchema),
    defaultValues: {
      title: "",
      reason: "",
      amount: undefined,
      expiration: undefined,
    },
  });

  return (
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