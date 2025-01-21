import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2 } from "lucide-react";
import { Database } from "@/integrations/supabase/types";

type BetParticipant = Database['public']['Tables']['bet_participants']['Row'] & {
  bets: Database['public']['Tables']['bets']['Row'] | null
};

export const BettingHistory = ({ userId }: { userId: string }) => {
  const { data: bets, isLoading } = useQuery({
    queryKey: ["bettingHistory", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bet_participants")
        .select(`
          amount,
          choice,
          created_at,
          bets (
            title,
            status,
            winner
          )
        `)
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as BetParticipant[];
    },
    enabled: !!userId,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-betting-primary" />
      </div>
    );
  }

  return (
    <div className="backdrop-blur-xl bg-white/5 p-6 rounded-lg border border-betting-primary/20">
      <h2 className="text-xl font-bold text-betting-primary mb-4">
        Betting History
      </h2>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Bet Title</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Choice</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Result</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bets?.map((bet, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">
                  {bet.bets?.title || "Unknown"}
                </TableCell>
                <TableCell>{bet.amount} TON</TableCell>
                <TableCell className="capitalize">{bet.choice}</TableCell>
                <TableCell className="capitalize">
                  {bet.bets?.status || "Unknown"}
                </TableCell>
                <TableCell>
                  {bet.bets?.winner
                    ? bet.bets.winner === bet.choice
                      ? "Won"
                      : "Lost"
                    : "Pending"}
                </TableCell>
              </TableRow>
            ))}
            {!bets?.length && (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  No betting history found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};