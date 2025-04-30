import React, { useState, useRef, useEffect } from 'react';
import { Command } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface HistoryItem {
  command: string;
  output: string;
  type: 'info' | 'success' | 'error' | 'warning' | 'default';
}

interface TerminalProps {
  prompt?: string;
  initialOutput?: string;
  apiEndpoint?: string;
}

const Terminal: React.FC<TerminalProps> = ({ 
  prompt = "shell@target:~$",
  initialOutput = "// Connected to remote terminal. Type 'help' for available commands.\n",
  apiEndpoint = "http://localhost:3000"
}) => {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<HistoryItem[]>([
    { command: '', output: initialOutput, type: 'info' }
  ]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Format output based on type (string, object with stdout/stderr, etc.)
  const formatOutput = (output: any): string => {
    if (typeof output === 'string') return output;
    if (output?.stdout || output?.stderr) {
      return [
        output.stdout ? `STDOUT:\n${output.stdout}` : '',
        output.stderr ? `STDERR:\n${output.stderr}` : ''
      ].filter(Boolean).join('\n\n');
    }
    return JSON.stringify(output, null, 2);
  };

  // Load command history from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('terminalCommandHistory');
    if (savedHistory) {
      setCommandHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Check API connection on mount or when endpoint changes
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        const response = await fetch(`${apiEndpoint}/health`, {
          method: 'GET',
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }  
        setIsConnected(true);
      } catch (error) {
        setIsConnected(false);
        setHistory(prev => [...prev, {
          command: '',
          output: "⚠️ Warning: Unable to verify API connection. Commands may not work.",
          type: 'warning'
        }]);
        console.error('Connection check failed:', error);
      }
    };

    checkConnection();
  }, [apiEndpoint]);

  // Auto-scroll to bottom when history updates
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Update command history in localStorage when it changes
  const updateCommandHistory = (cmd: string) => {
    setCommandHistory(prev => {
      const newHistory = [cmd, ...prev.filter(c => c !== cmd).slice(0, 49)];
      localStorage.setItem('terminalCommandHistory', JSON.stringify(newHistory));
      return newHistory;
    });
  };

  const handleCommand = async (command: string) => {
    if (isLoading) return;
    
    const cmd = command.trim();
    if (cmd === 'clear') {
      setHistory([]);
      return;
    } else if (cmd === '' || cmd === ' ') {
      return;
    }

    setIsLoading(true);
    setHistory(prev => [...prev, { command: cmd, output: '', type: 'default' }]);
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);
      
      const response = await fetch(`${apiEndpoint}/exec`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ command: cmd }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || 
          errorData.error || 
          `API request failed with status ${response.status}`
        );
      }

      const data = await response.json();
      const output = formatOutput(data.output || data);
      
      setHistory(prev => {
        const newHistory = [...prev];
        const lastItem = newHistory[newHistory.length - 1];
        newHistory[newHistory.length - 1] = {
          ...lastItem,
          output: output,
          type: data.type || 'default'
        };
        return newHistory;
      });

      if (cmd !== '') {
        updateCommandHistory(cmd);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? 
        error.message : 
        'Failed to execute command';
      
      setHistory(prev => {
        const newHistory = [...prev];
        const lastItem = newHistory[newHistory.length - 1];
        newHistory[newHistory.length - 1] = {
          ...lastItem,
          output: `Error: ${errorMessage}`,
          type: 'error'
        };
        return newHistory;
      });
      
      toast.error(`Command failed: ${errorMessage}`);
    } finally {
      setIsLoading(false);
      setHistoryIndex(-1);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCommand(input);
      setInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex < commandHistory.length - 1 ? historyIndex + 1 : historyIndex;
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput('');
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const commands = ['help', 'clear', 'whoami', 'ls', 'cat', 'ping', 'scan'];
      const inputLower = input.toLowerCase();
      const match = commands.find(cmd => cmd.startsWith(inputLower));
      if (match) {
        setInput(match);
      }
    }
  };
  
  const focusInput = () => {
    inputRef.current?.focus();
  };

  return (
    <div 
      className="cyber-window w-full h-full flex flex-col" 
      onClick={focusInput}
    >
      <div className="flex justify-between mb-2 px-1">
        <div className="flex items-center">
          <Command className="h-4 w-4 mr-2 text-cyber-green" />
          <span className="text-xs text-cyber-green/70">
            TERMINAL v1.0 {!isConnected && "(Offline Mode)"}
          </span>
        </div>
        <div className="flex space-x-2">
          <div className={`h-2 w-2 rounded-full ${isConnected ? 'bg-cyber-green' : 'bg-cyber-red'}`}></div>
          <div className="h-2 w-2 bg-yellow-500 rounded-full"></div>
          <div className="h-2 w-2 bg-cyber-blue rounded-full"></div>
        </div>
      </div>
      
      <div 
        ref={terminalRef}
        className="flex-1 overflow-y-auto mb-2 terminal-output"
      >
        {history.map((item, i) => (
          <div key={i} className="mb-1">
            {item.command && (
              <div className="flex">
                <span className="text-cyber-green mr-2">{prompt}</span>
                <span>{item.command}</span>
              </div>
            )}
            {item.output && (
              <pre className={cn(
                item.type === 'error' ? 'text-cyber-red' :
                item.type === 'warning' ? 'text-yellow-500' :
                item.type === 'success' ? 'text-cyber-green' :
                'text-cyber-text',
                'font-mono text-sm whitespace-pre-wrap break-words'
              )}>
                {item.output}
              </pre>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex">
            <span className="text-cyber-green mr-2">{prompt}</span>
            <span className="blinking-cursor">_</span>
          </div>
        )}
      </div>
      
      <div className="mt-auto flex items-center">
        <span className="text-cyber-green mr-2 whitespace-nowrap">{prompt}</span>
        <input
          ref={inputRef}
          type="text"
          className="bg-transparent border-none outline-none flex-1 text-cyber-text terminal-prompt"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading || !isConnected}
          placeholder={!isConnected ? "Offline - API unavailable" : ""}
        />
      </div>
      <div className="scan-line"></div>
    </div>
  );
};

export { Terminal, type HistoryItem };