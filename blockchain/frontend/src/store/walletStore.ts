import { create } from "zustand";
import { ethers } from "ethers";
import type { WalletState } from "@/types";

interface WalletStore extends WalletState {
  connect: (provider: any) => Promise<void>;
  disconnect: () => void;
  switchNetwork: (chainId: number) => Promise<void>;
  updateAccount: (address: string) => void;
}

export const useWalletStore = create<WalletStore>((set, get) => ({
  address: null,
  chainId: null,
  isConnected: false,
  provider: null,
  signer: null,

  connect: async (provider: any) => {
    try {
      const ethersProvider = new ethers.BrowserProvider(provider);
      const signer = await ethersProvider.getSigner();
      const address = await signer.getAddress();
      const network = await ethersProvider.getNetwork();
      const chainId = Number(network.chainId);

      set({
        address,
        chainId,
        isConnected: true,
        provider: ethersProvider,
        signer,
      });

      // Store connection preference
      localStorage.setItem("walletConnected", "true");
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      throw error;
    }
  },

  disconnect: () => {
    set({
      address: null,
      chainId: null,
      isConnected: false,
      provider: null,
      signer: null,
    });
    localStorage.removeItem("walletConnected");
  },

  switchNetwork: async (chainId: number) => {
    const { provider } = get();
    if (!provider) {
      throw new Error("Wallet not connected");
    }

    try {
      // Request network switch
      await window.ethereum?.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: `0x${chainId.toString(16)}` }],
      });

      // Update chain ID
      const network = await provider.getNetwork();
      set({ chainId: Number(network.chainId) });
    } catch (error: any) {
      // Chain not added to wallet
      if (error.code === 4902) {
        throw new Error("Please add this network to your wallet");
      }
      throw error;
    }
  },

  updateAccount: (address: string) => {
    set({ address });
  },
}));
