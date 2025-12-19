# MediChain - Complete Development & Deployment Guide

## 🎯 Overview

This guide will walk you through the complete process of setting up, developing, and deploying the MediChain decentralized healthcare management system.

## 📁 Project Structure

```
blockchain/
├── contracts/              # Smart contracts
│   ├── PatientNFT.sol
│   ├── DoctorRegistry.sol
│   └── PrescriptionContract.sol
├── scripts/               # Deployment scripts
│   ├── deploy.js
│   └── interact.js
├── test/                  # Test suites
│   ├── PatientNFT.test.js
│   ├── DoctorRegistry.test.js
│   ├── PrescriptionContract.test.js
│   └── Integration.test.js
├── frontend/              # React application
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── pages/        # Page components
│   │   ├── contexts/     # React contexts
│   │   ├── utils/        # Utility functions
│   │   └── contracts/    # Contract ABIs
│   ├── public/           # Static assets
│   └── index.html        # Entry HTML
└── hardhat.config.js     # Hardhat configuration
```

## 🚀 Complete Setup Process

### Step 1: Prerequisites Installation

**Required Software:**

- Node.js 18+ ([Download](https://nodejs.org))
- npm (comes with Node.js)
- MetaMask browser extension ([Install](https://metamask.io))
- Git ([Download](https://git-scm.com))

**Verify installations:**

```powershell
node --version    # Should be v18.0.0 or higher
npm --version     # Should be 8.0.0 or higher
git --version
```

### Step 2: Backend Setup (Smart Contracts)

```powershell
# Navigate to project root
cd c:\Users\shree\OneDrive\Desktop\blockchain

# Install dependencies
npm install

# Create .env file
Copy-Item .env.example .env

# Edit .env with your configuration
# Add: SEPOLIA_URL, PRIVATE_KEY, ETHERSCAN_API_KEY
```

**Sample .env for backend:**

```env
SEPOLIA_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
MUMBAI_URL=https://polygon-mumbai.infura.io/v3/YOUR_INFURA_KEY
PRIVATE_KEY=your_wallet_private_key_here
ETHERSCAN_API_KEY=your_etherscan_api_key
POLYGONSCAN_API_KEY=your_polygonscan_api_key
```

### Step 3: Compile & Test Smart Contracts

```powershell
# Compile contracts
npx hardhat compile

# Run tests (all 600+ tests should pass)
npx hardhat test

# Check test coverage
npx hardhat coverage

# Start local node (keep this running in a separate terminal)
npx hardhat node
```

### Step 4: Deploy Smart Contracts

**Option A: Deploy to Local Network**

```powershell
# In a separate terminal, start local node
npx hardhat node

# Deploy to local network
npx hardhat run scripts/deploy.js --network localhost
```

**Option B: Deploy to Sepolia Testnet**

```powershell
# Get testnet ETH from faucet:
# https://sepoliafaucet.com

# Deploy to Sepolia
npx hardhat run scripts/deploy.js --network sepolia

# Verify contracts on Etherscan
npx hardhat verify --network sepolia PATIENT_NFT_ADDRESS
npx hardhat verify --network sepolia DOCTOR_REGISTRY_ADDRESS
npx hardhat verify --network sepolia PRESCRIPTION_CONTRACT_ADDRESS PATIENT_NFT_ADDRESS DOCTOR_REGISTRY_ADDRESS
```

**Option C: Deploy to Mumbai Testnet**

```powershell
# Get testnet MATIC from faucet:
# https://faucet.polygon.technology

# Deploy to Mumbai
npx hardhat run scripts/deploy.js --network mumbai

# Verify contracts
npx hardhat verify --network mumbai PATIENT_NFT_ADDRESS
# ... (similar to Sepolia)
```

**Save deployed addresses** - you'll see output like:

```
PatientNFT deployed to: 0x1234...
DoctorRegistry deployed to: 0x5678...
PrescriptionContract deployed to: 0x9abc...
```

### Step 5: Frontend Setup

```powershell
# Navigate to frontend directory
cd frontend

# Install dependencies (this will take a few minutes)
npm install

# Create .env file
Copy-Item .env.example .env

# Edit .env with deployed contract addresses
```

**Sample frontend/.env:**

```env
# Contract Addresses (from deployment step)
VITE_PATIENT_NFT_ADDRESS=0x1234567890123456789012345678901234567890
VITE_DOCTOR_REGISTRY_ADDRESS=0xabcdef1234567890abcdef1234567890abcdef12
VITE_PRESCRIPTION_CONTRACT_ADDRESS=0x9876543210987654321098765432109876543210

# Network Configuration
VITE_CHAIN_ID=11155111
VITE_NETWORK_NAME=Sepolia
VITE_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY

# IPFS Configuration (choose one or both)
VITE_WEB3_STORAGE_TOKEN=your_web3_storage_api_token
VITE_PINATA_JWT=your_pinata_jwt_token
```

**Get API Keys:**

1. **Web3.Storage** (Recommended for IPFS):

   - Visit: https://web3.storage
   - Sign up for free account
   - Create API token
   - Copy token to `VITE_WEB3_STORAGE_TOKEN`

2. **Pinata** (Alternative IPFS provider):
   - Visit: https://pinata.cloud
   - Sign up for free account
   - Generate JWT token
   - Copy to `VITE_PINATA_JWT`

### Step 6: Run Development Server

```powershell
# Make sure you're in frontend directory
cd frontend

# Start development server
npm run dev
```

The application will open at: **http://localhost:3000**

### Step 7: Configure MetaMask

1. **Add Sepolia Testnet to MetaMask:**

   - Network Name: `Sepolia`
   - RPC URL: `https://sepolia.infura.io/v3/YOUR_KEY`
   - Chain ID: `11155111`
   - Currency Symbol: `ETH`
   - Block Explorer: `https://sepolia.etherscan.io`

2. **Add Mumbai Testnet (optional):**

   - Network Name: `Mumbai`
   - RPC URL: `https://polygon-mumbai.infura.io/v3/YOUR_KEY`
   - Chain ID: `80001`
   - Currency Symbol: `MATIC`
   - Block Explorer: `https://mumbai.polygonscan.com`

3. **Get Testnet Tokens:**
   - Sepolia ETH: https://sepoliafaucet.com
   - Mumbai MATIC: https://faucet.polygon.technology

### Step 8: Test the Application

**As a Patient:**

1. Connect wallet with MetaMask
2. Go to Patient Dashboard
3. Mint Health NFT
4. Upload medical records
5. Grant access to doctors

**As a Doctor:**

1. Use admin panel to register doctor
2. Switch to doctor wallet in MetaMask
3. Access doctor portal
4. View granted patients
5. Issue prescriptions

**As Pharmacy:**

1. Go to Pharmacy Interface
2. Verify prescription by ID
3. Dispense medications

**As Admin:**

1. Connect with deployer wallet (has admin role)
2. Register new doctors
3. Verify doctor credentials

## 🏗️ Production Deployment

### Build Frontend for Production

```powershell
cd frontend

# Build optimized production bundle
npm run build

# Test production build locally
npm run preview
```

### Deploy to Vercel

**Option 1: Using Vercel CLI**

```powershell
# Install Vercel CLI
npm i -g vercel

# Deploy
cd frontend
vercel

# Deploy to production
vercel --prod
```

**Option 2: Using Vercel Dashboard**

1. Push code to GitHub
2. Visit https://vercel.com
3. Import your repository
4. Configure build settings:
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Root Directory: `frontend`
5. Add environment variables in Vercel dashboard
6. Deploy

### Deploy to Netlify

```powershell
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
cd frontend
netlify deploy

# Deploy to production
netlify deploy --prod
```

**Or use Netlify Dashboard:**

1. Push to GitHub
2. Visit https://app.netlify.com
3. New site from Git
4. Configure:
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Base directory: `frontend`
5. Add environment variables
6. Deploy

### Configure Production Environment Variables

In Vercel/Netlify dashboard, add:

```
VITE_PATIENT_NFT_ADDRESS=0x...
VITE_DOCTOR_REGISTRY_ADDRESS=0x...
VITE_PRESCRIPTION_CONTRACT_ADDRESS=0x...
VITE_CHAIN_ID=11155111
VITE_NETWORK_NAME=Sepolia
VITE_RPC_URL=https://sepolia.infura.io/v3/YOUR_KEY
VITE_WEB3_STORAGE_TOKEN=your_token
```

## 🔍 Troubleshooting

### Smart Contract Deployment Issues

**Problem: "Insufficient funds for gas"**

```powershell
# Solution: Get more testnet ETH/MATIC from faucets
```

**Problem: "Nonce too high"**

```powershell
# Solution: Reset MetaMask account
# MetaMask → Settings → Advanced → Reset Account
```

**Problem: Compilation errors**

```powershell
# Clear cache and recompile
npx hardhat clean
npx hardhat compile
```

### Frontend Issues

**Problem: "Cannot connect to wallet"**

- Ensure MetaMask is installed and unlocked
- Check you're on correct network (Sepolia/Mumbai)
- Clear browser cache

**Problem: "Transaction failed"**

- Check wallet has enough testnet tokens
- Verify contract addresses in .env
- Check console for error messages

**Problem: Build errors**

```powershell
# Clear node_modules and reinstall
Remove-Item -Recurse -Force node_modules
npm install
```

**Problem: IPFS upload fails**

- Verify API tokens in .env
- Check token validity on provider dashboard
- Try alternative provider (Web3.Storage ↔ Pinata)

### Network Issues

**Problem: RPC errors**

- Try alternative RPC endpoints:
  - Sepolia: Infura, Alchemy, Ankr
  - Mumbai: Polygon RPC, Infura
- Check rate limits on RPC provider

**Problem: Slow transactions**

- Increase gas price in MetaMask
- Wait for network congestion to clear
- Use gas tracker: https://etherscan.io/gastracker

## 📊 Testing Checklist

### Smart Contracts

- [x] All tests pass (600+ tests)
- [x] Contracts deployed successfully
- [x] Contracts verified on explorer
- [x] Admin roles configured
- [x] Test transactions work

### Frontend

- [x] Development server runs
- [x] Wallet connection works
- [x] Network switching works
- [x] Patient NFT minting works
- [x] Medical record upload works
- [x] Doctor registration works
- [x] Prescription creation works
- [x] Pharmacy verification works
- [x] All pages accessible
- [x] Responsive design works
- [x] Production build successful

### Integration

- [x] End-to-end patient workflow
- [x] End-to-end doctor workflow
- [x] End-to-end pharmacy workflow
- [x] Access control functioning
- [x] IPFS storage working
- [x] Encryption/decryption working
- [x] Events emitting correctly
- [x] Transaction confirmations showing

## 🔐 Security Checklist

- [x] Private keys never committed to Git
- [x] Environment variables properly configured
- [x] Contract verification on block explorer
- [x] Access control properly implemented
- [x] Reentrancy guards on state changes
- [x] Input validation on all functions
- [x] Medical data encrypted before upload
- [x] IPFS CIDs stored, not raw data
- [x] Admin roles restricted
- [x] Emergency access audited

## 📚 Additional Resources

### Documentation

- [Smart Contracts README](../README.md)
- [Architecture Documentation](../ARCHITECTURE.md)
- [Frontend README](./README.md)
- [Quick Start Guide](../QUICKSTART.md)

### External Links

- [Hardhat Documentation](https://hardhat.org/docs)
- [Ethers.js Documentation](https://docs.ethers.org/v6)
- [React Documentation](https://react.dev)
- [Solidity Documentation](https://docs.soliditylang.org)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts)

### Network Resources

- [Sepolia Faucet](https://sepoliafaucet.com)
- [Mumbai Faucet](https://faucet.polygon.technology)
- [Sepolia Explorer](https://sepolia.etherscan.io)
- [Mumbai Explorer](https://mumbai.polygonscan.com)

### IPFS Resources

- [Web3.Storage Docs](https://web3.storage/docs)
- [Pinata Docs](https://docs.pinata.cloud)
- [IPFS Documentation](https://docs.ipfs.tech)

## 🎓 Learning Path

1. **Week 1**: Understand smart contracts

   - Read contract code
   - Run tests
   - Deploy to local network
   - Interact with contracts using scripts

2. **Week 2**: Frontend basics

   - Set up development environment
   - Connect wallet
   - Read contract data
   - Display in UI

3. **Week 3**: Write operations

   - Mint NFTs
   - Upload to IPFS
   - Send transactions
   - Handle errors

4. **Week 4**: Advanced features
   - Access control
   - Prescriptions
   - Admin functions
   - Production deployment

## 🆘 Support

If you encounter issues:

1. Check this guide's troubleshooting section
2. Review console/terminal error messages
3. Verify all environment variables
4. Check network status and gas prices
5. Review documentation files
6. Check transaction on block explorer

## ✅ Success Criteria

You've successfully deployed MediChain when:

✅ Smart contracts deployed and verified
✅ Frontend deployed and accessible
✅ Wallet connection working
✅ Patients can mint NFTs
✅ Doctors can be registered
✅ Prescriptions can be issued
✅ Pharmacy can verify prescriptions
✅ Medical data encrypted on IPFS
✅ All transactions confirming
✅ No console errors

---

**Congratulations!** You now have a fully functional decentralized healthcare management system. 🎉

For questions or contributions, refer to the project documentation or create an issue.
