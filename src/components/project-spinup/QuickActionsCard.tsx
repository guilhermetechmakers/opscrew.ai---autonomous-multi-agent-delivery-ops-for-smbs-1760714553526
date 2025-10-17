import { motion } from "motion/react";
import { Zap, Plus, GitBranch, Server } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface QuickActionsCardProps {
  onNewProject: () => void;
  onCloneRepository: () => void;
  onDeployInfrastructure: () => void;
  className?: string;
}

export function QuickActionsCard({ 
  onNewProject, 
  onCloneRepository, 
  onDeployInfrastructure,
  className 
}: QuickActionsCardProps) {
  const actions = [
    {
      icon: Plus,
      label: "New Project",
      onClick: onNewProject,
      description: "Start a fresh project"
    },
    {
      icon: GitBranch,
      label: "Clone Repository",
      onClick: onCloneRepository,
      description: "Import existing code"
    },
    {
      icon: Server,
      label: "Deploy Infrastructure",
      onClick: onDeployInfrastructure,
      description: "Set up hosting"
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className={cn("", className)}
    >
      <Card className="card-elevated">
        <CardHeader className="bg-gradient-to-r from-card to-card/50 border-b border-border/50">
          <CardTitle className="flex items-center text-lg">
            <div className="p-2 rounded-lg bg-primary/10 mr-3">
              <Zap className="h-5 w-5 text-primary" />
            </div>
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-3">
          {actions.map((action, index) => (
            <motion.div
              key={action.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <Button 
                className="w-full justify-start h-12 text-base hover:scale-105 transition-all duration-200" 
                variant="outline"
                onClick={action.onClick}
              >
                <action.icon className="h-4 w-4 mr-3" />
                <div className="text-left">
                  <div className="font-medium">{action.label}</div>
                  <div className="text-xs text-muted-foreground">{action.description}</div>
                </div>
              </Button>
            </motion.div>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  );
}