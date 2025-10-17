import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Save, 
  Send, 
  Edit3, 
  DollarSign, 
  Calendar,
  Users,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  useProposal, 
  useUpdateProposal, 
  useSendProposal 
} from '@/hooks/use-intake';

interface ProposalEditorProps {
  proposalId: string;
  onProposalSent?: (proposalId: string) => void;
  className?: string;
}

export default function ProposalEditor({ 
  proposalId, 
  onProposalSent,
  className 
}: ProposalEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState('');

  // API hooks
  const proposalQuery = useProposal(proposalId);
  const updateProposalMutation = useUpdateProposal();
  const sendProposalMutation = useSendProposal();

  const proposal = proposalQuery.data;

  // Initialize edited content when proposal loads
  useEffect(() => {
    if (proposal?.content && !editedContent) {
      setEditedContent(proposal.content);
    }
  }, [proposal?.content, editedContent]);

  const handleSave = () => {
    if (!proposal || !editedContent) return;

    updateProposalMutation.mutate(
      { 
        proposalId: proposal.id, 
        updates: { content: editedContent } 
      },
      {
        onSuccess: () => {
          setIsEditing(false);
        }
      }
    );
  };

  const handleSend = () => {
    if (!proposal) return;

    sendProposalMutation.mutate(proposal.id, {
      onSuccess: (data) => {
        if (data.data && onProposalSent) {
          onProposalSent(data.data.id);
        }
      }
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-yellow-500';
      case 'sent': return 'bg-blue-500';
      case 'signed': return 'bg-green-500';
      case 'rejected': return 'bg-red-500';
      case 'expired': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'draft': return 'Draft';
      case 'sent': return 'Sent';
      case 'signed': return 'Signed';
      case 'rejected': return 'Rejected';
      case 'expired': return 'Expired';
      default: return 'Unknown';
    }
  };

  if (proposalQuery.isLoading) {
    return (
      <Card className={cn('p-8', className)}>
        <div className="flex items-center justify-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading proposal...</span>
        </div>
      </Card>
    );
  }

  if (proposalQuery.error || !proposal) {
    return (
      <Card className={cn('p-8', className)}>
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Failed to load proposal</h3>
          <p className="text-muted-foreground">
            {proposalQuery.error?.message || 'Proposal not found'}
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl">{proposal.title}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Created {new Date(proposal.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Badge 
                variant="secondary" 
                className={cn('px-3 py-1', getStatusColor(proposal.status))}
              >
                {getStatusLabel(proposal.status)}
              </Badge>
              {proposal.status === 'draft' && (
                <Button
                  onClick={() => setIsEditing(!isEditing)}
                  variant="outline"
                  size="sm"
                >
                  <Edit3 className="h-4 w-4 mr-2" />
                  {isEditing ? 'Cancel' : 'Edit'}
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Pricing Summary */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center space-x-2">
            <DollarSign className="h-5 w-5" />
            <span>Pricing Summary</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold font-mono text-primary mb-1">
                ${proposal.pricing.total_price.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Total Price</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold font-mono mb-1">
                ${proposal.pricing.base_price.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Base Price</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold mb-1">
                {proposal.pricing.currency}
              </div>
              <div className="text-sm text-muted-foreground">Currency</div>
            </div>
          </div>
          
          {proposal.pricing.adjustments.length > 0 && (
            <>
              <Separator className="my-4" />
              <div className="space-y-2">
                <h4 className="font-semibold">Adjustments</h4>
                {proposal.pricing.adjustments.map((adjustment, index) => (
                  <div key={index} className="flex justify-between items-center py-1">
                    <span className="text-sm">{adjustment.name}</span>
                    <span className="text-sm font-mono">
                      {adjustment.type === 'add' ? '+' : adjustment.type === 'multiply' ? '×' : '-'}
                      ${adjustment.amount.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Terms & Timeline */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Timeline</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <Label className="text-sm font-medium">Duration</Label>
                <p className="text-sm text-muted-foreground">{proposal.terms.duration}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Payment Terms</Label>
                <p className="text-sm text-muted-foreground">{proposal.pricing.payment_terms}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Deliverables</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {proposal.terms.deliverables.map((deliverable, index) => (
                <li key={index} className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">{deliverable}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Content Editor */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Proposal Content</CardTitle>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <div className="space-y-4">
              <Textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className="min-h-[400px] font-mono text-sm"
                placeholder="Enter proposal content..."
              />
              <div className="flex justify-end space-x-2">
                <Button
                  onClick={() => setIsEditing(false)}
                  variant="outline"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={updateProposalMutation.isPending}
                >
                  {updateProposalMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  Save Changes
                </Button>
              </div>
            </div>
          ) : (
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <div className="whitespace-pre-wrap font-mono text-sm bg-muted p-4 rounded-lg">
                {proposal.content}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Milestones */}
      {proposal.terms.milestones.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Project Milestones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {proposal.terms.milestones.map((milestone, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 border border-border rounded-lg"
                >
                  <div>
                    <h4 className="font-semibold">{milestone.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      Due: {new Date(milestone.due_date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold font-mono">
                      ${milestone.amount.toLocaleString()}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      {proposal.status === 'draft' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-end space-x-3"
        >
          <Button
            onClick={handleSend}
            disabled={sendProposalMutation.isPending}
            size="lg"
          >
            {sendProposalMutation.isPending ? (
              <Loader2 className="h-5 w-5 animate-spin mr-2" />
            ) : (
              <Send className="h-5 w-5 mr-2" />
            )}
            Send Proposal
          </Button>
        </motion.div>
      )}
    </div>
  );
}
