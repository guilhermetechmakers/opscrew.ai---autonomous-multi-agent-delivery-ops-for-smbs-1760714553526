import { motion } from "motion/react";
import { Clock, CheckCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface ProvisioningProgressProps {
  isProvisioning: boolean;
  progress: number;
  currentStep?: string;
  className?: string;
}

export function ProvisioningProgress({ 
  isProvisioning, 
  progress, 
  currentStep,
  className 
}: ProvisioningProgressProps) {
  if (!isProvisioning && progress === 0) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className={cn(
        "space-y-6 rounded-xl p-6 border",
        isProvisioning 
          ? "bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20"
          : "bg-gradient-to-r from-green-500/10 to-green-600/10 border-green-500/20",
        className
      )}
    >
      <div className="flex items-center space-x-3">
        <div className={cn(
          "p-2 rounded-lg",
          isProvisioning ? "bg-primary/10" : "bg-green-500/10"
        )}>
          {isProvisioning ? (
            <Clock className="h-5 w-5 animate-spin text-primary" />
          ) : (
            <CheckCircle className="h-6 w-6 text-green-600" />
          )}
        </div>
        <div>
          <span className={cn(
            "text-lg font-semibold",
            isProvisioning ? "text-foreground" : "text-green-600 font-bold"
          )}>
            {isProvisioning ? "Provisioning your project..." : "Project provisioned successfully!"}
          </span>
          <p className="text-sm text-muted-foreground">
            {isProvisioning ? "This may take a few minutes" : "Your project is ready to use"}
          </p>
        </div>
      </div>
      
      {isProvisioning && (
        <div className="space-y-3">
          <Progress value={progress} className="w-full h-3" />
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              {currentStep || `${progress}% complete`}
            </p>
            <span className="text-sm font-mono text-primary">
              {Math.round(progress)}%
            </span>
          </div>
        </div>
      )}
    </motion.div>
  );
}