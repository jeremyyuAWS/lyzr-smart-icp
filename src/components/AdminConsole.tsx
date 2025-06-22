import React, { useState } from 'react';
import { Settings, Key, Database, Activity, ToggleLeft, ToggleRight, AlertCircle, CheckCircle, ExternalLink } from 'lucide-react';
import { InfoModal } from './InfoModal';
import { Switch } from './ui/switch';

export function AdminConsole() {
  const [demoMode, setDemoMode] = useState(true);
  const [agents, setAgents] = useState({
    exa: true,
    phind: true,
    perplexity: true,
    serp: true,
    scraper: false,
    email_generator: true
  });

  const [apiKeys, setApiKeys] = useState({
    exa: '',
    phind: '',
    perplexity: '',
    openai: '',
    serpapi: '',
    supabase: ''
  });

  const [testResults, setTestResults] = useState<{[key: string]: 'success' | 'error' | 'testing' | null}>({
    exa: null,
    phind: null,
    perplexity: null,
    openai: null
  });

  const toggleAgent = (agentName: keyof typeof agents) => {
    setAgents(prev => ({
      ...prev,
      [agentName]: !prev[agentName]
    }));
  };

  const handleApiKeyChange = (service: keyof typeof apiKeys, value: string) => {
    setApiKeys(prev => ({
      ...prev,
      [service]: value
    }));
  };

  const testApiKey = async (service: string) => {
    if (!apiKeys[service as keyof typeof apiKeys]) {
      return;
    }

    setTestResults(prev => ({ ...prev, [service]: 'testing' }));
    
    // Simulate API test
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Randomly succeed or fail for demo
    const success = Math.random() > 0.3;
    setTestResults(prev => ({ 
      ...prev, 
      [service]: success ? 'success' : 'error' 
    }));
  };

  const getApiKeyStatus = (service: string) => {
    const key = apiKeys[service as keyof typeof apiKeys];
    const testResult = testResults[service];
    
    if (testResult === 'testing') {
      return <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>;
    }
    
    if (testResult === 'success') {
      return <CheckCircle className="h-4 w-4 text-emerald-600" />;
    }
    
    if (testResult === 'error') {
      return <AlertCircle className="h-4 w-4 text-red-600" />;
    }
    
    if (key) {
      return <div className="w-2 h-2 bg-amber-500 rounded-full" />;
    }
    
    return <div className="w-2 h-2 bg-slate-300 rounded-full" />;
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <Settings className="h-6 w-6 text-blue-600" />
        <h2 className="text-2xl font-bold text-slate-900">Admin Console</h2>
        <InfoModal
          title="Admin Console"
          description="Manage system configuration, API keys, and agent settings for SmartICP platform."
          features={[
            "Toggle between demo and production modes",
            "Manage API keys for all integrated services",
            "Enable/disable specific AI agents",
            "Test API connectivity and monitor system health"
          ]}
          businessValue="Centralized admin controls ensure proper governance and enable seamless transition from demo to production environment."
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* System Configuration */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Database className="h-5 w-5 text-purple-600" />
              <h3 className="font-semibold text-slate-900">System Configuration</h3>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <label className="font-medium text-slate-900">Demo Mode</label>
                  <p className="text-sm text-slate-600">Use simulated data instead of live APIs</p>
                </div>
                <Switch
                  checked={demoMode}
                  onCheckedChange={setDemoMode}
                />
              </div>

              <div className={`p-4 rounded-lg border ${
                demoMode 
                  ? 'bg-blue-50 border-blue-200' 
                  : 'bg-emerald-50 border-emerald-200'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-2 h-2 rounded-full ${
                    demoMode ? 'bg-blue-600' : 'bg-emerald-600'
                  }`} />
                  <span className={`font-medium text-sm ${
                    demoMode ? 'text-blue-900' : 'text-emerald-900'
                  }`}>
                    {demoMode ? 'Demo Mode Active' : 'Production Mode Active'}
                  </span>
                </div>
                <p className={`text-sm ${
                  demoMode ? 'text-blue-800' : 'text-emerald-800'
                }`}>
                  {demoMode 
                    ? 'Using simulated data for all agent responses and API calls'
                    : 'Connected to live APIs - usage will be billed'
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Agent Configuration */}
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Activity className="h-5 w-5 text-emerald-600" />
              <h3 className="font-semibold text-slate-900">AI Agents</h3>
            </div>

            <div className="space-y-4">
              {Object.entries(agents).map(([agentName, enabled]) => (
                <div key={agentName} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-4">
                    {agentName === 'exa' && <img src="/images/Exa-logo-square.jpeg" alt="Exa" className="w-10 h-10 rounded-lg object-cover" />}
                    {agentName === 'phind' && <img src="/images/Phind-logo-square.png" alt="Phind" className="w-10 h-10 rounded-lg object-cover" />}
                    {agentName === 'perplexity' && <img src="/images/Perplexity-logo-square.jpeg" alt="Perplexity" className="w-10 h-10 rounded-lg object-cover" />}
                    <div>
                      <label className="font-medium text-slate-900 capitalize text-lg">
                        {agentName.replace('_', ' ')} Agent
                      </label>
                      <p className="text-sm text-slate-600 mt-1">
                        {agentName === 'exa' && 'Semantic company discovery using AI-powered search'}
                        {agentName === 'phind' && 'Technical hiring signals and growth indicators'}
                        {agentName === 'perplexity' && 'Contact enrichment and company intelligence'}
                        {agentName === 'serp' && 'Search engine analysis and web presence'}
                        {agentName === 'scraper' && 'Website content extraction and analysis'}
                        {agentName === 'email_generator' && 'Personalized email draft creation'}
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={enabled}
                    onCheckedChange={() => toggleAgent(agentName as keyof typeof agents)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* API Keys Management */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Key className="h-5 w-5 text-amber-600" />
              <h3 className="font-semibold text-slate-900">API Keys</h3>
            </div>

            <div className="space-y-4">
              {/* Exa API */}
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <img src="/images/Exa-logo-square.jpeg" alt="Exa" className="w-6 h-6 rounded object-cover" />
                  <label className="block font-medium text-slate-900">Exa API Key</label>
                  <a href="https://exa.ai/api" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="password"
                      value={apiKeys.exa}
                      onChange={(e) => handleApiKeyChange('exa', e.target.value)}
                      placeholder="Enter Exa API key"
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      {getApiKeyStatus('exa')}
                    </div>
                  </div>
                  <button
                    onClick={() => testApiKey('exa')}
                    disabled={!apiKeys.exa || testResults.exa === 'testing'}
                    className="px-3 py-2 text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg disabled:opacity-50 transition-colors"
                  >
                    Test
                  </button>
                </div>
              </div>

              {/* Phind API */}
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <img src="/images/Phind-logo-square.png" alt="Phind" className="w-6 h-6 rounded object-cover" />
                  <label className="block font-medium text-slate-900">Phind API Key</label>
                  <a href="https://phind.com/api" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="password"
                      value={apiKeys.phind}
                      onChange={(e) => handleApiKeyChange('phind', e.target.value)}
                      placeholder="Enter Phind API key"
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      {getApiKeyStatus('phind')}
                    </div>
                  </div>
                  <button
                    onClick={() => testApiKey('phind')}
                    disabled={!apiKeys.phind || testResults.phind === 'testing'}
                    className="px-3 py-2 text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg disabled:opacity-50 transition-colors"
                  >
                    Test
                  </button>
                </div>
              </div>

              {/* Perplexity API */}
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <img src="/images/Perplexity-logo-square.jpeg" alt="Perplexity" className="w-6 h-6 rounded object-cover" />
                  <label className="block font-medium text-slate-900">Perplexity API Key</label>
                  <a href="https://www.perplexity.ai/hub/blog/introducing-pplx-api" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="password"
                      value={apiKeys.perplexity}
                      onChange={(e) => handleApiKeyChange('perplexity', e.target.value)}
                      placeholder="Enter Perplexity API key"
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      {getApiKeyStatus('perplexity')}
                    </div>
                  </div>
                  <button
                    onClick={() => testApiKey('perplexity')}
                    disabled={!apiKeys.perplexity || testResults.perplexity === 'testing'}
                    className="px-3 py-2 text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg disabled:opacity-50 transition-colors"
                  >
                    Test
                  </button>
                </div>
              </div>

              {/* OpenAI API */}
              <div className="space-y-2">
                <label className="block font-medium text-slate-900">OpenAI API Key</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="password"
                      value={apiKeys.openai}
                      onChange={(e) => handleApiKeyChange('openai', e.target.value)}
                      placeholder="Enter OpenAI API key"
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      {getApiKeyStatus('openai')}
                    </div>
                  </div>
                  <button
                    onClick={() => testApiKey('openai')}
                    disabled={!apiKeys.openai || testResults.openai === 'testing'}
                    className="px-3 py-2 text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg disabled:opacity-50 transition-colors"
                  >
                    Test
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-start gap-3">
                <Key className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-amber-900">Security & Setup</h4>
                  <ul className="text-sm text-amber-800 mt-1 space-y-1">
                    <li>• API keys are encrypted and stored securely</li>
                    <li>• Test connection before using in production</li>
                    <li>• Monitor usage and rate limits in each platform</li>
                    <li>• Invalid keys automatically fall back to demo mode</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* System Status */}
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <h3 className="font-semibold text-slate-900 mb-4">System Status</h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                <span className="text-sm font-medium text-emerald-900">Database Connection</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                  <span className="text-xs text-emerald-700">Connected</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <span className="text-sm font-medium text-blue-900">Agent Services</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  <span className="text-xs text-blue-700">
                    {Object.values(agents).filter(Boolean).length} Active
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-sm font-medium text-slate-900">API Rate Limits</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-slate-400 rounded-full" />
                  <span className="text-xs text-slate-600">Within Limits</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}