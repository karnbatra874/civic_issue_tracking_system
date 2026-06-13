"use client";

import { useState, useMemo } from "react";
import { Shield, Clock, CheckCircle2, AlertCircle, FileText, Image as ImageIcon, Search, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { MOCK_REPORTS, MOCK_AUDIT_LOGS, ESCALATION_TIERS, SLA_POLICY, SAFEGUARDS } from "@/lib/mock-data";
import { formatDate, getStatusColor, getStatusLabel, getSlaUrgency } from "@/lib/utils";
import { toast } from "sonner";
import { ReportStatus } from "@/lib/types";

export default function AdminDashboard() {
  const [reports, setReports] = useState(MOCK_REPORTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedReport, setSelectedReport] = useState<typeof MOCK_REPORTS[0] | null>(null);
  
  // Status Update State
  const [newStatus, setNewStatus] = useState<ReportStatus>("open");
  const [statusNotes, setStatusNotes] = useState("");
  const [proofPhoto, setProofPhoto] = useState<File | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const filteredReports = useMemo(() => {
    return reports.filter(r => 
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      r.id.toLowerCase().includes(searchQuery.toLowerCase())
    ).sort((a, b) => {
      // Sort: Open/Overdue first, then by date
      if (a.status === "open" && b.status !== "open") return -1;
      if (a.status !== "open" && b.status === "open") return 1;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  }, [reports, searchQuery]);

  const stats = useMemo(() => {
    const total = reports.length;
    const open = reports.filter(r => r.status === "open" || r.status === "acknowledged").length;
    const overdue = reports.filter(r => getSlaUrgency(r.sla_deadline) === "overdue" && r.status !== "resolved" && r.status !== "rejected").length;
    const inProgress = reports.filter(r => r.status === "in_progress").length;
    const resolved = reports.filter(r => r.status === "resolved").length;
    return { total, open, overdue, inProgress, resolved };
  }, [reports]);

  const handleUpdateStatus = () => {
    if (!selectedReport) return;
    if (newStatus === "resolved" && !proofPhoto) {
      toast.error("Proof of resolution photo is mandatory to close a ticket.");
      return;
    }

    setIsUpdating(true);
    // Simulate API call
    setTimeout(() => {
      setReports(current => 
        current.map(r => r.id === selectedReport.id ? { ...r, status: newStatus } : r)
      );
      toast.success(`Status updated to ${getStatusLabel(newStatus)}`);
      setIsUpdating(false);
      setSelectedReport(null);
      setNewStatus("open");
      setStatusNotes("");
      setProofPhoto(null);
    }, 1000);
  };

  const openReportDialog = (report: typeof MOCK_REPORTS[0]) => {
    setSelectedReport(report);
    setNewStatus(report.status);
    setStatusNotes("");
    setProofPhoto(null);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background/50">
      {/* Header */}
      <div className="bg-card border-b border-border/50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl font-bold tracking-tight">Ward Officer Dashboard</h1>
                <Badge variant="default" className="bg-blue-600 hover:bg-blue-600">Officer Role</Badge>
              </div>
              <p className="text-muted-foreground text-sm">Manage and resolve civic issues in your assigned ward (Ward 1 - Ward 5)</p>
            </div>
            <div className="text-sm font-medium bg-muted/50 px-3 py-1.5 rounded-md border border-border/50 flex items-center">
              <Shield className="w-4 h-4 mr-2 text-muted-foreground" />
              Authenticated Session
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <Card className="bg-background/50">
              <CardContent className="p-4 flex flex-col justify-center">
                <div className="text-sm text-muted-foreground flex items-center gap-2"><FileText className="w-4 h-4"/> Total Assigned</div>
                <div className="text-2xl font-bold mt-1">{stats.total}</div>
              </CardContent>
            </Card>
            <Card className="bg-red-500/5 border-red-500/20">
              <CardContent className="p-4 flex flex-col justify-center">
                <div className="text-sm text-red-500 flex items-center gap-2"><AlertCircle className="w-4 h-4"/> Open & Overdue</div>
                <div className="text-2xl font-bold text-red-500 mt-1">{stats.open} <span className="text-sm font-normal opacity-80 ml-1">({stats.overdue} overdue)</span></div>
              </CardContent>
            </Card>
            <Card className="bg-amber-500/5 border-amber-500/20">
              <CardContent className="p-4 flex flex-col justify-center">
                <div className="text-sm text-amber-500 flex items-center gap-2"><Clock className="w-4 h-4"/> In Progress</div>
                <div className="text-2xl font-bold text-amber-500 mt-1">{stats.inProgress}</div>
              </CardContent>
            </Card>
            <Card className="bg-emerald-500/5 border-emerald-500/20">
              <CardContent className="p-4 flex flex-col justify-center">
                <div className="text-sm text-emerald-500 flex items-center gap-2"><CheckCircle2 className="w-4 h-4"/> Resolved</div>
                <div className="text-2xl font-bold text-emerald-500 mt-1">{stats.resolved}</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="issues" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="issues">Assigned Issues</TabsTrigger>
            <TabsTrigger value="escalation">Escalation Policy</TabsTrigger>
            <TabsTrigger value="dpdp">DPDP Compliance</TabsTrigger>
          </TabsList>

          <TabsContent value="issues" className="space-y-4">
            <div className="flex items-center gap-2 max-w-sm mb-4">
              <Search className="w-4 h-4 text-muted-foreground absolute ml-3" />
              <Input 
                placeholder="Search ticket ID or title..." 
                className="pl-9 bg-card" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="grid gap-3">
              {filteredReports.map((report) => {
                const urgency = getSlaUrgency(report.sla_deadline);
                const isClosed = report.status === "resolved" || report.status === "rejected";
                
                return (
                  <Card key={report.id} className={`bg-card/80 hover:bg-card transition-colors cursor-pointer border-l-4 ${isClosed ? 'border-l-border/50 opacity-80' : urgency === 'overdue' ? 'border-l-red-500' : urgency === 'critical' ? 'border-l-orange-500' : urgency === 'warning' ? 'border-l-amber-500' : 'border-l-blue-500'}`} onClick={() => openReportDialog(report)}>
                    <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">{report.id.toUpperCase()}</span>
                          <Badge variant="outline" className="bg-background/50">{report.category_name}</Badge>
                          {report.is_anonymous && <Badge variant="secondary" className="text-[10px] h-5">Anonymous</Badge>}
                        </div>
                        <h3 className="font-semibold text-base">{report.title}</h3>
                        <p className="text-sm text-muted-foreground truncate">{report.ward_name} • {report.address}</p>
                      </div>

                      <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0">
                        <Badge className={getStatusColor(report.status)} variant="outline">{getStatusLabel(report.status)}</Badge>
                        {!isClosed && (
                          <div className={`text-xs font-medium flex items-center gap-1.5 ${urgency === 'overdue' ? 'text-red-500' : urgency === 'critical' ? 'text-orange-500' : 'text-muted-foreground'}`}>
                            {urgency === 'overdue' && <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span></span>}
                            SLA: {formatDate(report.sla_deadline)}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="escalation" className="space-y-8">
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1 space-y-4">
                <h3 className="text-lg font-bold">Escalation Timeline</h3>
                <div className="relative border-l border-border/50 ml-4 space-y-6 py-2">
                  {ESCALATION_TIERS.map((tier) => (
                    <div key={tier.level} className="relative pl-6">
                      <div className="absolute -left-[17px] top-0 w-8 h-8 rounded-full bg-card border-2 border-primary flex items-center justify-center font-bold text-sm">
                        {tier.level}
                      </div>
                      <div className="pt-1">
                        <h4 className="font-semibold">{tier.name}</h4>
                        <Badge variant="secondary" className="mt-1 mb-2">{tier.timeframe}</Badge>
                        <p className="text-sm text-muted-foreground">{tier.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="lg:col-span-2 space-y-4">
                <h3 className="text-lg font-bold">SLA Policy by Category</h3>
                <Card className="border-border/50">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
                        <tr>
                          <th className="px-4 py-3 rounded-tl-lg">Category</th>
                          <th className="px-4 py-3">SLA</th>
                          <th className="px-4 py-3">Severity</th>
                          <th className="px-4 py-3 rounded-tr-lg">Escalation Rule</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/50">
                        {SLA_POLICY.map((policy) => (
                          <tr key={policy.category} className="bg-background hover:bg-muted/30">
                            <td className="px-4 py-3 font-medium">{policy.category}</td>
                            <td className="px-4 py-3 font-mono">{policy.sla}</td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                policy.severity === 'Critical' ? 'bg-red-500/20 text-red-500' :
                                policy.severity === 'High' ? 'bg-amber-500/20 text-amber-500' :
                                policy.severity === 'Medium' ? 'bg-blue-500/20 text-blue-500' :
                                'bg-gray-500/20 text-gray-400'
                              }`}>{policy.severity}</span>
                            </td>
                            <td className="px-4 py-3 text-muted-foreground">{policy.escalation}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="dpdp" className="space-y-8">
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-2">Data Protection Compliance</h2>
              <p className="text-muted-foreground">This system is designed in accordance with the Digital Personal Data Protection (DPDP) Act, 2023 of India.</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card className="bg-card/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500"/> Consent Management</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">All reports require explicit, affirmative consent. Pre-checked boxes are disabled by default during submission.</CardContent>
              </Card>
              <Card className="bg-card/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2"><Shield className="w-4 h-4 text-blue-500"/> PII Isolation</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">Citizen names and phone numbers are strictly isolated. Row Level Security (RLS) ensures public views cannot access PII.</CardContent>
              </Card>
              <Card className="bg-card/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2"><Info className="w-4 h-4 text-amber-500"/> Anonymous Reporting</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">Citizens can opt to submit completely anonymously. In these cases, even ward officers cannot see the submitter's identity.</CardContent>
              </Card>
            </div>

            <h3 className="text-lg font-bold mt-8 mb-4">Anti-Harassment Safeguards</h3>
            <div className="grid md:grid-cols-2 gap-4">
               {SAFEGUARDS.map((sg) => (
                <div key={sg.title} className="flex gap-4 p-4 rounded-lg border border-border/50 bg-background/50">
                  <div className="text-2xl mt-1">{sg.icon}</div>
                  <div>
                    <h4 className="font-semibold text-sm mb-1">{sg.title}</h4>
                    <p className="text-sm text-muted-foreground">{sg.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Action Dialog */}
      <Dialog open={!!selectedReport} onOpenChange={(open) => !open && setSelectedReport(null)}>
        <DialogContent className="sm:max-w-[600px] bg-background/95 backdrop-blur-xl border-border/50 max-h-[90vh] overflow-y-auto">
          {selectedReport && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline">{selectedReport.category_name}</Badge>
                  <span className="text-xs text-muted-foreground font-mono">{selectedReport.id.toUpperCase()}</span>
                </div>
                <DialogTitle>{selectedReport.title}</DialogTitle>
                <DialogDescription>{selectedReport.address}</DialogDescription>
              </DialogHeader>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-1">Description</h4>
                    <p className="text-sm bg-muted/30 p-3 rounded-md">{selectedReport.description}</p>
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-1">Citizen Identity</h4>
                    {selectedReport.is_anonymous ? (
                      <div className="text-sm text-muted-foreground italic flex items-center gap-2"><Shield className="w-4 h-4"/> Submitted Anonymously</div>
                    ) : (
                      <div className="text-sm">Verified Citizen ID: <span className="font-mono text-muted-foreground">{selectedReport.citizen_id.split('-')[0]}***</span></div>
                    )}
                  </div>
                  
                  {/* Audit Trail */}
                  <div>
                    <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-2">Audit Trail</h4>
                    <div className="space-y-3 border-l-2 border-border/50 ml-2 pl-4 py-1">
                      {MOCK_AUDIT_LOGS.filter(a => a.report_id === selectedReport.id).map(log => (
                        <div key={log.id} className="relative">
                          <div className="absolute -left-[21px] top-1 w-2 h-2 rounded-full bg-primary ring-4 ring-background"></div>
                          <div className="text-xs font-medium">{getStatusLabel(log.new_status)}</div>
                          <div className="text-[10px] text-muted-foreground">{formatDate(log.created_at)}</div>
                          <div className="text-xs mt-1 text-foreground/80 italic">&quot;{log.notes}&quot;</div>
                        </div>
                      ))}
                      <div className="relative">
                         <div className="absolute -left-[21px] top-1 w-2 h-2 rounded-full bg-border ring-4 ring-background"></div>
                         <div className="text-xs font-medium">Report Created</div>
                         <div className="text-[10px] text-muted-foreground">{formatDate(selectedReport.created_at)}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status Update Form */}
                <div className="bg-card p-4 rounded-xl border border-border/50 space-y-4 flex flex-col">
                  <h4 className="font-semibold border-b border-border/50 pb-2">Update Status</h4>
                  
                  <div className="space-y-2">
                    <Label>New Status</Label>
                    <Select value={newStatus} onValueChange={(val) => { if (val) setNewStatus(val as ReportStatus); }}>
                      <SelectTrigger className="bg-background">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="open">Open</SelectItem>
                        <SelectItem value="acknowledged">Acknowledged</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="resolved">Resolved (Close Ticket)</SelectItem>
                        <SelectItem value="rejected">Rejected (Invalid/Duplicate)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {newStatus === "resolved" && (
                    <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                      <Label className="flex items-center gap-2 text-emerald-500">
                        <CheckCircle2 className="w-4 h-4"/> Proof of Resolution <span className="text-xs opacity-70">(Required)</span>
                      </Label>
                      <div className="border-2 border-dashed border-emerald-500/30 rounded-lg p-4 text-center hover:bg-emerald-500/5 transition-colors cursor-pointer bg-background">
                        <Input 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          id="proof-upload" 
                          onChange={(e) => setProofPhoto(e.target.files?.[0] || null)}
                        />
                        <Label htmlFor="proof-upload" className="cursor-pointer flex flex-col items-center">
                          {proofPhoto ? (
                            <div className="text-sm font-medium text-emerald-500 flex items-center gap-2">
                              <ImageIcon className="w-4 h-4"/> {proofPhoto.name}
                            </div>
                          ) : (
                            <>
                              <ImageIcon className="w-6 h-6 text-muted-foreground mb-2" />
                              <span className="text-sm text-muted-foreground">Upload photo proof</span>
                            </>
                          )}
                        </Label>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2 flex-1">
                    <Label>Action Notes (Audit Log)</Label>
                    <Textarea 
                      placeholder="Reason for status change..." 
                      className="bg-background resize-none h-24"
                      value={statusNotes}
                      onChange={(e) => setStatusNotes(e.target.value)}
                    />
                  </div>

                  <Button 
                    className="w-full mt-auto" 
                    onClick={handleUpdateStatus} 
                    disabled={isUpdating || newStatus === selectedReport.status}
                    variant={newStatus === "resolved" ? "default" : "secondary"}
                  >
                    {isUpdating ? "Updating..." : "Commit Change"}
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
