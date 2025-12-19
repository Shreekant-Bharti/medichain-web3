import { useState, useCallback } from "react";
import { useContract } from "./useContract";
import { useWalletStore } from "@/store/walletStore";
import type {
  Prescription,
  PrescriptionStatus,
  MedicineCategory,
} from "@/types";

export function usePrescription() {
  const { read, write } = useContract("prescriptionContract");
  const { address } = useWalletStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Issue new prescription
   */
  const issuePrescription = useCallback(
    async (
      patientTokenId: bigint,
      patientAddress: string,
      medicineName: string,
      dosage: string,
      frequency: string,
      duration: string,
      category: MedicineCategory,
      ipfsHash: string,
      expiryDate: bigint
    ) => {
      setIsLoading(true);
      setError(null);

      try {
        const tx = await write(
          "issuePrescription",
          patientTokenId,
          patientAddress,
          medicineName,
          dosage,
          frequency,
          duration,
          category,
          ipfsHash,
          expiryDate
        );
        const receipt = await tx.wait();

        // Extract prescription ID from event
        const event = receipt.logs.find(
          (log: any) => log.fragment?.name === "PrescriptionIssued"
        );

        return { tx, receipt, prescriptionId: event?.args?.prescriptionId };
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
   * Dispense medicine
   */
  const dispenseMedicine = useCallback(
    async (prescriptionId: bigint) => {
      setIsLoading(true);
      setError(null);

      try {
        const tx = await write("dispenseMedicine", prescriptionId);
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
   * Invalidate prescription
   */
  const invalidatePrescription = useCallback(
    async (prescriptionId: bigint) => {
      setIsLoading(true);
      setError(null);

      try {
        const tx = await write("invalidatePrescription", prescriptionId);
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
   * Verify prescription
   */
  const verifyPrescription = useCallback(
    async (
      prescriptionId: bigint
    ): Promise<{ isValid: boolean; message: string }> => {
      try {
        const [isValid, message] = await read(
          "verifyPrescription",
          prescriptionId
        );
        return { isValid, message };
      } catch (err: any) {
        setError(err.message);
        throw err;
      }
    },
    [read]
  );

  /**
   * Get prescription details
   */
  const getPrescription = useCallback(
    async (prescriptionId: bigint): Promise<Prescription> => {
      try {
        const prescription = await read("getPrescription", prescriptionId);
        return prescription;
      } catch (err: any) {
        setError(err.message);
        throw err;
      }
    },
    [read]
  );

  /**
   * Get patient's prescriptions
   */
  const getPatientPrescriptions = useCallback(
    async (patientTokenId: bigint): Promise<bigint[]> => {
      try {
        const prescriptionIds = await read(
          "getPatientPrescriptions",
          patientTokenId
        );
        return prescriptionIds;
      } catch (err: any) {
        setError(err.message);
        throw err;
      }
    },
    [read]
  );

  /**
   * Get doctor's prescriptions
   */
  const getDoctorPrescriptions = useCallback(
    async (doctorAddress?: string): Promise<bigint[]> => {
      const doctor = doctorAddress || address;
      if (!doctor) return [];

      try {
        const prescriptionIds = await read("getDoctorPrescriptions", doctor);
        return prescriptionIds;
      } catch (err: any) {
        setError(err.message);
        throw err;
      }
    },
    [read, address]
  );

  /**
   * Check if prescription is expired
   */
  const isPrescriptionExpired = useCallback(
    async (prescriptionId: bigint): Promise<boolean> => {
      try {
        const prescription = await getPrescription(prescriptionId);
        const now = BigInt(Math.floor(Date.now() / 1000));
        return prescription.expiryDate < now;
      } catch (err) {
        return false;
      }
    },
    [getPrescription]
  );

  /**
   * Check if prescription is dispensed
   */
  const isPrescriptionDispensed = useCallback(
    async (prescriptionId: bigint): Promise<boolean> => {
      try {
        const prescription = await getPrescription(prescriptionId);
        return prescription.status === PrescriptionStatus.DISPENSED;
      } catch (err) {
        return false;
      }
    },
    [getPrescription]
  );

  return {
    // State
    isLoading,
    error,
    // Actions
    issuePrescription,
    dispenseMedicine,
    invalidatePrescription,
    verifyPrescription,
    getPrescription,
    getPatientPrescriptions,
    getDoctorPrescriptions,
    isPrescriptionExpired,
    isPrescriptionDispensed,
  };
}
