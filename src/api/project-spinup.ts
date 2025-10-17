import apiClient from './client';
import type { 
  ProjectConfig, 
  CreateProjectSetupInput, 
  ProjectSetup, 
  ProvisioningStatus,
  ProjectTemplate,
  TechStackOption,
  InfrastructureProvider
} from '@/types';

// Project Spin-Up API endpoints
export const projectSpinUpApi = {
  // Get available project templates
  getTemplates: async (): Promise<ProjectTemplate[]> => {
    const response = await apiClient.get('/project-spinup/templates');
    return response.data;
  },

  // Get tech stack options
  getTechStackOptions: async (): Promise<TechStackOption[]> => {
    const response = await apiClient.get('/project-spinup/tech-stack');
    return response.data;
  },

  // Get infrastructure providers
  getInfrastructureProviders: async (): Promise<InfrastructureProvider[]> => {
    const response = await apiClient.get('/project-spinup/infrastructure-providers');
    return response.data;
  },

  // Create project setup
  createProjectSetup: async (input: CreateProjectSetupInput): Promise<ProjectSetup> => {
    const response = await apiClient.post('/project-spinup/setup', input);
    return response.data;
  },

  // Start project provisioning
  startProvisioning: async (setupId: string): Promise<ProvisioningStatus> => {
    const response = await apiClient.post(`/project-spinup/setup/${setupId}/provision`);
    return response.data;
  },

  // Get provisioning status
  getProvisioningStatus: async (setupId: string): Promise<ProvisioningStatus> => {
    const response = await apiClient.get(`/project-spinup/setup/${setupId}/status`);
    return response.data;
  },

  // Cancel provisioning
  cancelProvisioning: async (setupId: string): Promise<void> => {
    await apiClient.post(`/project-spinup/setup/${setupId}/cancel`);
  },

  // Get project setup by ID
  getProjectSetup: async (setupId: string): Promise<ProjectSetup> => {
    const response = await apiClient.get(`/project-spinup/setup/${setupId}`);
    return response.data;
  },

  // Update project setup
  updateProjectSetup: async (setupId: string, updates: Partial<CreateProjectSetupInput>): Promise<ProjectSetup> => {
    const response = await apiClient.patch(`/project-spinup/setup/${setupId}`, updates);
    return response.data;
  },

  // Delete project setup
  deleteProjectSetup: async (setupId: string): Promise<void> => {
    await apiClient.delete(`/project-spinup/setup/${setupId}`);
  },

  // Get setup logs
  getSetupLogs: async (setupId: string, stepId?: string): Promise<string[]> => {
    const url = stepId 
      ? `/project-spinup/setup/${setupId}/logs?step=${stepId}`
      : `/project-spinup/setup/${setupId}/logs`;
    const response = await apiClient.get(url);
    return response.data;
  },

  // Validate project configuration
  validateConfig: async (config: ProjectConfig): Promise<{ valid: boolean; errors: Record<string, string> }> => {
    const response = await apiClient.post('/project-spinup/validate', config);
    return response.data;
  },

  // Get cost estimation
  getCostEstimation: async (config: ProjectConfig): Promise<{ monthly: number; setup: number; currency: string }> => {
    const response = await apiClient.post('/project-spinup/cost-estimation', config);
    return response.data;
  },

  // Get deployment URLs
  getDeploymentUrls: async (setupId: string): Promise<{ repository: string; environments: Record<string, string>; clientPortal?: string }> => {
    const response = await apiClient.get(`/project-spinup/setup/${setupId}/urls`);
    return response.data;
  }
};

// Mock data for development/testing
export const mockProjectSpinUpData = {
  templates: [
    {
      id: "nextjs",
      name: "Next.js Full-Stack",
      description: "React, TypeScript, Tailwind CSS, Prisma",
      category: "web_app" as const,
      tech_stack: ["react", "nextjs", "typescript", "tailwind", "postgresql"],
      features: ["authentication", "database", "api", "ui_components"],
      repository_template: "nextjs-template",
      ci_cd_template: "nextjs-cicd",
      environment_config: {
        node_version: "18",
        build_command: "npm run build",
        start_command: "npm start"
      },
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: "react-spa",
      name: "React SPA",
      description: "React, TypeScript, Vite, React Router",
      category: "web_app" as const,
      tech_stack: ["react", "typescript", "vite", "react-router"],
      features: ["routing", "state_management", "ui_components"],
      repository_template: "react-spa-template",
      ci_cd_template: "react-cicd",
      environment_config: {
        node_version: "18",
        build_command: "npm run build",
        start_command: "npm run preview"
      },
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: "node-api",
      name: "Node.js API",
      description: "Express, TypeScript, PostgreSQL, JWT",
      category: "api" as const,
      tech_stack: ["nodejs", "typescript", "express", "postgresql"],
      features: ["authentication", "database", "api_docs", "validation"],
      repository_template: "node-api-template",
      ci_cd_template: "node-cicd",
      environment_config: {
        node_version: "18",
        build_command: "npm run build",
        start_command: "npm start"
      },
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: "fullstack",
      name: "Full-Stack App",
      description: "Next.js, Prisma, NextAuth, Stripe",
      category: "web_app" as const,
      tech_stack: ["nextjs", "typescript", "prisma", "nextauth", "stripe"],
      features: ["authentication", "database", "payments", "admin_panel"],
      repository_template: "fullstack-template",
      ci_cd_template: "fullstack-cicd",
      environment_config: {
        node_version: "18",
        build_command: "npm run build",
        start_command: "npm start"
      },
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ] as ProjectTemplate[],

  techStackOptions: [
    { id: "react", label: "React", icon: null, category: "frontend" as const },
    { id: "nextjs", label: "Next.js", icon: null, category: "frontend" as const },
    { id: "nodejs", label: "Node.js", icon: null, category: "backend" as const },
    { id: "typescript", label: "TypeScript", icon: null, category: "tools" as const },
    { id: "tailwind", label: "Tailwind CSS", icon: null, category: "frontend" as const },
    { id: "postgresql", label: "PostgreSQL", icon: null, category: "database" as const },
    { id: "redis", label: "Redis", icon: null, category: "database" as const },
    { id: "docker", label: "Docker", icon: null, category: "infrastructure" as const },
    { id: "aws", label: "AWS", icon: null, category: "infrastructure" as const },
    { id: "vercel", label: "Vercel", icon: null, category: "infrastructure" as const }
  ] as TechStackOption[],

  infrastructureProviders: [
    {
      id: "vercel",
      label: "Vercel",
      description: "Frontend & API hosting",
      pricing: { starter: 0, professional: 20, enterprise: 400 },
      features: ["automatic_deployments", "edge_functions", "analytics"]
    },
    {
      id: "aws",
      label: "AWS",
      description: "Full cloud infrastructure",
      pricing: { starter: 25, professional: 100, enterprise: 500 },
      features: ["scalable", "enterprise_grade", "global_cdn"]
    },
    {
      id: "digitalocean",
      label: "DigitalOcean",
      description: "Simple cloud hosting",
      pricing: { starter: 5, professional: 20, enterprise: 100 },
      features: ["simple_pricing", "developer_friendly", "managed_databases"]
    },
    {
      id: "railway",
      label: "Railway",
      description: "Developer-friendly platform",
      pricing: { starter: 5, professional: 20, enterprise: 100 },
      features: ["git_deploy", "automatic_ssl", "database_provisioning"]
    }
  ] as InfrastructureProvider[]
};