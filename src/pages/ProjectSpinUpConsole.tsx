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
  Headphones,
  Sparkles,
  Rocket,
  Layers,
  Palette,
  Shield,
  Monitor,
  Cpu
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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-3"
          >
            <div className="relative">
              <Bot className="h-8 w-8 text-primary" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full animate-pulse" />
            </div>
            <div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                OpsCrew.ai
              </span>
              <Badge variant="secondary" className="ml-3 bg-primary/10 text-primary border-primary/20">
                <Sparkles className="h-3 w-3 mr-1" />
                Project Spin-Up
              </Badge>
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-4"
          >
            <Button 
              variant="outline" 
              onClick={() => window.history.back()}
              className="hover:scale-105 transition-all duration-200"
            >
              Back to Dashboard
            </Button>
          </motion.div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Progress Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent mb-2">
                Project Spin-Up Console
              </h1>
              <p className="text-lg text-muted-foreground">
                Automate your project setup with AI-powered provisioning
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground mb-1">Progress</div>
              <div className="text-2xl font-bold text-primary">
                {currentStep} / {steps.length}
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute top-4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <motion.div 
                  key={step.id} 
                  className="flex flex-col items-center relative z-10"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <motion.div 
                    className={`
                      flex items-center justify-center w-12 h-12 rounded-full text-sm font-semibold
                      transition-all duration-300 hover:scale-110
                      ${currentStep >= step.id 
                        ? 'bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/25' 
                        : 'bg-card border-2 border-border text-muted-foreground hover:border-primary/50'
                      }
                    `}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {currentStep > step.id ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      step.id
                    )}
                  </motion.div>
                  <div className="mt-3 text-center">
                    <div className="text-sm font-semibold text-foreground">{step.title}</div>
                    <div className="text-xs text-muted-foreground mt-1 max-w-24">{step.description}</div>
                  </div>
                </motion.div>
              ))}
            </div>
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
              <Card className="border-border/50 shadow-xl shadow-primary/5 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300">
                <CardHeader className="bg-gradient-to-r from-card to-card/50 border-b border-border/50">
                  <CardTitle className="flex items-center text-xl">
                    <div className="p-2 rounded-lg bg-primary/10 mr-3">
                      <Settings className="h-5 w-5 text-primary" />
                    </div>
                    Project Configuration
                  </CardTitle>
                  <CardDescription className="text-base">
                    Configure your project settings and infrastructure with AI-powered recommendations
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-8">
                  <Tabs value={currentStep.toString()} className="w-full">
                    <TabsList className="grid w-full grid-cols-5 bg-muted/50 p-1 rounded-lg">
                      {steps.map((step) => (
                        <TabsTrigger 
                          key={step.id} 
                          value={step.id.toString()}
                          onClick={() => setCurrentStep(step.id)}
                          disabled={currentStep < step.id}
                          className="data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all duration-200 hover:scale-105"
                        >
                          {step.title}
                        </TabsTrigger>
                      ))}
                    </TabsList>

                    {/* Step 1: Project Details */}
                    <TabsContent value="1" className="space-y-8 mt-8">
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-6"
                      >
                        <div className="space-y-3">
                          <Label htmlFor="project-name" className="text-sm font-semibold flex items-center">
                            <Rocket className="h-4 w-4 mr-2 text-primary" />
                            Project Name
                          </Label>
                          <Input
                            id="project-name"
                            placeholder="Enter your project name"
                            value={projectConfig.name}
                            onChange={(e) => setProjectConfig(prev => ({
                              ...prev,
                              name: e.target.value
                            }))}
                            className="h-12 text-base focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                          />
                        </div>
                        <div className="space-y-3">
                          <Label htmlFor="environment" className="text-sm font-semibold flex items-center">
                            <Layers className="h-4 w-4 mr-2 text-primary" />
                            Environment
                          </Label>
                          <Select
                            value={projectConfig.environment}
                            onValueChange={(value) => setProjectConfig(prev => ({
                              ...prev,
                              environment: value
                            }))}
                          >
                            <SelectTrigger className="h-12 text-base">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="development">Development</SelectItem>
                              <SelectItem value="staging">Staging</SelectItem>
                              <SelectItem value="production">Production</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </motion.div>

                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="space-y-3"
                      >
                        <Label htmlFor="description" className="text-sm font-semibold flex items-center">
                          <FileText className="h-4 w-4 mr-2 text-primary" />
                          Project Description
                        </Label>
                        <Textarea
                          id="description"
                          placeholder="Describe your project goals, features, and requirements..."
                          value={projectConfig.description}
                          onChange={(e) => setProjectConfig(prev => ({
                            ...prev,
                            description: e.target.value
                          }))}
                          className="min-h-24 text-base focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                        />
                      </motion.div>

                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="space-y-6"
                      >
                        <Label className="text-sm font-semibold flex items-center">
                          <Code className="h-4 w-4 mr-2 text-primary" />
                          Technology Stack
                        </Label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {techStackOptions.map((tech) => (
                            <motion.div
                              key={tech.id}
                              className={`
                                flex items-center space-x-3 p-4 border rounded-xl cursor-pointer transition-all duration-200
                                hover:scale-105 hover:shadow-md group
                                ${projectConfig.techStack.includes(tech.id)
                                  ? 'border-primary bg-primary/5 shadow-sm'
                                  : 'border-border hover:border-primary/50 hover:bg-muted/30'
                                }
                              `}
                              onClick={() => handleTechStackToggle(tech.id)}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <Checkbox
                                checked={projectConfig.techStack.includes(tech.id)}
                                onChange={() => handleTechStackToggle(tech.id)}
                                className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                              />
                              <tech.icon className={`h-5 w-5 transition-colors ${
                                projectConfig.techStack.includes(tech.id) 
                                  ? 'text-primary' 
                                  : 'text-muted-foreground group-hover:text-foreground'
                              }`} />
                              <span className="text-sm font-medium">{tech.label}</span>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    </TabsContent>

                    {/* Step 2: Repository Setup */}
                    <TabsContent value="2" className="space-y-8 mt-8">
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-6"
                      >
                        <div className="space-y-3">
                          <Label htmlFor="repo-name" className="text-sm font-semibold flex items-center">
                            <GitBranch className="h-4 w-4 mr-2 text-primary" />
                            Repository Name
                          </Label>
                          <Input
                            id="repo-name"
                            placeholder="my-awesome-project"
                            value={projectConfig.repository.name}
                            onChange={(e) => setProjectConfig(prev => ({
                              ...prev,
                              repository: { ...prev.repository, name: e.target.value }
                            }))}
                            className="h-12 text-base focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                          />
                        </div>
                        <div className="space-y-3">
                          <Label htmlFor="visibility" className="text-sm font-semibold flex items-center">
                            <Shield className="h-4 w-4 mr-2 text-primary" />
                            Visibility
                          </Label>
                          <Select
                            value={projectConfig.repository.visibility}
                            onValueChange={(value: 'private' | 'public') => setProjectConfig(prev => ({
                              ...prev,
                              repository: { ...prev.repository, visibility: value }
                            }))}
                          >
                            <SelectTrigger className="h-12 text-base">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="private">Private</SelectItem>
                              <SelectItem value="public">Public</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </motion.div>

                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="space-y-6"
                      >
                        <Label className="text-sm font-semibold flex items-center">
                          <Layers className="h-4 w-4 mr-2 text-primary" />
                          Project Template
                        </Label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {templateOptions.map((template) => (
                            <motion.div
                              key={template.id}
                              className={`
                                p-6 border rounded-xl cursor-pointer transition-all duration-200
                                hover:scale-105 hover:shadow-lg group
                                ${projectConfig.repository.template === template.id
                                  ? 'border-primary bg-primary/5 shadow-md'
                                  : 'border-border hover:border-primary/50 hover:bg-muted/30'
                                }
                              `}
                              onClick={() => setProjectConfig(prev => ({
                                ...prev,
                                repository: { ...prev.repository, template: template.id }
                              }))}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <div className="flex items-center space-x-3 mb-3">
                                <div className={`p-2 rounded-lg ${
                                  projectConfig.repository.template === template.id
                                    ? 'bg-primary/10'
                                    : 'bg-muted group-hover:bg-primary/5'
                                }`}>
                                  <GitBranch className={`h-4 w-4 ${
                                    projectConfig.repository.template === template.id
                                      ? 'text-primary'
                                      : 'text-muted-foreground group-hover:text-primary'
                                  }`} />
                                </div>
                                <span className="font-semibold text-base">{template.label}</span>
                              </div>
                              <p className="text-sm text-muted-foreground leading-relaxed">
                                {template.description}
                              </p>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    </TabsContent>

                    {/* Step 3: Infrastructure */}
                    <TabsContent value="3" className="space-y-8 mt-8">
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="space-y-6"
                      >
                        <Label className="text-sm font-semibold flex items-center">
                          <Cloud className="h-4 w-4 mr-2 text-primary" />
                          Infrastructure Provider
                        </Label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {infrastructureProviders.map((provider) => (
                            <motion.div
                              key={provider.id}
                              className={`
                                p-6 border rounded-xl cursor-pointer transition-all duration-200
                                hover:scale-105 hover:shadow-lg group
                                ${projectConfig.infrastructure.provider === provider.id
                                  ? 'border-primary bg-primary/5 shadow-md'
                                  : 'border-border hover:border-primary/50 hover:bg-muted/30'
                                }
                              `}
                              onClick={() => setProjectConfig(prev => ({
                                ...prev,
                                infrastructure: { ...prev.infrastructure, provider: provider.id }
                              }))}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <div className="flex items-center space-x-3 mb-3">
                                <div className={`p-2 rounded-lg ${
                                  projectConfig.infrastructure.provider === provider.id
                                    ? 'bg-primary/10'
                                    : 'bg-muted group-hover:bg-primary/5'
                                }`}>
                                  <Cloud className={`h-4 w-4 ${
                                    projectConfig.infrastructure.provider === provider.id
                                      ? 'text-primary'
                                      : 'text-muted-foreground group-hover:text-primary'
                                  }`} />
                                </div>
                                <span className="font-semibold text-base">{provider.label}</span>
                              </div>
                              <p className="text-sm text-muted-foreground leading-relaxed">
                                {provider.description}
                              </p>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>

                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-6"
                      >
                        <div className="space-y-3">
                          <Label htmlFor="region" className="text-sm font-semibold flex items-center">
                            <Globe className="h-4 w-4 mr-2 text-primary" />
                            Region
                          </Label>
                          <Select
                            value={projectConfig.infrastructure.region}
                            onValueChange={(value) => setProjectConfig(prev => ({
                              ...prev,
                              infrastructure: { ...prev.infrastructure, region: value }
                            }))}
                          >
                            <SelectTrigger className="h-12 text-base">
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
                        <div className="space-y-3">
                          <Label htmlFor="tier" className="text-sm font-semibold flex items-center">
                            <Cpu className="h-4 w-4 mr-2 text-primary" />
                            Tier
                          </Label>
                          <Select
                            value={projectConfig.infrastructure.tier}
                            onValueChange={(value) => setProjectConfig(prev => ({
                              ...prev,
                              infrastructure: { ...prev.infrastructure, tier: value }
                            }))}
                          >
                            <SelectTrigger className="h-12 text-base">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="starter">Starter</SelectItem>
                              <SelectItem value="professional">Professional</SelectItem>
                              <SelectItem value="enterprise">Enterprise</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </motion.div>
                    </TabsContent>

                    {/* Step 4: Client Portal */}
                    <TabsContent value="4" className="space-y-8 mt-8">
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="flex items-center space-x-3 p-4 bg-muted/30 rounded-xl"
                      >
                        <Checkbox
                          id="enable-portal"
                          checked={projectConfig.clientPortal.enabled}
                          onCheckedChange={(checked) => setProjectConfig(prev => ({
                            ...prev,
                            clientPortal: { ...prev.clientPortal, enabled: checked as boolean }
                          }))}
                          className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                        />
                        <Label htmlFor="enable-portal" className="text-base font-semibold flex items-center">
                          <Monitor className="h-4 w-4 mr-2 text-primary" />
                          Enable Client Portal
                        </Label>
                      </motion.div>

                      {projectConfig.clientPortal.enabled && (
                        <motion.div 
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                          className="space-y-8"
                        >
                          <div className="space-y-6">
                            <Label className="text-sm font-semibold flex items-center">
                              <Zap className="h-4 w-4 mr-2 text-primary" />
                              Portal Features
                            </Label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {[
                                { id: "dashboard", label: "Project Dashboard", icon: BarChart3 },
                                { id: "progress", label: "Progress Tracking", icon: Activity },
                                { id: "communication", label: "Communication Hub", icon: MessageSquare },
                                { id: "documents", label: "Document Sharing", icon: FileText },
                                { id: "billing", label: "Billing & Invoicing", icon: CreditCard },
                                { id: "support", label: "Support Tickets", icon: Headphones }
                              ].map((feature) => (
                                <motion.div
                                  key={feature.id}
                                  className={`
                                    flex items-center space-x-3 p-4 border rounded-xl cursor-pointer transition-all duration-200
                                    hover:scale-105 hover:shadow-md group
                                    ${projectConfig.clientPortal.features.includes(feature.id)
                                      ? 'border-primary bg-primary/5 shadow-sm'
                                      : 'border-border hover:border-primary/50 hover:bg-muted/30'
                                    }
                                  `}
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
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                >
                                  <Checkbox
                                    checked={projectConfig.clientPortal.features.includes(feature.id)}
                                    onChange={() => {}}
                                    className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                                  />
                                  <feature.icon className={`h-5 w-5 transition-colors ${
                                    projectConfig.clientPortal.features.includes(feature.id) 
                                      ? 'text-primary' 
                                      : 'text-muted-foreground group-hover:text-foreground'
                                  }`} />
                                  <span className="text-sm font-medium">{feature.label}</span>
                                </motion.div>
                              ))}
                            </div>
                          </div>

                          <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="space-y-6"
                          >
                            <Label className="text-sm font-semibold flex items-center">
                              <Palette className="h-4 w-4 mr-2 text-primary" />
                              Branding Colors
                            </Label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="space-y-3">
                                <Label htmlFor="primary-color" className="text-sm font-medium">Primary Color</Label>
                                <div className="flex items-center space-x-3">
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
                                    className="w-16 h-12 p-1 border-2 border-border rounded-lg cursor-pointer hover:border-primary/50 transition-colors"
                                  />
                                  <div className="flex-1">
                                    <Input
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
                                      className="h-12 text-base font-mono"
                                      placeholder="#3B82F6"
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="space-y-3">
                                <Label htmlFor="secondary-color" className="text-sm font-medium">Secondary Color</Label>
                                <div className="flex items-center space-x-3">
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
                                    className="w-16 h-12 p-1 border-2 border-border rounded-lg cursor-pointer hover:border-primary/50 transition-colors"
                                  />
                                  <div className="flex-1">
                                    <Input
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
                                      className="h-12 text-base font-mono"
                                      placeholder="#1E40AF"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        </motion.div>
                      )}
                    </TabsContent>

                    {/* Step 5: Review & Deploy */}
                    <TabsContent value="5" className="space-y-8 mt-8">
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="space-y-6"
                      >
                        <h3 className="text-xl font-bold flex items-center">
                          <CheckCircle className="h-5 w-5 mr-2 text-primary" />
                          Configuration Summary
                        </h3>
                        <div className="bg-muted/30 rounded-xl p-6 space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex justify-between items-center py-2 border-b border-border/50">
                              <span className="text-muted-foreground font-medium">Project Name:</span>
                              <span className="font-semibold text-foreground">{projectConfig.name || "Not specified"}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-border/50">
                              <span className="text-muted-foreground font-medium">Environment:</span>
                              <Badge variant="outline" className="capitalize">{projectConfig.environment}</Badge>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-border/50">
                              <span className="text-muted-foreground font-medium">Repository:</span>
                              <span className="font-semibold text-foreground">{projectConfig.repository.name || "Not specified"}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-border/50">
                              <span className="text-muted-foreground font-medium">Template:</span>
                              <Badge variant="secondary">{projectConfig.repository.template}</Badge>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-border/50">
                              <span className="text-muted-foreground font-medium">Infrastructure:</span>
                              <Badge variant="outline">{projectConfig.infrastructure.provider}</Badge>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-border/50">
                              <span className="text-muted-foreground font-medium">Client Portal:</span>
                              <Badge variant={projectConfig.clientPortal.enabled ? "default" : "secondary"}>
                                {projectConfig.clientPortal.enabled ? "Enabled" : "Disabled"}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </motion.div>

                      {isProvisioning && (
                        <motion.div 
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                          className="space-y-6 bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl p-6 border border-primary/20"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="p-2 rounded-lg bg-primary/10">
                              <Clock className="h-5 w-5 animate-spin text-primary" />
                            </div>
                            <div>
                              <span className="text-lg font-semibold">Provisioning your project...</span>
                              <p className="text-sm text-muted-foreground">This may take a few minutes</p>
                            </div>
                          </div>
                          <div className="space-y-3">
                            <Progress value={provisioningProgress} className="w-full h-3" />
                            <div className="flex justify-between items-center">
                              <p className="text-sm text-muted-foreground">
                                {provisioningProgress}% complete
                              </p>
                              <span className="text-sm font-mono text-primary">
                                {Math.round(provisioningProgress)}%
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {provisioningProgress === 100 && (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                          className="space-y-6 bg-gradient-to-r from-green-500/10 to-green-600/10 rounded-xl p-6 border border-green-500/20"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="p-2 rounded-lg bg-green-500/10">
                              <CheckCircle className="h-6 w-6 text-green-600" />
                            </div>
                            <div>
                              <span className="text-lg font-bold text-green-600">Project provisioned successfully!</span>
                              <p className="text-sm text-muted-foreground">Your project is ready to use</p>
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Button className="w-full h-12 text-base hover:scale-105 transition-all duration-200">
                              <ExternalLink className="h-5 w-5 mr-2" />
                              View Repository
                            </Button>
                            <Button variant="outline" className="w-full h-12 text-base hover:scale-105 transition-all duration-200">
                              <Globe className="h-5 w-5 mr-2" />
                              Open Client Portal
                            </Button>
                          </div>
                        </motion.div>
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
              <Card className="border-border/50 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader className="bg-gradient-to-r from-card to-card/50 border-b border-border/50">
                  <CardTitle className="flex items-center text-lg">
                    <div className="p-2 rounded-lg bg-primary/10 mr-3">
                      <Zap className="h-5 w-5 text-primary" />
                    </div>
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-3">
                  <Button 
                    className="w-full justify-start h-12 text-base hover:scale-105 transition-all duration-200" 
                    variant="outline"
                    onClick={() => setCurrentStep(1)}
                  >
                    <Plus className="h-4 w-4 mr-3" />
                    New Project
                  </Button>
                  <Button 
                    className="w-full justify-start h-12 text-base hover:scale-105 transition-all duration-200" 
                    variant="outline"
                    onClick={() => setCurrentStep(2)}
                  >
                    <GitBranch className="h-4 w-4 mr-3" />
                    Clone Repository
                  </Button>
                  <Button 
                    className="w-full justify-start h-12 text-base hover:scale-105 transition-all duration-200" 
                    variant="outline"
                    onClick={() => setCurrentStep(3)}
                  >
                    <Server className="h-4 w-4 mr-3" />
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
              <Card className="border-border/50 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader className="bg-gradient-to-r from-card to-card/50 border-b border-border/50">
                  <CardTitle className="flex items-center text-lg">
                    <div className="p-2 rounded-lg bg-primary/10 mr-3">
                      <Activity className="h-5 w-5 text-primary" />
                    </div>
                    Project Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-2">
                      <span className="text-sm font-medium flex items-center">
                        <GitBranch className="h-4 w-4 mr-2 text-muted-foreground" />
                        Repository
                      </span>
                      <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">
                        Pending
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="text-sm font-medium flex items-center">
                        <Server className="h-4 w-4 mr-2 text-muted-foreground" />
                        Infrastructure
                      </span>
                      <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">
                        Pending
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="text-sm font-medium flex items-center">
                        <Monitor className="h-4 w-4 mr-2 text-muted-foreground" />
                        Client Portal
                      </span>
                      <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">
                        Pending
                      </Badge>
                    </div>
                  </div>
                  
                  <Separator className="bg-border/50" />
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-2">
                      <span className="text-sm font-semibold flex items-center">
                        <CreditCard className="h-4 w-4 mr-2 text-muted-foreground" />
                        Total Cost
                      </span>
                      <span className="text-lg font-mono font-bold text-primary">$0.00/month</span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="text-sm font-semibold flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                        Estimated Time
                      </span>
                      <span className="text-sm font-medium">2-5 minutes</span>
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
              <Card className="border-border/50 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex space-x-3">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                      disabled={currentStep === 1}
                      className="flex-1 h-12 text-base hover:scale-105 transition-all duration-200"
                    >
                      Previous
                    </Button>
                    {currentStep < 5 ? (
                      <Button
                        onClick={() => setCurrentStep(Math.min(5, currentStep + 1))}
                        className="flex-1 h-12 text-base hover:scale-105 transition-all duration-200"
                      >
                        Next
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    ) : (
                      <Button
                        onClick={handleProvision}
                        disabled={isProvisioning || !projectConfig.name}
                        className="flex-1 h-12 text-base hover:scale-105 transition-all duration-200 disabled:hover:scale-100"
                      >
                        {isProvisioning ? (
                          <>
                            <Clock className="h-4 w-4 mr-2 animate-spin" />
                            Provisioning...
                          </>
                        ) : (
                          <>
                            <Rocket className="h-4 w-4 mr-2" />
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