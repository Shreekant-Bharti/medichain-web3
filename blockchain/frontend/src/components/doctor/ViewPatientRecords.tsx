import { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { usePatientNFT } from "@/hooks/usePatientNFT";
import { useIPFS } from "@/hooks/useIPFS";
import { useEncryption } from "@/hooks/useEncryption";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { FileText, Download, Eye, Calendar } from "lucide-react";
import { toast } from "sonner";
import { MedicalRecord } from "@/types";

export default function ViewPatientRecords() {
  const { tokenId } = useParams<{ tokenId: string }>();
  const location = useLocation();
  const patient = location.state?.patient;

  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(
    null
  );
  const [viewingRecord, setViewingRecord] = useState(false);
  const [recordData, setRecordData] = useState<string | null>(null);

  const { getMedicalRecords } = usePatientNFT();
  const { downloadFile } = useIPFS();
  const { decrypt } = useEncryption();

  useEffect(() => {
    if (tokenId) {
      loadRecords();
    }
  }, [tokenId]);

  async function loadRecords() {
    try {
      setLoading(true);
      const data = await getMedicalRecords(BigInt(tokenId!));
      setRecords(data.filter((r: MedicalRecord) => r.isActive));
    } catch (error) {
      console.error("Failed to load records:", error);
      toast.error("Failed to load medical records");
    } finally {
      setLoading(false);
    }
  }

  async function handleViewRecord(record: MedicalRecord) {
    setSelectedRecord(record);
    setViewingRecord(true);
    setRecordData(null);

    try {
      // Download encrypted file from IPFS
      toast.info("Downloading record from IPFS...");
      const encryptedFile = await downloadFile(record.ipfsHash);

      // Decrypt the file
      toast.info("Decrypting record...");
      const decrypted = await decrypt(encryptedFile);

      // Convert to data URL for viewing
      const blob = new Blob([decrypted], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setRecordData(url);

      toast.success("Record loaded successfully!");
    } catch (error: any) {
      console.error("Failed to view record:", error);
      toast.error(error.message || "Failed to decrypt record");
      setViewingRecord(false);
    }
  }

  async function handleDownloadRecord(record: MedicalRecord) {
    try {
      toast.info("Downloading...");
      const encryptedFile = await downloadFile(record.ipfsHash);
      const decrypted = await decrypt(encryptedFile);

      // Create download link
      const blob = new Blob([decrypted], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `medical-record-${record.recordId}.pdf`;
      link.click();
      URL.revokeObjectURL(url);

      toast.success("Downloaded successfully!");
    } catch (error: any) {
      console.error("Download failed:", error);
      toast.error(error.message || "Download failed");
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading medical records..." />
      </div>
    );
  }

  if (viewingRecord && recordData) {
    return (
      <div className="container mx-auto py-8">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">
            Viewing: Record #{selectedRecord?.recordId.toString()}
          </h1>
          <Button
            variant="outline"
            onClick={() => {
              setViewingRecord(false);
              setRecordData(null);
              if (recordData) URL.revokeObjectURL(recordData);
            }}
          >
            Close
          </Button>
        </div>
        <Card>
          <CardContent className="p-0">
            <iframe
              src={recordData}
              className="w-full h-[800px] border-0"
              title="Medical Record"
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Patient Medical Records</h1>
        {patient && (
          <p className="text-muted-foreground mt-2">
            Token ID: #{tokenId} | Address: {patient.address.slice(0, 6)}...
            {patient.address.slice(-4)}
          </p>
        )}
      </div>

      {records.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground">No medical records found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {records.map((record) => (
            <Card
              key={record.recordId.toString()}
              className="hover:shadow-lg transition-shadow"
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <FileText className="h-5 w-5" />
                  Record #{record.recordId.toString()}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {new Date(
                      Number(record.timestamp) * 1000
                    ).toLocaleDateString()}
                  </p>
                </div>

                <div className="bg-muted p-2 rounded">
                  <p className="text-xs font-mono break-all">
                    {record.ipfsHash.slice(0, 20)}...
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleViewRecord(record)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleDownloadRecord(record)}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
