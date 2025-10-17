import { motion } from "motion/react";
import { CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
  id: number;
  title: string;
  description: string;
}

interface ProgressStepsProps {
  steps: Step[];
  currentStep: number;
  onStepClick?: (stepId: number) => void;
  className?: string;
}

export function ProgressSteps({ 
  steps, 
  currentStep, 
  onStepClick, 
  className 
}: ProgressStepsProps) {
  return (
    <div className={cn("space-y-8", className)}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent mb-2">
            Project Spin-Up Console
          </h1>
          <p className="text-lg text-muted-foreground">
            Automate your project setup with AI-powered provisioning
          </p>
        </div>
        <div className="text-right">
          <div className="text-sm text-muted-foreground mb-1">Progress</div>
          <div className="text-2xl font-bold text-primary">
            {currentStep} / {steps.length}
          </div>
        </div>
      </div>
      
      <div className="relative">
        <div className="absolute top-4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <motion.div 
              key={step.id} 
              className="flex flex-col items-center relative z-10"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <motion.div 
                className={cn(
                  "flex items-center justify-center w-12 h-12 rounded-full text-sm font-semibold",
                  "transition-all duration-300 hover:scale-110 cursor-pointer",
                  currentStep >= step.id 
                    ? 'bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/25' 
                    : 'bg-card border-2 border-border text-muted-foreground hover:border-primary/50'
                )}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onStepClick?.(step.id)}
              >
                {currentStep > step.id ? (
                  <CheckCircle className="h-5 w-5" />
                ) : (
                  step.id
                )}
              </motion.div>
              <div className="mt-3 text-center">
                <div className="text-sm font-semibold text-foreground">{step.title}</div>
                <div className="text-xs text-muted-foreground mt-1 max-w-24">{step.description}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}