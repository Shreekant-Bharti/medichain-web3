import React, { useState, useEffect } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { useWeb3 } from "@/contexts/Web3Context";
import { QRCodeSVG } from "qrcode.react";
import {
  User,
  Upload,
  Shield,
  FileText,
  AlertCircle,
  CheckCircle,
  Plus,
  Eye,
} from "lucide-react";
import { toast } from "sonner";
import { uploadMedicalRecord } from "@/utils/ipfs";
import { encryptData } from "@/utils/encryption";

interface NFTData {
  tokenId: string;
  exists: boolean;
  dateOfBirth: number;
  bloodGroup: string;
  emergencyContact: string;
}

interface MedicalRecord {
  recordId: string;
  ipfsCid: string;
  timestamp: number;
  recordType: string;
}

const PatientDashboard: React.FC = () => {
  return (
    <Routes>
      <Route index element={<PatientOverview />} />
      <Route path="nft" element={<NFTManagement />} />
      <Route path="records" element={<MedicalRecords />} />
      <Route path="access" element={<AccessManagement />} />
      <Route path="prescriptions" element={<PrescriptionHistory />} />
    </Routes>
  );
};

const PatientOverview: React.FC = () => {
  const { account, contracts } = useWeb3();
  const navigate = useNavigate();
  const [nftData, setNftData] = useState<NFTData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNFTData();
  }, [account, contracts]);

  const loadNFTData = async () => {
    if (!account || !contracts?.patientNFT) {
      setLoading(false);
      return;
    }

    try {
      const tokenId = await contracts.patientNFT.getPatientTokenId(account);

      if (tokenId.toString() !== "0") {
        const [dob, bloodGroup, emergencyContact] = await Promise.all([
          contracts.patientNFT.getDateOfBirth(tokenId),
          contracts.patientNFT.getBloodGroup(tokenId),
          contracts.patientNFT.getEmergencyContact(tokenId),
        ]);

        setNftData({
          tokenId: tokenId.toString(),
          exists: true,
          dateOfBirth: Number(dob),
          bloodGroup,
          emergencyContact,
        });
      } else {
        setNftData({
          tokenId: "0",
          exists: false,
          dateOfBirth: 0,
          bloodGroup: "",
          emergencyContact: "",
        });
      }
    } catch (error) {
      console.error("Error loading NFT data:", error);
      toast.error("Failed to load NFT data");
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      title: "Manage NFT",
      description: "View or mint your Health NFT",
      href: "/patient/nft",
      icon: User,
      color: "blue",
    },
    {
      title: "Medical Records",
      description: "Upload and manage records",
      href: "/patient/records",
      icon: FileText,
      color: "green",
    },
    {
      title: "Access Control",
      description: "Grant or revoke doctor access",
      href: "/patient/access",
      icon: Shield,
      color: "purple",
    },
    {
      title: "Prescriptions",
      description: "View prescription history",
      href: "/patient/prescriptions",
      icon: Upload,
      color: "orange",
    },
  ];

  if (!account) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center space-y-4">
          <AlertCircle className="h-16 w-16 text-gray-400 mx-auto" />
          <h3 className="text-xl font-semibold text-gray-700">
            Please connect your wallet
          </h3>
          <p className="text-gray-500">
            Connect your wallet to access the patient dashboard
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Patient Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Manage your health records and control access to your medical data
        </p>
      </div>

      {/* NFT Status Card */}
      {nftData && (
        <div
          className={`p-6 rounded-lg border-2 ${
            nftData.exists
              ? "bg-green-50 border-green-200"
              : "bg-yellow-50 border-yellow-200"
          }`}
        >
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {nftData.exists ? "Health NFT Active" : "No Health NFT"}
              </h3>
              <p className="text-gray-600 mt-1">
                {nftData.exists
                  ? `Token ID: #${nftData.tokenId}`
                  : "Mint your Health NFT to get started"}
              </p>
            </div>
            {nftData.exists ? (
              <CheckCircle className="h-8 w-8 text-green-600" />
            ) : (
              <AlertCircle className="h-8 w-8 text-yellow-600" />
            )}
          </div>
          {!nftData.exists && (
            <button
              onClick={() => navigate("/patient/nft")}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors inline-flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Mint Health NFT</span>
            </button>
          )}
        </div>
      )}

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Link
                key={index}
                to={action.href}
                className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow group"
              >
                <div className="flex items-start space-x-4">
                  <div
                    className={`p-3 rounded-lg ${
                      action.color === "blue"
                        ? "bg-blue-100"
                        : action.color === "green"
                        ? "bg-green-100"
                        : action.color === "purple"
                        ? "bg-purple-100"
                        : "bg-orange-100"
                    }`}
                  >
                    <Icon
                      className={`h-6 w-6 ${
                        action.color === "blue"
                          ? "text-blue-600"
                          : action.color === "green"
                          ? "text-green-600"
                          : action.color === "purple"
                          ? "text-purple-600"
                          : "text-orange-600"
                      }`}
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {action.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {action.description}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const NFTManagement: React.FC = () => {
  const { account, contracts } = useWeb3();
  const [nftData, setNftData] = useState<NFTData | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    dateOfBirth: "",
    bloodGroup: "",
    emergencyContact: "",
  });

  useEffect(() => {
    loadNFTData();
  }, [account, contracts]);

  const loadNFTData = async () => {
    if (!account || !contracts?.patientNFT) return;

    try {
      const tokenId = await contracts.patientNFT.getPatientTokenId(account);

      if (tokenId.toString() !== "0") {
        const [dob, bloodGroup, emergencyContact] = await Promise.all([
          contracts.patientNFT.getDateOfBirth(tokenId),
          contracts.patientNFT.getBloodGroup(tokenId),
          contracts.patientNFT.getEmergencyContact(tokenId),
        ]);

        setNftData({
          tokenId: tokenId.toString(),
          exists: true,
          dateOfBirth: Number(dob),
          bloodGroup,
          emergencyContact,
        });
      } else {
        setNftData({
          tokenId: "0",
          exists: false,
          dateOfBirth: 0,
          bloodGroup: "",
          emergencyContact: "",
        });
      }
    } catch (error) {
      console.error("Error loading NFT data:", error);
    }
  };

  const handleMintNFT = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contracts?.patientNFT) return;

    setLoading(true);
    try {
      const dobTimestamp = Math.floor(
        new Date(formData.dateOfBirth).getTime() / 1000
      );

      const tx = await contracts.patientNFT.mintPatientNFT(
        dobTimestamp,
        formData.bloodGroup,
        formData.emergencyContact
      );

      toast.promise(tx.wait(), {
        loading: "Minting Health NFT...",
        success: "Health NFT minted successfully!",
        error: "Failed to mint NFT",
      });

      await tx.wait();
      await loadNFTData();
    } catch (error: any) {
      console.error("Error minting NFT:", error);
      toast.error(error.reason || "Failed to mint NFT");
    } finally {
      setLoading(false);
    }
  };

  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  if (!nftData) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (nftData.exists) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Your Health NFT</h1>
          <p className="text-gray-600 mt-2">Token ID: #{nftData.tokenId}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* QR Code */}
          <div className="bg-white p-8 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              QR Code
            </h3>
            <div className="flex justify-center p-4 bg-gray-50 rounded-lg">
              <QRCodeSVG
                value={JSON.stringify({
                  tokenId: nftData.tokenId,
                  patientAddress: account,
                })}
                size={200}
                level="H"
              />
            </div>
            <p className="text-sm text-gray-600 text-center mt-4">
              Share this QR code with healthcare providers
            </p>
          </div>

          {/* NFT Details */}
          <div className="bg-white p-8 rounded-lg border border-gray-200 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Details
            </h3>

            <div>
              <label className="text-sm font-medium text-gray-700">
                Date of Birth
              </label>
              <p className="text-gray-900 mt-1">
                {new Date(nftData.dateOfBirth * 1000).toLocaleDateString()}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                Blood Group
              </label>
              <p className="text-gray-900 mt-1">{nftData.bloodGroup}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                Emergency Contact
              </label>
              <p className="text-gray-900 mt-1">{nftData.emergencyContact}</p>
            </div>

            <div className="pt-4 border-t">
              <p className="text-sm text-gray-600">
                <CheckCircle className="inline h-4 w-4 text-green-600 mr-1" />
                This is a soulbound token (non-transferable)
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">
          Mint Your Health NFT
        </h1>
        <p className="text-gray-600 mt-2">
          Create your unique health identity on the blockchain
        </p>
      </div>

      <form
        onSubmit={handleMintNFT}
        className="bg-white p-8 rounded-lg border border-gray-200 space-y-6"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date of Birth
          </label>
          <input
            type="date"
            required
            value={formData.dateOfBirth}
            onChange={(e) =>
              setFormData({ ...formData, dateOfBirth: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Blood Group
          </label>
          <select
            required
            value={formData.bloodGroup}
            onChange={(e) =>
              setFormData({ ...formData, bloodGroup: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select blood group</option>
            {bloodGroups.map((bg) => (
              <option key={bg} value={bg}>
                {bg}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Emergency Contact
          </label>
          <input
            type="tel"
            required
            placeholder="+1234567890"
            value={formData.emergencyContact}
            onChange={(e) =>
              setFormData({ ...formData, emergencyContact: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center space-x-2"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Minting...</span>
            </>
          ) : (
            <>
              <Plus className="h-5 w-5" />
              <span>Mint Health NFT</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

// Placeholder components for other routes
const MedicalRecords: React.FC = () => {
  return (
    <div className="bg-white p-8 rounded-lg border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Medical Records</h2>
      <p className="text-gray-600">
        Upload and manage your medical records (Coming Soon)
      </p>
    </div>
  );
};

const AccessManagement: React.FC = () => {
  return (
    <div className="bg-white p-8 rounded-lg border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        Access Management
      </h2>
      <p className="text-gray-600">
        Grant or revoke doctor access (Coming Soon)
      </p>
    </div>
  );
};

const PrescriptionHistory: React.FC = () => {
  return (
    <div className="bg-white p-8 rounded-lg border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        Prescription History
      </h2>
      <p className="text-gray-600">
        View your prescription history (Coming Soon)
      </p>
    </div>
  );
};

export default PatientDashboard;
