import apiClient, { type ApiResponse } from "./client";
import type {
  AuthResponse,
  SignInInput,
  SignUpInput,
  OAuthSignInInput,
  RefreshTokenInput,
  ForgotPasswordInput,
  ResetPasswordInput,
  VerifyEmailInput,
  ResendVerificationInput,
  TwoFactorSetup,
  TwoFactorVerifyInput,
  TwoFactorDisableInput,
  Session,
  SecuritySettings,
  LoginAttempt,
  RateLimitInfo,
  User
} from '@/types';

// Authentication API endpoints
export const authApi = {
  // Basic authentication
  async signIn(input: SignInInput): Promise<ApiResponse<AuthResponse>> {
    try {
      const response = await apiClient.post('/auth/signin', input);
      return { data: response.data, error: null };
    } catch (error: any) {
      return { data: null, error: error.response?.data?.message || 'Sign in failed' };
    }
  },

  async signUp(input: SignUpInput): Promise<ApiResponse<AuthResponse>> {
    try {
      const response = await apiClient.post('/auth/signup', input);
      return { data: response.data, error: null };
    } catch (error: any) {
      return { data: null, error: error.response?.data?.message || 'Sign up failed' };
    }
  },

  async signOut(): Promise<ApiResponse<void>> {
    try {
      await apiClient.post('/auth/signout');
      return { data: null, error: null };
    } catch (error: any) {
      return { data: null, error: error.response?.data?.message || 'Sign out failed' };
    }
  },

  // OAuth authentication
  async getOAuthUrl(provider: 'google' | 'github' | 'microsoft'): Promise<ApiResponse<{ url: string; state: string }>> {
    try {
      const response = await apiClient.get(`/auth/oauth/${provider}/url`);
      return { data: response.data, error: null };
    } catch (error: any) {
      return { data: null, error: error.response?.data?.message || 'Failed to get OAuth URL' };
    }
  },

  async signInWithOAuth(input: OAuthSignInInput): Promise<ApiResponse<AuthResponse>> {
    try {
      const response = await apiClient.post('/auth/oauth/callback', input);
      return { data: response.data, error: null };
    } catch (error: any) {
      return { data: null, error: error.response?.data?.message || 'OAuth sign in failed' };
    }
  },

  // Token management
  async refreshToken(input: RefreshTokenInput): Promise<ApiResponse<AuthResponse>> {
    try {
      const response = await apiClient.post('/auth/refresh', input);
      return { data: response.data, error: null };
    } catch (error: any) {
      return { data: null, error: error.response?.data?.message || 'Token refresh failed' };
    }
  },

  async revokeToken(): Promise<ApiResponse<void>> {
    try {
      await apiClient.post('/auth/revoke');
      return { data: null, error: null };
    } catch (error: any) {
      return { data: null, error: error.response?.data?.message || 'Token revocation failed' };
    }
  },

  // Password management
  async forgotPassword(input: ForgotPasswordInput): Promise<ApiResponse<void>> {
    try {
      await apiClient.post('/auth/forgot-password', input);
      return { data: null, error: null };
    } catch (error: any) {
      return { data: null, error: error.response?.data?.message || 'Password reset request failed' };
    }
  },

  async resetPassword(input: ResetPasswordInput): Promise<ApiResponse<void>> {
    try {
      await apiClient.post('/auth/reset-password', input);
      return { data: null, error: null };
    } catch (error: any) {
      return { data: null, error: error.response?.data?.message || 'Password reset failed' };
    }
  },

  async changePassword(input: { current_password: string; new_password: string; confirm_password: string }): Promise<ApiResponse<void>> {
    try {
      await apiClient.post('/auth/change-password', input);
      return { data: null, error: null };
    } catch (error: any) {
      return { data: null, error: error.response?.data?.message || 'Password change failed' };
    }
  },

  // Email verification
  async verifyEmail(input: VerifyEmailInput): Promise<ApiResponse<void>> {
    try {
      await apiClient.post('/auth/verify-email', input);
      return { data: null, error: null };
    } catch (error: any) {
      return { data: null, error: error.response?.data?.message || 'Email verification failed' };
    }
  },

  async resendVerification(input: ResendVerificationInput): Promise<ApiResponse<void>> {
    try {
      await apiClient.post('/auth/resend-verification', input);
      return { data: null, error: null };
    } catch (error: any) {
      return { data: null, error: error.response?.data?.message || 'Resend verification failed' };
    }
  },

  // Two-factor authentication
  async setupTwoFactor(): Promise<ApiResponse<TwoFactorSetup>> {
    try {
      const response = await apiClient.post('/auth/2fa/setup');
      return { data: response.data, error: null };
    } catch (error: any) {
      return { data: null, error: error.response?.data?.message || 'Two-factor setup failed' };
    }
  },

  async verifyTwoFactor(input: TwoFactorVerifyInput): Promise<ApiResponse<void>> {
    try {
      await apiClient.post('/auth/2fa/verify', input);
      return { data: null, error: null };
    } catch (error: any) {
      return { data: null, error: error.response?.data?.message || 'Two-factor verification failed' };
    }
  },

  async disableTwoFactor(input: TwoFactorDisableInput): Promise<ApiResponse<void>> {
    try {
      await apiClient.post('/auth/2fa/disable', input);
      return { data: null, error: null };
    } catch (error: any) {
      return { data: null, error: error.response?.data?.message || 'Two-factor disable failed' };
    }
  },

  async regenerateBackupCodes(): Promise<ApiResponse<string[]>> {
    try {
      const response = await apiClient.post('/auth/2fa/backup-codes');
      return { data: response.data, error: null };
    } catch (error: any) {
      return { data: null, error: error.response?.data?.message || 'Backup codes regeneration failed' };
    }
  },

  // Session management
  async getSessions(): Promise<ApiResponse<Session[]>> {
    try {
      const response = await apiClient.get('/auth/sessions');
      return { data: response.data, error: null };
    } catch (error: any) {
      return { data: null, error: error.response?.data?.message || 'Failed to fetch sessions' };
    }
  },

  async revokeSession(sessionId: string): Promise<ApiResponse<void>> {
    try {
      await apiClient.delete(`/auth/sessions/${sessionId}`);
      return { data: null, error: null };
    } catch (error: any) {
      return { data: null, error: error.response?.data?.message || 'Session revocation failed' };
    }
  },

  async revokeAllSessions(): Promise<ApiResponse<void>> {
    try {
      await apiClient.delete('/auth/sessions');
      return { data: null, error: null };
    } catch (error: any) {
      return { data: null, error: error.response?.data?.message || 'All sessions revocation failed' };
    }
  },

  // Security settings
  async getSecuritySettings(): Promise<ApiResponse<SecuritySettings>> {
    try {
      const response = await apiClient.get('/auth/security');
      return { data: response.data, error: null };
    } catch (error: any) {
      return { data: null, error: error.response?.data?.message || 'Failed to fetch security settings' };
    }
  },

  async updateSecuritySettings(input: Partial<SecuritySettings>): Promise<ApiResponse<SecuritySettings>> {
    try {
      const response = await apiClient.patch('/auth/security', input);
      return { data: response.data, error: null };
    } catch (error: any) {
      return { data: null, error: error.response?.data?.message || 'Security settings update failed' };
    }
  },

  // Login attempts and security
  async getLoginAttempts(): Promise<ApiResponse<LoginAttempt[]>> {
    try {
      const response = await apiClient.get('/auth/login-attempts');
      return { data: response.data, error: null };
    } catch (error: any) {
      return { data: null, error: error.response?.data?.message || 'Failed to fetch login attempts' };
    }
  },

  async getRateLimitInfo(): Promise<ApiResponse<RateLimitInfo>> {
    try {
      const response = await apiClient.get('/auth/rate-limit');
      return { data: response.data, error: null };
    } catch (error: any) {
      return { data: null, error: error.response?.data?.message || 'Failed to fetch rate limit info' };
    }
  },

  // User profile
  async getCurrentUser(): Promise<ApiResponse<User>> {
    try {
      const response = await apiClient.get('/auth/me');
      return { data: response.data, error: null };
    } catch (error: any) {
      return { data: null, error: error.response?.data?.message || 'Failed to fetch user profile' };
    }
  },

  async updateProfile(input: Partial<User>): Promise<ApiResponse<User>> {
    try {
      const response = await apiClient.patch('/auth/profile', input);
      return { data: response.data, error: null };
    } catch (error: any) {
      return { data: null, error: error.response?.data?.message || 'Profile update failed' };
    }
  },

  async deleteAccount(password: string): Promise<ApiResponse<void>> {
    try {
      await apiClient.delete('/auth/account', { data: { password } });
      return { data: null, error: null };
    } catch (error: any) {
      return { data: null, error: error.response?.data?.message || 'Account deletion failed' };
    }
  }
};

export default authApi;
