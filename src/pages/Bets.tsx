import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
        {bets?.map((bet) => (
          <Card key={bet.id} className="bg-betting-dark border-betting-primary/20">
            <CardHeader>
              <CardTitle className="text-betting-primary">{bet.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400">{bet.reason}</p>
              <div className="mt-4 flex justify-between text-sm">
                <span className="text-betting-primary">Pool: {bet.total_amount} USDT</span>
                <span className="text-gray-400">
                  Expires: {new Date(bet.expiration_time).toLocaleDateString()}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
        {!bets?.length && (
          <p className="text-center text-gray-400">No active bets found</p>
        )}
      </div>
    </div>
  );
};

export default Bets;