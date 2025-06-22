import React, { useState } from 'react';
import { Zap, Play, Settings, Users, DollarSign, TrendingUp, Code, AlertCircle, CheckCircle, Clock, ArrowRight, Filter } from 'lucide-react';
import { InfoModal } from './InfoModal';
import { Switch } from './ui/switch';

interface WorkflowTrigger {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  conditions: TriggerCondition[];
  actions: TriggerAction[];
  priority: 'low' | 'medium' | 'high' | 'critical';
  lastTriggered?: number;
  triggerCount: number;
  successRate: number;
}

interface TriggerCondition {
  type: 'funding' | 'hiring' | 'tech_adoption' | 'score_threshold' | 'company_size' | 'industry';
  operator: 'equals' | 'greater_than' | 'less_than' | 'contains' | 'matches';
  value: any;
}

interface TriggerAction {
  type: 'run_workflow' | 'add_to_crm' | 'send_alert' | 'generate_email' | 'assign_lead' | 'schedule_follow_up';
  config: any;
}

interface TriggerExecution {
  id: string;
  triggerId: string;
  timestamp: number;
  status: 'pending' | 'running' | 'completed' | 'failed';
  duration?: number;
  result?: any;
  error?: string;
}

export function WorkflowTriggers() {
  const [triggers, setTriggers] = useState<WorkflowTrigger[]>([
    {
      id: 'funding-trigger',
      name: 'High-Value Funding Events',
      description: 'Automatically process companies that raise Series A+ funding over $10M',
      enabled: true,
      conditions: [
        { type: 'funding', operator: 'greater_than', value: 10000000 },
        { type: 'industry', operator: 'contains', value: ['Technology', 'SaaS', 'Fintech'] }
      ],
      actions: [
        { type: 'run_workflow', config: { workflowId: 'enterprise-sales' } },
        { type: 'add_to_crm', config: { list: 'hot-prospects', priority: 'high' } },
        { type: 'assign_lead', config: { team: 'enterprise-sales' } }
      ],
      priority: 'high',
      lastTriggered: Date.now() - 3600000,
      triggerCount: 23,
      successRate: 0.91
    },
    {
      id: 'hiring-surge-trigger',
      name: 'Engineering Team Expansion',
      description: 'Target companies rapidly expanding their engineering teams',
      enabled: true,
      conditions: [
        { type: 'hiring', operator: 'greater_than', value: 5 },
        { type: 'tech_adoption', operator: 'contains', value: ['React', 'Node.js', 'AWS'] }
      ],
      actions: [
        { type: 'run_workflow', config: { workflowId: 'standard-b2b' } },
        { type: 'generate_email', config: { template: 'hiring-expansion' } },
        { type: 'schedule_follow_up', config: { days: 3 } }
      ],
      priority: 'medium',
      lastTriggered: Date.now() - 7200000,
      triggerCount: 156,
      successRate: 0.78
    },
    {
      id: 'high-score-trigger',
      name: 'High ICP Score Companies',
      description: 'Auto-process companies with ICP scores above 85%',
      enabled: true,
      conditions: [
        { type: 'score_threshold', operator: 'greater_than', value: 0.85 }
      ],
      actions: [
        { type: 'run_workflow', config: { workflowId: 'standard-b2b' } },
        { type: 'send_alert', config: { recipients: ['sales-team'], priority: 'high' } }
      ],
      priority: 'medium',
      lastTriggered: Date.now() - 1800000,
      triggerCount: 89,
      successRate: 0.94
    },
    {
      id: 'tech-stack-match',
      name: 'Perfect Tech Stack Match',
      description: 'Companies adopting our target technology stack',
      enabled: false,
      conditions: [
        { type: 'tech_adoption', operator: 'contains', value: ['Kubernetes', 'Docker', 'microservices'] },
        { type: 'company_size', operator: 'greater_than', value: 50 }
      ],
      actions: [
        { type: 'run_workflow', config: { workflowId: 'tech-focused' } },
        { type: 'assign_lead', config: { team: 'technical-sales' } }
      ],
      priority: 'low',
      triggerCount: 12,
      successRate: 0.83
    }
  ]);

  const [executions, setExecutions] = useState<TriggerExecution[]>([
    {
      id: 'exec-1',
      triggerId: 'funding-trigger',
      timestamp: Date.now() - 300000,
      status: 'completed',
      duration: 45000,
      result: { leads_generated: 3, crm_synced: 3, emails_sent: 2 }
    },
    {
      id: 'exec-2',
      triggerId: 'hiring-surge-trigger',
      timestamp: Date.now() - 900000,
      status: 'completed',
      duration: 32000,
      result: { leads_generated: 8, crm_synced: 8, emails_sent: 5 }
    },
    {
      id: 'exec-3',
      triggerId: 'high-score-trigger',
      timestamp: Date.now() - 1200000,
      status: 'running',
      duration: 15000
    },
    {
      id: 'exec-4',
      triggerId: 'funding-trigger',
      timestamp: Date.now() - 2100000,
      status: 'failed',
      error: 'CRM API timeout'
    }
  ]);

  const [showCreateTrigger, setShowCreateTrigger] = useState(false);
  const [selectedTrigger, setSelectedTrigger] = useState<WorkflowTrigger | null>(null);

  const toggleTrigger = (triggerId: string) => {
    setTriggers(prev => prev.map(trigger =>
      trigger.id === triggerId ? { ...trigger, enabled: !trigger.enabled } : trigger
    ));
  };

  const getPriorityColor = (priority: WorkflowTrigger['priority']) => {
    switch (priority) {
      case 'critical': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-blue-600 bg-blue-100';
      case 'low': return 'text-emerald-600 bg-emerald-100';
    }
  };

  const getStatusIcon = (status: TriggerExecution['status']) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-emerald-600" />;
      case 'running': return <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>;
      case 'failed': return <AlertCircle className="h-4 w-4 text-red-600" />;
      default: return <Clock className="h-4 w-4 text-slate-400" />;
    }
  };

  const getConditionIcon = (type: TriggerCondition['type']) => {
    switch (type) {
      case 'funding': return <DollarSign className="h-4 w-4 text-emerald-600" />;
      case 'hiring': return <Users className="h-4 w-4 text-blue-600" />;
      case 'tech_adoption': return <Code className="h-4 w-4 text-purple-600" />;
      case 'score_threshold': return <TrendingUp className="h-4 w-4 text-orange-600" />;
      case 'company_size': return <Users className="h-4 w-4 text-slate-600" />;
      case 'industry': return <Filter className="h-4 w-4 text-indigo-600" />;
    }
  };

  const formatConditionValue = (condition: TriggerCondition) => {
    if (condition.type === 'funding' && typeof condition.value === 'number') {
      return `$${(condition.value / 1000000)}M`;
    }
    if (Array.isArray(condition.value)) {
      return condition.value.join(', ');
    }
    return condition.value.toString();
  };

  const runningExecutions = executions.filter(exec => exec.status === 'running');
  const enabledTriggers = triggers.filter(trigger => trigger.enabled);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Zap className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-slate-900">Workflow Triggers</h2>
          <InfoModal
            title="Intelligent Workflow Triggers"
            description="Automatically execute workflows based on real-time events and conditions to maximize sales efficiency and response time."
            features={[
              "Event-driven automation for funding, hiring, and technology signals",
              "Multi-condition trigger logic with boolean operators",
              "Smart lead routing and assignment based on criteria",
              "Automatic CRM sync and email generation",
              "Performance tracking and optimization recommendations"
            ]}
            businessValue="Workflow triggers reduce response time by 85% and increase lead conversion by 32% through immediate, context-aware automation."
          />
        </div>

        <div className="flex items-center gap-3">
          {runningExecutions.length > 0 && (
            <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span className="text-sm text-blue-700">{runningExecutions.length} running</span>
            </div>
          )}
          <button
            onClick={() => setShowCreateTrigger(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Zap className="h-4 w-4 inline mr-2" />
            Create Trigger
          </button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <Zap className="h-5 w-5 text-blue-600" />
            <span className="font-medium text-slate-900">Active Triggers</span>
          </div>
          <div className="text-2xl font-bold text-slate-900">{enabledTriggers.length}</div>
          <div className="text-sm text-slate-600">of {triggers.length} total</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <Play className="h-5 w-5 text-emerald-600" />
            <span className="font-medium text-slate-900">Executions Today</span>
          </div>
          <div className="text-2xl font-bold text-slate-900">47</div>
          <div className="text-sm text-emerald-600">+12% from yesterday</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle className="h-5 w-5 text-purple-600" />
            <span className="font-medium text-slate-900">Success Rate</span>
          </div>
          <div className="text-2xl font-bold text-slate-900">89%</div>
          <div className="text-sm text-slate-600">across all triggers</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="h-5 w-5 text-orange-600" />
            <span className="font-medium text-slate-900">Avg Response</span>
          </div>
          <div className="text-2xl font-bold text-slate-900">2.3min</div>
          <div className="text-sm text-slate-600">trigger to action</div>
        </div>
      </div>

      {/* Active Triggers */}
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <h3 className="font-semibold text-slate-900 mb-6">Configured Triggers</h3>
        
        <div className="space-y-4">
          {triggers.map((trigger) => (
            <div
              key={trigger.id}
              className={`p-6 border rounded-xl transition-all ${
                trigger.enabled 
                  ? 'border-blue-200 bg-blue-50 hover:shadow-md cursor-pointer' 
                  : 'border-slate-200 bg-slate-50 opacity-75'
              }`}
              onClick={() => setSelectedTrigger(trigger)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4">
                  <div className={`p-2 rounded-lg ${trigger.enabled ? 'bg-blue-600' : 'bg-slate-400'}`}>
                    <Zap className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h4 className="font-semibold text-slate-900">{trigger.name}</h4>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(trigger.priority)}`}>
                        {trigger.priority}
                      </span>
                    </div>
                    <p className="text-slate-600 mb-3">{trigger.description}</p>
                    
                    {/* Conditions Preview */}
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-medium text-slate-700">Conditions:</span>
                      {trigger.conditions.slice(0, 2).map((condition, i) => (
                        <div key={i} className="flex items-center gap-1 px-2 py-1 bg-white border border-slate-200 rounded text-xs">
                          {getConditionIcon(condition.type)}
                          <span>{condition.type.replace('_', ' ')} {condition.operator.replace('_', ' ')} {formatConditionValue(condition)}</span>
                        </div>
                      ))}
                      {trigger.conditions.length > 2 && (
                        <span className="text-xs text-slate-500">+{trigger.conditions.length - 2} more</span>
                      )}
                    </div>

                    {/* Actions Preview */}
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-slate-700">Actions:</span>
                      <div className="flex items-center gap-1">
                        {trigger.actions.map((action, i) => (
                          <span key={i} className="px-2 py-1 bg-emerald-50 text-emerald-700 text-xs rounded border border-emerald-200">
                            {action.type.replace('_', ' ')}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-right text-sm">
                    <div className="font-medium text-slate-900">{trigger.triggerCount}</div>
                    <div className="text-slate-600">executions</div>
                  </div>
                  <div className="text-right text-sm">
                    <div className={`font-medium ${trigger.successRate >= 0.8 ? 'text-emerald-600' : 'text-amber-600'}`}>
                      {(trigger.successRate * 100).toFixed(0)}%
                    </div>
                    <div className="text-slate-600">success</div>
                  </div>
                  <Switch
                    checked={trigger.enabled}
                    onCheckedChange={() => toggleTrigger(trigger.id)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              </div>

              {trigger.lastTriggered && (
                <div className="text-xs text-slate-500">
                  Last triggered: {new Date(trigger.lastTriggered).toLocaleString()}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Recent Executions */}
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <h3 className="font-semibold text-slate-900 mb-6">Recent Executions</h3>
        
        <div className="space-y-3">
          {executions.map((execution) => {
            const trigger = triggers.find(t => t.id === execution.triggerId);
            
            return (
              <div key={execution.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                <div className="flex items-center gap-4">
                  {getStatusIcon(execution.status)}
                  <div>
                    <div className="font-medium text-slate-900">{trigger?.name}</div>
                    <div className="text-sm text-slate-600">
                      {new Date(execution.timestamp).toLocaleString()}
                      {execution.duration && ` • ${(execution.duration / 1000).toFixed(1)}s`}
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  {execution.result && (
                    <div className="text-sm text-slate-600">
                      {execution.result.leads_generated} leads • {execution.result.crm_synced} synced
                    </div>
                  )}
                  {execution.error && (
                    <div className="text-sm text-red-600">{execution.error}</div>
                  )}
                  <div className={`text-xs font-medium ${
                    execution.status === 'completed' ? 'text-emerald-600' :
                    execution.status === 'running' ? 'text-blue-600' :
                    execution.status === 'failed' ? 'text-red-600' : 'text-slate-600'
                  }`}>
                    {execution.status.toUpperCase()}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Trigger Detail Modal */}
      {selectedTrigger && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 mb-1">{selectedTrigger.name}</h2>
                  <p className="text-slate-600">{selectedTrigger.description}</p>
                </div>
                <button
                  onClick={() => setSelectedTrigger(null)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <div className="space-y-6">
                {/* Conditions */}
                <div>
                  <h3 className="font-medium text-slate-900 mb-3">Trigger Conditions</h3>
                  <div className="space-y-2">
                    {selectedTrigger.conditions.map((condition, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                        {getConditionIcon(condition.type)}
                        <span className="font-medium text-slate-900">{condition.type.replace('_', ' ')}</span>
                        <span className="text-slate-600">{condition.operator.replace('_', ' ')}</span>
                        <span className="font-medium text-slate-900">{formatConditionValue(condition)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div>
                  <h3 className="font-medium text-slate-900 mb-3">Trigger Actions</h3>
                  <div className="space-y-2">
                    {selectedTrigger.actions.map((action, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 bg-emerald-50 rounded-lg">
                        <ArrowRight className="h-4 w-4 text-emerald-600" />
                        <span className="font-medium text-slate-900">{action.type.replace('_', ' ')}</span>
                        <div className="text-sm text-slate-600">
                          {JSON.stringify(action.config)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Performance Stats */}
                <div>
                  <h3 className="font-medium text-slate-900 mb-3">Performance Statistics</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-3 bg-blue-50 rounded-lg text-center">
                      <div className="text-2xl font-bold text-blue-600">{selectedTrigger.triggerCount}</div>
                      <div className="text-sm text-blue-700">Total Executions</div>
                    </div>
                    <div className="p-3 bg-emerald-50 rounded-lg text-center">
                      <div className="text-2xl font-bold text-emerald-600">{(selectedTrigger.successRate * 100).toFixed(0)}%</div>
                      <div className="text-sm text-emerald-700">Success Rate</div>
                    </div>
                    <div className="p-3 bg-purple-50 rounded-lg text-center">
                      <div className="text-2xl font-bold text-purple-600">{selectedTrigger.priority}</div>
                      <div className="text-sm text-purple-700">Priority Level</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}