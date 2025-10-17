// User types
export interface User {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  role: "admin" | "user" | "viewer";
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
  token: string;
  refresh_token: string;
}

export interface SignInInput {
  email: string;
  password: string;
}

export interface SignUpInput {
  email: string;
  password: string;
  full_name: string;
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
