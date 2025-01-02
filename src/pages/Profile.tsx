import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useCallback } from "react";
import { useTonConnectUI } from "@tonconnect/ui-react";
import { Address } from "@ton/core";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Wallet } from "lucide-react";
import { BettingHistory } from "@/components/profile/BettingHistory";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AuthForm } from "@/components/profile/AuthForm";

const Profile = () => {
  const [tonWalletAddress, setTonWalletAddress] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [tonConnectUI] = useTonConnectUI();
  const { toast } = useToast();

  const { data: userData } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const { data } = await supabase.auth.getUser();
      return data.user;
    },
  });

  const handleWalletConnection = useCallback((address: string) => {
    setTonWalletAddress(address);
    toast({
      title: "Wallet Connected",
      description: "Your TON wallet has been connected successfully!",
    });
    setIsLoading(false);
  }, [toast]);

  const handleWalletDisconnection = useCallback(() => {
    setTonWalletAddress(null);
    toast({
      title: "Wallet Disconnected",
      description: "Your TON wallet has been disconnected.",
    });
    setIsLoading(false);
  }, [toast]);

  useEffect(() => {
    const checkWalletConnection = async () => {
      if (tonConnectUI.account?.address) {
        handleWalletConnection(tonConnectUI.account?.address);
      }
    };

    checkWalletConnection();

    const unsubscribe = tonConnectUI.onStatusChange((wallet) => {
      if (wallet) {
        handleWalletConnection(wallet.account.address);
      } else {
        handleWalletDisconnection();
      }
    });

    return () => {
      unsubscribe();
    };
  }, [tonConnectUI, handleWalletConnection, handleWalletDisconnection]);

  const handleWalletAction = async () => {
    setIsLoading(true);
    if (tonConnectUI.connected) {
      await tonConnectUI.disconnect();
    } else {
      await tonConnectUI.openModal();
    }
  };

  const formatAddress = (address: string) => {
    const tempAddress = Address.parse(address).toString();
    return `${tempAddress.slice(0, 4)}...${tempAddress.slice(-4)}`;
  };

  return (
    <div className="min-h-screen bg-betting-dark text-white p-6 pb-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-lg mx-auto space-y-6"
      >
        {userData && <ProfileHeader email={userData.email || ''} />}

        <div className="backdrop-blur-xl bg-white/5 p-6 rounded-lg border border-betting-primary/20">
          <Button
            onClick={handleWalletAction}
            disabled={isLoading}
            className="w-full bg-betting-primary hover:bg-betting-primary/80 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <Wallet className="h-4 w-4" />
                {tonWalletAddress
                  ? `Connected: ${formatAddress(tonWalletAddress)}`
                  : "Connect TON Wallet"}
              </>
            )}
          </Button>
        </div>

        {!userData && <AuthForm />}

        {userData && <BettingHistory userId={userData.id} />}
      </motion.div>
    </div>
  );
};

export default Profile;