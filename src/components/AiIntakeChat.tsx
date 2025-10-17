import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Bot, 
  Send, 
  User, 
  Loader2, 
  CheckCircle,
  FileText,
  Target
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  useCreateSession, 
  useSession, 
  useSendMessage, 
  useAIResponse,
  useCompleteSession,
  useQualification,
  useGenerateProposal
} from '@/hooks/use-intake';
import type { ChatMessage, IntakeSession } from '@/types';

interface AiIntakeChatProps {
  onSessionComplete?: (session: IntakeSession) => void;
  onProposalGenerated?: (proposalId: string) => void;
  className?: string;
}

export default function AiIntakeChat({ 
  onSessionComplete, 
  onProposalGenerated,
  className 
}: AiIntakeChatProps) {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentAIMessage, setCurrentAIMessage] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // API hooks
  const createSessionMutation = useCreateSession();
  const sessionQuery = useSession(sessionId || '', !!sessionId);
  const sendMessageMutation = useSendMessage();
  const aiResponseMutation = useAIResponse();
  const completeSessionMutation = useCompleteSession();
  const qualificationQuery = useQualification(sessionId || '', !!sessionId);
  const generateProposalMutation = useGenerateProposal();

  const session = sessionQuery.data;
  const qualification = qualificationQuery.data;

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, [session?.messages, currentAIMessage]);

  // Initialize session on mount
  useEffect(() => {
    if (!sessionId && !createSessionMutation.isPending) {
      createSessionMutation.mutate(undefined, {
        onSuccess: (data) => {
          if (data.data) {
            setSessionId(data.data.id);
            // Send initial AI greeting
            setTimeout(() => {
              handleAIResponse(data.data!.id);
            }, 1000);
          }
        }
      });
    }
  }, [sessionId, createSessionMutation]);

  const handleSendMessage = async () => {
    if (!message.trim() || !sessionId || sendMessageMutation.isPending) return;

    const userMessage = message.trim();
    setMessage('');

    // Send user message
    sendMessageMutation.mutate(
      { sessionId, message: userMessage },
      {
        onSuccess: () => {
          // Get AI response
          handleAIResponse(sessionId);
        }
      }
    );
  };

  const handleAIResponse = async (sessionId: string) => {
    setIsTyping(true);
    setCurrentAIMessage('');

    try {
      await aiResponseMutation.mutateAsync({
        sessionId,
        onChunk: (chunk: string) => {
          setCurrentAIMessage(prev => prev + chunk);
        }
      });
    } catch (error) {
      console.error('AI response error:', error);
    } finally {
      setIsTyping(false);
      setCurrentAIMessage('');
    }
  };

  const handleCompleteSession = () => {
    if (!sessionId) return;

    completeSessionMutation.mutate(sessionId, {
      onSuccess: (data) => {
        if (data.data && onSessionComplete) {
          onSessionComplete(data.data);
        }
      }
    });
  };

  const handleGenerateProposal = () => {
    if (!sessionId) return;

    generateProposalMutation.mutate(
      { sessionId },
      {
        onSuccess: (data) => {
          if (data.data && onProposalGenerated) {
            onProposalGenerated(data.data.id);
          }
        }
      }
    );
  };

  const getQualificationColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getQualificationLabel = (score: number) => {
    if (score >= 80) return 'High';
    if (score >= 60) return 'Medium';
    return 'Low';
  };

  return (
    <div className={cn('flex flex-col h-full', className)}>
      {/* Header */}
      <Card className="mb-4">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Bot className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">AI Intake Agent</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Let's qualify your lead and generate a proposal
                </p>
              </div>
            </div>
            {qualification && (
              <div className="flex items-center space-x-2">
                <Badge 
                  variant="secondary" 
                  className={cn(
                    'px-3 py-1',
                    getQualificationColor(qualification.score)
                  )}
                >
                  {getQualificationLabel(qualification.score)} Quality
                </Badge>
                <span className="text-sm font-mono">
                  {qualification.score}/100
                </span>
              </div>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Chat Messages */}
      <Card className="flex-1 flex flex-col min-h-0">
        <CardContent className="flex-1 p-0">
          <ScrollArea ref={scrollAreaRef} className="h-full">
            <div className="p-6 space-y-6">
              <AnimatePresence>
                {session?.messages?.map((msg: ChatMessage) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className={cn(
                      'flex items-start space-x-3',
                      msg.role === 'user' ? 'justify-end' : 'justify-start'
                    )}
                  >
                    {msg.role === 'assistant' && (
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Bot className="h-5 w-5 text-primary" />
                      </div>
                    )}
                    <div
                      className={cn(
                        'max-w-[80%] rounded-2xl px-4 py-3',
                        msg.role === 'user'
                          ? 'bg-primary text-primary-foreground ml-12'
                          : 'bg-muted mr-12'
                      )}
                    >
                      <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {new Date(msg.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                    {msg.role === 'user' && (
                      <div className="p-2 bg-muted rounded-lg">
                        <User className="h-5 w-5 text-muted-foreground" />
                      </div>
                    )}
                  </motion.div>
                ))}

                {/* Current AI message being typed */}
                {isTyping && currentAIMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-start space-x-3"
                  >
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Bot className="h-5 w-5 text-primary" />
                    </div>
                    <div className="max-w-[80%] rounded-2xl px-4 py-3 bg-muted mr-12">
                      <p className="text-sm whitespace-pre-wrap">{currentAIMessage}</p>
                      <div className="flex items-center space-x-1 mt-1">
                        <Loader2 className="h-3 w-3 animate-spin" />
                        <span className="text-xs opacity-70">AI is typing...</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Empty state */}
              {(!session?.messages || session.messages.length === 0) && !isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12"
                >
                  <Bot className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Welcome to AI Intake</h3>
                  <p className="text-muted-foreground">
                    I'll help you qualify this lead and generate a proposal.
                  </p>
                </motion.div>
              )}
            </div>
          </ScrollArea>
        </CardContent>

        {/* Input Area */}
        <div className="p-4 border-t border-border">
          <div className="flex space-x-2">
            <Input
              ref={inputRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="Type your message..."
              disabled={sendMessageMutation.isPending || isTyping}
              className="flex-1"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!message.trim() || sendMessageMutation.isPending || isTyping}
              size="sm"
            >
              {sendMessageMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </Card>

      {/* Qualification Summary */}
      {qualification && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4"
        >
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center space-x-2">
                <Target className="h-5 w-5" />
                <span>Lead Qualification</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {Object.entries(qualification.criteria).map(([key, criteria]) => (
                  <div key={key} className="text-center">
                    <div className="text-2xl font-bold font-mono mb-1">
                      {criteria.score}
                    </div>
                    <div className="text-xs text-muted-foreground capitalize mb-2">
                      {key}
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className={cn(
                          'h-2 rounded-full transition-all duration-500',
                          getQualificationColor(criteria.score)
                        )}
                        style={{ width: `${criteria.score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <Separator className="my-4" />
              <div className="space-y-2">
                <h4 className="font-semibold">Assessment</h4>
                <p className="text-sm text-muted-foreground">
                  {qualification.overall_assessment}
                </p>
                {qualification.recommended_actions.length > 0 && (
                  <div className="mt-3">
                    <h4 className="font-semibold mb-2">Recommended Actions</h4>
                    <ul className="space-y-1">
                      {qualification.recommended_actions.map((action, index) => (
                        <li key={index} className="text-sm text-muted-foreground flex items-center space-x-2">
                          <CheckCircle className="h-3 w-3 text-green-500" />
                          <span>{action}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Action Buttons */}
      {session?.status === 'active' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 flex space-x-3"
        >
          <Button
            onClick={handleCompleteSession}
            disabled={completeSessionMutation.isPending}
            variant="outline"
            className="flex-1"
          >
            {completeSessionMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <CheckCircle className="h-4 w-4 mr-2" />
            )}
            Complete Session
          </Button>
          <Button
            onClick={handleGenerateProposal}
            disabled={generateProposalMutation.isPending || !qualification}
            className="flex-1"
          >
            {generateProposalMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <FileText className="h-4 w-4 mr-2" />
            )}
            Generate Proposal
          </Button>
        </motion.div>
      )}
    </div>
  );
}
