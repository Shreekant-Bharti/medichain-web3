import CryptoJS from "crypto-js";
import type { EncryptedFile } from "@/types";

/**
 * Generate encryption key from wallet signature
 */
export async function generateKeyFromSignature(
  signer: any,
  message: string = "Sign this message to encrypt/decrypt your medical records"
): Promise<string> {
  try {
    const signature = await signer.signMessage(message);
    // Use signature as encryption key
    return signature;
  } catch (error) {
    console.error("Failed to get signature:", error);
    throw new Error("User rejected signature request");
  }
}

/**
 * Encrypt file data
 */
export function encryptData(
  data: string | ArrayBuffer,
  key: string
): EncryptedFile {
  let dataString: string;

  if (data instanceof ArrayBuffer) {
    // Convert ArrayBuffer to base64
    const uint8Array = new Uint8Array(data);
    dataString = btoa(String.fromCharCode(...uint8Array));
  } else {
    dataString = data;
  }

  // Generate random IV and salt
  const iv = CryptoJS.lib.WordArray.random(16);
  const salt = CryptoJS.lib.WordArray.random(16);

  // Derive key using PBKDF2
  const derivedKey = CryptoJS.PBKDF2(key, salt, {
    keySize: 256 / 32,
    iterations: 1000,
  });

  // Encrypt data
  const encrypted = CryptoJS.AES.encrypt(dataString, derivedKey, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  return {
    encryptedData: encrypted.toString(),
    iv: iv.toString(CryptoJS.enc.Base64),
    salt: salt.toString(CryptoJS.enc.Base64),
  };
}

/**
 * Decrypt file data
 */
export function decryptData(encrypted: EncryptedFile, key: string): string {
  try {
    // Parse IV and salt
    const iv = CryptoJS.enc.Base64.parse(encrypted.iv);
    const salt = CryptoJS.enc.Base64.parse(encrypted.salt);

    // Derive key using PBKDF2
    const derivedKey = CryptoJS.PBKDF2(key, salt, {
      keySize: 256 / 32,
      iterations: 1000,
    });

    // Decrypt data
    const decrypted = CryptoJS.AES.decrypt(
      encrypted.encryptedData,
      derivedKey,
      {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      }
    );

    return decrypted.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error("Decryption failed:", error);
    throw new Error("Failed to decrypt data");
  }
}

/**
 * Encrypt file for upload
 */
export async function encryptFile(
  file: File,
  signer: any
): Promise<EncryptedFile> {
  // Get encryption key from wallet signature
  const key = await generateKeyFromSignature(signer);

  // Read file as ArrayBuffer
  const arrayBuffer = await file.arrayBuffer();

  // Encrypt file data
  return encryptData(arrayBuffer, key);
}

/**
 * Decrypt file after download
 */
export function decryptFile(encrypted: EncryptedFile, key: string): Blob {
  // Decrypt data
  const decryptedBase64 = decryptData(encrypted, key);

  // Convert base64 back to ArrayBuffer
  const binaryString = atob(decryptedBase64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  return new Blob([bytes]);
}

/**
 * Store encryption metadata in localStorage
 */
export function storeEncryptionMetadata(
  tokenId: string,
  recordIndex: number,
  metadata: EncryptedFile
): void {
  const key = `encryption_${tokenId}_${recordIndex}`;
  localStorage.setItem(key, JSON.stringify(metadata));
}

/**
 * Retrieve encryption metadata from localStorage
 */
export function getEncryptionMetadata(
  tokenId: string,
  recordIndex: number
): EncryptedFile | null {
  const key = `encryption_${tokenId}_${recordIndex}`;
  const stored = localStorage.getItem(key);
  if (!stored) return null;

  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

/**
 * Generate shared encryption key for access grants
 * This allows doctors to decrypt patient records they have access to
 */
export async function generateSharedKey(
  patientSigner: any,
  doctorAddress: string
): Promise<string> {
  const message = `Share medical records with ${doctorAddress}`;
  const signature = await generateKeyFromSignature(patientSigner, message);

  // Derive shared key
  const sharedKey = CryptoJS.SHA256(signature + doctorAddress).toString();
  return sharedKey;
}

/**
 * Re-encrypt data with shared key
 */
export function reEncryptWithSharedKey(
  encrypted: EncryptedFile,
  oldKey: string,
  newKey: string
): EncryptedFile {
  // Decrypt with old key
  const decrypted = decryptData(encrypted, oldKey);

  // Re-encrypt with new key
  return encryptData(decrypted, newKey);
}

/**
 * Hash data for verification
 */
export function hashData(data: string): string {
  return CryptoJS.SHA256(data).toString();
}

/**
 * Verify data hash
 */
export function verifyHash(data: string, hash: string): boolean {
  return hashData(data) === hash;
}
