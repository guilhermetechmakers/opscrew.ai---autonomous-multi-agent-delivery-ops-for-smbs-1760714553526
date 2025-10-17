import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { 
  Shield, 
  Copy, 
  Check, 
  Download, 
  AlertTriangle,
  Loader2,
  QrCode
} from "lucide-react";
import { useSetupTwoFactor, useVerifyTwoFactor } from "@/hooks/use-auth";
import { twoFactorVerifySchema, type TwoFactorVerifyFormData } from "@/lib/validations/auth";
import { toast } from "sonner";
import QRCode from "qrcode";

interface TwoFactorSetupProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function TwoFactorSetup({ onSuccess, onCancel }: TwoFactorSetupProps) {
  const [step, setStep] = useState<'setup' | 'verify' | 'complete'>('setup');
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [secret, setSecret] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const setupTwoFactorMutation = useSetupTwoFactor();
  const verifyTwoFactorMutation = useVerifyTwoFactor();

  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<TwoFactorVerifyFormData>({
    resolver: zodResolver(twoFactorVerifySchema),
  });

  const code = watch("code");

  const handleSetup = async () => {
    try {
      const response = await setupTwoFactorMutation.mutateAsync();
      if (response.data) {
        setSecret(response.data.secret);
        setBackupCodes(response.data.backup_codes);
        
        // Generate QR code
        const qrCodeDataURL = await QRCode.toDataURL(response.data.qr_code);
        setQrCodeUrl(qrCodeDataURL);
        
        setStep('verify');
      }
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  const handleVerify = async (data: TwoFactorVerifyFormData) => {
    try {
      await verifyTwoFactorMutation.mutateAsync(data);
      setStep('complete');
      onSuccess?.();
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success('Copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy to clipboard');
    }
  };

  const downloadBackupCodes = () => {
    const content = `OpsCrew.ai - Two-Factor Authentication Backup Codes\n\n` +
      `Generated: ${new Date().toLocaleString()}\n\n` +
      `IMPORTANT: Store these codes in a safe place. Each code can only be used once.\n\n` +
      backupCodes.map((code, index) => `${index + 1}. ${code}`).join('\n') +
      `\n\nIf you lose access to your authenticator app, you can use these codes to sign in.`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'opscrew-2fa-backup-codes.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (step === 'setup') {
    return (
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
            <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <CardTitle className="text-2xl">Enable Two-Factor Authentication</CardTitle>
          <CardDescription>
            Add an extra layer of security to your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">
                <span className="text-sm font-semibold text-primary">1</span>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium">Install an authenticator app</h3>
                <p className="text-sm text-muted-foreground">
                  Download Google Authenticator, Authy, or any compatible TOTP app on your phone.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">
                <span className="text-sm font-semibold text-primary">2</span>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium">Scan the QR code</h3>
                <p className="text-sm text-muted-foreground">
                  Use your authenticator app to scan the QR code we'll generate for you.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">
                <span className="text-sm font-semibold text-primary">3</span>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium">Enter verification code</h3>
                <p className="text-sm text-muted-foreground">
                  Enter the 6-digit code from your authenticator app to complete setup.
                </p>
              </div>
            </div>
          </div>

          <div className="flex space-x-3">
            <Button
              onClick={handleSetup}
              disabled={setupTwoFactorMutation.isPending}
              className="flex-1"
            >
              {setupTwoFactorMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Setting up...
                </>
              ) : (
                'Start Setup'
              )}
            </Button>
            {onCancel && (
              <Button variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (step === 'verify') {
    return (
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
            <QrCode className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <CardTitle className="text-2xl">Scan QR Code</CardTitle>
          <CardDescription>
            Use your authenticator app to scan this QR code
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center space-y-4">
            {qrCodeUrl && (
              <div className="rounded-lg border p-4">
                <img src={qrCodeUrl} alt="QR Code" className="h-48 w-48" />
              </div>
            )}
            
            <div className="w-full space-y-2">
              <Label className="text-sm font-medium">Or enter this secret key manually:</Label>
              <div className="flex items-center space-x-2">
                <Input
                  value={secret}
                  readOnly
                  className="font-mono text-sm"
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(secret)}
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit(handleVerify)} className="space-y-4">
            <div className="space-y-2">
              <Label>Enter verification code</Label>
              <div className="flex justify-center">
                <InputOTP
                  maxLength={6}
                  value={code}
                  onChange={(value) => setValue("code", value)}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
              {errors.code && (
                <p className="text-sm text-destructive text-center">{errors.code.message}</p>
              )}
            </div>

            <div className="flex space-x-3">
              <Button
                type="submit"
                disabled={isSubmitting || !code || code.length !== 6}
                className="flex-1"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  'Verify & Enable'
                )}
              </Button>
              <Button variant="outline" onClick={() => setStep('setup')}>
                Back
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    );
  }

  if (step === 'complete') {
    return (
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
            <Check className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <CardTitle className="text-2xl">Two-Factor Authentication Enabled</CardTitle>
          <CardDescription>
            Your account is now protected with 2FA
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5" />
              <div className="space-y-2">
                <h3 className="font-medium text-amber-800 dark:text-amber-200">
                  Save your backup codes
                </h3>
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  These codes can be used to access your account if you lose your authenticator device.
                  Each code can only be used once.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Backup codes:</Label>
              <div className="grid grid-cols-2 gap-2 font-mono text-sm">
                {backupCodes.map((code, index) => (
                  <div key={index} className="rounded border p-2 text-center">
                    {code}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex space-x-3">
              <Button
                onClick={downloadBackupCodes}
                variant="outline"
                className="flex-1"
              >
                <Download className="mr-2 h-4 w-4" />
                Download Codes
              </Button>
              <Button
                onClick={() => copyToClipboard(backupCodes.join('\n'))}
                variant="outline"
                className="flex-1"
              >
                <Copy className="mr-2 h-4 w-4" />
                Copy All
              </Button>
            </div>
          </div>

          <div className="flex justify-center">
            <Button onClick={onSuccess} className="w-full">
              Complete Setup
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return null;
}

export default TwoFactorSetup;
