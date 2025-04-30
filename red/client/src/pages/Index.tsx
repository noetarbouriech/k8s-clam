
import React, { useState } from 'react';
import ExploitButton from '@/components/ExploitButton';
import { Terminal } from '@/components/Terminal';
import Header from '@/components/Header';
import KubernetesWindow from '@/components/KubernetesWindow';
import { toast } from 'sonner';

const Index = () => {
  const [targetStatus, setTargetStatus] = useState<'online' | 'vulnerable' | 'compromised' | 'offline'>('online');
  const [terminalRef, setTerminalRef] = useState<any>(null);

  const executeExploit = (name: string, command: string) => {
    toast.success(`Executing ${name} exploit`);
    
    if (name === 'Buffer Overflow') {
      setTimeout(() => {
        setTargetStatus('vulnerable');
        toast.warning('Target status changed to VULNERABLE');
      }, 1000);
    } else if (name === 'Remote Code Execution') {
      setTimeout(() => {
        setTargetStatus('compromised');
        toast.warning('Target status changed to COMPROMISED');
      }, 1000);
    } else if (name === 'Ransomware Deployment') {
      setTimeout(() => {
        setTargetStatus('compromised');
        toast.error('Target fully compromised - Ransomware deployed');
      }, 1000);
    }
    
    if (terminalRef && terminalRef.current) {
      terminalRef.current.executeCommand(command);
    }
  };

  const exploits = [
    {
      name: 'Port Scanner',
      type: 'vulnerability' as const,
      description: 'Scan common ports for open services',
      command: 'scan'
    },
    {
      name: 'Buffer Overflow',
      type: 'payload' as const,
      description: 'Exploit buffer overflow in service',
      command: 'exploit --name buffer_overflow --target 192.168.1.10 --port 80'
    },
    {
      name: 'Remote Code Execution',
      type: 'backdoor' as const,
      description: 'Execute code on target machine',
      command: 'exploit --name rce --target 192.168.1.10 --port 443'
    },
    {
      name: 'SQL Injection',
      type: 'vulnerability' as const,
      description: 'Exploit SQL injection vulnerability in web application',
      command: 'exploit --name sqli --target 192.168.1.10 --port 80'
    },
    {
      name: 'Privilege Escalation',
      type: 'payload' as const,
      description: 'Elevate privileges on compromised system',
      command: 'exploit --name privesc --target 192.168.1.10'
    },
    {
      name: 'Ransomware Deployment',
      type: 'backdoor' as const,
      description: 'Deploy ransomware on target system',
      command: 'deploy --type ransomware --target 192.168.1.10'
    }
  ];

  return (
    <div className="min-h-screen bg-cyber-black text-cyber-green p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <Header />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="cyber-window h-[calc(100vh-120px)]">
              <div className="scan-line"></div>
              <Terminal />
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <KubernetesWindow />
            <div className="cyber-window mb-6">
              <div className="scan-line"></div>
              <h2 className="text-lg font-bold mb-4 text-center">EXPLOIT ARSENAL</h2>
              <div className="grid grid-cols-2 gap-3">
                {exploits.map((exploit) => (
                  <ExploitButton
                    key={exploit.name}
                    name={exploit.name}
                    type={exploit.type}
                    description={exploit.description}
                    onExecute={() => executeExploit(exploit.name, exploit.command)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
