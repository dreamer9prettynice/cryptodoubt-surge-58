import { motion } from "framer-motion";

const Index = () => {
  return (
    <div className="min-h-screen bg-betting-dark text-white p-6 pb-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-lg mx-auto space-y-6"
      >
        <h1 className="text-4xl font-bold text-betting-primary">
          Crypto Betting Platform
        </h1>
        <p className="text-gray-300">
          Welcome to the next generation of crypto betting. Create or join bets,
          challenge other players, and win big with TON blockchain integration.
        </p>
        <div className="bg-betting-secondary/20 backdrop-blur-lg rounded-lg p-6 border border-betting-primary/20">
          <h2 className="text-xl font-semibold mb-4">How it works</h2>
          <ul className="space-y-4">
            <li className="flex items-start space-x-3">
              <span className="text-betting-primary">1.</span>
              <span>Connect your TON wallet</span>
            </li>
            <li className="flex items-start space-x-3">
              <span className="text-betting-primary">2.</span>
              <span>Create or join existing bets</span>
            </li>
            <li className="flex items-start space-x-3">
              <span className="text-betting-primary">3.</span>
              <span>Wait for the outcome and collect your winnings</span>
            </li>
          </ul>
        </div>
      </motion.div>
    </div>
  );
};

export default Index;