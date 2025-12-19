import { useEffect, useState } from "react";
import { useWallet } from "@/hooks/useWallet";
import { useContract } from "@/hooks/useContract";
import { CONTRACTS } from "@/lib/contracts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import PatientList from "./PatientList";
import IssuePrescription from "./IssuePrescription";
import { Stethoscope, Users, FileText, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export default function DoctorDashboard() {
  const { address } = useWallet();
  const { read } = useContract();
  const [isVerified, setIsVerified] = useState(false);
  const [doctorInfo, setDoctorInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [prescriptionCount, setPrescriptionCount] = useState(0);

  useEffect(() => {
    checkDoctorVerification();
  }, [address]);

  async function checkDoctorVerification() {
    if (!address) return;

    try {
      setLoading(true);

      // Check if doctor is registered and verified
      const doctor = await read(
        CONTRACTS.DoctorRegistry.address,
        CONTRACTS.DoctorRegistry.abi,
        "getDoctor",
        [address]
      );

      if (doctor && doctor.isVerified) {
        setIsVerified(true);
        setDoctorInfo(doctor);

        // Get prescription count (from events or state)
        // TODO: Implement prescription count
        setPrescriptionCount(0);
      }
    } catch (error) {
      console.error("Failed to verify doctor:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Verifying doctor credentials..." />
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
              Doctor Not Verified
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="destructive">
              <AlertDescription>
                Your account is not registered as a verified doctor in the
                MediChain system.
              </AlertDescription>
            </Alert>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                To access the Doctor Portal, you need to:
              </p>
              <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground ml-2">
                <li>Contact the platform administrator</li>
                <li>Submit your medical credentials for verification</li>
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
      <h1 className="text-3xl font-bold mb-6">Doctor Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Verification Status
            </CardTitle>
            <Stethoscope className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Verified</div>
            <p className="text-xs text-muted-foreground mt-1">
              {doctorInfo?.specialty || "General Practitioner"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Patients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">--</div>
            <p className="text-xs text-muted-foreground mt-1">
              With granted access
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Prescriptions</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{prescriptionCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Total issued</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="patients" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="patients">My Patients</TabsTrigger>
          <TabsTrigger value="issue">Issue Prescription</TabsTrigger>
        </TabsList>

        <TabsContent value="patients" className="mt-6">
          <PatientList />
        </TabsContent>

        <TabsContent value="issue" className="mt-6">
          <IssuePrescription doctorAddress={address!} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
