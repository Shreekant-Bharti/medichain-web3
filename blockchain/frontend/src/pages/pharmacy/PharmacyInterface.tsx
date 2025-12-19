import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { useWeb3 } from "@/contexts/Web3Context";
import { Pill, QrCode, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";

const PharmacyInterface: React.FC = () => {
  return (
    <Routes>
      <Route index element={<PharmacyOverview />} />
      <Route path="verify" element={<VerifyPrescription />} />
      <Route path="dispense" element={<DispenseMedicine />} />
    </Routes>
  );
};

const PharmacyOverview: React.FC = () => {
  const { account } = useWeb3();

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

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Pharmacy Interface</h1>
        <p className="text-gray-600 mt-2">
          Verify and dispense prescriptions securely
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-8 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <QrCode className="h-8 w-8 text-purple-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                Verify Prescription
              </h3>
              <p className="text-gray-600 mt-2">
                Scan QR code or enter prescription ID
              </p>
              <a
                href="/pharmacy/verify"
                className="text-purple-600 hover:text-purple-700 font-medium mt-4 inline-block"
              >
                Start Verification →
              </a>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <Pill className="h-8 w-8 text-green-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                Dispense Medicine
              </h3>
              <p className="text-gray-600 mt-2">
                Mark prescriptions as dispensed
              </p>
              <a
                href="/pharmacy/dispense"
                className="text-green-600 hover:text-green-700 font-medium mt-4 inline-block"
              >
                Dispense →
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Info Card */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start space-x-3">
          <AlertCircle className="h-6 w-6 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-blue-900">Important</h4>
            <p className="text-blue-700 text-sm mt-1">
              Always verify prescription authenticity before dispensing
              medication. Check expiry dates and ensure the prescription hasn't
              been used before.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const VerifyPrescription: React.FC = () => {
  const { contracts } = useWeb3();
  const [prescriptionId, setPrescriptionId] = useState("");
  const [loading, setLoading] = useState(false);
  const [prescriptionData, setPrescriptionData] = useState<any>(null);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contracts?.prescriptionContract) return;

    setLoading(true);
    try {
      const prescription = await contracts.prescriptionContract.getPrescription(
        prescriptionId
      );

      setPrescriptionData({
        id: prescriptionId,
        patientAddress: prescription.patientAddress,
        doctorAddress: prescription.doctorAddress,
        issuedDate: Number(prescription.issuedDate),
        expiryDate: Number(prescription.expiryDate),
        isDispensed: prescription.isDispensed,
        isValid: prescription.isValid,
      });

      toast.success("Prescription verified");
    } catch (error: any) {
      console.error("Error verifying prescription:", error);
      toast.error("Failed to verify prescription");
      setPrescriptionData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          Verify Prescription
        </h2>
        <p className="text-gray-600 mt-2">
          Enter prescription ID or scan QR code
        </p>
      </div>

      <form
        onSubmit={handleVerify}
        className="bg-white p-6 rounded-lg border border-gray-200 space-y-4"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Prescription ID
          </label>
          <input
            type="text"
            required
            value={prescriptionId}
            onChange={(e) => setPrescriptionId(e.target.value)}
            placeholder="Enter prescription ID"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full px-6 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-gray-400 transition-colors font-medium"
        >
          {loading ? "Verifying..." : "Verify Prescription"}
        </button>
      </form>

      {prescriptionData && (
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Prescription Details
          </h3>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Status
              </label>
              <p
                className={`mt-1 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  prescriptionData.isValid && !prescriptionData.isDispensed
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {prescriptionData.isValid && !prescriptionData.isDispensed ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Valid
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {prescriptionData.isDispensed
                      ? "Already Dispensed"
                      : "Invalid"}
                  </>
                )}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">
                Issued Date
              </label>
              <p className="text-gray-900 mt-1">
                {new Date(
                  prescriptionData.issuedDate * 1000
                ).toLocaleDateString()}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">
                Expiry Date
              </label>
              <p className="text-gray-900 mt-1">
                {new Date(
                  prescriptionData.expiryDate * 1000
                ).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const DispenseMedicine: React.FC = () => {
  return (
    <div className="bg-white p-8 rounded-lg border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        Dispense Medicine
      </h2>
      <p className="text-gray-600">
        Mark prescription as dispensed (Coming Soon)
      </p>
    </div>
  );
};

export default PharmacyInterface;
