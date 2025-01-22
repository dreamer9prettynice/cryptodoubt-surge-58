import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BetParticipationModal } from "@/components/bet-participation/BetParticipationModal";
import { useState } from "react";
import { useBettingContract } from "@/hooks/useBettingContract";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { Database } from "@/integrations/supabase/types";

type Bet = Database['public']['Tables']['bets']['Row'];

const Bets = () => {
  const [selectedBet, setSelectedBet] = useState<Bet | null>(null);
  const { participate } = useBettingContract();

  const { data: bets, isLoading } = useQuery({
    queryKey: ["bets"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bets")
        .select("*")
        .eq("status", "active")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const handleParticipate = async (choice: string, amount: number) => {
    if (!selectedBet) return;
    
    const success = await participate(selectedBet.id, amount, choice as 'yes' | 'no');
    if (success) {
      setSelectedBet(null);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-betting-dark text-white p-6 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-betting-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-betting-dark text-white p-6 pb-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-lg mx-auto space-y-6"
      >
        <h1 className="text-2xl font-bold text-betting-primary">Active Bets</h1>
        
        <div className="space-y-4">
          {bets && bets.length > 0 ? (
            bets.map((bet) => (
              <motion.div
                key={bet.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-betting-secondary/20 backdrop-blur-lg rounded-lg p-6 border border-betting-primary/20"
              >
                <h3 className="text-xl font-semibold mb-2">{bet.title}</h3>
                {bet.reason && (
                  <p className="text-gray-400 text-sm mb-4">{bet.reason}</p>
                )}
                
                <div className="flex justify-between items-center text-sm text-gray-400 mb-4">
                  <span>Pool: {bet.total_amount} TON</span>
                  <span>
                    Expires: {new Date(bet.expiration_time).toLocaleDateString()}
                  </span>
                </div>
                
                <button
                  onClick={() => setSelectedBet(bet)}
                  className="w-full bg-betting-primary hover:bg-betting-primary/80 text-white py-2 rounded-lg transition-colors"
                >
                  Participate
                </button>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-400">
              <p>No active bets available at the moment.</p>
              <p className="mt-2">Create a new bet to get started!</p>
            </div>
          )}
        </div>

        {selectedBet && (
          <BetParticipationModal
            isOpen={!!selectedBet}
            onClose={() => setSelectedBet(null)}
            betTitle={selectedBet.title}
            poolAmount={`${selectedBet.total_amount} TON`}
            onParticipate={handleParticipate}
          />
        )}
      </motion.div>
    </div>
  );
};

export default Bets;