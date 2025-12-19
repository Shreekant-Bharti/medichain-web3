/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PATIENT_NFT_ADDRESS: string;
  readonly VITE_DOCTOR_REGISTRY_ADDRESS: string;
  readonly VITE_PRESCRIPTION_CONTRACT_ADDRESS: string;
  readonly VITE_PHARMACY_REGISTRY_ADDRESS: string;
  readonly VITE_GOVERNANCE_ADDRESS: string;
  readonly VITE_CHAIN_ID: string;
  readonly VITE_POLYGON_RPC_URL: string;
  readonly VITE_WEB3_STORAGE_TOKEN: string;
  readonly VITE_PINATA_API_KEY: string;
  readonly VITE_PINATA_SECRET_KEY: string;
  readonly VITE_BACKEND_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
