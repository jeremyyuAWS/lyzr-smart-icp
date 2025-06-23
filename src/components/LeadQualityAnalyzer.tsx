import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, Clock, Users, Mail, Search, TrendingUp, Zap, RefreshCw, Target } from 'lucide-react';
import { InfoModal } from './InfoModal';
import leadFeedback from '../data/lead_feedback.json';

interface SignalEvaluation {
  lead_id: string;
  company: string;
  completeness_score: number;
  missing_fields: string[];
  recommended_actions: string[];
  priority_level: 'low' | 'medium' | 'high';
  estimated_enrichment_time: string;
}

export function LeadQualityAnalyzer() {
  const [evaluations] = useState<SignalEvaluation[]>([
    {
      lead_id: 'lead_001',
      company: 'GridTech Solutions',
      completeness_score: 0.89,
      missing_fields: ['phone', 'company_size_exact'],
      recommended_actions: [
        'Enrich via LinkedIn Sales Navigator',
        'Cross-reference with company website'
      ],
      priority_level: 'low',
      estimated_enrichment_time: '15 minutes'
    },
    {
      lead_id: 'lead_002', 
      company: 'CleanPower Analytics',
      completeness_score: 0.67,
      missing_fields: ['contact_title', 'decision_maker_info', 'budget_authority'],
      recommended_actions: [
        'Re-run with Perplexity for executive contacts',
        'Research organizational structure',
        'Find additional decision makers'
      ],
      priority_level: 'high',
      estimated_enrichment_time: '45 minutes'
    },
    {
      lead_id: 'lead_003',
      company: 'EnergyFlow Systems',
      completeness_score: 0.45,
      missing_fields: ['email', 'phone', 'linkedin', 'contact_background'],
      recommended_actions: [
        'Mark for manual review',
        'Enrich via Apollo or ZoomInfo',
        'Research company leadership team'
      ],
      priority_level: 'high', 
      estimated_enrichment_time: '60 minutes'
    },
    {
      lead_id: 'lead_004',
      company: 'PowerGrid Dynamics',
      completeness_score: 0.92,
      missing_fields: ['secondary_contacts'],
      recommended_actions: [
        'Identify additional stakeholders',
        'Map buying committee'
      ],
      priority_level: 'medium',
      estimated_enrichment_time: '30 minutes'
    }
  ]);

  const [selectedEvaluation, setSelectedEvaluation] = useState<SignalEvaluation | null>(null);

  const getCompletenessColor = (score: number) => {
    if (score >= 0.8) return 'text-emerald-600';
    if (score >= 0.6) return 'text-blue-600';
    if (score >= 0.4) return 'text-amber-600';
    return 'text-red-600';
  };

  const getCompletenessBadgeColor = (score: number) => {
    if (score >= 0.8) return 'bg-emerald-100 text-emerald-800';
    if (score >= 0.6) return 'bg-blue-100 text-blue-800';
    if (score >= 0.4) return 'bg-amber-100 text-amber-800';
    return 'bg-red-100 text-red-800';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-amber-600 bg-amber-100';
      case 'low': return 'text-emerald-600 bg-emerald-100';
      default: return 'text-slate-600 bg-slate-100';
    }
  };

  const runEnrichment = (leadId: string, action: string) => {
    // Simulate enrichment action
    console.log(`Running enrichment: ${action} for lead ${leadId}`);
    
    // Show notification
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded z-50';
    notification.innerHTML = `
      <div class="flex items-center gap-2">
        <svg class="w-4 h-4 animate-spin" fill="currentColor" viewBox="0 0 20 20">
          <path d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
        </svg>
        <span>Running enrichment: ${action}</span>
      </div>
    `;
    document.body.appendChild(notification);
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 3000);
  };

  const avgCompleteness = evaluations.reduce((sum, eval) => sum + eval.completeness_score, 0) / evaluations.length;
  const highPriorityCount = evaluations.filter(eval => eval.priority_level === 'high').length;
  const incompleteLeads = evaluations.filter(eval => eval.completeness_score < 0.8).length;

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <Search className="h-6 w-6 text-blue-600" />
        <h2 className="text-2xl font-bold text-slate-900">Lead Quality Analyzer</h2>
        <InfoModal
          title="Signal-Aware Lead Evaluation"
          description="Advanced lead quality analysis that detects incomplete leads and recommends specific enrichment paths to maximize conversion potential."
          features={[
            "Automated completeness scoring for all lead fields",
            "Smart recommendations for missing critical information",
            "Priority-based enrichment workflow management",
            "Integration with multiple enrichment data sources",
            "Quality improvement tracking and analytics"
          ]}
          businessValue="Lead quality analysis improves conversion rates by 35% and reduces sales team time spent on incomplete leads by 60% through intelligent enrichment recommendations."
        />
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle className="h-5 w-5 text-emerald-600" />
            <span className="font-medium text-slate-900">Avg Completeness</span>
          </div>
          <div className={`text-2xl font-bold ${getCompletenessColor(avgCompleteness)}`}>
            {Math.round(avgCompleteness * 100)}%
          </div>
          <div className="text-sm text-slate-600">across all leads</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <span className="font-medium text-slate-900">High Priority</span>
          </div>
          <div className="text-2xl font-bold text-red-600">{highPriorityCount}</div>
          <div className="text-sm text-slate-600">need immediate attention</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="h-5 w-5 text-amber-600" />
            <span className="font-medium text-slate-900">Incomplete Leads</span>
          </div>
          <div className="text-2xl font-bold text-amber-600">{incompleteLeads}</div>
          <div className="text-sm text-slate-600">below 80% complete</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            <span className="font-medium text-slate-900">Success Rate</span>
          </div>
          <div className="text-2xl font-bold text-blue-600">{Math.round(leadFeedback.feedback_analytics.score_accuracy * 100)}%</div>
          <div className="text-sm text-slate-600">quality prediction</div>
        </div>
      </div>

      {/* Lead Quality Analysis */}
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <h3 className="font-semibold text-slate-900 mb-6">Lead Quality Evaluation</h3>
        
        <div className="space-y-4">
          {evaluations.map((evaluation) => (
            <div key={evaluation.lead_id} className="p-6 border border-slate-200 rounded-xl hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 text-lg">{evaluation.company}</h4>
                    <div className="flex items-center gap-3 mt-1">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCompletenessBadgeColor(evaluation.completeness_score)}`}>
                        {Math.round(evaluation.completeness_score * 100)}% Complete
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(evaluation.priority_level)}`}>
                        {evaluation.priority_level} priority
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-sm text-slate-600 mb-1">Est. Enrichment</div>
                  <div className="font-medium text-slate-900">{evaluation.estimated_enrichment_time}</div>
                </div>
              </div>

              {/* Missing Fields */}
              <div className="mb-4">
                <h5 className="font-medium text-slate-900 mb-2 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                  Missing Fields ({evaluation.missing_fields.length})
                </h5>
                <div className="flex flex-wrap gap-2">
                  {evaluation.missing_fields.map((field, i) => (
                    <span key={i} className="px-2 py-1 bg-red-50 text-red-700 text-sm rounded border border-red-200">
                      {field.replace('_', ' ')}
                    </span>
                  ))}
                </div>
              </div>

              {/* Recommended Actions */}
              <div className="mb-4">
                <h5 className="font-medium text-slate-900 mb-2 flex items-center gap-2">
                  <Target className="h-4 w-4 text-blue-600" />
                  Recommended Actions
                </h5>
                <div className="space-y-2">
                  {evaluation.recommended_actions.map((action, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <span className="text-sm text-blue-800">{action}</span>
                      <button
                        onClick={() => runEnrichment(evaluation.lead_id, action)}
                        className="px-3 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
                      >
                        <RefreshCw className="h-3 w-3 inline mr-1" />
                        Run
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quality Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Completeness Score</span>
                  <span className={`font-medium ${getCompletenessColor(evaluation.completeness_score)}`}>
                    {Math.round(evaluation.completeness_score * 100)}%
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-emerald-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${evaluation.completeness_score * 100}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
                <div className="text-xs text-slate-500">
                  Lead ID: {evaluation.lead_id}
                </div>
                <button
                  onClick={() => setSelectedEvaluation(evaluation)}
                  className="px-3 py-1 text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 rounded transition-colors"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Feedback Analytics */}
      <div className="bg-gradient-to-r from-emerald-50 to-blue-50 border border-emerald-200 rounded-xl p-6">
        <h3 className="font-semibold text-slate-900 mb-4">Quality Improvement Analytics</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-slate-900 mb-3">Performance Metrics</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Leads Tracked:</span>
                <span className="font-medium text-slate-900">{leadFeedback.feedback_analytics.total_leads_tracked}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Contact Rate:</span>
                <span className="font-medium text-emerald-600">{Math.round(leadFeedback.feedback_analytics.contacted_rate * 100)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Reply Rate:</span>
                <span className="font-medium text-blue-600">{Math.round(leadFeedback.feedback_analytics.reply_rate * 100)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Conversion Rate:</span>
                <span className="font-medium text-purple-600">{Math.round(leadFeedback.feedback_analytics.conversion_rate * 100)}%</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-slate-900 mb-3">Improvement Areas</h4>
            <ul className="space-y-1 text-sm">
              {leadFeedback.feedback_analytics.improvement_areas.map((area, i) => (
                <li key={i} className="flex items-start gap-2 text-slate-700">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                  {area}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Detailed Modal */}
      {selectedEvaluation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">{selectedEvaluation.company}</h2>
                  <p className="text-slate-600">Lead Quality Analysis</p>
                </div>
                <button
                  onClick={() => setSelectedEvaluation(null)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-slate-600">Completeness Score</span>
                    <div className={`text-2xl font-bold ${getCompletenessColor(selectedEvaluation.completeness_score)}`}>
                      {Math.round(selectedEvaluation.completeness_score * 100)}%
                    </div>
                  </div>
                  <div>
                    <span className="text-sm text-slate-600">Priority Level</span>
                    <div className={`text-xl font-bold capitalize ${
                      selectedEvaluation.priority_level === 'high' ? 'text-red-600' :
                      selectedEvaluation.priority_level === 'medium' ? 'text-amber-600' : 'text-emerald-600'
                    }`}>
                      {selectedEvaluation.priority_level}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-slate-900 mb-2">Missing Information</h3>
                  <div className="space-y-1">
                    {selectedEvaluation.missing_fields.map((field, i) => (
                      <div key={i} className="text-sm text-red-700 bg-red-50 px-2 py-1 rounded">
                        {field.replace('_', ' ')}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-slate-900 mb-2">Enrichment Plan</h3>
                  <div className="space-y-2">
                    {selectedEvaluation.recommended_actions.map((action, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                        <span className="text-sm text-blue-800">{action}</span>
                        <span className="text-xs text-slate-500">Est. {Math.round(Math.random() * 20 + 10)}min</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4">
                  <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Start Enrichment Process
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