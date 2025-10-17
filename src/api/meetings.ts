import apiClient from './client';
import type {
  Meeting,
  CreateMeetingInput,
  UpdateMeetingInput,
  MeetingSummary,
  ActionItem,
  MeetingAnalytics,
  MeetingIntegration,
  CreateMeetingIntegrationInput
} from '@/types';

// Meetings API
export const meetingsApi = {
  // Get all meetings
  getMeetings: async (projectId?: string): Promise<Meeting[]> => {
    const params = projectId ? { project_id: projectId } : {};
    const response = await apiClient.get('/meetings', { params });
    return response.data;
  },

  // Get meeting by ID
  getMeeting: async (id: string): Promise<Meeting> => {
    const response = await apiClient.get(`/meetings/${id}`);
    return response.data;
  },

  // Create new meeting
  createMeeting: async (data: CreateMeetingInput): Promise<Meeting> => {
    const response = await apiClient.post('/meetings', data);
    return response.data;
  },

  // Update meeting
  updateMeeting: async (id: string, data: UpdateMeetingInput): Promise<Meeting> => {
    const response = await apiClient.put(`/meetings/${id}`, data);
    return response.data;
  },

  // Delete meeting
  deleteMeeting: async (id: string): Promise<void> => {
    await apiClient.delete(`/meetings/${id}`);
  },

  // Start meeting
  startMeeting: async (id: string): Promise<Meeting> => {
    const response = await apiClient.post(`/meetings/${id}/start`);
    return response.data;
  },

  // End meeting
  endMeeting: async (id: string, notes?: string): Promise<Meeting> => {
    const response = await apiClient.post(`/meetings/${id}/end`, { notes });
    return response.data;
  },

  // Join meeting
  joinMeeting: async (id: string): Promise<{ meeting_url: string }> => {
    const response = await apiClient.post(`/meetings/${id}/join`);
    return response.data;
  },

  // Get meeting summary
  getMeetingSummary: async (id: string): Promise<MeetingSummary> => {
    const response = await apiClient.get(`/meetings/${id}/summary`);
    return response.data;
  },

  // Generate meeting summary
  generateMeetingSummary: async (id: string): Promise<MeetingSummary> => {
    const response = await apiClient.post(`/meetings/${id}/summary/generate`);
    return response.data;
  },

  // Get action items for meeting
  getMeetingActionItems: async (id: string): Promise<ActionItem[]> => {
    const response = await apiClient.get(`/meetings/${id}/action-items`);
    return response.data;
  },

  // Create action item
  createActionItem: async (meetingId: string, data: Omit<ActionItem, 'id' | 'created_at' | 'updated_at'>): Promise<ActionItem> => {
    const response = await apiClient.post(`/meetings/${meetingId}/action-items`, data);
    return response.data;
  },

  // Update action item
  updateActionItem: async (meetingId: string, actionItemId: string, data: Partial<ActionItem>): Promise<ActionItem> => {
    const response = await apiClient.put(`/meetings/${meetingId}/action-items/${actionItemId}`, data);
    return response.data;
  },

  // Delete action item
  deleteActionItem: async (meetingId: string, actionItemId: string): Promise<void> => {
    await apiClient.delete(`/meetings/${meetingId}/action-items/${actionItemId}`);
  },

  // Get meeting analytics
  getMeetingAnalytics: async (projectId?: string, startDate?: string, endDate?: string): Promise<MeetingAnalytics> => {
    const params: any = {};
    if (projectId) params.project_id = projectId;
    if (startDate) params.start_date = startDate;
    if (endDate) params.end_date = endDate;
    
    const response = await apiClient.get('/meetings/analytics', { params });
    return response.data;
  },

  // Get upcoming meetings
  getUpcomingMeetings: async (projectId?: string, limit: number = 10): Promise<Meeting[]> => {
    const params: any = { limit, upcoming: true };
    if (projectId) params.project_id = projectId;
    
    const response = await apiClient.get('/meetings', { params });
    return response.data;
  },

  // Get recent meetings
  getRecentMeetings: async (projectId?: string, limit: number = 10): Promise<Meeting[]> => {
    const params: any = { limit, recent: true };
    if (projectId) params.project_id = projectId;
    
    const response = await apiClient.get('/meetings', { params });
    return response.data;
  }
};

// Meeting Integrations API
export const meetingIntegrationsApi = {
  // Get all integrations
  getIntegrations: async (): Promise<MeetingIntegration[]> => {
    const response = await apiClient.get('/meeting-integrations');
    return response.data;
  },

  // Get integration by ID
  getIntegration: async (id: string): Promise<MeetingIntegration> => {
    const response = await apiClient.get(`/meeting-integrations/${id}`);
    return response.data;
  },

  // Create integration
  createIntegration: async (data: CreateMeetingIntegrationInput): Promise<MeetingIntegration> => {
    const response = await apiClient.post('/meeting-integrations', data);
    return response.data;
  },

  // Update integration
  updateIntegration: async (id: string, data: Partial<MeetingIntegration>): Promise<MeetingIntegration> => {
    const response = await apiClient.put(`/meeting-integrations/${id}`, data);
    return response.data;
  },

  // Delete integration
  deleteIntegration: async (id: string): Promise<void> => {
    await apiClient.delete(`/meeting-integrations/${id}`);
  },

  // Test integration connection
  testIntegration: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.post(`/meeting-integrations/${id}/test`);
    return response.data;
  },

  // Sync meetings from integration
  syncMeetings: async (id: string): Promise<{ synced_count: number; message: string }> => {
    const response = await apiClient.post(`/meeting-integrations/${id}/sync`);
    return response.data;
  }
};
