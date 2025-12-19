import React, { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { useWeb3 } from "@/contexts/Web3Context";
import { Activity, User, Stethoscope, Pill, Shield } from "lucide-react";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { account, chainId, connectWallet, disconnectWallet } = useWeb3();
  const location = useLocation();

  const navigation = [
    { name: "Patient", href: "/patient", icon: User },
    { name: "Doctor", href: "/doctor", icon: Stethoscope },
    { name: "Pharmacy", href: "/pharmacy", icon: Pill },
    { name: "Admin", href: "/admin", icon: Shield },
  ];

  const isActive = (path: string) => location.pathname.startsWith(path);

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getNetworkName = (chainId: number) => {
    const networks: { [key: number]: string } = {
      1: "Mainnet",
      11155111: "Sepolia",
      80001: "Mumbai",
      31337: "Localhost",
    };
    return networks[chainId] || `Chain ${chainId}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <Activity className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">MediChain</span>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex space-x-4">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive(item.href)
                        ? "bg-blue-100 text-blue-700"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Wallet Connection */}
            <div className="flex items-center space-x-4">
              {account ? (
                <div className="flex items-center space-x-3">
                  {chainId && (
                    <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 bg-green-100 text-green-700 rounded-md text-sm">
                      <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span>{getNetworkName(chainId)}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-md">
                    <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm font-medium text-gray-700">
                      {formatAddress(account)}
                    </span>
                  </div>
                  <button
                    onClick={disconnectWallet}
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Disconnect
                  </button>
                </div>
              ) : (
                <button
                  onClick={connectWallet}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
                >
                  Connect Wallet
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden border-t border-gray-200">
          <nav className="flex justify-around py-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex flex-col items-center py-2 px-3 rounded-md text-xs font-medium ${
                    isActive(item.href)
                      ? "text-blue-700 bg-blue-50"
                      : "text-gray-600"
                  }`}
                >
                  <Icon className="h-5 w-5 mb-1" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-gray-500">
              © 2024 MediChain. Decentralized Healthcare Management.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-sm text-gray-500 hover:text-gray-700">
                Privacy
              </a>
              <a href="#" className="text-sm text-gray-500 hover:text-gray-700">
                Terms
              </a>
              <a href="#" className="text-sm text-gray-500 hover:text-gray-700">
                Documentation
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
