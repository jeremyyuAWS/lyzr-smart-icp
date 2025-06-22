import React, { useState } from 'react';
import { Mail, Send, Clock, TrendingUp, Users, Settings, Play, Pause, BarChart3, Zap, Target, Filter, Calendar, Globe } from 'lucide-react';
import { InfoModal } from './InfoModal';
import { Switch } from './ui/switch';

interface EmailSequence {
  id: string;
  name: string;
  description: string;
  status: 'draft' | 'active' | 'paused' | 'completed';
  trigger: {
    type: 'manual' | 'lead_score' | 'funding_event' | 'hiring_surge' | 'time_based';
    conditions: any;
  };
  steps: EmailStep[];
  performance: {
    sent: number;
    opened: number;
    clicked: number;
    replied: number;
    bounced: number;
    unsubscribed: number;
  };
  created_date: string;
  last_modified: string;
}

interface EmailStep {
  id: string;
  name: string;
  delay_days: number;
  delay_hours: number;
  conditions?: {
    type: 'engagement' | 'response' | 'score_change';
    criteria: any;
  };
  template: {
    subject: string;
    content: string;
    personalization_tokens: string[];
  };
  send_time_optimization: boolean;
  deliverability_score: number;
}

interface DeliverabilityMetrics {
  domain: string;
  reputation_score: number;
  spam_score: number;
  authentication: {
    spf: boolean;
    dkim: boolean;
    dmarc: boolean;
  };
  bounce_rate: number;
  complaint_rate: number;
  engagement_rate: number;
  recommendations: string[];
}

export function EmailOrchestration() {
  const [sequences, setSequences] = useState<EmailSequence[]>([
    {
      id: 'seq-1',
      name: 'Funding Event Follow-up',
      description: 'Automated sequence triggered by Series A+ funding announcements',
      status: 'active',
      trigger: {
        type: 'funding_event',
        conditions: {
          min_amount: 10000000,
          rounds: ['Series A', 'Series B', 'Series C'],
          industries: ['Technology', 'SaaS', 'Fintech']
        }
      },
      steps: [
        {
          id: 'step-1',
          name: 'Congratulations Email',
          delay_days: 0,
          delay_hours: 2,
          template: {
            subject: 'Congrats on the {{funding_round}} - {{company_name}}',
            content: 'Hi {{contact_name}},\n\nCongratulations on {{company_name}}\'s recent {{funding_amount}} {{funding_round}}! I came across the announcement about your partnership with {{lead_investor}}...',
            personalization_tokens: ['company_name', 'funding_round', 'funding_amount', 'contact_name', 'lead_investor']
          },
          send_time_optimization: true,
          deliverability_score: 0.92
        },
        {
          id: 'step-2',
          name: 'Value Proposition Follow-up',
          delay_days: 3,
          delay_hours: 0,
          conditions: {
            type: 'engagement',
            criteria: { opened: true, clicked: false }
          },
          template: {
            subject: 'Scaling challenges at {{company_name}}?',
            content: 'Hi {{contact_name}},\n\nAs {{company_name}} scales with the new funding, you might be facing some of the common challenges we\'ve helped similar companies solve...',
            personalization_tokens: ['company_name', 'contact_name', 'industry_challenges']
          },
          send_time_optimization: true,
          deliverability_score: 0.89
        },
        {
          id: 'step-3',
          name: 'Case Study Share',
          delay_days: 7,
          delay_hours: 0,
          conditions: {
            type: 'engagement',
            criteria: { opened: true, replied: false }
          },
          template: {
            subject: 'How {{similar_company}} scaled after their {{funding_round}}',
            content: 'Hi {{contact_name}},\n\nI thought you might find this case study interesting - {{similar_company}} faced similar scaling challenges after their {{funding_round}}...',
            personalization_tokens: ['contact_name', 'similar_company', 'funding_round', 'case_study_link']
          },
          send_time_optimization: true,
          deliverability_score: 0.87
        }
      ],
      performance: {
        sent: 1247,
        opened: 423,
        clicked: 89,
        replied: 34,
        bounced: 12,
        unsubscribed: 3
      },
      created_date: '2024-01-10',
      last_modified: '2024-01-15'
    },
    {
      id: 'seq-2',
      name: 'High-Score Lead Nurture',
      description: 'Progressive nurture for leads with ICP scores above 85%',
      status: 'active',
      trigger: {
        type: 'lead_score',
        conditions: {
          min_score: 0.85,
          signal_types: ['hiring', 'tech_adoption', 'funding']
        }
      },
      steps: [
        {
          id: 'step-1',
          name: 'Personalized Introduction',
          delay_days: 0,
          delay_hours: 1,
          template: {
            subject: '{{industry_insight}} - {{company_name}}',
            content: 'Hi {{contact_name}},\n\nI noticed {{company_name}} is {{current_activity}} and thought you might be interested in how {{similar_company}} approached similar challenges...',
            personalization_tokens: ['industry_insight', 'company_name', 'contact_name', 'current_activity', 'similar_company']
          },
          send_time_optimization: true,
          deliverability_score: 0.94
        },
        {
          id: 'step-2',
          name: 'Resource Share',
          delay_days: 2,
          delay_hours: 0,
          template: {
            subject: 'Resource: {{specific_topic}} for {{company_name}}',
            content: 'Hi {{contact_name}},\n\nGiven {{company_name}}\'s focus on {{tech_stack}}, I thought this resource on {{specific_topic}} might be valuable...',
            personalization_tokens: ['specific_topic', 'company_name', 'contact_name', 'tech_stack']
          },
          send_time_optimization: true,
          deliverability_score: 0.91
        }
      ],
      performance: {
        sent: 892,
        opened: 356,
        clicked: 78,
        replied: 29,
        bounced: 8,
        unsubscribed: 2
      },
      created_date: '2024-01-08',
      last_modified: '2024-01-14'
    }
  ]);

  const [deliverabilityMetrics] = useState<DeliverabilityMetrics[]>([
    {
      domain: 'yourdomain.com',
      reputation_score: 0.92,
      spam_score: 0.15,
      authentication: {
        spf: true,
        dkim: true,
        dmarc: true
      },
      bounce_rate: 0.018,
      complaint_rate: 0.002,
      engagement_rate: 0.34,
      recommendations: [
        'Maintain consistent sending volume',
        'Monitor reply rates - currently excellent at 2.8%',
        'Consider A/B testing subject lines for higher open rates'
      ]
    }
  ]);

  const [selectedSequence, setSelectedSequence] = useState<EmailSequence | null>(null);
  const [showCreateSequence, setShowCreateSequence] = useState(false);
  const [activeTab, setActiveTab] = useState<'sequences' | 'deliverability' | 'personalization' | 'optimization'>('sequences');

  const toggleSequence = (sequenceId: string) => {
    setSequences(prev => prev.map(seq => 
      seq.id === sequenceId 
        ? { ...seq, status: seq.status === 'active' ? 'paused' : 'active' }
        : seq
    ));
  };

  const getStatusColor = (status: EmailSequence['status']) => {
    switch (status) {
      case 'active': return 'text-emerald-600 bg-emerald-100';
      case 'paused': return 'text-amber-600 bg-amber-100';
      case 'draft': return 'text-slate-600 bg-slate-100';
      case 'completed': return 'text-blue-600 bg-blue-100';
    }
  };

  const calculateOpenRate = (seq: EmailSequence) => {
    return seq.performance.sent > 0 ? (seq.performance.opened / seq.performance.sent * 100).toFixed(1) : '0';
  };

  const calculateReplyRate = (seq: EmailSequence) => {
    return seq.performance.sent > 0 ? (seq.performance.replied / seq.performance.sent * 100).toFixed(1) : '0';
  };

  const personalizationTokens = [
    { token: '{{company_name}}', description: 'Company name from discovery data' },
    { token: '{{contact_name}}', description: 'Contact first name from enrichment' },
    { token: '{{funding_round}}', description: 'Latest funding round (Series A, B, etc.)' },
    { token: '{{funding_amount}}', description: 'Funding amount in formatted currency' },
    { token: '{{tech_stack}}', description: 'Primary technologies used by company' },
    { token: '{{hiring_signals}}', description: 'Recent hiring activity and roles' },
    { token: '{{industry_insights}}', description: 'AI-generated industry-specific insights' },
    { token: '{{similar_company}}', description: 'Comparable company for case studies' },
    { token: '{{current_activity}}', description: 'Recent company activity or news' },
    { token: '{{best_send_time}}', description: 'ML-optimized send time for recipient' }
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Mail className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-slate-900">Advanced Email Orchestration</h2>
          <InfoModal
            title="Advanced Email Orchestration Platform"
            description="AI-powered email sequences with conditional branching, deliverability optimization, and real-time personalization at scale."
            features={[
              "Multi-step conditional email sequences with smart branching logic",
              "Real-time deliverability monitoring and spam score optimization",
              "AI-powered personalization with 50+ dynamic content tokens",
              "ML-based send time optimization for maximum engagement",
              "Advanced analytics with engagement tracking and attribution"
            ]}
            businessValue="Advanced email orchestration increases response rates by 65% and reduces manual effort by 80% through intelligent automation and personalization."
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowCreateSequence(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Mail className="h-4 w-4 inline mr-2" />
            Create Sequence
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-slate-200">
        <nav className="flex space-x-8">
          {[
            { id: 'sequences', name: 'Email Sequences', icon: Mail },
            { id: 'deliverability', name: 'Deliverability', icon: TrendingUp },
            { id: 'personalization', name: 'Personalization', icon: Users },
            { id: 'optimization', name: 'Send Time Optimization', icon: Clock }
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

      {/* Email Sequences Tab */}
      {activeTab === 'sequences' && (
        <div className="space-y-6">
          {/* Performance Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <Send className="h-5 w-5 text-blue-600" />
                <span className="font-medium text-slate-900">Active Sequences</span>
              </div>
              <div className="text-2xl font-bold text-slate-900">
                {sequences.filter(seq => seq.status === 'active').length}
              </div>
              <div className="text-sm text-slate-600">of {sequences.length} total</div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <Mail className="h-5 w-5 text-emerald-600" />
                <span className="font-medium text-slate-900">Emails Sent Today</span>
              </div>
              <div className="text-2xl font-bold text-slate-900">2,847</div>
              <div className="text-sm text-emerald-600">+23% from yesterday</div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <BarChart3 className="h-5 w-5 text-purple-600" />
                <span className="font-medium text-slate-900">Avg Open Rate</span>
              </div>
              <div className="text-2xl font-bold text-slate-900">34.2%</div>
              <div className="text-sm text-slate-600">industry avg: 21%</div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="h-5 w-5 text-orange-600" />
                <span className="font-medium text-slate-900">Reply Rate</span>
              </div>
              <div className="text-2xl font-bold text-slate-900">2.8%</div>
              <div className="text-sm text-slate-600">industry avg: 1.2%</div>
            </div>
          </div>

          {/* Email Sequences List */}
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <h3 className="font-semibold text-slate-900 mb-6">Email Sequences</h3>
            
            <div className="space-y-4">
              {sequences.map((sequence) => (
                <div key={sequence.id} className="p-6 border border-slate-200 rounded-xl hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      <div className={`p-2 rounded-lg ${
                        sequence.status === 'active' ? 'bg-emerald-100' :
                        sequence.status === 'paused' ? 'bg-amber-100' :
                        'bg-slate-100'
                      }`}>
                        <Mail className={`h-5 w-5 ${
                          sequence.status === 'active' ? 'text-emerald-600' :
                          sequence.status === 'paused' ? 'text-amber-600' :
                          'text-slate-600'
                        }`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h4 className="font-semibold text-slate-900">{sequence.name}</h4>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(sequence.status)}`}>
                            {sequence.status}
                          </span>
                        </div>
                        <p className="text-slate-600 mb-2">{sequence.description}</p>
                        <div className="text-sm text-slate-500">
                          {sequence.steps.length} steps • Trigger: {sequence.trigger.type.replace('_', ' ')}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="text-right text-sm">
                        <div className="font-medium text-slate-900">{calculateOpenRate(sequence)}%</div>
                        <div className="text-slate-600">Open Rate</div>
                      </div>
                      <div className="text-right text-sm">
                        <div className="font-medium text-emerald-600">{calculateReplyRate(sequence)}%</div>
                        <div className="text-slate-600">Reply Rate</div>
                      </div>
                      <button
                        onClick={() => toggleSequence(sequence.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          sequence.status === 'active'
                            ? 'bg-amber-100 hover:bg-amber-200 text-amber-700'
                            : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-700'
                        }`}
                      >
                        {sequence.status === 'active' ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Performance Metrics */}
                  <div className="grid grid-cols-6 gap-4 text-sm">
                    <div className="text-center">
                      <div className="font-medium text-slate-900">{sequence.performance.sent}</div>
                      <div className="text-slate-600">Sent</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium text-blue-600">{sequence.performance.opened}</div>
                      <div className="text-slate-600">Opened</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium text-purple-600">{sequence.performance.clicked}</div>
                      <div className="text-slate-600">Clicked</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium text-emerald-600">{sequence.performance.replied}</div>
                      <div className="text-slate-600">Replied</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium text-red-600">{sequence.performance.bounced}</div>
                      <div className="text-slate-600">Bounced</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium text-orange-600">{sequence.performance.unsubscribed}</div>
                      <div className="text-slate-600">Unsubscribed</div>
                    </div>
                  </div>

                  {/* Steps Preview */}
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-medium text-slate-700">Sequence Steps:</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {sequence.steps.map((step, index) => (
                        <React.Fragment key={step.id}>
                          <div className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded border border-blue-200">
                            {step.name}
                          </div>
                          {index < sequence.steps.length - 1 && (
                            <span className="text-slate-400">→</span>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Deliverability Tab */}
      {activeTab === 'deliverability' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <h3 className="font-semibold text-slate-900 mb-6">Email Deliverability Intelligence</h3>
            
            {deliverabilityMetrics.map((metrics, index) => (
              <div key={index} className="space-y-6">
                {/* Domain Overview */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="text-center p-4 bg-emerald-50 rounded-lg">
                    <div className="text-2xl font-bold text-emerald-600">{(metrics.reputation_score * 100).toFixed(0)}%</div>
                    <div className="text-sm text-emerald-700">Domain Reputation</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{(metrics.spam_score * 100).toFixed(1)}%</div>
                    <div className="text-sm text-blue-700">Spam Score</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{(metrics.engagement_rate * 100).toFixed(1)}%</div>
                    <div className="text-sm text-purple-700">Engagement Rate</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">{(metrics.bounce_rate * 100).toFixed(2)}%</div>
                    <div className="text-sm text-orange-700">Bounce Rate</div>
                  </div>
                </div>

                {/* Authentication Status */}
                <div className="p-4 bg-slate-50 rounded-lg">
                  <h4 className="font-medium text-slate-900 mb-3">Email Authentication</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="flex items-center gap-2">
                      {metrics.authentication.spf ? (
                        <div className="w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                      ) : (
                        <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">✗</span>
                        </div>
                      )}
                      <span className="text-sm font-medium">SPF</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {metrics.authentication.dkim ? (
                        <div className="w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                      ) : (
                        <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">✗</span>
                        </div>
                      )}
                      <span className="text-sm font-medium">DKIM</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {metrics.authentication.dmarc ? (
                        <div className="w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                      ) : (
                        <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">✗</span>
                        </div>
                      )}
                      <span className="text-sm font-medium">DMARC</span>
                    </div>
                  </div>
                </div>

                {/* Recommendations */}
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-3">Deliverability Recommendations</h4>
                  <ul className="space-y-2">
                    {metrics.recommendations.map((rec, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-blue-800">
                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Personalization Tab */}
      {activeTab === 'personalization' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <h3 className="font-semibold text-slate-900 mb-6">AI Personalization Engine</h3>
            
            {/* Personalization Tokens */}
            <div className="mb-6">
              <h4 className="font-medium text-slate-900 mb-4">Available Personalization Tokens</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {personalizationTokens.map((token, index) => (
                  <div key={index} className="p-3 border border-slate-200 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <code className="text-sm font-mono bg-slate-100 px-2 py-1 rounded text-blue-600">
                        {token.token}
                      </code>
                      <button className="text-xs text-blue-600 hover:text-blue-700">Copy</button>
                    </div>
                    <p className="text-sm text-slate-600">{token.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Personalization Performance */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-lg">
                <h4 className="font-medium text-slate-900 mb-2">Company-Specific</h4>
                <div className="text-2xl font-bold text-emerald-600">+67%</div>
                <div className="text-sm text-slate-600">Open rate increase</div>
              </div>
              <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                <h4 className="font-medium text-slate-900 mb-2">Industry Insights</h4>
                <div className="text-2xl font-bold text-blue-600">+34%</div>
                <div className="text-sm text-slate-600">Click rate increase</div>
              </div>
              <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                <h4 className="font-medium text-slate-900 mb-2">Timing Signals</h4>
                <div className="text-2xl font-bold text-purple-600">+89%</div>
                <div className="text-sm text-slate-600">Reply rate increase</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Send Time Optimization Tab */}
      {activeTab === 'optimization' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <h3 className="font-semibold text-slate-900 mb-6">ML-Powered Send Time Optimization</h3>
            
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {/* Optimal Times */}
              <div>
                <h4 className="font-medium text-slate-900 mb-4">Optimal Send Times by Industry</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <span className="text-slate-700">Technology/SaaS</span>
                    <span className="font-medium text-slate-900">Tuesday 10:00 AM PST</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <span className="text-slate-700">Financial Services</span>
                    <span className="font-medium text-slate-900">Wednesday 2:00 PM EST</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <span className="text-slate-700">Healthcare</span>
                    <span className="font-medium text-slate-900">Thursday 11:00 AM CST</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <span className="text-slate-700">E-commerce/Retail</span>
                    <span className="font-medium text-slate-900">Friday 9:00 AM EST</span>
                  </div>
                </div>
              </div>

              {/* Timezone Intelligence */}
              <div>
                <h4 className="font-medium text-slate-900 mb-4">Timezone Intelligence</h4>
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Globe className="h-4 w-4 text-blue-600" />
                      <span className="font-medium text-blue-900">Smart Timezone Detection</span>
                    </div>
                    <p className="text-sm text-blue-800">
                      Automatically detects recipient timezone from company location and optimizes send times accordingly.
                    </p>
                  </div>
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="h-4 w-4 text-emerald-600" />
                      <span className="font-medium text-emerald-900">Business Hours Optimization</span>
                    </div>
                    <p className="text-sm text-emerald-800">
                      Ensures emails arrive during optimal business hours for maximum engagement.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Impact */}
            <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg">
              <h4 className="font-medium text-purple-900 mb-3">Optimization Impact</h4>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-purple-600">+42%</div>
                  <div className="text-sm text-purple-700">Open Rate</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">+28%</div>
                  <div className="text-sm text-blue-700">Click Rate</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-emerald-600">+56%</div>
                  <div className="text-sm text-emerald-700">Reply Rate</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}