import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { usePrescription } from "@/hooks/usePrescription";
import { useIPFS } from "@/hooks/useIPFS";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { MedicineCategory } from "@/types";
import { FileText, Loader2 } from "lucide-react";

const prescriptionSchema = z.object({
  patientTokenId: z.string().min(1, "Patient Token ID is required"),
  medicineName: z
    .string()
    .min(2, "Medicine name must be at least 2 characters"),
  dosage: z.string().min(1, "Dosage is required"),
  quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
  instructions: z
    .string()
    .min(10, "Instructions must be at least 10 characters"),
  category: z.nativeEnum(MedicineCategory),
  validityDays: z.coerce
    .number()
    .min(1, "Validity must be at least 1 day")
    .max(365, "Validity cannot exceed 365 days"),
});

type PrescriptionFormData = z.infer<typeof prescriptionSchema>;

interface PrescriptionFormProps {
  doctorAddress: string;
}

export default function PrescriptionForm({
  doctorAddress,
}: PrescriptionFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);
  const { issuePrescription } = usePrescription();
  const { uploadJSON } = useIPFS();

  const form = useForm<PrescriptionFormData>({
    resolver: zodResolver(prescriptionSchema),
    defaultValues: {
      patientTokenId: "",
      medicineName: "",
      dosage: "",
      quantity: 1,
      instructions: "",
      category: MedicineCategory.GENERAL,
      validityDays: 30,
    },
  });

  async function onSubmit(data: PrescriptionFormData) {
    setIsSubmitting(true);
    setProgress(0);

    try {
      // Step 1: Generate prescription metadata
      setProgress(25);
      toast.info("Preparing prescription data...");

      const metadata = {
        patientTokenId: data.patientTokenId,
        medicineName: data.medicineName,
        dosage: data.dosage,
        quantity: data.quantity,
        instructions: data.instructions,
        category: data.category,
        doctor: doctorAddress,
        issueDate: Date.now(),
      };

      // Step 2: Upload to IPFS
      setProgress(50);
      toast.info("Uploading to IPFS...");
      const { cid } = await uploadJSON(metadata);

      // Step 3: Issue prescription on blockchain
      setProgress(75);
      toast.info("Issuing prescription on blockchain...");

      const { tx, receipt, prescriptionId } = await issuePrescription(
        BigInt(data.patientTokenId),
        data.medicineName,
        data.dosage,
        data.quantity,
        data.instructions,
        data.category,
        data.validityDays,
        cid
      );

      setProgress(100);
      toast.success(`Prescription issued successfully! ID: ${prescriptionId}`);

      // Reset form
      form.reset();
    } catch (error: any) {
      console.error("Failed to issue prescription:", error);
      toast.error(error.message || "Failed to issue prescription");
    } finally {
      setIsSubmitting(false);
      setProgress(0);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="patientTokenId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Patient Token ID *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter patient's token ID"
                    {...field}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="medicineName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Medicine Name *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., Amoxicillin"
                    {...field}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dosage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dosage *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., 500mg"
                    {...field}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantity *</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="1"
                    placeholder="Number of units"
                    {...field}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Medicine Category *</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(parseInt(value))}
                  value={field.value?.toString()}
                  disabled={isSubmitting}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="0">General</SelectItem>
                    <SelectItem value="1">Controlled</SelectItem>
                    <SelectItem value="2">Narcotic</SelectItem>
                    <SelectItem value="3">Antibiotic</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="validityDays"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Validity (Days) *</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="1"
                    max="365"
                    placeholder="30"
                    {...field}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="instructions"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Instructions *</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Detailed instructions for the patient (e.g., Take one tablet twice daily after meals for 7 days)"
                  className="min-h-24"
                  {...field}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {isSubmitting && (
          <Card className="p-4">
            <Progress value={progress} className="w-full mb-2" />
            <p className="text-sm text-center text-muted-foreground">
              {progress < 30
                ? "Preparing prescription..."
                : progress < 70
                ? "Uploading to IPFS..."
                : "Issuing on blockchain..."}
            </p>
          </Card>
        )}

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Issuing Prescription...
            </>
          ) : (
            <>
              <FileText className="mr-2 h-4 w-4" />
              Issue Prescription
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
