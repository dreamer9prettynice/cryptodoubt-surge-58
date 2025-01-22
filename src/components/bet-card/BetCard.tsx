import { Card } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";

interface BetCardProps {
  id: number;
  title: string;
  reason: string;
  poolAmount: string;
  expirationTime: Date;
  status: string;
}

export const BetCard = ({
  id,
  title,
  reason,
  poolAmount,
  expirationTime,
  status,
}: BetCardProps) => {
  const timeLeft = formatDistanceToNow(expirationTime, { addSuffix: true });

  return (
    <Card className="p-6 bg-betting-darker border-betting-primary hover:border-betting-primary/80 transition-colors">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-betting-primary">{title}</h3>
        <Badge variant={status === 'active' ? 'default' : 'secondary'}>
          {status}
        </Badge>
      </div>
      <p className="text-gray-400 mb-4">{reason}</p>
      <div className="flex justify-between items-center text-sm">
        <span className="text-betting-primary">Pool: {poolAmount} TON</span>
        <span className="text-gray-400">Expires {timeLeft}</span>
      </div>
    </Card>
  );
};