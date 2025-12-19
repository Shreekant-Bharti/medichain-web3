import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useContract } from "@/hooks/useContract";
import { useIPFS } from "@/hooks/useIPFS";
import { CONTRACTS } from "@/lib/contracts";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { UserPlus, Building2, Loader2 } from "lucide-react";
import { toast } from "sonner";

const doctorSchema = z.object({
  address: z.string().regex(/^0x[a-fA-F0-9]{40}$/, "Invalid Ethereum address"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  specialty: z.string().min(2, "Specialty is required"),
  licenseNumber: z.string().min(5, "License number is required"),
  hospitalName: z.string().min(2, "Hospital name is required"),
  credentials: z.instanceof(File).optional(),
});

const pharmacySchema = z.object({
  address: z.string().regex(/^0x[a-fA-F0-9]{40}$/, "Invalid Ethereum address"),
  name: z.string().min(2, "Pharmacy name must be at least 2 characters"),
  licenseNumber: z.string().min(5, "License number is required"),
  location: z.string().min(5, "Location is required"),
  contactInfo: z.string().min(5, "Contact information is required"),
  license: z.instanceof(File).optional(),
});

interface RegisterDoctorProps {
  onSuccess?: () => void;
}

export default function RegisterDoctor({ onSuccess }: RegisterDoctorProps) {
  const [entityType, setEntityType] = useState<"doctor" | "pharmacy">("doctor");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);
  const { write } = useContract();
  const { uploadFile } = useIPFS();

  const doctorForm = useForm({
    resolver: zodResolver(doctorSchema),
    defaultValues: {
      address: "",
      name: "",
      specialty: "",
      licenseNumber: "",
      hospitalName: "",
    },
  });

  const pharmacyForm = useForm({
    resolver: zodResolver(pharmacySchema),
    defaultValues: {
      address: "",
      name: "",
      licenseNumber: "",
      location: "",
      contactInfo: "",
    },
  });

  async function onSubmitDoctor(data: z.infer<typeof doctorSchema>) {
    setIsSubmitting(true);
    setProgress(0);

    try {
      let credentialsHash = "";

      // Upload credentials if provided
      if (data.credentials) {
        setProgress(30);
        toast.info("Uploading credentials to IPFS...");
        const { cid } = await uploadFile(data.credentials);
        credentialsHash = cid;
      }

      // Register doctor on blockchain
      setProgress(70);
      toast.info("Registering doctor on blockchain...");

      const { tx, receipt } = await write(
        CONTRACTS.DoctorRegistry.address,
        CONTRACTS.DoctorRegistry.abi,
        "registerDoctor",
        [
          data.address,
          data.name,
          data.specialty,
          data.licenseNumber,
          data.hospitalName,
          credentialsHash,
        ]
      );

      setProgress(100);
      toast.success(
        `Doctor registered successfully! TX: ${tx.hash.slice(0, 10)}...`
      );

      // Reset form
      doctorForm.reset();
      if (onSuccess) onSuccess();
    } catch (error: any) {
      console.error("Registration failed:", error);
      toast.error(error.message || "Failed to register doctor");
    } finally {
      setIsSubmitting(false);
      setProgress(0);
    }
  }

  async function onSubmitPharmacy(data: z.infer<typeof pharmacySchema>) {
    setIsSubmitting(true);
    setProgress(0);

    try {
      let licenseHash = "";

      // Upload license if provided
      if (data.license) {
        setProgress(30);
        toast.info("Uploading license to IPFS...");
        const { cid } = await uploadFile(data.license);
        licenseHash = cid;
      }

      // Register pharmacy on blockchain
      setProgress(70);
      toast.info("Registering pharmacy on blockchain...");

      const { tx, receipt } = await write(
        CONTRACTS.PharmacyRegistry.address,
        CONTRACTS.PharmacyRegistry.abi,
        "registerPharmacy",
        [
          data.address,
          data.name,
          data.licenseNumber,
          data.location,
          data.contactInfo,
          licenseHash,
        ]
      );

      setProgress(100);
      toast.success(
        `Pharmacy registered successfully! TX: ${tx.hash.slice(0, 10)}...`
      );

      // Reset form
      pharmacyForm.reset();
      if (onSuccess) onSuccess();
    } catch (error: any) {
      console.error("Registration failed:", error);
      toast.error(error.message || "Failed to register pharmacy");
    } finally {
      setIsSubmitting(false);
      setProgress(0);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Register New Entities</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs
          value={entityType}
          onValueChange={(v) => setEntityType(v as "doctor" | "pharmacy")}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="doctor">
              <UserPlus className="h-4 w-4 mr-2" />
              Register Doctor
            </TabsTrigger>
            <TabsTrigger value="pharmacy">
              <Building2 className="h-4 w-4 mr-2" />
              Register Pharmacy
            </TabsTrigger>
          </TabsList>

          <TabsContent value="doctor" className="mt-6">
            <Form {...doctorForm}>
              <form
                onSubmit={doctorForm.handleSubmit(onSubmitDoctor)}
                className="space-y-6"
              >
                <FormField
                  control={doctorForm.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Wallet Address *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="0x..."
                          {...field}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={doctorForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Dr. John Doe"
                            {...field}
                            disabled={isSubmitting}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={doctorForm.control}
                    name="specialty"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Specialty *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Cardiology"
                            {...field}
                            disabled={isSubmitting}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={doctorForm.control}
                    name="licenseNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Medical License Number *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="MED-12345"
                            {...field}
                            disabled={isSubmitting}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={doctorForm.control}
                    name="hospitalName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Hospital/Clinic Name *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="City Hospital"
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
                  control={doctorForm.control}
                  name="credentials"
                  render={({ field: { value, onChange, ...field } }) => (
                    <FormItem>
                      <FormLabel>Medical Credentials (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => onChange(e.target.files?.[0])}
                          {...field}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {isSubmitting && (
                  <div className="space-y-2">
                    <Progress value={progress} />
                    <p className="text-sm text-center text-muted-foreground">
                      {progress < 50
                        ? "Uploading credentials..."
                        : "Registering on blockchain..."}
                    </p>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Registering...
                    </>
                  ) : (
                    "Register Doctor"
                  )}
                </Button>
              </form>
            </Form>
          </TabsContent>

          <TabsContent value="pharmacy" className="mt-6">
            <Form {...pharmacyForm}>
              <form
                onSubmit={pharmacyForm.handleSubmit(onSubmitPharmacy)}
                className="space-y-6"
              >
                <FormField
                  control={pharmacyForm.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Wallet Address *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="0x..."
                          {...field}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={pharmacyForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pharmacy Name *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="MediCare Pharmacy"
                            {...field}
                            disabled={isSubmitting}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={pharmacyForm.control}
                    name="licenseNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>License Number *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="PHAR-12345"
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
                  control={pharmacyForm.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="123 Main St, City, State"
                          {...field}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={pharmacyForm.control}
                  name="contactInfo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Information *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Phone, Email"
                          {...field}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={pharmacyForm.control}
                  name="license"
                  render={({ field: { value, onChange, ...field } }) => (
                    <FormItem>
                      <FormLabel>Pharmacy License (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => onChange(e.target.files?.[0])}
                          {...field}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {isSubmitting && (
                  <div className="space-y-2">
                    <Progress value={progress} />
                    <p className="text-sm text-center text-muted-foreground">
                      {progress < 50
                        ? "Uploading license..."
                        : "Registering on blockchain..."}
                    </p>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Registering...
                    </>
                  ) : (
                    "Register Pharmacy"
                  )}
                </Button>
              </form>
            </Form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
