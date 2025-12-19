import React from "react";
import { CheckCircle, XCircle, Loader2, ExternalLink } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getExplorerUrl } from "@/lib/contracts";
import type { TransactionState } from "@/types";

interface TransactionStatusProps {
  transaction: TransactionState;
  chainId: number;
}

export function TransactionStatus({
  transaction,
  chainId,
}: TransactionStatusProps) {
  const explorerUrl = getExplorerUrl(chainId, transaction.hash);

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {transaction.status === "pending" && (
            <>
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
              <div>
                <p className="font-medium">Transaction Pending</p>
                <p className="text-sm text-muted-foreground">
                  Waiting for confirmation...
                </p>
              </div>
            </>
          )}

          {transaction.status === "confirmed" && (
            <>
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="font-medium">Transaction Confirmed</p>
                <p className="text-sm text-muted-foreground font-mono">
                  {transaction.hash.slice(0, 10)}...{transaction.hash.slice(-8)}
                </p>
              </div>
            </>
          )}

          {transaction.status === "failed" && (
            <>
              <XCircle className="h-5 w-5 text-destructive" />
              <div>
                <p className="font-medium">Transaction Failed</p>
                <p className="text-sm text-muted-foreground">
                  {transaction.error || "Unknown error"}
                </p>
              </div>
            </>
          )}
        </div>

        {explorerUrl && (
          <Button variant="outline" size="sm" asChild>
            <a href={explorerUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4 mr-2" />
              View
            </a>
          </Button>
        )}
      </div>
    </Card>
  );
}
