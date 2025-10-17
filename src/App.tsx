import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "@/components/ui/toaster";
import LandingPage from "@/pages/LandingPage";
import LoginPage from "@/pages/LoginPage";
import SignupPage from "@/pages/SignupPage";
import ForgotPasswordPage from "@/pages/ForgotPasswordPage";
import ResetPasswordPage from "@/pages/ResetPasswordPage";
import AuthSettingsPage from "@/pages/AuthSettingsPage";
import Dashboard from "@/pages/Dashboard";
import AiIntakePage from "@/pages/AiIntakePage";
import ProjectSpinUpConsole from "@/pages/ProjectSpinUpConsole";
import SprintTaskPlanner from "@/pages/SprintTaskPlanner";
import MeetingsComms from "@/pages/MeetingsComms";
import NotFound from "@/pages/NotFound";

// React Query client with optimal defaults
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="ui-theme">
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
              <Route path="/auth-settings" element={<AuthSettingsPage />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/ai-intake" element={<AiIntakePage />} />
              <Route path="/project-spinup" element={<ProjectSpinUpConsole />} />
              <Route path="/sprint-task-planner" element={<SprintTaskPlanner />} />
              <Route path="/meetings-comms" element={<MeetingsComms />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
          <Toaster />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
