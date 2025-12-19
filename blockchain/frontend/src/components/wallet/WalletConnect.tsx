import React, { useState } from "react";
import { useWallet } from "@/hooks/useWallet";
import { Button } from "@/components/ui/button";
import { Wallet, Check, AlertCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";

export function WalletConnect() {
  const {
    address,
    isConnected,
    isLoading,
    chainId,
    connectMetaMask,
    disconnect,
    switchToNetwork,
    isCorrectNetwork,
    getNetworkName,
  } = useWallet();

  const [isSwitching, setIsSwitching] = useState(false);

  const handleConnect = async () => {
    try {
      await connectMetaMask();
      toast.success("Wallet connected successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to connect wallet");
    }
  };

  const handleDisconnect = () => {
    disconnect();
    toast.info("Wallet disconnected");
  };

  const handleSwitchNetwork = async () => {
    setIsSwitching(true);
    try {
      await switchToNetwork(80001); // Polygon Mumbai
      toast.success("Switched to Polygon Mumbai");
    } catch (error: any) {
      toast.error(error.message || "Failed to switch network");
    } finally {
      setIsSwitching(false);
    }
  };

  if (!isConnected) {
    return (
      <Button onClick={handleConnect} disabled={isLoading} className="gap-2">
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Connecting...
          </>
        ) : (
          <>
            <Wallet className="h-4 w-4" />
            Connect Wallet
          </>
        )}
      </Button>
    );
  }

  const wrongNetwork = !isCorrectNetwork(80001);

  return (
    <div className="flex items-center gap-2">
      {wrongNetwork && (
        <Button
          onClick={handleSwitchNetwork}
          variant="destructive"
          size="sm"
          disabled={isSwitching}
          className="gap-2"
        >
          {isSwitching ? (
            <>
              <Loader2 className="h-3 w-3 animate-spin" />
              Switching...
            </>
          ) : (
            <>
              <AlertCircle className="h-3 w-3" />
              Wrong Network
            </>
          )}
        </Button>
      )}

      <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2">
        <div
          className={`h-2 w-2 rounded-full ${
            wrongNetwork ? "bg-destructive" : "bg-green-500"
          }`}
        />
        <span className="text-sm font-medium">
          {address?.slice(0, 6)}...{address?.slice(-4)}
        </span>
        <span className="text-xs text-muted-foreground">
          {getNetworkName()}
        </span>
      </div>

      <Button onClick={handleDisconnect} variant="outline" size="sm">
        Disconnect
      </Button>
    </div>
  );
}
