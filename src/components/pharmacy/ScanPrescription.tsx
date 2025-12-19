import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import VerifyPrescription from "./VerifyPrescription";
import { QrCode, Keyboard } from "lucide-react";
import { toast } from "sonner";

interface ScanPrescriptionProps {
  pharmacyAddress: string;
}

export default function ScanPrescription({
  pharmacyAddress,
}: ScanPrescriptionProps) {
  const [manualId, setManualId] = useState("");
  const [scannedId, setScannedId] = useState<string | null>(null);
  const [verifyingId, setVerifyingId] = useState<string | null>(null);
  const [scannerActive, setScannerActive] = useState(false);

  const handleQRScan = (data: string | null) => {
    if (data) {
      try {
        // Parse QR code data
        const parsed = JSON.parse(data);

        if (parsed.type === "MediChain_Prescription" && parsed.prescriptionId) {
          setScannedId(parsed.prescriptionId);
          setVerifyingId(parsed.prescriptionId);
          setScannerActive(false);
          toast.success("Prescription QR code scanned!");
        } else {
          toast.error("Invalid prescription QR code");
        }
      } catch (error) {
        toast.error("Failed to parse QR code");
      }
    }
  };

  const handleManualSubmit = () => {
    if (!manualId.trim()) {
      toast.error("Please enter a prescription ID");
      return;
    }

    setVerifyingId(manualId);
    toast.info("Fetching prescription details...");
  };

  const handleQRError = (error: any) => {
    console.error("QR Scanner error:", error);
    toast.error("Camera access denied or not available");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Scan or Enter Prescription</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="qr" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="qr">
                <QrCode className="h-4 w-4 mr-2" />
                Scan QR Code
              </TabsTrigger>
              <TabsTrigger value="manual">
                <Keyboard className="h-4 w-4 mr-2" />
                Manual Entry
              </TabsTrigger>
            </TabsList>

            <TabsContent value="qr" className="space-y-4">
              <div className="flex flex-col items-center gap-4 py-6">
                {!scannerActive ? (
                  <div className="text-center space-y-4">
                    <div className="bg-muted rounded-lg p-12">
                      <QrCode className="h-24 w-24 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">
                        Click below to activate camera
                      </p>
                    </div>
                    <Button onClick={() => setScannerActive(true)}>
                      Activate QR Scanner
                    </Button>
                  </div>
                ) : (
                  <div className="w-full max-w-md space-y-4">
                    <div className="relative aspect-square bg-black rounded-lg overflow-hidden">
                      {/* QR Scanner Component - Note: react-qr-reader needs to be installed */}
                      <div className="absolute inset-0 flex items-center justify-center text-white">
                        <p>QR Scanner will appear here</p>
                        <p className="text-sm">
                          (Install react-qr-reader package)
                        </p>
                      </div>
                      {/* Uncomment when react-qr-reader is installed:
                      <QrReader
                        onResult={(result: any) => {
                          if (result) {
                            handleQRScan(result?.text);
                          }
                        }}
                        onError={handleQRError}
                        constraints={{ facingMode: 'environment' }}
                        className="w-full"
                      />
                      */}
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => setScannerActive(false)}
                      className="w-full"
                    >
                      Cancel Scanning
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="manual" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="prescription-id">Prescription ID</Label>
                <Input
                  id="prescription-id"
                  placeholder="Enter prescription ID"
                  value={manualId}
                  onChange={(e) => setManualId(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleManualSubmit();
                    }
                  }}
                />
                <p className="text-xs text-muted-foreground">
                  Enter the numeric prescription ID from the patient
                </p>
              </div>

              <Button onClick={handleManualSubmit} className="w-full">
                Verify Prescription
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {verifyingId && (
        <VerifyPrescription
          prescriptionId={BigInt(verifyingId)}
          pharmacyAddress={pharmacyAddress}
          onBack={() => setVerifyingId(null)}
        />
      )}
    </div>
  );
}
