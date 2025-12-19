import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText } from "lucide-react";
import PrescriptionForm from "./PrescriptionForm";

interface IssuePrescriptionProps {
  doctorAddress: string;
}

export default function IssuePrescription({
  doctorAddress,
}: IssuePrescriptionProps) {
  const [activeTab, setActiveTab] = useState("new");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Issue Prescription
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="new">New Prescription</TabsTrigger>
            <TabsTrigger value="history">My Prescriptions</TabsTrigger>
          </TabsList>

          <TabsContent value="new" className="mt-6">
            <PrescriptionForm doctorAddress={doctorAddress} />
          </TabsContent>

          <TabsContent value="history" className="mt-6">
            <div className="text-center py-12 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-3" />
              <p>Prescription history will be displayed here</p>
              <p className="text-sm mt-1">
                All prescriptions you've issued will appear in this section
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
