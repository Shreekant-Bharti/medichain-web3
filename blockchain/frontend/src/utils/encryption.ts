import CryptoJS from "crypto-js";

/**
 * Encrypt data using AES encryption with a password derived from user's address
 */
export const encryptData = (data: string, password: string): string => {
  try {
    const encrypted = CryptoJS.AES.encrypt(data, password).toString();
    return encrypted;
  } catch (error) {
    console.error("Encryption error:", error);
    throw new Error("Failed to encrypt data");
  }
};

/**
 * Decrypt data using AES decryption
 */
export const decryptData = (
  encryptedData: string,
  password: string
): string => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, password);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);

    if (!decrypted) {
      throw new Error("Decryption failed - invalid password or corrupted data");
    }

    return decrypted;
  } catch (error) {
    console.error("Decryption error:", error);
    throw new Error("Failed to decrypt data");
  }
};

/**
 * Generate a signature from user's wallet (for authentication)
 */
export const generateSignature = async (
  signer: any,
  message: string
): Promise<string> => {
  try {
    const signature = await signer.signMessage(message);
    return signature;
  } catch (error) {
    console.error("Signature error:", error);
    throw new Error("Failed to generate signature");
  }
};

/**
 * Derive encryption password from user's wallet address
 * In production, you might want to use a more sophisticated key derivation
 */
export const deriveEncryptionKey = (
  address: string,
  signature?: string
): string => {
  if (signature) {
    // Use signature as part of the key for better security
    return CryptoJS.SHA256(address + signature).toString();
  }
  // Fallback to address-based key (less secure)
  return CryptoJS.SHA256(address).toString();
};

/**
 * Hash data for integrity verification
 */
export const hashData = (data: string): string => {
  return CryptoJS.SHA256(data).toString();
};
