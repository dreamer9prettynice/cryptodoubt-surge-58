import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import { BottomNav } from "./components/BottomNav";
import Index from "./pages/Index";
import Bets from "./pages/Bets";
import Create from "./pages/Create";
import Profile from "./pages/Profile";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
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
    </QueryClientProvider>
  );
};

export default App;