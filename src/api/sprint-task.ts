import apiClient from './client';
import type {
  Sprint,
  CreateSprintInput,
  UpdateSprintInput,
  Task,
  CreateTaskInput,
  UpdateTaskInput,
  SprintPlanningSession,
  SprintMetrics,
  TeamMember
} from '@/types';

// Sprint API functions
export const sprintApi = {
  // Get all sprints for a project
  getSprints: async (projectId: string): Promise<Sprint[]> => {
    const response = await apiClient.get(`/projects/${projectId}/sprints`);
    return response.data;
  },

  // Get a specific sprint
  getSprint: async (sprintId: string): Promise<Sprint> => {
    const response = await apiClient.get(`/sprints/${sprintId}`);
    return response.data;
  },

  // Create a new sprint
  createSprint: async (data: CreateSprintInput): Promise<Sprint> => {
    const response = await apiClient.post('/sprints', data);
    return response.data;
  },

  // Update a sprint
  updateSprint: async (data: UpdateSprintInput): Promise<Sprint> => {
    const response = await apiClient.put(`/sprints/${data.id}`, data);
    return response.data;
  },

  // Delete a sprint
  deleteSprint: async (sprintId: string): Promise<void> => {
    await apiClient.delete(`/sprints/${sprintId}`);
  },

  // Start a sprint
  startSprint: async (sprintId: string): Promise<Sprint> => {
    const response = await apiClient.post(`/sprints/${sprintId}/start`);
    return response.data;
  },

  // Complete a sprint
  completeSprint: async (sprintId: string): Promise<Sprint> => {
    const response = await apiClient.post(`/sprints/${sprintId}/complete`);
    return response.data;
  },

  // Get sprint metrics
  getSprintMetrics: async (sprintId: string): Promise<SprintMetrics> => {
    const response = await apiClient.get(`/sprints/${sprintId}/metrics`);
    return response.data;
  }
};

// Task API functions
export const taskApi = {
  // Get all tasks for a project
  getTasks: async (projectId: string, sprintId?: string): Promise<Task[]> => {
    const params = sprintId ? { sprint_id: sprintId } : {};
    const response = await apiClient.get(`/projects/${projectId}/tasks`, { params });
    return response.data;
  },

  // Get a specific task
  getTask: async (taskId: string): Promise<Task> => {
    const response = await apiClient.get(`/tasks/${taskId}`);
    return response.data;
  },

  // Create a new task
  createTask: async (data: CreateTaskInput): Promise<Task> => {
    const response = await apiClient.post('/tasks', data);
    return response.data;
  },

  // Update a task
  updateTask: async (data: UpdateTaskInput): Promise<Task> => {
    const response = await apiClient.put(`/tasks/${data.id}`, data);
    return response.data;
  },

  // Delete a task
  deleteTask: async (taskId: string): Promise<void> => {
    await apiClient.delete(`/tasks/${taskId}`);
  },

  // Move task to different status
  moveTask: async (taskId: string, status: Task['status']): Promise<Task> => {
    const response = await apiClient.patch(`/tasks/${taskId}/move`, { status });
    return response.data;
  },

  // Assign task to team member
  assignTask: async (taskId: string, assigneeId: string): Promise<Task> => {
    const response = await apiClient.patch(`/tasks/${taskId}/assign`, { assignee_id: assigneeId });
    return response.data;
  },

  // Get tasks by assignee
  getTasksByAssignee: async (assigneeId: string): Promise<Task[]> => {
    const response = await apiClient.get(`/tasks/assignee/${assigneeId}`);
    return response.data;
  }
};

// Sprint Planning API functions
export const sprintPlanningApi = {
  // Get planning session for a sprint
  getPlanningSession: async (sprintId: string): Promise<SprintPlanningSession> => {
    const response = await apiClient.get(`/sprints/${sprintId}/planning`);
    return response.data;
  },

  // Create planning session
  createPlanningSession: async (sprintId: string, participants: string[]): Promise<SprintPlanningSession> => {
    const response = await apiClient.post(`/sprints/${sprintId}/planning`, { participants });
    return response.data;
  },

  // Update planning session
  updatePlanningSession: async (sprintId: string, data: Partial<SprintPlanningSession>): Promise<SprintPlanningSession> => {
    const response = await apiClient.put(`/sprints/${sprintId}/planning`, data);
    return response.data;
  },

  // Complete planning session
  completePlanningSession: async (sprintId: string): Promise<SprintPlanningSession> => {
    const response = await apiClient.post(`/sprints/${sprintId}/planning/complete`);
    return response.data;
  }
};

// Team API functions
export const teamApi = {
  // Get team members for a project
  getTeamMembers: async (projectId: string): Promise<TeamMember[]> => {
    const response = await apiClient.get(`/projects/${projectId}/team`);
    return response.data;
  },

  // Add team member to project
  addTeamMember: async (projectId: string, userId: string, role: TeamMember['role'], capacity: number): Promise<TeamMember> => {
    const response = await apiClient.post(`/projects/${projectId}/team`, {
      user_id: userId,
      role,
      capacity
    });
    return response.data;
  },

  // Update team member
  updateTeamMember: async (memberId: string, data: Partial<TeamMember>): Promise<TeamMember> => {
    const response = await apiClient.put(`/team/${memberId}`, data);
    return response.data;
  },

  // Remove team member from project
  removeTeamMember: async (memberId: string): Promise<void> => {
    await apiClient.delete(`/team/${memberId}`);
  }
};
