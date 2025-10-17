import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { sprintApi, taskApi, sprintPlanningApi, teamApi } from '@/api/sprint-task';
import type {
  Task,
  TeamMember
} from '@/types';

// Sprint hooks
export const useSprints = (projectId: string) => {
  return useQuery({
    queryKey: ['sprints', projectId],
    queryFn: () => sprintApi.getSprints(projectId),
    enabled: !!projectId,
  });
};

export const useSprint = (sprintId: string) => {
  return useQuery({
    queryKey: ['sprint', sprintId],
    queryFn: () => sprintApi.getSprint(sprintId),
    enabled: !!sprintId,
  });
};

export const useCreateSprint = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: sprintApi.createSprint,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['sprints', data.project_id] });
      toast.success('Sprint created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create sprint');
    },
  });
};

export const useUpdateSprint = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: sprintApi.updateSprint,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['sprint', data.id] });
      queryClient.invalidateQueries({ queryKey: ['sprints', data.project_id] });
      toast.success('Sprint updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update sprint');
    },
  });
};

export const useDeleteSprint = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: sprintApi.deleteSprint,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sprints'] });
      toast.success('Sprint deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete sprint');
    },
  });
};

export const useStartSprint = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: sprintApi.startSprint,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['sprint', data.id] });
      queryClient.invalidateQueries({ queryKey: ['sprints', data.project_id] });
      toast.success('Sprint started successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to start sprint');
    },
  });
};

export const useCompleteSprint = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: sprintApi.completeSprint,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['sprint', data.id] });
      queryClient.invalidateQueries({ queryKey: ['sprints', data.project_id] });
      toast.success('Sprint completed successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to complete sprint');
    },
  });
};

export const useSprintMetrics = (sprintId: string) => {
  return useQuery({
    queryKey: ['sprint-metrics', sprintId],
    queryFn: () => sprintApi.getSprintMetrics(sprintId),
    enabled: !!sprintId,
  });
};

// Task hooks
export const useTasks = (projectId: string, sprintId?: string) => {
  return useQuery({
    queryKey: ['tasks', projectId, sprintId],
    queryFn: () => taskApi.getTasks(projectId, sprintId),
    enabled: !!projectId,
  });
};

export const useTask = (taskId: string) => {
  return useQuery({
    queryKey: ['task', taskId],
    queryFn: () => taskApi.getTask(taskId),
    enabled: !!taskId,
  });
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: taskApi.createTask,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['tasks', data.project_id] });
      if (data.sprint_id) {
        queryClient.invalidateQueries({ queryKey: ['tasks', data.project_id, data.sprint_id] });
      }
      toast.success('Task created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create task');
    },
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: taskApi.updateTask,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['task', data.id] });
      queryClient.invalidateQueries({ queryKey: ['tasks', data.project_id] });
      if (data.sprint_id) {
        queryClient.invalidateQueries({ queryKey: ['tasks', data.project_id, data.sprint_id] });
      }
      toast.success('Task updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update task');
    },
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: taskApi.deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Task deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete task');
    },
  });
};

export const useMoveTask = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ taskId, status }: { taskId: string; status: Task['status'] }) => 
      taskApi.moveTask(taskId, status),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['task', data.id] });
      queryClient.invalidateQueries({ queryKey: ['tasks', data.project_id] });
      if (data.sprint_id) {
        queryClient.invalidateQueries({ queryKey: ['tasks', data.project_id, data.sprint_id] });
      }
      toast.success('Task moved successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to move task');
    },
  });
};

export const useAssignTask = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ taskId, assigneeId }: { taskId: string; assigneeId: string }) => 
      taskApi.assignTask(taskId, assigneeId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['task', data.id] });
      queryClient.invalidateQueries({ queryKey: ['tasks', data.project_id] });
      if (data.sprint_id) {
        queryClient.invalidateQueries({ queryKey: ['tasks', data.project_id, data.sprint_id] });
      }
      toast.success('Task assigned successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to assign task');
    },
  });
};

// Team hooks
export const useTeamMembers = (projectId: string) => {
  return useQuery({
    queryKey: ['team-members', projectId],
    queryFn: () => teamApi.getTeamMembers(projectId),
    enabled: !!projectId,
  });
};

export const useAddTeamMember = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ projectId, userId, role, capacity }: { 
      projectId: string; 
      userId: string; 
      role: TeamMember['role']; 
      capacity: number; 
    }) => teamApi.addTeamMember(projectId, userId, role, capacity),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['team-members', data.project_id] });
      toast.success('Team member added successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to add team member');
    },
  });
};

// Sprint Planning hooks
export const usePlanningSession = (sprintId: string) => {
  return useQuery({
    queryKey: ['planning-session', sprintId],
    queryFn: () => sprintPlanningApi.getPlanningSession(sprintId),
    enabled: !!sprintId,
  });
};

export const useCreatePlanningSession = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ sprintId, participants }: { sprintId: string; participants: string[] }) => 
      sprintPlanningApi.createPlanningSession(sprintId, participants),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['planning-session', data.sprint_id] });
      toast.success('Planning session created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create planning session');
    },
  });
};
