import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { useWeb3 } from "@/contexts/Web3Context";
import {
  Shield,
  UserPlus,
  CheckCircle,
  AlertCircle,
  Activity,
} from "lucide-react";
import toast from "react-hot-toast";

const AdminPanel: React.FC = () => {
  return (
    <Routes>
      <Route index element={<AdminOverview />} />
      <Route path="register" element={<RegisterDoctor />} />
      <Route path="verify" element={<VerifyDoctors />} />
    </Routes>
  );
};

const AdminOverview: React.FC = () => {
  const { account, contracts } = useWeb3();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    checkAdminStatus();
  }, [account, contracts]);

  const checkAdminStatus = async () => {
    if (!account || !contracts?.doctorRegistry) {
      setLoading(false);
      return;
    }

    try {
      // Check if the connected account has admin role
      const DEFAULT_ADMIN_ROLE =
        "0x0000000000000000000000000000000000000000000000000000000000000000";
      const hasRole = await contracts.doctorRegistry.hasRole(
        DEFAULT_ADMIN_ROLE,
        account
      );
      setIsAdmin(hasRole);
    } catch (error) {
      console.error("Error checking admin status:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!account) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center space-y-4">
          <AlertCircle className="h-16 w-16 text-gray-400 mx-auto" />
          <h3 className="text-xl font-semibold text-gray-700">
            Please connect your wallet
          </h3>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="max-w-2xl mx-auto text-center space-y-6 py-12">
        <AlertCircle className="h-20 w-20 text-red-500 mx-auto" />
        <h2 className="text-2xl font-bold text-gray-900">Access Denied</h2>
        <p className="text-gray-600">
          You don't have administrator privileges. Only platform administrators
          can access this panel.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
        <p className="text-gray-600 mt-2">
          Manage doctors and monitor platform activity
        </p>
      </div>

      {/* Admin Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-8 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <UserPlus className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                Register Doctor
              </h3>
              <p className="text-gray-600 mt-2">
                Add new doctors to the platform
              </p>
              <a
                href="/admin/register"
                className="text-blue-600 hover:text-blue-700 font-medium mt-4 inline-block"
              >
                Register →
              </a>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                Verify Doctors
              </h3>
              <p className="text-gray-600 mt-2">
                Approve pending doctor registrations
              </p>
              <a
                href="/admin/verify"
                className="text-green-600 hover:text-green-700 font-medium mt-4 inline-block"
              >
                Verify →
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Platform Stats */}
      <div className="bg-white p-8 rounded-lg border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">
          Platform Statistics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <Activity className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">-</p>
            <p className="text-sm text-gray-600">Total Patients</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <Activity className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">-</p>
            <p className="text-sm text-gray-600">Active Doctors</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <Activity className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">-</p>
            <p className="text-sm text-gray-600">Prescriptions</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const RegisterDoctor: React.FC = () => {
  const { contracts } = useWeb3();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    doctorAddress: "",
    name: "",
    licenseNumber: "",
    specialization: "",
    hospitalName: "",
  });

  const specializations = [
    "General Practice",
    "Cardiology",
    "Dermatology",
    "Neurology",
    "Orthopedics",
    "Pediatrics",
    "Psychiatry",
    "Radiology",
    "Surgery",
    "Oncology",
    "Emergency Medicine",
    "Other",
  ];

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contracts?.doctorRegistry) return;

    setLoading(true);
    try {
      const tx = await contracts.doctorRegistry.registerDoctor(
        formData.doctorAddress,
        formData.name,
        formData.licenseNumber,
        formData.specialization,
        formData.hospitalName
      );

      toast.promise(tx.wait(), {
        loading: "Registering doctor...",
        success: "Doctor registered successfully!",
        error: "Failed to register doctor",
      });

      await tx.wait();
      setFormData({
        doctorAddress: "",
        name: "",
        licenseNumber: "",
        specialization: "",
        hospitalName: "",
      });
    } catch (error: any) {
      console.error("Error registering doctor:", error);
      toast.error(error.reason || "Failed to register doctor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          Register New Doctor
        </h2>
        <p className="text-gray-600 mt-2">Add a new doctor to the platform</p>
      </div>

      <form
        onSubmit={handleRegister}
        className="bg-white p-8 rounded-lg border border-gray-200 space-y-6"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Doctor Wallet Address
          </label>
          <input
            type="text"
            required
            value={formData.doctorAddress}
            onChange={(e) =>
              setFormData({ ...formData, doctorAddress: e.target.value })
            }
            placeholder="0x..."
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Dr. John Doe"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Medical License Number
          </label>
          <input
            type="text"
            required
            value={formData.licenseNumber}
            onChange={(e) =>
              setFormData({ ...formData, licenseNumber: e.target.value })
            }
            placeholder="ML123456"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Specialization
          </label>
          <select
            required
            value={formData.specialization}
            onChange={(e) =>
              setFormData({ ...formData, specialization: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select specialization</option>
            {specializations.map((spec) => (
              <option key={spec} value={spec}>
                {spec}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Hospital/Clinic Name
          </label>
          <input
            type="text"
            required
            value={formData.hospitalName}
            onChange={(e) =>
              setFormData({ ...formData, hospitalName: e.target.value })
            }
            placeholder="City General Hospital"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
        >
          {loading ? "Registering..." : "Register Doctor"}
        </button>
      </form>
    </div>
  );
};

const VerifyDoctors: React.FC = () => {
  return (
    <div className="bg-white p-8 rounded-lg border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Verify Doctors</h2>
      <p className="text-gray-600">
        Approve pending doctor registrations (Coming Soon)
      </p>
    </div>
  );
};

export default AdminPanel;
