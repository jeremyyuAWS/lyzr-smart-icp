import React, { useState } from 'react';
import { Building, Users, TrendingUp, Mail, Phone, Linkedin, Crown, Shield, Target, DollarSign, Clock, Award } from 'lucide-react';
import { InfoModal } from './InfoModal';
import accountRollups from '../data/account_rollups.json';

export function AccountRollupView() {
  const [selectedAccount, setSelectedAccount] = useState<any>(null);
  const [selectedContact, setSelectedContact] = useState<any>(null);

  const getInfluenceColor = (score: number) => {
    if (score >= 0.9) return 'text-emerald-600';
    if (score >= 0.8) return 'text-blue-600';
    if (score >= 0.7) return 'text-purple-600';
    return 'text-amber-600';
  };

  const getDecisionPowerIcon = (power: string) => {
    switch (power) {
      case 'final_approver': return <Crown className="h-4 w-4 text-purple-600" />;
      case 'technical_evaluator': return <Shield className="h-4 w-4 text-blue-600" />;
      case 'technical_influencer': return <Target className="h-4 w-4 text-emerald-600" />;
      default: return <Users className="h-4 w-4 text-slate-600" />;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'executive': return 'bg-purple-100 text-purple-800';
      case 'decision_maker': return 'bg-blue-100 text-blue-800';
      case 'influencer': return 'bg-emerald-100 text-emerald-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  const totalContacts = accountRollups.account_rollups.reduce((sum, account) => sum + account.total_contacts, 0);
  const avgContactsPerAccount = accountRollups.rollup_analytics.avg_contacts_per_account;
  const totalPipelineValue = accountRollups.rollup_analytics.total_pipeline_value;

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <Building className="h-6 w-6 text-blue-600" />
        <h2 className="text-2xl font-bold text-slate-900">Account-Based Lead Management</h2>
        <InfoModal
          title="Multi-Lead Account Threading"
          description="Groups leads by domain/organization to create comprehensive account-level views with decision-maker mapping and buying committee analysis."
          features={[
            "Automatic lead grouping by domain and organization",
            "Decision-maker hierarchy mapping and influence scoring",
            "Buying committee identification with role assignments",
            "Account-level opportunity sizing and timeline estimation",
            "Multi-threaded sales strategy recommendations"
          ]}
          businessValue="Account-based approach increases deal size by 45% and win rates by 32% through comprehensive stakeholder mapping and coordinated sales efforts."
        />
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <Building className="h-5 w-5 text-blue-600" />
            <span className="font-medium text-slate-900">Target Accounts</span>
          </div>
          <div className="text-2xl font-bold text-slate-900">{accountRollups.account_rollups.length}</div>
          <div className="text-sm text-slate-600">organizations mapped</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <Users className="h-5 w-5 text-emerald-600" />
            <span className="font-medium text-slate-900">Total Contacts</span>
          </div>
          <div className="text-2xl font-bold text-slate-900">{totalContacts}</div>
          <div className="text-sm text-slate-600">{avgContactsPerAccount} avg per account</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <DollarSign className="h-5 w-5 text-purple-600" />
            <span className="font-medium text-slate-900">Pipeline Value</span>
          </div>
          <div className="text-2xl font-bold text-slate-900">{totalPipelineValue}</div>
          <div className="text-sm text-slate-600">estimated total</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <Target className="h-5 w-5 text-orange-600" />
            <span className="font-medium text-slate-900">Decision Maker Coverage</span>
          </div>
          <div className="text-2xl font-bold text-slate-900">{Math.round(accountRollups.rollup_analytics.decision_maker_coverage * 100)}%</div>
          <div className="text-sm text-slate-600">across accounts</div>
        </div>
      </div>

      {/* Account Cards */}
      <div className="grid gap-6">
        {accountRollups.account_rollups.map((account) => (
          <div
            key={account.account_id}
            onClick={() => setSelectedAccount(account)}
            className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-lg hover:border-blue-300 transition-all cursor-pointer group"
          >
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Building className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 text-xl group-hover:text-blue-600 transition-colors">
                    {account.account_name}
                  </h3>
                  <p className="text-slate-600 mt-1">{account.domain}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-purple-600" />
                      <span className="font-medium text-purple-600">{account.org_score}% Account Score</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-slate-400" />
                      <span className="text-slate-700">{account.total_contacts} contacts</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-sm text-slate-600 mb-1">Est. Deal Size</div>
                <div className="font-medium text-slate-900">{account.account_insights.estimated_deal_size}</div>
                <div className="text-xs text-slate-500 mt-1">{account.account_insights.sales_cycle_estimate}</div>
              </div>
            </div>

            {/* Account Insights */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-3 bg-slate-50 rounded-lg">
                <div className="font-bold text-slate-900">{account.account_insights.total_employees.toLocaleString()}</div>
                <div className="text-xs text-slate-600">Employees</div>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="font-bold text-blue-600">{Math.round(account.account_insights.decision_maker_coverage * 100)}%</div>
                <div className="text-xs text-blue-700">DM Coverage</div>
              </div>
              <div className="text-center p-3 bg-emerald-50 rounded-lg">
                <div className="font-bold text-emerald-600">
                  {account.account_insights.buying_committee_identified ? 'Yes' : 'No'}
                </div>
                <div className="text-xs text-emerald-700">Committee ID'd</div>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <div className="font-bold text-purple-600">
                  {account.account_insights.influence_network_mapped ? 'Yes' : 'No'}
                </div>
                <div className="text-xs text-purple-700">Network Mapped</div>
              </div>
            </div>

            {/* Contact Preview */}
            <div className="mb-6">
              <h5 className="font-medium text-slate-900 mb-3">Key Contacts</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {account.contacts.map((contact: any, i: number) => (
                  <div key={i} className="p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="font-medium text-slate-900 text-sm">{contact.name}</div>
                        <div className="text-xs text-slate-600">{contact.title}</div>
                      </div>
                      <div className="flex items-center gap-1">
                        {getDecisionPowerIcon(contact.decision_power)}
                        <span className={`px-2 py-0.5 text-xs rounded-full ${getLevelColor(contact.level)}`}>
                          {contact.level}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-slate-500">
                        Influence: {Math.round(contact.influence_score * 100)}%
                      </div>
                      <div className="flex items-center gap-1">
                        <Mail className="h-3 w-3 text-slate-400" />
                        <Linkedin className="h-3 w-3 text-slate-400" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Buying Committee Preview */}
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4">
              <h5 className="font-medium text-slate-900 mb-2">Buying Committee</h5>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-slate-600">Economic Buyer:</span>
                  <div className="font-medium text-slate-900">{account.buying_committee.economic_buyer}</div>
                </div>
                <div>
                  <span className="text-slate-600">Technical Buyer:</span>
                  <div className="font-medium text-slate-900">{account.buying_committee.technical_buyer}</div>
                </div>
                <div>
                  <span className="text-slate-600">Champion:</span>
                  <div className="font-medium text-emerald-700">{account.buying_committee.champion_potential}</div>
                </div>
                <div>
                  <span className="text-slate-600">Budget Authority:</span>
                  <div className="font-medium text-slate-900">{account.buying_committee.budget_authority}</div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
              <div className="text-xs text-slate-500">
                Strategy: {account.recommended_strategy.messaging_approach}
              </div>
              <div className="text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-sm">View full account →</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Account Detail Modal */}
      {selectedAccount && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-5xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-blue-50 to-purple-50">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">{selectedAccount.account_name}</h2>
                  <p className="text-slate-600 mt-1">{selectedAccount.domain}</p>
                  <div className="flex items-center gap-4 mt-3">
                    <div className="flex items-center gap-2">
                      <Award className="h-5 w-5 text-purple-600" />
                      <span className="text-2xl font-bold text-purple-600">{selectedAccount.org_score}%</span>
                      <span className="text-sm text-slate-600">Account Score</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedAccount(null)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="space-y-6">
                {/* Account Insights */}
                <div>
                  <h3 className="font-semibold text-slate-900 mb-4">Account Intelligence</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 bg-slate-50 rounded-lg text-center">
                      <div className="text-2xl font-bold text-slate-900">{selectedAccount.account_insights.total_employees.toLocaleString()}</div>
                      <div className="text-sm text-slate-600">Total Employees</div>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-lg text-center">
                      <div className="text-2xl font-bold text-blue-600">{Math.round(selectedAccount.account_insights.decision_maker_coverage * 100)}%</div>
                      <div className="text-sm text-blue-700">DM Coverage</div>
                    </div>
                    <div className="p-4 bg-emerald-50 rounded-lg text-center">
                      <div className="text-xl font-bold text-emerald-600">{selectedAccount.account_insights.estimated_deal_size}</div>
                      <div className="text-sm text-emerald-700">Deal Size</div>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-lg text-center">
                      <div className="text-xl font-bold text-purple-600">{selectedAccount.account_insights.sales_cycle_estimate}</div>
                      <div className="text-sm text-purple-700">Sales Cycle</div>
                    </div>
                  </div>
                </div>

                {/* Contacts */}
                <div>
                  <h3 className="font-semibold text-slate-900 mb-4">Contact Directory</h3>
                  <div className="space-y-3">
                    {selectedAccount.contacts.map((contact: any, i: number) => (
                      <div
                        key={i}
                        onClick={() => setSelectedContact(contact)}
                        className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                              <Users className="h-6 w-6 text-white" />
                            </div>
                            <div>
                              <div className="font-medium text-slate-900">{contact.name}</div>
                              <div className="text-sm text-slate-600">{contact.title}</div>
                              <div className="text-xs text-slate-500 mt-1">{contact.background}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-2 mb-2">
                              {getDecisionPowerIcon(contact.decision_power)}
                              <span className={`px-2 py-1 text-xs rounded-full ${getLevelColor(contact.level)}`}>
                                {contact.level}
                              </span>
                            </div>
                            <div className={`text-sm font-medium ${getInfluenceColor(contact.influence_score)}`}>
                              {Math.round(contact.influence_score * 100)}% influence
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
                          <div className="flex items-center gap-3">
                            <a href={`mailto:${contact.email}`} className="text-slate-400 hover:text-blue-600">
                              <Mail className="h-4 w-4" />
                            </a>
                            <a href={contact.linkedin} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-blue-600">
                              <Linkedin className="h-4 w-4" />
                            </a>
                          </div>
                          <div className={`px-2 py-1 text-xs rounded-full ${
                            contact.contact_status === 'contacted' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-800'
                          }`}>
                            {contact.contact_status.replace('_', ' ')}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Buying Committee */}
                <div>
                  <h3 className="font-semibold text-slate-900 mb-4">Buying Committee Analysis</h3>
                  <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm text-slate-600">Economic Buyer:</span>
                        <div className="font-medium text-slate-900">{selectedAccount.buying_committee.economic_buyer}</div>
                      </div>
                      <div>
                        <span className="text-sm text-slate-600">Technical Buyer:</span>
                        <div className="font-medium text-slate-900">{selectedAccount.buying_committee.technical_buyer}</div>
                      </div>
                      <div>
                        <span className="text-sm text-slate-600">User Buyer:</span>
                        <div className="font-medium text-slate-900">{selectedAccount.buying_committee.user_buyer}</div>
                      </div>
                      <div>
                        <span className="text-sm text-slate-600">Champion Potential:</span>
                        <div className="font-medium text-emerald-700">{selectedAccount.buying_committee.champion_potential}</div>
                      </div>
                      <div>
                        <span className="text-sm text-slate-600">Budget Authority:</span>
                        <div className="font-medium text-slate-900">{selectedAccount.buying_committee.budget_authority}</div>
                      </div>
                      <div>
                        <span className="text-sm text-slate-600">Blockers:</span>
                        <div className="font-medium text-slate-900">{selectedAccount.buying_committee.blockers_identified}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sales Strategy */}
                <div>
                  <h3 className="font-semibold text-slate-900 mb-4">Recommended Sales Strategy</h3>
                  <div className="space-y-3">
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <span className="text-sm font-medium text-blue-900">Primary Contact:</span>
                      <div className="text-blue-800">{selectedAccount.recommended_strategy.primary_contact}</div>
                    </div>
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                      <span className="text-sm font-medium text-emerald-900">Messaging Approach:</span>
                      <div className="text-emerald-800">{selectedAccount.recommended_strategy.messaging_approach}</div>
                    </div>
                    <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                      <span className="text-sm font-medium text-purple-900">Meeting Format:</span>
                      <div className="text-purple-800">{selectedAccount.recommended_strategy.meeting_format}</div>
                    </div>
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                      <span className="text-sm font-medium text-amber-900">Timeline:</span>
                      <div className="text-amber-800">{selectedAccount.recommended_strategy.timeline}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contact Detail Modal */}
      {selectedContact && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[70vh] overflow-hidden">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">{selectedContact.name}</h2>
                  <p className="text-slate-600">{selectedContact.title}</p>
                </div>
                <button
                  onClick={() => setSelectedContact(null)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <span className="text-sm text-slate-600">Background:</span>
                  <p className="text-slate-700 mt-1">{selectedContact.background}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-600">Decision Power:</span>
                    <div className="font-medium text-slate-900 capitalize">{selectedContact.decision_power.replace('_', ' ')}</div>
                  </div>
                  <div>
                    <span className="text-slate-600">Influence Score:</span>
                    <div className={`font-medium ${getInfluenceColor(selectedContact.influence_score)}`}>
                      {Math.round(selectedContact.influence_score * 100)}%
                    </div>
                  </div>
                </div>

                <div>
                  <span className="text-sm text-slate-600">Recent Activity:</span>
                  <ul className="mt-1 space-y-1">
                    {selectedContact.recent_activity.map((activity: string, i: number) => (
                      <li key={i} className="text-sm text-slate-700 flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                        {activity}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex gap-3 pt-4">
                  <a
                    href={`mailto:${selectedContact.email}`}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-center"
                  >
                    Send Email
                  </a>
                  <a
                    href={selectedContact.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors text-center"
                  >
                    View LinkedIn
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}