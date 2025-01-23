import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistance } from "date-fns";

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
  const timeLeft = formatDistance(expirationTime, new Date(), { addSuffix: true });

  return (
    <Card className="w-full bg-betting-dark border-betting-primary">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg text-betting-primary">{title}</CardTitle>
          <Badge variant={status === "active" ? "default" : "secondary"}>
            {status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-sm text-gray-400">{reason}</p>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400">Pool Amount:</span>
            <span className="text-betting-primary font-medium">{poolAmount} USDT</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400">Expires:</span>
            <span className="text-betting-primary font-medium">{timeLeft}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};