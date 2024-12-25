import { Home, List, PlusCircle, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export const BottomNav = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-betting-dark/80 backdrop-blur-lg border-t border-betting-primary/20">
      <div className="flex justify-around items-center h-16">
        <Link
          to="/"
          className={`flex flex-col items-center space-y-1 ${
            isActive("/") ? "text-betting-primary" : "text-gray-400"
          }`}
        >
          <Home size={24} />
          <span className="text-xs">Home</span>
        </Link>
        <Link
          to="/bets"
          className={`flex flex-col items-center space-y-1 ${
            isActive("/bets") ? "text-betting-primary" : "text-gray-400"
          }`}
        >
          <List size={24} />
          <span className="text-xs">Bets</span>
        </Link>
        <Link
          to="/create"
          className={`flex flex-col items-center space-y-1 ${
            isActive("/create") ? "text-betting-primary" : "text-gray-400"
          }`}
        >
          <PlusCircle size={24} />
          <span className="text-xs">Create</span>
        </Link>
        <Link
          to="/profile"
          className={`flex flex-col items-center space-y-1 ${
            isActive("/profile") ? "text-betting-primary" : "text-gray-400"
          }`}
        >
          <User size={24} />
          <span className="text-xs">Profile</span>
        </Link>
      </div>
    </nav>
  );
};