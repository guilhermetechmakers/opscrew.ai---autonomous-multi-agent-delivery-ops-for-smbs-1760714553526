import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Calendar, 
  Clock, 
  Users, 
  Video, 
  Play, 
  Pause, 
  MoreHorizontal,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import type { Meeting } from '@/types';
import { cn } from '@/lib/utils';

interface MeetingCardProps {
  meeting: Meeting;
  onJoin?: (meeting: Meeting) => void;
  onStart?: (meeting: Meeting) => void;
  onEnd?: (meeting: Meeting) => void;
  onEdit?: (meeting: Meeting) => void;
  className?: string;
}

const statusConfig = {
  scheduled: {
    icon: Calendar,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100 dark:bg-blue-900/20',
    borderColor: 'border-blue-200 dark:border-blue-800'
  },
  in_progress: {
    icon: Play,
    color: 'text-green-600',
    bgColor: 'bg-green-100 dark:bg-green-900/20',
    borderColor: 'border-green-200 dark:border-green-800'
  },
  completed: {
    icon: CheckCircle,
    color: 'text-gray-600',
    bgColor: 'bg-gray-100 dark:bg-gray-900/20',
    borderColor: 'border-gray-200 dark:border-gray-800'
  },
  cancelled: {
    icon: XCircle,
    color: 'text-red-600',
    bgColor: 'bg-red-100 dark:bg-red-900/20',
    borderColor: 'border-red-200 dark:border-red-800'
  }
};

const meetingTypeConfig = {
  standup: { label: 'Standup', color: 'bg-blue-500' },
  sprint_planning: { label: 'Sprint Planning', color: 'bg-purple-500' },
  retrospective: { label: 'Retrospective', color: 'bg-orange-500' },
  client_call: { label: 'Client Call', color: 'bg-green-500' },
  internal: { label: 'Internal', color: 'bg-gray-500' },
  other: { label: 'Other', color: 'bg-slate-500' }
};

export function MeetingCard({ 
  meeting, 
  onJoin, 
  onStart, 
  onEnd, 
  onEdit, 
  className 
}: MeetingCardProps) {
  const status = statusConfig[meeting.status];
  const typeConfig = meetingTypeConfig[meeting.meeting_type];
  const StatusIcon = status.icon;
  
  const isUpcoming = new Date(meeting.start_time) > new Date();
  const isInProgress = meeting.status === 'in_progress';
  const isCompleted = meeting.status === 'completed';
  
  const formatTime = (date: string) => {
    return format(new Date(date), 'MMM d, h:mm a');
  };
  
  const getTimeDisplay = () => {
    if (isInProgress) {
      return 'In Progress';
    }
    if (isCompleted) {
      return `Ended ${formatDistanceToNow(new Date(meeting.end_time), { addSuffix: true })}`;
    }
    if (isUpcoming) {
      return `Starts ${formatDistanceToNow(new Date(meeting.start_time), { addSuffix: true })}`;
    }
    return formatTime(meeting.start_time);
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
        status.borderColor,
        'transition-all duration-200'
      )}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className={cn(
                'p-2 rounded-lg',
                status.bgColor
              )}>
                <StatusIcon className={cn('h-4 w-4', status.color)} />
              </div>
              <div>
                <CardTitle className="text-lg font-semibold line-clamp-1">
                  {meeting.title}
                </CardTitle>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge variant="secondary" className={cn('text-xs', typeConfig.color)}>
                    {typeConfig.label}
                  </Badge>
                  <Badge 
                    variant={isInProgress ? 'default' : 'outline'}
                    className="text-xs"
                  >
                    {meeting.status.replace('_', ' ')}
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
            {/* Description */}
            {meeting.description && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {meeting.description}
              </p>
            )}
            
            {/* Time and Duration */}
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{getTimeDisplay()}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>{formatTime(meeting.start_time)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="font-mono text-xs">
                  {meeting.duration}m
                </span>
              </div>
            </div>
            
            {/* Participants */}
            {meeting.participants.length > 0 && (
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <div className="flex -space-x-2">
                  {meeting.participants.slice(0, 3).map((participant) => (
                    <Avatar key={participant.id} className="h-6 w-6 border-2 border-background">
                      <AvatarImage src="" />
                      <AvatarFallback className="text-xs">
                        {participant.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                  {meeting.participants.length > 3 && (
                    <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                      +{meeting.participants.length - 3}
                    </div>
                  )}
                </div>
                <span className="text-xs text-muted-foreground">
                  {meeting.participants.length} participant{meeting.participants.length !== 1 ? 's' : ''}
                </span>
              </div>
            )}
            
            {/* Action Buttons */}
            <div className="flex items-center space-x-2 pt-2">
              {isUpcoming && onJoin && (
                <Button
                  size="sm"
                  onClick={() => onJoin(meeting)}
                  className="flex-1"
                >
                  <Video className="h-4 w-4 mr-2" />
                  Join Meeting
                </Button>
              )}
              
              {isInProgress && onEnd && (
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => onEnd(meeting)}
                  className="flex-1"
                >
                  <Pause className="h-4 w-4 mr-2" />
                  End Meeting
                </Button>
              )}
              
              {isUpcoming && onStart && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onStart(meeting)}
                >
                  <Play className="h-4 w-4 mr-2" />
                  Start
                </Button>
              )}
              
              {onEdit && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onEdit(meeting)}
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
