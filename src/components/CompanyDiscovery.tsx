import React, { useState, useEffect } from 'react';
import { Search, Building, ExternalLink, Sparkles, TrendingUp, Zap, Settings, Target, Folder, Play, Loader } from 'lucide-react';
import { InfoModal } from './InfoModal';
import { LeadProfileModal } from './LeadProfileModal';
import { formatScore, getScoreBadgeColor } from '../lib/utils';
import { Switch } from './ui/switch';
import exaResults from '../data/exa_results.json';
import phindSignals from '../data/phind_signals.json';
import perplexityContacts from '../data/perplexity_contacts.json';
import serpResults from '../data/serp_results.json';

interface SavedICP {
  id: string;
  name: string;
  description: string;
  tags: string[];
  criteria: any;
  chat_description?: string;
  created_at: string;
  last_modified: string;
}

interface CompanyDiscoveryProps {
  onNavigateToTab?: (tabId: string) => void;
}

export function CompanyDiscovery({ onNavigateToTab }: CompanyDiscoveryProps) {
  const [isSearching, setIsSearching] = useState(false);
  const [searchComplete, setSearchComplete] = useState(false);
  const [companies, setCompanies] = useState<any[]>([]);
  const [demoMode, setDemoMode] = useState(true);
  const [currentStep, setCurrentStep] = useState('');
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [selectedICP, setSelectedICP] = useState<SavedICP | null>(null);
  const [savedICPs, setSavedICPs] = useState<SavedICP[]>([]);
  const [showICPSelector, setShowICPSelector] = useState(false);
  const [apiKeys, setApiKeys] = useState({
    exa: '',
    phind: '',
    perplexity: ''
  });

  // Load saved ICPs on component mount
  useEffect(() => {
    const saved = localStorage.getItem('savedICPs');
    if (saved) {
      try {
        setSavedICPs(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading saved ICPs:', error);
      }
    }

    // Check for current ICP from ICP Builder
    const currentICP = localStorage.getItem('currentICPForDiscovery');
    if (currentICP) {
      try {
        const icpData = JSON.parse(currentICP);
        setSelectedICP(icpData);
        // Auto-start discovery if coming from ICP Builder
        setTimeout(() => {
          startDiscoveryWithICP(icpData);
        }, 500);
        localStorage.removeItem('currentICPForDiscovery');
      } catch (error) {
        console.error('Error loading current ICP:', error);
      }
    }
  }, []);

  const agentSteps = [
    { 
      name: 'Exa AI', 
      description: 'Semantic company search across the web',
      logo: '/images/Exa-logo.png',
      status: 'pending'
    },
    { 
      name: 'Phind', 
      description: 'Technical hiring signals and growth indicators',
      logo: '/images/Phind-logo.png',
      status: 'pending'
    },
    { 
      name: 'Perplexity', 
      description: 'Contact enrichment and company intelligence',
      logo: '/images/Perplexity-logo.png',
      status: 'pending'
    }
  ];

  const [agentStatuses, setAgentStatuses] = useState(agentSteps);

  const startDiscovery = () => {
    if (!selectedICP) {
      setShowICPSelector(true);
      return;
    }
    startDiscoveryWithICP(selectedICP);
  };

  const startDiscoveryWithICP = async (icp: SavedICP) => {
    setIsSearching(true);
    setSearchComplete(false);
    setCompanies([]);
    
    // Reset agent statuses
    setAgentStatuses(agentSteps.map(agent => ({...agent, status: 'pending'})));

    if (demoMode) {
      // Demo mode - simulate agent workflow
      await simulateAgentWorkflow();
    } else {
      // Production mode - call real APIs
      await runProductionWorkflow();
    }
  };

  const simulateAgentWorkflow = async () => {
    // Step 1: Exa AI
    setCurrentStep('Exa AI: Semantic company discovery...');
    setAgentStatuses(prev => prev.map(agent => 
      agent.name === 'Exa AI' ? {...agent, status: 'running'} : agent
    ));
    await new Promise(resolve => setTimeout(resolve, 2000));
    setAgentStatuses(prev => prev.map(agent => 
      agent.name === 'Exa AI' ? {...agent, status: 'complete'} : agent
    ));

    // Step 2: Phind
    setCurrentStep('Phind: Analyzing technical signals...');
    setAgentStatuses(prev => prev.map(agent => 
      agent.name === 'Phind' ? {...agent, status: 'running'} : agent
    ));
    await new Promise(resolve => setTimeout(resolve, 1500));
    setAgentStatuses(prev => prev.map(agent => 
      agent.name === 'Phind' ? {...agent, status: 'complete'} : agent
    ));

    // Step 3: Perplexity
    setCurrentStep('Perplexity: Enriching contact data...');
    setAgentStatuses(prev => prev.map(agent => 
      agent.name === 'Perplexity' ? {...agent, status: 'running'} : agent
    ));
    await new Promise(resolve => setTimeout(resolve, 1800));
    setAgentStatuses(prev => prev.map(agent => 
      agent.name === 'Perplexity' ? {...agent, status: 'complete'} : agent
    ));

    // Combine demo data with full enrichment
    const enrichedCompanies = exaResults.results.map(company => {
      const signals = phindSignals.signals.find(s => s.company === company.company_name);
      const contacts = perplexityContacts.contacts.find(c => c.company === company.company_name);
      const serpData = serpResults.serp_data.find(s => s.company === company.company_name);
      
      return { 
        ...company, 
        ...signals,
        contacts: contacts?.contacts || [],
        serp_data: serpData,
        exa_data: {
          source_url: `https://${company.domain}/about`,
          discovery_method: 'semantic_search',
          confidence: company.similarity_score
        }
      };
    });
    
    setCompanies(enrichedCompanies);
    setIsSearching(false);
    setSearchComplete(true);
    setCurrentStep('');
  };

  const runProductionWorkflow = async () => {
    try {
      // Step 1: Call Exa API
      setCurrentStep('Exa AI: Semantic company discovery...');
      setAgentStatuses(prev => prev.map(agent => 
        agent.name === 'Exa AI' ? {...agent, status: 'running'} : agent
      ));
      
      if (!apiKeys.exa) {
        throw new Error('Exa API key not configured');
      }
      
      // Simulate API call - in production, this would be:
      // const exaResults = await callExaAPI(icpCriteria, apiKeys.exa);
      await new Promise(resolve => setTimeout(resolve, 2000));
      setAgentStatuses(prev => prev.map(agent => 
        agent.name === 'Exa AI' ? {...agent, status: 'complete'} : agent
      ));

      // Continue with other agents...
      // For now, fall back to demo data
      await simulateAgentWorkflow();
    } catch (error) {
      console.error('Production workflow error:', error);
      setCurrentStep('Error: Falling back to demo mode');
      await simulateAgentWorkflow();
    }
  };

  const openLeadProfile = (company: any) => {
    setSelectedLead(company);
  };

  const selectICP = (icp: SavedICP) => {
    setSelectedICP(icp);
    setShowICPSelector(false);
    
    // Show notification
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded z-50';
    notification.innerHTML = `
      <div class="flex items-center gap-2">
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
        </svg>
        <span>ICP selected: ${icp.name}</span>
      </div>
    `;
    document.body.appendChild(notification);
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 3000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running':
        return <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>;
      case 'complete':
        return <div className="w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center">
          <span className="text-white text-xs">✓</span>
        </div>;
      default:
        return <div className="w-4 h-4 bg-slate-300 rounded-full"></div>;
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Search className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-slate-900">AI Company Discovery</h2>
          <InfoModal
            title="AI Company Discovery"
            description="Multi-agent system that discovers companies matching your ICP using semantic search, technical signals, and contact enrichment."
            features={[
              "Exa AI for semantic company search beyond keyword matching",
              "Phind agent for technical hiring signals and growth indicators", 
              "Perplexity for contact enrichment and company intelligence",
              "Real-time API integration with fallback to demo mode",
              "Seamless ICP integration from builder"
            ]}
            businessValue="AI discovery finds 40% more qualified prospects than traditional search, including emerging companies that competitors miss."
          />
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-slate-700">Demo</span>
            <Switch
              checked={demoMode}
              onCheckedChange={setDemoMode}
            />
            <span className="text-sm font-medium text-slate-700">Live APIs</span>
          </div>
          
          <button
            onClick={startDiscovery}
            disabled={isSearching}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Sparkles className="h-4 w-4" />
            {isSearching ? 'Discovering Companies...' : 'Start Discovery'}
          </button>
        </div>
      </div>

      {/* ICP Selection */}
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Target className="h-5 w-5 text-purple-600" />
            <h3 className="font-semibold text-slate-900">Target ICP</h3>
          </div>
          
          <button
            onClick={() => setShowICPSelector(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg transition-colors"
          >
            <Folder className="h-4 w-4" />
            Select ICP
          </button>
        </div>

        {selectedICP ? (
          <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-semibold text-slate-900 mb-1">{selectedICP.name}</h4>
                {selectedICP.description && (
                  <p className="text-sm text-slate-600 mb-3">{selectedICP.description}</p>
                )}
                {selectedICP.chat_description && (
                  <div className="mb-3">
                    <span className="text-xs font-medium text-slate-500 block mb-1">Description:</span>
                    <p className="text-sm text-slate-700 italic">"{selectedICP.chat_description}"</p>
                  </div>
                )}
                <div className="flex flex-wrap gap-2">
                  {selectedICP.tags.map((tag) => (
                    <span key={tag} className="px-2 py-0.5 bg-white border border-purple-200 text-purple-700 text-xs rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-slate-600">Criteria</div>
                <div className="font-bold text-purple-600">
                  {Object.values(selectedICP.criteria).flat().length}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <Target className="h-12 w-12 text-slate-300 mx-auto mb-3" />
            <h4 className="font-medium text-slate-900 mb-2">No ICP Selected</h4>
            <p className="text-slate-600 text-sm mb-4">
              Choose a saved ICP definition to start discovering companies that match your ideal customer profile.
            </p>
            <button
              onClick={() => setShowICPSelector(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Folder className="h-4 w-4" />
              Select ICP
            </button>
          </div>
        )}
      </div>

      {!demoMode && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Settings className="h-4 w-4 text-amber-600" />
            <span className="font-medium text-amber-900">Live API Mode</span>
          </div>
          <p className="text-sm text-amber-800">
            Configure your API keys in the Admin Console to use live integrations. 
            Missing keys will fall back to demo mode.
          </p>
        </div>
      )}

      {/* ICP Selector Modal */}
      {showICPSelector && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Folder className="h-5 w-5 text-purple-600" />
                  <h3 className="text-xl font-bold text-slate-900">Select Target ICP</h3>
                </div>
                <button
                  onClick={() => setShowICPSelector(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <span className="text-slate-400 text-xl">×</span>
                </button>
              </div>
              <p className="text-slate-600 mt-2">Choose which Ideal Customer Profile to use for discovery</p>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {savedICPs.length === 0 ? (
                <div className="text-center py-12">
                  <Target className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                  <h4 className="font-medium text-slate-900 mb-2">No Saved ICPs</h4>
                  <p className="text-slate-600 mb-4">Create your first ICP definition in the ICP Builder tab.</p>
                  <button
                    onClick={() => {
                      setShowICPSelector(false);
                      if (onNavigateToTab) {
                        onNavigateToTab('icp-builder');
                      }
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Target className="h-4 w-4" />
                    Go to ICP Builder
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {savedICPs.map((icp) => (
                    <div
                      key={icp.id}
                      onClick={() => selectICP(icp)}
                      className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                        selectedICP?.id === icp.id
                          ? 'border-purple-300 bg-purple-50'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="font-semibold text-slate-900">{icp.name}</h4>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            selectICP(icp);
                            startDiscoveryWithICP(icp);
                          }}
                          className="p-1 text-slate-400 hover:text-blue-600 transition-colors"
                          title="Select and start discovery"
                        >
                          <Play className="h-4 w-4" />
                        </button>
                      </div>

                      {icp.description && (
                        <p className="text-sm text-slate-600 mb-3">{icp.description}</p>
                      )}

                      {icp.chat_description && (
                        <div className="mb-3">
                          <span className="text-xs font-medium text-slate-500 block mb-1">Target:</span>
                          <p className="text-xs text-slate-600 italic line-clamp-2">"{icp.chat_description}"</p>
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-1">
                          {icp.tags.slice(0, 3).map((tag) => (
                            <span key={tag} className="px-2 py-0.5 bg-slate-100 text-slate-700 text-xs rounded">
                              {tag}
                            </span>
                          ))}
                          {icp.tags.length > 3 && (
                            <span className="text-xs text-slate-500">+{icp.tags.length - 3}</span>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-slate-900">
                            {Object.values(icp.criteria).flat().length}
                          </div>
                          <div className="text-xs text-slate-500">criteria</div>
                        </div>
                      </div>

                      {selectedICP?.id === icp.id && (
                        <div className="mt-2 px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">
                          Currently selected
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {isSearching && (
        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <Zap className="h-6 w-6 text-blue-600" />
            <h3 className="font-semibold text-slate-900">AI Agents Working</h3>
            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
              {demoMode ? 'Demo Mode' : 'Live API Mode'}
            </span>
          </div>
          
          <div className="space-y-4">
            {agentStatuses.map((agent, index) => (
              <div key={index} className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg">
                <img 
                  src={agent.logo} 
                  alt={agent.name}
                  className="w-8 h-8 object-contain"
                />
                <div className="flex-1">
                  <div className="font-medium text-slate-900">{agent.name}</div>
                  <div className="text-sm text-slate-600">{agent.description}</div>
                </div>
                {getStatusIcon(agent.status)}
              </div>
            ))}
          </div>
          
          {currentStep && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="text-sm text-blue-800 font-medium">{currentStep}</div>
            </div>
          )}
        </div>
      )}

      {searchComplete && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900">
              Discovered Companies ({companies.length})
            </h3>
            <div className="text-sm text-slate-600">
              Click any company to view detailed profile
            </div>
          </div>

          <div className="grid gap-6">
            {companies.map((company, index) => (
              <div 
                key={index} 
                onClick={() => openLeadProfile(company)}
                className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <Building className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 text-lg group-hover:text-blue-600 transition-colors">
                        {company.company_name}
                      </h4>
                      <a 
                        href={`https://${company.domain}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1"
                      >
                        {company.domain}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getScoreBadgeColor(company.similarity_score)}`}>
                      {formatScore(company.similarity_score)} Match
                    </span>
                    <div className="text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ExternalLink className="h-4 w-4" />
                    </div>
                  </div>
                </div>

                <p className="text-slate-700 mb-4">{company.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <h5 className="font-medium text-slate-900 flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-emerald-600" />
                      Growth Signals
                    </h5>
                    <ul className="text-sm text-slate-600 space-y-1">
                      {company.growth_indicators?.slice(0, 3).map((indicator: string, i: number) => (
                        <li key={i} className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2 flex-shrink-0" />
                          {indicator}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <h5 className="font-medium text-slate-900">Tech Stack</h5>
                    <div className="flex flex-wrap gap-1">
                      {company.tech_stack?.slice(0, 5).map((tech: string, i: number) => (
                        <span key={i} className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  {company.hiring_signals && (
                    <div className="bg-slate-50 rounded-lg p-3 flex-1 mr-4">
                      <h5 className="font-medium text-slate-900 text-sm mb-2">Recent Hiring</h5>
                      <div className="flex flex-wrap gap-2">
                        {company.hiring_signals.slice(0, 2).map((signal: string, i: number) => (
                          <span key={i} className="text-xs text-slate-600 bg-white px-2 py-1 rounded border">
                            {signal}
                          </span>
                        ))}
                        {company.hiring_signals.length > 2 && (
                          <span className="text-xs text-slate-500">
                            +{company.hiring_signals.length - 2} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                  
                  <div className="text-right">
                    <div className="text-xs text-slate-500 mb-1">Sources</div>
                    <div className="flex items-center gap-1">
                      <img src="/images/Exa-logo-square.jpeg" alt="Exa" className="w-4 h-4 rounded" />
                      <img src="/images/Phind-logo-square.png" alt="Phind" className="w-4 h-4 rounded" />
                      <img src="/images/Perplexity-logo-square.jpeg" alt="Perplexity" className="w-4 h-4 rounded" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lead Profile Modal */}
      {selectedLead && (
        <LeadProfileModal
          isOpen={!!selectedLead}
          onClose={() => setSelectedLead(null)}
          leadData={selectedLead}
          onNavigateToTab={onNavigateToTab}
        />
      )}
    </div>
  );
}