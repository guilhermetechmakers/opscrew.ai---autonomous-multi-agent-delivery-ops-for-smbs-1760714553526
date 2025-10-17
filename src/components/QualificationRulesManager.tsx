import { useState } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  Plus, 
  Edit3, 
  Trash2, 
  Save, 
  X,
  Target,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  useQualificationRules,
  useCreateQualificationRule,
  useUpdateQualificationRule,
  useDeleteQualificationRule
} from '@/hooks/use-intake';
import type { QualificationRule } from '@/types';

interface QualificationRulesManagerProps {
  className?: string;
}

export default function QualificationRulesManager({ className }: QualificationRulesManagerProps) {
  const [editingRule, setEditingRule] = useState<QualificationRule | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    field: '',
    operator: 'equals' as 'equals' | 'contains' | 'greater_than' | 'less_than' | 'regex',
    value: '',
    weight: 1,
    is_active: true
  });

  // API hooks
  const rulesQuery = useQualificationRules();
  const createRuleMutation = useCreateQualificationRule();
  const updateRuleMutation = useUpdateQualificationRule();
  const deleteRuleMutation = useDeleteQualificationRule();

  const rules = rulesQuery.data || [];

  const handleCreate = () => {
    setIsCreating(true);
    setEditingRule(null);
    setFormData({
      name: '',
      field: '',
      operator: 'equals',
      value: '',
      weight: 1,
      is_active: true
    });
  };

  const handleEdit = (rule: QualificationRule) => {
    setEditingRule(rule);
    setIsCreating(false);
    setFormData({
      name: rule.name,
      field: rule.field,
      operator: rule.operator,
      value: rule.value.toString(),
      weight: rule.weight,
      is_active: rule.is_active
    });
  };

  const handleSave = () => {
    if (isCreating) {
      createRuleMutation.mutate(formData, {
        onSuccess: () => {
          setIsCreating(false);
          resetForm();
        }
      });
    } else if (editingRule) {
      updateRuleMutation.mutate(
        { 
          ruleId: editingRule.id, 
          updates: formData 
        },
        {
          onSuccess: () => {
            setEditingRule(null);
            resetForm();
          }
        }
      );
    }
  };

  const handleDelete = (ruleId: string) => {
    if (confirm('Are you sure you want to delete this rule?')) {
      deleteRuleMutation.mutate(ruleId);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      field: '',
      operator: 'equals',
      value: '',
      weight: 1,
      is_active: true
    });
  };

  const getOperatorLabel = (operator: string) => {
    switch (operator) {
      case 'equals': return 'Equals';
      case 'contains': return 'Contains';
      case 'greater_than': return 'Greater Than';
      case 'less_than': return 'Less Than';
      case 'regex': return 'Regex Match';
      default: return operator;
    }
  };

  const getFieldLabel = (field: string) => {
    switch (field) {
      case 'budget': return 'Budget';
      case 'timeline': return 'Timeline';
      case 'authority': return 'Authority';
      case 'need': return 'Need';
      case 'fit': return 'Fit';
      default: return field;
    }
  };

  if (rulesQuery.isLoading) {
    return (
      <Card className={cn('p-8', className)}>
        <div className="flex items-center justify-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading qualification rules...</span>
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
                <Settings className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl">Qualification Rules</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Configure how leads are automatically qualified
                </p>
              </div>
            </div>
            <Button onClick={handleCreate}>
              <Plus className="h-4 w-4 mr-2" />
              Add Rule
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Rules List */}
      <div className="space-y-4">
        {rules.map((rule, index) => (
          <motion.div
            key={rule.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold">{rule.name}</h3>
                      <Badge 
                        variant={rule.is_active ? 'default' : 'secondary'}
                        className={cn(
                          'px-2 py-1 text-xs',
                          rule.is_active ? 'bg-green-500' : 'bg-gray-500'
                        )}
                      >
                        {rule.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                      <div>
                        <span className="font-medium">Field:</span> {getFieldLabel(rule.field)}
                      </div>
                      <div>
                        <span className="font-medium">Operator:</span> {getOperatorLabel(rule.operator)}
                      </div>
                      <div>
                        <span className="font-medium">Value:</span> {rule.value}
                      </div>
                      <div>
                        <span className="font-medium">Weight:</span> {rule.weight}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      onClick={() => handleEdit(rule)}
                      variant="outline"
                      size="sm"
                    >
                      <Edit3 className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={() => handleDelete(rule.id)}
                      variant="outline"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}

        {rules.length === 0 && (
          <Card className="p-8">
            <div className="text-center">
              <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No qualification rules</h3>
              <p className="text-muted-foreground mb-4">
                Create rules to automatically qualify leads based on their responses.
              </p>
              <Button onClick={handleCreate}>
                <Plus className="h-4 w-4 mr-2" />
                Create First Rule
              </Button>
            </div>
          </Card>
        )}
      </div>

      {/* Create/Edit Form */}
      {(isCreating || editingRule) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {isCreating ? 'Create New Rule' : 'Edit Rule'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Rule Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., High Budget Lead"
                  />
                </div>
                <div>
                  <Label htmlFor="field">Field</Label>
                  <Select
                    value={formData.field}
                    onValueChange={(value) => setFormData({ ...formData, field: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select field" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="budget">Budget</SelectItem>
                      <SelectItem value="timeline">Timeline</SelectItem>
                      <SelectItem value="authority">Authority</SelectItem>
                      <SelectItem value="need">Need</SelectItem>
                      <SelectItem value="fit">Fit</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="operator">Operator</Label>
                  <Select
                    value={formData.operator}
                    onValueChange={(value: any) => setFormData({ ...formData, operator: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select operator" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="equals">Equals</SelectItem>
                      <SelectItem value="contains">Contains</SelectItem>
                      <SelectItem value="greater_than">Greater Than</SelectItem>
                      <SelectItem value="less_than">Less Than</SelectItem>
                      <SelectItem value="regex">Regex Match</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="value">Value</Label>
                  <Input
                    id="value"
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                    placeholder="e.g., 50000 or 'urgent'"
                  />
                </div>
                <div>
                  <Label htmlFor="weight">Weight (0-1)</Label>
                  <Input
                    id="weight"
                    type="number"
                    min="0"
                    max="1"
                    step="0.1"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: parseFloat(e.target.value) || 0 })}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                  />
                  <Label htmlFor="is_active">Active</Label>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button
                  onClick={() => {
                    setIsCreating(false);
                    setEditingRule(null);
                    resetForm();
                  }}
                  variant="outline"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={createRuleMutation.isPending || updateRuleMutation.isPending}
                >
                  {(createRuleMutation.isPending || updateRuleMutation.isPending) ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  {isCreating ? 'Create Rule' : 'Save Changes'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
