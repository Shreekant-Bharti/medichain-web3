import { Web3Storage } from "web3.storage";

const WEB3_STORAGE_TOKEN = import.meta.env.VITE_WEB3_STORAGE_TOKEN;

// Initialize Web3.Storage client
const getStorageClient = () => {
  if (!WEB3_STORAGE_TOKEN) {
    throw new Error("Web3.Storage token not configured");
  }
  return new Web3Storage({ token: WEB3_STORAGE_TOKEN });
};

/**
 * Upload encrypted data to IPFS via Web3.Storage
 */
export const uploadToIPFS = async (
  data: string,
  filename: string
): Promise<string> => {
  try {
    const client = getStorageClient();

    // Create a File object from the encrypted data
    const file = new File([data], filename, { type: "application/json" });

    // Upload to IPFS
    const cid = await client.put([file], {
      wrapWithDirectory: false,
    });

    return cid;
  } catch (error) {
    console.error("IPFS upload error:", error);
    throw new Error("Failed to upload to IPFS");
  }
};

/**
 * Retrieve data from IPFS
 */
export const retrieveFromIPFS = async (cid: string): Promise<string> => {
  try {
    const url = `https://${cid}.ipfs.w3s.link`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Failed to fetch from IPFS");
    }

    const data = await response.text();
    return data;
  } catch (error) {
    console.error("IPFS retrieval error:", error);
    throw new Error("Failed to retrieve from IPFS");
  }
};

/**
 * Upload medical record with encryption
 */
export interface MedicalRecord {
  patientName: string;
  dateOfBirth: string;
  bloodType: string;
  allergies: string[];
  medications: string[];
  diagnoses: string[];
  treatments: string[];
  documents: Array<{
    name: string;
    type: string;
    data: string; // base64
  }>;
  lastUpdated: string;
}

export const uploadMedicalRecord = async (
  record: MedicalRecord,
  encryptedData: string
): Promise<string> => {
  const filename = `medical-record-${Date.now()}.json`;
  return await uploadToIPFS(encryptedData, filename);
};

/**
 * Upload prescription details
 */
export interface PrescriptionDetails {
  medicineName: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
  warnings: string[];
  sideEffects: string[];
}

export const uploadPrescriptionDetails = async (
  details: PrescriptionDetails,
  encrypted: string
): Promise<string> => {
  const filename = `prescription-${Date.now()}.json`;
  return await uploadToIPFS(encrypted, filename);
};

/**
 * Alternative: Pinata Integration (if preferred over Web3.Storage)
 */
const PINATA_API_KEY = import.meta.env.VITE_PINATA_API_KEY;
const PINATA_SECRET_KEY = import.meta.env.VITE_PINATA_SECRET_KEY;

export const uploadToPinata = async (
  data: string,
  filename: string
): Promise<string> => {
  if (!PINATA_API_KEY || !PINATA_SECRET_KEY) {
    throw new Error("Pinata credentials not configured");
  }

  try {
    const formData = new FormData();
    const file = new File([data], filename, { type: "application/json" });
    formData.append("file", file);

    const response = await fetch(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      {
        method: "POST",
        headers: {
          pinata_api_key: PINATA_API_KEY,
          pinata_secret_api_key: PINATA_SECRET_KEY,
        },
        body: formData,
      }
    );

    const result = await response.json();
    return result.IpfsHash;
  } catch (error) {
    console.error("Pinata upload error:", error);
    throw new Error("Failed to upload to Pinata");
  }
};

export const retrieveFromPinata = async (cid: string): Promise<string> => {
  try {
    const url = `https://gateway.pinata.cloud/ipfs/${cid}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Failed to fetch from Pinata");
    }

    const data = await response.text();
    return data;
  } catch (error) {
    console.error("Pinata retrieval error:", error);
    throw new Error("Failed to retrieve from Pinata");
  }
};
