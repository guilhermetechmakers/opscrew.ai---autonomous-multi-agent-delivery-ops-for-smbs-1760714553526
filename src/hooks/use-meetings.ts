import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { meetingsApi } from '@/api/meetings';
import type { 
  CreateMeetingInput, 
  UpdateMeetingInput, 
  ActionItem
} from '@/types';

// Query keys
export const meetingKeys = {
  all: ['meetings'] as const,
  lists: () => [...meetingKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...meetingKeys.lists(), filters] as const,
  details: () => [...meetingKeys.all, 'detail'] as const,
  detail: (id: string) => [...meetingKeys.details(), id] as const,
  summaries: () => [...meetingKeys.all, 'summary'] as const,
  summary: (id: string) => [...meetingKeys.summaries(), id] as const,
  actionItems: (id: string) => [...meetingKeys.detail(id), 'action-items'] as const,
  analytics: (filters: Record<string, any>) => [...meetingKeys.all, 'analytics', filters] as const,
};

// Get all meetings
export const useMeetings = (projectId?: string) => {
  return useQuery({
    queryKey: meetingKeys.list({ projectId }),
    queryFn: () => meetingsApi.getMeetings(projectId),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Get meeting by ID
export const useMeeting = (id: string) => {
  return useQuery({
    queryKey: meetingKeys.detail(id),
    queryFn: () => meetingsApi.getMeeting(id),
    enabled: !!id,
  });
};

// Get upcoming meetings
export const useUpcomingMeetings = (projectId?: string, limit: number = 10) => {
  return useQuery({
    queryKey: meetingKeys.list({ upcoming: true, projectId, limit }),
    queryFn: () => meetingsApi.getUpcomingMeetings(projectId, limit),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

// Get recent meetings
export const useRecentMeetings = (projectId?: string, limit: number = 10) => {
  return useQuery({
    queryKey: meetingKeys.list({ recent: true, projectId, limit }),
    queryFn: () => meetingsApi.getRecentMeetings(projectId, limit),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Get meeting summary
export const useMeetingSummary = (id: string) => {
  return useQuery({
    queryKey: meetingKeys.summary(id),
    queryFn: () => meetingsApi.getMeetingSummary(id),
    enabled: !!id,
  });
};

// Get meeting action items
export const useMeetingActionItems = (id: string) => {
  return useQuery({
    queryKey: meetingKeys.actionItems(id),
    queryFn: () => meetingsApi.getMeetingActionItems(id),
    enabled: !!id,
  });
};

// Get meeting analytics
export const useMeetingAnalytics = (projectId?: string, startDate?: string, endDate?: string) => {
  return useQuery({
    queryKey: meetingKeys.analytics({ projectId, startDate, endDate }),
    queryFn: () => meetingsApi.getMeetingAnalytics(projectId, startDate, endDate),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};

// Create meeting mutation
export const useCreateMeeting = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateMeetingInput) => meetingsApi.createMeeting(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: meetingKeys.lists() });
    },
  });
};

// Update meeting mutation
export const useUpdateMeeting = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateMeetingInput }) => 
      meetingsApi.updateMeeting(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: meetingKeys.lists() });
      queryClient.setQueryData(meetingKeys.detail(data.id), data);
    },
  });
};

// Delete meeting mutation
export const useDeleteMeeting = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => meetingsApi.deleteMeeting(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: meetingKeys.lists() });
    },
  });
};

// Start meeting mutation
export const useStartMeeting = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => meetingsApi.startMeeting(id),
    onSuccess: (data) => {
      queryClient.setQueryData(meetingKeys.detail(data.id), data);
      queryClient.invalidateQueries({ queryKey: meetingKeys.lists() });
    },
  });
};

// End meeting mutation
export const useEndMeeting = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, notes }: { id: string; notes?: string }) => 
      meetingsApi.endMeeting(id, notes),
    onSuccess: (data) => {
      queryClient.setQueryData(meetingKeys.detail(data.id), data);
      queryClient.invalidateQueries({ queryKey: meetingKeys.lists() });
    },
  });
};

// Join meeting mutation
export const useJoinMeeting = () => {
  return useMutation({
    mutationFn: (id: string) => meetingsApi.joinMeeting(id),
  });
};

// Generate meeting summary mutation
export const useGenerateMeetingSummary = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => meetingsApi.generateMeetingSummary(id),
    onSuccess: (data, meetingId) => {
      queryClient.setQueryData(meetingKeys.summary(meetingId), data);
      queryClient.invalidateQueries({ queryKey: meetingKeys.detail(meetingId) });
    },
  });
};

// Create action item mutation
export const useCreateActionItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ meetingId, data }: { meetingId: string; data: Omit<ActionItem, 'id' | 'created_at' | 'updated_at'> }) => 
      meetingsApi.createActionItem(meetingId, data),
    onSuccess: (_, { meetingId }) => {
      queryClient.invalidateQueries({ queryKey: meetingKeys.actionItems(meetingId) });
    },
  });
};

// Update action item mutation
export const useUpdateActionItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ meetingId, actionItemId, data }: { meetingId: string; actionItemId: string; data: Partial<ActionItem> }) => 
      meetingsApi.updateActionItem(meetingId, actionItemId, data),
    onSuccess: (_, { meetingId }) => {
      queryClient.invalidateQueries({ queryKey: meetingKeys.actionItems(meetingId) });
    },
  });
};

// Delete action item mutation
export const useDeleteActionItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ meetingId, actionItemId }: { meetingId: string; actionItemId: string }) => 
      meetingsApi.deleteActionItem(meetingId, actionItemId),
    onSuccess: (_, { meetingId }) => {
      queryClient.invalidateQueries({ queryKey: meetingKeys.actionItems(meetingId) });
    },
  });
};
