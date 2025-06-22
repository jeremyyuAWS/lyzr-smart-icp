import React, { useState, useCallback, useEffect } from 'react';
import { Workflow, Plus, Settings, ArrowRight, Zap, Database, Mail, Target, Download, Play, Save, GitBranch, Clock, BarChart3, Shuffle, CheckCircle, Loader2, Timer, AlertTriangle, BookOpen } from 'lucide-react';
import { InfoModal } from './InfoModal';
import { Switch } from './ui/switch';

interface WorkflowStep {
  id: string;
  type: 'agent' | 'enrichment' | 'scoring' | 'filter' | 'crm' | 'email' | 'branch' | 'merge';
  name: string;
  icon: React.ReactNode;
  description: string;
  enabled: boolean;
  config: any;
  position: { x: number; y: number };
  performance?: {
    successRate: number;
    avgTime: string;
    cost: number;
  };
}

interface StepExecution {
  stepId: string;
  status: 'pending' | 'running' | 'completed' | 'error';
  startTime?: number;
  endTime?: number;
  duration?: number;
  progress?: number;
  output?: any;
  error?: string;
}

interface CRMIntegration {
  name: string;
  enabled: boolean;
  config: {
    apiKey?: string;
    webhookUrl?: string;
    fieldMapping?: Record<string, string>;
  };
}

interface SavedICP {
  id: string;
  name: string;
  description: string;
  criteria: any;
  createdAt: string;
}

export function WorkflowBuilder() {
  const [workflowSteps, setWorkflowSteps] = useState<WorkflowStep[]>([
    {
      id: 'icp-input',
      type: 'agent',
      name: 'ICP Input',
      icon: <Target className="h-4 w-4" />,
      description: 'Define ideal customer profile criteria',
      enabled: true,
      config: { requiresInput: true },
      position: { x: 50, y: 100 },
      performance: { successRate: 1.0, avgTime: '0.2s', cost: 0 }
    },
    {
      id: 'exa-discovery',
      type: 'agent', 
      name: 'Exa Discovery',
      icon: <img src="/images/Exa-logo-square.jpeg" alt="Exa" className="w-4 h-4 rounded" />,
      description: 'Semantic company search and discovery',
      enabled: true,
      config: { maxResults: 50, confidenceThreshold: 0.7 },
      position: { x: 250, y: 100 },
      performance: { successRate: 0.91, avgTime: '1.2s', cost: 0.05 }
    },
    {
      id: 'parallel-branch',
      type: 'branch',
      name: 'Parallel Enrichment',
      icon: <GitBranch className="h-4 w-4" />,
      description: 'Run multiple enrichment agents in parallel',
      enabled: true,
      config: { branches: ['phind', 'perplexity'] },
      position: { x: 450, y: 100 },
      performance: { successRate: 0.94, avgTime: '2.8s', cost: 0.12 }
    },
    {
      id: 'phind-signals',
      type: 'enrichment',
      name: 'Phind Signals',
      icon: <img src="/images/Phind-logo-square.png" alt="Phind" className="w-4 h-4 rounded" />,
      description: 'Technical hiring signals and growth indicators',
      enabled: true,
      config: { includeHiring: true, includeTechStack: true },
      position: { x: 550, y: 50 },
      performance: { successRate: 0.85, avgTime: '2.1s', cost: 0.08 }
    },
    {
      id: 'perplexity-contacts',
      type: 'enrichment',
      name: 'Perplexity Contacts',
      icon: <img src="/images/Perplexity-logo-square.jpeg" alt="Perplexity" className="w-4 h-4 rounded" />,
      description: 'Contact discovery and enrichment',
      enabled: true,
      config: { maxContactsPerCompany: 3, includeBackground: true },
      position: { x: 550, y: 150 },
      performance: { successRate: 0.79, avgTime: '3.4s', cost: 0.15 }
    },
    {
      id: 'merge-data',
      type: 'merge',
      name: 'Data Merge',
      icon: <Shuffle className="h-4 w-4" />,
      description: 'Combine parallel enrichment results',
      enabled: true,
      config: { strategy: 'union' },
      position: { x: 750, y: 100 },
      performance: { successRate: 0.98, avgTime: '0.1s', cost: 0 }
    },
    {
      id: 'ai-scoring',
      type: 'scoring',
      name: 'AI Scoring',
      icon: <Zap className="h-4 w-4" />,
      description: 'Multi-dimensional lead scoring',
      enabled: true,
      config: { weights: { icpFit: 0.3, confidence: 0.3, signals: 0.4 }, threshold: 0.6 },
      position: { x: 950, y: 100 },
      performance: { successRate: 0.93, avgTime: '0.8s', cost: 0.03 }
    },
    {
      id: 'quality-filter',
      type: 'filter',
      name: 'Quality Filter',
      icon: <Settings className="h-4 w-4" />,
      description: 'Filter leads by quality score',
      enabled: true,
      config: { minScore: 0.7, maxResults: 100 },
      position: { x: 1150, y: 100 },
      performance: { successRate: 1.0, avgTime: '0.1s', cost: 0 }
    },
    {
      id: 'crm-sync',
      type: 'crm',
      name: 'CRM Sync',
      icon: <Database className="h-4 w-4" />,
      description: 'Push qualified leads to CRM',
      enabled: true,
      config: { provider: 'hubspot', autoSync: true },
      position: { x: 1350, y: 100 },
      performance: { successRate: 0.96, avgTime: '1.5s', cost: 0.02 }
    }
  ]);

  const [savedICPs, setSavedICPs] = useState<SavedICP[]>([
    {
      id: 'default-b2b',
      name: 'Default B2B SaaS',
      description: 'B2B SaaS companies with 50-200 employees using modern tech stack',
      criteria: {
        industries: ['Technology & Software'],
        company_sizes: ['Medium Business (50-249)'],
        technologies: ['React', 'Node.js', 'AWS'],
        business_models: ['B2B (Business to Business)', 'SaaS (Software as a Service)']
      },
      createdAt: '2024-01-10'
    },
    {
      id: 'enterprise-focused',
      name: 'Enterprise Technology',
      description: 'Large enterprise companies with significant tech budgets',
      criteria: {
        industries: ['Technology & Software', 'Banking & Financial Services'],
        company_sizes: ['Enterprise (1,000-4,999)', 'Large Enterprise (5,000-19,999)'],
        technologies: ['Kubernetes', 'AWS', 'Salesforce'],
        revenue_ranges: ['$100M - $500M', '$500M - $1B']
      },
      createdAt: '2024-01-08'
    },
    {
      id: 'startup-growth',
      name: 'High-Growth Startups',
      description: 'Fast-growing startups with recent funding and hiring',
      criteria: {
        industries: ['Technology & Software'],
        growth_stages: ['Series A', 'Series B'],
        company_sizes: ['Small Business (10-49)', 'Medium Business (50-249)'],
        urgency_indicators: ['Recent funding raised', 'Rapid growth phase']
      },
      createdAt: '2024-01-12'
    }
  ]);

  const [selectedICP, setSelectedICP] = useState<string>('default-b2b');
  const [showICPSelector, setShowICPSelector] = useState(false);

  const [crmIntegrations, setCrmIntegrations] = useState<Record<string, CRMIntegration>>({
    hubspot: {
      name: 'HubSpot',
      enabled: true,
      config: {
        apiKey: '',
        fieldMapping: {
          company_name: 'name',
          domain: 'domain',
          email: 'email',
          score: 'lead_score'
        }
      }
    },
    salesforce: {
      name: 'Salesforce',
      enabled: false,
      config: {
        apiKey: '',
        fieldMapping: {
          company_name: 'Name',
          domain: 'Website',
          email: 'Email',
          score: 'Lead_Score__c'
        }
      }
    },
    pipedrive: {
      name: 'Pipedrive',
      enabled: false,
      config: {
        apiKey: '',
        fieldMapping: {
          company_name: 'name',
          domain: 'website',
          email: 'email',
          score: 'custom_score'
        }
      }
    }
  });

  const [isRunning, setIsRunning] = useState(false);
  const [workflowResults, setWorkflowResults] = useState<any>(null);
  const [selectedStep, setSelectedStep] = useState<string | null>(null);
  const [showPerformance, setShowPerformance] = useState(true);
  const [viewMode, setViewMode] = useState<'linear' | 'visual'>('linear');
  
  // New state for animated execution
  const [executionSteps, setExecutionSteps] = useState<StepExecution[]>([]);
  const [currentExecutingStep, setCurrentExecutingStep] = useState<string | null>(null);
  const [executionStartTime, setExecutionStartTime] = useState<number | null>(null);

  const availableSteps = [
    {
      type: 'agent',
      name: 'SERP Analysis',
      icon: <Zap className="h-4 w-4" />,
      description: 'Search engine presence analysis'
    },
    {
      type: 'enrichment', 
      name: 'Web Scraper',
      icon: <Download className="h-4 w-4" />,
      description: 'Extract data from company websites'
    },
    {
      type: 'filter',
      name: 'Geographic Filter',
      icon: <Settings className="h-4 w-4" />,
      description: 'Filter by location and timezone'
    },
    {
      type: 'scoring',
      name: 'Custom Scoring',
      icon: <Target className="h-4 w-4" />,
      description: 'Apply custom scoring algorithms'
    },
    {
      type: 'branch',
      name: 'Conditional Branch',
      icon: <GitBranch className="h-4 w-4" />,
      description: 'Split workflow based on conditions'
    }
  ];

  const workflowTemplates = [
    {
      name: 'Enterprise Sales',
      description: 'High-touch enterprise lead generation',
      steps: 6,
      conversion: '42%',
      cost: '$0.45/lead'
    },
    {
      name: 'Startup Outreach',
      description: 'High-volume startup lead generation',
      steps: 5,
      conversion: '15%',
      cost: '$0.12/lead'
    },
    {
      name: 'Technical Recruitment',
      description: 'Engineering talent pipeline',
      steps: 4,
      conversion: '28%',
      cost: '$0.31/lead'
    }
  ];

  const simulateStepExecution = async (step: WorkflowStep): Promise<StepExecution> => {
    const execution: StepExecution = {
      stepId: step.id,
      status: 'running',
      startTime: Date.now(),
      progress: 0
    };

    // Update execution state
    setExecutionSteps(prev => {
      const updated = prev.map(exec => 
        exec.stepId === step.id ? execution : exec
      );
      if (!updated.find(exec => exec.stepId === step.id)) {
        updated.push(execution);
      }
      return updated;
    });

    setCurrentExecutingStep(step.id);

    // Simulate progress for enrichment steps
    if (step.type === 'enrichment') {
      const totalDuration = parseFloat(step.performance?.avgTime.replace('s', '') || '2') * 1000;
      const progressSteps = 20;
      const stepDuration = totalDuration / progressSteps;

      for (let i = 0; i <= progressSteps; i++) {
        await new Promise(resolve => setTimeout(resolve, stepDuration));
        
        const progress = (i / progressSteps) * 100;
        
        setExecutionSteps(prev => prev.map(exec => 
          exec.stepId === step.id 
            ? { ...exec, progress, status: i === progressSteps ? 'completed' : 'running' }
            : exec
        ));
      }
    } else {
      // For non-enrichment steps, simulate faster completion
      const duration = parseFloat(step.performance?.avgTime.replace('s', '') || '0.5') * 1000;
      await new Promise(resolve => setTimeout(resolve, duration));
      
      setExecutionSteps(prev => prev.map(exec => 
        exec.stepId === step.id 
          ? { ...exec, progress: 100, status: 'completed', endTime: Date.now(), duration }
          : exec
      ));
    }

    return {
      stepId: step.id,
      status: 'completed',
      startTime: execution.startTime,
      endTime: Date.now(),
      progress: 100
    };
  };

  const runWorkflow = async () => {
    setIsRunning(true);
    setWorkflowResults(null);
    setExecutionSteps([]);
    setExecutionStartTime(Date.now());

    const activeSteps = workflowSteps.filter(step => step.enabled);
    
    // Initialize all steps as pending
    const initialExecutions = activeSteps.map(step => ({
      stepId: step.id,
      status: 'pending' as const,
      progress: 0
    }));
    setExecutionSteps(initialExecutions);

    try {
      // Execute steps sequentially, but handle parallel enrichment
      for (let i = 0; i < activeSteps.length; i++) {
        const step = activeSteps[i];
        
        if (step.id === 'parallel-branch') {
          // Execute enrichment steps in parallel
          const enrichmentSteps = activeSteps.filter(s => 
            s.type === 'enrichment' && s.enabled
          );
          
          setCurrentExecutingStep('parallel-branch');
          
          await Promise.all(enrichmentSteps.map(async (enrichmentStep) => {
            await simulateStepExecution(enrichmentStep);
          }));
          
          // Mark parallel branch as completed
          setExecutionSteps(prev => prev.map(exec => 
            exec.stepId === 'parallel-branch' 
              ? { ...exec, status: 'completed', progress: 100 }
              : exec
          ));
        } else if (step.type !== 'enrichment') {
          // Execute non-enrichment steps normally
          await simulateStepExecution(step);
        }
      }

      // Calculate final results
      let totalCost = 0;
      let totalTime = 0;
      
      activeSteps.forEach(step => {
        if (step.performance) {
          totalCost += step.performance.cost;
          totalTime += parseFloat(step.performance.avgTime.replace('s', ''));
        }
      });

      const results = {
        stepsExecuted: activeSteps.length,
        companiesProcessed: 47,
        qualifiedLeads: 23,
        crmSynced: crmIntegrations.hubspot.enabled ? 23 : 0,
        emailsGenerated: workflowSteps.find(s => s.id === 'email-generator')?.enabled ? 15 : 0,
        executionTime: `${((Date.now() - (executionStartTime || Date.now())) / 1000).toFixed(1)}s`,
        totalCost: `$${totalCost.toFixed(2)}`,
        successRate: '91%'
      };

      setWorkflowResults(results);
    } catch (error) {
      console.error('Workflow execution error:', error);
    } finally {
      setIsRunning(false);
      setCurrentExecutingStep(null);
    }
  };

  const toggleStep = (stepId: string) => {
    setWorkflowSteps(prev => prev.map(step => 
      step.id === stepId ? { ...step, enabled: !step.enabled } : step
    ));
  };

  const updateStepConfig = (stepId: string, config: any) => {
    setWorkflowSteps(prev => prev.map(step =>
      step.id === stepId ? { ...step, config: { ...step.config, ...config } } : step
    ));
  };

  const addStep = (stepType: any) => {
    const newStep: WorkflowStep = {
      id: `${stepType.type}-${Date.now()}`,
      type: stepType.type,
      name: stepType.name,
      icon: stepType.icon,
      description: stepType.description,
      enabled: true,
      config: {},
      position: { x: 50, y: 300 + (workflowSteps.length * 60) },
      performance: { successRate: 0.85, avgTime: '1.0s', cost: 0.05 }
    };
    setWorkflowSteps(prev => [...prev, newStep]);
  };

  const updateCrmIntegration = (provider: string, config: Partial<CRMIntegration>) => {
    setCrmIntegrations(prev => ({
      ...prev,
      [provider]: { ...prev[provider], ...config }
    }));
  };

  const getStepIcon = (step: WorkflowStep) => {
    switch (step.type) {
      case 'agent': return <Zap className="h-4 w-4 text-blue-600" />;
      case 'enrichment': return <Plus className="h-4 w-4 text-emerald-600" />;
      case 'scoring': return <Target className="h-4 w-4 text-purple-600" />;
      case 'filter': return <Settings className="h-4 w-4 text-amber-600" />;
      case 'crm': return <Database className="h-4 w-4 text-indigo-600" />;
      case 'email': return <Mail className="h-4 w-4 text-pink-600" />;
      case 'branch': return <GitBranch className="h-4 w-4 text-orange-600" />;
      case 'merge': return <Shuffle className="h-4 w-4 text-teal-600" />;
      default: return step.icon;
    }
  };

  const getPerformanceColor = (rate: number) => {
    if (rate >= 0.9) return 'text-emerald-600';
    if (rate >= 0.8) return 'text-blue-600';
    if (rate >= 0.7) return 'text-amber-600';
    return 'text-red-600';
  };

  const getExecutionStatus = (stepId: string) => {
    const execution = executionSteps.find(exec => exec.stepId === stepId);
    return execution || { stepId, status: 'pending', progress: 0 };
  };

  const getStepStatusIcon = (stepId: string) => {
    const execution = getExecutionStatus(stepId);
    
    switch (execution.status) {
      case 'running':
        return <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-emerald-600" />;
      case 'error':
        return <div className="h-4 w-4 bg-red-600 rounded-full" />;
      default:
        return <Clock className="h-4 w-4 text-slate-400" />;
    }
  };

  const enabledSteps = workflowSteps.filter(step => step.enabled);
  const icpStep = workflowSteps.find(step => step.id === 'icp-input');
  const selectedICPData = savedICPs.find(icp => icp.id === selectedICP);

  // Check if workflow can run without ICP input
  const canRunWorkflow = () => {
    if (icpStep?.enabled) return true; // ICP input is enabled
    if (selectedICPData) return true; // Has fallback ICP
    return false; // No ICP available
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Workflow className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-slate-900">Workflow Builder</h2>
          <InfoModal
            title="Advanced Agentic Workflow Builder"
            description="Design custom lead acquisition pipelines with drag-and-drop AI agents, parallel processing, conditional branching, and real-time performance optimization."
            features={[
              "Visual workflow designer with parallel processing and conditional logic",
              "Real-time performance monitoring and cost optimization",
              "Template library with proven conversion patterns",
              "A/B testing capabilities for workflow optimization",
              "Advanced CRM integration with field mapping and webhooks"
            ]}
            businessValue="Advanced workflows increase lead quality by 65% and reduce cost-per-lead by 40% through intelligent automation, parallel processing, and continuous optimization."
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('linear')}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                viewMode === 'linear' 
                  ? 'bg-white text-slate-900 shadow-sm' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Linear
            </button>
            <button
              onClick={() => setViewMode('visual')}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                viewMode === 'visual' 
                  ? 'bg-white text-slate-900 shadow-sm' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Visual
            </button>
          </div>
          
          <div className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-slate-600" />
            <span className="text-sm text-slate-600">Performance</span>
            <Switch
              checked={showPerformance}
              onCheckedChange={setShowPerformance}
            />
          </div>
          <button
            onClick={() => setSelectedStep(null)}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
          >
            <Save className="h-4 w-4 inline mr-2" />
            Save Workflow
          </button>
          <button
            onClick={runWorkflow}
            disabled={isRunning || !canRunWorkflow()}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isRunning ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <Play className="h-4 w-4" />
            )}
            {isRunning ? 'Running Workflow...' : 'Run Workflow'}
          </button>
        </div>
      </div>

      {/* ICP Fallback Warning */}
      {!icpStep?.enabled && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-medium text-amber-900">ICP Input Disabled</h4>
              <p className="text-sm text-amber-800 mt-1">
                Workflow will use saved ICP: <strong>{selectedICPData?.name || 'None selected'}</strong>
              </p>
              {selectedICPData && (
                <p className="text-xs text-amber-700 mt-1">"{selectedICPData.description}"</p>
              )}
              
              <div className="flex items-center gap-3 mt-3">
                <button
                  onClick={() => setShowICPSelector(!showICPSelector)}
                  className="text-sm bg-amber-100 hover:bg-amber-200 text-amber-800 px-3 py-1 rounded transition-colors"
                >
                  {showICPSelector ? 'Hide' : 'Change'} ICP Selection
                </button>
                <button
                  onClick={() => toggleStep('icp-input')}
                  className="text-sm bg-amber-600 hover:bg-amber-700 text-white px-3 py-1 rounded transition-colors"
                >
                  Enable ICP Input
                </button>
              </div>

              {showICPSelector && (
                <div className="mt-4 p-4 bg-white rounded-lg border border-amber-200">
                  <h5 className="font-medium text-slate-900 mb-3">Select Saved ICP</h5>
                  <div className="space-y-2">
                    {savedICPs.map((icp) => (
                      <label key={icp.id} className="flex items-start gap-3 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer">
                        <input
                          type="radio"
                          name="selectedICP"
                          value={icp.id}
                          checked={selectedICP === icp.id}
                          onChange={(e) => setSelectedICP(e.target.value)}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <div className="font-medium text-slate-900">{icp.name}</div>
                          <div className="text-sm text-slate-600">{icp.description}</div>
                          <div className="text-xs text-slate-500 mt-1">Created: {new Date(icp.createdAt).toLocaleDateString()}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Workflow Progress Overview */}
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-slate-900">Workflow Progress</h3>
          <div className="flex items-center gap-4 text-sm text-slate-600">
            <span>{enabledSteps.length} steps active</span>
            {showPerformance && (
              <span>Est. cost: ${enabledSteps.reduce((sum, s) => sum + (s.performance?.cost || 0), 0).toFixed(2)}/run</span>
            )}
            {isRunning && executionStartTime && (
              <div className="flex items-center gap-2 text-blue-600">
                <Timer className="h-4 w-4" />
                <span>{((Date.now() - executionStartTime) / 1000).toFixed(1)}s</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2 mb-2">
          {enabledSteps.map((step, index) => {
            const execution = getExecutionStatus(step.id);
            
            return (
              <React.Fragment key={step.id}>
                <div className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold text-white transition-all duration-500 ${
                  execution.status === 'completed' ? 'bg-emerald-600' :
                  execution.status === 'running' ? 'bg-blue-600 animate-pulse' :
                  execution.status === 'error' ? 'bg-red-600' :
                  'bg-slate-300'
                }`}>
                  {index + 1}
                </div>
                {index < enabledSteps.length - 1 && (
                  <div className={`flex-1 h-1 rounded-full min-w-[20px] transition-all duration-500 ${
                    execution.status === 'completed' ? 'bg-emerald-300' : 'bg-slate-200'
                  }`} />
                )}
              </React.Fragment>
            );
          })}
        </div>
        
        <div className="flex items-start gap-2 text-xs text-slate-600">
          {enabledSteps.map((step, index) => {
            const execution = getExecutionStatus(step.id);
            
            return (
              <div key={step.id} className="flex-1 min-w-0">
                <div className="truncate font-medium">{step.name}</div>
                {showPerformance && step.performance && (
                  <div className="text-slate-500">
                    {(step.performance.successRate * 100).toFixed(0)}% • {step.performance.avgTime}
                  </div>
                )}
                {execution.status === 'running' && execution.progress !== undefined && (
                  <div className="text-blue-600 font-medium">
                    {Math.round(execution.progress)}%
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Live Execution Dashboard */}
      {isRunning && (
        <div className="bg-gradient-to-r from-blue-50 to-emerald-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <h3 className="font-semibold text-slate-900 text-lg">Workflow Execution in Progress</h3>
            {!icpStep?.enabled && selectedICPData && (
              <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                Using: {selectedICPData.name}
              </span>
            )}
          </div>

          <div className="grid gap-4">
            {enabledSteps.map((step) => {
              const execution = getExecutionStatus(step.id);
              const isEnrichment = step.type === 'enrichment';
              const isCurrentlyExecuting = currentExecutingStep === step.id || 
                (currentExecutingStep === 'parallel-branch' && isEnrichment);

              return (
                <div key={step.id} className={`p-4 rounded-lg border transition-all duration-500 ${
                  execution.status === 'completed' ? 'border-emerald-200 bg-emerald-50' :
                  execution.status === 'running' ? 'border-blue-200 bg-blue-50' :
                  execution.status === 'error' ? 'border-red-200 bg-red-50' :
                  'border-slate-200 bg-white'
                }`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {getStepStatusIcon(step.id)}
                      {React.isValidElement(step.icon) ? step.icon : getStepIcon(step)}
                      <div>
                        <span className="font-medium text-slate-900">{step.name}</span>
                        {isEnrichment && isCurrentlyExecuting && (
                          <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full animate-pulse">
                            Enriching...
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-right text-sm">
                      <div className={`font-medium ${
                        execution.status === 'completed' ? 'text-emerald-600' :
                        execution.status === 'running' ? 'text-blue-600' :
                        execution.status === 'error' ? 'text-red-600' :
                        'text-slate-400'
                      }`}>
                        {execution.status === 'completed' ? 'Completed' :
                         execution.status === 'running' ? 'Running' :
                         execution.status === 'error' ? 'Error' :
                         'Pending'}
                      </div>
                      {execution.duration && (
                        <div className="text-xs text-slate-500">
                          {(execution.duration / 1000).toFixed(1)}s
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Progress bar for enrichment steps */}
                  {isEnrichment && execution.status === 'running' && execution.progress !== undefined && (
                    <div className="mb-2">
                      <div className="flex justify-between text-xs text-slate-600 mb-1">
                        <span>Processing companies...</span>
                        <span>{Math.round(execution.progress)}%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-emerald-500 h-2 rounded-full transition-all duration-300 ease-out"
                          style={{ width: `${execution.progress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  <p className="text-sm text-slate-600">{step.description}</p>

                  {/* Show enrichment details */}
                  {isEnrichment && execution.status === 'running' && (
                    <div className="mt-3 text-xs text-slate-500 space-y-1">
                      <div>• Analyzing company hiring patterns</div>
                      <div>• Extracting technology stack information</div>
                      <div>• Identifying growth signals and indicators</div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Workflow Templates */}
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <h3 className="font-semibold text-slate-900 mb-4">Workflow Templates</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {workflowTemplates.map((template, index) => (
            <div key={index} className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-slate-900">{template.name}</h4>
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">{template.steps} steps</span>
              </div>
              <p className="text-sm text-slate-600 mb-3">{template.description}</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-500">Conversion:</span>
                  <span className="font-medium text-emerald-600 ml-1">{template.conversion}</span>
                </div>
                <div>
                  <span className="text-slate-500">Cost:</span>
                  <span className="font-medium text-slate-900 ml-1">{template.cost}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {workflowResults && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6">
          <h3 className="font-semibold text-emerald-900 mb-4">Workflow Execution Complete</h3>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-700">{workflowResults.stepsExecuted}</div>
              <div className="text-sm text-emerald-600">Steps Executed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-700">{workflowResults.companiesProcessed}</div>
              <div className="text-sm text-emerald-600">Companies Processed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-700">{workflowResults.qualifiedLeads}</div>
              <div className="text-sm text-emerald-600">Qualified Leads</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-700">{workflowResults.crmSynced}</div>
              <div className="text-sm text-emerald-600">CRM Synced</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-700">{workflowResults.executionTime}</div>
              <div className="text-sm text-emerald-600">Execution Time</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-700">{workflowResults.totalCost}</div>
              <div className="text-sm text-emerald-600">Total Cost</div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        {/* Workflow Canvas */}
        <div className="xl:col-span-3 bg-white border border-slate-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-slate-900">Workflow Pipeline</h3>
          </div>

          {/* Workflow Steps */}
          <div className="space-y-4">
            {workflowSteps.map((step, index) => {
              const execution = getExecutionStatus(step.id);
              
              return (
                <div key={step.id} className="flex items-center gap-4">
                  {/* Step Number */}
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white transition-all duration-500 ${
                    execution.status === 'completed' ? 'bg-emerald-600' :
                    execution.status === 'running' ? 'bg-blue-600 animate-pulse' :
                    execution.status === 'error' ? 'bg-red-600' :
                    step.enabled ? 'bg-slate-400' : 'bg-slate-300'
                  }`}>
                    {step.enabled ? enabledSteps.findIndex(s => s.id === step.id) + 1 : '—'}
                  </div>

                  {/* Step Card */}
                  <div
                    onClick={() => setSelectedStep(step.id)}
                    className={`flex-1 p-4 border rounded-lg cursor-pointer transition-all ${
                      execution.status === 'completed' ? 'border-emerald-200 bg-emerald-50' :
                      execution.status === 'running' ? 'border-blue-200 bg-blue-50' :
                      execution.status === 'error' ? 'border-red-200 bg-red-50' :
                      step.enabled ? 'border-blue-200 bg-blue-50 hover:bg-blue-100' : 'border-slate-200 bg-slate-50 opacity-60'
                    } ${
                      selectedStep === step.id ? 'ring-2 ring-blue-500 ring-offset-2' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        {React.isValidElement(step.icon) ? step.icon : getStepIcon(step)}
                        <div>
                          <span className="font-medium text-slate-900">{step.name}</span>
                          {step.type === 'branch' && <span className="ml-2 text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">Parallel</span>}
                          {step.type === 'merge' && <span className="ml-2 text-xs bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full">Merge</span>}
                          {step.id === 'icp-input' && !step.enabled && selectedICPData && (
                            <span className="ml-2 text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                              Using: {selectedICPData.name}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {isRunning && (
                          <div className="text-right text-xs">
                            {getStepStatusIcon(step.id)}
                          </div>
                        )}
                        {showPerformance && step.performance && step.enabled && !isRunning && (
                          <div className="text-right text-xs">
                            <div className={`font-medium ${getPerformanceColor(step.performance.successRate)}`}>
                              {(step.performance.successRate * 100).toFixed(0)}%
                            </div>
                            <div className="text-slate-500">{step.performance.avgTime}</div>
                          </div>
                        )}
                        <Switch
                          checked={step.enabled}
                          onCheckedChange={() => toggleStep(step.id)}
                          onClick={(e) => e.stopPropagation()}
                          disabled={isRunning}
                        />
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 mb-2">{step.description}</p>
                    
                    {/* Show execution progress for enrichment steps */}
                    {step.type === 'enrichment' && execution.status === 'running' && execution.progress !== undefined && (
                      <div className="mt-3">
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-emerald-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${execution.progress}%` }}
                          />
                        </div>
                        <div className="text-xs text-blue-600 mt-1">
                          Processing: {Math.round(execution.progress)}%
                        </div>
                      </div>
                    )}
                    
                    {showPerformance && step.performance && step.enabled && !isRunning && (
                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <span>Cost: ${step.performance.cost.toFixed(3)}</span>
                        <span>•</span>
                        <span>Success: {(step.performance.successRate * 100).toFixed(0)}%</span>
                      </div>
                    )}
                  </div>

                  {/* Arrow to next step */}
                  {index < workflowSteps.length - 1 && step.enabled && workflowSteps[index + 1].enabled && (
                    <ArrowRight className={`h-5 w-5 flex-shrink-0 transition-colors ${
                      execution.status === 'completed' ? 'text-emerald-600' :
                      execution.status === 'running' ? 'text-blue-600' :
                      'text-blue-600'
                    }`} />
                  )}
                  {index < workflowSteps.length - 1 && (!step.enabled || !workflowSteps[index + 1].enabled) && (
                    <ArrowRight className="h-5 w-5 text-slate-300 flex-shrink-0" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Add Step */}
          <div className="mt-6 pt-6 border-t border-slate-200">
            <h4 className="font-medium text-slate-900 mb-3">Add Workflow Step</h4>
            <div className="grid grid-cols-2 gap-3">
              {availableSteps.map((stepType, index) => (
                <button
                  key={index}
                  onClick={() => addStep(stepType)}
                  disabled={isRunning}
                  className="p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-left disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="flex items-center gap-2 mb-1">
                    {stepType.icon}
                    <span className="font-medium text-slate-900 text-sm">{stepType.name}</span>
                  </div>
                  <p className="text-xs text-slate-600">{stepType.description}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Configuration Panel */}
        <div className="space-y-6">
          {/* Saved ICPs */}
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <BookOpen className="h-5 w-5 text-blue-600" />
              <h3 className="font-semibold text-slate-900">Saved ICPs</h3>
            </div>
            
            <div className="space-y-3">
              {savedICPs.map((icp) => (
                <div key={icp.id} className={`p-3 rounded-lg border transition-colors ${
                  selectedICP === icp.id ? 'border-blue-200 bg-blue-50' : 'border-slate-200 hover:bg-slate-50'
                }`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-slate-900 text-sm">{icp.name}</h4>
                      <p className="text-xs text-slate-600 mt-1">{icp.description}</p>
                      <div className="text-xs text-slate-500 mt-1">{new Date(icp.createdAt).toLocaleDateString()}</div>
                    </div>
                    <button
                      onClick={() => setSelectedICP(icp.id)}
                      className={`px-2 py-1 text-xs rounded transition-colors ${
                        selectedICP === icp.id 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      {selectedICP === icp.id ? 'Active' : 'Select'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Performance Metrics */}
          {showPerformance && (
            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <h3 className="font-semibold text-slate-900 mb-4">Performance Optimization</h3>
              
              <div className="space-y-4">
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <BarChart3 className="h-4 w-4 text-emerald-600" />
                    <span className="font-medium text-emerald-900 text-sm">Optimization Suggestions</span>
                  </div>
                  <ul className="text-xs text-emerald-800 space-y-1">
                    <li>• Run Phind & Perplexity in parallel (+40% speed)</li>
                    <li>• Increase Exa confidence threshold (+15% quality)</li>
                    <li>• Add geographic filter (-25% processing cost)</li>
                  </ul>
                </div>
                
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-slate-600">Est. Success Rate</span>
                    <div className="font-bold text-emerald-600">91%</div>
                  </div>
                  <div>
                    <span className="text-slate-600">Cost per Lead</span>
                    <div className="font-bold text-slate-900">$0.23</div>
                  </div>
                  <div>
                    <span className="text-slate-600">Avg Processing</span>
                    <div className="font-bold text-blue-600">8.4s</div>
                  </div>
                  <div>
                    <span className="text-slate-600">Quality Score</span>
                    <div className="font-bold text-purple-600">87%</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step Configuration */}
          {selectedStep && (
            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <h3 className="font-semibold text-slate-900 mb-4">Step Configuration</h3>
              {(() => {
                const step = workflowSteps.find(s => s.id === selectedStep);
                if (!step) return null;

                return (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Step Name</label>
                      <input
                        type="text"
                        value={step.name}
                        onChange={(e) => updateStepConfig(step.id, { name: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={isRunning}
                      />
                    </div>

                    {step.type === 'scoring' && (
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Minimum Score</label>
                        <input
                          type="number"
                          min="0"
                          max="1"
                          step="0.1"
                          value={step.config.threshold || 0.6}
                          onChange={(e) => updateStepConfig(step.id, { threshold: parseFloat(e.target.value) })}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          disabled={isRunning}
                        />
                      </div>
                    )}

                    {step.type === 'filter' && (
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Max Results</label>
                        <input
                          type="number"
                          value={step.config.maxResults || 100}
                          onChange={(e) => updateStepConfig(step.id, { maxResults: parseInt(e.target.value) })}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          disabled={isRunning}
                        />
                      </div>
                    )}

                    {step.type === 'branch' && (
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Branch Condition</label>
                        <select 
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          disabled={isRunning}
                        >
                          <option>{"Score > 0.8"}</option>
                          <option>{"Company Size > 100"}</option>
                          <option>Has Email Contact</option>
                          <option>Recent Funding</option>
                        </select>
                      </div>
                    )}

                    {step.type === 'enrichment' && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-medium text-slate-700">Include Tech Stack</label>
                          <Switch
                            checked={step.config.includeTechStack || false}
                            onCheckedChange={(checked) => updateStepConfig(step.id, { includeTechStack: checked })}
                            disabled={isRunning}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-medium text-slate-700">Include Hiring Signals</label>
                          <Switch
                            checked={step.config.includeHiring || false}
                            onCheckedChange={(checked) => updateStepConfig(step.id, { includeHiring: checked })}
                            disabled={isRunning}
                          />
                        </div>
                      </div>
                    )}

                    {step.performance && (
                      <div className="pt-4 border-t border-slate-200">
                        <h4 className="font-medium text-slate-900 text-sm mb-2">Performance Metrics</h4>
                        <div className="space-y-2 text-xs">
                          <div className="flex justify-between">
                            <span className="text-slate-600">Success Rate:</span>
                            <span className={getPerformanceColor(step.performance.successRate)}>
                              {(step.performance.successRate * 100).toFixed(0)}%
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Avg Time:</span>
                            <span className="text-slate-900">{step.performance.avgTime}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Cost:</span>
                            <span className="text-slate-900">${step.performance.cost.toFixed(3)}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          )}

          {/* CRM Integrations */}
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <h3 className="font-semibold text-slate-900 mb-4">CRM Integrations</h3>
            <div className="space-y-4">
              {Object.entries(crmIntegrations).map(([provider, integration]) => (
                <div key={provider} className="border border-slate-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Database className="h-4 w-4 text-indigo-600" />
                      <span className="font-medium text-slate-900">{integration.name}</span>
                    </div>
                    <Switch
                      checked={integration.enabled}
                      onCheckedChange={(enabled) => updateCrmIntegration(provider, { enabled })}
                      disabled={isRunning}
                    />
                  </div>
                  
                  {integration.enabled && (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">API Key</label>
                        <input
                          type="password"
                          value={integration.config.apiKey || ''}
                          onChange={(e) => updateCrmIntegration(provider, { 
                            config: { ...integration.config, apiKey: e.target.value } 
                          })}
                          placeholder={`Enter ${integration.name} API key`}
                          className="w-full px-3 py-2 text-sm border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                          disabled={isRunning}
                        />
                      </div>
                      
                      <div className="text-xs text-slate-500">
                        Leads will be automatically synced to {integration.name} when workflow completes
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Workflow Stats */}
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <h3 className="font-semibold text-slate-900 mb-4">Pipeline Performance</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Success Rate</span>
                <span className="font-medium text-emerald-600">87%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Avg. Execution Time</span>
                <span className="font-medium text-slate-900">2.1 min</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Leads Generated</span>
                <span className="font-medium text-slate-900">1,247</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Conversion Rate</span>
                <span className="font-medium text-blue-600">23%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Cost Efficiency</span>
                <span className="font-medium text-purple-600">$0.23/lead</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}