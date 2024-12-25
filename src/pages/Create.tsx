import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const Create = () => {
  return (
    <div className="min-h-screen bg-betting-dark text-white p-6 pb-20">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-lg mx-auto"
      >
        <h1 className="text-2xl font-bold mb-6">Create New Bet</h1>
        <form className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Enter bet title"
              className="bg-betting-secondary/20 border-betting-primary/20"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="reason">Reason</Label>
            <Textarea
              id="reason"
              placeholder="Explain your bet"
              className="bg-betting-secondary/20 border-betting-primary/20"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (USDT)</Label>
            <Input
              id="amount"
              type="number"
              placeholder="Enter bet amount"
              className="bg-betting-secondary/20 border-betting-primary/20"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="expiration">Expiration (hours)</Label>
            <Input
              id="expiration"
              type="number"
              placeholder="Enter expiration time"
              className="bg-betting-secondary/20 border-betting-primary/20"
            />
          </div>
          <Button className="w-full bg-betting-primary hover:bg-betting-primary/80">
            Create Bet
          </Button>
        </form>
      </motion.div>
    </div>
  );
};

export default Create;