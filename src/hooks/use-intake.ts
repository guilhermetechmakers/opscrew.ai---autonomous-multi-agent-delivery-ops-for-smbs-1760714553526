import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { intakeApi, proposalApi, qualificationApi, auditApi } from '@/api/intake';
import type { 
  LeadQualification, 
  Proposal,
  QualificationRule
} from '@/types';

// Query keys
export const intakeKeys = {
  all: ['intake'] as const,
  sessions: () => [...intakeKeys.all, 'sessions'] as const,
  session: (id: string) => [...intakeKeys.sessions(), id] as const,
  qualification: (sessionId: string) => [...intakeKeys.session(sessionId), 'qualification'] as const,
  proposals: () => [...intakeKeys.all, 'proposals'] as const,
  proposal: (id: string) => [...intakeKeys.proposals(), id] as const,
  rules: () => [...intakeKeys.all, 'rules'] as const,
  audit: (sessionId: string) => [...intakeKeys.session(sessionId), 'audit'] as const,
};

// Intake Session Hooks
export const useCreateSession = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: intakeApi.createSession,
    onSuccess: (data) => {
      if (data.data) {
        queryClient.setQueryData(intakeKeys.session(data.data.id), data.data);
        toast.success('New intake session started');
      }
    },
    onError: (error) => {
      toast.error('Failed to create intake session');
      console.error('Create session error:', error);
    },
  });
};

export const useSession = (sessionId: string, enabled = true) => {
  return useQuery({
    queryKey: intakeKeys.session(sessionId),
    queryFn: () => intakeApi.getSession(sessionId),
    enabled: enabled && !!sessionId,
    select: (data) => data.data,
  });
};

export const useSendMessage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ sessionId, message }: { sessionId: string; message: string }) =>
      intakeApi.sendMessage(sessionId, message),
    onSuccess: (data, variables) => {
      if (data.data) {
        // Update session messages
        queryClient.setQueryData(intakeKeys.session(variables.sessionId), (old: any) => {
          if (!old?.data) return old;
          return {
            ...old,
            data: {
              ...old.data,
              messages: [...old.data.messages, data.data]
            }
          };
        });
      }
    },
    onError: (error) => {
      toast.error('Failed to send message');
      console.error('Send message error:', error);
    },
  });
};

export const useAIResponse = () => {
  return useMutation({
    mutationFn: ({ sessionId, onChunk }: { sessionId: string; onChunk: (chunk: string) => void }) =>
      intakeApi.getAIResponse(sessionId, onChunk),
    onError: (error) => {
      toast.error('Failed to get AI response');
      console.error('AI response error:', error);
    },
  });
};

export const useCompleteSession = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: intakeApi.completeSession,
    onSuccess: (data, sessionId) => {
      if (data.data) {
        queryClient.setQueryData(intakeKeys.session(sessionId), data);
        toast.success('Session completed successfully');
      }
    },
    onError: (error) => {
      toast.error('Failed to complete session');
      console.error('Complete session error:', error);
    },
  });
};

// Qualification Hooks
export const useQualification = (sessionId: string, enabled = true) => {
  return useQuery({
    queryKey: intakeKeys.qualification(sessionId),
    queryFn: () => intakeApi.getQualification(sessionId),
    enabled: enabled && !!sessionId,
    select: (data) => data.data,
  });
};

export const useUpdateQualification = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ sessionId, qualification }: { sessionId: string; qualification: Partial<LeadQualification> }) =>
      intakeApi.updateQualification(sessionId, qualification),
    onSuccess: (data, variables) => {
      if (data.data) {
        queryClient.setQueryData(intakeKeys.qualification(variables.sessionId), data);
        toast.success('Qualification updated');
      }
    },
    onError: (error) => {
      toast.error('Failed to update qualification');
      console.error('Update qualification error:', error);
    },
  });
};

// Proposal Hooks
export const useGenerateProposal = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ sessionId, templateId }: { sessionId: string; templateId?: string }) =>
      proposalApi.generateProposal(sessionId, templateId),
    onSuccess: (data) => {
      if (data.data) {
        queryClient.setQueryData(intakeKeys.proposal(data.data.id), data);
        toast.success('Proposal generated successfully');
      }
    },
    onError: (error) => {
      toast.error('Failed to generate proposal');
      console.error('Generate proposal error:', error);
    },
  });
};

export const useProposal = (proposalId: string, enabled = true) => {
  return useQuery({
    queryKey: intakeKeys.proposal(proposalId),
    queryFn: () => proposalApi.getProposal(proposalId),
    enabled: enabled && !!proposalId,
    select: (data) => data.data,
  });
};

export const useUpdateProposal = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ proposalId, updates }: { proposalId: string; updates: Partial<Proposal> }) =>
      proposalApi.updateProposal(proposalId, updates),
    onSuccess: (data, variables) => {
      if (data.data) {
        queryClient.setQueryData(intakeKeys.proposal(variables.proposalId), data);
        toast.success('Proposal updated');
      }
    },
    onError: (error) => {
      toast.error('Failed to update proposal');
      console.error('Update proposal error:', error);
    },
  });
};

export const useSendProposal = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: proposalApi.sendProposal,
    onSuccess: (data, proposalId) => {
      if (data.data) {
        queryClient.setQueryData(intakeKeys.proposal(proposalId), data);
        toast.success('Proposal sent successfully');
      }
    },
    onError: (error) => {
      toast.error('Failed to send proposal');
      console.error('Send proposal error:', error);
    },
  });
};

// Qualification Rules Hooks
export const useQualificationRules = () => {
  return useQuery({
    queryKey: intakeKeys.rules(),
    queryFn: () => qualificationApi.getRules(),
    select: (data) => data.data || [],
  });
};

export const useCreateQualificationRule = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: qualificationApi.createRule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: intakeKeys.rules() });
      toast.success('Qualification rule created');
    },
    onError: (error) => {
      toast.error('Failed to create qualification rule');
      console.error('Create rule error:', error);
    },
  });
};

export const useUpdateQualificationRule = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ ruleId, updates }: { ruleId: string; updates: Partial<QualificationRule> }) =>
      qualificationApi.updateRule(ruleId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: intakeKeys.rules() });
      toast.success('Qualification rule updated');
    },
    onError: (error) => {
      toast.error('Failed to update qualification rule');
      console.error('Update rule error:', error);
    },
  });
};

export const useDeleteQualificationRule = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: qualificationApi.deleteRule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: intakeKeys.rules() });
      toast.success('Qualification rule deleted');
    },
    onError: (error) => {
      toast.error('Failed to delete qualification rule');
      console.error('Delete rule error:', error);
    },
  });
};

// Audit Hooks
export const useAuditLogs = (sessionId: string, enabled = true) => {
  return useQuery({
    queryKey: intakeKeys.audit(sessionId),
    queryFn: () => auditApi.getSessionLogs(sessionId),
    enabled: enabled && !!sessionId,
    select: (data) => data.data || [],
  });
};

export const useCreateAuditLog = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: auditApi.createLog,
    onSuccess: (data, variables) => {
      if (data.data) {
        queryClient.invalidateQueries({ queryKey: intakeKeys.audit(variables.session_id) });
      }
    },
    onError: (error) => {
      console.error('Create audit log error:', error);
    },
  });
};
