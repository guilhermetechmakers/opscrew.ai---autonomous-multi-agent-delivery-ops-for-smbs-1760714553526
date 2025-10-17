import apiClient from './client';
import type {
  Communication,
  CreateCommunicationInput,
  UpdateCommunicationInput,
  CommunicationAnalytics
} from '@/types';

// Communications API
export const communicationsApi = {
  // Get all communications
  getCommunications: async (projectId?: string, type?: string): Promise<Communication[]> => {
    const params: any = {};
    if (projectId) params.project_id = projectId;
    if (type) params.type = type;
    
    const response = await apiClient.get('/communications', { params });
    return response.data;
  },

  // Get communication by ID
  getCommunication: async (id: string): Promise<Communication> => {
    const response = await apiClient.get(`/communications/${id}`);
    return response.data;
  },

  // Create new communication
  createCommunication: async (data: CreateCommunicationInput): Promise<Communication> => {
    const response = await apiClient.post('/communications', data);
    return response.data;
  },

  // Update communication
  updateCommunication: async (id: string, data: UpdateCommunicationInput): Promise<Communication> => {
    const response = await apiClient.put(`/communications/${id}`, data);
    return response.data;
  },

  // Delete communication
  deleteCommunication: async (id: string): Promise<void> => {
    await apiClient.delete(`/communications/${id}`);
  },

  // Send communication
  sendCommunication: async (id: string): Promise<Communication> => {
    const response = await apiClient.post(`/communications/${id}/send`);
    return response.data;
  },

  // Schedule communication
  scheduleCommunication: async (id: string, scheduledAt: string): Promise<Communication> => {
    const response = await apiClient.post(`/communications/${id}/schedule`, { scheduled_at: scheduledAt });
    return response.data;
  },

  // Cancel scheduled communication
  cancelScheduledCommunication: async (id: string): Promise<Communication> => {
    const response = await apiClient.post(`/communications/${id}/cancel`);
    return response.data;
  },

  // Mark as read
  markAsRead: async (id: string): Promise<Communication> => {
    const response = await apiClient.post(`/communications/${id}/read`);
    return response.data;
  },

  // Get communication analytics
  getCommunicationAnalytics: async (projectId?: string, startDate?: string, endDate?: string): Promise<CommunicationAnalytics> => {
    const params: any = {};
    if (projectId) params.project_id = projectId;
    if (startDate) params.start_date = startDate;
    if (endDate) params.end_date = endDate;
    
    const response = await apiClient.get('/communications/analytics', { params });
    return response.data;
  },

  // Get recent communications
  getRecentCommunications: async (projectId?: string, limit: number = 20): Promise<Communication[]> => {
    const params: any = { limit, recent: true };
    if (projectId) params.project_id = projectId;
    
    const response = await apiClient.get('/communications', { params });
    return response.data;
  },

  // Get unread communications
  getUnreadCommunications: async (projectId?: string): Promise<Communication[]> => {
    const params: any = { unread: true };
    if (projectId) params.project_id = projectId;
    
    const response = await apiClient.get('/communications', { params });
    return response.data;
  },

  // Bulk send communications
  bulkSendCommunications: async (ids: string[]): Promise<{ sent_count: number; failed_count: number; results: Array<{ id: string; success: boolean; error?: string }> }> => {
    const response = await apiClient.post('/communications/bulk-send', { ids });
    return response.data;
  },

  // Get communication templates
  getTemplates: async (type?: string): Promise<Array<{ id: string; name: string; type: string; subject: string; content: string; variables: string[] }>> => {
    const params = type ? { type } : {};
    const response = await apiClient.get('/communications/templates', { params });
    return response.data;
  },

  // Create communication from template
  createFromTemplate: async (templateId: string, data: { recipient_id?: string; project_id: string; variables: Record<string, string> }): Promise<Communication> => {
    const response = await apiClient.post(`/communications/templates/${templateId}/create`, data);
    return response.data;
  }
};
