
import React from 'react';
import { Hash } from 'lucide-react';

const Header: React.FC = () => {
  const currentTime = new Date().toLocaleTimeString();
  
  return (
    <header className="flex justify-between items-center mb-4 py-2 border-b border-cyber-green/30">
      <div className="flex items-center">
        <Hash className="h-5 w-5 mr-2 text-cyber-green" />
        <h1 className="text-xl font-bold text-cyber-green">PHANTOM<span className="text-cyber-text">SHELL</span></h1>
      </div>
      
      <div className="flex items-center text-sm">
        <div className="mr-4 text-cyber-green/70">
          <span className="tracking-wider">{currentTime}</span>
        </div>
        
        <div className="flex items-center">
          <div className="h-2 w-2 bg-cyber-green rounded-full mr-2 animate-pulse"></div>
          <span className="text-xs">CONNECTED</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
