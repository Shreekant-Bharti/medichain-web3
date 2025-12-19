import { useEffect, useState } from "react";
import { useWallet } from "@/hooks/useWallet";
import { useContract } from "@/hooks/useContract";
import { CONTRACTS } from "@/lib/contracts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import RegisterDoctor from "./RegisterDoctor";
import PlatformStats from "./PlatformStats";
import { Shield, Users, Building2, Activity, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export default function AdminDashboard() {
  const { address } = useWallet();
  const { read } = useContract();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalDoctors: 0,
    totalPharmacies: 0,
    totalPrescriptions: 0,
  });

  useEffect(() => {
    checkAdminRole();
  }, [address]);

  async function checkAdminRole() {
    if (!address) return;

    try {
      setLoading(true);

      // Check if address is admin (owner) of contracts
      // Typically checking owner of PatientNFT contract
      const owner = await read(
        CONTRACTS.PatientNFT.address,
        CONTRACTS.PatientNFT.abi,
        "owner",
        []
      );

      if (owner.toLowerCase() === address.toLowerCase()) {
        setIsAdmin(true);
        await loadPlatformStats();
      }
    } catch (error) {
      console.error("Failed to check admin role:", error);
    } finally {
      setLoading(false);
    }
  }

  async function loadPlatformStats() {
    try {
      // TODO: Fetch actual stats from contracts and events
      setStats({
        totalPatients: 0,
        totalDoctors: 0,
        totalPharmacies: 0,
        totalPrescriptions: 0,
      });
    } catch (error) {
      console.error("Failed to load stats:", error);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Verifying admin credentials..." />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-6 w-6" />
              Access Denied
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="destructive">
              <AlertDescription>
                You do not have administrator privileges to access this panel.
              </AlertDescription>
            </Alert>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Only the platform owner can access the Admin Panel. This
                includes:
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-2">
                <li>Registering and verifying doctors</li>
                <li>Registering and verifying pharmacies</li>
                <li>Viewing platform statistics</li>
                <li>Managing platform governance</li>
              </ul>
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
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total Patients
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPatients}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Registered users
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Doctors</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalDoctors}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Verified doctors
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total Pharmacies
            </CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPharmacies}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Registered pharmacies
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Prescriptions</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPrescriptions}</div>
            <p className="text-xs text-muted-foreground mt-1">Total issued</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="register" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="register">Register Entities</TabsTrigger>
          <TabsTrigger value="stats">Platform Statistics</TabsTrigger>
        </TabsList>

        <TabsContent value="register" className="mt-6">
          <RegisterDoctor onSuccess={loadPlatformStats} />
        </TabsContent>

        <TabsContent value="stats" className="mt-6">
          <PlatformStats stats={stats} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
