import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { useWeb3 } from "@/contexts/Web3Context";
import { Stethoscope, FileText, Users, AlertCircle } from "lucide-react";
import { toast } from "sonner";

const DoctorPortal: React.FC = () => {
  return (
    <Routes>
      <Route index element={<DoctorOverview />} />
      <Route path="patients" element={<PatientList />} />
      <Route path="prescribe" element={<IssuePrescription />} />
    </Routes>
  );
};

const DoctorOverview: React.FC = () => {
  const { account, contracts } = useWeb3();
  const [doctorData, setDoctorData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDoctorData();
  }, [account, contracts]);

  const loadDoctorData = async () => {
    if (!account || !contracts?.doctorRegistry) {
      setLoading(false);
      return;
    }

    try {
      const isRegistered = await contracts.doctorRegistry.isDoctor(account);

      if (isRegistered) {
        const doctor = await contracts.doctorRegistry.getDoctor(account);
        setDoctorData({
          isRegistered: true,
          name: doctor.name,
          licenseNumber: doctor.licenseNumber,
          specialization: doctor.specialization,
          hospitalName: doctor.hospitalName,
          status: doctor.status,
        });
      } else {
        setDoctorData({ isRegistered: false });
      }
    } catch (error) {
      console.error("Error loading doctor data:", error);
      toast.error("Failed to load doctor data");
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!doctorData?.isRegistered) {
    return (
      <div className="max-w-2xl mx-auto text-center space-y-6 py-12">
        <AlertCircle className="h-20 w-20 text-yellow-500 mx-auto" />
        <h2 className="text-2xl font-bold text-gray-900">
          Not Registered as Doctor
        </h2>
        <p className="text-gray-600">
          Your wallet address is not registered as a doctor in the system.
          Please contact an administrator to register your account.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Doctor Portal</h1>
        <p className="text-gray-600 mt-2">
          Access patient records and issue prescriptions
        </p>
      </div>

      {/* Doctor Info Card */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="flex items-start space-x-4">
          <div className="p-3 bg-green-100 rounded-lg">
            <Stethoscope className="h-8 w-8 text-green-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900">
              {doctorData.name}
            </h3>
            <div className="mt-2 space-y-1">
              <p className="text-sm text-gray-600">
                <span className="font-medium">License:</span>{" "}
                {doctorData.licenseNumber}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Specialization:</span>{" "}
                {doctorData.specialization}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Hospital:</span>{" "}
                {doctorData.hospitalName}
              </p>
              <p className="text-sm">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    doctorData.status === 2
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {doctorData.status === 2
                    ? "Verified"
                    : "Pending Verification"}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <Users className="h-8 w-8 text-blue-600 mb-3" />
          <h3 className="text-lg font-semibold text-gray-900">Patient List</h3>
          <p className="text-sm text-gray-600 mt-2">
            View patients who granted you access
          </p>
          <a
            href="/doctor/patients"
            className="text-blue-600 hover:text-blue-700 text-sm font-medium mt-4 inline-block"
          >
            View Patients →
          </a>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <FileText className="h-8 w-8 text-purple-600 mb-3" />
          <h3 className="text-lg font-semibold text-gray-900">
            Issue Prescription
          </h3>
          <p className="text-sm text-gray-600 mt-2">
            Create new prescriptions for patients
          </p>
          <a
            href="/doctor/prescribe"
            className="text-purple-600 hover:text-purple-700 text-sm font-medium mt-4 inline-block"
          >
            Issue Prescription →
          </a>
        </div>
      </div>
    </div>
  );
};

const PatientList: React.FC = () => {
  return (
    <div className="bg-white p-8 rounded-lg border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">My Patients</h2>
      <p className="text-gray-600">
        View patients who have granted you access (Coming Soon)
      </p>
    </div>
  );
};

const IssuePrescription: React.FC = () => {
  return (
    <div className="bg-white p-8 rounded-lg border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        Issue Prescription
      </h2>
      <p className="text-gray-600">
        Create and sign prescriptions (Coming Soon)
      </p>
    </div>
  );
};

export default DoctorPortal;
