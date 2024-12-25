import { motion } from "framer-motion";

const Bets = () => {
  const bets = [
    {
      id: 1,
      title: "Bitcoin will reach 100k",
      amount: "1,000,000 USDT",
      expiration: "24h remaining",
      participants: 12,
    },
    // Add more mock bets here
  ];

  return (
    <div className="min-h-screen bg-betting-dark text-white p-6 pb-20">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-lg mx-auto"
      >
        <h1 className="text-2xl font-bold mb-6">Active Bets</h1>
        <div className="space-y-4">
          {bets.map((bet) => (
            <motion.div
              key={bet.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-betting-secondary/20 backdrop-blur-lg rounded-lg p-4 border border-betting-primary/20"
            >
              <h3 className="text-lg font-semibold text-betting-primary">
                {bet.title}
              </h3>
              <div className="mt-2 space-y-1 text-sm text-gray-300">
                <p>Pool: {bet.amount}</p>
                <p>Time left: {bet.expiration}</p>
                <p>Participants: {bet.participants}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Bets;