import React, { useState, useEffect } from 'react';
import { Clock, Users, TrendingUp, CheckCircle, AlertCircle, Calendar, Mail, Phone, MessageSquare } from 'lucide-react';
import { InfoModal } from './InfoModal';

interface Lead {
  id: string;
  company: string;
  contact: string;
  email: string;
  score: number;
  stage: 'new' | 'contacted' | 'qualified' | 'opportunity' | 'closed-won' | 'closed-lost';
  lastActivity: string;
  nextAction: string;
  source: string;
  crmId?: string;
}

interface LeadLifecycleProps {
  onNavigateToTab?: (tabId: string) => void;
}

export function LeadLifecycle({ onNavigateToTab }: LeadLifecycleProps) {
  const [leads, setLeads] = useState<Lead[]>([
    {
      id: '1',
      company: 'TechFlow Solutions',
      contact: 'Sarah Chen',
      email: 'sarah@techflowsolutions.com',
      score: 0.92,
      stage: 'opportunity',
      lastActivity: '2024-01-15 10:30 AM',
      nextAction: 'Follow up on demo feedback',
      source: 'Workflow Discovery',
      crmId: 'HUB-001234'
    },
    {
      id: '2',
      company: 'DataStream Analytics',
      contact: 'Dr. Emily Watson',
      email: 'emily@datastreamanalytics.com',
      score: 0.88,
      stage: 'contacted',
      lastActivity: '2024-01-14 3:15 PM',
      nextAction: 'Schedule discovery call',
      source: 'Workflow Discovery',
      crmId: 'HUB-001235'
    },
    {
      id: '3',
      company: 'CloudScale Technologies',
      contact: 'Alex Thompson',
      email: 'alex@cloudscaletech.io',
      score: 0.85,
      stage: 'qualified',
      lastActivity: '2024-01-13 2:45 PM',
      nextAction: 'Send technical proposal',
      source: 'Manual Upload',
      crmId: 'SF-002341'
    },
    {
      id: '4',
      company: 'InnovateRetail',
      contact: 'Anna Petrov',
      email: 'anna@innovateretail.com',
      score: 0.78,
      stage: 'new',
      lastActivity: '2024-01-15 9:00 AM',
      nextAction: 'Initial outreach email',
      source: 'Workflow Discovery'
    }
  ]);

  const [selectedStage, setSelectedStage] = useState<string>('all');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  // Check for new leads from other components
  useEffect(() => {
    const checkForNewLeads = () => {
      const selectedLeadData = localStorage.getItem('selectedLeadForCRM');
      if (selectedLeadData) {
        try {
          const leadData = JSON.parse(selectedLeadData);
          
          // Create a new lead from the selected data
          const newLead: Lead = {
            id: `lead-${Date.now()}`,
            company: leadData.company,
            contact: leadData.contacts?.[0]?.name || 'Contact TBD',
            email: leadData.contacts?.[0]?.email || 'email@company.com',
            score: leadData.overall_score || leadData.similarity_score || 0.8,
            stage: 'new',
            lastActivity: new Date().toLocaleString(),
            nextAction: 'Initial outreach and qualification',
            source: 'Lead Profile Action',
            crmId: `CRM-${Date.now()}`
          };

          // Add the lead if it doesn't already exist
          setLeads(prev => {
            const existingLead = prev.find(l => l.company === newLead.company);
            if (!existingLead) {
              return [newLead, ...prev];
            }
            return prev;
          });

          // Clear the localStorage
          localStorage.removeItem('selectedLeadForCRM');
        } catch (error) {
          console.error('Error parsing lead data:', error);
        }
      }
    };

    // Check on component mount and periodically
    checkForNewLeads();
    const interval = setInterval(checkForNewLeads, 1000);
    
    return () => clearInterval(interval);
  }, []);

  const stages = [
    { id: 'all', name: 'All Leads', color: 'slate' },
    { id: 'new', name: 'New', color: 'blue' },
    { id: 'contacted', name: 'Contacted', color: 'amber' },
    { id: 'qualified', name: 'Qualified', color: 'purple' },
    { id: 'opportunity', name: 'Opportunity', color: 'emerald' },
    { id: 'closed-won', name: 'Closed Won', color: 'green' },
    { id: 'closed-lost', name: 'Closed Lost', color: 'red' }
  ];

  const updateLeadStage = (leadId: string, newStage: Lead['stage']) => {
    setLeads(prev => prev.map(lead => 
      lead.id === leadId 
        ? { ...lead, stage: newStage, lastActivity: new Date().toLocaleString() }
        : lead
    ));
  };

  const filteredLeads = selectedStage === 'all' 
    ? leads 
    : leads.filter(lead => lead.stage === selectedStage);

  const getStageColor = (stage: string) => {
    const stageConfig = stages.find(s => s.id === stage);
    return stageConfig?.color || 'slate';
  };

  const getStageIcon = (stage: string) => {
    switch (stage) {
      case 'new': return <Clock className="h-4 w-4" />;
      case 'contacted': return <Mail className="h-4 w-4" />;
      case 'qualified': return <CheckCircle className="h-4 w-4" />;
      case 'opportunity': return <TrendingUp className="h-4 w-4" />;
      case 'closed-won': return <CheckCircle className="h-4 w-4" />;
      case 'closed-lost': return <AlertCircle className="h-4 w-4" />;
      default: return <Users className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <TrendingUp className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-slate-900">Lead Pipeline Management</h2>
          <InfoModal
            title="Lead Pipeline Management"
            description="Track leads through the entire sales pipeline from discovery to close with automated stage progression and CRM sync."
            features={[
              "Visual pipeline with drag-and-drop stage management",
              "Automated CRM synchronization and field mapping",
              "Next action recommendations and follow-up scheduling",
              "Lead scoring progression and quality tracking",
              "Activity timeline and engagement history"
            ]}
            businessValue="Pipeline management increases conversion rates by 45% and reduces sales cycle length by 30% through systematic lead progression and automated follow-ups."
          />
        </div>
        
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
            Export Pipeline
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Sync with CRM
          </button>
        </div>
      </div>

      {/* Pipeline Overview */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        {stages.map(stage => {
          const count = stage.id === 'all' ? leads.length : leads.filter(l => l.stage === stage.id).length;
          const isSelected = selectedStage === stage.id;
          
          return (
            <button
              key={stage.id}
              onClick={() => setSelectedStage(stage.id)}
              className={`p-4 border-2 rounded-xl transition-all ${
                isSelected 
                  ? `border-${stage.color}-500 bg-${stage.color}-50` 
                  : 'border-slate-200 bg-white hover:bg-slate-50'
              }`}
            >
              <div className={`text-2xl font-bold mb-1 ${
                isSelected ? `text-${stage.color}-600` : 'text-slate-900'
              }`}>
                {count}
              </div>
              <div className={`text-sm ${
                isSelected ? `text-${stage.color}-700` : 'text-slate-600'
              }`}>
                {stage.name}
              </div>
            </button>
          );
        })}
      </div>

      {/* Lead Cards */}
      <div className="grid gap-4">
        {filteredLeads.map(lead => (
          <div key={lead.id} className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 text-lg">{lead.company}</h3>
                  <p className="text-slate-600">{lead.contact} • {lead.email}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-slate-500">{lead.source}</span>
                    {lead.crmId && (
                      <>
                        <span className="text-xs text-slate-400">•</span>
                        <span className="text-xs text-slate-500">CRM: {lead.crmId}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className={`text-lg font-bold ${
                    lead.score >= 0.8 ? 'text-emerald-600' : 
                    lead.score >= 0.6 ? 'text-blue-600' : 'text-amber-600'
                  }`}>
                    {Math.round(lead.score * 100)}%
                  </div>
                  <div className="text-xs text-slate-500">Score</div>
                </div>
                
                <select
                  value={lead.stage}
                  onChange={(e) => updateLeadStage(lead.id, e.target.value as Lead['stage'])}
                  className={`px-3 py-2 border border-slate-200 rounded-lg text-sm font-medium bg-${getStageColor(lead.stage)}-50 text-${getStageColor(lead.stage)}-700`}
                >
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="qualified">Qualified</option>
                  <option value="opportunity">Opportunity</option>
                  <option value="closed-won">Closed Won</option>
                  <option value="closed-lost">Closed Lost</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-slate-400" />
                  <span className="text-sm font-medium text-slate-700">Last Activity</span>
                </div>
                <p className="text-sm text-slate-600">{lead.lastActivity}</p>
              </div>
              
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-4 w-4 text-slate-400" />
                  <span className="text-sm font-medium text-slate-700">Next Action</span>
                </div>
                <p className="text-sm text-slate-600">{lead.nextAction}</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <div className={`flex items-center gap-2 px-3 py-1 bg-${getStageColor(lead.stage)}-100 text-${getStageColor(lead.stage)}-700 rounded-full text-sm`}>
                {getStageIcon(lead.stage)}
                <span className="capitalize">{lead.stage.replace('-', ' ')}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => {
                    // Store lead data for email generation
                    localStorage.setItem('selectedLeadForEmail', JSON.stringify({
                      company: lead.company,
                      contact: lead.contact,
                      email: lead.email,
                      score: lead.score
                    }));
                    if (onNavigateToTab) {
                      onNavigateToTab('emails');
                    }
                  }}
                  className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                  title="Generate Email"
                >
                  <Mail className="h-4 w-4" />
                </button>
                <button className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors">
                  <Phone className="h-4 w-4" />
                </button>
                <button className="p-2 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded transition-colors">
                  <MessageSquare className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setSelectedLead(lead)}
                  className="px-3 py-1 text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 rounded transition-colors"
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredLeads.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">No leads in this stage</h3>
          <p className="text-slate-600">Run the workflow to discover new leads or check other pipeline stages.</p>
        </div>
      )}

      {/* Lead Detail Modal */}
      {selectedLead && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 max-h-96 overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold text-slate-900">{selectedLead.company}</h3>
              <button
                onClick={() => setSelectedLead(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700">Contact</label>
                  <p className="text-slate-900">{selectedLead.contact}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">Email</label>
                  <p className="text-slate-900">{selectedLead.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">Score</label>
                  <p className="text-slate-900">{Math.round(selectedLead.score * 100)}%</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">Source</label>
                  <p className="text-slate-900">{selectedLead.source}</p>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-slate-700">Activity Timeline</label>
                <div className="mt-2 space-y-2">
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <Clock className="h-4 w-4 text-slate-400" />
                    <div>
                      <p className="text-sm text-slate-900">Lead added to pipeline</p>
                      <p className="text-xs text-slate-500">{selectedLead.lastActivity}</p>
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