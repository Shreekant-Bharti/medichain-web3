import { useEffect, useState } from "react";
import { usePrescription } from "@/hooks/usePrescription";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import DispenseMedicine from "./DispenseMedicine";
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Shield,
  ArrowLeft,
} from "lucide-react";
import { toast } from "sonner";
import { Prescription, PrescriptionStatus } from "@/types";

interface VerifyPrescriptionProps {
  prescriptionId: bigint;
  pharmacyAddress: string;
  onBack: () => void;
}

export default function VerifyPrescription({
  prescriptionId,
  pharmacyAddress,
  onBack,
}: VerifyPrescriptionProps) {
  const [prescription, setPrescription] = useState<Prescription | null>(null);
  const [loading, setLoading] = useState(true);
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [showDispense, setShowDispense] = useState(false);

  const { getPrescription, verifyPrescription } = usePrescription();

  useEffect(() => {
    loadAndVerifyPrescription();
  }, [prescriptionId]);

  async function loadAndVerifyPrescription() {
    try {
      setLoading(true);

      // Fetch prescription details
      const data = await getPrescription(prescriptionId);
      setPrescription(data);

      // Verify prescription
      const verification = await verifyPrescription(prescriptionId);
      setVerificationResult(verification);

      if (verification.isValid) {
        toast.success("Prescription verified successfully!");
      } else {
        toast.error("Prescription verification failed!");
      }
    } catch (error: any) {
      console.error("Verification failed:", error);
      toast.error(error.message || "Failed to verify prescription");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="py-12">
          <LoadingSpinner text="Verifying prescription..." />
        </CardContent>
      </Card>
    );
  }

  if (!prescription) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <XCircle className="h-12 w-12 mx-auto text-red-500 mb-3" />
          <p className="text-red-600 font-medium">Prescription not found</p>
          <Button variant="outline" onClick={onBack} className="mt-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (showDispense && verificationResult?.isValid) {
    return (
      <DispenseMedicine
        prescription={prescription}
        pharmacyAddress={pharmacyAddress}
        onBack={() => setShowDispense(false)}
        onSuccess={onBack}
      />
    );
  }

  const isExpired =
    prescription.expiryDate < BigInt(Math.floor(Date.now() / 1000));
  const isDispensed = prescription.status === PrescriptionStatus.DISPENSED;
  const isRevoked = prescription.status === PrescriptionStatus.REVOKED;
  const canDispense =
    verificationResult?.isValid && !isExpired && !isDispensed && !isRevoked;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Verification Result
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Verification Status */}
          <div className="flex items-center justify-center">
            {verificationResult?.isValid ? (
              <div className="text-center">
                <CheckCircle2 className="h-16 w-16 mx-auto text-green-600 mb-2" />
                <p className="text-xl font-bold text-green-600">
                  Valid Prescription
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  This prescription is authentic and can be dispensed
                </p>
              </div>
            ) : (
              <div className="text-center">
                <XCircle className="h-16 w-16 mx-auto text-red-600 mb-2" />
                <p className="text-xl font-bold text-red-600">
                  Invalid Prescription
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  This prescription cannot be dispensed
                </p>
              </div>
            )}
          </div>

          {/* Warning Alerts */}
          {isExpired && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                This prescription has expired on{" "}
                {new Date(
                  Number(prescription.expiryDate) * 1000
                ).toLocaleDateString()}
              </AlertDescription>
            </Alert>
          )}

          {isDispensed && (
            <Alert variant="destructive">
              <AlertDescription>
                This prescription has already been dispensed
              </AlertDescription>
            </Alert>
          )}

          {isRevoked && (
            <Alert variant="destructive">
              <AlertDescription>
                This prescription has been revoked by the issuing doctor
              </AlertDescription>
            </Alert>
          )}

          {/* Prescription Details */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Prescription ID
                </p>
                <p className="font-mono">
                  #{prescription.prescriptionId.toString()}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Status
                </p>
                <Badge>
                  {prescription.status === PrescriptionStatus.ISSUED
                    ? "Issued"
                    : prescription.status === PrescriptionStatus.DISPENSED
                    ? "Dispensed"
                    : prescription.status === PrescriptionStatus.EXPIRED
                    ? "Expired"
                    : "Revoked"}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Medicine Name
                </p>
                <p className="text-lg font-semibold">
                  {prescription.medicineName}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Quantity
                </p>
                <p className="text-lg font-semibold">
                  {prescription.quantity} units
                </p>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Dosage
              </p>
              <p>{prescription.dosage}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Instructions
              </p>
              <p className="text-sm">{prescription.instructions}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Patient Token ID
                </p>
                <p className="font-mono">
                  #{prescription.patientTokenId.toString()}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Doctor
                </p>
                <p className="font-mono text-xs">
                  {prescription.doctor.slice(0, 6)}...
                  {prescription.doctor.slice(-4)}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Issue Date
                </p>
                <p className="text-sm">
                  {new Date(
                    Number(prescription.issueDate) * 1000
                  ).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Expiry Date
                </p>
                <p className="text-sm">
                  {new Date(
                    Number(prescription.expiryDate) * 1000
                  ).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Action Button */}
          {canDispense && (
            <Button
              onClick={() => setShowDispense(true)}
              className="w-full"
              size="lg"
            >
              Proceed to Dispense
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
