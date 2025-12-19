import React from "react";
import { Link, useLocation } from "react-router-dom";
import { WalletConnect } from "@/components/wallet/WalletConnect";
import { useWallet } from "@/hooks/useWallet";
import { Activity } from "lucide-react";
import { cn } from "@/lib/utils";

export function Header() {
  const location = useLocation();
  const { isConnected } = useWallet();

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/patient", label: "Patient Portal", requiresAuth: true },
    { path: "/doctor", label: "Doctor Portal", requiresAuth: true },
    { path: "/pharmacy", label: "Pharmacy Portal", requiresAuth: true },
    { path: "/admin", label: "Admin Panel", requiresAuth: true },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Activity className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">MediChain</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => {
              if (item.requiresAuth && !isConnected) return null;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    location.pathname === item.path
                      ? "text-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <WalletConnect />
      </div>
    </header>
  );
}
