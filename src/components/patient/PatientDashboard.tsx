import { useEffect, useState } from "react";
import { useWallet } from "@/hooks/useWallet";
import { usePatientNFT } from "@/hooks/usePatientNFT";
import { usePrescription } from "@/hooks/usePrescription";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import MedicalRecordUpload from "./MedicalRecordUpload";
import AccessManagement from "./AccessManagement";
import PrescriptionHistory from "./PrescriptionHistory";
import QRCodeDisplay from "./QRCodeDisplay";
import { Activity, FileText, Pill } from "lucide-react";
import { toast } from "sonner";

export default function PatientDashboard() {
  const { address } = useWallet();
  const { getPatientTokenId, getMedicalRecords, mintNFT } = usePatientNFT();
  const { getPatientPrescriptions } = usePrescription();
  const [tokenId, setTokenId] = useState<bigint | null>(null);
  const [records, setRecords] = useState<any[]>([]);
  const [prescriptions, setPrescriptions] = useState<bigint[]>([]);
  const [loading, setLoading] = useState(true);
  const [minting, setMinting] = useState(false);

  useEffect(() => {
    loadPatientData();
  }, [address]);

  async function loadPatientData() {
    if (!address) return;

    try {
      setLoading(true);

      // Fetch patient's NFT token ID
      const id = await getPatientTokenId(address);

      if (id) {
        setTokenId(id);

        // Load records and prescriptions
        const [recordsData, prescriptionsData] = await Promise.all([
          getMedicalRecords(id),
          getPatientPrescriptions(id),
        ]);

        setRecords(recordsData.filter((r: any) => r.isActive));
        setPrescriptions(prescriptionsData);
      }
    } catch (error) {
      console.error("Failed to load patient data:", error);
    } finally {
      setLoading(false);
    }
  }

  const handleRegister = async () => {
    if (!address) return;

    setMinting(true);
    try {
      const { receipt, tokenId: newTokenId } = await mintNFT(address);
      toast.success(`Patient NFT minted! Token ID: ${newTokenId}`);
      setTokenId(newTokenId);
    } catch (error: any) {
      toast.error(error.message || "Failed to register");
    } finally {
      setMinting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading patient data..." />
      </div>
    );
  }

  if (!tokenId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Patient Not Registered</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              You need to mint a Patient NFT to access the portal. This will
              create your unique health passport on the blockchain.
            </p>
            <Button
              onClick={handleRegister}
              disabled={minting}
              className="w-full"
            >
              {minting ? "Minting NFT..." : "Register as Patient"}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Patient Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Health Passport
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">#{tokenId.toString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Token ID</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Medical Records
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{records.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Total Records</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Prescriptions</CardTitle>
            <Pill className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{prescriptions.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Active Prescriptions
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="qr" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="qr">QR Code</TabsTrigger>
          <TabsTrigger value="upload">Upload Record</TabsTrigger>
          <TabsTrigger value="access">Access Control</TabsTrigger>
          <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
        </TabsList>

        <TabsContent value="qr" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Health Passport QR Code</CardTitle>
            </CardHeader>
            <CardContent>
              <QRCodeDisplay tokenId={tokenId} address={address!} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="upload" className="mt-6">
          <MedicalRecordUpload tokenId={tokenId} onSuccess={loadPatientData} />
        </TabsContent>

        <TabsContent value="access" className="mt-6">
          <AccessManagement tokenId={tokenId} />
        </TabsContent>

        <TabsContent value="prescriptions" className="mt-6">
          <PrescriptionHistory tokenId={tokenId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
