import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

const Bets = () => {
  const { data: bets, isLoading } = useQuery({
    queryKey: ["bets"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bets")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
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
        {!bets?.length && (
          <p className="text-center text-gray-400">No active bets found</p>
        )}
      </div>
    </div>
  );
};

export default Bets;