import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  FileText, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  TrendingUp,
  Users,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import type { MeetingSummary, ActionItem, Decision } from '@/types';
import { cn } from '@/lib/utils';

interface MeetingSummaryCardProps {
  summary: MeetingSummary;
  actionItems?: ActionItem[];
  decisions?: Decision[];
  onGenerate?: () => void;
  onViewDetails?: () => void;
  className?: string;
}

const statusConfig = {
  generating: {
    icon: RefreshCw,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100 dark:bg-blue-900/20',
    label: 'Generating...'
  },
  completed: {
    icon: CheckCircle,
    color: 'text-green-600',
    bgColor: 'bg-green-100 dark:bg-green-900/20',
    label: 'Completed'
  },
  failed: {
    icon: AlertCircle,
    color: 'text-red-600',
    bgColor: 'bg-red-100 dark:bg-red-900/20',
    label: 'Failed'
  }
};

const sentimentConfig = {
  positive: {
    color: 'text-green-600',
    bgColor: 'bg-green-100 dark:bg-green-900/20',
    icon: TrendingUp
  },
  neutral: {
    color: 'text-gray-600',
    bgColor: 'bg-gray-100 dark:bg-gray-900/20',
    icon: Clock
  },
  negative: {
    color: 'text-red-600',
    bgColor: 'bg-red-100 dark:bg-red-900/20',
    icon: AlertCircle
  }
};

export function MeetingSummaryCard({ 
  summary, 
  actionItems = [], 
  decisions = [], 
  onGenerate, 
  onViewDetails,
  className 
}: MeetingSummaryCardProps) {
  const status = statusConfig[summary.status];
  const sentiment = sentimentConfig[summary.sentiment];
  const SentimentIcon = sentiment.icon;
  
  const completedActionItems = actionItems.filter(item => item.status === 'completed').length;
  const totalActionItems = actionItems.length;
  const completionRate = totalActionItems > 0 ? (completedActionItems / totalActionItems) * 100 : 0;
  
  const isGenerating = summary.status === 'generating';
  const isCompleted = summary.status === 'completed';
  const isFailed = summary.status === 'failed';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className={cn('group', className)}
    >
      <Card className="card-hover">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className={cn(
                'p-2 rounded-lg',
                status.bgColor
              )}>
                <status.icon className={cn('h-4 w-4', status.color, isGenerating && 'animate-spin')} />
              </div>
              <div>
                <CardTitle className="text-lg font-semibold">
                  Meeting Summary
                </CardTitle>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge variant={isCompleted ? 'default' : 'outline'}>
                    {status.label}
                  </Badge>
                  {isCompleted && (
                    <Badge variant="secondary" className={cn(sentiment.color, sentiment.bgColor)}>
                      <SentimentIcon className="h-3 w-3 mr-1" />
                      {summary.sentiment}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            {onGenerate && !isGenerating && (
              <Button
                size="sm"
                variant="outline"
                onClick={onGenerate}
                disabled={isGenerating}
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Generate
              </Button>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          {isGenerating && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>AI is analyzing the meeting and generating a summary...</span>
              </div>
              <Progress value={33} className="h-2" />
            </div>
          )}
          
          {isFailed && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-sm text-red-600">
                <AlertCircle className="h-4 w-4" />
                <span>Failed to generate summary. Please try again.</span>
              </div>
              {onGenerate && (
                <Button
                  size="sm"
                  onClick={onGenerate}
                  className="w-full"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Retry
                </Button>
              )}
            </div>
          )}
          
          {isCompleted && (
            <div className="space-y-4">
              {/* Key Points */}
              {summary.key_points.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold mb-2 flex items-center">
                    <FileText className="h-4 w-4 mr-2" />
                    Key Points
                  </h4>
                  <ul className="space-y-1">
                    {summary.key_points.slice(0, 3).map((point, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-start">
                        <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 mr-2 flex-shrink-0" />
                        <span className="line-clamp-2">{point}</span>
                      </li>
                    ))}
                    {summary.key_points.length > 3 && (
                      <li className="text-xs text-muted-foreground">
                        +{summary.key_points.length - 3} more points
                      </li>
                    )}
                  </ul>
                </div>
              )}
              
              {/* Action Items Progress */}
              {totalActionItems > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-semibold flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Action Items
                    </h4>
                    <span className="text-xs text-muted-foreground">
                      {completedActionItems}/{totalActionItems}
                    </span>
                  </div>
                  <Progress value={completionRate} className="h-2" />
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-muted-foreground">
                      {Math.round(completionRate)}% completed
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {totalActionItems - completedActionItems} pending
                    </span>
                  </div>
                </div>
              )}
              
              {/* Decisions */}
              {decisions.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold mb-2 flex items-center">
                    <Users className="h-4 w-4 mr-2" />
                    Decisions Made
                  </h4>
                  <div className="space-y-1">
                    {decisions.slice(0, 2).map((decision) => (
                      <div key={decision.id} className="text-sm">
                        <div className="font-medium line-clamp-1">{decision.title}</div>
                        <div className="text-xs text-muted-foreground line-clamp-1">
                          by {decision.decision_maker}
                        </div>
                      </div>
                    ))}
                    {decisions.length > 2 && (
                      <div className="text-xs text-muted-foreground">
                        +{decisions.length - 2} more decisions
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {/* Next Steps */}
              {summary.next_steps.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold mb-2">Next Steps</h4>
                  <ul className="space-y-1">
                    {summary.next_steps.slice(0, 2).map((step, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-start">
                        <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 mr-2 flex-shrink-0" />
                        <span className="line-clamp-1">{step}</span>
                      </li>
                    ))}
                    {summary.next_steps.length > 2 && (
                      <li className="text-xs text-muted-foreground">
                        +{summary.next_steps.length - 2} more steps
                      </li>
                    )}
                  </ul>
                </div>
              )}
              
              {/* Confidence Score */}
              <div className="flex items-center justify-between pt-2 border-t">
                <span className="text-xs text-muted-foreground">AI Confidence</span>
                <div className="flex items-center space-x-2">
                  <Progress value={summary.confidence_score} className="w-16 h-1.5" />
                  <span className="text-xs font-mono">{summary.confidence_score}%</span>
                </div>
              </div>
              
              {/* View Details Button */}
              {onViewDetails && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={onViewDetails}
                  className="w-full mt-3"
                >
                  View Full Summary
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
