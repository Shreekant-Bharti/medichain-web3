import React from "react";
import { Link } from "react-router-dom";
import { useWeb3 } from "@/contexts/Web3Context";
import {
  Activity,
  Shield,
  Lock,
  Database,
  Users,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

const HomePage: React.FC = () => {
  const { account, connectWallet } = useWeb3();

  const features = [
    {
      icon: Shield,
      title: "Blockchain Security",
      description: "Immutable medical records stored on Ethereum blockchain",
    },
    {
      icon: Lock,
      title: "End-to-End Encryption",
      description: "AES-256 encryption ensures data privacy",
    },
    {
      icon: Database,
      title: "IPFS Storage",
      description: "Decentralized storage with no single point of failure",
    },
    {
      icon: Users,
      title: "Access Control",
      description: "Granular permissions managed by smart contracts",
    },
  ];

  const userTypes = [
    {
      title: "Patient",
      description: "Manage your health records and control access",
      href: "/patient",
      color: "blue",
    },
    {
      title: "Doctor",
      description: "Access patient records and issue prescriptions",
      href: "/doctor",
      color: "green",
    },
    {
      title: "Pharmacy",
      description: "Verify and dispense prescriptions securely",
      href: "/pharmacy",
      color: "purple",
    },
    {
      title: "Admin",
      description: "Manage doctors and monitor platform activity",
      href: "/admin",
      color: "red",
    },
  ];

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center space-y-6 py-12">
        <div className="flex justify-center">
          <Activity className="h-20 w-20 text-blue-600" />
        </div>
        <h1 className="text-5xl font-bold text-gray-900">
          Welcome to MediChain
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Decentralized healthcare management system powered by blockchain
          technology. Secure, transparent, and patient-controlled medical
          records.
        </p>

        {!account ? (
          <button
            onClick={connectWallet}
            className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-lg inline-flex items-center space-x-2"
          >
            <span>Connect Wallet to Get Started</span>
            <ArrowRight className="h-5 w-5" />
          </button>
        ) : (
          <p className="text-green-600 font-medium flex items-center justify-center space-x-2">
            <CheckCircle2 className="h-5 w-5" />
            <span>Wallet Connected - Choose your role below</span>
          </p>
        )}
      </section>

      {/* Features Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <div
              key={index}
              className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow"
            >
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Icon className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
            </div>
          );
        })}
      </section>

      {/* User Types Section */}
      <section className="space-y-8">
        <h2 className="text-3xl font-bold text-center text-gray-900">
          Choose Your Role
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {userTypes.map((userType, index) => (
            <Link
              key={index}
              to={userType.href}
              className={`bg-white p-8 rounded-lg border-2 hover:shadow-xl transition-all group ${
                userType.color === "blue"
                  ? "border-blue-200 hover:border-blue-400"
                  : userType.color === "green"
                  ? "border-green-200 hover:border-green-400"
                  : userType.color === "purple"
                  ? "border-purple-200 hover:border-purple-400"
                  : "border-red-200 hover:border-red-400"
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-gray-900">
                    {userType.title}
                  </h3>
                  <p className="text-gray-600">{userType.description}</p>
                </div>
                <ArrowRight
                  className={`h-6 w-6 group-hover:translate-x-1 transition-transform ${
                    userType.color === "blue"
                      ? "text-blue-600"
                      : userType.color === "green"
                      ? "text-green-600"
                      : userType.color === "purple"
                      ? "text-purple-600"
                      : "text-red-600"
                  }`}
                />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-white p-8 rounded-lg border border-gray-200">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
          How It Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center space-y-3">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600 font-bold text-xl">
              1
            </div>
            <h3 className="font-semibold text-lg">Connect Wallet</h3>
            <p className="text-gray-600 text-sm">
              Connect your MetaMask wallet to access the platform
            </p>
          </div>
          <div className="text-center space-y-3">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600 font-bold text-xl">
              2
            </div>
            <h3 className="font-semibold text-lg">Mint Health NFT</h3>
            <p className="text-gray-600 text-sm">
              Patients create a unique NFT representing their digital identity
            </p>
          </div>
          <div className="text-center space-y-3">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600 font-bold text-xl">
              3
            </div>
            <h3 className="font-semibold text-lg">Manage Records</h3>
            <p className="text-gray-600 text-sm">
              Upload medical records, grant access, and interact with healthcare
              providers
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
