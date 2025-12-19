import { useState, useCallback } from "react";
import { useContract } from "./useContract";
import { useWalletStore } from "@/store/walletStore";
import type { MedicalRecord, AccessLevel, AccessGrant } from "@/types";

export function usePatientNFT() {
  const { read, write, estimateGas } = useContract("patientNFT");
  const { address } = useWalletStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Mint new patient NFT
   */
  const mintNFT = useCallback(
    async (patientAddress: string) => {
      setIsLoading(true);
      setError(null);

      try {
        const tx = await write("mintPatientNFT", patientAddress);
        const receipt = await tx.wait();

        // Extract token ID from event
        const event = receipt.logs.find(
          (log: any) => log.topics[0] === "0x..." // PatientNFTMinted event signature
        );

        return { tx, receipt, tokenId: event?.args?.tokenId };
      } catch (err: any) {
        setError(err.message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [write]
  );

  /**
   * Add medical record
   */
  const addMedicalRecord = useCallback(
    async (tokenId: bigint, ipfsHash: string) => {
      setIsLoading(true);
      setError(null);

      try {
        const tx = await write("addMedicalRecord", tokenId, ipfsHash);
        const receipt = await tx.wait();
        return { tx, receipt };
      } catch (err: any) {
        setError(err.message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [write]
  );

  /**
   * Grant access to address
   */
  const grantAccess = useCallback(
    async (tokenId: bigint, grantee: string, level: AccessLevel) => {
      setIsLoading(true);
      setError(null);

      try {
        const tx = await write("grantAccess", tokenId, grantee, level);
        const receipt = await tx.wait();
        return { tx, receipt };
      } catch (err: any) {
        setError(err.message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [write]
  );

  /**
   * Revoke access from address
   */
  const revokeAccess = useCallback(
    async (tokenId: bigint, grantee: string) => {
      setIsLoading(true);
      setError(null);

      try {
        const tx = await write("revokeAccess", tokenId, grantee);
        const receipt = await tx.wait();
        return { tx, receipt };
      } catch (err: any) {
        setError(err.message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [write]
  );

  /**
   * Grant emergency access
   */
  const grantEmergencyAccess = useCallback(
    async (tokenId: bigint, emergencyContact: string) => {
      setIsLoading(true);
      setError(null);

      try {
        const tx = await write(
          "grantEmergencyAccess",
          tokenId,
          emergencyContact
        );
        const receipt = await tx.wait();
        return { tx, receipt };
      } catch (err: any) {
        setError(err.message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [write]
  );

  /**
   * Get patient's token ID
   */
  const getPatientTokenId = useCallback(
    async (ownerAddress?: string): Promise<bigint | null> => {
      const owner = ownerAddress || address;
      if (!owner) return null;

      try {
        const balance = await read("balanceOf", owner);
        if (balance === 0n) return null;

        // Get first token (should only have one)
        const tokenId = await read("tokenOfOwnerByIndex", owner, 0);
        return tokenId;
      } catch (err: any) {
        console.error("Failed to get token ID:", err);
        return null;
      }
    },
    [read, address]
  );

  /**
   * Get medical records for token
   */
  const getMedicalRecords = useCallback(
    async (tokenId: bigint): Promise<MedicalRecord[]> => {
      try {
        const records = await read("getMedicalRecords", tokenId);
        return records;
      } catch (err: any) {
        setError(err.message);
        throw err;
      }
    },
    [read]
  );

  /**
   * Get access level for address
   */
  const getAccessLevel = useCallback(
    async (tokenId: bigint, accessor: string): Promise<AccessLevel> => {
      try {
        const level = await read("getAccessLevel", tokenId, accessor);
        return level;
      } catch (err: any) {
        setError(err.message);
        throw err;
      }
    },
    [read]
  );

  /**
   * Check if address owns token
   */
  const isTokenOwner = useCallback(
    async (tokenId: bigint, ownerAddress?: string): Promise<boolean> => {
      const checkAddress = ownerAddress || address;
      if (!checkAddress) return false;

      try {
        const owner = await read("ownerOf", tokenId);
        return owner.toLowerCase() === checkAddress.toLowerCase();
      } catch (err) {
        return false;
      }
    },
    [read, address]
  );

  return {
    // State
    isLoading,
    error,
    // Actions
    mintNFT,
    addMedicalRecord,
    grantAccess,
    revokeAccess,
    grantEmergencyAccess,
    getPatientTokenId,
    getMedicalRecords,
    getAccessLevel,
    isTokenOwner,
  };
}
