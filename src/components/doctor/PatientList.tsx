import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { Eye, Search, Users } from "lucide-react";
import { toast } from "sonner";

interface Patient {
  address: string;
  tokenId: bigint;
  accessLevel: number;
  grantedAt: bigint;
}

export default function PatientList() {
  const navigate = useNavigate();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPatients();
  }, []);

  useEffect(() => {
    filterPatients();
  }, [searchQuery, patients]);

  async function loadPatients() {
    try {
      setLoading(true);
      // TODO: Fetch patients who have granted access to this doctor
      // This requires parsing AccessGranted events from PatientNFT contract
      // For now, showing empty list
      setPatients([]);
    } catch (error) {
      console.error("Failed to load patients:", error);
      toast.error("Failed to load patients");
    } finally {
      setLoading(false);
    }
  }

  function filterPatients() {
    if (!searchQuery.trim()) {
      setFilteredPatients(patients);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = patients.filter(
      (p) =>
        p.address.toLowerCase().includes(query) ||
        p.tokenId.toString().includes(query)
    );
    setFilteredPatients(filtered);
  }

  const handleViewRecords = (patient: Patient) => {
    navigate(`/doctor/patient/${patient.tokenId}`, { state: { patient } });
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="py-12">
          <LoadingSpinner text="Loading patient list..." />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Patients with Granted Access
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by address or token ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
          />
        </div>

        {filteredPatients.length === 0 ? (
          <div className="text-center py-12">
            <Users className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground">
              {searchQuery
                ? "No patients found matching your search"
                : "No patients yet"}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Patients who grant you access will appear here
            </p>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Token ID</TableHead>
                  <TableHead>Patient Address</TableHead>
                  <TableHead>Access Level</TableHead>
                  <TableHead>Granted On</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPatients.map((patient) => (
                  <TableRow key={patient.tokenId.toString()}>
                    <TableCell className="font-mono">
                      #{patient.tokenId.toString()}
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {patient.address.slice(0, 6)}...
                      {patient.address.slice(-4)}
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">
                        {patient.accessLevel === 1
                          ? "READ"
                          : patient.accessLevel === 2
                          ? "WRITE"
                          : "FULL"}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm">
                      {new Date(
                        Number(patient.grantedAt) * 1000
                      ).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewRecords(patient)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Records
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
