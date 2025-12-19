import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useWalletStore } from "@/store/walletStore";
import { NETWORKS } from "@/lib/contracts";

declare global {
  interface Window {
    ethereum?: any;
  }
}

export function useWallet() {
  const {
    address,
    chainId,
    isConnected,
    provider,
    signer,
    connect,
    disconnect,
    switchNetwork,
    updateAccount,
  } = useWalletStore();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Connect to MetaMask
   */
  const connectMetaMask = async () => {
    if (!window.ethereum) {
      setError("MetaMask is not installed");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      await connect(window.ethereum);
    } catch (err: any) {
      setError(err.message || "Failed to connect wallet");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Connect to WalletConnect
   */
  const connectWalletConnect = async () => {
    // WalletConnect integration would go here
    // This requires @web3modal/ethers setup
    setError("WalletConnect not implemented yet");
  };

  /**
   * Check if on correct network
   */
  const isCorrectNetwork = (targetChainId: number = 80001) => {
    return chainId === targetChainId;
  };

  /**
   * Switch to target network
   */
  const switchToNetwork = async (targetChainId: number = 80001) => {
    if (!isConnected) {
      throw new Error("Wallet not connected");
    }

    setIsLoading(true);
    setError(null);

    try {
      await switchNetwork(targetChainId);
    } catch (err: any) {
      setError(err.message || "Failed to switch network");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Get network name
   */
  const getNetworkName = () => {
    if (!chainId) return "Unknown";
    return NETWORKS[chainId]?.name || `Chain ${chainId}`;
  };

  /**
   * Sign message
   */
  const signMessage = async (message: string): Promise<string> => {
    if (!signer) {
      throw new Error("Wallet not connected");
    }

    try {
      return await signer.signMessage(message);
    } catch (err: any) {
      if (err.code === "ACTION_REJECTED") {
        throw new Error("Signature rejected by user");
      }
      throw err;
    }
  };

  /**
   * Get balance
   */
  const getBalance = async (): Promise<string> => {
    if (!provider || !address) {
      return "0";
    }

    try {
      const balance = await provider.getBalance(address);
      return ethers.formatEther(balance);
    } catch (err) {
      console.error("Failed to get balance:", err);
      return "0";
    }
  };

  /**
   * Setup event listeners
   */
  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnect();
      } else {
        updateAccount(accounts[0]);
      }
    };

    const handleChainChanged = () => {
      // Reload page on network change (recommended by MetaMask)
      window.location.reload();
    };

    const handleDisconnect = () => {
      disconnect();
    };

    window.ethereum.on("accountsChanged", handleAccountsChanged);
    window.ethereum.on("chainChanged", handleChainChanged);
    window.ethereum.on("disconnect", handleDisconnect);

    return () => {
      window.ethereum?.removeListener("accountsChanged", handleAccountsChanged);
      window.ethereum?.removeListener("chainChanged", handleChainChanged);
      window.ethereum?.removeListener("disconnect", handleDisconnect);
    };
  }, [disconnect, updateAccount]);

  /**
   * Auto-reconnect on page load
   */
  useEffect(() => {
    const autoConnect = async () => {
      const wasConnected = localStorage.getItem("walletConnected");
      if (wasConnected === "true" && window.ethereum) {
        try {
          const accounts = await window.ethereum.request({
            method: "eth_accounts",
          });
          if (accounts.length > 0) {
            await connect(window.ethereum);
          }
        } catch (err) {
          console.error("Auto-connect failed:", err);
        }
      }
    };

    autoConnect();
  }, [connect]);

  return {
    // State
    address,
    chainId,
    isConnected,
    provider,
    signer,
    isLoading,
    error,
    // Actions
    connectMetaMask,
    connectWalletConnect,
    disconnect,
    switchToNetwork,
    isCorrectNetwork,
    getNetworkName,
    signMessage,
    getBalance,
  };
}
