// Contract enums
export enum AccessLevel {
  NONE = 0,
  READ = 1,
  WRITE = 2,
  FULL = 3,
}

export enum PrescriptionStatus {
  ACTIVE = 0,
  DISPENSED = 1,
  EXPIRED = 2,
  INVALIDATED = 3,
}

export enum MedicineCategory {
  GENERAL = 0,
  CONTROLLED = 1,
  NARCOTIC = 2,
  ANTIBIOTIC = 3,
  EMERGENCY = 4,
}

export enum ProposalState {
  PENDING = 0,
  ACTIVE = 1,
  DEFEATED = 2,
  SUCCEEDED = 3,
  EXECUTED = 4,
  CANCELLED = 5,
}

// Contract structures
export interface MedicalRecord {
  ipfsHash: string;
  timestamp: bigint;
  addedBy: string;
  isActive: boolean;
}

export interface Prescription {
  id: bigint;
  patientTokenId: bigint;
  patientAddress: string;
  doctorAddress: string;
  pharmacyAddress: string;
  medicineName: string;
  dosage: string;
  frequency: string;
  duration: string;
  category: MedicineCategory;
  ipfsHash: string;
  issuedDate: bigint;
  expiryDate: bigint;
  status: PrescriptionStatus;
}

export interface Doctor {
  doctorAddress: string;
  name: string;
  specialization: string;
  licenseNumber: string;
  hospitalAffiliation: string;
  isVerified: boolean;
  registrationDate: bigint;
  metadataURI: string;
}

export interface Pharmacy {
  pharmacyAddress: string;
  name: string;
  licenseNumber: string;
  location: string;
  owner: string;
  isVerified: boolean;
  registrationDate: bigint;
}

export interface Proposal {
  id: bigint;
  proposer: string;
  description: string;
  votesFor: bigint;
  votesAgainst: bigint;
  startTime: bigint;
  endTime: bigint;
  executed: boolean;
  cancelled: boolean;
}

// Frontend types
export interface WalletState {
  address: string | null;
  chainId: number | null;
  isConnected: boolean;
  provider: any;
  signer: any;
}

export interface AccessGrant {
  grantedTo: string;
  level: AccessLevel;
  grantedAt: bigint;
}

export interface EncryptedFile {
  encryptedData: string;
  iv: string;
  salt: string;
}

export interface IPFSUploadResponse {
  cid: string;
  url: string;
}

export interface TransactionState {
  hash: string;
  status: "pending" | "confirmed" | "failed";
  error?: string;
}

export interface PatientInfo {
  tokenId: bigint;
  address: string;
  name?: string;
  age?: number;
  qrCode?: string;
}

export interface PrescriptionFormData {
  patientTokenId: string;
  patientAddress: string;
  medicineName: string;
  dosage: string;
  frequency: string;
  duration: string;
  category: MedicineCategory;
  notes?: string;
  expiryDays: number;
}

export interface MedicalRecordUploadData {
  file: File;
  description: string;
  recordType: string;
}

export interface NetworkConfig {
  chainId: number;
  name: string;
  rpcUrl: string;
  blockExplorer: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
}

export interface ContractAddresses {
  patientNFT: string;
  prescriptionContract: string;
  doctorRegistry: string;
  pharmacyRegistry: string;
  governance: string;
}

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PrescriptionHistoryItem {
  prescriptionId: string;
  medicineName: string;
  doctor: string;
  issuedDate: string;
  expiryDate: string;
  status: string;
  dispensedAt?: string;
}

export interface PatientAccessListItem {
  address: string;
  name?: string;
  role?: string;
  accessLevel: AccessLevel;
  grantedAt: string;
}

export interface PlatformStats {
  totalPatients: number;
  totalDoctors: number;
  totalPharmacies: number;
  totalPrescriptions: number;
  activePrescriptions: number;
  dispensedPrescriptions: number;
}
