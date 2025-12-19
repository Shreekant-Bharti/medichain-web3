import React from "react";
import { useWallet } from "@/hooks/useWallet";
import { Button } from "@/components/ui/button";
import { AlertCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";

export function NetworkSwitcher() {
  const { chainId, switchToNetwork, isCorrectNetwork, getNetworkName } =
    useWallet();
  const [isSwitching, setIsSwitching] = React.useState(false);

  if (isCorrectNetwork(80001)) {
    return null;
  }

  const handleSwitch = async () => {
    setIsSwitching(true);
    try {
      await switchToNetwork(80001);
      toast.success("Switched to Polygon Mumbai");
    } catch (error: any) {
      toast.error(error.message || "Failed to switch network");
    } finally {
      setIsSwitching(false);
    }
  };

  return (
    <div className="rounded-lg border border-destructive bg-destructive/10 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-destructive" />
          <div>
            <h3 className="font-semibold">Wrong Network</h3>
            <p className="text-sm text-muted-foreground">
              You're on {getNetworkName()}. Please switch to Polygon Mumbai.
            </p>
          </div>
        </div>
        <Button
          onClick={handleSwitch}
          variant="destructive"
          disabled={isSwitching}
        >
          {isSwitching ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Switching...
            </>
          ) : (
            "Switch Network"
          )}
        </Button>
      </div>
    </div>
  );
}
