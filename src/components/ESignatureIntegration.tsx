import { useState } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  FileSignature, 
  Send, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  ExternalLink,
  Loader2,
  User,
  Mail
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { proposalApi } from '@/api/intake';
import type { ESignDocument } from '@/types';

interface ESignatureIntegrationProps {
  proposalId: string;
  onDocumentCreated?: (documentId: string) => void;
  className?: string;
}

export default function ESignatureIntegration({ 
  proposalId, 
  onDocumentCreated,
  className 
}: ESignatureIntegrationProps) {
  const [signers, setSigners] = useState<Array<{ email: string; name: string }>>([
    { email: '', name: '' }
  ]);
  const [isCreating, setIsCreating] = useState(false);
  const [document, setDocument] = useState<ESignDocument | null>(null);

  const handleAddSigner = () => {
    setSigners([...signers, { email: '', name: '' }]);
  };

  const handleRemoveSigner = (index: number) => {
    if (signers.length > 1) {
      setSigners(signers.filter((_, i) => i !== index));
    }
  };

  const handleSignerChange = (index: number, field: 'email' | 'name', value: string) => {
    const newSigners = [...signers];
    newSigners[index][field] = value;
    setSigners(newSigners);
  };

  const handleCreateDocument = async () => {
    const validSigners = signers.filter(s => s.email && s.name);
    if (validSigners.length === 0) {
      alert('Please add at least one signer');
      return;
    }

    setIsCreating(true);
    try {
      const response = await proposalApi.createESignDocument(proposalId, validSigners);
      if (response.data) {
        setDocument(response.data);
        if (onDocumentCreated) {
          onDocumentCreated(response.data.id);
        }
      }
    } catch (error) {
      console.error('Failed to create e-signature document:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'sent': return 'bg-blue-500';
      case 'signed': return 'bg-green-500';
      case 'declined': return 'bg-red-500';
      case 'expired': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'Pending';
      case 'sent': return 'Sent';
      case 'signed': return 'Signed';
      case 'declined': return 'Declined';
      case 'expired': return 'Expired';
      default: return 'Unknown';
    }
  };

  const getSignerStatusIcon = (status: string) => {
    switch (status) {
      case 'signed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'declined': return <AlertCircle className="h-4 w-4 text-red-500" />;
      default: return <Clock className="h-4 w-4 text-yellow-500" />;
    }
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <FileSignature className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl">E-Signature Integration</CardTitle>
              <p className="text-sm text-muted-foreground">
                Send proposals for electronic signature using DocuSign or HelloSign
              </p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {!document ? (
        /* Create Document Form */
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Add Signers</CardTitle>
            <p className="text-sm text-muted-foreground">
              Add the people who need to sign this proposal
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {signers.map((signer, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center space-x-4 p-4 border border-border rounded-lg"
              >
                <div className="p-2 bg-muted rounded-lg">
                  <User className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor={`name-${index}`}>Full Name</Label>
                    <Input
                      id={`name-${index}`}
                      value={signer.name}
                      onChange={(e) => handleSignerChange(index, 'name', e.target.value)}
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`email-${index}`}>Email Address</Label>
                    <Input
                      id={`email-${index}`}
                      type="email"
                      value={signer.email}
                      onChange={(e) => handleSignerChange(index, 'email', e.target.value)}
                      placeholder="john@example.com"
                    />
                  </div>
                </div>
                {signers.length > 1 && (
                  <Button
                    onClick={() => handleRemoveSigner(index)}
                    variant="outline"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                  >
                    Remove
                  </Button>
                )}
              </motion.div>
            ))}

            <div className="flex justify-between items-center">
              <Button onClick={handleAddSigner} variant="outline">
                <User className="h-4 w-4 mr-2" />
                Add Signer
              </Button>
              <Button
                onClick={handleCreateDocument}
                disabled={isCreating || signers.every(s => !s.email || !s.name)}
                size="lg"
              >
                {isCreating ? (
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                ) : (
                  <Send className="h-5 w-5 mr-2" />
                )}
                Create E-Signature Document
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        /* Document Status */
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Document Status</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Track the signing progress of your proposal
                  </p>
                </div>
                <Badge 
                  variant="secondary" 
                  className={cn('px-3 py-1', getStatusColor(document.status))}
                >
                  {getStatusLabel(document.status)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FileSignature className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Document URL</p>
                      <p className="text-sm text-muted-foreground">
                        {document.document_url}
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Open
                  </Button>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold mb-3">Signers</h4>
                  <div className="space-y-3">
                    {document.signers.map((signer, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-3 border border-border rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-muted rounded-lg">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <div>
                            <p className="font-medium">{signer.name}</p>
                            <p className="text-sm text-muted-foreground">{signer.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getSignerStatusIcon(signer.status)}
                          <span className="text-sm font-medium capitalize">
                            {signer.status}
                          </span>
                          {signer.signed_at && (
                            <span className="text-xs text-muted-foreground">
                              {new Date(signer.signed_at).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                  <div>
                    <span className="font-medium">Created:</span> {new Date(document.created_at).toLocaleDateString()}
                  </div>
                  <div>
                    <span className="font-medium">Expires:</span> {new Date(document.expires_at).toLocaleDateString()}
                  </div>
                  <div>
                    <span className="font-medium">Document ID:</span> {document.id}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
