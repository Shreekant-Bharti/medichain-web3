import axios from "axios";
import type { IPFSUploadResponse } from "@/types";

const WEB3_STORAGE_TOKEN = import.meta.env.VITE_WEB3_STORAGE_TOKEN || "";
const PINATA_API_KEY = import.meta.env.VITE_PINATA_API_KEY || "";
const PINATA_SECRET_KEY = import.meta.env.VITE_PINATA_SECRET_KEY || "";

/**
 * Upload file to IPFS using Web3.Storage
 */
export async function uploadToWeb3Storage(
  file: File
): Promise<IPFSUploadResponse> {
  if (!WEB3_STORAGE_TOKEN) {
    throw new Error("Web3.Storage token not configured");
  }

  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await axios.post(
      "https://api.web3.storage/upload",
      formData,
      {
        headers: {
          Authorization: `Bearer ${WEB3_STORAGE_TOKEN}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    const cid = response.data.cid;
    return {
      cid,
      url: `https://w3s.link/ipfs/${cid}`,
    };
  } catch (error) {
    console.error("Web3.Storage upload failed:", error);
    throw new Error("Failed to upload to IPFS");
  }
}

/**
 * Upload file to IPFS using Pinata
 */
export async function uploadToPinata(file: File): Promise<IPFSUploadResponse> {
  if (!PINATA_API_KEY || !PINATA_SECRET_KEY) {
    throw new Error("Pinata credentials not configured");
  }

  const formData = new FormData();
  formData.append("file", file);

  const metadata = JSON.stringify({
    name: file.name,
    keyvalues: {
      type: "medical-record",
      timestamp: Date.now().toString(),
    },
  });
  formData.append("pinataMetadata", metadata);

  const options = JSON.stringify({
    cidVersion: 1,
  });
  formData.append("pinataOptions", options);

  try {
    const response = await axios.post(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          pinata_api_key: PINATA_API_KEY,
          pinata_secret_api_key: PINATA_SECRET_KEY,
        },
      }
    );

    const cid = response.data.IpfsHash;
    return {
      cid,
      url: `https://gateway.pinata.cloud/ipfs/${cid}`,
    };
  } catch (error) {
    console.error("Pinata upload failed:", error);
    throw new Error("Failed to upload to IPFS");
  }
}

/**
 * Upload JSON data to IPFS
 */
export async function uploadJSONToIPFS(data: any): Promise<IPFSUploadResponse> {
  const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
  const file = new File([blob], "data.json", { type: "application/json" });

  // Try Web3.Storage first, fallback to Pinata
  if (WEB3_STORAGE_TOKEN) {
    return uploadToWeb3Storage(file);
  } else if (PINATA_API_KEY && PINATA_SECRET_KEY) {
    return uploadToPinata(file);
  } else {
    throw new Error("No IPFS service configured");
  }
}

/**
 * Upload encrypted file to IPFS
 */
export async function uploadEncryptedFile(
  encryptedData: string,
  fileName: string
): Promise<IPFSUploadResponse> {
  const blob = new Blob([encryptedData], { type: "application/octet-stream" });
  const file = new File([blob], fileName, { type: "application/octet-stream" });

  // Try Web3.Storage first, fallback to Pinata
  if (WEB3_STORAGE_TOKEN) {
    return uploadToWeb3Storage(file);
  } else if (PINATA_API_KEY && PINATA_SECRET_KEY) {
    return uploadToPinata(file);
  } else {
    throw new Error("No IPFS service configured");
  }
}

/**
 * Download file from IPFS
 */
export async function downloadFromIPFS(cid: string): Promise<ArrayBuffer> {
  const gateways = [
    `https://w3s.link/ipfs/${cid}`,
    `https://gateway.pinata.cloud/ipfs/${cid}`,
    `https://ipfs.io/ipfs/${cid}`,
    `https://cloudflare-ipfs.com/ipfs/${cid}`,
  ];

  for (const gateway of gateways) {
    try {
      const response = await axios.get(gateway, {
        responseType: "arraybuffer",
        timeout: 10000,
      });
      return response.data;
    } catch (error) {
      console.warn(`Failed to fetch from ${gateway}:`, error);
      continue;
    }
  }

  throw new Error("Failed to download from IPFS");
}

/**
 * Download JSON from IPFS
 */
export async function downloadJSONFromIPFS(cid: string): Promise<any> {
  const data = await downloadFromIPFS(cid);
  const text = new TextDecoder().decode(data);
  return JSON.parse(text);
}

/**
 * Get IPFS gateway URL
 */
export function getIPFSUrl(cid: string): string {
  if (WEB3_STORAGE_TOKEN) {
    return `https://w3s.link/ipfs/${cid}`;
  } else if (PINATA_API_KEY) {
    return `https://gateway.pinata.cloud/ipfs/${cid}`;
  } else {
    return `https://ipfs.io/ipfs/${cid}`;
  }
}

/**
 * Check if CID is valid
 */
export function isValidCID(cid: string): boolean {
  // Basic CID validation (v0 and v1)
  return /^(Qm[1-9A-HJ-NP-Za-km-z]{44}|b[A-Za-z2-7]{58})$/.test(cid);
}
