import { useState, useCallback } from "react";
import { useWalletStore } from "@/store/walletStore";
import {
  uploadToWeb3Storage,
  uploadToPinata,
  uploadEncryptedFile,
  uploadJSONToIPFS,
  downloadFromIPFS,
  downloadJSONFromIPFS,
  getIPFSUrl,
} from "@/lib/ipfs";
import type { IPFSUploadResponse } from "@/types";

export function useIPFS() {
  const [isUploading, setIsUploading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Upload file to IPFS
   */
  const uploadFile = useCallback(
    async (file: File): Promise<IPFSUploadResponse> => {
      setIsUploading(true);
      setError(null);

      try {
        // Try Web3.Storage first, fallback to Pinata
        try {
          return await uploadToWeb3Storage(file);
        } catch (err) {
          console.warn("Web3.Storage failed, trying Pinata:", err);
          return await uploadToPinata(file);
        }
      } catch (err: any) {
        setError(err.message || "Failed to upload to IPFS");
        throw err;
      } finally {
        setIsUploading(false);
      }
    },
    []
  );

  /**
   * Upload encrypted data to IPFS
   */
  const uploadEncrypted = useCallback(
    async (
      encryptedData: string,
      fileName: string
    ): Promise<IPFSUploadResponse> => {
      setIsUploading(true);
      setError(null);

      try {
        return await uploadEncryptedFile(encryptedData, fileName);
      } catch (err: any) {
        setError(err.message || "Failed to upload encrypted data");
        throw err;
      } finally {
        setIsUploading(false);
      }
    },
    []
  );

  /**
   * Upload JSON data to IPFS
   */
  const uploadJSON = useCallback(
    async (data: any): Promise<IPFSUploadResponse> => {
      setIsUploading(true);
      setError(null);

      try {
        return await uploadJSONToIPFS(data);
      } catch (err: any) {
        setError(err.message || "Failed to upload JSON");
        throw err;
      } finally {
        setIsUploading(false);
      }
    },
    []
  );

  /**
   * Download file from IPFS
   */
  const downloadFile = useCallback(
    async (cid: string): Promise<ArrayBuffer> => {
      setIsDownloading(true);
      setError(null);

      try {
        return await downloadFromIPFS(cid);
      } catch (err: any) {
        setError(err.message || "Failed to download from IPFS");
        throw err;
      } finally {
        setIsDownloading(false);
      }
    },
    []
  );

  /**
   * Download JSON from IPFS
   */
  const downloadJSON = useCallback(async (cid: string): Promise<any> => {
    setIsDownloading(true);
    setError(null);

    try {
      return await downloadJSONFromIPFS(cid);
    } catch (err: any) {
      setError(err.message || "Failed to download JSON from IPFS");
      throw err;
    } finally {
      setIsDownloading(false);
    }
  }, []);

  /**
   * Get IPFS gateway URL for CID
   */
  const getUrl = useCallback((cid: string): string => {
    return getIPFSUrl(cid);
  }, []);

  return {
    // State
    isUploading,
    isDownloading,
    error,
    // Actions
    uploadFile,
    uploadEncrypted,
    uploadJSON,
    downloadFile,
    downloadJSON,
    getUrl,
  };
}
