import { useState } from "react";
import { usePrescription } from "@/hooks/usePrescription";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Pill, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Prescription } from "@/types";

interface DispenseMedicineProps {
  prescription: Prescription;
  pharmacyAddress: string;
  onBack: () => void;
  onSuccess: () => void;
}

export default function DispenseMedicine({
  prescription,
  pharmacyAddress,
  onBack,
  onSuccess,
}: DispenseMedicineProps) {
  const [dispensing, setDispensing] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const { dispenseMedicine } = usePrescription();

  async function handleDispense() {
    if (!confirmed) {
      toast.error("Please confirm that you have dispensed the medicine");
      return;
    }

    setDispensing(true);
    try {
      const { tx, receipt } = await dispenseMedicine(
        prescription.prescriptionId
      );

      toast.success("Medicine dispensed successfully!");

      // Wait a moment to show success message
      setTimeout(() => {
        onSuccess();
      }, 1500);
    } catch (error: any) {
      console.error("Dispense failed:", error);
      toast.error(error.message || "Failed to dispense medicine");
    } finally {
      setDispensing(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Pill className="h-5 w-5" />
            Dispense Medicine
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            disabled={dispensing}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert>
          <AlertDescription>
            Please verify the patient's identity and ensure they match the
            prescription details before dispensing.
          </AlertDescription>
        </Alert>

        {/* Prescription Summary */}
        <div className="bg-muted p-4 rounded-lg space-y-3">
          <h3 className="font-semibold text-lg">Prescription Summary</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Prescription ID</p>
              <p className="font-mono font-medium">
                #{prescription.prescriptionId.toString()}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Patient Token ID</p>
              <p className="font-mono font-medium">
                #{prescription.patientTokenId.toString()}
              </p>
            </div>
          </div>

          <div className="border-t pt-3">
            <p className="text-xs text-muted-foreground mb-1">
              Medicine Details
            </p>
            <p className="font-semibold text-lg">{prescription.medicineName}</p>
            <p className="text-sm">{prescription.dosage}</p>
            <p className="text-sm font-medium mt-1">
              Quantity: {prescription.quantity} units
            </p>
          </div>

          <div className="border-t pt-3">
            <p className="text-xs text-muted-foreground mb-1">Instructions</p>
            <p className="text-sm">{prescription.instructions}</p>
          </div>
        </div>

        {/* Confirmation Checklist */}
        <div className="space-y-4">
          <h3 className="font-semibold">Dispensing Checklist</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox id="verify-patient" />
              <label
                htmlFor="verify-patient"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Verified patient identity matches prescription
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="verify-medicine" />
              <label
                htmlFor="verify-medicine"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Correct medicine, dosage, and quantity prepared
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="verify-instructions" />
              <label
                htmlFor="verify-instructions"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Explained usage instructions to patient
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="final-confirm"
                checked={confirmed}
                onCheckedChange={(checked) => setConfirmed(checked as boolean)}
              />
              <label
                htmlFor="final-confirm"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                <span className="text-red-600">
                  * I confirm that I have physically dispensed this medicine
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Warning */}
        <Alert variant="destructive">
          <AlertDescription className="text-xs">
            <strong>Warning:</strong> This action is irreversible. Once you
            confirm dispensing, the prescription will be marked as dispensed on
            the blockchain and cannot be used again.
          </AlertDescription>
        </Alert>

        {/* Dispense Button */}
        <Button
          onClick={handleDispense}
          disabled={!confirmed || dispensing}
          className="w-full"
          size="lg"
        >
          {dispensing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Dispensing...
            </>
          ) : (
            <>
              <Pill className="mr-2 h-4 w-4" />
              Confirm Dispense Medicine
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
