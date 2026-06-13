import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  Map,
  Camera,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Eye,
  Lock,
  Users,
  BarChart3,
  ArrowRight,
  Zap,
  FileCheck,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">

      {/* ============ Hero ============ */}
      <section className="relative px-6 py-24 md:py-36 flex flex-col items-center text-center overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-background to-background"></div>
        {/* animated grid */}
        <div className="absolute inset-0 -z-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-60"></div>

        <Badge variant="outline" className="border-blue-500/30 bg-blue-500/10 text-blue-400 mb-8">
          <Shield className="w-3.5 h-3.5 mr-1.5" />
          Citizen-First Accountability Platform
        </Badge>

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
          Report Issues. <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
            Demand Resolution.
          </span>
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10">
          A transparent civic issue tracking system built for Tier-2/3 cities. Snap a photo, report local problems, and watch the SLA countdown until your ward officer resolves it.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link href="/report" className="w-full sm:w-auto">
            <Button size="lg" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8 shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40 transition-all">
              <Camera className="w-5 h-5 mr-2" />
              Report an Issue
            </Button>
          </Link>
          <Link href="/dashboard" className="w-full sm:w-auto">
            <Button size="lg" variant="outline" className="w-full sm:w-auto rounded-full px-8 border-white/10 hover:bg-white/5">
              <Map className="w-5 h-5 mr-2" />
              Public Dashboard
            </Button>
          </Link>
          <Link href="/admin" className="w-full sm:w-auto">
            <Button size="lg" variant="outline" className="w-full sm:w-auto rounded-full px-8 border-white/10 hover:bg-white/5">
              <Shield className="w-5 h-5 mr-2" />
              Admin Panel
            </Button>
          </Link>
        </div>
      </section>

      {/* ============ Stats Strip ============ */}
      <section className="px-6 py-12 border-y border-border/50 bg-muted/20">
        <div className="container mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl md:text-4xl font-bold text-foreground mb-2">1,248</div>
            <div className="text-sm text-muted-foreground uppercase tracking-wider">Issues Reported</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-bold text-emerald-400 mb-2">892</div>
            <div className="text-sm text-muted-foreground uppercase tracking-wider">Issues Resolved</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-bold text-blue-400 mb-2">48h</div>
            <div className="text-sm text-muted-foreground uppercase tracking-wider">Median Resolution</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-bold text-amber-400 mb-2">94%</div>
            <div className="text-sm text-muted-foreground uppercase tracking-wider">SLA Compliance</div>
          </div>
        </div>
      </section>

      {/* ============ How It Works ============ */}
      <section className="px-6 py-24 container mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">How It Works</h2>
        <p className="text-muted-foreground text-center mb-16 max-w-lg mx-auto">An end-to-end accountability loop from report to resolution.</p>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-blue-500/50 transition-all hover:-translate-y-1 duration-300">
            <CardContent className="pt-6">
              <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center mb-6">
                <Camera className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">1. Capture Evidence</h3>
              <p className="text-muted-foreground">
                Take a photo of the issue. GPS coordinates are auto-extracted. Faces and license plates are automatically blurred for privacy.
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-amber-500/50 transition-all hover:-translate-y-1 duration-300">
            <CardContent className="pt-6">
              <div className="w-12 h-12 rounded-lg bg-amber-500/20 flex items-center justify-center mb-6">
                <Clock className="w-6 h-6 text-amber-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">2. SLA Enforcement</h3>
              <p className="text-muted-foreground">
                Issues route to the correct ward officer with a strict, category-based deadline. Open manholes get 6h. Potholes get 48h.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-emerald-500/50 transition-all hover:-translate-y-1 duration-300">
            <CardContent className="pt-6">
              <div className="w-12 h-12 rounded-lg bg-emerald-500/20 flex items-center justify-center mb-6">
                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">3. Proof of Resolution</h3>
              <p className="text-muted-foreground">
                Officers must upload a photographic proof before closing a ticket. Citizens verify. The public dashboard shows everything.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ============ Three Views ============ */}
      <section className="px-6 py-24 bg-muted/10 border-y border-border/50">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Three Views, One Platform</h2>
          <p className="text-muted-foreground text-center mb-16 max-w-lg mx-auto">Designed for every stakeholder in the civic accountability loop.</p>

          <div className="grid md:grid-cols-3 gap-6">
            <Link href="/report" className="group">
              <Card className="h-full bg-gradient-to-br from-blue-950/50 to-card border-blue-500/20 hover:border-blue-500/50 transition-all hover:-translate-y-1 duration-300">
                <CardContent className="pt-6 pb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center"><Users className="w-5 h-5 text-blue-400" /></div>
                    <h3 className="text-lg font-bold">Citizen View</h3>
                  </div>
                  <p className="text-muted-foreground text-sm mb-4">4-step wizard: capture photo → select category → confirm location → provide DPDP consent → submit.</p>
                  <div className="text-blue-400 text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">Try Report Wizard <ArrowRight className="w-4 h-4" /></div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/dashboard" className="group">
              <Card className="h-full bg-gradient-to-br from-emerald-950/50 to-card border-emerald-500/20 hover:border-emerald-500/50 transition-all hover:-translate-y-1 duration-300">
                <CardContent className="pt-6 pb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center"><Eye className="w-5 h-5 text-emerald-400" /></div>
                    <h3 className="text-lg font-bold">Public Dashboard</h3>
                  </div>
                  <p className="text-muted-foreground text-sm mb-4">Live map with clustering, ward-level metrics, SLA compliance rates, and full transparency on all civic issues.</p>
                  <div className="text-emerald-400 text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">View Dashboard <ArrowRight className="w-4 h-4" /></div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/admin" className="group">
              <Card className="h-full bg-gradient-to-br from-amber-950/50 to-card border-amber-500/20 hover:border-amber-500/50 transition-all hover:-translate-y-1 duration-300">
                <CardContent className="pt-6 pb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center"><Shield className="w-5 h-5 text-amber-400" /></div>
                    <h3 className="text-lg font-bold">Admin Dashboard</h3>
                  </div>
                  <p className="text-muted-foreground text-sm mb-4">Ward officers manage issues, update statuses with mandatory proof photos, and view escalation timelines.</p>
                  <div className="text-amber-400 text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">Open Admin Panel <ArrowRight className="w-4 h-4" /></div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* ============ Escalation Policy ============ */}
      <section className="px-6 py-24 container mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Escalation Policy</h2>
        <p className="text-muted-foreground text-center mb-16 max-w-lg mx-auto">A 4-tier automatic escalation system ensures no issue falls through the cracks.</p>

        <div className="grid md:grid-cols-4 gap-6 relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-10 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-blue-500 via-amber-500 to-red-500"></div>

          {[
            { level: 1, name: "Ward Officer", time: "Immediate", color: "blue", icon: Users, desc: "Auto-assigned via GPS ward mapping. Push notification sent." },
            { level: 2, name: "Zonal Engineer", time: "50% SLA elapsed", color: "amber", icon: AlertTriangle, desc: "No acknowledgment triggers automatic escalation upward." },
            { level: 3, name: "Dy. Commissioner", time: "100% SLA breached", color: "orange", icon: Zap, desc: "SLA breach flagged in weekly review dashboard." },
            { level: 4, name: "Commissioner", time: "200% SLA breached", color: "red", icon: AlertTriangle, desc: "Included in Commissioner's daily brief." },
          ].map((tier) => {
            const Icon = tier.icon;
            return (
              <div key={tier.level} className="flex flex-col items-center text-center">
                <div className={`w-20 h-20 rounded-full bg-${tier.color}-500/10 border-2 border-${tier.color}-500/30 flex items-center justify-center mb-4 relative z-10 bg-background`}>
                  <Icon className={`w-8 h-8 text-${tier.color}-400`} />
                </div>
                <Badge variant="outline" className="mb-2">{tier.time}</Badge>
                <h4 className="font-bold mb-1">L{tier.level}: {tier.name}</h4>
                <p className="text-xs text-muted-foreground">{tier.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ============ SLA Table ============ */}
      <section className="px-6 py-24 bg-muted/10 border-y border-border/50">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">SLA by Issue Category</h2>
          <p className="text-muted-foreground text-center mb-12 max-w-lg mx-auto">Right SLA for the right issue — based on public safety severity.</p>

          <div className="max-w-3xl mx-auto overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-card border-b border-border/50">
                <tr>
                  <th className="px-6 py-4">Issue Type</th>
                  <th className="px-6 py-4">SLA</th>
                  <th className="px-6 py-4">Severity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {[
                  { cat: "⚠️ Open Manhole", sla: "6 hours", sev: "Critical", sevClass: "bg-red-500/20 text-red-400" },
                  { cat: "🚰 Sewage Overflow", sla: "12 hours", sev: "Critical", sevClass: "bg-red-500/20 text-red-400" },
                  { cat: "💧 Water Supply", sla: "12 hours", sev: "High", sevClass: "bg-amber-500/20 text-amber-400" },
                  { cat: "💡 Streetlight Outage", sla: "24 hours", sev: "High", sevClass: "bg-amber-500/20 text-amber-400" },
                  { cat: "🗑️ Garbage Dump", sla: "24 hours", sev: "High", sevClass: "bg-amber-500/20 text-amber-400" },
                  { cat: "🕳️ Pothole", sla: "48 hours", sev: "Medium", sevClass: "bg-blue-500/20 text-blue-400" },
                  { cat: "🛣️ Road Damage", sla: "72 hours", sev: "Medium", sevClass: "bg-blue-500/20 text-blue-400" },
                  { cat: "🏗️ Illegal Construction", sla: "7 days", sev: "Low", sevClass: "bg-gray-500/20 text-gray-400" },
                ].map((row) => (
                  <tr key={row.cat} className="bg-background hover:bg-muted/30">
                    <td className="px-6 py-4 font-medium">{row.cat}</td>
                    <td className="px-6 py-4 font-mono">{row.sla}</td>
                    <td className="px-6 py-4"><span className={`px-2.5 py-1 rounded-full text-xs font-medium ${row.sevClass}`}>{row.sev}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ============ Data Privacy & Safeguards ============ */}
      <section className="px-6 py-24 container mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Data Privacy & Safeguards</h2>
        <p className="text-muted-foreground text-center mb-16 max-w-lg mx-auto">DPDP Act 2023 compliant. Built to protect citizens, not expose them.</p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { icon: Lock, title: "Explicit Consent", desc: "Non-pre-checked toggle. Citizens see exactly what data is collected and why before submitting.", color: "blue" },
            { icon: Eye, title: "PII Isolation", desc: "Names and phone numbers are isolated with Row Level Security. Public dashboards NEVER show citizen identities.", color: "emerald" },
            { icon: Users, title: "Anonymous Reporting", desc: "Citizens can submit fully anonymously. Even ward officers cannot see the submitter's identity.", color: "violet" },
            { icon: Shield, title: "Anti-Targeting Filters", desc: "Reports mentioning specific individuals or businesses by name are flagged for moderator review.", color: "amber" },
            { icon: FileCheck, title: "Photo Verification", desc: "EXIF data (timestamp + GPS) is cross-validated with submission. Mismatches flag the report.", color: "cyan" },
            { icon: BarChart3, title: "Trust Score", desc: "Verified reports increase trust. Rejected reports decrease it. Low-trust users require manual review.", color: "pink" },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <Card key={item.title} className="bg-card/50 border-border/50 hover:border-primary/30 transition-all">
                <CardContent className="pt-6">
                  <div className={`w-10 h-10 rounded-lg bg-${item.color}-500/20 flex items-center justify-center mb-4`}>
                    <Icon className={`w-5 h-5 text-${item.color}-400`} />
                  </div>
                  <h4 className="font-semibold mb-2">{item.title}</h4>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* ============ CTA ============ */}
      <section className="px-6 py-24 bg-gradient-to-t from-blue-950/30 to-background border-t border-border/50">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to hold your city accountable?</h2>
          <p className="text-muted-foreground mb-10 max-w-md mx-auto">Open-source, municipality-ready. Particularly valuable for Tier-2/3 cities that cannot afford bespoke platforms.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/report">
              <Button size="lg" className="rounded-full px-10 bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/25">
                <Camera className="w-5 h-5 mr-2" /> Report an Issue Now
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="lg" variant="outline" className="rounded-full px-10 border-white/10 hover:bg-white/5">
                <Map className="w-5 h-5 mr-2" /> Explore Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ============ Footer ============ */}
      <footer className="px-6 py-8 border-t border-border/50 bg-card/50">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="text-lg">🏛️</span>
            <span className="font-semibold text-foreground">CivicTrack</span>
            <span>— Open-source civic accountability platform</span>
          </div>
          <div className="flex gap-6">
            <Link href="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link>
            <Link href="/report" className="hover:text-foreground transition-colors">Report</Link>
            <Link href="/admin" className="hover:text-foreground transition-colors">Admin</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
