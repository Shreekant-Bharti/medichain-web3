# MediChain Frontend - React + Web3 Application

A decentralized healthcare management system built with React, TypeScript, and Ethereum smart contracts.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
# Edit .env with your contract addresses and API keys

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📋 Prerequisites

- Node.js 18+ and npm
- MetaMask or compatible Web3 wallet
- Access to Ethereum testnet (Sepolia/Mumbai) or local network
- IPFS API keys (Web3.Storage or Pinata)

## 🔧 Environment Variables

Create a `.env` file with the following variables:

```env
# Contract Addresses (from deployment)
VITE_PATIENT_NFT_ADDRESS=0x...
VITE_DOCTOR_REGISTRY_ADDRESS=0x...
VITE_PRESCRIPTION_CONTRACT_ADDRESS=0x...

# Network Configuration
VITE_CHAIN_ID=11155111
VITE_NETWORK_NAME=Sepolia
VITE_RPC_URL=https://sepolia.infura.io/v3/YOUR_KEY

# IPFS Configuration (choose one)
VITE_WEB3_STORAGE_TOKEN=your_web3_storage_token
VITE_PINATA_JWT=your_pinata_jwt
```

## 🏗️ Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ui/             # shadcn/ui components
│   │   ├── layout/         # Layout components
│   │   ├── patient/        # Patient-specific components
│   │   ├── doctor/         # Doctor-specific components
│   │   ├── pharmacy/       # Pharmacy components
│   │   └── admin/          # Admin components
│   ├── pages/              # Page components
│   │   ├── patient/        # Patient dashboard pages
│   │   ├── doctor/         # Doctor portal pages
│   │   ├── pharmacy/       # Pharmacy interface pages
│   │   └── admin/          # Admin panel pages
│   ├── contexts/           # React contexts
│   │   └── Web3Context.tsx # Wallet & contract management
│   ├── contracts/          # Smart contract ABIs
│   │   └── abis.ts
│   ├── utils/              # Utility functions
│   │   ├── encryption.ts   # AES encryption
│   │   └── ipfs.ts        # IPFS integration
│   ├── hooks/              # Custom React hooks
│   ├── types/              # TypeScript types
│   ├── App.tsx            # Main app component
│   ├── main.tsx           # Entry point
│   └── index.css          # Global styles
├── public/                # Static assets
├── index.html            # HTML template
├── package.json          # Dependencies
├── tsconfig.json         # TypeScript config
├── vite.config.ts        # Vite config
└── tailwind.config.js    # Tailwind config
```

## 🎨 Tech Stack

### Core

- **React 18.2** - UI library
- **TypeScript 5.3** - Type safety
- **Vite 5.0** - Build tool
- **React Router 6.21** - Navigation

### Web3

- **Ethers.js 6.9** - Ethereum interaction
- **MetaMask** - Wallet integration

### Storage & Security

- **Web3.Storage 4.5** - IPFS decentralized storage
- **CryptoJS 4.2** - AES encryption

### UI & Styling

- **TailwindCSS 3.4** - Utility-first CSS
- **shadcn/ui** - Component library (Radix UI)
- **Lucide React** - Icon library
- **React Hot Toast** - Notifications

### Forms & Validation

- **React Hook Form 7.49** - Form management
- **Zod 3.22** - Schema validation

### Additional

- **QRCode.react 3.1** - QR code generation
- **jsPDF 2.5** - PDF generation
- **date-fns 3.0** - Date utilities

## 📦 Available Scripts

```bash
# Development
npm run dev          # Start dev server (localhost:3000)
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint

# Type Checking
npm run type-check   # Check TypeScript types
```

## 🔐 Security Features

### Client-Side Encryption

All sensitive medical data is encrypted before uploading to IPFS:

- **Algorithm**: AES-256-CBC
- **Key Derivation**: SHA-256 hash of patient's wallet address
- **Implementation**: CryptoJS library

### Access Control

- NFT-based identity management
- 4-level access control (NONE, READ, WRITE, FULL)
- Smart contract enforcement

### Data Privacy

- Medical records stored encrypted on IPFS
- Only IPFS CID stored on-chain
- Decryption requires patient's wallet signature

## 🌐 Wallet Integration

### Supported Wallets

- MetaMask (Primary)
- WalletConnect (Compatible)
- Coinbase Wallet (Compatible)

### Network Support

- Sepolia Testnet (chainId: 11155111)
- Mumbai Testnet (chainId: 80001)
- Localhost (chainId: 31337)

### Auto-Connect

The app automatically reconnects to the last used wallet on page load.

## 🏥 User Interfaces

### 1. Patient Dashboard (`/patient`)

- **Mint Health NFT**: Create soulbound NFT identity
- **View NFT**: Display QR code and token details
- **Upload Medical Records**: Encrypt and store on IPFS
- **Manage Access**: Grant/revoke doctor access
- **Prescription History**: View issued prescriptions

### 2. Doctor Portal (`/doctor`)

- **Patient List**: View granted access patients
- **Medical Records**: Retrieve and decrypt records
- **Issue Prescription**: Create new prescriptions
- **Prescription History**: Track issued prescriptions
- **Digital Signature**: Sign prescriptions

### 3. Pharmacy Interface (`/pharmacy`)

- **QR Scanner**: Scan patient QR codes
- **Verify Prescription**: Check validity
- **Dispense Medicine**: Mark prescriptions as dispensed
- **Track Inventory**: Monitor dispensed medications
- **Expiry Alerts**: Notify of expiring prescriptions

### 4. Admin Panel (`/admin`)

- **Register Doctors**: Add new doctors to registry
- **Verify Doctors**: Approve doctor credentials
- **Platform Analytics**: View usage statistics
- **User Management**: Monitor system activity

## 🔨 Component Development Guide

### Creating a New Component

```tsx
// components/ui/Button.tsx
import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/utils/cn";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-md font-medium",
          "transition-colors focus-visible:outline-none disabled:opacity-50",
          {
            "bg-primary text-primary-foreground hover:bg-primary/90":
              variant === "default",
            "border border-input bg-background hover:bg-accent":
              variant === "outline",
            "hover:bg-accent hover:text-accent-foreground": variant === "ghost",
          },
          {
            "h-8 px-3 text-sm": size === "sm",
            "h-10 px-4": size === "md",
            "h-12 px-6 text-lg": size === "lg",
          },
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
export default Button;
```

### Using Web3 Context

```tsx
import { useWeb3 } from "@/contexts/Web3Context";

function MyComponent() {
  const { account, chainId, contracts, connectWallet, switchNetwork } =
    useWeb3();

  const mintNFT = async () => {
    if (!contracts?.patientNFT) return;

    const tx = await contracts.patientNFT.mintPatientNFT();
    await tx.wait();
  };

  return (
    <div>
      {account ? (
        <button onClick={mintNFT}>Mint NFT</button>
      ) : (
        <button onClick={connectWallet}>Connect Wallet</button>
      )}
    </div>
  );
}
```

### Encrypting Medical Data

```tsx
import { encryptData, decryptData } from "@/utils/encryption";
import { uploadMedicalRecord } from "@/utils/ipfs";

async function uploadRecord(data: MedicalRecord, patientAddress: string) {
  // Encrypt data with patient's address as key
  const encrypted = encryptData(data, patientAddress);

  // Upload to IPFS
  const ipfsCid = await uploadMedicalRecord(encrypted);

  return ipfsCid;
}

async function retrieveRecord(ipfsCid: string, patientAddress: string) {
  // Fetch from IPFS
  const response = await fetch(`https://ipfs.io/ipfs/${ipfsCid}`);
  const encrypted = await response.json();

  // Decrypt with patient's address
  const decrypted = decryptData(encrypted, patientAddress);

  return decrypted;
}
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run specific test file
npm test PatientDashboard.test.tsx
```

## 🚢 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to production
vercel --prod
```

### Manual Build

```bash
# Build the app
npm run build

# The dist/ folder contains the production build
# Deploy the dist/ folder to any static hosting service
```

### Environment Variables

Remember to set environment variables in your hosting platform:

- Vercel: Project Settings → Environment Variables
- Netlify: Site Settings → Build & Deploy → Environment

## 📚 Key Features

### 1. NFT-Based Identity

- Each patient gets a soulbound NFT (non-transferable)
- NFT contains QR code for quick identity verification
- Unique token ID serves as patient identifier

### 2. Granular Access Control

- 4 permission levels: NONE, READ, WRITE, FULL
- Patients control who can access their records
- Emergency access with audit trail

### 3. Decentralized Storage

- Medical records stored on IPFS
- End-to-end encryption
- No central point of failure

### 4. Digital Prescriptions

- Doctor-signed prescriptions
- QR codes for pharmacy verification
- Anti-forgery measures

### 5. Doctor Verification

- Multi-step verification process
- Credential validation
- Specialization tracking

## 🐛 Troubleshooting

### MetaMask Not Connecting

1. Ensure MetaMask is installed
2. Check you're on the correct network
3. Try refreshing the page
4. Clear browser cache

### Transaction Failures

1. Check wallet has enough ETH for gas
2. Verify contract addresses in .env
3. Ensure you have required permissions
4. Check network congestion

### IPFS Upload Failures

1. Verify API keys in .env
2. Check file size limits
3. Try alternative provider (Web3.Storage ↔ Pinata)

### Build Errors

1. Delete node_modules and reinstall: `rm -rf node_modules && npm install`
2. Clear build cache: `rm -rf dist .vite`
3. Check Node.js version: `node -v` (should be 18+)

## 🔗 Related Documentation

- [Smart Contracts Documentation](../README.md)
- [Deployment Guide](../DEPLOYMENT.md)
- [Architecture Overview](../ARCHITECTURE.md)
- [Quick Start Guide](../QUICKSTART.md)

## 📄 License

MIT License - see LICENSE file for details

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit changes: `git commit -am 'Add my feature'`
4. Push to branch: `git push origin feature/my-feature`
5. Open a Pull Request

## 📞 Support

For issues and questions:

- GitHub Issues: [Repository Issues](https://github.com/your-repo/issues)
- Documentation: [Full Docs](../README.md)

---

Built with ❤️ using React, TypeScript, and Ethereum
