import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useTonConnectUI } from "@tonconnect/ui-react";
import { Loader2 } from "lucide-react";
import { useBettingContract } from "@/hooks/useBettingContract";

interface BetParticipationModalProps {
  isOpen: boolean;
  onClose: () => void;
  betTitle: string;
  poolAmount: string;
}

export const BetParticipationModal = ({
  isOpen,
  onClose,
  betTitle,
  poolAmount,
}: BetParticipationModalProps) => {
  const [tonConnectUI] = useTonConnectUI();
  const { participate, isLoading } = useBettingContract();
  const [choice, setChoice] = useState<string>("yes");
  const [amount, setAmount] = useState<string>("");

  const calculatePotentialWinnings = () => {
    const betAmount = parseFloat(amount) || 0;
    return (betAmount * 1.8).toFixed(2); // 80% return example
  };

  const handleSubmit = async () => {
    if (!amount || isNaN(parseFloat(amount))) return;
    
    try {
      await participate(parseFloat(amount), choice as 'yes' | 'no');
      onClose();
    } catch (error) {
      console.error("Error participating in bet:", error);
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
            disabled={!tonConnectUI.connected || isLoading || !amount}
            className="w-full bg-betting-primary hover:bg-betting-primary/80"
          >
            {isLoading ? (
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