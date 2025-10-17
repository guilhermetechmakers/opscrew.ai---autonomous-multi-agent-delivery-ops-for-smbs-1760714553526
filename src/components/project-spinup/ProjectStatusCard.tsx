import { motion } from "motion/react";
import { Activity, GitBranch, Server, Monitor, CreditCard, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface ProjectStatusCardProps {
  className?: string;
}

export function ProjectStatusCard({ className }: ProjectStatusCardProps) {
  const statusItems = [
    { 
      icon: GitBranch, 
      label: "Repository", 
      status: "Pending",
      statusVariant: "warning" as const
    },
    { 
      icon: Server, 
      label: "Infrastructure", 
      status: "Pending",
      statusVariant: "warning" as const
    },
    { 
      icon: Monitor, 
      label: "Client Portal", 
      status: "Pending",
      statusVariant: "warning" as const
    }
  ];

  const getStatusBadge = (variant: string) => {
    switch (variant) {
      case "success":
        return "badge-success";
      case "warning":
        return "badge-warning";
      case "error":
        return "badge-error";
      default:
        return "badge-info";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className={cn("", className)}
    >
      <Card className="card-elevated">
        <CardHeader className="bg-gradient-to-r from-card to-card/50 border-b border-border/50">
          <CardTitle className="flex items-center text-lg">
            <div className="p-2 rounded-lg bg-primary/10 mr-3">
              <Activity className="h-5 w-5 text-primary" />
            </div>
            Project Status
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="space-y-4">
            {statusItems.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className="flex items-center justify-between py-2"
              >
                <span className="text-sm font-medium flex items-center">
                  <item.icon className="h-4 w-4 mr-2 text-muted-foreground" />
                  {item.label}
                </span>
                <Badge className={getStatusBadge(item.statusVariant)}>
                  {item.status}
                </Badge>
              </motion.div>
            ))}
          </div>
          
          <Separator className="bg-border/50" />
          
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2">
              <span className="text-sm font-semibold flex items-center">
                <CreditCard className="h-4 w-4 mr-2 text-muted-foreground" />
                Total Cost
              </span>
              <span className="text-lg font-mono font-bold text-primary">$0.00/month</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm font-semibold flex items-center">
                <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                Estimated Time
              </span>
              <span className="text-sm font-medium">2-5 minutes</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}