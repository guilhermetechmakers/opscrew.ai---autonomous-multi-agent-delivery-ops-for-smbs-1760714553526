import { motion } from "motion/react";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { 
  Bot, 
  GitBranch, 
  Server, 
  Globe, 
  Settings, 
  CheckCircle, 
  Clock, 
  ArrowRight,
  Plus,
  ExternalLink,
  Code,
  Database,
  Cloud,
  Zap,
  BarChart3,
  Activity,
  MessageSquare,
  FileText,
  CreditCard,
  Headphones
} from "lucide-react";

interface ProjectConfig {
  name: string;
  description: string;
  techStack: string[];
  environment: string;
  repository: {
    name: string;
    visibility: 'private' | 'public';
    template: string;
  };
  infrastructure: {
    provider: string;
    region: string;
    tier: string;
  };
  clientPortal: {
    enabled: boolean;
    branding: {
      logo: string;
      primaryColor: string;
      secondaryColor: string;
    };
    features: string[];
  };
}

export default function ProjectSpinUpConsole() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isProvisioning, setIsProvisioning] = useState(false);
  const [provisioningProgress, setProvisioningProgress] = useState(0);
  const [projectConfig, setProjectConfig] = useState<ProjectConfig>({
    name: "",
    description: "",
    techStack: [],
    environment: "development",
    repository: {
      name: "",
      visibility: "private",
      template: "nextjs"
    },
    infrastructure: {
      provider: "vercel",
      region: "us-east-1",
      tier: "starter"
    },
    clientPortal: {
      enabled: true,
      branding: {
        logo: "",
        primaryColor: "#3B82F6",
        secondaryColor: "#1E40AF"
      },
      features: ["dashboard", "progress", "communication"]
    }
  });

  const techStackOptions = [
    { id: "react", label: "React", icon: Code },
    { id: "nextjs", label: "Next.js", icon: Globe },
    { id: "nodejs", label: "Node.js", icon: Server },
    { id: "typescript", label: "TypeScript", icon: Code },
    { id: "tailwind", label: "Tailwind CSS", icon: Code },
    { id: "postgresql", label: "PostgreSQL", icon: Database },
    { id: "redis", label: "Redis", icon: Database },
    { id: "docker", label: "Docker", icon: Cloud },
    { id: "aws", label: "AWS", icon: Cloud },
    { id: "vercel", label: "Vercel", icon: Cloud }
  ];

  const templateOptions = [
    { id: "nextjs", label: "Next.js Full-Stack", description: "React, TypeScript, Tailwind CSS, Prisma" },
    { id: "react-spa", label: "React SPA", description: "React, TypeScript, Vite, React Router" },
    { id: "node-api", label: "Node.js API", description: "Express, TypeScript, PostgreSQL, JWT" },
    { id: "fullstack", label: "Full-Stack App", description: "Next.js, Prisma, NextAuth, Stripe" }
  ];

  const infrastructureProviders = [
    { id: "vercel", label: "Vercel", description: "Frontend & API hosting" },
    { id: "aws", label: "AWS", description: "Full cloud infrastructure" },
    { id: "digitalocean", label: "DigitalOcean", description: "Simple cloud hosting" },
    { id: "railway", label: "Railway", description: "Developer-friendly platform" }
  ];

  const handleTechStackToggle = (techId: string) => {
    setProjectConfig(prev => ({
      ...prev,
      techStack: prev.techStack.includes(techId)
        ? prev.techStack.filter(id => id !== techId)
        : [...prev.techStack, techId]
    }));
  };

  const handleProvision = async () => {
    setIsProvisioning(true);
    setProvisioningProgress(0);

    // Simulate provisioning process
    const steps = [
      { name: "Creating repository", duration: 2000 },
      { name: "Setting up infrastructure", duration: 3000 },
      { name: "Configuring environment", duration: 2000 },
      { name: "Deploying application", duration: 4000 },
      { name: "Setting up client portal", duration: 3000 },
      { name: "Finalizing setup", duration: 1000 }
    ];

    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      setProvisioningProgress((i / steps.length) * 100);
      await new Promise(resolve => setTimeout(resolve, step.duration));
    }

    setProvisioningProgress(100);
    setIsProvisioning(false);
  };

  const steps = [
    { id: 1, title: "Project Details", description: "Basic project information" },
    { id: 2, title: "Repository Setup", description: "Git repository configuration" },
    { id: 3, title: "Infrastructure", description: "Cloud hosting and services" },
    { id: 4, title: "Client Portal", description: "Branded client interface" },
    { id: 5, title: "Review & Deploy", description: "Final configuration and launch" }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bot className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">OpsCrew.ai</span>
            <Badge variant="secondary" className="ml-2">Project Spin-Up</Badge>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={() => window.history.back()}>
              Back to Dashboard
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Progress Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold">Project Spin-Up Console</h1>
            <div className="text-sm text-muted-foreground">
              Step {currentStep} of {steps.length}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`
                  flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium
                  ${currentStep >= step.id 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-muted-foreground'
                  }
                `}>
                  {currentStep > step.id ? <CheckCircle className="h-4 w-4" /> : step.id}
                </div>
                <div className="ml-2">
                  <div className="text-sm font-medium">{step.title}</div>
                  <div className="text-xs text-muted-foreground">{step.description}</div>
                </div>
                {index < steps.length - 1 && (
                  <div className="w-8 h-px bg-border mx-4" />
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Configuration Form */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Settings className="h-5 w-5 mr-2" />
                    Project Configuration
                  </CardTitle>
                  <CardDescription>
                    Configure your project settings and infrastructure
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs value={currentStep.toString()} className="w-full">
                    <TabsList className="grid w-full grid-cols-5">
                      {steps.map((step) => (
                        <TabsTrigger 
                          key={step.id} 
                          value={step.id.toString()}
                          onClick={() => setCurrentStep(step.id)}
                          disabled={currentStep < step.id}
                        >
                          {step.title}
                        </TabsTrigger>
                      ))}
                    </TabsList>

                    {/* Step 1: Project Details */}
                    <TabsContent value="1" className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="project-name">Project Name</Label>
                          <Input
                            id="project-name"
                            placeholder="Enter project name"
                            value={projectConfig.name}
                            onChange={(e) => setProjectConfig(prev => ({
                              ...prev,
                              name: e.target.value
                            }))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="environment">Environment</Label>
                          <Select
                            value={projectConfig.environment}
                            onValueChange={(value) => setProjectConfig(prev => ({
                              ...prev,
                              environment: value
                            }))}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="development">Development</SelectItem>
                              <SelectItem value="staging">Staging</SelectItem>
                              <SelectItem value="production">Production</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description">Project Description</Label>
                        <Textarea
                          id="description"
                          placeholder="Describe your project..."
                          value={projectConfig.description}
                          onChange={(e) => setProjectConfig(prev => ({
                            ...prev,
                            description: e.target.value
                          }))}
                        />
                      </div>

                      <div className="space-y-4">
                        <Label>Technology Stack</Label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {techStackOptions.map((tech) => (
                            <div
                              key={tech.id}
                              className="flex items-center space-x-2 p-3 border border-border rounded-lg hover:bg-muted/50 cursor-pointer"
                              onClick={() => handleTechStackToggle(tech.id)}
                            >
                              <Checkbox
                                checked={projectConfig.techStack.includes(tech.id)}
                                onChange={() => handleTechStackToggle(tech.id)}
                              />
                              <tech.icon className="h-4 w-4" />
                              <span className="text-sm">{tech.label}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </TabsContent>

                    {/* Step 2: Repository Setup */}
                    <TabsContent value="2" className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="repo-name">Repository Name</Label>
                          <Input
                            id="repo-name"
                            placeholder="my-awesome-project"
                            value={projectConfig.repository.name}
                            onChange={(e) => setProjectConfig(prev => ({
                              ...prev,
                              repository: { ...prev.repository, name: e.target.value }
                            }))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="visibility">Visibility</Label>
                          <Select
                            value={projectConfig.repository.visibility}
                            onValueChange={(value: 'private' | 'public') => setProjectConfig(prev => ({
                              ...prev,
                              repository: { ...prev.repository, visibility: value }
                            }))}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="private">Private</SelectItem>
                              <SelectItem value="public">Public</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <Label>Project Template</Label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {templateOptions.map((template) => (
                            <div
                              key={template.id}
                              className={`p-4 border rounded-lg cursor-pointer transition-all ${
                                projectConfig.repository.template === template.id
                                  ? 'border-primary bg-primary/5'
                                  : 'border-border hover:border-primary/50'
                              }`}
                              onClick={() => setProjectConfig(prev => ({
                                ...prev,
                                repository: { ...prev.repository, template: template.id }
                              }))}
                            >
                              <div className="flex items-center space-x-2 mb-2">
                                <GitBranch className="h-4 w-4" />
                                <span className="font-medium">{template.label}</span>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {template.description}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </TabsContent>

                    {/* Step 3: Infrastructure */}
                    <TabsContent value="3" className="space-y-6">
                      <div className="space-y-4">
                        <Label>Infrastructure Provider</Label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {infrastructureProviders.map((provider) => (
                            <div
                              key={provider.id}
                              className={`p-4 border rounded-lg cursor-pointer transition-all ${
                                projectConfig.infrastructure.provider === provider.id
                                  ? 'border-primary bg-primary/5'
                                  : 'border-border hover:border-primary/50'
                              }`}
                              onClick={() => setProjectConfig(prev => ({
                                ...prev,
                                infrastructure: { ...prev.infrastructure, provider: provider.id }
                              }))}
                            >
                              <div className="flex items-center space-x-2 mb-2">
                                <Cloud className="h-4 w-4" />
                                <span className="font-medium">{provider.label}</span>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {provider.description}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="region">Region</Label>
                          <Select
                            value={projectConfig.infrastructure.region}
                            onValueChange={(value) => setProjectConfig(prev => ({
                              ...prev,
                              infrastructure: { ...prev.infrastructure, region: value }
                            }))}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="us-east-1">US East (N. Virginia)</SelectItem>
                              <SelectItem value="us-west-2">US West (Oregon)</SelectItem>
                              <SelectItem value="eu-west-1">Europe (Ireland)</SelectItem>
                              <SelectItem value="ap-southeast-1">Asia Pacific (Singapore)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="tier">Tier</Label>
                          <Select
                            value={projectConfig.infrastructure.tier}
                            onValueChange={(value) => setProjectConfig(prev => ({
                              ...prev,
                              infrastructure: { ...prev.infrastructure, tier: value }
                            }))}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="starter">Starter</SelectItem>
                              <SelectItem value="professional">Professional</SelectItem>
                              <SelectItem value="enterprise">Enterprise</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </TabsContent>

                    {/* Step 4: Client Portal */}
                    <TabsContent value="4" className="space-y-6">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="enable-portal"
                          checked={projectConfig.clientPortal.enabled}
                          onCheckedChange={(checked) => setProjectConfig(prev => ({
                            ...prev,
                            clientPortal: { ...prev.clientPortal, enabled: checked as boolean }
                          }))}
                        />
                        <Label htmlFor="enable-portal">Enable Client Portal</Label>
                      </div>

                      {projectConfig.clientPortal.enabled && (
                        <div className="space-y-6">
                          <div className="space-y-4">
                            <Label>Portal Features</Label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {[
                                { id: "dashboard", label: "Project Dashboard", icon: BarChart3 },
                                { id: "progress", label: "Progress Tracking", icon: Activity },
                                { id: "communication", label: "Communication Hub", icon: MessageSquare },
                                { id: "documents", label: "Document Sharing", icon: FileText },
                                { id: "billing", label: "Billing & Invoicing", icon: CreditCard },
                                { id: "support", label: "Support Tickets", icon: Headphones }
                              ].map((feature) => (
                                <div
                                  key={feature.id}
                                  className="flex items-center space-x-2 p-3 border border-border rounded-lg hover:bg-muted/50 cursor-pointer"
                                  onClick={() => {
                                    const features = projectConfig.clientPortal.features;
                                    const newFeatures = features.includes(feature.id)
                                      ? features.filter(f => f !== feature.id)
                                      : [...features, feature.id];
                                    setProjectConfig(prev => ({
                                      ...prev,
                                      clientPortal: { ...prev.clientPortal, features: newFeatures }
                                    }));
                                  }}
                                >
                                  <Checkbox
                                    checked={projectConfig.clientPortal.features.includes(feature.id)}
                                    onChange={() => {}}
                                  />
                                  <feature.icon className="h-4 w-4" />
                                  <span className="text-sm">{feature.label}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="primary-color">Primary Color</Label>
                              <Input
                                id="primary-color"
                                type="color"
                                value={projectConfig.clientPortal.branding.primaryColor}
                                onChange={(e) => setProjectConfig(prev => ({
                                  ...prev,
                                  clientPortal: {
                                    ...prev.clientPortal,
                                    branding: {
                                      ...prev.clientPortal.branding,
                                      primaryColor: e.target.value
                                    }
                                  }
                                }))}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="secondary-color">Secondary Color</Label>
                              <Input
                                id="secondary-color"
                                type="color"
                                value={projectConfig.clientPortal.branding.secondaryColor}
                                onChange={(e) => setProjectConfig(prev => ({
                                  ...prev,
                                  clientPortal: {
                                    ...prev.clientPortal,
                                    branding: {
                                      ...prev.clientPortal.branding,
                                      secondaryColor: e.target.value
                                    }
                                  }
                                }))}
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </TabsContent>

                    {/* Step 5: Review & Deploy */}
                    <TabsContent value="5" className="space-y-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Configuration Summary</h3>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Project Name:</span>
                            <span className="font-medium">{projectConfig.name || "Not specified"}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Environment:</span>
                            <span className="font-medium capitalize">{projectConfig.environment}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Repository:</span>
                            <span className="font-medium">{projectConfig.repository.name || "Not specified"}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Template:</span>
                            <span className="font-medium">{projectConfig.repository.template}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Infrastructure:</span>
                            <span className="font-medium">{projectConfig.infrastructure.provider}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Client Portal:</span>
                            <span className="font-medium">
                              {projectConfig.clientPortal.enabled ? "Enabled" : "Disabled"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {isProvisioning && (
                        <div className="space-y-4">
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4 animate-spin" />
                            <span className="text-sm font-medium">Provisioning your project...</span>
                          </div>
                          <Progress value={provisioningProgress} className="w-full" />
                          <p className="text-sm text-muted-foreground">
                            {provisioningProgress}% complete
                          </p>
                        </div>
                      )}

                      {provisioningProgress === 100 && (
                        <div className="space-y-4">
                          <div className="flex items-center space-x-2 text-green-600">
                            <CheckCircle className="h-5 w-5" />
                            <span className="font-medium">Project provisioned successfully!</span>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Button className="w-full">
                              <ExternalLink className="h-4 w-4 mr-2" />
                              View Repository
                            </Button>
                            <Button variant="outline" className="w-full">
                              <Globe className="h-4 w-4 mr-2" />
                              Open Client Portal
                            </Button>
                          </div>
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Zap className="h-5 w-5 mr-2" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => setCurrentStep(1)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    New Project
                  </Button>
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => setCurrentStep(2)}
                  >
                    <GitBranch className="h-4 w-4 mr-2" />
                    Clone Repository
                  </Button>
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => setCurrentStep(3)}
                  >
                    <Server className="h-4 w-4 mr-2" />
                    Deploy Infrastructure
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Project Status */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Activity className="h-5 w-5 mr-2" />
                    Project Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Repository</span>
                      <Badge variant="outline">Pending</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Infrastructure</span>
                      <Badge variant="outline">Pending</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Client Portal</span>
                      <Badge variant="outline">Pending</Badge>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Total Cost</span>
                      <span className="text-sm font-mono">$0.00/month</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Estimated Time</span>
                      <span className="text-sm">2-5 minutes</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Navigation */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card>
                <CardContent className="p-4">
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                      disabled={currentStep === 1}
                      className="flex-1"
                    >
                      Previous
                    </Button>
                    {currentStep < 5 ? (
                      <Button
                        onClick={() => setCurrentStep(Math.min(5, currentStep + 1))}
                        className="flex-1"
                      >
                        Next
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    ) : (
                      <Button
                        onClick={handleProvision}
                        disabled={isProvisioning || !projectConfig.name}
                        className="flex-1"
                      >
                        {isProvisioning ? (
                          <>
                            <Clock className="h-4 w-4 mr-2 animate-spin" />
                            Provisioning...
                          </>
                        ) : (
                          <>
                            <Zap className="h-4 w-4 mr-2" />
                            Deploy Project
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}