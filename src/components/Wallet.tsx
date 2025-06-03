import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Button } from "@/components/ui/button";
import { Wallet, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Extend Window interface to include ethereum property
declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: boolean;
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
    };
  }
}


const WalletConnect = () => {
  const { user, updateWallet } = useAuth();
  const [isConnecting, setIsConnecting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [hasMetaMask, setHasMetaMask] = useState<boolean | null>(null);
  
  // Has wallet address already been connected?
  const hasWallet = !!user?.walletAddress;

  // Check for MetaMask on component mount
  useEffect(() => {
    setHasMetaMask(!!window.ethereum?.isMetaMask);
  }, []);

  const connectMetaMask = async () => {
    // Reset error state
    setErrorMessage(null);

    // Check if MetaMask is installed
    if (!window.ethereum) {
      setErrorMessage('MetaMask not detected! Please install MetaMask to connect your wallet.');
      return;
    }

    try {
      setIsConnecting(true);
      
      // Request account access using ethers.js
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      
      if (accounts.length > 0) {
        const address = accounts[0];
        
        // Call your backend endpoint to store the wallet address
        await updateWallet(address);
        
        console.log('Wallet connected:', address);
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      setErrorMessage('Failed to connect wallet. Please try again.');
    } finally {
      setIsConnecting(false);
    }
  };

  // Format address for display (0x1234...5678)
  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // If MetaMask is not detected, show install button
  if (hasMetaMask === false) {
    return (
      <div>
        <a 
          href="https://metamask.io/download/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-amber-500 text-white px-3 py-2 rounded-md hover:bg-amber-600"
        >
          <Wallet className="h-4 w-4" />
          Install MetaMask
        </a>
        <p className="text-xs text-white/70 mt-1">MetaMask is required to connect your wallet</p>
      </div>
    );
  }

  return (
    <div>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={connectMetaMask}
              disabled={isConnecting || hasWallet}
              className="flex items-center gap-2"
            >
              {isConnecting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Wallet className="h-4 w-4" />
              )}
              
              {hasWallet 
                ? `Connected: ${formatAddress(user!.walletAddress!)}`
                : "Connect MetaMask"
              }
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {hasWallet 
              ? `Full address: ${user!.walletAddress}`
              : "Connect your Ethereum wallet with MetaMask"
            }
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      {errorMessage && (
        <div className="flex items-center gap-1 text-red-300 text-sm mt-2">
          <AlertCircle className="h-3 w-3" />
          <p>{errorMessage}</p>
        </div>
      )}
    </div>
  );
};

export default WalletConnect;