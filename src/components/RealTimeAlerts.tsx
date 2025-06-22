import React, { useState, useEffect } from 'react';
import { Bell, TrendingUp, Users, Code, DollarSign, AlertCircle, CheckCircle, Clock, Filter, Settings, Zap, Play, Pause } from 'lucide-react';
import { InfoModal } from './InfoModal';
import { Switch } from './ui/switch';

interface Alert {
  id: string;
  type: 'funding' | 'hiring' | 'tech_adoption' | 'executive_change' | 'product_launch';
  company: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: number;
  source: string;
  data: any;
  isRead: boolean;
  triggerWorkflow?: boolean;
}

interface AlertRule {
  id: string;
  name: string;
  type: Alert['type'];
  enabled: boolean;
  conditions: any;
  actions: {
    notify: boolean;
    triggerWorkflow: boolean;
    addToCRM: boolean;
    generateEmail: boolean;
  };
}

export function RealTimeAlerts() {
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: '1',
      type: 'funding',
      company: 'CloudScale Technologies',
      title: 'Series C Funding Announced - $50M',
      description: 'CloudScale Technologies has raised $50M in Series C funding led by Andreessen Horowitz to expand their fintech infrastructure platform.',
      severity: 'high',
      timestamp: Date.now() - 300000, // 5 minutes ago
      source: 'TechCrunch',
      data: {
        amount: '$50M',
        round: 'Series C',
        lead_investor: 'Andreessen Horowitz',
        valuation: '$500M'
      },
      isRead: false,
      triggerWorkflow: true
    },
    {
      id: '2',
      type: 'hiring',
      company: 'DataFlow Analytics',
      title: 'Hiring Surge Detected - 15 New Positions',
      description: 'DataFlow Analytics has posted 15 new engineering positions in the last 48 hours, indicating rapid team expansion.',
      severity: 'medium',
      timestamp: Date.now() - 900000, // 15 minutes ago
      source: 'LinkedIn Jobs',
      data: {
        new_positions: 15,
        departments: ['Engineering', 'Product', 'Sales'],
        timeframe: '48 hours',
        growth_rate: '+45%'
      },
      isRead: false,
      triggerWorkflow: true
    },
    {
      id: '3',
      type: 'tech_adoption',
      company: 'TechFlow Solutions',
      title: 'New Technology Adoption - Kubernetes',
      description: 'TechFlow Solutions engineering team has started adopting Kubernetes based on recent job postings and GitHub activity.',
      severity: 'medium',
      timestamp: Date.now() - 1800000, // 30 minutes ago
      source: 'GitHub Activity',
      data: {
        technology: 'Kubernetes',
        adoption_signals: ['Job postings', 'GitHub repos', 'Blog posts'],
        confidence: 0.85
      },
      isRead: true,
      triggerWorkflow: false
    },
    {
      id: '4',
      type: 'executive_change',
      company: 'InnovateRetail',
      title: 'New CTO Hired - Dr. Sarah Kim',
      description: 'InnovateRetail has hired Dr. Sarah Kim as their new CTO. She previously led AI initiatives at Amazon.',
      severity: 'high',
      timestamp: Date.now() - 3600000, // 1 hour ago
      source: 'LinkedIn',
      data: {
        position: 'CTO',
        name: 'Dr. Sarah Kim',
        previous_role: 'AI Director at Amazon',
        start_date: '2024-02-01'
      },
      isRead: true,
      triggerWorkflow: true
    }
  ]);

  const [alertRules, setAlertRules] = useState<AlertRule[]>([
    {
      id: 'funding-rule',
      name: 'Funding Events',
      type: 'funding',
      enabled: true,
      conditions: {
        min_amount: 5000000, // $5M+
        rounds: ['Seed', 'Series A', 'Series B', 'Series C'],
        industries: ['Technology', 'SaaS', 'Fintech']
      },
      actions: {
        notify: true,
        triggerWorkflow: true,
        addToCRM: true,
        generateEmail: false
      }
    },
    {
      id: 'hiring-rule',
      name: 'Hiring Surges',
      type: 'hiring',
      enabled: true,
      conditions: {
        min_positions: 5,
        timeframe: '72 hours',
        departments: ['Engineering', 'Product', 'Sales'],
        growth_threshold: 25 // 25% increase
      },
      actions: {
        notify: true,
        triggerWorkflow: true,
        addToCRM: false,
        generateEmail: true
      }
    },
    {
      id: 'tech-rule',
      name: 'Technology Adoption',
      type: 'tech_adoption',
      enabled: true,
      conditions: {
        technologies: ['AI/ML', 'Cloud', 'Kubernetes', 'React', 'Python'],
        confidence_threshold: 0.7,
        signals: ['Job postings', 'GitHub', 'Blog posts']
      },
      actions: {
        notify: true,
        triggerWorkflow: false,
        addToCRM: false,
        generateEmail: false
      }
    }
  ]);

  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [showSettings, setShowSettings] = useState(false);
  const [isMonitoring, setIsMonitoring] = useState(true);

  // Simulate real-time alerts
  useEffect(() => {
    if (!isMonitoring) return;

    const interval = setInterval(() => {
      // Randomly generate new alerts for demo
      if (Math.random() > 0.7) {
        const newAlert = generateRandomAlert();
        setAlerts(prev => [newAlert, ...prev.slice(0, 19)]); // Keep last 20 alerts
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [isMonitoring]);

  const generateRandomAlert = (): Alert => {
    const companies = ['TechFlow Solutions', 'DataStream Analytics', 'CloudScale Tech', 'InnovateRetail'];
    const types: Alert['type'][] = ['funding', 'hiring', 'tech_adoption'];
    const type = types[Math.floor(Math.random() * types.length)];
    const company = companies[Math.floor(Math.random() * companies.length)];

    const alertTemplates = {
      funding: {
        title: `Series A Funding - $${Math.floor(Math.random() * 50 + 10)}M`,
        description: `${company} has raised funding to accelerate growth and expand market presence.`,
        severity: 'high' as const
      },
      hiring: {
        title: `Hiring Spike - ${Math.floor(Math.random() * 20 + 5)} New Positions`,
        description: `${company} is rapidly expanding their team across multiple departments.`,
        severity: 'medium' as const
      },
      tech_adoption: {
        title: 'Technology Upgrade Detected',
        description: `${company} is adopting new technologies based on recent activity patterns.`,
        severity: 'low' as const
      }
    };

    const template = alertTemplates[type];

    return {
      id: `alert-${Date.now()}`,
      type,
      company,
      title: template.title,
      description: template.description,
      severity: template.severity,
      timestamp: Date.now(),
      source: 'Real-time Monitor',
      data: {},
      isRead: false,
      triggerWorkflow: Math.random() > 0.5
    };
  };

  const markAsRead = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, isRead: true } : alert
    ));
  };

  const toggleAlertRule = (ruleId: string) => {
    setAlertRules(prev => prev.map(rule =>
      rule.id === ruleId ? { ...rule, enabled: !rule.enabled } : rule
    ));
  };

  const getAlertIcon = (type: Alert['type']) => {
    switch (type) {
      case 'funding': return <DollarSign className="h-4 w-4" />;
      case 'hiring': return <Users className="h-4 w-4" />;
      case 'tech_adoption': return <Code className="h-4 w-4" />;
      case 'executive_change': return <TrendingUp className="h-4 w-4" />;
      case 'product_launch': return <Zap className="h-4 w-4" />;
    }
  };

  const getSeverityColor = (severity: Alert['severity']) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-blue-600 bg-blue-100';
      case 'low': return 'text-emerald-600 bg-emerald-100';
    }
  };

  const getTypeColor = (type: Alert['type']) => {
    switch (type) {
      case 'funding': return 'text-emerald-600 bg-emerald-100';
      case 'hiring': return 'text-blue-600 bg-blue-100';
      case 'tech_adoption': return 'text-purple-600 bg-purple-100';
      case 'executive_change': return 'text-orange-600 bg-orange-100';
      case 'product_launch': return 'text-indigo-600 bg-indigo-100';
    }
  };

  const filteredAlerts = filterType === 'all' 
    ? alerts 
    : alerts.filter(alert => alert.type === filterType);

  const unreadCount = alerts.filter(alert => !alert.isRead).length;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Bell className="h-6 w-6 text-blue-600" />
            {unreadCount > 0 && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {unreadCount}
              </div>
            )}
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Real-Time Alerts</h2>
          <InfoModal
            title="Real-Time Intelligence Alerts"
            description="Monitor funding events, hiring surges, technology adoption, and executive changes in real-time to identify sales opportunities."
            features={[
              "Real-time monitoring of funding announcements and investment rounds",
              "Hiring surge detection across target companies and industries",
              "Technology adoption tracking through job posts and GitHub activity",
              "Executive movement alerts for relationship opportunities",
              "Automatic workflow triggers based on alert criteria"
            ]}
            businessValue="Real-time alerts increase sales velocity by 40% and improve deal closure rates by 25% through timely opportunity identification and response."
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-600">Monitoring</span>
            <Switch
              checked={isMonitoring}
              onCheckedChange={setIsMonitoring}
            />
            <div className={`w-2 h-2 rounded-full ${isMonitoring ? 'bg-emerald-500' : 'bg-slate-400'}`} />
          </div>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
          >
            <Settings className="h-4 w-4 inline mr-2" />
            Configure
          </button>
        </div>
      </div>

      {/* Alert Configuration */}
      {showSettings && (
        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <h3 className="font-semibold text-slate-900 mb-4">Alert Configuration</h3>
          
          <div className="space-y-4">
            {alertRules.map((rule) => (
              <div key={rule.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                <div className="flex items-center gap-3">
                  {getAlertIcon(rule.type)}
                  <div>
                    <span className="font-medium text-slate-900">{rule.name}</span>
                    <div className="text-sm text-slate-600">
                      {rule.type === 'funding' && `Min amount: $${(rule.conditions.min_amount / 1000000)}M+`}
                      {rule.type === 'hiring' && `Min positions: ${rule.conditions.min_positions}+ in ${rule.conditions.timeframe}`}
                      {rule.type === 'tech_adoption' && `Confidence: ${(rule.conditions.confidence_threshold * 100)}%+`}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-sm text-slate-600">
                    {Object.values(rule.actions).filter(Boolean).length} actions enabled
                  </div>
                  <Switch
                    checked={rule.enabled}
                    onCheckedChange={() => toggleAlertRule(rule.id)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Alert Filters */}
      <div className="flex items-center gap-4">
        <Filter className="h-4 w-4 text-slate-600" />
        <div className="flex items-center gap-2">
          {['all', 'funding', 'hiring', 'tech_adoption', 'executive_change'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                filterType === type
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {type === 'all' ? 'All Alerts' : type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              {type !== 'all' && (
                <span className="ml-1 text-xs opacity-75">
                  {alerts.filter(a => a.type === type).length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Live Alert Status */}
      <div className="bg-gradient-to-r from-emerald-50 to-blue-50 border border-emerald-200 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${isMonitoring ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
            <span className="font-medium text-slate-900">
              {isMonitoring ? 'Live Monitoring Active' : 'Monitoring Paused'}
            </span>
            <span className="text-sm text-slate-600">
              • {filteredAlerts.length} alerts • {unreadCount} unread
            </span>
          </div>
          
          <div className="text-sm text-slate-600">
            Last update: {new Date().toLocaleTimeString()}
          </div>
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        {filteredAlerts.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">No alerts yet</h3>
            <p className="text-slate-600">We'll notify you when relevant events occur for your target companies.</p>
          </div>
        ) : (
          filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              onClick={() => {
                setSelectedAlert(alert);
                markAsRead(alert.id);
              }}
              className={`p-6 border border-slate-200 rounded-xl cursor-pointer transition-all hover:shadow-md ${
                !alert.isRead ? 'bg-blue-50 border-blue-200' : 'bg-white hover:bg-slate-50'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${getTypeColor(alert.type)}`}>
                    {getAlertIcon(alert.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-semibold text-slate-900">{alert.title}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(alert.severity)}`}>
                        {alert.severity}
                      </span>
                      {alert.triggerWorkflow && (
                        <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full">
                          Auto-trigger
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-slate-600 mb-2">{alert.company}</div>
                    <p className="text-slate-700">{alert.description}</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-sm text-slate-500">
                    {new Date(alert.timestamp).toLocaleTimeString()}
                  </div>
                  <div className="text-xs text-slate-400 mt-1">{alert.source}</div>
                  {!alert.isRead && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 ml-auto" />
                  )}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    // Trigger workflow
                  }}
                  className="px-3 py-1.5 text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 rounded transition-colors"
                >
                  <Play className="h-3 w-3 inline mr-1" />
                  Run Workflow
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    // Add to CRM
                  }}
                  className="px-3 py-1.5 text-xs bg-emerald-100 hover:bg-emerald-200 text-emerald-700 rounded transition-colors"
                >
                  Add to CRM
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    // Generate email
                  }}
                  className="px-3 py-1.5 text-xs bg-purple-100 hover:bg-purple-200 text-purple-700 rounded transition-colors"
                >
                  Generate Email
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Alert Detail Modal */}
      {selectedAlert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className={`p-3 rounded-lg ${getTypeColor(selectedAlert.type)}`}>
                    {getAlertIcon(selectedAlert.type)}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 mb-1">{selectedAlert.title}</h2>
                    <div className="flex items-center gap-3">
                      <span className="text-slate-600">{selectedAlert.company}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(selectedAlert.severity)}`}>
                        {selectedAlert.severity}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedAlert(null)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-slate-900 mb-2">Description</h3>
                  <p className="text-slate-700">{selectedAlert.description}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-slate-600">Timestamp</span>
                    <div className="font-medium text-slate-900">
                      {new Date(selectedAlert.timestamp).toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <span className="text-sm text-slate-600">Source</span>
                    <div className="font-medium text-slate-900">{selectedAlert.source}</div>
                  </div>
                </div>

                {Object.keys(selectedAlert.data).length > 0 && (
                  <div>
                    <h3 className="font-medium text-slate-900 mb-2">Additional Data</h3>
                    <div className="bg-slate-50 rounded-lg p-3">
                      <pre className="text-sm text-slate-700">
                        {JSON.stringify(selectedAlert.data, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Run Workflow
                  </button>
                  <button className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
                    Add to CRM
                  </button>
                  <button className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors">
                    Dismiss
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