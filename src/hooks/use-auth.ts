import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import authApi from '@/api/auth';

// Sign in hook
export function useSignIn() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.signIn,
    onSuccess: (response) => {
      if (response.data) {
        const { user, access_token, refresh_token } = response.data;
        localStorage.setItem('access_token', access_token);
        localStorage.setItem('refresh_token', refresh_token);
        queryClient.setQueryData(['auth', 'user'], user);
        toast.success('Welcome back!');
      }
    },
    onError: (error: any) => {
      toast.error(error.message || 'Sign in failed');
    },
  });
}

// Sign up hook
export function useSignUp() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.signUp,
    onSuccess: (response) => {
      if (response.data) {
        const { user, access_token, refresh_token } = response.data;
        localStorage.setItem('access_token', access_token);
        localStorage.setItem('refresh_token', refresh_token);
        queryClient.setQueryData(['auth', 'user'], user);
        toast.success('Account created successfully!');
      }
    },
    onError: (error: any) => {
      toast.error(error.message || 'Sign up failed');
    },
  });
}

// Sign out hook
export function useSignOut() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.signOut,
    onSuccess: () => {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      queryClient.clear();
      toast.success('Signed out successfully');
    },
    onError: (error: any) => {
      // Even if API call fails, clear local state
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      queryClient.clear();
      toast.error(error.message || 'Sign out failed');
    },
  });
}

// OAuth sign in hook
export function useOAuthSignIn() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.signInWithOAuth,
    onSuccess: (response) => {
      if (response.data) {
        const { user, access_token, refresh_token } = response.data;
        localStorage.setItem('access_token', access_token);
        localStorage.setItem('refresh_token', refresh_token);
        queryClient.setQueryData(['auth', 'user'], user);
        toast.success('Signed in successfully!');
      }
    },
    onError: (error: any) => {
      toast.error(error.message || 'OAuth sign in failed');
    },
  });
}

// Get OAuth URL hook
export function useOAuthUrl(provider: 'google' | 'github' | 'microsoft') {
  return useQuery({
    queryKey: ['auth', 'oauth', provider, 'url'],
    queryFn: () => authApi.getOAuthUrl(provider),
    enabled: false, // Only run when explicitly called
  });
}

// Current user hook
export function useCurrentUser() {
  return useQuery({
    queryKey: ['auth', 'user'],
    queryFn: async () => {
      const response = await authApi.getCurrentUser();
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data;
    },
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Update profile hook
export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.updateProfile,
    onSuccess: (response) => {
      if (response.data) {
        queryClient.setQueryData(['auth', 'user'], response.data);
        toast.success('Profile updated successfully!');
      }
    },
    onError: (error: any) => {
      toast.error(error.message || 'Profile update failed');
    },
  });
}

// Forgot password hook
export function useForgotPassword() {
  return useMutation({
    mutationFn: authApi.forgotPassword,
    onSuccess: () => {
      toast.success('Password reset email sent!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to send password reset email');
    },
  });
}

// Reset password hook
export function useResetPassword() {
  return useMutation({
    mutationFn: authApi.resetPassword,
    onSuccess: () => {
      toast.success('Password reset successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Password reset failed');
    },
  });
}

// Change password hook
export function useChangePassword() {
  return useMutation({
    mutationFn: authApi.changePassword,
    onSuccess: () => {
      toast.success('Password changed successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Password change failed');
    },
  });
}

// Email verification hooks
export function useVerifyEmail() {
  return useMutation({
    mutationFn: authApi.verifyEmail,
    onSuccess: () => {
      toast.success('Email verified successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Email verification failed');
    },
  });
}

export function useResendVerification() {
  return useMutation({
    mutationFn: authApi.resendVerification,
    onSuccess: () => {
      toast.success('Verification email sent!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to send verification email');
    },
  });
}

// Two-factor authentication hooks
export function useSetupTwoFactor() {
  return useMutation({
    mutationFn: authApi.setupTwoFactor,
    onError: (error: any) => {
      toast.error(error.message || 'Two-factor setup failed');
    },
  });
}

export function useVerifyTwoFactor() {
  return useMutation({
    mutationFn: authApi.verifyTwoFactor,
    onSuccess: () => {
      toast.success('Two-factor authentication enabled!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Two-factor verification failed');
    },
  });
}

export function useDisableTwoFactor() {
  return useMutation({
    mutationFn: authApi.disableTwoFactor,
    onSuccess: () => {
      toast.success('Two-factor authentication disabled!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to disable two-factor authentication');
    },
  });
}

export function useRegenerateBackupCodes() {
  return useMutation({
    mutationFn: authApi.regenerateBackupCodes,
    onSuccess: () => {
      toast.success('Backup codes regenerated!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to regenerate backup codes');
    },
  });
}

// Session management hooks
export function useSessions() {
  return useQuery({
    queryKey: ['auth', 'sessions'],
    queryFn: async () => {
      const response = await authApi.getSessions();
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data;
    },
  });
}

export function useRevokeSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.revokeSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth', 'sessions'] });
      toast.success('Session revoked successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to revoke session');
    },
  });
}

export function useRevokeAllSessions() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.revokeAllSessions,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth', 'sessions'] });
      toast.success('All sessions revoked successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to revoke all sessions');
    },
  });
}

// Security settings hooks
export function useSecuritySettings() {
  return useQuery({
    queryKey: ['auth', 'security'],
    queryFn: async () => {
      const response = await authApi.getSecuritySettings();
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data;
    },
  });
}

export function useUpdateSecuritySettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.updateSecuritySettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth', 'security'] });
      toast.success('Security settings updated!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update security settings');
    },
  });
}

// Login attempts hook
export function useLoginAttempts() {
  return useQuery({
    queryKey: ['auth', 'login-attempts'],
    queryFn: async () => {
      const response = await authApi.getLoginAttempts();
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data;
    },
  });
}

// Rate limit hook
export function useRateLimit() {
  return useQuery({
    queryKey: ['auth', 'rate-limit'],
    queryFn: async () => {
      const response = await authApi.getRateLimitInfo();
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data;
    },
  });
}

// Delete account hook
export function useDeleteAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.deleteAccount,
    onSuccess: () => {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      queryClient.clear();
      toast.success('Account deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete account');
    },
  });
}
