
import React from 'react';
import { cn } from '@/lib/utils';

interface TargetInfoProps {
  ip: string;
  status: 'online' | 'vulnerable' | 'compromised' | 'offline';
  os?: string;
  ports?: Array<{ port: number; service: string; status: string }>;
}

const TargetInfo: React.FC<TargetInfoProps> = ({
  ip,
  status,
  os = 'Unknown',
  ports = [],
}) => {
  const getStatusColor = () => {
    switch(status) {
      case 'online':
        return 'bg-blue-500';
      case 'vulnerable':
        return 'bg-yellow-500';
      case 'compromised':
        return 'bg-cyber-green';
      case 'offline':
        return 'bg-cyber-red';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="cyber-window mb-4">
      <div className="scan-line"></div>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-cyber-green font-bold text-lg mb-1 flex items-center">
            TARGET: <span className="text-cyber-text ml-2">{ip}</span>
          </h3>
          <div className="flex items-center space-x-2 mb-3">
            <span>Status:</span>
            <div className="flex items-center">
              <div className={cn("h-2 w-2 rounded-full mr-2", getStatusColor())}></div>
              <span className="uppercase text-xs">{status}</span>
            </div>
          </div>
          <div className="text-sm">
            <div><span className="text-cyber-green/70">OS:</span> {os}</div>
          </div>
        </div>
        {ports.length > 0 && (
          <div className="ml-4 border-l border-cyber-green/30 pl-4 text-sm">
            <div className="text-cyber-green/70 mb-1">Open Ports:</div>
            <div className="grid grid-cols-3 gap-x-4 gap-y-1">
              {ports.map((port) => (
                <div key={port.port} className="flex justify-between">
                  <span>{port.port}/{port.service}</span>
                  <span className="text-cyber-green/50">{port.status}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TargetInfo;
