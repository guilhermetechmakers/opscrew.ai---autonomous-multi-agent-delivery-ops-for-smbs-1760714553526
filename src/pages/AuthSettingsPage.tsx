import { motion } from "motion/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Shield, 
  Key, 
  Mail, 
  Eye, 
  EyeOff, 
  Loader2,
  CheckCircle,
  AlertTriangle,
  Settings
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { 
  useChangePassword, 
  useUpdateProfile, 
  useSecuritySettings, 
  useUpdateSecuritySettings,
  useDisableTwoFactor
} from "@/hooks/use-auth";
import { 
  changePasswordSchema, 
  updateProfileSchema, 
  securitySettingsSchema,
  type ChangePasswordFormData,
  type UpdateProfileFormData,
  type SecuritySettingsFormData
} from "@/lib/validations/auth";
import { TwoFactorSetup } from "@/components/auth/TwoFactorSetup";
import { SessionManagement } from "@/components/auth/SessionManagement";

export default function AuthSettingsPage() {
  const { user, updateUser } = useAuth();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showTwoFactorSetup, setShowTwoFactorSetup] = useState(false);

  const changePasswordMutation = useChangePassword();
  const updateProfileMutation = useUpdateProfile();
  const { data: securitySettings } = useSecuritySettings();
  const updateSecuritySettingsMutation = useUpdateSecuritySettings();
  const disableTwoFactorMutation = useDisableTwoFactor();

  const passwordForm = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
  });

  const profileForm = useForm<UpdateProfileFormData>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      full_name: user?.full_name || '',
      avatar_url: user?.avatar_url || '',
    },
  });

  const securityForm = useForm<SecuritySettingsFormData>({
    resolver: zodResolver(securitySettingsSchema),
    defaultValues: {
      login_notifications: securitySettings?.login_notifications || false,
      suspicious_activity_alerts: securitySettings?.suspicious_activity_alerts || false,
    },
  });

  const handlePasswordChange = async (data: ChangePasswordFormData) => {
    try {
      await changePasswordMutation.mutateAsync(data);
      passwordForm.reset();
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  const handleProfileUpdate = async (data: UpdateProfileFormData) => {
    try {
      const response = await updateProfileMutation.mutateAsync(data);
      if (response.data) {
        updateUser(response.data);
      }
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  const handleSecuritySettingsUpdate = async (data: SecuritySettingsFormData) => {
    try {
      await updateSecuritySettingsMutation.mutateAsync(data);
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  const handleTwoFactorToggle = async () => {
    if (user?.two_factor_enabled) {
      // Disable 2FA
      try {
        await disableTwoFactorMutation.mutateAsync({
          password: '', // This would need to be collected from user
          code: '', // This would need to be collected from user
        });
      } catch (error) {
        // Error is handled by the mutation
      }
    } else {
      // Enable 2FA
      setShowTwoFactorSetup(true);
    }
  };

  if (showTwoFactorSetup) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <TwoFactorSetup
            onSuccess={() => {
              setShowTwoFactorSetup(false);
              // Refresh user data
              window.location.reload();
            }}
            onCancel={() => setShowTwoFactorSetup(false)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <div className="flex items-center space-x-2">
            <Settings className="h-6 w-6" />
            <h1 className="text-3xl font-bold">Security Settings</h1>
          </div>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="password">Password</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="sessions">Sessions</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Mail className="h-5 w-5" />
                    <span>Profile Information</span>
                  </CardTitle>
                  <CardDescription>
                    Update your personal information
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={profileForm.handleSubmit(handleProfileUpdate)} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="full_name">Full Name</Label>
                      <Input
                        id="full_name"
                        {...profileForm.register("full_name")}
                        placeholder="Enter your full name"
                      />
                      {profileForm.formState.errors.full_name && (
                        <p className="text-sm text-destructive">
                          {profileForm.formState.errors.full_name.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="avatar_url">Avatar URL</Label>
                      <Input
                        id="avatar_url"
                        {...profileForm.register("avatar_url")}
                        placeholder="Enter avatar URL"
                      />
                      {profileForm.formState.errors.avatar_url && (
                        <p className="text-sm text-destructive">
                          {profileForm.formState.errors.avatar_url.message}
                        </p>
                      )}
                    </div>
                    <Button
                      type="submit"
                      disabled={updateProfileMutation.isPending}
                    >
                      {updateProfileMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        'Update Profile'
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="password" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Key className="h-5 w-5" />
                    <span>Change Password</span>
                  </CardTitle>
                  <CardDescription>
                    Update your password to keep your account secure
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={passwordForm.handleSubmit(handlePasswordChange)} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="current_password">Current Password</Label>
                      <div className="relative">
                        <Input
                          id="current_password"
                          type={showCurrentPassword ? "text" : "password"}
                          {...passwordForm.register("current_password")}
                          placeholder="Enter current password"
                          className="pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        >
                          {showCurrentPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      {passwordForm.formState.errors.current_password && (
                        <p className="text-sm text-destructive">
                          {passwordForm.formState.errors.current_password.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new_password">New Password</Label>
                      <div className="relative">
                        <Input
                          id="new_password"
                          type={showNewPassword ? "text" : "password"}
                          {...passwordForm.register("new_password")}
                          placeholder="Enter new password"
                          className="pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                          {showNewPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      {passwordForm.formState.errors.new_password && (
                        <p className="text-sm text-destructive">
                          {passwordForm.formState.errors.new_password.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm_password">Confirm New Password</Label>
                      <div className="relative">
                        <Input
                          id="confirm_password"
                          type={showConfirmPassword ? "text" : "password"}
                          {...passwordForm.register("confirm_password")}
                          placeholder="Confirm new password"
                          className="pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      {passwordForm.formState.errors.confirm_password && (
                        <p className="text-sm text-destructive">
                          {passwordForm.formState.errors.confirm_password.message}
                        </p>
                      )}
                    </div>
                    <Button
                      type="submit"
                      disabled={changePasswordMutation.isPending}
                    >
                      {changePasswordMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        'Update Password'
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="h-5 w-5" />
                    <span>Security Settings</span>
                  </CardTitle>
                  <CardDescription>
                    Manage your account security preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h3 className="font-medium">Two-Factor Authentication</h3>
                      <p className="text-sm text-muted-foreground">
                        Add an extra layer of security to your account
                      </p>
                      <div className="flex items-center space-x-2">
                        {user?.two_factor_enabled ? (
                          <div className="flex items-center space-x-1 text-green-600">
                            <CheckCircle className="h-4 w-4" />
                            <span className="text-sm">Enabled</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-1 text-amber-600">
                            <AlertTriangle className="h-4 w-4" />
                            <span className="text-sm">Disabled</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <Button
                      onClick={handleTwoFactorToggle}
                      variant={user?.two_factor_enabled ? "destructive" : "default"}
                      disabled={disableTwoFactorMutation.isPending}
                    >
                      {disableTwoFactorMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {user?.two_factor_enabled ? 'Disabling...' : 'Enabling...'}
                        </>
                      ) : (
                        user?.two_factor_enabled ? 'Disable 2FA' : 'Enable 2FA'
                      )}
                    </Button>
                  </div>

                  <form onSubmit={securityForm.handleSubmit(handleSecuritySettingsUpdate)} className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label htmlFor="login_notifications">Login Notifications</Label>
                        <p className="text-sm text-muted-foreground">
                          Get notified when someone signs in to your account
                        </p>
                      </div>
                      <Switch
                        id="login_notifications"
                        checked={securityForm.watch("login_notifications")}
                        onCheckedChange={(checked) => securityForm.setValue("login_notifications", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label htmlFor="suspicious_activity_alerts">Suspicious Activity Alerts</Label>
                        <p className="text-sm text-muted-foreground">
                          Get alerted about unusual account activity
                        </p>
                      </div>
                      <Switch
                        id="suspicious_activity_alerts"
                        checked={securityForm.watch("suspicious_activity_alerts")}
                        onCheckedChange={(checked) => securityForm.setValue("suspicious_activity_alerts", checked)}
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={updateSecuritySettingsMutation.isPending}
                    >
                      {updateSecuritySettingsMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        'Update Security Settings'
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="sessions" className="space-y-6">
              <SessionManagement />
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}
