# 🚀 MediChain Frontend - Complete Setup Guide

## 📋 Prerequisites

- Node.js v18 or higher
- npm or yarn package manager
- MetaMask or compatible Web3 wallet
- Smart contracts deployed (addresses configured)

---

## 🔧 Installation Steps

### 1. Install Core Dependencies

```bash
cd frontend
npm install
```

This will install all dependencies from `package.json`:

- React 18
- TypeScript
- Vite
- ethers.js v6
- React Router v6
- Zustand
- TailwindCSS
- And more...

### 2. Install Additional UI Libraries

Install missing dependencies for complete functionality:

```bash
# QR Code generation and scanning
npm install qrcode.react
npm install react-qr-reader

# Charts for admin dashboard
npm install recharts

# Form handling and validation
npm install react-hook-form @hookform/resolvers zod

# Toast notifications
npm install sonner

# Icons
npm install lucide-react
```

### 3. Install shadcn/ui Components

Initialize shadcn/ui (if not already done):

```bash
npx shadcn-ui@latest init
```

Then install all required components:

```bash
npx shadcn-ui@latest add card
npx shadcn-ui@latest add button
npx shadcn-ui@latest add input
npx shadcn-ui@latest add textarea
npx shadcn-ui@latest add form
npx shadcn-ui@latest add select
npx shadcn-ui@latest add table
npx shadcn-ui@latest add tabs
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add alert
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add progress
npx shadcn-ui@latest add checkbox
```

Or install all at once:

```bash
npx shadcn-ui@latest add card button input textarea form select table tabs dialog alert badge progress checkbox
```

---

## ⚙️ Environment Configuration

### 1. Create `.env` File

Create a `.env` file in the `frontend/` directory:

```env
# Blockchain Network
VITE_NETWORK=mumbai
VITE_CHAIN_ID=80001

# Infura Configuration
VITE_INFURA_ID=your_infura_project_id

# IPFS Configuration
VITE_WEB3_STORAGE_TOKEN=your_web3_storage_token
VITE_PINATA_JWT=your_pinata_jwt_token

# Backend API
VITE_API_URL=http://localhost:5000

# Smart Contract Addresses (Update after deployment)
VITE_PATIENT_NFT_ADDRESS=0x...
VITE_PRESCRIPTION_CONTRACT_ADDRESS=0x...
VITE_DOCTOR_REGISTRY_ADDRESS=0x...
VITE_PHARMACY_REGISTRY_ADDRESS=0x...
VITE_GOVERNANCE_ADDRESS=0x...
```

### 2. Get Required API Keys

#### Infura (Ethereum RPC):

1. Go to https://infura.io/
2. Create account and new project
3. Copy Project ID

#### Web3.Storage (IPFS):

1. Go to https://web3.storage/
2. Sign up with email or GitHub
3. Create API token
4. Copy token

#### Pinata (IPFS Backup):

1. Go to https://pinata.cloud/
2. Create account
3. Generate JWT token
4. Copy token

---

## 🔗 Smart Contract Configuration

### Update Contract Addresses

Edit `src/lib/contracts.ts`:

```typescript
export const CONTRACTS = {
  PatientNFT: {
    address: process.env.VITE_PATIENT_NFT_ADDRESS as Address,
    // ... rest stays same
  },
  // Update all other contracts
};
```

### Network Configuration

The app is pre-configured for:

- **Polygon Mumbai Testnet** (default)
- **Polygon Mainnet**
- **Localhost** (for development)

To change default network, update `src/lib/contracts.ts`:

```typescript
export const DEFAULT_NETWORK = NETWORKS.MUMBAI; // or MAINNET or LOCALHOST
```

---

## 🚀 Running the Application

### Development Mode

```bash
npm run dev
```

This will:

- Start Vite dev server on `http://localhost:5173`
- Enable Hot Module Replacement (HMR)
- Show any compilation errors

### Build for Production

```bash
npm run build
```

Output will be in `dist/` folder.

### Preview Production Build

```bash
npm run preview
```

---

## 🧪 Testing the Application

### 1. Connect Wallet

- Open http://localhost:5173
- Click "Connect Wallet" in header
- Approve MetaMask connection
- Ensure you're on Polygon Mumbai (or configured network)

### 2. Get Test Tokens

For Mumbai testnet:

```
1. Get MATIC from: https://faucet.polygon.technology/
2. Wait for confirmation
3. Refresh wallet
```

### 3. Test Patient Portal

```
1. Navigate to /patient
2. Click "Register as Patient"
3. Approve MetaMask transaction
4. Wait for NFT mint confirmation
5. Upload a medical record
6. Grant access to a doctor address
7. View your QR code
```

### 4. Test Doctor Portal

```
1. Have admin register your address as doctor
2. Navigate to /doctor
3. View verification status
4. Issue a prescription to a patient
5. View patient medical records (if access granted)
```

### 5. Test Pharmacy Portal

```
1. Have admin register your address as pharmacy
2. Navigate to /pharmacy
3. Scan or enter prescription ID
4. Verify prescription authenticity
5. Dispense medicine
```

### 6. Test Admin Panel

```
1. Connect with contract owner address
2. Navigate to /admin
3. Register a doctor
4. Register a pharmacy
5. View platform statistics
```

---

## 🐛 Common Issues and Solutions

### Issue 1: "Network not supported"

**Solution:**

1. Open MetaMask
2. Click network dropdown
3. Add Polygon Mumbai:
   - Network Name: Polygon Mumbai
   - RPC URL: https://rpc-mumbai.maticvigil.com
   - Chain ID: 80001
   - Currency: MATIC
   - Block Explorer: https://mumbai.polygonscan.com

### Issue 2: "Insufficient funds"

**Solution:**

1. Get test MATIC from faucet
2. Wait 1-2 minutes for confirmation
3. Retry transaction

### Issue 3: "Contract not deployed"

**Solution:**

1. Verify contract addresses in `.env`
2. Check if contracts are deployed on current network
3. Verify network matches contract deployment

### Issue 4: "IPFS upload failed"

**Solution:**

1. Check Web3.Storage API token
2. Try Pinata as backup
3. Verify file size < 10MB
4. Check internet connection

### Issue 5: "Transaction failed"

**Solution:**

1. Check gas balance
2. Verify contract interaction permissions
3. Look at transaction error in block explorer
4. Ensure wallet has necessary tokens

### Issue 6: "Module not found" errors

**Solution:**

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Or try cache clear
npm cache clean --force
npm install
```

---

## 📁 Project Structure

```
frontend/
├── public/              # Static assets
├── src/
│   ├── components/      # React components
│   │   ├── patient/     # Patient portal (5 files)
│   │   ├── doctor/      # Doctor portal (5 files)
│   │   ├── pharmacy/    # Pharmacy portal (4 files)
│   │   ├── admin/       # Admin panel (3 files)
│   │   ├── wallet/      # Wallet components (2 files)
│   │   └── common/      # Shared components (6 files)
│   ├── hooks/           # Custom React hooks (6 files)
│   ├── lib/             # Utility libraries (5 files)
│   ├── pages/           # Page components (5 files)
│   ├── store/           # Zustand stores (1 file)
│   ├── types/           # TypeScript types (1 file)
│   ├── App.tsx          # Main app component
│   └── main.tsx         # Entry point
├── .env                 # Environment variables
├── package.json         # Dependencies
├── tsconfig.json        # TypeScript config
├── vite.config.ts       # Vite config
└── tailwind.config.js   # Tailwind config
```

---

## 🔐 Security Best Practices

### 1. Private Keys

- **NEVER** commit `.env` to git
- Use different wallets for dev/prod
- Keep private keys secure

### 2. API Keys

- Rotate tokens regularly
- Use read-only tokens where possible
- Monitor API usage

### 3. Smart Contracts

- Audit contracts before mainnet
- Use testnet for development
- Implement access controls

### 4. User Data

- Encrypt sensitive data
- Use IPFS for decentralized storage
- Implement proper access control

---

## 📊 Performance Optimization

### 1. Code Splitting

Already configured in Vite:

- Automatic route-based splitting
- Lazy loading for heavy components

### 2. Image Optimization

```typescript
// Use WebP format
// Implement lazy loading
// Compress images before upload
```

### 3. Caching

```typescript
// React Query handles API caching
// LocalStorage for wallet state
// IPFS content addressing
```

---

## 🚢 Deployment

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production deployment
vercel --prod
```

### Deploy to Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy

# Production deployment
netlify deploy --prod
```

### Deploy to AWS S3

```bash
# Build
npm run build

# Upload to S3 (requires AWS CLI)
aws s3 sync dist/ s3://your-bucket-name
```

### Environment Variables for Production

Set these in your hosting platform:

- All variables from `.env`
- Update contract addresses to mainnet
- Use production API URLs

---

## 🧪 Testing Commands

### Run Tests (if implemented)

```bash
npm test
```

### Lint Code

```bash
npm run lint
```

### Format Code

```bash
npm run format
```

### Type Check

```bash
npm run type-check
```

---

## 📚 Additional Resources

### Documentation

- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [ethers.js Docs](https://docs.ethers.org/)
- [Vite Guide](https://vitejs.dev/guide/)
- [TailwindCSS Docs](https://tailwindcss.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com/)

### Web3 Resources

- [Polygon Docs](https://docs.polygon.technology/)
- [IPFS Docs](https://docs.ipfs.tech/)
- [MetaMask Docs](https://docs.metamask.io/)

### Community

- GitHub Issues: [Report bugs]
- Discord: [Get help]
- Documentation: [Read guides]

---

## 🎯 Next Features to Implement

### Short Term:

- [ ] Unit tests for components
- [ ] E2E tests with Playwright
- [ ] Better error messages
- [ ] Offline support with PWA
- [ ] Mobile app (React Native)

### Long Term:

- [ ] Multi-language support (i18n)
- [ ] Advanced analytics dashboard
- [ ] Telemedicine integration
- [ ] Insurance claim integration
- [ ] AI-powered diagnostics

---

## 📝 Development Workflow

### 1. Feature Branch

```bash
git checkout -b feature/your-feature
```

### 2. Make Changes

```bash
# Edit files
# Test locally
```

### 3. Commit

```bash
git add .
git commit -m "feat: add your feature"
```

### 4. Push & PR

```bash
git push origin feature/your-feature
# Create Pull Request on GitHub
```

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

---

## 📄 License

MIT License - See LICENSE file for details

---

## 👥 Support

For issues or questions:

1. Check existing GitHub issues
2. Create new issue with details
3. Join Discord community
4. Email: support@medichain.io

---

## ✅ Final Checklist

Before going live:

- [ ] All dependencies installed
- [ ] Environment variables configured
- [ ] Contract addresses updated
- [ ] API keys obtained
- [ ] Testnet testing complete
- [ ] Security audit done
- [ ] Performance optimized
- [ ] Documentation updated
- [ ] Deployment configured
- [ ] Monitoring setup

---

**🎉 You're ready to run MediChain!**

Run `npm run dev` and visit http://localhost:5173

---

_Last Updated: Session 2 - Complete Implementation_
_Version: 1.0.0_
_Project: MediChain Decentralized Healthcare Platform_
