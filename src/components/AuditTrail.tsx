import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  History, 
  Bot, 
  User, 
  FileText, 
  CheckCircle, 
  AlertCircle,
  Clock,
  Activity
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuditLogs } from '@/hooks/use-intake';

interface AuditTrailProps {
  sessionId: string;
  className?: string;
}

export default function AuditTrail({ sessionId, className }: AuditTrailProps) {
  const auditQuery = useAuditLogs(sessionId);
  const logs = auditQuery.data || [];

  const getActionIcon = (action: string) => {
    switch (action.toLowerCase()) {
      case 'message_sent':
        return <User className="h-4 w-4 text-blue-500" />;
      case 'ai_response':
        return <Bot className="h-4 w-4 text-primary" />;
      case 'qualification_updated':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'proposal_generated':
        return <FileText className="h-4 w-4 text-purple-500" />;
      case 'proposal_sent':
        return <FileText className="h-4 w-4 text-blue-500" />;
      case 'session_completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Activity className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getActionLabel = (action: string) => {
    switch (action.toLowerCase()) {
      case 'message_sent':
        return 'Message Sent';
      case 'ai_response':
        return 'AI Response';
      case 'qualification_updated':
        return 'Qualification Updated';
      case 'proposal_generated':
        return 'Proposal Generated';
      case 'proposal_sent':
        return 'Proposal Sent';
      case 'session_completed':
        return 'Session Completed';
      case 'error':
        return 'Error';
      default:
        return action;
    }
  };

  const getActionColor = (action: string) => {
    switch (action.toLowerCase()) {
      case 'message_sent':
        return 'bg-blue-500';
      case 'ai_response':
        return 'bg-primary';
      case 'qualification_updated':
        return 'bg-green-500';
      case 'proposal_generated':
        return 'bg-purple-500';
      case 'proposal_sent':
        return 'bg-blue-500';
      case 'session_completed':
        return 'bg-green-500';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (auditQuery.isLoading) {
    return (
      <Card className={cn('p-8', className)}>
        <div className="flex items-center justify-center space-x-2">
          <Clock className="h-6 w-6 animate-spin" />
          <span>Loading audit trail...</span>
        </div>
      </Card>
    );
  }

  return (
    <Card className={cn('h-full', className)}>
      <CardHeader>
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <History className="h-6 w-6 text-primary" />
          </div>
          <div>
            <CardTitle className="text-xl">Audit Trail</CardTitle>
            <p className="text-sm text-muted-foreground">
              Complete history of actions and events
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          <div className="space-y-4">
            {logs.length === 0 ? (
              <div className="text-center py-8">
                <History className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No audit logs</h3>
                <p className="text-muted-foreground">
                  Activity will appear here as the session progresses
                </p>
              </div>
            ) : (
              logs.map((log, index) => (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start space-x-3 p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-shrink-0">
                    {getActionIcon(log.action)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium text-sm">
                        {getActionLabel(log.action)}
                      </span>
                      <Badge 
                        variant="secondary" 
                        className={cn('px-2 py-1 text-xs', getActionColor(log.action))}
                      >
                        {log.action}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {log.details?.description || 'No description available'}
                    </p>
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>
                          {new Date(log.timestamp).toLocaleString()}
                        </span>
                      </div>
                      {log.user_id && (
                        <div className="flex items-center space-x-1">
                          <User className="h-3 w-3" />
                          <span>User {log.user_id}</span>
                        </div>
                      )}
                    </div>
                    {log.details && Object.keys(log.details).length > 1 && (
                      <details className="mt-2">
                        <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground">
                          View Details
                        </summary>
                        <pre className="mt-2 text-xs bg-muted p-2 rounded overflow-x-auto">
                          {JSON.stringify(log.details, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
