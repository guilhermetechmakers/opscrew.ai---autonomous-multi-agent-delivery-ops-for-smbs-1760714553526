import apiClient, { type ApiResponse } from './client';
import type { 
  IntakeSession, 
  ChatMessage, 
  LeadQualification, 
  Proposal, 
  ESignDocument,
  QualificationRule,
  AuditLog
} from '@/types';

// AI Intake Chat API
export const intakeApi = {
  // Create new intake session
  createSession: async (): Promise<ApiResponse<IntakeSession>> => {
    const response = await apiClient.post('/intake/sessions');
    return response.data;
  },

  // Get session by ID
  getSession: async (sessionId: string): Promise<ApiResponse<IntakeSession>> => {
    const response = await apiClient.get(`/intake/sessions/${sessionId}`);
    return response.data;
  },

  // Send message to AI intake agent
  sendMessage: async (
    sessionId: string, 
    message: string
  ): Promise<ApiResponse<ChatMessage>> => {
    const response = await apiClient.post(`/intake/sessions/${sessionId}/messages`, {
      content: message,
      role: 'user'
    });
    return response.data;
  },

  // Get AI response (streaming)
  getAIResponse: async (
    sessionId: string,
    onChunk: (chunk: string) => void
  ): Promise<void> => {
    const response = await fetch(
      `${apiClient.defaults.baseURL}/intake/sessions/${sessionId}/ai-response`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to get AI response');
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('No response body');
    }

    const decoder = new TextDecoder();
    let buffer = '';

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') return;
            
            try {
              const parsed = JSON.parse(data);
              if (parsed.content) {
                onChunk(parsed.content);
              }
            } catch (e) {
              console.warn('Failed to parse chunk:', data);
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  },

  // Complete session and create lead
  completeSession: async (sessionId: string): Promise<ApiResponse<IntakeSession>> => {
    const response = await apiClient.post(`/intake/sessions/${sessionId}/complete`);
    return response.data;
  },

  // Get qualification for session
  getQualification: async (sessionId: string): Promise<ApiResponse<LeadQualification>> => {
    const response = await apiClient.get(`/intake/sessions/${sessionId}/qualification`);
    return response.data;
  },

  // Update qualification
  updateQualification: async (
    sessionId: string, 
    qualification: Partial<LeadQualification>
  ): Promise<ApiResponse<LeadQualification>> => {
    const response = await apiClient.put(`/intake/sessions/${sessionId}/qualification`, qualification);
    return response.data;
  }
};

// Proposal Generation API
export const proposalApi = {
  // Generate proposal from session
  generateProposal: async (
    sessionId: string,
    templateId?: string
  ): Promise<ApiResponse<Proposal>> => {
    const response = await apiClient.post(`/proposals/generate`, {
      session_id: sessionId,
      template_id: templateId
    });
    return response.data;
  },

  // Get proposal by ID
  getProposal: async (proposalId: string): Promise<ApiResponse<Proposal>> => {
    const response = await apiClient.get(`/proposals/${proposalId}`);
    return response.data;
  },

  // Update proposal
  updateProposal: async (
    proposalId: string,
    updates: Partial<Proposal>
  ): Promise<ApiResponse<Proposal>> => {
    const response = await apiClient.put(`/proposals/${proposalId}`, updates);
    return response.data;
  },

  // Send proposal for review
  sendProposal: async (proposalId: string): Promise<ApiResponse<Proposal>> => {
    const response = await apiClient.post(`/proposals/${proposalId}/send`);
    return response.data;
  },

  // Get proposal templates
  getTemplates: async (): Promise<ApiResponse<any[]>> => {
    const response = await apiClient.get('/proposals/templates');
    return response.data;
  },

  // Create e-signature document
  createESignDocument: async (
    proposalId: string,
    signers: Array<{ email: string; name: string }>
  ): Promise<ApiResponse<ESignDocument>> => {
    const response = await apiClient.post(`/proposals/${proposalId}/esign`, {
      signers
    });
    return response.data;
  },

  // Get e-signature status
  getESignStatus: async (documentId: string): Promise<ApiResponse<ESignDocument>> => {
    const response = await apiClient.get(`/esign/documents/${documentId}`);
    return response.data;
  }
};

// Qualification Rules API
export const qualificationApi = {
  // Get qualification rules
  getRules: async (): Promise<ApiResponse<QualificationRule[]>> => {
    const response = await apiClient.get('/qualification/rules');
    return response.data;
  },

  // Create qualification rule
  createRule: async (rule: Omit<QualificationRule, 'id'>): Promise<ApiResponse<QualificationRule>> => {
    const response = await apiClient.post('/qualification/rules', rule);
    return response.data;
  },

  // Update qualification rule
  updateRule: async (
    ruleId: string,
    updates: Partial<QualificationRule>
  ): Promise<ApiResponse<QualificationRule>> => {
    const response = await apiClient.put(`/qualification/rules/${ruleId}`, updates);
    return response.data;
  },

  // Delete qualification rule
  deleteRule: async (ruleId: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete(`/qualification/rules/${ruleId}`);
    return response.data;
  }
};

// Audit Log API
export const auditApi = {
  // Get audit logs for session
  getSessionLogs: async (sessionId: string): Promise<ApiResponse<AuditLog[]>> => {
    const response = await apiClient.get(`/audit/sessions/${sessionId}`);
    return response.data;
  },

  // Create audit log entry
  createLog: async (log: Omit<AuditLog, 'id' | 'timestamp'>): Promise<ApiResponse<AuditLog>> => {
    const response = await apiClient.post('/audit/logs', log);
    return response.data;
  }
};
