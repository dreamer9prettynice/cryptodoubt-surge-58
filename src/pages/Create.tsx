import { motion } from "framer-motion";
import { CreateBetForm } from "@/components/create-bet/CreateBetForm";
import { useCreateBet } from "@/components/create-bet/useCreateBet";

const Create = () => {
  const { createBet } = useCreateBet();

  return (
    <div className="min-h-screen bg-betting-dark text-white p-6 pb-20">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-lg mx-auto"
      >
        <h1 className="text-2xl font-bold mb-6">Create New Bet</h1>
        <CreateBetForm onSubmit={createBet} />
      </motion.div>
    </div>
  );
};

export default Create;