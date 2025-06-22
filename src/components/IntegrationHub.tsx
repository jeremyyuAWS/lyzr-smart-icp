import React, { useState } from 'react';
import { Zap, MessageSquare, Calendar, Linkedin, Settings, CheckCircle, AlertCircle, ExternalLink, Webhook, Users, Clock, Send } from 'lucide-react';
import { InfoModal } from './InfoModal';
import { Switch } from './ui/switch';

interface Integration {
  id: string;
  name: string;
  type: 'communication' | 'calendar' | 'social' | 'automation' | 'crm';
  description: string;
  status: 'connected' | 'disconnected' | 'error' | 'configuring';
  icon: React.ReactNode;
  color: string;
  features: string[];
  config: any;
  lastSync?: string;
  webhookUrl?: string;
  usage: {
    actionsToday: number;
    totalActions: number;
    errorRate: number;
  };
}

interface NotificationRule {
  id: string;
  name: string;
  trigger: string;
  channels: string[];
  enabled: boolean;
  message_template: string;
}

export function IntegrationHub() {
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: 'slack',
      name: 'Slack',
      type: 'communication',
      description: 'Real-time alerts and notifications for your sales team',
      status: 'connected',
      icon: <MessageSquare className="h-5 w-5" />,
      color: 'purple',
      features: ['Channel notifications', 'Direct messages', 'Alert formatting', 'Team mentions'],
      config: {
        workspace: 'sales-team',
        defaultChannel: '#sales-alerts',
        apiToken: '••••••••••••xoxb',
        botUser: '@smarticp-bot'
      },
      lastSync: '2024-01-15T14:30:00Z',
      webhookUrl: 'https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX',
      usage: {
        actionsToday: 47,
        totalActions: 1234,
        errorRate: 0.02
      }
    },
    {
      id: 'teams',
      name: 'Microsoft Teams',
      type: 'communication',
      description: 'Enterprise notifications and team collaboration',
      status: 'disconnected',
      icon: <Users className="h-5 w-5" />,
      color: 'blue',
      features: ['Team channels', 'Adaptive cards', 'Mentions', 'File sharing'],
      config: {},
      usage: {
        actionsToday: 0,
        totalActions: 0,
        errorRate: 0
      }
    },
    {
      id: 'calendly',
      name: 'Calendly',
      type: 'calendar',
      description: 'Automated meeting scheduling with qualified leads',
      status: 'connected',
      icon: <Calendar className="h-5 w-5" />,
      color: 'emerald',
      features: ['Auto booking', 'Custom fields', 'Lead scoring sync', 'Follow-up automation'],
      config: {
        apiKey: '••••••••••••cal',
        defaultEventType: 'discovery-call-30min',
        autoSchedule: true,
        leadScoreThreshold: 0.8
      },
      lastSync: '2024-01-15T13:45:00Z',
      usage: {
        actionsToday: 12,
        totalActions: 156,
        errorRate: 0.01
      }
    },
    {
      id: 'google-calendar',
      name: 'Google Calendar',
      type: 'calendar',
      description: 'Meeting scheduling and calendar management',
      status: 'connected',
      icon: <Calendar className="h-5 w-5" />,
      color: 'orange',
      features: ['Calendar sync', 'Meeting creation', 'Availability check', 'Reminder automation'],
      config: {
        accountEmail: 'sales@company.com',
        defaultDuration: 30,
        bufferTime: 15,
        workingHours: '9:00 AM - 5:00 PM'
      },
      lastSync: '2024-01-15T14:15:00Z',
      usage: {
        actionsToday: 8,
        totalActions: 89,
        errorRate: 0.03
      }
    },
    {
      id: 'linkedin-sales-navigator',
      name: 'LinkedIn Sales Navigator',
      type: 'social',
      description: 'Automated prospect research and connection requests',
      status: 'configuring',
      icon: <Linkedin className="h-5 w-5" />,
      color: 'blue',
      features: ['Profile enrichment', 'Connection automation', 'InMail templates', 'Lead tracking'],
      config: {
        accountId: 'sales-user-123',
        autoConnect: false,
        messageTemplate: 'personalized',
        dailyLimit: 20
      },
      usage: {
        actionsToday: 0,
        totalActions: 23,
        errorRate: 0.05
      }
    },
    {
      id: 'zapier',
      name: 'Zapier',
      type: 'automation',
      description: 'Connect SmartICP to 5,000+ apps with custom workflows',
      status: 'connected',
      icon: <Zap className="h-5 w-5" />,
      color: 'orange',
      features: ['Multi-step zaps', 'Filters & paths', 'Webhooks', 'Custom triggers'],
      config: {
        apiKey: '••••••••••••zap',
        activeZaps: 12,
        monthlyTasks: 1547,
        plan: 'Professional'
      },
      lastSync: '2024-01-15T14:20:00Z',
      webhookUrl: 'https://hooks.zapier.com/hooks/catch/123456/abcdef/',
      usage: {
        actionsToday: 89,
        totalActions: 3456,
        errorRate: 0.01
      }
    },
    {
      id: 'make',
      name: 'Make (Integromat)',
      type: 'automation',
      description: 'Visual automation platform for complex workflows',
      status: 'disconnected',
      icon: <Settings className="h-5 w-5" />,
      color: 'indigo',
      features: ['Visual scenarios', 'Advanced routing', 'Data transformation', 'Error handling'],
      config: {},
      usage: {
        actionsToday: 0,
        totalActions: 0,
        errorRate: 0
      }
    }
  ]);

  const [notificationRules, setNotificationRules] = useState<NotificationRule[]>([
    {
      id: 'funding-alert',
      name: 'Funding Events',
      trigger: 'funding_event_detected',
      channels: ['slack', 'teams'],
      enabled: true,
      message_template: '🎉 Funding Alert: {{company_name}} raised {{funding_amount}} in {{funding_round}}!'
    },
    {
      id: 'high-score-lead',
      name: 'High Score Leads',
      trigger: 'lead_score_above_85',
      channels: ['slack'],
      enabled: true,
      message_template: '🎯 High-score lead detected: {{company_name}} ({{score}}% match) - {{contact_name}}'
    },
    {
      id: 'workflow-complete',
      name: 'Workflow Completion',
      trigger: 'workflow_completed',
      channels: ['slack'],
      enabled: true,
      message_template: '✅ Workflow completed: {{workflow_name}} generated {{leads_count}} qualified leads'
    },
    {
      id: 'meeting-scheduled',
      name: 'Meeting Scheduled',
      trigger: 'meeting_booked',
      channels: ['slack', 'teams'],
      enabled: true,
      message_template: '📅 Meeting scheduled with {{contact_name}} at {{company_name}} for {{meeting_time}}'
    }
  ]);

  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const [activeTab, setActiveTab] = useState<'integrations' | 'notifications' | 'webhooks' | 'automation'>('integrations');

  const toggleIntegration = (integrationId: string) => {
    setIntegrations(prev => prev.map(integration =>
      integration.id === integrationId
        ? { 
            ...integration, 
            status: integration.status === 'connected' ? 'disconnected' : 'connected' 
          }
        : integration
    ));
  };

  const toggleNotificationRule = (ruleId: string) => {
    setNotificationRules(prev => prev.map(rule =>
      rule.id === ruleId ? { ...rule, enabled: !rule.enabled } : rule
    ));
  };

  const getStatusIcon = (status: Integration['status']) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="h-4 w-4 text-emerald-600" />;
      case 'configuring':
        return <Clock className="h-4 w-4 text-amber-600" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <div className="w-4 h-4 bg-slate-300 rounded-full" />;
    }
  };

  const getStatusColor = (status: Integration['status']) => {
    switch (status) {
      case 'connected': return 'text-emerald-600 bg-emerald-100';
      case 'configuring': return 'text-amber-600 bg-amber-100';
      case 'error': return 'text-red-600 bg-red-100';
      default: return 'text-slate-600 bg-slate-100';
    }
  };

  const zapierWorkflows = [
    {
      name: 'High-Score Lead → HubSpot + Slack',
      description: 'When a lead scores above 85%, add to HubSpot and notify sales team',
      status: 'active',
      runs: 47
    },
    {
      name: 'Funding Event → LinkedIn Research',
      description: 'Automatically research company executives on LinkedIn after funding alerts',
      status: 'active',
      runs: 23
    },
    {
      name: 'Meeting Booked → CRM Update',
      description: 'Update lead status in CRM when Calendly meeting is booked',
      status: 'active',
      runs: 12
    },
    {
      name: 'Email Reply → Slack Notification',
      description: 'Notify team when prospects reply to email sequences',
      status: 'paused',
      runs: 8
    }
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Zap className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-slate-900">Integration Hub</h2>
          <InfoModal
            title="Advanced Integration Hub"
            description="Connect SmartICP to your entire tech stack with 500+ pre-built integrations and custom automation workflows."
            features={[
              "Real-time Slack and Teams notifications for sales events",
              "Automated calendar scheduling with Calendly and Google Calendar",
              "LinkedIn Sales Navigator automation for prospect research",
              "Zapier and Make.com integration for custom workflows",
              "Webhook automation with 500+ supported applications"
            ]}
            businessValue="Integration hub increases team productivity by 75% and reduces manual data entry by 90% through seamless automation across your sales stack."
          />
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-600">
            {integrations.filter(i => i.status === 'connected').length} of {integrations.length} connected
          </span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-slate-200">
        <nav className="flex space-x-8">
          {[
            { id: 'integrations', name: 'Integrations', icon: Zap },
            { id: 'notifications', name: 'Notifications', icon: MessageSquare },
            { id: 'webhooks', name: 'Webhooks', icon: Webhook },
            { id: 'automation', name: 'Automation', icon: Settings }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Integrations Tab */}
      {activeTab === 'integrations' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {integrations.map((integration) => (
            <div key={integration.id} className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3">
                  <div className={`p-2 bg-${integration.color}-100 rounded-lg`}>
                    {integration.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">{integration.name}</h3>
                    <p className="text-sm text-slate-600 mt-1">{integration.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(integration.status)}
                </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(integration.status)}`}>
                  {integration.status}
                </span>
                {integration.status === 'connected' && (
                  <div className="text-right text-xs text-slate-500">
                    {integration.usage.actionsToday} actions today
                  </div>
                )}
              </div>

              <div className="mb-4">
                <h4 className="text-sm font-medium text-slate-700 mb-2">Features</h4>
                <div className="flex flex-wrap gap-1">
                  {integration.features.slice(0, 3).map((feature, i) => (
                    <span key={i} className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded">
                      {feature}
                    </span>
                  ))}
                  {integration.features.length > 3 && (
                    <span className="text-xs text-slate-500">+{integration.features.length - 3}</span>
                  )}
                </div>
              </div>

              {integration.status === 'connected' && (
                <div className="grid grid-cols-2 gap-3 text-xs mb-4">
                  <div>
                    <span className="text-slate-600">Success Rate</span>
                    <div className="font-medium text-emerald-600">
                      {((1 - integration.usage.errorRate) * 100).toFixed(1)}%
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-600">Total Actions</span>
                    <div className="font-medium text-slate-900">
                      {integration.usage.totalActions.toLocaleString()}
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                {integration.status === 'connected' ? (
                  <>
                    <button
                      onClick={() => setSelectedIntegration(integration)}
                      className="flex-1 px-3 py-2 text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
                    >
                      Configure
                    </button>
                    <button
                      onClick={() => toggleIntegration(integration.id)}
                      className="px-3 py-2 text-sm bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors"
                    >
                      Disconnect
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => toggleIntegration(integration.id)}
                    className="w-full px-3 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    Connect
                  </button>
                )}
              </div>

              {integration.status === 'connected' && integration.lastSync && (
                <div className="text-xs text-slate-500 mt-2">
                  Last sync: {new Date(integration.lastSync).toLocaleString()}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <h3 className="font-semibold text-slate-900 mb-6">Notification Rules</h3>
            
            <div className="space-y-4">
              {notificationRules.map((rule) => (
                <div key={rule.id} className="p-4 border border-slate-200 rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-medium text-slate-900">{rule.name}</h4>
                      <p className="text-sm text-slate-600">Trigger: {rule.trigger}</p>
                    </div>
                    <Switch
                      checked={rule.enabled}
                      onCheckedChange={() => toggleNotificationRule(rule.id)}
                    />
                  </div>
                  
                  <div className="mb-3">
                    <span className="text-sm font-medium text-slate-700">Channels: </span>
                    {rule.channels.map((channel, i) => (
                      <span key={i} className="ml-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                        {channel}
                      </span>
                    ))}
                  </div>
                  
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <span className="text-sm font-medium text-slate-700">Message Template:</span>
                    <p className="text-sm text-slate-600 mt-1 font-mono">{rule.message_template}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Webhooks Tab */}
      {activeTab === 'webhooks' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <h3 className="font-semibold text-slate-900 mb-6">Webhook Configuration</h3>
            
            <div className="grid gap-4">
              {integrations.filter(i => i.webhookUrl).map((integration) => (
                <div key={integration.id} className="p-4 border border-slate-200 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 bg-${integration.color}-100 rounded-lg`}>
                        {integration.icon}
                      </div>
                      <div>
                        <h4 className="font-medium text-slate-900">{integration.name}</h4>
                        <p className="text-sm text-slate-600">Webhook endpoint</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(integration.status)}`}>
                      {integration.status}
                    </span>
                  </div>
                  
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Webhook URL</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={integration.webhookUrl}
                        readOnly
                        className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded bg-slate-50 font-mono"
                      />
                      <button className="px-3 py-2 text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 rounded transition-colors">
                        Copy
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3 text-sm">
                    <div>
                      <span className="text-slate-600">Events Today</span>
                      <div className="font-medium text-slate-900">{integration.usage.actionsToday}</div>
                    </div>
                    <div>
                      <span className="text-slate-600">Total Events</span>
                      <div className="font-medium text-slate-900">{integration.usage.totalActions}</div>
                    </div>
                    <div>
                      <span className="text-slate-600">Success Rate</span>
                      <div className="font-medium text-emerald-600">
                        {((1 - integration.usage.errorRate) * 100).toFixed(1)}%
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Automation Tab */}
      {activeTab === 'automation' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <h3 className="font-semibold text-slate-900 mb-6">Active Automation Workflows</h3>
            
            <div className="space-y-4">
              {zapierWorkflows.map((workflow, index) => (
                <div key={index} className="p-4 border border-slate-200 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-medium text-slate-900">{workflow.name}</h4>
                      <p className="text-sm text-slate-600">{workflow.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        workflow.status === 'active' 
                          ? 'bg-emerald-100 text-emerald-700' 
                          : 'bg-amber-100 text-amber-700'
                      }`}>
                        {workflow.status}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">{workflow.runs} runs this month</span>
                    <div className="flex gap-2">
                      <button className="px-3 py-1 text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 rounded transition-colors">
                        Edit
                      </button>
                      <button className="px-3 py-1 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 rounded transition-colors">
                        View Logs
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-3">
                <Zap className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900">Create Custom Automation</h4>
                  <p className="text-sm text-blue-800 mt-1">
                    Connect SmartICP to 5,000+ apps using Zapier or Make.com. Build custom workflows 
                    that trigger on any SmartICP event.
                  </p>
                  <div className="flex gap-2 mt-3">
                    <button className="px-3 py-1.5 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors">
                      Open Zapier
                    </button>
                    <button className="px-3 py-1.5 text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 rounded transition-colors">
                      Documentation
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Integration Configuration Modal */}
      {selectedIntegration && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className={`p-3 bg-${selectedIntegration.color}-100 rounded-lg`}>
                    {selectedIntegration.icon}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">{selectedIntegration.name}</h2>
                    <p className="text-slate-600">{selectedIntegration.description}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedIntegration(null)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium text-slate-900 mb-3">Configuration</h3>
                  <div className="space-y-3">
                    {Object.entries(selectedIntegration.config).map(([key, value]) => (
                      <div key={key}>
                        <label className="block text-sm font-medium text-slate-700 mb-1 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                        </label>
                        <input
                          type={key.includes('token') || key.includes('key') ? 'password' : 'text'}
                          value={value?.toString() || ''}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-slate-900 mb-3">Usage Statistics</h3>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 bg-slate-50 rounded text-center">
                      <div className="font-bold text-slate-900">{selectedIntegration.usage.actionsToday}</div>
                      <div className="text-xs text-slate-600">Today</div>
                    </div>
                    <div className="p-3 bg-slate-50 rounded text-center">
                      <div className="font-bold text-slate-900">{selectedIntegration.usage.totalActions}</div>
                      <div className="text-xs text-slate-600">Total</div>
                    </div>
                    <div className="p-3 bg-slate-50 rounded text-center">
                      <div className="font-bold text-emerald-600">
                        {((1 - selectedIntegration.usage.errorRate) * 100).toFixed(1)}%
                      </div>
                      <div className="text-xs text-slate-600">Success</div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Save Changes
                  </button>
                  <button className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors">
                    Test Connection
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}