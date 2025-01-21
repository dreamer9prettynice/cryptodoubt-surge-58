import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useTonConnectUI } from "@tonconnect/ui-react";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { participateInBet } from "@/contracts/betting";

interface BetParticipationModalProps {
  isOpen: boolean;
  onClose: () => void;
  betTitle: string;
  poolAmount: string;
  onParticipate: (choice: string, amount: number) => Promise<void>;
}

export const BetParticipationModal = ({
  isOpen,
  onClose,
  betTitle,
  poolAmount,
  onParticipate,
}: BetParticipationModalProps) => {
  const [tonConnectUI] = useTonConnectUI();
  const { toast } = useToast();
  const [choice, setChoice] = useState<string>("yes");
  const [amount, setAmount] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const calculatePotentialWinnings = () => {
    const betAmount = parseFloat(amount) || 0;
    return (betAmount * 1.8).toFixed(2);
  };

  const handleSubmit = async () => {
    if (!amount || isNaN(parseFloat(amount))) return;
    
    setIsSubmitting(true);
    try {
      const result = await participateInBet(1, parseFloat(amount), choice as 'yes' | 'no'); // Added betId parameter
      
      await tonConnectUI.sendTransaction({
        validUntil: Date.now() + 5 * 60 * 1000,
        messages: [
          {
            address: result.contractAddress,
            amount: result.amount.toString(),
          }
        ]
      });

      await onParticipate(choice, parseFloat(amount));
      toast({
        title: "Success",
        description: "Successfully participated in bet",
      });
      onClose();
    } catch (error: any) {
      console.error("Error participating in bet:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to participate in bet",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-betting-dark border-betting-primary/20">
        <DialogHeader>
          <DialogTitle className="text-betting-primary">Participate in Bet</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold text-betting-primary">{betTitle}</h3>
            <p className="text-sm text-gray-400">Current Pool: {poolAmount}</p>
          </div>

          <div className="space-y-3">
            <Label>Choose Your Side</Label>
            <RadioGroup
              defaultValue="yes"
              value={choice}
              onValueChange={setChoice}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="yes" />
                <Label htmlFor="yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="no" />
                <Label htmlFor="no">No</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-3">
            <Label>Bet Amount (USDT)</Label>
            <Input
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-betting-secondary/20 border-betting-primary/20"
            />
            {amount && (
              <p className="text-sm text-betting-primary">
                Potential Winnings: {calculatePotentialWinnings()} USDT
              </p>
            )}
          </div>

          <Button
            onClick={handleSubmit}
            disabled={!tonConnectUI.connected || isSubmitting || !amount}
            className="w-full bg-betting-primary hover:bg-betting-primary/80"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              'Confirm Participation'
            )}
          </Button>

          {!tonConnectUI.connected && (
            <p className="text-sm text-center text-betting-primary/80">
              Connect your TON wallet to participate in this bet
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};