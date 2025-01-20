import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Routes, Route } from "react-router-dom";
import { BottomNav } from "./components/BottomNav";
import Index from "./pages/Index";
import Bets from "./pages/Bets";
import Create from "./pages/Create";
import Profile from "./pages/Profile";

const App = () => {
  return (
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <div className="min-h-screen bg-betting-dark">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/bets" element={<Bets />} />
          <Route path="/create" element={<Create />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
        <BottomNav />
      </div>
    </TooltipProvider>
  );
};

export default App;