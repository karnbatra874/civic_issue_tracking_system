"use client";

import { useState } from "react";
import { Camera, MapPin, CheckCircle2, ShieldAlert, Image as ImageIcon, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { MOCK_CATEGORIES, MOCK_WARDS } from "@/lib/mock-data";
import { toast } from "sonner";
import Link from "next/link";

export default function ReportWizard() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [ticketId, setTicketId] = useState<string | null>(null);

  // Form State
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [wardId, setWardId] = useState<string>("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [consentGiven, setConsentGiven] = useState(false);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create a fake preview
      const url = URL.createObjectURL(file);
      setPhotoPreview(url);
      toast.success("Photo uploaded successfully. GPS coordinates extracted.");
    }
  };

  const handleSubmit = async () => {
    if (!consentGiven) {
      toast.error("You must provide consent to submit a report.");
      return;
    }
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setTicketId(`R-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(4, "0")}`);
      setStep(5);
      toast.success("Issue reported successfully!");
    }, 1500);
  };

  // --------------------------------------------------------
  // Step 1: Capture
  // --------------------------------------------------------
  const renderStep1 = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold">Capture Evidence</h2>
        <p className="text-muted-foreground mt-2">Take a photo of the civic issue.</p>
      </div>

      <div className="flex flex-col items-center justify-center border-2 border-dashed border-border/50 rounded-xl p-8 bg-muted/20 hover:bg-muted/30 transition-colors">
        {photoPreview ? (
          <div className="space-y-4 w-full max-w-sm">
            <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-border/50">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photoPreview} alt="Preview" className="object-cover w-full h-full" />
            </div>
            <div className="flex items-center justify-between bg-primary/10 text-primary px-3 py-2 rounded-md text-sm font-medium border border-primary/20">
              <span className="flex items-center gap-2"><MapPin className="w-4 h-4" /> 28.6328° N, 77.2197° E</span>
              <Badge variant="outline" className="border-primary/30 bg-primary/10">GPS Extracted</Badge>
            </div>
            <Button variant="outline" className="w-full" onClick={() => setPhotoPreview(null)}>Retake Photo</Button>
          </div>
        ) : (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto text-blue-500">
              <Camera className="w-8 h-8" />
            </div>
            <div>
              <p className="font-medium text-foreground">Upload or take a photo</p>
              <p className="text-sm text-muted-foreground mt-1">JPEG, PNG up to 10MB</p>
            </div>
            <Label htmlFor="photo-upload" className="cursor-pointer inline-block">
              <div className="bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 rounded-md font-medium text-sm inline-flex items-center justify-center">
                <ImageIcon className="w-4 h-4 mr-2" /> Select File
              </div>
              <Input id="photo-upload" type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
            </Label>
          </div>
        )}
      </div>

      <div className="flex justify-end pt-4">
        <Button onClick={() => setStep(2)} disabled={!photoPreview} className="rounded-full px-6">
          Next Step <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );

  // --------------------------------------------------------
  // Step 2: Categorize
  // --------------------------------------------------------
  const renderStep2 = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold">Select Category</h2>
        <p className="text-muted-foreground mt-2">What type of issue is this?</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {MOCK_CATEGORIES.map((cat) => (
          <Card 
            key={cat.id} 
            className={`cursor-pointer transition-all hover:scale-[1.02] ${categoryId === cat.id ? "ring-2 ring-blue-500 bg-blue-500/10 border-blue-500/30" : "border-border/50 hover:border-blue-500/30"}`}
            onClick={() => setCategoryId(cat.id)}
          >
            <CardContent className="p-4 flex flex-col items-center text-center space-y-3">
              <div className="text-3xl">{cat.icon}</div>
              <div>
                <div className="font-medium text-sm leading-tight mb-1">{cat.name}</div>
                <div className="text-xs text-muted-foreground">{cat.base_sla_hours}h SLA</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={() => setStep(1)} className="rounded-full px-6">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>
        <Button onClick={() => setStep(3)} disabled={!categoryId} className="rounded-full px-6 bg-blue-600 hover:bg-blue-700 text-white">
          Next Step <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );

  // --------------------------------------------------------
  // Step 3: Details
  // --------------------------------------------------------
  const renderStep3 = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold">Issue Details</h2>
        <p className="text-muted-foreground mt-2">Provide context to help officers resolve it faster.</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Short Title</Label>
          <Input 
            id="title" 
            placeholder="e.g. Large pothole blocking left lane" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            className="bg-background"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="desc">Description</Label>
          <Textarea 
            id="desc" 
            placeholder="Additional details..." 
            className="h-24 bg-background"
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Ward Area</Label>
            <Select value={wardId} onValueChange={(v) => { if (v !== null) setWardId(v); }}>
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Select ward..." />
              </SelectTrigger>
              <SelectContent>
                {MOCK_WARDS.map((w) => <SelectItem key={w.id} value={w.id}>{w.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2 pt-2">
          <Label>Location Confirmation</Label>
          <div className="h-32 w-full bg-muted/30 border border-border/50 rounded-lg flex items-center justify-center relative overflow-hidden">
            {/* Mock Map Background */}
            <div className="absolute inset-0 opacity-20 bg-[url('https://api.mapbox.com/styles/v1/mapbox/dark-v11/static/77.2197,28.6328,14,0/800x400?access_token=pk.mock')] bg-cover bg-center mix-blend-luminosity"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent"></div>
            
            <div className="relative z-10 flex flex-col items-center">
              <MapPin className="w-8 h-8 text-red-500 drop-shadow-lg mb-2" />
              <div className="bg-background/80 backdrop-blur-sm px-3 py-1 rounded-md text-xs font-mono border border-border/50">
                28.6328°N, 77.2197°E
              </div>
            </div>
          </div>
        </div>

        <Card className="border-border/50 bg-background/50">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base font-medium">Submit Anonymously</Label>
              <p className="text-sm text-muted-foreground">Your name and phone number will be hidden.</p>
            </div>
            <Switch checked={isAnonymous} onCheckedChange={setIsAnonymous} />
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={() => setStep(2)} className="rounded-full px-6">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>
        <Button onClick={() => setStep(4)} disabled={!title || !wardId} className="rounded-full px-6 bg-blue-600 hover:bg-blue-700 text-white">
          Review <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );

  // --------------------------------------------------------
  // Step 4: Consent & Submit
  // --------------------------------------------------------
  const renderStep4 = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold">Review & Consent</h2>
        <p className="text-muted-foreground mt-2">DPDP Act 2023 Compliance</p>
      </div>

      <Card className="border-amber-500/30 bg-amber-500/5">
        <CardContent className="p-5 space-y-4">
          <div className="flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
            <div className="space-y-2">
              <h3 className="font-medium text-amber-500">Privacy Notice</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                By submitting this report, you consent to the collection of your provided photo, location data, and issue description for the explicit purpose of civic issue resolution. 
              </p>
              <ul className="text-sm text-muted-foreground list-disc pl-4 space-y-1">
                <li>Your data will be shared only with authorized ward officers.</li>
                <li>Any display on the public dashboard will be strictly anonymized.</li>
                <li>Data is retained for up to 2 years post-resolution for auditing.</li>
                <li>You maintain the right to withdraw this consent at any time.</li>
              </ul>
            </div>
          </div>
          
          <div className="pt-2 mt-2 border-t border-amber-500/20">
            <div className="flex items-start space-x-3 pt-2">
              <Switch id="consent" checked={consentGiven} onCheckedChange={setConsentGiven} className="mt-1 data-[state=checked]:bg-emerald-500" />
              <Label htmlFor="consent" className="text-sm font-medium leading-relaxed cursor-pointer">
                I have read the privacy notice and provide my free, specific, and informed consent to process my data for resolving this issue.
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={() => setStep(3)} className="rounded-full px-6" disabled={loading}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>
        <Button 
          onClick={handleSubmit} 
          disabled={!consentGiven || loading} 
          className="rounded-full px-8 bg-emerald-600 hover:bg-emerald-700 text-white"
        >
          {loading ? "Submitting..." : "Submit Report"}
        </Button>
      </div>
    </div>
  );

  // --------------------------------------------------------
  // Step 5: Success
  // --------------------------------------------------------
  const renderStep5 = () => (
    <div className="space-y-6 text-center py-10 animate-in fade-in zoom-in duration-500">
      <div className="w-20 h-20 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle2 className="w-10 h-10" />
      </div>
      <h2 className="text-3xl font-bold">Report Submitted!</h2>
      <p className="text-muted-foreground max-w-md mx-auto">
        Your issue has been securely logged and routed to the ward officer. The SLA countdown has started.
      </p>
      
      <Card className="max-w-sm mx-auto bg-muted/30 border-border/50 mt-6">
        <CardContent className="p-6">
          <div className="text-sm text-muted-foreground uppercase tracking-wider mb-1">Ticket ID</div>
          <div className="text-2xl font-mono font-bold tracking-widest text-foreground">{ticketId}</div>
        </CardContent>
      </Card>

      <div className="pt-8 flex flex-col sm:flex-row justify-center gap-4">
        <Link href="/dashboard">
          <Button variant="outline" className="w-full sm:w-auto rounded-full px-8">Track on Dashboard</Button>
        </Link>
        <Button onClick={() => { setStep(1); setPhotoPreview(null); setCategoryId(null); setTitle(""); setDescription(""); setConsentGiven(false); }} className="w-full sm:w-auto rounded-full px-8">
          Report Another
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background/50 py-12 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto">
        
        {/* Progress indicator */}
        {step < 5 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-2">
              {[1, 2, 3, 4].map((s) => (
                <div key={s} className="flex flex-col items-center relative z-10">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors duration-300 ${step >= s ? "bg-blue-600 text-white" : "bg-muted text-muted-foreground border border-border"}`}>
                    {s}
                  </div>
                  <span className={`text-xs mt-2 font-medium ${step >= s ? "text-foreground" : "text-muted-foreground"}`}>
                    {s === 1 ? "Photo" : s === 2 ? "Category" : s === 3 ? "Details" : "Consent"}
                  </span>
                </div>
              ))}
            </div>
            {/* Progress line */}
            <div className="relative -mt-8 mb-6 h-1 w-[calc(100%-2rem)] mx-auto bg-muted rounded-full overflow-hidden z-0">
              <div 
                className="absolute top-0 left-0 h-full bg-blue-600 transition-all duration-500" 
                style={{ width: `${((step - 1) / 3) * 100}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Main Card */}
        <Card className={`border-border/50 bg-card/60 backdrop-blur-xl shadow-2xl ${step === 5 ? "border-emerald-500/30 bg-emerald-500/5 shadow-emerald-500/10" : ""}`}>
          <CardContent className="p-6 md:p-10">
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}
            {step === 4 && renderStep4()}
            {step === 5 && renderStep5()}
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
