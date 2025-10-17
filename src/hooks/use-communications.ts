import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { communicationsApi } from '@/api/communications';
import type { 
  CreateCommunicationInput, 
  UpdateCommunicationInput
} from '@/types';

// Query keys
export const communicationKeys = {
  all: ['communications'] as const,
  lists: () => [...communicationKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...communicationKeys.lists(), filters] as const,
  details: () => [...communicationKeys.all, 'detail'] as const,
  detail: (id: string) => [...communicationKeys.details(), id] as const,
  analytics: (filters: Record<string, any>) => [...communicationKeys.all, 'analytics', filters] as const,
  templates: (type?: string) => [...communicationKeys.all, 'templates', { type }] as const,
};

// Get all communications
export const useCommunications = (projectId?: string, type?: string) => {
  return useQuery({
    queryKey: communicationKeys.list({ projectId, type }),
    queryFn: () => communicationsApi.getCommunications(projectId, type),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Get communication by ID
export const useCommunication = (id: string) => {
  return useQuery({
    queryKey: communicationKeys.detail(id),
    queryFn: () => communicationsApi.getCommunication(id),
    enabled: !!id,
  });
};

// Get recent communications
export const useRecentCommunications = (projectId?: string, limit: number = 20) => {
  return useQuery({
    queryKey: communicationKeys.list({ recent: true, projectId, limit }),
    queryFn: () => communicationsApi.getRecentCommunications(projectId, limit),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

// Get unread communications
export const useUnreadCommunications = (projectId?: string) => {
  return useQuery({
    queryKey: communicationKeys.list({ unread: true, projectId }),
    queryFn: () => communicationsApi.getUnreadCommunications(projectId),
    staleTime: 1000 * 60 * 1, // 1 minute
  });
};

// Get communication analytics
export const useCommunicationAnalytics = (projectId?: string, startDate?: string, endDate?: string) => {
  return useQuery({
    queryKey: communicationKeys.analytics({ projectId, startDate, endDate }),
    queryFn: () => communicationsApi.getCommunicationAnalytics(projectId, startDate, endDate),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};

// Get communication templates
export const useCommunicationTemplates = (type?: string) => {
  return useQuery({
    queryKey: communicationKeys.templates(type),
    queryFn: () => communicationsApi.getTemplates(type),
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
};

// Create communication mutation
export const useCreateCommunication = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateCommunicationInput) => communicationsApi.createCommunication(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: communicationKeys.lists() });
    },
  });
};

// Update communication mutation
export const useUpdateCommunication = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCommunicationInput }) => 
      communicationsApi.updateCommunication(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: communicationKeys.lists() });
      queryClient.setQueryData(communicationKeys.detail(data.id), data);
    },
  });
};

// Delete communication mutation
export const useDeleteCommunication = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => communicationsApi.deleteCommunication(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: communicationKeys.lists() });
    },
  });
};

// Send communication mutation
export const useSendCommunication = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => communicationsApi.sendCommunication(id),
    onSuccess: (data) => {
      queryClient.setQueryData(communicationKeys.detail(data.id), data);
      queryClient.invalidateQueries({ queryKey: communicationKeys.lists() });
    },
  });
};

// Schedule communication mutation
export const useScheduleCommunication = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, scheduledAt }: { id: string; scheduledAt: string }) => 
      communicationsApi.scheduleCommunication(id, scheduledAt),
    onSuccess: (data) => {
      queryClient.setQueryData(communicationKeys.detail(data.id), data);
      queryClient.invalidateQueries({ queryKey: communicationKeys.lists() });
    },
  });
};

// Cancel scheduled communication mutation
export const useCancelScheduledCommunication = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => communicationsApi.cancelScheduledCommunication(id),
    onSuccess: (data) => {
      queryClient.setQueryData(communicationKeys.detail(data.id), data);
      queryClient.invalidateQueries({ queryKey: communicationKeys.lists() });
    },
  });
};

// Mark as read mutation
export const useMarkAsRead = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => communicationsApi.markAsRead(id),
    onSuccess: (data) => {
      queryClient.setQueryData(communicationKeys.detail(data.id), data);
      queryClient.invalidateQueries({ queryKey: communicationKeys.lists() });
    },
  });
};

// Bulk send communications mutation
export const useBulkSendCommunications = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (ids: string[]) => communicationsApi.bulkSendCommunications(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: communicationKeys.lists() });
    },
  });
};

// Create from template mutation
export const useCreateFromTemplate = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ templateId, data }: { templateId: string; data: { recipient_id?: string; project_id: string; variables: Record<string, string> } }) => 
      communicationsApi.createFromTemplate(templateId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: communicationKeys.lists() });
    },
  });
};
