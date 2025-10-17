// User types
export interface User {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  role: "admin" | "user" | "viewer";
  email_verified: boolean;
  two_factor_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface UpdateUserInput {
  id: string;
  full_name?: string;
  avatar_url?: string;
}

// Project types
export interface Project {
  id: string;
  name: string;
  description: string;
  status: "draft" | "active" | "completed" | "archived";
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface CreateProjectInput {
  name: string;
  description: string;
  user_id: string;
}

export interface UpdateProjectInput {
  id: string;
  name?: string;
  description?: string;
  status?: "draft" | "active" | "completed" | "archived";
}

// Auth types
export interface AuthResponse {
  user: User;
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
}

export interface SignInInput {
  email: string;
  password: string;
  remember_me?: boolean;
}

export interface SignUpInput {
  email: string;
  password: string;
  full_name: string;
  confirm_password: string;
  terms_accepted: boolean;
}

export interface OAuthProvider {
  id: string;
  name: string;
  icon: string;
  color: string;
  url: string;
}

export interface OAuthSignInInput {
  provider: 'google' | 'github' | 'microsoft';
  code: string;
  state?: string;
}

export interface RefreshTokenInput {
  refresh_token: string;
}

export interface ForgotPasswordInput {
  email: string;
}

export interface ResetPasswordInput {
  token: string;
  password: string;
  confirm_password: string;
}

export interface VerifyEmailInput {
  token: string;
}

export interface ResendVerificationInput {
  email: string;
}

export interface TwoFactorSetup {
  secret: string;
  qr_code: string;
  backup_codes: string[];
}

export interface TwoFactorVerifyInput {
  code: string;
  backup_code?: string;
}

export interface TwoFactorDisableInput {
  password: string;
  code: string;
}

export interface Session {
  id: string;
  user_id: string;
  device_name: string;
  device_type: 'desktop' | 'mobile' | 'tablet';
  browser: string;
  os: string;
  ip_address: string;
  location: string;
  is_current: boolean;
  last_activity: string;
  created_at: string;
  expires_at: string;
}

export interface DeviceInfo {
  userAgent: string;
  platform: string;
  language: string;
  timezone: string;
  screen: {
    width: number;
    height: number;
  };
}

export interface SecuritySettings {
  two_factor_enabled: boolean;
  email_verified: boolean;
  password_last_changed: string;
  login_notifications: boolean;
  suspicious_activity_alerts: boolean;
}

export interface LoginAttempt {
  id: string;
  email: string;
  ip_address: string;
  user_agent: string;
  success: boolean;
  failure_reason?: string;
  location: string;
  timestamp: string;
}

export interface RateLimitInfo {
  remaining: number;
  reset_time: number;
  limit: number;
}

// Agent types
export interface Agent {
  id: string;
  name: string;
  type: "intake" | "spin-up" | "pm" | "comms" | "research" | "launch" | "handover" | "support";
  status: "active" | "inactive" | "error";
  last_activity: string;
  project_id?: string;
}

// Task types
export interface Task {
  id: string;
  title: string;
  description: string;
  status: "todo" | "in_progress" | "review" | "done";
  priority: "low" | "medium" | "high" | "urgent";
  assignee_id?: string;
  project_id: string;
  sprint_id?: string;
  created_at: string;
  updated_at: string;
}

// Lead types
export interface Lead {
  id: string;
  company_name: string;
  contact_email: string;
  contact_name: string;
  status: "new" | "qualified" | "proposal_sent" | "signed" | "lost";
  estimated_value: number;
  created_at: string;
  updated_at: string;
}

// AI Intake & Proposal Generation Types
export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
  metadata?: {
    lead_id?: string;
    qualification_score?: number;
    extracted_data?: Record<string, any>;
  };
}

export interface LeadQualification {
  id: string;
  lead_id: string;
  score: number; // 0-100
  criteria: {
    budget: { score: number; notes: string };
    timeline: { score: number; notes: string };
    authority: { score: number; notes: string };
    need: { score: number; notes: string };
    fit: { score: number; notes: string };
  };
  overall_assessment: string;
  recommended_actions: string[];
  created_at: string;
  updated_at: string;
}

export interface ProposalTemplate {
  id: string;
  name: string;
  description: string;
  sections: ProposalSection[];
  pricing_rules: PricingRule[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProposalSection {
  id: string;
  title: string;
  content: string;
  order: number;
  is_required: boolean;
  merge_fields: string[];
}

export interface PricingRule {
  id: string;
  name: string;
  condition: string; // JSON string for complex conditions
  base_price: number;
  multipliers: Record<string, number>;
  description: string;
}

export interface Proposal {
  id: string;
  lead_id: string;
  template_id: string;
  title: string;
  status: "draft" | "sent" | "signed" | "rejected" | "expired";
  content: string;
  pricing: ProposalPricing;
  terms: ProposalTerms;
  created_at: string;
  updated_at: string;
  sent_at?: string;
  signed_at?: string;
  expires_at?: string;
}

export interface ProposalPricing {
  base_price: number;
  adjustments: Array<{
    name: string;
    amount: number;
    type: "add" | "multiply" | "discount";
  }>;
  total_price: number;
  currency: string;
  payment_terms: string;
}

export interface ProposalTerms {
  duration: string;
  deliverables: string[];
  milestones: Array<{
    name: string;
    due_date: string;
    amount: number;
  }>;
  terms_and_conditions: string;
  cancellation_policy: string;
}

export interface ESignDocument {
  id: string;
  proposal_id: string;
  document_url: string;
  status: "pending" | "sent" | "signed" | "declined" | "expired";
  signers: Array<{
    email: string;
    name: string;
    status: "pending" | "signed" | "declined";
    signed_at?: string;
  }>;
  created_at: string;
  updated_at: string;
  expires_at: string;
}

export interface IntakeSession {
  id: string;
  lead_id?: string;
  status: "active" | "completed" | "abandoned";
  messages: ChatMessage[];
  qualification?: LeadQualification;
  proposal?: Proposal;
  created_at: string;
  updated_at: string;
  completed_at?: string;
}

export interface QualificationRule {
  id: string;
  name: string;
  field: string;
  operator: "equals" | "contains" | "greater_than" | "less_than" | "regex";
  value: string | number;
  weight: number; // 0-1
  is_active: boolean;
}

export interface AuditLog {
  id: string;
  session_id: string;
  action: string;
  details: Record<string, any>;
  timestamp: string;
  user_id?: string;
}
