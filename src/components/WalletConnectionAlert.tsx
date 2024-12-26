import { Wallet } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export const WalletConnectionAlert = () => {
  return (
    <Alert variant="destructive" className="mb-6">
      <Wallet className="h-4 w-4" />
      <AlertTitle>Connect Wallet to Create Bet</AlertTitle>
      <AlertDescription>
        To create a bet, tap the "Create Bet" button. You'll be prompted to connect 
        your TON wallet. Once connected, you can proceed with setting up your bet.
      </AlertDescription>
    </Alert>
  );
};