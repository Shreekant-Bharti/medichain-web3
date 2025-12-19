import { useState } from "react";
import { useIPFS } from "@/hooks/useIPFS";
import { useEncryption } from "@/hooks/useEncryption";
import { usePatientNFT } from "@/hooks/usePatientNFT";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Upload, FileText, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

interface MedicalRecordUploadProps {
  tokenId: bigint;
  onSuccess?: () => void;
}

export default function MedicalRecordUpload({
  tokenId,
  onSuccess,
}: MedicalRecordUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [txHash, setTxHash] = useState<string>("");

  const { uploadFile } = useIPFS();
  const { encrypt } = useEncryption();
  const { addMedicalRecord } = usePatientNFT();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];

      // Validate file size (max 10MB)
      if (selectedFile.size > 10 * 1024 * 1024) {
        toast.error("File size must be less than 10MB");
        return;
      }

      // Validate file type
      const allowedTypes = [
        "application/pdf",
        "image/jpeg",
        "image/png",
        "image/jpg",
      ];
      if (!allowedTypes.includes(selectedFile.type)) {
        toast.error("Only PDF, JPG, and PNG files are allowed");
        return;
      }

      setFile(selectedFile);
      setProgress(0);
      setTxHash("");
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a file");
      return;
    }

    setUploading(true);
    setProgress(0);

    try {
      // Step 1: Encrypt file using wallet signature
      setProgress(20);
      toast.info("Encrypting file...");
      const encrypted = await encrypt(file);

      // Step 2: Upload encrypted file to IPFS
      setProgress(50);
      toast.info("Uploading to IPFS...");
      const blob = new Blob([encrypted.encryptedData], {
        type: "application/octet-stream",
      });
      const encryptedFile = new File([blob], `encrypted_${file.name}`, {
        type: "application/octet-stream",
      });
      const { cid } = await uploadFile(encryptedFile);

      // Step 3: Add record to blockchain
      setProgress(75);
      toast.info("Adding to blockchain...");
      const { tx, receipt } = await addMedicalRecord(tokenId, cid);

      setProgress(100);
      setTxHash(tx.hash);

      toast.success("Medical record uploaded successfully!");

      // Reset form
      setFile(null);
      const fileInput = document.getElementById(
        "file-input"
      ) as HTMLInputElement;
      if (fileInput) fileInput.value = "";

      // Callback
      if (onSuccess) onSuccess();
    } catch (error: any) {
      console.error("Upload failed:", error);
      toast.error(error.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Medical Record</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="file-input">Select Medical Record</Label>
          <Input
            id="file-input"
            type="file"
            onChange={handleFileChange}
            accept=".pdf,.jpg,.jpeg,.png"
            disabled={uploading}
            className="mt-2"
          />
          <p className="text-sm text-muted-foreground mt-1">
            Accepted formats: PDF, JPG, PNG (Max 10MB)
          </p>
        </div>

        {file && !uploading && !txHash && (
          <div className="bg-muted p-4 rounded-lg space-y-2">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <div className="flex-1">
                <p className="text-sm font-medium">{file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
          </div>
        )}

        {uploading && (
          <div className="space-y-2">
            <Progress value={progress} className="w-full" />
            <p className="text-sm text-center text-muted-foreground">
              {progress < 30
                ? "Encrypting file..."
                : progress < 70
                ? "Uploading to IPFS..."
                : "Adding to blockchain..."}
            </p>
          </div>
        )}

        {txHash && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <p className="font-medium text-green-900 dark:text-green-100">
                Upload Complete!
              </p>
            </div>
            <p className="text-xs text-green-700 dark:text-green-300 font-mono">
              TX: {txHash.slice(0, 10)}...{txHash.slice(-8)}
            </p>
          </div>
        )}

        <Button
          onClick={handleUpload}
          disabled={!file || uploading}
          className="w-full"
        >
          {uploading ? (
            "Uploading..."
          ) : (
            <>
              <Upload className="h-4 w-4 mr-2" />
              Upload Record
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
