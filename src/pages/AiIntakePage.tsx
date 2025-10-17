import { useState } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Bot, 
  FileText, 
  Settings, 
  ArrowLeft,
  CheckCircle,
  Target
} from 'lucide-react';
import AiIntakeChat from '@/components/AiIntakeChat';
import ProposalEditor from '@/components/ProposalEditor';
import QualificationRulesManager from '@/components/QualificationRulesManager';
import ESignatureIntegration from '@/components/ESignatureIntegration';
import AuditTrail from '@/components/AuditTrail';
import type { IntakeSession } from '@/types';

export default function AiIntakePage() {
  const [activeTab, setActiveTab] = useState('chat');
  const [currentSession, setCurrentSession] = useState<IntakeSession | null>(null);
  const [currentProposalId, setCurrentProposalId] = useState<string | null>(null);

  const handleSessionComplete = (session: IntakeSession) => {
    setCurrentSession(session);
    setActiveTab('proposal');
  };

  const handleProposalGenerated = (proposalId: string) => {
    setCurrentProposalId(proposalId);
    setActiveTab('proposal');
  };

  const handleBackToChat = () => {
    setActiveTab('chat');
    setCurrentSession(null);
    setCurrentProposalId(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.history.back()}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Bot className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">AI Intake & Proposal Generation</h1>
                  <p className="text-sm text-muted-foreground">
                    Qualify leads and generate proposals automatically
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {currentSession && (
                <Badge variant="secondary" className="px-3 py-1">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Session Active
                </Badge>
              )}
              {currentProposalId && (
                <Badge variant="secondary" className="px-3 py-1">
                  <FileText className="h-3 w-3 mr-1" />
                  Proposal Ready
                </Badge>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="chat" className="flex items-center space-x-2">
              <Bot className="h-4 w-4" />
              <span>AI Chat</span>
            </TabsTrigger>
            <TabsTrigger 
              value="proposal" 
              className="flex items-center space-x-2"
              disabled={!currentProposalId}
            >
              <FileText className="h-4 w-4" />
              <span>Proposal Editor</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="chat" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl flex items-center space-x-2">
                    <Target className="h-5 w-5" />
                    <span>Lead Qualification Chat</span>
                  </CardTitle>
                  <p className="text-muted-foreground">
                    Start a conversation with our AI intake agent to qualify leads and gather information for proposal generation.
                  </p>
                </CardHeader>
                <CardContent>
                  <AiIntakeChat
                    onSessionComplete={handleSessionComplete}
                    onProposalGenerated={handleProposalGenerated}
                    className="h-[600px]"
                  />
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="proposal" className="space-y-6">
            {currentProposalId ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold">Proposal Editor</h2>
                    <p className="text-muted-foreground">
                      Review and edit the generated proposal before sending
                    </p>
                  </div>
                  <Button onClick={handleBackToChat} variant="outline">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Chat
                  </Button>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <ProposalEditor
                      proposalId={currentProposalId}
                      onProposalSent={(proposalId) => {
                        console.log('Proposal sent:', proposalId);
                        // Handle proposal sent
                      }}
                    />
                  </div>
                  <div className="space-y-6">
                    <ESignatureIntegration
                      proposalId={currentProposalId}
                      onDocumentCreated={(documentId) => {
                        console.log('E-signature document created:', documentId);
                      }}
                    />
                    {currentSession && (
                      <AuditTrail sessionId={currentSession.id} />
                    )}
                  </div>
                </div>
              </motion.div>
            ) : (
              <Card className="p-8">
                <div className="text-center">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Proposal Available</h3>
                  <p className="text-muted-foreground mb-4">
                    Complete a lead qualification session to generate a proposal.
                  </p>
                  <Button onClick={() => setActiveTab('chat')}>
                    <Bot className="h-4 w-4 mr-2" />
                    Start Chat Session
                  </Button>
                </div>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <QualificationRulesManager />
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
