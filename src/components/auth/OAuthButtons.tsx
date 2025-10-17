import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useOAuthSignIn } from "@/hooks/use-auth";
import { 
  Github, 
  Chrome, 
  Square, 
  Loader2,
  ExternalLink 
} from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface OAuthButtonsProps {
  mode: "signin" | "signup";
  onSuccess?: () => void;
}

const oAuthProviders = [
  {
    id: "google" as const,
    name: "Google",
    icon: Chrome,
    color: "hover:bg-red-50 dark:hover:bg-red-950",
    textColor: "text-red-600 dark:text-red-400",
    borderColor: "border-red-200 dark:border-red-800",
  },
  {
    id: "github" as const,
    name: "GitHub",
    icon: Github,
    color: "hover:bg-gray-50 dark:hover:bg-gray-950",
    textColor: "text-gray-700 dark:text-gray-300",
    borderColor: "border-gray-200 dark:border-gray-800",
  },
  {
    id: "microsoft" as const,
    name: "Microsoft",
    icon: Square,
    color: "hover:bg-blue-50 dark:hover:bg-blue-950",
    textColor: "text-blue-600 dark:text-blue-400",
    borderColor: "border-blue-200 dark:border-blue-800",
  },
];

export function OAuthButtons({ mode, onSuccess }: OAuthButtonsProps) {
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);
  const oAuthSignInMutation = useOAuthSignIn();

  const handleOAuthClick = async (provider: "google" | "github" | "microsoft") => {
    try {
      setLoadingProvider(provider);
      
      // Get OAuth URL from backend
      const response = await fetch(`/api/auth/oauth/${provider}/url`);
      if (!response.ok) {
        throw new Error('Failed to get OAuth URL');
      }
      
      const { url, state } = await response.json();
      
      // Store state for verification
      localStorage.setItem('oauth_state', state);
      
      // Open OAuth popup
      const popup = window.open(
        url,
        'oauth',
        'width=500,height=600,scrollbars=yes,resizable=yes'
      );

      if (!popup) {
        throw new Error('Popup blocked. Please allow popups for this site.');
      }

      // Listen for OAuth callback
      const checkClosed = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkClosed);
          setLoadingProvider(null);
          
          // Check if we have the OAuth code in URL
          const urlParams = new URLSearchParams(window.location.search);
          const code = urlParams.get('code');
          const state = urlParams.get('state');
          const storedState = localStorage.getItem('oauth_state');
          
          if (code && state && state === storedState) {
            handleOAuthCallback(provider, code, state);
          }
        }
      }, 1000);

    } catch (error: any) {
      setLoadingProvider(null);
      toast.error(error.message || `Failed to sign in with ${provider}`);
    }
  };

  const handleOAuthCallback = async (
    provider: "google" | "github" | "microsoft",
    code: string,
    state: string
  ) => {
    try {
      const response = await oAuthSignInMutation.mutateAsync({
        provider,
        code,
        state,
      });

      if (response.data) {
        toast.success(`Signed in with ${provider} successfully!`);
        onSuccess?.();
      }
    } catch (error: any) {
      toast.error(error.message || `Failed to sign in with ${provider}`);
    } finally {
      // Clean up
      localStorage.removeItem('oauth_state');
      // Remove OAuth parameters from URL
      const url = new URL(window.location.href);
      url.searchParams.delete('code');
      url.searchParams.delete('state');
      window.history.replaceState({}, '', url.toString());
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator className="w-full" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {oAuthProviders.map((provider) => {
          const Icon = provider.icon;
          const isLoading = loadingProvider === provider.id;

          return (
            <motion.div
              key={provider.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                type="button"
                variant="outline"
                className={`w-full justify-start ${provider.color} ${provider.textColor} ${provider.borderColor}`}
                onClick={() => handleOAuthClick(provider.id)}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Icon className="mr-2 h-4 w-4" />
                )}
                {isLoading ? (
                  `Connecting to ${provider.name}...`
                ) : (
                  `${mode === 'signin' ? 'Sign in' : 'Sign up'} with ${provider.name}`
                )}
                {!isLoading && (
                  <ExternalLink className="ml-auto h-3 w-3" />
                )}
              </Button>
            </motion.div>
          );
        })}
      </div>

      <div className="text-center">
        <p className="text-xs text-muted-foreground">
          By continuing, you agree to our{" "}
          <a href="/terms" className="text-primary hover:underline">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="/privacy" className="text-primary hover:underline">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
}

// OAuth callback handler component
export function OAuthCallbackHandler() {
  const [isProcessing, setIsProcessing] = useState(true);
  const oAuthSignInMutation = useOAuthSignIn();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const state = urlParams.get('state');
        const provider = urlParams.get('provider') as "google" | "github" | "microsoft";
        
        const storedState = localStorage.getItem('oauth_state');
        
        if (code && state && provider && state === storedState) {
          const response = await oAuthSignInMutation.mutateAsync({
            provider,
            code,
            state,
          });

          if (response.data) {
            toast.success(`Signed in with ${provider} successfully!`);
            // Redirect to dashboard
            window.location.href = '/dashboard';
          }
        } else {
          throw new Error('Invalid OAuth callback');
        }
      } catch (error: any) {
        toast.error(error.message || 'OAuth authentication failed');
        // Redirect to login
        window.location.href = '/login';
      } finally {
        setIsProcessing(false);
        // Clean up
        localStorage.removeItem('oauth_state');
      }
    };

    handleCallback();
  }, [oAuthSignInMutation]);

  if (isProcessing) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary mb-4" />
            <h2 className="text-lg font-semibold mb-2">Completing sign in...</h2>
            <p className="text-sm text-muted-foreground">
              Please wait while we complete your authentication.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
}

export default OAuthButtons;
