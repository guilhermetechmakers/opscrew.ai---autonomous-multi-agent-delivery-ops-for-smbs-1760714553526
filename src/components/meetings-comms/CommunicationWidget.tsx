import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Mail, 
  MessageSquare, 
  Send, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  MoreHorizontal,
  Eye
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import type { Communication } from '@/types';
import { cn } from '@/lib/utils';

interface CommunicationWidgetProps {
  communication: Communication;
  onSend?: (communication: Communication) => void;
  onSchedule?: (communication: Communication) => void;
  onCancel?: (communication: Communication) => void;
  onMarkAsRead?: (communication: Communication) => void;
  onEdit?: (communication: Communication) => void;
  className?: string;
}

const typeConfig = {
  email: {
    icon: Mail,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100 dark:bg-blue-900/20',
    label: 'Email'
  },
  slack: {
    icon: MessageSquare,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100 dark:bg-purple-900/20',
    label: 'Slack'
  },
  teams: {
    icon: MessageSquare,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100 dark:bg-blue-900/20',
    label: 'Teams'
  },
  discord: {
    icon: MessageSquare,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-100 dark:bg-indigo-900/20',
    label: 'Discord'
  },
  other: {
    icon: MessageSquare,
    color: 'text-gray-600',
    bgColor: 'bg-gray-100 dark:bg-gray-900/20',
    label: 'Other'
  }
};

const statusConfig = {
  draft: {
    icon: Clock,
    color: 'text-gray-600',
    bgColor: 'bg-gray-100 dark:bg-gray-900/20',
    label: 'Draft'
  },
  sent: {
    icon: Send,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100 dark:bg-blue-900/20',
    label: 'Sent'
  },
  delivered: {
    icon: CheckCircle,
    color: 'text-green-600',
    bgColor: 'bg-green-100 dark:bg-green-900/20',
    label: 'Delivered'
  },
  read: {
    icon: Eye,
    color: 'text-green-600',
    bgColor: 'bg-green-100 dark:bg-green-900/20',
    label: 'Read'
  },
  failed: {
    icon: AlertCircle,
    color: 'text-red-600',
    bgColor: 'bg-red-100 dark:bg-red-900/20',
    label: 'Failed'
  }
};

const priorityConfig = {
  low: { color: 'text-gray-600', bgColor: 'bg-gray-100 dark:bg-gray-900/20' },
  medium: { color: 'text-blue-600', bgColor: 'bg-blue-100 dark:bg-blue-900/20' },
  high: { color: 'text-orange-600', bgColor: 'bg-orange-100 dark:bg-orange-900/20' },
  urgent: { color: 'text-red-600', bgColor: 'bg-red-100 dark:bg-red-900/20' }
};

export function CommunicationWidget({ 
  communication, 
  onSend, 
  onSchedule, 
  onCancel, 
  onMarkAsRead, 
  onEdit,
  className 
}: CommunicationWidgetProps) {
  const type = typeConfig[communication.type];
  const status = statusConfig[communication.status];
  const priority = priorityConfig[communication.priority];
  const TypeIcon = type.icon;
  const StatusIcon = status.icon;
  
  const isDraft = communication.status === 'draft';
  const isRead = communication.status === 'read';
  const isScheduled = communication.scheduled_at && new Date(communication.scheduled_at) > new Date();
  
  const formatTime = (date: string) => {
    return format(new Date(date), 'MMM d, h:mm a');
  };
  
  const getTimeDisplay = () => {
    if (communication.sent_at) {
      return `Sent ${formatDistanceToNow(new Date(communication.sent_at), { addSuffix: true })}`;
    }
    if (communication.scheduled_at) {
      return `Scheduled for ${formatTime(communication.scheduled_at)}`;
    }
    return `Created ${formatDistanceToNow(new Date(communication.created_at), { addSuffix: true })}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className={cn('group', className)}
    >
      <Card className={cn(
        'card-hover border-l-4',
        priority.bgColor,
        'transition-all duration-200'
      )}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className={cn(
                'p-2 rounded-lg',
                type.bgColor
              )}>
                <TypeIcon className={cn('h-4 w-4', type.color)} />
              </div>
              <div className="flex-1 min-w-0">
                <CardTitle className="text-lg font-semibold line-clamp-1">
                  {communication.subject}
                </CardTitle>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge variant="secondary" className="text-xs">
                    {type.label}
                  </Badge>
                  <Badge 
                    variant={isRead ? 'default' : 'outline'}
                    className="text-xs"
                  >
                    {status.label}
                  </Badge>
                  <Badge 
                    variant="outline"
                    className={cn('text-xs', priority.color, priority.bgColor)}
                  >
                    {communication.priority}
                  </Badge>
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          <div className="space-y-3">
            {/* Content Preview */}
            <p className="text-sm text-muted-foreground line-clamp-2">
              {communication.content}
            </p>
            
            {/* Recipient */}
            {communication.recipient_name && (
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <span>To:</span>
                <div className="flex items-center space-x-1">
                  <Avatar className="h-4 w-4">
                    <AvatarImage src="" />
                    <AvatarFallback className="text-xs">
                      {communication.recipient_name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{communication.recipient_name}</span>
                </div>
              </div>
            )}
            
            {/* Time and Status */}
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <StatusIcon className="h-4 w-4" />
                <span>{getTimeDisplay()}</span>
              </div>
              {communication.channel && (
                <div className="flex items-center space-x-1">
                  <span className="text-xs bg-muted px-2 py-1 rounded">
                    #{communication.channel}
                  </span>
                </div>
              )}
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center space-x-2 pt-2">
              {isDraft && onSend && (
                <Button
                  size="sm"
                  onClick={() => onSend(communication)}
                  className="flex-1"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Send Now
                </Button>
              )}
              
              {isDraft && onSchedule && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onSchedule(communication)}
                >
                  <Clock className="h-4 w-4 mr-2" />
                  Schedule
                </Button>
              )}
              
              {isScheduled && onCancel && (
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => onCancel(communication)}
                  className="flex-1"
                >
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              )}
              
              {!isRead && onMarkAsRead && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onMarkAsRead(communication)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Mark Read
                </Button>
              )}
              
              {onEdit && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onEdit(communication)}
                >
                  Edit
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
