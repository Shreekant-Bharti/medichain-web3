import React from "react";

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="text-sm text-muted-foreground">
          © 2025 MediChain. Built on Polygon.
        </div>
        <div className="flex items-center gap-4 text-sm">
          <a href="#" className="text-muted-foreground hover:text-foreground">
            Docs
          </a>
          <a href="#" className="text-muted-foreground hover:text-foreground">
            GitHub
          </a>
          <a href="#" className="text-muted-foreground hover:text-foreground">
            Support
          </a>
        </div>
      </div>
    </footer>
  );
}
