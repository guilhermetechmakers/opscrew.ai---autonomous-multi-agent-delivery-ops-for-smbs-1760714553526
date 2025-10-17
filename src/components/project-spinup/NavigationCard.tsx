import { motion } from "motion/react";
import { ArrowRight, ArrowLeft, Rocket, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface NavigationCardProps {
  currentStep: number;
  totalSteps: number;
  isProvisioning: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onDeploy: () => void;
  canProceed: boolean;
  className?: string;
}

export function NavigationCard({ 
  currentStep, 
  totalSteps, 
  isProvisioning,
  onPrevious, 
  onNext, 
  onDeploy,
  canProceed,
  className 
}: NavigationCardProps) {
  const isLastStep = currentStep === totalSteps;
  const isFirstStep = currentStep === 1;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className={cn("", className)}
    >
      <Card className="card-elevated">
        <CardContent className="p-6">
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={onPrevious}
              disabled={isFirstStep}
              className="flex-1 h-12 text-base hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
            
            {!isLastStep ? (
              <Button
                onClick={onNext}
                disabled={!canProceed}
                className="flex-1 h-12 text-base hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={onDeploy}
                disabled={isProvisioning || !canProceed}
                className="flex-1 h-12 text-base hover:scale-105 transition-all duration-200 disabled:hover:scale-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProvisioning ? (
                  <>
                    <Clock className="h-4 w-4 mr-2 animate-spin" />
                    Provisioning...
                  </>
                ) : (
                  <>
                    <Rocket className="h-4 w-4 mr-2" />
                    Deploy Project
                  </>
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}