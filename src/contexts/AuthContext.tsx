import { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import authApi from '@/api/auth';
import type { User, SignInInput, SignUpInput, OAuthSignInInput } from '@/types';

// Auth state interface
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
}

// Auth actions
type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_AUTHENTICATED'; payload: boolean }
  | { type: 'SET_INITIALIZED'; payload: boolean }
  | { type: 'LOGOUT' };

// Auth context interface
interface AuthContextType extends AuthState {
  signIn: (input: SignInInput) => Promise<boolean>;
  signUp: (input: SignUpInput) => Promise<boolean>;
  signOut: () => Promise<void>;
  signInWithOAuth: (input: OAuthSignInInput) => Promise<boolean>;
  refreshUser: () => Promise<void>;
  updateUser: (user: Partial<User>) => Promise<boolean>;
}

// Initial state
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  isInitialized: false,
};

// Auth reducer
function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_USER':
      return { ...state, user: action.payload, isAuthenticated: !!action.payload };
    case 'SET_AUTHENTICATED':
      return { ...state, isAuthenticated: action.payload };
    case 'SET_INITIALIZED':
      return { ...state, isInitialized: action.payload };
    case 'LOGOUT':
      return { ...initialState, isInitialized: true };
    default:
      return state;
  }
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider component
interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const queryClient = useQueryClient();

  // Check if user is authenticated on mount
  const { data: userData, isLoading: userLoading, error: userError } = useQuery({
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
    // Don't automatically refetch on window focus or mount if no token
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  // Initialize auth state
  useEffect(() => {
    if (userLoading) {
      dispatch({ type: 'SET_LOADING', payload: true });
    } else {
      dispatch({ type: 'SET_LOADING', payload: false });
      dispatch({ type: 'SET_INITIALIZED', payload: true });
      
      if (userData) {
        dispatch({ type: 'SET_USER', payload: userData });
      } else if (userError) {
        dispatch({ type: 'SET_USER', payload: null });
      }
    }
  }, [userData, userLoading, userError]);

  // Sign in mutation
  const signInMutation = useMutation({
    mutationFn: authApi.signIn,
    onSuccess: (response) => {
      if (response.data) {
        const { user, access_token, refresh_token } = response.data;
        localStorage.setItem('access_token', access_token);
        localStorage.setItem('refresh_token', refresh_token);
        dispatch({ type: 'SET_USER', payload: user });
        queryClient.setQueryData(['auth', 'user'], user);
        toast.success('Welcome back!');
      }
    },
    onError: (error: any) => {
      toast.error(error.message || 'Sign in failed');
    },
  });

  // Sign up mutation
  const signUpMutation = useMutation({
    mutationFn: authApi.signUp,
    onSuccess: (response) => {
      if (response.data) {
        const { user, access_token, refresh_token } = response.data;
        localStorage.setItem('access_token', access_token);
        localStorage.setItem('refresh_token', refresh_token);
        dispatch({ type: 'SET_USER', payload: user });
        queryClient.setQueryData(['auth', 'user'], user);
        toast.success('Account created successfully!');
      }
    },
    onError: (error: any) => {
      toast.error(error.message || 'Sign up failed');
    },
  });

  // Sign out mutation
  const signOutMutation = useMutation({
    mutationFn: authApi.signOut,
    onSuccess: () => {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      dispatch({ type: 'LOGOUT' });
      queryClient.clear();
      toast.success('Signed out successfully');
    },
    onError: (error: any) => {
      // Even if API call fails, clear local state
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      dispatch({ type: 'LOGOUT' });
      queryClient.clear();
      toast.error(error.message || 'Sign out failed');
    },
  });

  // OAuth sign in mutation
  const oAuthSignInMutation = useMutation({
    mutationFn: authApi.signInWithOAuth,
    onSuccess: (response) => {
      if (response.data) {
        const { user, access_token, refresh_token } = response.data;
        localStorage.setItem('access_token', access_token);
        localStorage.setItem('refresh_token', refresh_token);
        dispatch({ type: 'SET_USER', payload: user });
        queryClient.setQueryData(['auth', 'user'], user);
        toast.success('Signed in successfully!');
      }
    },
    onError: (error: any) => {
      toast.error(error.message || 'OAuth sign in failed');
    },
  });

  // Update user mutation
  const updateUserMutation = useMutation({
    mutationFn: authApi.updateProfile,
    onSuccess: (response) => {
      if (response.data) {
        dispatch({ type: 'SET_USER', payload: response.data });
        queryClient.setQueryData(['auth', 'user'], response.data);
        toast.success('Profile updated successfully!');
      }
    },
    onError: (error: any) => {
      toast.error(error.message || 'Profile update failed');
    },
  });

  // Auth methods
  const signIn = async (input: SignInInput): Promise<boolean> => {
    try {
      const response = await signInMutation.mutateAsync(input);
      return !!response.data;
    } catch {
      return false;
    }
  };

  const signUp = async (input: SignUpInput): Promise<boolean> => {
    try {
      const response = await signUpMutation.mutateAsync(input);
      return !!response.data;
    } catch {
      return false;
    }
  };

  const signOut = async (): Promise<void> => {
    await signOutMutation.mutateAsync();
  };

  const signInWithOAuth = async (input: OAuthSignInInput): Promise<boolean> => {
    try {
      const response = await oAuthSignInMutation.mutateAsync(input);
      return !!response.data;
    } catch {
      return false;
    }
  };

  const refreshUser = async (): Promise<void> => {
    try {
      const response = await authApi.getCurrentUser();
      if (response.data) {
        dispatch({ type: 'SET_USER', payload: response.data });
        queryClient.setQueryData(['auth', 'user'], response.data);
      }
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
  };

  const updateUser = async (user: Partial<User>): Promise<boolean> => {
    try {
      const response = await updateUserMutation.mutateAsync(user);
      return !!response.data;
    } catch {
      return false;
    }
  };

  const value: AuthContextType = {
    ...state,
    signIn,
    signUp,
    signOut,
    signInWithOAuth,
    refreshUser,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use auth context
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
