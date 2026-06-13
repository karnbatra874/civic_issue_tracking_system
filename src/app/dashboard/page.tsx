"use client";

import { useState, useMemo } from "react";
import { BarChart3, Clock, CheckCircle2, AlertCircle, MapPin, Search, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MOCK_REPORTS, MOCK_CATEGORIES, MOCK_WARDS, computeMetrics, SLA_POLICY, SAFEGUARDS } from "@/lib/mock-data";
import { formatDate, getStatusColor, getStatusLabel } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

export default function PublicDashboard() {
  const metrics = useMemo(() => computeMetrics(), []);
  
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterWard, setFilterWard] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedReport, setSelectedReport] = useState<typeof MOCK_REPORTS[0] | null>(null);

  const filteredReports = useMemo(() => {
    return MOCK_REPORTS.filter((r) => {
      const matchCat = filterCategory === "all" || r.category_name === filterCategory;
      const matchStat = filterStatus === "all" || r.status === filterStatus;
      const matchWard = filterWard === "all" || r.ward_id === filterWard;
      const matchSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (r.address && r.address.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCat && matchStat && matchWard && matchSearch;
    });
  }, [filterCategory, filterStatus, filterWard, searchQuery]);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background/50">
      
      {/* Metrics Header */}
      <div className="bg-card border-b border-border/50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Public Transparency Dashboard</h1>
              <p className="text-muted-foreground mt-1">Real-time civic issue tracking across the city</p>
            </div>
            <div className="bg-primary/10 text-primary px-4 py-2 rounded-lg font-medium border border-primary/20 flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
              </span>
              Live Tracking Active
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <Card className="bg-background/50 border-border/50">
              <CardContent className="p-4">
                <div className="text-sm font-medium text-muted-foreground flex items-center gap-2 mb-1"><BarChart3 className="w-4 h-4"/> Total Reports</div>
                <div className="text-2xl font-bold">{metrics.total}</div>
              </CardContent>
            </Card>
            <Card className="bg-red-500/5 border-red-500/20">
              <CardContent className="p-4">
                <div className="text-sm font-medium text-red-500 flex items-center gap-2 mb-1"><AlertCircle className="w-4 h-4"/> Open</div>
                <div className="text-2xl font-bold text-red-500">{metrics.open}</div>
              </CardContent>
            </Card>
            <Card className="bg-amber-500/5 border-amber-500/20">
              <CardContent className="p-4">
                <div className="text-sm font-medium text-amber-500 flex items-center gap-2 mb-1"><Clock className="w-4 h-4"/> In Progress</div>
                <div className="text-2xl font-bold text-amber-500">{metrics.inProgress}</div>
              </CardContent>
            </Card>
            <Card className="bg-emerald-500/5 border-emerald-500/20">
              <CardContent className="p-4">
                <div className="text-sm font-medium text-emerald-500 flex items-center gap-2 mb-1"><CheckCircle2 className="w-4 h-4"/> Resolved</div>
                <div className="text-2xl font-bold text-emerald-500">{metrics.resolved}</div>
              </CardContent>
            </Card>
            <Card className="bg-background/50 border-border/50">
              <CardContent className="p-4">
                <div className="text-sm font-medium text-muted-foreground mb-1">Median Resolution</div>
                <div className="text-2xl font-bold">{metrics.medianResolution}h</div>
              </CardContent>
            </Card>
            <Card className="bg-blue-500/5 border-blue-500/20">
              <CardContent className="p-4">
                <div className="text-sm font-medium text-blue-500 mb-1">SLA Compliance</div>
                <div className="text-2xl font-bold text-blue-500">{metrics.slaComplianceRate}%</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-8">
        
        <Tabs defaultValue="map" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="map">Interactive Map</TabsTrigger>
            <TabsTrigger value="list">List View</TabsTrigger>
            <TabsTrigger value="wards">Ward Performance</TabsTrigger>
            <TabsTrigger value="policies">Policies & Safeguards</TabsTrigger>
          </TabsList>

          <TabsContent value="map" className="space-y-6">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 bg-card p-4 rounded-xl border border-border/50">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search location or title..." className="pl-9 bg-background" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
              </div>
              <div className="flex gap-2">
                <Select value={filterCategory} onValueChange={(v) => { if (v !== null) setFilterCategory(v); }}>
                  <SelectTrigger className="w-[160px] bg-background"><SelectValue placeholder="Category" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {MOCK_CATEGORIES.map(c => <SelectItem key={c.id} value={c.name}>{c.icon} {c.name}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Select value={filterStatus} onValueChange={(v) => { if (v !== null) setFilterStatus(v); }}>
                  <SelectTrigger className="w-[140px] bg-background"><SelectValue placeholder="Status" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="acknowledged">Acknowledged</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Mock Map */}
            <Card className="overflow-hidden border-border/50">
              <div className="h-[500px] relative bg-[#1c1c1c] overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/dark-v11/static/77.2197,28.6328,11,0/1200x600?access_token=pk.mock')] bg-cover bg-center mix-blend-screen opacity-40"></div>
                
                {/* Map Points */}
                {filteredReports.map((report) => {
                  // Mock coordinate to percentage mapping for visual display
                  const top = `${Math.random() * 80 + 10}%`;
                  const left = `${Math.random() * 80 + 10}%`;
                  const isUrgent = report.status === "open" || report.status === "acknowledged";
                  
                  return (
                    <div 
                      key={report.id}
                      className="absolute group cursor-pointer"
                      style={{ top, left }}
                      onClick={() => setSelectedReport(report)}
                    >
                      <div className={`relative flex items-center justify-center w-5 h-5`}>
                        {isUrgent && (
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        )}
                        <span className={`relative inline-flex rounded-full h-3 w-3 ${report.status === 'resolved' ? 'bg-emerald-500' : report.status === 'in_progress' ? 'bg-amber-500' : 'bg-red-500'}`}></span>
                      </div>
                      
                      {/* Hover Tooltip */}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-[200px] p-2 bg-popover/90 backdrop-blur-md border border-border/50 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 text-xs">
                        <div className="font-medium truncate">{report.title}</div>
                        <div className="text-muted-foreground mt-0.5">{report.category_name}</div>
                      </div>
                    </div>
                  );
                })}

                <div className="absolute bottom-4 left-4 bg-background/80 backdrop-blur-md p-3 rounded-lg border border-border/50 text-xs">
                  <div className="font-semibold mb-2 text-foreground">Map Legend</div>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-red-500"></span> Open/Unresolved</div>
                    <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> In Progress</div>
                    <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Resolved</div>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="list" className="space-y-4">
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredReports.map((report) => (
                <Card key={report.id} className="bg-card/50 hover:bg-card hover:border-primary/50 transition-all cursor-pointer" onClick={() => setSelectedReport(report)}>
                  <CardHeader className="p-4 pb-2">
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="outline" className="bg-background">{report.category_name}</Badge>
                      <Badge className={getStatusColor(report.status)} variant="outline">{getStatusLabel(report.status)}</Badge>
                    </div>
                    <CardTitle className="text-base line-clamp-1">{report.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="text-sm text-muted-foreground flex items-center gap-1.5 mt-2">
                      <MapPin className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{report.address}</span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-3 flex justify-between">
                      <span>{report.ward_name}</span>
                      <span>{formatDate(report.created_at)}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {filteredReports.length === 0 && (
                <div className="col-span-full py-12 text-center text-muted-foreground bg-card/50 rounded-xl border border-dashed border-border/50">
                  No issues found matching your filters.
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="wards">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Ward Performance Metrics</CardTitle>
                <CardDescription>Track resolution rates and efficiency across different administrative wards.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
                      <tr>
                        <th className="px-4 py-3 rounded-tl-lg">Ward</th>
                        <th className="px-4 py-3">Total Issues</th>
                        <th className="px-4 py-3">Open</th>
                        <th className="px-4 py-3">Resolved</th>
                        <th className="px-4 py-3 rounded-tr-lg">Resolution Rate</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                      {metrics.wardBreakdown.map((ward) => {
                        const rate = ward.total > 0 ? Math.round((ward.resolved / ward.total) * 100) : 0;
                        return (
                          <tr key={ward.ward_name} className="bg-background hover:bg-muted/30">
                            <td className="px-4 py-3 font-medium">{ward.ward_name}</td>
                            <td className="px-4 py-3">{ward.total}</td>
                            <td className="px-4 py-3 text-red-400">{ward.open}</td>
                            <td className="px-4 py-3 text-emerald-400">{ward.resolved}</td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <div className="w-full bg-muted rounded-full h-2 max-w-[100px]">
                                  <div className="bg-primary h-2 rounded-full" style={{ width: `${rate}%` }}></div>
                                </div>
                                <span>{rate}%</span>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="policies" className="space-y-6">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Escalation Policy & SLA Commitments</CardTitle>
                <CardDescription>Our guaranteed timeframes for resolving specific civic issues.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
                      <tr>
                        <th className="px-4 py-3 rounded-tl-lg">Category</th>
                        <th className="px-4 py-3">Resolution SLA</th>
                        <th className="px-4 py-3">Severity</th>
                        <th className="px-4 py-3 rounded-tr-lg">Escalation Chain</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                      {SLA_POLICY.map((policy) => (
                        <tr key={policy.category} className="bg-background hover:bg-muted/30">
                          <td className="px-4 py-3 font-medium">{policy.category}</td>
                          <td className="px-4 py-3 font-mono">{policy.sla}</td>
                          <td className="px-4 py-3">
                            <Badge variant="outline" className={
                              policy.severity === 'Critical' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                              policy.severity === 'High' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                              policy.severity === 'Medium' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                              'bg-gray-500/10 text-gray-400 border-gray-500/20'
                            }>
                              {policy.severity}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">{policy.escalation}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <h3 className="text-xl font-bold mt-8 mb-4">Anti-Harassment & Data Protection</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {SAFEGUARDS.map((sg) => (
                <Card key={sg.title} className="bg-card/50 border-border/50">
                  <CardContent className="p-5">
                    <div className="text-2xl mb-3">{sg.icon}</div>
                    <h4 className="font-semibold mb-2">{sg.title}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{sg.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

      </div>

      {/* Report Detail Dialog */}
      <Dialog open={!!selectedReport} onOpenChange={(open) => !open && setSelectedReport(null)}>
        <DialogContent className="sm:max-w-[500px] bg-background/95 backdrop-blur-xl border-border/50">
          {selectedReport && (
            <>
              <DialogHeader>
                <div className="flex items-center justify-between mb-2 pr-6">
                  <Badge variant="outline">{selectedReport.category_name}</Badge>
                  <span className="text-xs text-muted-foreground">{formatDate(selectedReport.created_at)}</span>
                </div>
                <DialogTitle className="text-xl">{selectedReport.title}</DialogTitle>
                <DialogDescription className="mt-2 text-sm">{selectedReport.description}</DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/20 p-3 rounded-lg border border-border/50">
                  <MapPin className="w-4 h-4 text-primary shrink-0" />
                  <span>{selectedReport.address}</span>
                </div>

                <div className="bg-card p-4 rounded-xl border border-border/50">
                  <h4 className="text-sm font-semibold mb-3">Current Status</h4>
                  <div className={`px-4 py-3 rounded-lg border flex items-center justify-between ${getStatusColor(selectedReport.status)}`}>
                    <span className="font-medium">{getStatusLabel(selectedReport.status)}</span>
                    {selectedReport.status !== "resolved" && selectedReport.status !== "rejected" && (
                      <span className="text-xs opacity-80 border border-current/30 px-2 py-0.5 rounded-full">
                        SLA: {formatDate(selectedReport.sla_deadline)}
                      </span>
                    )}
                  </div>
                </div>

                {selectedReport.status === "resolved" && (
                  <div className="border border-emerald-500/30 rounded-xl overflow-hidden bg-emerald-500/5">
                    <div className="bg-emerald-500/10 px-4 py-2 text-xs font-medium text-emerald-500 border-b border-emerald-500/20">
                      Proof of Resolution
                    </div>
                    <div className="p-4 flex items-center justify-center text-sm text-emerald-400/80 italic">
                      [Resolution Photo Verified by Admin]
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
