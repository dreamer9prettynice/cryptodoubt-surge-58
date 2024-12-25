import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect, useCallback } from "react";
import { useTonConnectUI } from "@tonconnect/ui-react";
import { Address } from "@ton/core";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Upload } from "lucide-react";

const Profile = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [tonConnectUI] = useTonConnectUI();
  const [tonWalletAddress, setTonWalletAddress] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

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

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: username,
        password: password,
      });

      if (error) throw error;

      setIsLoggedIn(true);
      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log in. Please check your credentials.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
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
        className="max-w-lg mx-auto"
      >
        {!isLoggedIn ? (
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-betting-primary to-betting-accent bg-clip-text text-transparent animate-glow">
                Welcome Back
              </h1>
              <p className="text-betting-primary/60 mt-2">
                Login to access your betting profile
              </p>
            </div>
            <div className="space-y-4 backdrop-blur-xl bg-white/5 p-6 rounded-lg border border-betting-primary/20">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  className="bg-betting-secondary/20 border-betting-primary/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="bg-betting-secondary/20 border-betting-primary/20"
                />
              </div>
              <Button
                onClick={handleLogin}
                disabled={isLoading}
                className="w-full bg-betting-primary hover:bg-betting-primary/80"
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "Login"
                )}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-24 h-24 bg-betting-secondary/20 rounded-full mx-auto mb-4 border-2 border-betting-primary/20 relative group">
                <Upload className="w-8 h-8 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-betting-primary/50 group-hover:text-betting-primary transition-colors" />
              </div>
              <h2 className="text-xl font-bold text-betting-primary">{username}</h2>
            </div>
            <div className="backdrop-blur-xl bg-white/5 p-6 rounded-lg border border-betting-primary/20">
              <Button
                onClick={handleWalletAction}
                disabled={isLoading}
                className="w-full bg-betting-primary hover:bg-betting-primary/80"
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : tonWalletAddress ? (
                  `Connected: ${formatAddress(tonWalletAddress)}`
                ) : (
                  "Connect TON Wallet"
                )}
              </Button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Profile;