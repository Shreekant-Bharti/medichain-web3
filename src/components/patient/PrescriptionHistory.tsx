import { useState, useEffect } from "react";
import { usePrescription } from "@/hooks/usePrescription";
import { Button } from "@/components/ui/button";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { Eye, Download, Pill } from "lucide-react";
import { toast } from "sonner";
import { Prescription, PrescriptionStatus } from "@/types";

interface PrescriptionHistoryProps {
  tokenId: bigint;
}

export default function PrescriptionHistory({
  tokenId,
}: PrescriptionHistoryProps) {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [selectedPrescription, setSelectedPrescription] =
    useState<Prescription | null>(null);
  const [loading, setLoading] = useState(true);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const { getPatientPrescriptions, getPrescription } = usePrescription();

  useEffect(() => {
    loadPrescriptions();
  }, [tokenId]);

  const loadPrescriptions = async () => {
    try {
      setLoading(true);
      const prescriptionIds = await getPatientPrescriptions(tokenId);

      // Load details for each prescription
      const details = await Promise.all(
        prescriptionIds.map((id) => getPrescription(id))
      );

      setPrescriptions(details);
    } catch (error) {
      console.error("Failed to load prescriptions:", error);
      toast.error("Failed to load prescriptions");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (prescription: Prescription) => {
    setSelectedPrescription(prescription);
    setDetailsOpen(true);
  };

  const handleDownloadPrescription = async (prescription: Prescription) => {
    try {
      toast.info(
        "Download functionality will be implemented with IPFS integration"
      );
      // TODO: Download PDF from IPFS using prescription.ipfsHash
    } catch (error) {
      toast.error("Download failed");
    }
  };

  const getStatusBadge = (status: PrescriptionStatus) => {
    const config = {
      [PrescriptionStatus.ISSUED]: {
        label: "Issued",
        className:
          "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      },
      [PrescriptionStatus.DISPENSED]: {
        label: "Dispensed",
        className:
          "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      },
      [PrescriptionStatus.EXPIRED]: {
        label: "Expired",
        className:
          "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
      },
      [PrescriptionStatus.REVOKED]: {
        label: "Revoked",
        className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      },
    };

    const { label, className } =
      config[status] || config[PrescriptionStatus.ISSUED];
    return <Badge className={className}>{label}</Badge>;
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="py-12">
          <LoadingSpinner text="Loading prescriptions..." />
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Pill className="h-5 w-5" />
            Prescription History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {prescriptions.length === 0 ? (
            <div className="text-center py-12">
              <Pill className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground">No prescriptions yet</p>
              <p className="text-sm text-muted-foreground mt-1">
                Prescriptions issued by doctors will appear here
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Doctor</TableHead>
                    <TableHead>Medicine</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Issued Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {prescriptions.map((prescription) => (
                    <TableRow key={prescription.prescriptionId.toString()}>
                      <TableCell className="font-mono">
                        #{prescription.prescriptionId.toString()}
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {prescription.doctor.slice(0, 6)}...
                        {prescription.doctor.slice(-4)}
                      </TableCell>
                      <TableCell>{prescription.medicineName}</TableCell>
                      <TableCell>{prescription.quantity}</TableCell>
                      <TableCell>
                        {new Date(
                          Number(prescription.issueDate) * 1000
                        ).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(prescription.status)}
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewDetails(prescription)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            handleDownloadPrescription(prescription)
                          }
                        >
                          <Download className="h-4 w-4" />
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

      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Prescription Details</DialogTitle>
          </DialogHeader>
          {selectedPrescription && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Prescription ID
                  </p>
                  <p className="font-mono">
                    #{selectedPrescription.prescriptionId.toString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Status
                  </p>
                  {getStatusBadge(selectedPrescription.status)}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Medicine Name
                  </p>
                  <p>{selectedPrescription.medicineName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Quantity
                  </p>
                  <p>{selectedPrescription.quantity} units</p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Dosage
                </p>
                <p>{selectedPrescription.dosage}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Instructions
                </p>
                <p className="text-sm">{selectedPrescription.instructions}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Doctor
                  </p>
                  <p className="font-mono text-xs">
                    {selectedPrescription.doctor}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Pharmacy
                  </p>
                  <p className="font-mono text-xs">
                    {selectedPrescription.pharmacy ===
                    "0x0000000000000000000000000000000000000000"
                      ? "Not dispensed"
                      : selectedPrescription.pharmacy}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Issue Date
                  </p>
                  <p>
                    {new Date(
                      Number(selectedPrescription.issueDate) * 1000
                    ).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Expiry Date
                  </p>
                  <p>
                    {new Date(
                      Number(selectedPrescription.expiryDate) * 1000
                    ).toLocaleString()}
                  </p>
                </div>
              </div>

              {selectedPrescription.ipfsHash && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    IPFS Hash
                  </p>
                  <p className="font-mono text-xs break-all">
                    {selectedPrescription.ipfsHash}
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
