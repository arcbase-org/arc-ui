"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Wrench, Shield, ArrowRight, Lock } from "lucide-react";

export function MaintenanceGuard({
  children,
  isMaintenance,
  isAdmin,
  message,
}: {
  children: React.ReactNode;
  isMaintenance: boolean;
  isAdmin: boolean;
  message?: string | null;
}) {
  const pathname = usePathname();

  // Permetti sempre l'accesso alla pagina di login, alla dashboard admin e alle pagine legali (/terms e /privacy)
  const isBypassedRoute =
    pathname === "/login" ||
    pathname?.startsWith("/admin") ||
    pathname === "/terms" ||
    pathname === "/privacy";

  if (isMaintenance && !isAdmin && !isBypassedRoute) {
    return (
      <div
        className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 select-none"
        style={{
          background:
            "linear-gradient(rgba(0, 0, 0, 0.14), rgba(0, 0, 0, 0.36)), url('/dolomiti-default.jpg') center/cover no-repeat, #07090e",
          color: "#fff",
        }}
      >
        {/* Apple Frosted Liquid Glass Card */}
        <div
          className="w-full max-w-lg relative overflow-hidden"
          style={{
            background: "rgba(16, 18, 26, 0.85)",
            backdropFilter: "blur(40px) saturate(190%)",
            WebkitBackdropFilter: "blur(40px) saturate(190%)",
            borderRadius: "26px",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            boxShadow:
              "0 40px 100px -20px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.18)",
            padding: "2.5rem 2rem",
            isolation: "isolate",
          }}
        >
          {/* Ambient Glow Orb */}
          <div
            className="absolute -top-24 -left-24 w-48 h-48 rounded-full pointer-events-none blur-3xl opacity-20"
            style={{ background: "#f59e0b" }}
          />
          <div
            className="absolute -bottom-24 -right-24 w-48 h-48 rounded-full pointer-events-none blur-3xl opacity-15"
            style={{ background: "#8b5cf6" }}
          />

          <div className="relative z-10 flex flex-col items-center text-center">
            {/* Logo */}
            <div className="mb-6">
              <span
                style={{
                  fontFamily: "var(--font-display, inherit)",
                  fontSize: "1.9rem",
                  fontWeight: 800,
                  letterSpacing: "-0.04em",
                  color: "#fff",
                  display: "inline-block",
                }}
              >
                ticly
              </span>
            </div>

            {/* Status Pill Badge */}
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-6"
              style={{
                background: "rgba(245, 158, 11, 0.12)",
                border: "1px solid rgba(245, 158, 11, 0.28)",
                color: "#fbbf24",
              }}
            >
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span>Manutenzione Programmata</span>
            </div>

            {/* Icon Circle */}
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5"
              style={{
                background:
                  "linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(245, 158, 11, 0.05) 100%)",
                border: "1px solid rgba(245, 158, 11, 0.25)",
                boxShadow: "0 8px 24px rgba(245, 158, 11, 0.12)",
              }}
            >
              <Wrench className="w-8 h-8 text-amber-400" />
            </div>

            {/* Title */}
            <h1
              className="text-2xl sm:text-3xl font-bold tracking-tight mb-3"
              style={{ color: "#ffffff", letterSpacing: "-0.02em" }}
            >
              Cluster in Aggiornamento
            </h1>

            {/* Description */}
            <p
              className="text-sm sm:text-base leading-relaxed max-w-sm mb-8"
              style={{ color: "rgba(255, 255, 255, 0.65)" }}
            >
              {message ||
                "Stiamo effettuando un aggiornamento dei server e dei componenti di sicurezza. Tutti i servizi torneranno attivi a breve."}
            </p>

            {/* Admin CTA Button */}
            <div className="w-full pt-6 border-t border-white/10 flex flex-col items-center gap-4">
              <Link
                href="/login"
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl font-medium text-sm transition-all duration-200"
                style={{
                  background: "rgba(255, 255, 255, 0.08)",
                  border: "1px solid rgba(255, 255, 255, 0.14)",
                  color: "#fff",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.14)";
                  e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.25)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)";
                  e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.14)";
                }}
              >
                <Lock className="w-4 h-4 text-zinc-400" />
                <span>Accesso Amministratore</span>
                <ArrowRight className="w-4 h-4 text-zinc-400 ml-1" />
              </Link>

              {/* Legal Footer Links pointing to internal /privacy and /terms */}
              <div className="flex items-center justify-center gap-3 text-xs text-zinc-500 pt-2">
                <Link
                  href="/privacy"
                  className="hover:text-zinc-300 transition-colors underline-offset-4 hover:underline"
                >
                  Privacy Policy
                </Link>
                <span>•</span>
                <Link
                  href="/terms"
                  className="hover:text-zinc-300 transition-colors underline-offset-4 hover:underline"
                >
                  Termini di Servizio
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
