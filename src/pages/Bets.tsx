import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useTonConnectUI } from "@tonconnect/ui-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { BetParticipationModal } from "@/components/bet-participation/BetParticipationModal";

const Bets = () => {
  const [tonConnectUI] = useTonConnectUI();
  const { toast } = useToast();
  const [selectedBet, setSelectedBet] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const bets = [
    {
      id: 1,
      title: "Bitcoin will reach 100k",
      amount: "1,000,000 TON",
      expiration: "24h remaining",
      participants: 12,
      poolAddress: "EQCD39VS5jcptHL8vMjEXrzGaRcCVYto7HUn4bpAOg8xqB2N",
    },
  ];

  const openParticipationModal = (bet: any) => {
    if (!tonConnectUI.connected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your TON wallet to participate",
        variant: "destructive",
      });
      return;
    }
    setSelectedBet(bet);
    setIsModalOpen(true);
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
                  onClick={() => openParticipationModal(bet)}
                  className="w-full bg-betting-primary hover:bg-betting-primary/80"
                >
                  Participate in Bet
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {selectedBet && (
        <BetParticipationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          betTitle={selectedBet.title}
          poolAmount={selectedBet.amount}
        />
      )}
    </div>
  );
};

export default Bets;