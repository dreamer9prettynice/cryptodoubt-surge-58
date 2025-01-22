import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BetCard } from "@/components/bet-card/BetCard";
import { Loader2 } from "lucide-react";
import { Database } from "@/integrations/supabase/types";
import { motion } from "framer-motion";

type Bet = Database['public']['Tables']['bets']['Row'];

const Bets = () => {
  const { data: bets, isLoading } = useQuery({
    queryKey: ["bets"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bets")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Bet[];
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-betting-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-betting-dark p-6 pb-20">
      <h1 className="text-2xl font-bold text-betting-primary mb-6">Active Bets</h1>
      <div className="grid gap-6">
        {bets?.map((bet) => (
          <motion.div
            key={bet.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <BetCard
              id={Number(bet.id)}
              title={bet.title}
              reason={bet.reason || ""}
              poolAmount={bet.total_amount.toString()}
              expirationTime={new Date(bet.expiration_time)}
              status={bet.status}
            />
          </motion.div>
        ))}
        {!bets?.length && (
          <p className="text-center text-gray-400">No active bets found</p>
        )}
      </div>
    </div>
  );
};

export default Bets;