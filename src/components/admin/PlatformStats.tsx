import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, TrendingUp, Users, FileText } from "lucide-react";

interface PlatformStatsProps {
  stats: {
    totalPatients: number;
    totalDoctors: number;
    totalPharmacies: number;
    totalPrescriptions: number;
  };
}

export default function PlatformStats({ stats }: PlatformStatsProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total Patients
            </CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalPatients}</div>
            <p className="text-xs text-muted-foreground mt-1">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              Active users
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Doctors</CardTitle>
            <Activity className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalDoctors}</div>
            <p className="text-xs text-muted-foreground mt-1">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              Verified professionals
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total Pharmacies
            </CardTitle>
            <Activity className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalPharmacies}</div>
            <p className="text-xs text-muted-foreground mt-1">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              Registered locations
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total Prescriptions
            </CardTitle>
            <FileText className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalPrescriptions}</div>
            <p className="text-xs text-muted-foreground mt-1">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              Issued on platform
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Platform Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <Activity className="h-16 w-16 mx-auto mb-4" />
            <p className="text-lg mb-2">Charts and Analytics Coming Soon</p>
            <p className="text-sm">
              This section will display detailed platform analytics including:
            </p>
            <ul className="text-sm mt-4 space-y-1 inline-block text-left">
              <li>• Prescription trends over time</li>
              <li>• Patient registration growth</li>
              <li>• Doctor and pharmacy distribution</li>
              <li>• Medicine category breakdown</li>
              <li>• Platform usage statistics</li>
            </ul>
            <p className="text-xs mt-6 text-muted-foreground">
              Install recharts library to enable visualization
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-3" />
              <p>No recent activity to display</p>
              <p className="text-xs mt-1">Platform events will appear here</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  Blockchain Connection
                </span>
                <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                  Healthy
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">IPFS Storage</span>
                <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                  Operational
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Smart Contracts</span>
                <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                  Active
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">API Server</span>
                <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                  Running
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
