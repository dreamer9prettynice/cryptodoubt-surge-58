import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect, useCallback } from "react";
import { useTonConnectUI } from "@tonconnect/ui-react";
import { Address } from "@ton/core";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Upload, Wallet } from "lucide-react";
import { BettingHistory } from "@/components/profile/BettingHistory";
import { useQuery } from "@tanstack/react-query";

const Profile = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [tonConnectUI] = useTonConnectUI();
  const [tonWalletAddress, setTonWalletAddress] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Fetch user data using React Query
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

  const handleSignUp = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      toast({
        title: "Account created!",
        description: "Please check your email to verify your account.",
      });
      
      // Switch back to sign in view
      setIsSignUp(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      setIsLoggedIn(true);
      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to sign in. Please check your credentials.",
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
        className="max-w-lg mx-auto space-y-6"
      >
        <div className="text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-betting-primary to-betting-accent bg-clip-text text-transparent animate-glow">
            {isLoggedIn ? "Profile" : isSignUp ? "Create Account" : "Welcome Back"}
          </h1>
          <p className="text-betting-primary/60 mt-2">
            {isLoggedIn
              ? "Manage your betting profile"
              : isSignUp
              ? "Sign up to start betting"
              : "Login to access your betting profile"}
          </p>
        </div>

        {/* Wallet Connection Section */}
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

        {/* Authentication Section */}
        {!isLoggedIn && (
          <div className="space-y-4 backdrop-blur-xl bg-white/5 p-6 rounded-lg border border-betting-primary/20">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
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
              onClick={isSignUp ? handleSignUp : handleSignIn}
              disabled={isLoading}
              className="w-full bg-betting-primary hover:bg-betting-primary/80"
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                isSignUp ? "Sign Up" : "Sign In"
              )}
            </Button>
            <div className="text-center">
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-betting-primary/60 hover:text-betting-primary text-sm"
              >
                {isSignUp
                  ? "Already have an account? Sign In"
                  : "Don't have an account? Sign Up"}
              </button>
            </div>
          </div>
        )}

        {/* Profile Section */}
        {isLoggedIn && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-24 h-24 bg-betting-secondary/20 rounded-full mx-auto mb-4 border-2 border-betting-primary/20 relative group">
                <Upload className="w-8 h-8 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-betting-primary/50 group-hover:text-betting-primary transition-colors" />
              </div>
              <h2 className="text-xl font-bold text-betting-primary">
                {email}
              </h2>
            </div>
            
            {/* Add Betting History Component */}
            {userData && <BettingHistory userId={userData.id} />}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Profile;