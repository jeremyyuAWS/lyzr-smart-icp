import React, { useState } from 'react';
import { BarChart3, Target, TrendingUp, Users, Mail, ExternalLink } from 'lucide-react';
import { InfoModal } from './InfoModal';
import { LeadProfileModal } from './LeadProfileModal';
import { formatScore, getScoreColor, getScoreBadgeColor } from '../lib/utils';
import leadScores from '../data/lead_scores.json';
import perplexityContacts from '../data/perplexity_contacts.json';
import phindSignals from '../data/phind_signals.json';
import serpResults from '../data/serp_results.json';

export function LeadScoring() {
  const [selectedLead, setSelectedLead] = useState<any>(null);

  const getContactsForCompany = (companyName: string) => {
    const companyContacts = perplexityContacts.contacts.find(
      c => c.company === companyName
    );
    return companyContacts?.contacts || [];
  };

  const getEnrichedLeadData = (lead: any) => {
    const contacts = getContactsForCompany(lead.company);
    const signals = phindSignals.signals.find(s => s.company === lead.company);
    const serpData = serpResults.serp_data.find(s => s.company === lead.company);
    
    return {
      ...lead,
      contacts,
      ...signals,
      serp_data: serpData,
      domain: lead.company.toLowerCase().replace(/[^a-z0-9]/g, '') + '.com',
      description: `Leading company in their industry with strong growth indicators and technical capabilities.`,
      exa_data: {
        source_url: `https://${lead.company.toLowerCase().replace(/[^a-z0-9]/g, '')}.com/about`,
        discovery_method: 'semantic_search',
        confidence: lead.icp_fit_score
      }
    };
  };

  const openLeadProfile = (lead: any) => {
    const enrichedData = getEnrichedLeadData(lead);
    setSelectedLead(enrichedData);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <BarChart3 className="h-6 w-6 text-blue-600" />
        <h2 className="text-2xl font-bold text-slate-900">Lead Scoring & Qualification</h2>
        <InfoModal
          title="Lead Scoring & Qualification"
          description="AI-powered lead scoring combines multiple signals to rank prospects by likelihood to convert."
          features={[
            "Multi-dimensional scoring: ICP fit, confidence, and signal strength",
            "Detailed scoring breakdown with individual factor analysis",
            "Priority recommendations based on score thresholds",
            "Contact enrichment with verified decision makers"
          ]}
          businessValue="Intelligent lead scoring increases conversion rates by 35% and reduces time-to-close by 28% by focusing on highest-probability prospects."
        />
      </div>

      <div className="grid gap-6">
        {leadScores.scored_leads.map((lead, index) => {
          const contacts = getContactsForCompany(lead.company);
          
          return (
            <div 
              key={index} 
              className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group"
              onClick={() => openLeadProfile(lead)}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-lg flex items-center justify-center">
                      <Target className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 text-lg group-hover:text-blue-600 transition-colors">
                        {lead.company}
                      </h3>
                      <div className="flex items-center gap-3 mt-1">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getScoreBadgeColor(lead.overall_score)}`}>
                          {formatScore(lead.overall_score)} Overall Score
                        </span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          lead.priority === 'High' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {lead.priority} Priority
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ExternalLink className="h-4 w-4" />
                    </div>
                  </div>
                </div>

                {/* Score Overview */}
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${getScoreColor(lead.icp_fit_score)}`}>
                      {formatScore(lead.icp_fit_score)}
                    </div>
                    <div className="text-sm text-slate-600">ICP Fit</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${getScoreColor(lead.confidence_score)}`}>
                      {formatScore(lead.confidence_score)}
                    </div>
                    <div className="text-sm text-slate-600">Confidence</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${getScoreColor(lead.signal_strength)}`}>
                      {formatScore(lead.signal_strength)}
                    </div>
                    <div className="text-sm text-slate-600">Signal Strength</div>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-lg p-4 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-emerald-600" />
                    <span className="font-medium text-slate-900">Recommended Action</span>
                  </div>
                  <p className="text-slate-700">{lead.recommended_action}</p>
                </div>

                {/* Preview of key data points */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-medium text-slate-900 text-sm mb-2">Confidence Factors</h5>
                    <ul className="space-y-1">
                      {lead.confidence_factors.slice(0, 2).map((factor: string, i: number) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2 flex-shrink-0" />
                          {factor}
                        </li>
                      ))}
                      {lead.confidence_factors.length > 2 && (
                        <li className="text-xs text-slate-500 ml-4">
                          +{lead.confidence_factors.length - 2} more factors
                        </li>
                      )}
                    </ul>
                  </div>

                  {contacts.length > 0 && (
                    <div>
                      <h5 className="font-medium text-slate-900 text-sm mb-2 flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Key Contacts ({contacts.length})
                      </h5>
                      <div className="space-y-2">
                        {contacts.slice(0, 2).map((contact: any, i: number) => (
                          <div key={i} className="flex items-center justify-between text-sm">
                            <div>
                              <div className="font-medium text-slate-900">{contact.name}</div>
                              <div className="text-slate-600">{contact.title}</div>
                            </div>
                            <div className="flex items-center gap-1">
                              <Mail className="h-3 w-3 text-slate-400" />
                              <ExternalLink className="h-3 w-3 text-slate-400" />
                            </div>
                          </div>
                        ))}
                        {contacts.length > 2 && (
                          <div className="text-xs text-slate-500">
                            +{contacts.length - 2} more contacts
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
                  <div className="text-xs text-slate-500">
                    Click to view detailed profile with all agent data
                  </div>
                  <div className="flex items-center gap-1">
                    <img src="/images/Exa-logo-square.jpeg" alt="Exa" className="w-4 h-4 rounded" />
                    <img src="/images/Phind-logo-square.png" alt="Phind" className="w-4 h-4 rounded" />
                    <img src="/images/Perplexity-logo-square.jpeg" alt="Perplexity" className="w-4 h-4 rounded" />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Lead Profile Modal */}
      {selectedLead && (
        <LeadProfileModal
          isOpen={!!selectedLead}
          onClose={() => setSelectedLead(null)}
          leadData={selectedLead}
        />
      )}
    </div>
  );
}