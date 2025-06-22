import React from 'react';
import { X, ExternalLink, Building, Users, TrendingUp, Mail, Phone, Linkedin, Globe, Github, Calendar, MapPin, DollarSign, Target, Zap, Search, Database, MessageSquare } from 'lucide-react';
import { formatScore, getScoreColor } from '../lib/utils';

interface LeadProfileData {
  company: string;
  domain: string;
  description: string;
  similarity_score?: number;
  founded?: string;
  funding?: string;
  
  // Exa data
  exa_data?: {
    source_url: string;
    discovery_method: string;
    confidence: number;
  };
  
  // Phind signals
  hiring_signals?: string[];
  tech_stack?: string[];
  growth_indicators?: string[];
  headcount_growth?: string;
  recent_funding?: string;
  
  // Perplexity contacts
  contacts?: Array<{
    name: string;
    title: string;
    email: string;
    linkedin: string;
    background: string;
  }>;
  
  // SERP data
  serp_data?: {
    top_urls: string[];
    news_mentions: string[];
    social_signals: {
      linkedin_followers?: string;
      twitter_followers?: string;
      glassdoor_rating?: string;
    };
  };
  
  // Lead scoring
  overall_score?: number;
  scoring_breakdown?: Record<string, number>;
  priority?: string;
  recommended_action?: string;
}

interface LeadProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  leadData: LeadProfileData;
}

export function LeadProfileModal({ isOpen, onClose, leadData }: LeadProfileModalProps) {
  if (!isOpen) return null;

  const getSourceIcon = (source: string) => {
    if (source.includes('linkedin')) return <Linkedin className="h-3 w-3" />;
    if (source.includes('github')) return <Github className="h-3 w-3" />;
    if (source.includes('techcrunch') || source.includes('venturebeat')) return <MessageSquare className="h-3 w-3" />;
    if (source.includes('company') || source.includes('about')) return <Building className="h-3 w-3" />;
    return <Globe className="h-3 w-3" />;
  };

  const getSourceLabel = (url: string) => {
    try {
      const domain = new URL(url).hostname.replace('www.', '');
      return domain.charAt(0).toUpperCase() + domain.slice(1);
    } catch {
      return 'Website';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Building className="h-8 w-8 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl font-bold text-slate-900">{leadData.company}</h2>
                  {leadData.overall_score && (
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      leadData.overall_score >= 0.8 ? 'bg-emerald-100 text-emerald-800' :
                      leadData.overall_score >= 0.6 ? 'bg-blue-100 text-blue-800' :
                      'bg-amber-100 text-amber-800'
                    }`}>
                      {formatScore(leadData.overall_score)} Match
                    </span>
                  )}
                  {leadData.priority && (
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      leadData.priority === 'High' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {leadData.priority} Priority
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-4 text-sm text-slate-600 mb-2">
                  <a 
                    href={`https://${leadData.domain}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-blue-600 hover:text-blue-700"
                  >
                    <Globe className="h-4 w-4" />
                    {leadData.domain}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                  {leadData.founded && (
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Founded {leadData.founded}
                    </div>
                  )}
                  {leadData.funding && (
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      {leadData.funding}
                    </div>
                  )}
                </div>
                <p className="text-slate-700 max-w-2xl">{leadData.description}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="xl:col-span-2 space-y-6">
              {/* AI Discovery Data */}
              <div className="bg-white border border-slate-200 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <img src="/images/Exa-logo-square.jpeg" alt="Exa" className="w-6 h-6 rounded" />
                  <h3 className="font-semibold text-slate-900">AI Discovery</h3>
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">Exa AI</span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <span className="text-sm text-slate-600">Discovery Method</span>
                    <div className="font-medium text-slate-900">Semantic Search</div>
                  </div>
                  <div>
                    <span className="text-sm text-slate-600">Confidence</span>
                    <div className={`font-medium ${getScoreColor(leadData.similarity_score || 0.8)}`}>
                      {formatScore(leadData.similarity_score || 0.8)}
                    </div>
                  </div>
                </div>

                {leadData.exa_data?.source_url && (
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Database className="h-4 w-4" />
                    <span>Source:</span>
                    <a 
                      href={leadData.exa_data.source_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 flex items-center gap-1"
                    >
                      {getSourceLabel(leadData.exa_data.source_url)}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                )}
              </div>

              {/* Technical Signals */}
              {(leadData.hiring_signals || leadData.tech_stack || leadData.growth_indicators) && (
                <div className="bg-white border border-slate-200 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <img src="/images/Phind-logo-square.png" alt="Phind" className="w-6 h-6 rounded" />
                    <h3 className="font-semibold text-slate-900">Technical Signals</h3>
                    <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">Phind Analysis</span>
                  </div>

                  <div className="space-y-4">
                    {leadData.hiring_signals && (
                      <div>
                        <h4 className="font-medium text-slate-900 mb-2 flex items-center gap-2">
                          <Users className="h-4 w-4 text-emerald-600" />
                          Hiring Signals
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {leadData.hiring_signals.map((signal, i) => (
                            <span key={i} className="px-2 py-1 bg-emerald-50 text-emerald-700 text-sm rounded border border-emerald-200">
                              {signal}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center gap-1 mt-2 text-xs text-slate-500">
                          <Search className="h-3 w-3" />
                          <span>Sources: Job boards, career pages, LinkedIn</span>
                        </div>
                      </div>
                    )}

                    {leadData.tech_stack && (
                      <div>
                        <h4 className="font-medium text-slate-900 mb-2 flex items-center gap-2">
                          <Zap className="h-4 w-4 text-blue-600" />
                          Technology Stack
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {leadData.tech_stack.map((tech, i) => (
                            <span key={i} className="px-2 py-1 bg-blue-50 text-blue-700 text-sm rounded border border-blue-200">
                              {tech}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center gap-1 mt-2 text-xs text-slate-500">
                          <Github className="h-3 w-3" />
                          <span>Sources: GitHub, tech blogs, job requirements</span>
                        </div>
                      </div>
                    )}

                    {leadData.growth_indicators && (
                      <div>
                        <h4 className="font-medium text-slate-900 mb-2 flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-purple-600" />
                          Growth Indicators
                        </h4>
                        <ul className="space-y-1">
                          {leadData.growth_indicators.map((indicator, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                              <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
                              {indicator}
                            </li>
                          ))}
                        </ul>
                        <div className="flex items-center gap-1 mt-2 text-xs text-slate-500">
                          <MessageSquare className="h-3 w-3" />
                          <span>Sources: Company blog, press releases, social media</span>
                        </div>
                      </div>
                    )}

                    {leadData.headcount_growth && (
                      <div className="p-3 bg-gradient-to-r from-emerald-50 to-blue-50 border border-emerald-200 rounded-lg">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-emerald-600" />
                          <span className="font-medium text-emerald-900">Team Growth: {leadData.headcount_growth}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Web Presence Analysis */}
              {leadData.serp_data && (
                <div className="bg-white border border-slate-200 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Search className="h-5 w-5 text-orange-600" />
                    <h3 className="font-semibold text-slate-900">Web Presence Analysis</h3>
                    <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">SERP Data</span>
                  </div>

                  <div className="space-y-4">
                    {leadData.serp_data.top_urls && (
                      <div>
                        <h4 className="font-medium text-slate-900 mb-2">Top Web Properties</h4>
                        <div className="space-y-2">
                          {leadData.serp_data.top_urls.slice(0, 4).map((url, i) => (
                            <a
                              key={i}
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 p-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-sm"
                            >
                              {getSourceIcon(url)}
                              <span className="flex-1 text-slate-700 truncate">{getSourceLabel(url)}</span>
                              <ExternalLink className="h-3 w-3 text-slate-400" />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    {leadData.serp_data.news_mentions && (
                      <div>
                        <h4 className="font-medium text-slate-900 mb-2">Recent News Mentions</h4>
                        <ul className="space-y-1">
                          {leadData.serp_data.news_mentions.slice(0, 3).map((mention, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                              <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                              {mention}
                            </li>
                          ))}
                        </ul>
                        <div className="flex items-center gap-1 mt-2 text-xs text-slate-500">
                          <MessageSquare className="h-3 w-3" />
                          <span>Sources: TechCrunch, VentureBeat, industry publications</span>
                        </div>
                      </div>
                    )}

                    {leadData.serp_data.social_signals && (
                      <div>
                        <h4 className="font-medium text-slate-900 mb-2">Social Signals</h4>
                        <div className="grid grid-cols-3 gap-3 text-sm">
                          {leadData.serp_data.social_signals.linkedin_followers && (
                            <div className="text-center p-2 bg-blue-50 rounded">
                              <Linkedin className="h-4 w-4 text-blue-600 mx-auto mb-1" />
                              <div className="font-medium text-slate-900">{leadData.serp_data.social_signals.linkedin_followers}</div>
                              <div className="text-xs text-slate-600">LinkedIn</div>
                            </div>
                          )}
                          {leadData.serp_data.social_signals.twitter_followers && (
                            <div className="text-center p-2 bg-slate-50 rounded">
                              <MessageSquare className="h-4 w-4 text-slate-600 mx-auto mb-1" />
                              <div className="font-medium text-slate-900">{leadData.serp_data.social_signals.twitter_followers}</div>
                              <div className="text-xs text-slate-600">Twitter</div>
                            </div>
                          )}
                          {leadData.serp_data.social_signals.glassdoor_rating && (
                            <div className="text-center p-2 bg-emerald-50 rounded">
                              <Target className="h-4 w-4 text-emerald-600 mx-auto mb-1" />
                              <div className="font-medium text-slate-900">{leadData.serp_data.social_signals.glassdoor_rating}</div>
                              <div className="text-xs text-slate-600">Glassdoor</div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Lead Scoring */}
              {leadData.overall_score && (
                <div className="bg-white border border-slate-200 rounded-xl p-6">
                  <h3 className="font-semibold text-slate-900 mb-4">Lead Scoring</h3>
                  
                  <div className="text-center mb-4">
                    <div className={`text-3xl font-bold ${getScoreColor(leadData.overall_score)}`}>
                      {formatScore(leadData.overall_score)}
                    </div>
                    <div className="text-sm text-slate-600">Overall Score</div>
                  </div>

                  {leadData.scoring_breakdown && (
                    <div className="space-y-3">
                      {Object.entries(leadData.scoring_breakdown).map(([factor, score]) => (
                        <div key={factor} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-600 capitalize">{factor.replace('_', ' ')}</span>
                            <span className={`font-medium ${getScoreColor(score)}`}>
                              {formatScore(score)}
                            </span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-blue-500 to-emerald-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${score * 100}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {leadData.recommended_action && (
                    <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <Target className="h-4 w-4 text-blue-600" />
                        <span className="font-medium text-blue-900 text-sm">Recommended Action</span>
                      </div>
                      <p className="text-sm text-blue-800">{leadData.recommended_action}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Key Contacts */}
              {leadData.contacts && leadData.contacts.length > 0 && (
                <div className="bg-white border border-slate-200 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <img src="/images/Perplexity-logo-square.jpeg" alt="Perplexity" className="w-6 h-6 rounded" />
                    <h3 className="font-semibold text-slate-900">Key Contacts</h3>
                    <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">Perplexity AI</span>
                  </div>
                  
                  <div className="space-y-4">
                    {leadData.contacts.map((contact, i) => (
                      <div key={i} className="p-4 border border-slate-200 rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-medium text-slate-900">{contact.name}</h4>
                            <p className="text-sm text-slate-600">{contact.title}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <a
                              href={`mailto:${contact.email}`}
                              className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                            >
                              <Mail className="h-4 w-4" />
                            </a>
                            <a
                              href={contact.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                            >
                              <Linkedin className="h-4 w-4" />
                            </a>
                          </div>
                        </div>
                        <p className="text-xs text-slate-500">{contact.background}</p>
                        
                        <div className="flex items-center gap-1 mt-2 text-xs text-slate-500">
                          <Search className="h-3 w-3" />
                          <span>Sources: LinkedIn, company website, professional networks</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Panel */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6">
                <h3 className="font-semibold text-slate-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Generate Email
                  </button>
                  <button className="w-full px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
                    Add to CRM
                  </button>
                  <button className="w-full px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors">
                    Schedule Follow-up
                  </button>
                  <button className="w-full px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors">
                    Export Data
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}