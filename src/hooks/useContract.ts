import { useMemo } from "react";
import { ethers } from "ethers";
import { useWalletStore } from "@/store/walletStore";
import { getContract } from "@/lib/contracts";
import type { ContractAddresses } from "@/types";

/**
 * Hook to get contract instance
 */
export function useContract(contractName: keyof ContractAddresses) {
  const { signer, provider, isConnected } = useWalletStore();

  const contract = useMemo(() => {
    if (!isConnected) return null;

    const signerOrProvider = signer || provider;
    if (!signerOrProvider) return null;

    try {
      return getContract(contractName, signerOrProvider);
    } catch (error) {
      console.error(`Failed to get contract ${contractName}:`, error);
      return null;
    }
  }, [contractName, signer, provider, isConnected]);

  /**
   * Call read-only contract method
   */
  const read = async (method: string, ...args: any[]) => {
    if (!contract) {
      throw new Error("Contract not initialized");
    }

    try {
      return await contract[method](...args);
    } catch (error: any) {
      console.error(`Contract read error (${method}):`, error);
      throw new Error(error.reason || error.message || "Contract read failed");
    }
  };

  /**
   * Call state-changing contract method
   */
  const write = async (method: string, ...args: any[]) => {
    if (!contract) {
      throw new Error("Contract not initialized");
    }

    if (!signer) {
      throw new Error("Wallet not connected");
    }

    try {
      const tx = await contract[method](...args);
      return tx;
    } catch (error: any) {
      console.error(`Contract write error (${method}):`, error);

      if (error.code === "ACTION_REJECTED") {
        throw new Error("Transaction rejected by user");
      }

      throw new Error(error.reason || error.message || "Transaction failed");
    }
  };

  /**
   * Estimate gas for transaction
   */
  const estimateGas = async (
    method: string,
    ...args: any[]
  ): Promise<bigint> => {
    if (!contract) {
      throw new Error("Contract not initialized");
    }

    try {
      const estimated = await contract[method].estimateGas(...args);
      // Add 20% buffer
      return (estimated * 120n) / 100n;
    } catch (error: any) {
      console.error(`Gas estimation error (${method}):`, error);
      throw new Error(error.reason || error.message || "Gas estimation failed");
    }
  };

  /**
   * Listen to contract events
   */
  const on = (eventName: string, listener: (...args: any[]) => void) => {
    if (!contract) {
      throw new Error("Contract not initialized");
    }

    contract.on(eventName, listener);

    // Return cleanup function
    return () => {
      contract.off(eventName, listener);
    };
  };

  /**
   * Get past events
   */
  const queryFilter = async (
    eventName: string,
    fromBlock?: number,
    toBlock?: number
  ) => {
    if (!contract) {
      throw new Error("Contract not initialized");
    }

    try {
      return await contract.queryFilter(eventName, fromBlock, toBlock);
    } catch (error: any) {
      console.error(`Event query error (${eventName}):`, error);
      throw new Error(error.message || "Event query failed");
    }
  };

  return {
    contract,
    read,
    write,
    estimateGas,
    on,
    queryFilter,
    isReady: !!contract,
  };
}
