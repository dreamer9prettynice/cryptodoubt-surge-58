import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

const Profile = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  return (
    <div className="min-h-screen bg-betting-dark text-white p-6 pb-20">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-lg mx-auto"
      >
        {!isLoggedIn ? (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold">Login</h1>
            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  placeholder="Enter username"
                  className="bg-betting-secondary/20 border-betting-primary/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter password"
                  className="bg-betting-secondary/20 border-betting-primary/20"
                />
              </div>
              <Button
                onClick={() => setIsLoggedIn(true)}
                className="w-full bg-betting-primary hover:bg-betting-primary/80"
              >
                Login
              </Button>
            </form>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-24 h-24 bg-betting-secondary/20 rounded-full mx-auto mb-4" />
              <h2 className="text-xl font-bold">Username</h2>
            </div>
            <Button
              onClick={() => setIsConnected(!isConnected)}
              className="w-full bg-betting-primary hover:bg-betting-primary/80"
            >
              {isConnected ? "Disconnect Wallet" : "Connect TON Wallet"}
            </Button>
            {isConnected && (
              <div className="bg-betting-secondary/20 backdrop-blur-lg rounded-lg p-4 border border-betting-primary/20">
                <p className="text-sm text-gray-300">
                  Wallet: 0x1234...5678
                </p>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Profile;