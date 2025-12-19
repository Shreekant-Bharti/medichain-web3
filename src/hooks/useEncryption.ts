import { useState, useCallback } from "react";
import { useWalletStore } from "@/store/walletStore";
import {
  encryptData,
  decryptData,
  encryptFile,
  decryptFile,
  generateKeyFromSignature,
  generateSharedKey,
  storeEncryptionMetadata,
  getEncryptionMetadata,
} from "@/lib/encryption";
import type { EncryptedFile } from "@/types";

export function useEncryption() {
  const { signer } = useWalletStore();
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Encrypt file
   */
  const encrypt = useCallback(
    async (file: File): Promise<EncryptedFile> => {
      if (!signer) {
        throw new Error("Wallet not connected");
      }

      setIsEncrypting(true);
      setError(null);

      try {
        return await encryptFile(file, signer);
      } catch (err: any) {
        setError(err.message || "Encryption failed");
        throw err;
      } finally {
        setIsEncrypting(false);
      }
    },
    [signer]
  );

  /**
   * Decrypt file
   */
  const decrypt = useCallback(
    async (encrypted: EncryptedFile): Promise<Blob> => {
      if (!signer) {
        throw new Error("Wallet not connected");
      }

      setIsDecrypting(true);
      setError(null);

      try {
        const key = await generateKeyFromSignature(signer);
        return decryptFile(encrypted, key);
      } catch (err: any) {
        setError(err.message || "Decryption failed");
        throw err;
      } finally {
        setIsDecrypting(false);
      }
    },
    [signer]
  );

  /**
   * Encrypt text data
   */
  const encryptText = useCallback(
    async (text: string): Promise<EncryptedFile> => {
      if (!signer) {
        throw new Error("Wallet not connected");
      }

      setIsEncrypting(true);
      setError(null);

      try {
        const key = await generateKeyFromSignature(signer);
        return encryptData(text, key);
      } catch (err: any) {
        setError(err.message || "Encryption failed");
        throw err;
      } finally {
        setIsEncrypting(false);
      }
    },
    [signer]
  );

  /**
   * Decrypt text data
   */
  const decryptText = useCallback(
    async (encrypted: EncryptedFile): Promise<string> => {
      if (!signer) {
        throw new Error("Wallet not connected");
      }

      setIsDecrypting(true);
      setError(null);

      try {
        const key = await generateKeyFromSignature(signer);
        return decryptData(encrypted, key);
      } catch (err: any) {
        setError(err.message || "Decryption failed");
        throw err;
      } finally {
        setIsDecrypting(false);
      }
    },
    [signer]
  );

  /**
   * Generate shared key for access grant
   */
  const createSharedKey = useCallback(
    async (doctorAddress: string): Promise<string> => {
      if (!signer) {
        throw new Error("Wallet not connected");
      }

      try {
        return await generateSharedKey(signer, doctorAddress);
      } catch (err: any) {
        setError(err.message || "Failed to generate shared key");
        throw err;
      }
    },
    [signer]
  );

  /**
   * Store encryption metadata
   */
  const saveMetadata = useCallback(
    (tokenId: string, recordIndex: number, metadata: EncryptedFile) => {
      storeEncryptionMetadata(tokenId, recordIndex, metadata);
    },
    []
  );

  /**
   * Retrieve encryption metadata
   */
  const loadMetadata = useCallback(
    (tokenId: string, recordIndex: number): EncryptedFile | null => {
      return getEncryptionMetadata(tokenId, recordIndex);
    },
    []
  );

  return {
    // State
    isEncrypting,
    isDecrypting,
    error,
    // Actions
    encrypt,
    decrypt,
    encryptText,
    decryptText,
    createSharedKey,
    saveMetadata,
    loadMetadata,
  };
}
