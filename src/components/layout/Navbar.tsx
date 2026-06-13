"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Camera, BarChart3, Shield, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCurrentRole, setCurrentRole } from "@/lib/mock-auth";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const [role, setRole] = useState("citizen");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setRole(getCurrentRole());
    const handleRoleChange = () => setRole(getCurrentRole());
    window.addEventListener("role-changed", handleRoleChange);
    return () => window.removeEventListener("role-changed", handleRoleChange);
  }, []);

  const handleRoleChange = (newRole: string) => {
    setCurrentRole(newRole);
    setIsMobileMenuOpen(false);
  };

  const navLinks = [
    { href: "/report", label: "Report Issue", icon: Camera },
    { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
    { href: "/admin", label: "Admin", icon: Shield },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-lg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl">🏛️</span>
              <span className="text-xl font-bold tracking-tight">CivicTrack</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:gap-6">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Desktop Role Switcher */}
          <div className="hidden md:flex md:items-center md:gap-2 bg-muted/50 p-1 rounded-lg border border-border/50">
            {["citizen", "officer", "admin"].map((r) => (
              <Button
                key={r}
                variant={role === r ? "default" : "ghost"}
                size="sm"
                className={cn(
                  "h-7 px-3 text-xs capitalize",
                  role === r ? "shadow-sm" : "text-muted-foreground"
                )}
                onClick={() => handleRoleChange(r)}
              >
                {r}
              </Button>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-muted-foreground"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-border/50 bg-background/95 backdrop-blur-xl absolute w-full left-0 top-16 shadow-xl">
          <div className="space-y-1 px-4 pb-3 pt-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-3 rounded-md px-3 py-3 text-base font-medium text-foreground hover:bg-muted transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Icon className="h-5 w-5 text-muted-foreground" />
                  {link.label}
                </Link>
              );
            })}
            
            <div className="pt-4 pb-2 border-t border-border/50 mt-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-3">
                Switch Role Context
              </p>
              <div className="grid grid-cols-3 gap-2 px-3">
                {["citizen", "officer", "admin"].map((r) => (
                  <Button
                    key={r}
                    variant={role === r ? "default" : "outline"}
                    size="sm"
                    className="capitalize"
                    onClick={() => handleRoleChange(r)}
                  >
                    {r}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
