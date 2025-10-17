import { motion } from "motion/react";
import { CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { ProjectConfig } from "@/types";

interface ConfigurationSummaryProps {
  config: ProjectConfig;
  className?: string;
}

export function ConfigurationSummary({ config, className }: ConfigurationSummaryProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className={cn("space-y-6", className)}
    >
      <h3 className="text-xl font-bold flex items-center">
        <CheckCircle className="h-5 w-5 mr-2 text-primary" />
        Configuration Summary
      </h3>
      <Card className="card-elevated">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex justify-between items-center py-2 border-b border-border/50">
              <span className="text-muted-foreground font-medium">Project Name:</span>
              <span className="font-semibold text-foreground">
                {config.name || "Not specified"}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border/50">
              <span className="text-muted-foreground font-medium">Environment:</span>
              <Badge variant="outline" className="capitalize">
                {config.environment}
              </Badge>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border/50">
              <span className="text-muted-foreground font-medium">Repository:</span>
              <span className="font-semibold text-foreground">
                {config.repository.name || "Not specified"}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border/50">
              <span className="text-muted-foreground font-medium">Template:</span>
              <Badge variant="secondary">
                {config.repository.template}
              </Badge>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border/50">
              <span className="text-muted-foreground font-medium">Infrastructure:</span>
              <Badge variant="outline">
                {config.infrastructure.provider}
              </Badge>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border/50">
              <span className="text-muted-foreground font-medium">Client Portal:</span>
              <Badge variant={config.clientPortal.enabled ? "default" : "secondary"}>
                {config.clientPortal.enabled ? "Enabled" : "Disabled"}
              </Badge>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border/50">
              <span className="text-muted-foreground font-medium">Tech Stack:</span>
              <div className="flex flex-wrap gap-1">
                {config.techStack.slice(0, 3).map((tech) => (
                  <Badge key={tech} variant="outline" className="text-xs">
                    {tech}
                  </Badge>
                ))}
                {config.techStack.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{config.techStack.length - 3}
                  </Badge>
                )}
              </div>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-muted-foreground font-medium">Region:</span>
              <span className="font-semibold text-foreground">
                {config.infrastructure.region}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}