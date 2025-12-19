import { useEffect, useState } from "react";
import { useWallet } from "@/hooks/useWallet";
import { useContract } from "@/hooks/useContract";
import { CONTRACTS } from "@/lib/contracts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import ScanPrescription from "./ScanPrescription";
import { Building2, Pill, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export default function PharmacyDashboard() {
  const { address } = useWallet();
  const { read } = useContract();
  const [isVerified, setIsVerified] = useState(false);
  const [pharmacyInfo, setPharmacyInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [dispensedCount, setDispensedCount] = useState(0);

  useEffect(() => {
    checkPharmacyVerification();
  }, [address]);

  async function checkPharmacyVerification() {
    if (!address) return;

    try {
      setLoading(true);

      // Check if pharmacy is registered and verified
      const pharmacy = await read(
        CONTRACTS.PharmacyRegistry.address,
        CONTRACTS.PharmacyRegistry.abi,
        "getPharmacy",
        [address]
      );

      if (pharmacy && pharmacy.isActive) {
        setIsVerified(true);
        setPharmacyInfo(pharmacy);

        // Get dispensed count (from events or state)
        // TODO: Implement dispensed count
        setDispensedCount(0);
      }
    } catch (error) {
      console.error("Failed to verify pharmacy:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Verifying pharmacy credentials..." />
      </div>
    );
  }

  if (!isVerified) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-6 w-6" />
              Pharmacy Not Verified
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="destructive">
              <AlertDescription>
                Your account is not registered as a verified pharmacy in the
                MediChain system.
              </AlertDescription>
            </Alert>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                To access the Pharmacy Portal, you need to:
              </p>
              <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground ml-2">
                <li>Contact the platform administrator</li>
                <li>Submit your pharmacy license and credentials</li>
                <li>Wait for approval from the admin panel</li>
              </ol>
            </div>
            <p className="text-xs text-muted-foreground border-l-4 border-primary pl-3">
              Connected wallet: <span className="font-mono">{address}</span>
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Pharmacy Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Verification Status
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Verified</div>
            <p className="text-xs text-muted-foreground mt-1">
              {pharmacyInfo?.name || "Pharmacy"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              License Number
            </CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-mono">
              {pharmacyInfo?.licenseNumber || "N/A"}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Active License</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Dispensed</CardTitle>
            <Pill className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dispensedCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Total prescriptions
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="scan" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="scan">Scan Prescription</TabsTrigger>
          <TabsTrigger value="history">Dispense History</TabsTrigger>
        </TabsList>

        <TabsContent value="scan" className="mt-6">
          <ScanPrescription pharmacyAddress={address!} />
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <Card>
            <CardContent className="py-12 text-center">
              <Pill className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground">
                Dispense history will appear here
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                All prescriptions you've dispensed will be tracked
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
