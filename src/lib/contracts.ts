import { ethers } from "ethers";
import type { ContractAddresses, NetworkConfig } from "@/types";

// Network configurations
export const NETWORKS: Record<number, NetworkConfig> = {
  80001: {
    chainId: 80001,
    name: "Polygon Mumbai",
    rpcUrl:
      import.meta.env.VITE_POLYGON_RPC_URL ||
      "https://rpc-mumbai.maticvigil.com",
    blockExplorer: "https://mumbai.polygonscan.com",
    nativeCurrency: {
      name: "MATIC",
      symbol: "MATIC",
      decimals: 18,
    },
  },
  137: {
    chainId: 137,
    name: "Polygon Mainnet",
    rpcUrl: "https://polygon-rpc.com",
    blockExplorer: "https://polygonscan.com",
    nativeCurrency: {
      name: "MATIC",
      symbol: "MATIC",
      decimals: 18,
    },
  },
  31337: {
    chainId: 31337,
    name: "Localhost",
    rpcUrl: "http://127.0.0.1:8545",
    blockExplorer: "",
    nativeCurrency: {
      name: "ETH",
      symbol: "ETH",
      decimals: 18,
    },
  },
};

// Contract addresses from environment variables
export const CONTRACT_ADDRESSES: ContractAddresses = {
  patientNFT: import.meta.env.VITE_PATIENT_NFT_ADDRESS || "",
  prescriptionContract:
    import.meta.env.VITE_PRESCRIPTION_CONTRACT_ADDRESS || "",
  doctorRegistry: import.meta.env.VITE_DOCTOR_REGISTRY_ADDRESS || "",
  pharmacyRegistry: import.meta.env.VITE_PHARMACY_REGISTRY_ADDRESS || "",
  governance: import.meta.env.VITE_GOVERNANCE_ADDRESS || "",
};

// Contract ABIs (simplified for key functions)
export const PATIENT_NFT_ABI = [
  "function mintPatientNFT(address patient) external returns (uint256)",
  "function addMedicalRecord(uint256 tokenId, string calldata ipfsHash) external",
  "function grantAccess(uint256 tokenId, address grantee, uint8 level) external",
  "function revokeAccess(uint256 tokenId, address grantee) external",
  "function grantEmergencyAccess(uint256 tokenId, address emergencyContact) external",
  "function getAccessLevel(uint256 tokenId, address accessor) external view returns (uint8)",
  "function getMedicalRecords(uint256 tokenId) external view returns (tuple(string ipfsHash, uint256 timestamp, address addedBy, bool isActive)[])",
  "function ownerOf(uint256 tokenId) external view returns (address)",
  "function balanceOf(address owner) external view returns (uint256)",
  "function tokenOfOwnerByIndex(address owner, uint256 index) external view returns (uint256)",
  "event PatientNFTMinted(uint256 indexed tokenId, address indexed patient)",
  "event MedicalRecordAdded(uint256 indexed tokenId, string ipfsHash, address indexed addedBy)",
  "event AccessGranted(uint256 indexed tokenId, address indexed grantee, uint8 level)",
  "event AccessRevoked(uint256 indexed tokenId, address indexed grantee)",
];

export const PRESCRIPTION_CONTRACT_ABI = [
  "function issuePrescription(uint256 patientTokenId, address patientAddress, string calldata medicineName, string calldata dosage, string calldata frequency, string calldata duration, uint8 category, string calldata ipfsHash, uint256 expiryDate) external returns (uint256)",
  "function dispenseMedicine(uint256 prescriptionId) external",
  "function invalidatePrescription(uint256 prescriptionId) external",
  "function verifyPrescription(uint256 prescriptionId) external view returns (bool, string memory)",
  "function getPrescription(uint256 prescriptionId) external view returns (tuple(uint256 id, uint256 patientTokenId, address patientAddress, address doctorAddress, address pharmacyAddress, string medicineName, string dosage, string frequency, string duration, uint8 category, string ipfsHash, uint256 issuedDate, uint256 expiryDate, uint8 status))",
  "function getPatientPrescriptions(uint256 patientTokenId) external view returns (uint256[])",
  "function getDoctorPrescriptions(address doctor) external view returns (uint256[])",
  "event PrescriptionIssued(uint256 indexed prescriptionId, uint256 indexed patientTokenId, address indexed doctor)",
  "event MedicineDispensed(uint256 indexed prescriptionId, address indexed pharmacy)",
  "event PrescriptionInvalidated(uint256 indexed prescriptionId)",
];

export const DOCTOR_REGISTRY_ABI = [
  "function registerDoctor(address doctorAddress, string calldata name, string calldata specialization, string calldata licenseNumber, string calldata hospitalAffiliation, string calldata metadataURI) external",
  "function verifyDoctor(address doctorAddress) external",
  "function revokeDoctor(address doctorAddress) external",
  "function isVerifiedDoctor(address doctorAddress) external view returns (bool)",
  "function getDoctor(address doctorAddress) external view returns (tuple(address doctorAddress, string name, string specialization, string licenseNumber, string hospitalAffiliation, bool isVerified, uint256 registrationDate, string metadataURI))",
  "function getAllDoctors() external view returns (address[])",
  "event DoctorRegistered(address indexed doctorAddress, string licenseNumber)",
  "event DoctorVerified(address indexed doctorAddress)",
  "event DoctorRevoked(address indexed doctorAddress)",
];

export const PHARMACY_REGISTRY_ABI = [
  "function registerPharmacy(address pharmacyAddress, string calldata name, string calldata licenseNumber, string calldata location, address owner) external",
  "function verifyPharmacy(address pharmacyAddress) external",
  "function revokePharmacy(address pharmacyAddress) external",
  "function isVerifiedPharmacy(address pharmacyAddress) external view returns (bool)",
  "function getPharmacy(address pharmacyAddress) external view returns (tuple(address pharmacyAddress, string name, string licenseNumber, string location, address owner, bool isVerified, uint256 registrationDate))",
  "function getAllPharmacies() external view returns (address[])",
  "event PharmacyRegistered(address indexed pharmacyAddress, string licenseNumber)",
  "event PharmacyVerified(address indexed pharmacyAddress)",
  "event PharmacyRevoked(address indexed pharmacyAddress)",
];

export const GOVERNANCE_ABI = [
  "function createProposal(string calldata description) external returns (uint256)",
  "function vote(uint256 proposalId, bool support) external",
  "function executeProposal(uint256 proposalId) external",
  "function cancelProposal(uint256 proposalId) external",
  "function getProposal(uint256 proposalId) external view returns (tuple(uint256 id, address proposer, string description, uint256 votesFor, uint256 votesAgainst, uint256 startTime, uint256 endTime, bool executed, bool cancelled))",
  "function getProposalState(uint256 proposalId) external view returns (uint8)",
  "function getVotingPower(address account) external view returns (uint256)",
  "function hasVoted(uint256 proposalId, address account) external view returns (bool)",
  "event ProposalCreated(uint256 indexed proposalId, address indexed proposer)",
  "event VoteCast(uint256 indexed proposalId, address indexed voter, bool support, uint256 weight)",
  "event ProposalExecuted(uint256 indexed proposalId)",
];

/**
 * Get contract instance
 */
export function getContract(
  contractName: keyof ContractAddresses,
  signerOrProvider: ethers.Signer | ethers.Provider
): ethers.Contract {
  const address = CONTRACT_ADDRESSES[contractName];
  if (!address) {
    throw new Error(`Contract address not found for ${contractName}`);
  }

  let abi: string[];
  switch (contractName) {
    case "patientNFT":
      abi = PATIENT_NFT_ABI;
      break;
    case "prescriptionContract":
      abi = PRESCRIPTION_CONTRACT_ABI;
      break;
    case "doctorRegistry":
      abi = DOCTOR_REGISTRY_ABI;
      break;
    case "pharmacyRegistry":
      abi = PHARMACY_REGISTRY_ABI;
      break;
    case "governance":
      abi = GOVERNANCE_ABI;
      break;
    default:
      throw new Error(`Unknown contract: ${contractName}`);
  }

  return new ethers.Contract(address, abi, signerOrProvider);
}

/**
 * Format transaction error message
 */
export function formatError(error: any): string {
  if (error.code === "ACTION_REJECTED") {
    return "Transaction rejected by user";
  }

  if (error.code === "INSUFFICIENT_FUNDS") {
    return "Insufficient funds for transaction";
  }

  if (error.reason) {
    return error.reason;
  }

  if (error.message) {
    // Extract revert reason from error message
    const match = error.message.match(/reason="([^"]*)"/);
    if (match) {
      return match[1];
    }
    return error.message;
  }

  return "Transaction failed";
}

/**
 * Get transaction explorer URL
 */
export function getExplorerUrl(chainId: number, hash: string): string {
  const network = NETWORKS[chainId];
  if (!network || !network.blockExplorer) {
    return "";
  }
  return `${network.blockExplorer}/tx/${hash}`;
}

/**
 * Format MATIC amount
 */
export function formatMatic(wei: bigint): string {
  return ethers.formatEther(wei);
}

/**
 * Parse MATIC amount to wei
 */
export function parseMatic(matic: string): bigint {
  return ethers.parseEther(matic);
}

/**
 * Estimate gas with buffer
 */
export async function estimateGasWithBuffer(
  contract: ethers.Contract,
  method: string,
  args: any[]
): Promise<bigint> {
  const estimated = await contract[method].estimateGas(...args);
  // Add 20% buffer
  return (estimated * 120n) / 100n;
}
