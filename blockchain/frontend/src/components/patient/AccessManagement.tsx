import { useState, useEffect } from "react";
import { usePatientNFT } from "@/hooks/usePatientNFT";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { Trash2, UserPlus, Shield } from "lucide-react";
import { toast } from "sonner";
import { AccessLevel } from "@/types";

interface AccessEntry {
  address: string;
  level: AccessLevel;
  grantedAt: bigint;
}

interface AccessManagementProps {
  tokenId: bigint;
}

export default function AccessManagement({ tokenId }: AccessManagementProps) {
  const [accessList, setAccessList] = useState<AccessEntry[]>([]);
  const [newAddress, setNewAddress] = useState("");
  const [newAccessLevel, setNewAccessLevel] = useState<string>("1");
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  const { grantAccess, revokeAccess, getMedicalRecords } = usePatientNFT();

  useEffect(() => {
    loadAccessList();
  }, [tokenId]);

  const loadAccessList = async () => {
    try {
      setLoading(true);
      // Get access list from events or contract state
      const records = await getMedicalRecords(tokenId);
      // TODO: Parse access grants from events
      // For now, showing empty list
      setAccessList([]);
    } catch (error) {
      console.error("Failed to load access list", error);
      toast.error("Failed to load access list");
    } finally {
      setLoading(false);
    }
  };

  const handleGrantAccess = async () => {
    // Validate Ethereum address
    if (!/^0x[a-fA-F0-9]{40}$/.test(newAddress)) {
      toast.error("Invalid Ethereum address");
      return;
    }

    setProcessing(true);
    try {
      const { tx, receipt } = await grantAccess(
        tokenId,
        newAddress,
        parseInt(newAccessLevel) as AccessLevel
      );

      toast.success("Access granted successfully!");

      // Refresh list
      await loadAccessList();

      // Reset form
      setNewAddress("");
      setNewAccessLevel("1");
    } catch (error: any) {
      console.error("Grant access failed:", error);
      toast.error(error.message || "Failed to grant access");
    } finally {
      setProcessing(false);
    }
  };

  const handleRevokeAccess = async (address: string) => {
    setProcessing(true);
    try {
      const { tx, receipt } = await revokeAccess(tokenId, address);

      toast.success("Access revoked!");
      await loadAccessList();
    } catch (error: any) {
      console.error("Revoke access failed:", error);
      toast.error(error.message || "Failed to revoke access");
    } finally {
      setProcessing(false);
    }
  };

  const getAccessLevelText = (level: AccessLevel) => {
    switch (level) {
      case AccessLevel.READ:
        return "READ";
      case AccessLevel.WRITE:
        return "WRITE";
      case AccessLevel.FULL:
        return "FULL";
      default:
        return "NONE";
    }
  };

  const getAccessLevelColor = (level: AccessLevel) => {
    switch (level) {
      case AccessLevel.READ:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case AccessLevel.WRITE:
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case AccessLevel.FULL:
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Grant New Access
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <Input
              placeholder="Doctor/Hospital Address (0x...)"
              value={newAddress}
              onChange={(e) => setNewAddress(e.target.value)}
              className="flex-1"
              disabled={processing}
            />
            <Select
              value={newAccessLevel}
              onValueChange={setNewAccessLevel}
              disabled={processing}
            >
              <SelectTrigger className="w-full sm:w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">READ</SelectItem>
                <SelectItem value="2">WRITE</SelectItem>
                <SelectItem value="3">FULL</SelectItem>
              </SelectContent>
            </Select>
            <Button
              onClick={handleGrantAccess}
              disabled={!newAddress || processing}
            >
              {processing ? "Granting..." : "Grant Access"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Current Access List
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-8">
              <LoadingSpinner text="Loading access list..." />
            </div>
          ) : accessList.length === 0 ? (
            <div className="text-center py-12">
              <Shield className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground">No access granted yet</p>
              <p className="text-sm text-muted-foreground mt-1">
                Grant access to doctors or hospitals to view your records
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Address</TableHead>
                    <TableHead>Access Level</TableHead>
                    <TableHead>Granted At</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {accessList.map((entry) => (
                    <TableRow key={entry.address}>
                      <TableCell className="font-mono text-sm">
                        {entry.address.slice(0, 6)}...{entry.address.slice(-4)}
                      </TableCell>
                      <TableCell>
                        <Badge className={getAccessLevelColor(entry.level)}>
                          {getAccessLevelText(entry.level)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(
                          Number(entry.grantedAt) * 1000
                        ).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleRevokeAccess(entry.address)}
                          disabled={processing}
                        >
                          <Trash2 className="h-4 w-4" />
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
    </div>
  );
}
