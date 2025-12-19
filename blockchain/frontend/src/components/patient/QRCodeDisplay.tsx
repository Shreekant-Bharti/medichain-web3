import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { Download, QrCode } from "lucide-react";
import { toast } from "sonner";

interface QRCodeDisplayProps {
  tokenId: bigint;
  address: string;
}

export default function QRCodeDisplay({
  tokenId,
  address,
}: QRCodeDisplayProps) {
  const [size, setSize] = useState(256);

  // QR Code data format: JSON with token ID and address
  const qrData = JSON.stringify({
    type: "MediChain_Health_Passport",
    tokenId: tokenId.toString(),
    address: address,
    timestamp: Date.now(),
  });

  const handleDownload = () => {
    try {
      // Get the SVG element
      const svg = document.getElementById("health-passport-qr");
      if (!svg) {
        toast.error("QR code not found");
        return;
      }

      // Convert SVG to PNG using canvas
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        toast.error("Failed to create canvas");
        return;
      }

      // Create image from SVG
      const svgData = new XMLSerializer().serializeToString(svg);
      const img = new Image();
      const svgBlob = new Blob([svgData], {
        type: "image/svg+xml;charset=utf-8",
      });
      const url = URL.createObjectURL(svgBlob);

      img.onload = () => {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, size, size);
        ctx.drawImage(img, 0, 0);

        // Download as PNG
        canvas.toBlob((blob) => {
          if (blob) {
            const downloadUrl = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = downloadUrl;
            link.download = `medichain-health-passport-${tokenId}.png`;
            link.click();
            URL.revokeObjectURL(downloadUrl);
            toast.success("QR code downloaded!");
          }
        });

        URL.revokeObjectURL(url);
      };

      img.src = url;
    } catch (error) {
      console.error("Download failed:", error);
      toast.error("Failed to download QR code");
    }
  };

  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <QRCodeSVG
          id="health-passport-qr"
          value={qrData}
          size={size}
          level="H"
          includeMargin={true}
          imageSettings={{
            src: "/medichain-logo.svg", // Optional: Add logo in center
            height: 40,
            width: 40,
            excavate: true,
          }}
        />
      </div>

      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2 text-muted-foreground">
          <QrCode className="h-5 w-5" />
          <p className="text-sm font-medium">
            Health Passport #{tokenId.toString()}
          </p>
        </div>
        <p className="text-xs text-muted-foreground max-w-md">
          This QR code contains your unique health passport identifier. Show it
          to doctors or pharmacies to quickly access your medical records.
        </p>
      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSize((s) => Math.max(128, s - 64))}
        >
          Smaller
        </Button>
        <Button onClick={handleDownload} size="sm">
          <Download className="h-4 w-4 mr-2" />
          Download QR Code
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSize((s) => Math.min(512, s + 64))}
        >
          Larger
        </Button>
      </div>

      <div className="bg-muted p-4 rounded-lg w-full max-w-md">
        <p className="text-xs font-medium mb-2">QR Code Data:</p>
        <pre className="text-xs overflow-x-auto bg-background p-2 rounded">
          {JSON.stringify(JSON.parse(qrData), null, 2)}
        </pre>
      </div>
    </div>
  );
}
