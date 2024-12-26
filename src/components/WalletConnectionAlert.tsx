import { Wallet } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export const WalletConnectionAlert = () => {
  return (
    <Alert variant="destructive" className="mb-6">
      <Wallet className="h-4 w-4" />
      <AlertTitle>Wallet Connection Required</AlertTitle>
      <AlertDescription>
        You must connect your TON wallet before creating a bet. 
        Click the "Connect Wallet" button to proceed.
      </AlertDescription>
    </Alert>
  );
};