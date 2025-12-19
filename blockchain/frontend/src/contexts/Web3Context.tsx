import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { BrowserProvider, Contract, JsonRpcSigner } from "ethers";
import { toast } from "sonner";
import {
  PATIENT_NFT_ABI,
  DOCTOR_REGISTRY_ABI,
  PRESCRIPTION_CONTRACT_ABI,
} from "@/contracts/abis";

// Contract addresses from environment
const PATIENT_NFT_ADDRESS = import.meta.env.VITE_PATIENT_NFT_ADDRESS;
const DOCTOR_REGISTRY_ADDRESS = import.meta.env.VITE_DOCTOR_REGISTRY_ADDRESS;
const PRESCRIPTION_CONTRACT_ADDRESS = import.meta.env
  .VITE_PRESCRIPTION_CONTRACT_ADDRESS;
const CHAIN_ID = parseInt(import.meta.env.VITE_CHAIN_ID || "11155111");

interface Web3ContextType {
  account: string | null;
  chainId: number | null;
  provider: BrowserProvider | null;
  signer: JsonRpcSigner | null;
  patientNFT: Contract | null;
  doctorRegistry: Contract | null;
  prescriptionContract: Contract | null;
  isConnected: boolean;
  isConnecting: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  switchNetwork: () => Promise<void>;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error("useWeb3 must be used within Web3Provider");
  }
  return context;
};

interface Web3ProviderProps {
  children: ReactNode;
}

export const Web3Provider: React.FC<Web3ProviderProps> = ({ children }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [signer, setSigner] = useState<JsonRpcSigner | null>(null);
  const [patientNFT, setPatientNFT] = useState<Contract | null>(null);
  const [doctorRegistry, setDoctorRegistry] = useState<Contract | null>(null);
  const [prescriptionContract, setPrescriptionContract] =
    useState<Contract | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const isConnected = !!account && !!signer;

  // Initialize contracts
  const initializeContracts = async (signer: JsonRpcSigner) => {
    try {
      const patientNFTContract = new Contract(
        PATIENT_NFT_ADDRESS!,
        PATIENT_NFT_ABI,
        signer
      );

      const doctorRegistryContract = new Contract(
        DOCTOR_REGISTRY_ADDRESS!,
        DOCTOR_REGISTRY_ABI,
        signer
      );

      const prescriptionContractInstance = new Contract(
        PRESCRIPTION_CONTRACT_ADDRESS!,
        PRESCRIPTION_CONTRACT_ABI,
        signer
      );

      setPatientNFT(patientNFTContract);
      setDoctorRegistry(doctorRegistryContract);
      setPrescriptionContract(prescriptionContractInstance);
    } catch (error) {
      console.error("Contract initialization error:", error);
      toast.error("Failed to initialize contracts");
    }
  };

  // Connect wallet
  const connectWallet = async () => {
    if (!window.ethereum) {
      toast.error("Please install MetaMask or another Web3 wallet");
      return;
    }

    setIsConnecting(true);

    try {
      const provider = new BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      const network = await provider.getNetwork();
      const signer = await provider.getSigner();

      setProvider(provider);
      setAccount(accounts[0]);
      setChainId(Number(network.chainId));
      setSigner(signer);

      // Initialize contracts
      await initializeContracts(signer);

      // Check if on correct network
      if (Number(network.chainId) !== CHAIN_ID) {
        toast.error(
          `Please switch to the correct network (Chain ID: ${CHAIN_ID})`
        );
      } else {
        toast.success("Wallet connected successfully");
      }

      // Save to localStorage
      localStorage.setItem("walletConnected", "true");
    } catch (error: any) {
      console.error("Wallet connection error:", error);
      toast.error(error?.message || "Failed to connect wallet");
    } finally {
      setIsConnecting(false);
    }
  };

  // Disconnect wallet
  const disconnectWallet = () => {
    setAccount(null);
    setProvider(null);
    setSigner(null);
    setChainId(null);
    setPatientNFT(null);
    setDoctorRegistry(null);
    setPrescriptionContract(null);
    localStorage.removeItem("walletConnected");
    toast.success("Wallet disconnected");
  };

  // Switch network
  const switchNetwork = async () => {
    if (!window.ethereum) return;

    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: `0x${CHAIN_ID.toString(16)}` }],
      });
      toast.success("Network switched successfully");
    } catch (error: any) {
      if (error.code === 4902) {
        toast.error("Please add this network to your wallet");
      } else {
        toast.error("Failed to switch network");
      }
    }
  };

  // Listen to account changes
  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnectWallet();
      } else {
        setAccount(accounts[0]);
        toast.info("Account changed");
      }
    };

    const handleChainChanged = (chainId: string) => {
      setChainId(parseInt(chainId, 16));
      window.location.reload();
    };

    window.ethereum.on("accountsChanged", handleAccountsChanged);
    window.ethereum.on("chainChanged", handleChainChanged);

    return () => {
      window.ethereum?.removeListener("accountsChanged", handleAccountsChanged);
      window.ethereum?.removeListener("chainChanged", handleChainChanged);
    };
  }, []);

  // Auto-connect if previously connected
  useEffect(() => {
    const wasConnected = localStorage.getItem("walletConnected");
    if (wasConnected === "true" && window.ethereum) {
      connectWallet();
    }
  }, []);

  const value = {
    account,
    chainId,
    provider,
    signer,
    patientNFT,
    doctorRegistry,
    prescriptionContract,
    isConnected,
    isConnecting,
    connectWallet,
    disconnectWallet,
    switchNetwork,
  };

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
};

// Type augmentation for window.ethereum
declare global {
  interface Window {
    ethereum?: any;
  }
}
