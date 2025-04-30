
import React from 'react';
import { AppWindow, ShieldAlert } from 'lucide-react';

const KubernetesWindow = () => {
  return (
    <div className="cyber-window mb-6">
      <div className="scan-line"></div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <ShieldAlert className="h-4 w-4 mr-2 text-cyber-red" />
          <span className="text-xs text-cyber-red/70">KUBERNETES SECURITY ASSESSMENT</span>
        </div>
        <div className="flex space-x-2">
          <div className="h-2 w-2 bg-cyber-red rounded-full animate-pulse"></div>
          <div className="h-2 w-2 bg-yellow-500 rounded-full"></div>
          <div className="h-2 w-2 bg-cyber-green rounded-full"></div>
        </div>
      </div>
      
      <div className="font-mono text-sm text-cyber-text">
        <p className="text-cyber-red mb-2">[!] Running kube-bench security assessment...</p>
        <p className="text-cyber-text mb-1">[FAIL] 1.1.12 Ensure that the etcd data directory ownership is set to etcd:etcd</p>
        <p className="text-cyber-text mb-1">[WARN] 1.2.10 Ensure that the admission control plugin SecurityContextDeny is set</p>
        <p className="text-cyber-text mb-1">[PASS] 1.1.1 Ensure that the API server pod specification file permissions are set to 644</p>
        <p className="text-cyber-red mb-2">[FAIL] 1.3.6 Ensure that the RotateKubeletServerCertificate argument is set to true</p>
        <p className="text-yellow-500 mb-1">== Summary ==</p>
        <p className="text-cyber-text mb-1">45 Total Controls, 28 Passed, 12 Warnings, 5 Failures</p>
        <p className="text-cyber-red">!! Remediation Required - Multiple Critical Security Controls Failed</p>
      </div>
    </div>
  );
};

export default KubernetesWindow;
