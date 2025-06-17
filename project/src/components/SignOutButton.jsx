import React from 'react';
import { LogOut } from 'lucide-react';

function SignOutButton({ setIsAuthenticated }) {
  const handleSignOut = () => {
    setIsAuthenticated(false);
  };

  return (
    <button
      onClick={handleSignOut}
      className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all duration-300 backdrop-blur-sm border border-white/20"
    >
      <LogOut size={18} />
      <span className="font-medium">Sign Out</span>
    </button>
  );
}

export default SignOutButton;