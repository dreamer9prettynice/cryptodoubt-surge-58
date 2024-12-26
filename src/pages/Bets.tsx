import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useTonConnectUI } from "@tonconnect/ui-react";
import { useToast } from "@/hooks/use-toast";

const Bets = () => {
  const [tonConnectUI] = useTonConnectUI();
  const { toast } = useToast();

  const bets = [
    {
      id: 1,
      title: "Bitcoin will reach 100k",
      amount: "1,000,000 USDT",
      expiration: "24h remaining",
      participants: 12,
      poolAddress: "EQCD39VS5jcptHL8vMjEXrzGaRcCVYto7HUn4bpAOg8xqB2N", // Example pool address
    },
    // Add more mock bets here
  ];

  const handleBetParticipation = async (betId: number, poolAddress: string) => {
    if (!tonConnectUI.connected) {
      toast({
        title: "Wallet Connection Required",
        description: "Please connect your TON wallet to participate in this bet",
        variant: "destructive",
      });
      return;
    }

    try {
      // Simulated transaction for now
      // In production, this would interact with a smart contract
      toast({
        title: "Processing bet participation",
        description: "Please confirm the transaction in your wallet",
      });

      // Here you would typically:
      // 1. Call the smart contract to participate in the bet
      // 2. Send TON to the pool address
      // 3. Update the UI after successful transaction

      toast({
        title: "Success",
        description: "You have successfully participated in the bet",
      });
    } catch (error: any) {
      console.error("Error participating in bet:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to participate in bet",
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
        <h1 className="text-2xl font-bold mb-6">Active Bets</h1>
        <div className="space-y-4">
          {bets.map((bet) => (
            <motion.div
              key={bet.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-betting-secondary/20 backdrop-blur-lg rounded-lg p-4 border border-betting-primary/20"
            >
              <h3 className="text-lg font-semibold text-betting-primary">
                {bet.title}
              </h3>
              <div className="mt-2 space-y-1 text-sm text-gray-300">
                <p>Pool: {bet.amount}</p>
                <p>Time left: {bet.expiration}</p>
                <p>Participants: {bet.participants}</p>
              </div>
              <div className="mt-4">
                <Button
                  onClick={() => handleBetParticipation(bet.id, bet.poolAddress)}
                  className="w-full bg-betting-primary hover:bg-betting-primary/80"
                >
                  Participate in Bet
                </Button>
                <p className="text-xs text-center mt-2 text-betting-primary/80">
                  {!tonConnectUI.connected 
                    ? "Connect your TON wallet to participate in this bet"
                    : "Click to participate in this bet"}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Bets;