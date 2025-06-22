import React, { useState } from 'react';
import { FlaskConical, TrendingUp, Target, Users, BarChart3, Zap, CheckCircle, Clock, ArrowUp, ArrowDown } from 'lucide-react';
import { InfoModal } from './InfoModal';
import { Switch } from './ui/switch';

interface ABTest {
  id: string;
  name: string;
  type: 'workflow' | 'scoring' | 'email' | 'agent';
  status: 'draft' | 'running' | 'completed' | 'paused';
  startDate: string;
  endDate?: string;
  confidence: number;
  winner?: 'A' | 'B';
  variants: {
    A: ABVariant;
    B: ABVariant;
  };
  metrics: {
    conversion_rate: number;
    lead_quality: number;
    cost_per_lead: number;
    response_time: number;
  };
}

interface ABVariant {
  name: string;
  description: string;
  traffic: number; // percentage
  results: {
    impressions: number;
    conversions: number;
    conversion_rate: number;
    cost: number;
    quality_score: number;
  };
}

export function ABTestingDashboard() {
  const [activeTests, setActiveTests] = useState<ABTest[]>([
    {
      id: 'test-1',
      name: 'Workflow Optimization: Parallel vs Sequential',
      type: 'workflow',
      status: 'running',
      startDate: '2024-01-10',
      confidence: 95,
      winner: 'A',
      variants: {
        A: {
          name: 'Parallel Processing',
          description: 'Run Phind and Perplexity agents in parallel',
          traffic: 50,
          results: {
            impressions: 1250,
            conversions: 387,
            conversion_rate: 0.31,
            cost: 89.25,
            quality_score: 0.85
          }
        },
        B: {
          name: 'Sequential Processing',
          description: 'Run agents one after another',
          traffic: 50,
          results: {
            impressions: 1198,
            conversions: 323,
            conversion_rate: 0.27,
            cost: 94.80,
            quality_score: 0.82
          }
        }
      },
      metrics: {
        conversion_rate: 0.29,
        lead_quality: 0.84,
        cost_per_lead: 0.23,
        response_time: 2.3
      }
    },
    {
      id: 'test-2',
      name: 'Lead Scoring Algorithm: ML vs Rule-based',
      type: 'scoring',
      status: 'running',
      startDate: '2024-01-12',
      confidence: 78,
      variants: {
        A: {
          name: 'Machine Learning Model',
          description: 'AI-powered adaptive scoring',
          traffic: 60,
          results: {
            impressions: 890,
            conversions: 234,
            conversion_rate: 0.26,
            cost: 67.20,
            quality_score: 0.89
          }
        },
        B: {
          name: 'Rule-based Scoring',
          description: 'Traditional weighted scoring',
          traffic: 40,
          results: {
            impressions: 567,
            conversions: 128,
            conversion_rate: 0.23,
            cost: 45.30,
            quality_score: 0.76
          }
        }
      },
      metrics: {
        conversion_rate: 0.25,
        lead_quality: 0.84,
        cost_per_lead: 0.31,
        response_time: 1.8
      }
    },
    {
      id: 'test-3',
      name: 'Email Subject Lines: Personalized vs Generic',
      type: 'email',
      status: 'completed',
      startDate: '2024-01-05',
      endDate: '2024-01-14',
      confidence: 99,
      winner: 'A',
      variants: {
        A: {
          name: 'Personalized Subject',
          description: 'Company-specific subject lines',
          traffic: 50,
          results: {
            impressions: 2100,
            conversions: 567,
            conversion_rate: 0.27,
            cost: 105.00,
            quality_score: 0.91
          }
        },
        B: {
          name: 'Generic Subject',
          description: 'Standard template subjects',
          traffic: 50,
          results: {
            impressions: 2087,
            conversions: 396,
            conversion_rate: 0.19,
            cost: 104.35,
            quality_score: 0.78
          }
        }
      },
      metrics: {
        conversion_rate: 0.23,
        lead_quality: 0.85,
        cost_per_lead: 0.22,
        response_time: 0.5
      }
    }
  ]);

  const [newTest, setNewTest] = useState({
    name: '',
    type: 'workflow' as ABTest['type'],
    variantA: { name: '', description: '' },
    variantB: { name: '', description: '' },
    duration: 14,
    trafficSplit: 50
  });

  const [showCreateForm, setShowCreateForm] = useState(false);

  const createTest = () => {
    const test: ABTest = {
      id: `test-${Date.now()}`,
      name: newTest.name,
      type: newTest.type,
      status: 'draft',
      startDate: new Date().toISOString().split('T')[0],
      confidence: 0,
      variants: {
        A: {
          name: newTest.variantA.name,
          description: newTest.variantA.description,
          traffic: newTest.trafficSplit,
          results: {
            impressions: 0,
            conversions: 0,
            conversion_rate: 0,
            cost: 0,
            quality_score: 0
          }
        },
        B: {
          name: newTest.variantB.name,
          description: newTest.variantB.description,
          traffic: 100 - newTest.trafficSplit,
          results: {
            impressions: 0,
            conversions: 0,
            conversion_rate: 0,
            cost: 0,
            quality_score: 0
          }
        }
      },
      metrics: {
        conversion_rate: 0,
        lead_quality: 0,
        cost_per_lead: 0,
        response_time: 0
      }
    };

    setActiveTests([test, ...activeTests]);
    setNewTest({
      name: '',
      type: 'workflow',
      variantA: { name: '', description: '' },
      variantB: { name: '', description: '' },
      duration: 14,
      trafficSplit: 50
    });
    setShowCreateForm(false);
  };

  const pauseTest = (testId: string) => {
    setActiveTests(prev => prev.map(test => 
      test.id === testId ? { ...test, status: 'paused' as const } : test
    ));
  };

  const resumeTest = (testId: string) => {
    setActiveTests(prev => prev.map(test => 
      test.id === testId ? { ...test, status: 'running' as const } : test
    ));
  };

  const stopTest = (testId: string) => {
    setActiveTests(prev => prev.map(test => 
      test.id === testId ? { 
        ...test, 
        status: 'completed' as const,
        endDate: new Date().toISOString().split('T')[0]
      } : test
    ));
  };

  const getStatusColor = (status: ABTest['status']) => {
    switch (status) {
      case 'running': return 'text-emerald-600 bg-emerald-100';
      case 'completed': return 'text-blue-600 bg-blue-100';
      case 'paused': return 'text-amber-600 bg-amber-100';
      default: return 'text-slate-600 bg-slate-100';
    }
  };

  const getTypeIcon = (type: ABTest['type']) => {
    switch (type) {
      case 'workflow': return <Zap className="h-4 w-4" />;
      case 'scoring': return <Target className="h-4 w-4" />;
      case 'email': return <Users className="h-4 w-4" />;
      case 'agent': return <BarChart3 className="h-4 w-4" />;
    }
  };

  const calculateLift = (variantA: ABVariant, variantB: ABVariant) => {
    const lift = ((variantA.results.conversion_rate - variantB.results.conversion_rate) / variantB.results.conversion_rate) * 100;
    return {
      value: Math.abs(lift).toFixed(1),
      isPositive: lift > 0,
      isSignificant: Math.abs(lift) > 5
    };
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FlaskConical className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-slate-900">A/B Testing Dashboard</h2>
          <InfoModal
            title="A/B Testing Framework"
            description="Comprehensive A/B testing for workflow optimization, lead scoring algorithms, email campaigns, and AI agent performance."
            features={[
              "Multi-variate testing for workflows, scoring, and emails",
              "Statistical significance tracking with confidence intervals",
              "Real-time performance monitoring and automatic winner detection",
              "Traffic splitting with dynamic allocation",
              "Cost optimization through performance-based routing"
            ]}
            businessValue="A/B testing improves conversion rates by 25% and reduces cost-per-lead by 18% through continuous optimization and data-driven improvements."
          />
        </div>

        <button
          onClick={() => setShowCreateForm(true)}
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FlaskConical className="h-4 w-4" />
          Create New Test
        </button>
      </div>

      {/* Create Test Form */}
      {showCreateForm && (
        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <h3 className="font-semibold text-slate-900 mb-4">Create A/B Test</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Test Name</label>
                <input
                  type="text"
                  value={newTest.name}
                  onChange={(e) => setNewTest(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter test name"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Test Type</label>
                <select
                  value={newTest.type}
                  onChange={(e) => setNewTest(prev => ({ ...prev, type: e.target.value as ABTest['type'] }))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="workflow">Workflow</option>
                  <option value="scoring">Lead Scoring</option>
                  <option value="email">Email Campaign</option>
                  <option value="agent">AI Agent</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Duration (days)</label>
                <input
                  type="number"
                  value={newTest.duration}
                  onChange={(e) => setNewTest(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Traffic Split (A/B)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="10"
                    max="90"
                    value={newTest.trafficSplit}
                    onChange={(e) => setNewTest(prev => ({ ...prev, trafficSplit: parseInt(e.target.value) }))}
                    className="flex-1"
                  />
                  <span className="text-sm text-slate-600 w-16">
                    {newTest.trafficSplit}% / {100 - newTest.trafficSplit}%
                  </span>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Variant A Name</label>
                <input
                  type="text"
                  value={newTest.variantA.name}
                  onChange={(e) => setNewTest(prev => ({ 
                    ...prev, 
                    variantA: { ...prev.variantA, name: e.target.value }
                  }))}
                  placeholder="Control variant name"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Variant A Description</label>
                <textarea
                  value={newTest.variantA.description}
                  onChange={(e) => setNewTest(prev => ({ 
                    ...prev, 
                    variantA: { ...prev.variantA, description: e.target.value }
                  }))}
                  placeholder="Describe the control variant"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-20 resize-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Variant B Name</label>
                <input
                  type="text"
                  value={newTest.variantB.name}
                  onChange={(e) => setNewTest(prev => ({ 
                    ...prev, 
                    variantB: { ...prev.variantB, name: e.target.value }
                  }))}
                  placeholder="Test variant name"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Variant B Description</label>
                <textarea
                  value={newTest.variantB.description}
                  onChange={(e) => setNewTest(prev => ({ 
                    ...prev, 
                    variantB: { ...prev.variantB, description: e.target.value }
                  }))}
                  placeholder="Describe the test variant"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-20 resize-none"
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={() => setShowCreateForm(false)}
              className="px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={createTest}
              disabled={!newTest.name || !newTest.variantA.name || !newTest.variantB.name}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Create Test
            </button>
          </div>
        </div>
      )}

      {/* Active Tests */}
      <div className="grid gap-6">
        {activeTests.map((test) => {
          const lift = calculateLift(test.variants.A, test.variants.B);
          
          return (
            <div key={test.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden">
              <div className="p-6 border-b border-slate-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {getTypeIcon(test.type)}
                    <div>
                      <h3 className="font-semibold text-slate-900 text-lg">{test.name}</h3>
                      <div className="flex items-center gap-3 mt-1">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(test.status)}`}>
                          {test.status}
                        </span>
                        <span className="text-sm text-slate-600">
                          Started: {new Date(test.startDate).toLocaleDateString()}
                        </span>
                        {test.endDate && (
                          <span className="text-sm text-slate-600">
                            Ended: {new Date(test.endDate).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {test.winner && (
                      <div className="flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
                        <CheckCircle className="h-4 w-4" />
                        Winner: Variant {test.winner}
                      </div>
                    )}
                    
                    {test.status === 'running' && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => pauseTest(test.id)}
                          className="px-3 py-1.5 text-sm bg-amber-100 hover:bg-amber-200 text-amber-700 rounded-lg transition-colors"
                        >
                          Pause
                        </button>
                        <button
                          onClick={() => stopTest(test.id)}
                          className="px-3 py-1.5 text-sm bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors"
                        >
                          Stop
                        </button>
                      </div>
                    )}
                    
                    {test.status === 'paused' && (
                      <button
                        onClick={() => resumeTest(test.id)}
                        className="px-3 py-1.5 text-sm bg-emerald-100 hover:bg-emerald-200 text-emerald-700 rounded-lg transition-colors"
                      >
                        Resume
                      </button>
                    )}
                  </div>
                </div>

                {/* Confidence and Lift */}
                {test.status !== 'draft' && (
                  <div className="grid grid-cols-3 gap-6 mb-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-slate-900">{test.confidence}%</div>
                      <div className="text-sm text-slate-600">Confidence</div>
                    </div>
                    <div className="text-center">
                      <div className={`text-2xl font-bold flex items-center justify-center gap-1 ${
                        lift.isPositive ? 'text-emerald-600' : 'text-red-600'
                      }`}>
                        {lift.isPositive ? <ArrowUp className="h-5 w-5" /> : <ArrowDown className="h-5 w-5" />}
                        {lift.value}%
                      </div>
                      <div className="text-sm text-slate-600">Lift (A vs B)</div>
                    </div>
                    <div className="text-center">
                      <div className={`text-2xl font-bold ${
                        lift.isSignificant ? 'text-emerald-600' : 'text-amber-600'
                      }`}>
                        {lift.isSignificant ? 'Yes' : 'No'}
                      </div>
                      <div className="text-sm text-slate-600">Significant</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Variant Comparison */}
              <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200">
                {Object.entries(test.variants).map(([variant, data]) => (
                  <div key={variant} className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="font-semibold text-slate-900">
                          Variant {variant}: {data.name}
                        </h4>
                        <p className="text-sm text-slate-600 mt-1">{data.description}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-slate-600">Traffic</div>
                        <div className="font-semibold text-slate-900">{data.traffic}%</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-slate-600">Impressions</span>
                        <div className="font-semibold text-slate-900">{data.results.impressions.toLocaleString()}</div>
                      </div>
                      <div>
                        <span className="text-slate-600">Conversions</span>
                        <div className="font-semibold text-slate-900">{data.results.conversions.toLocaleString()}</div>
                      </div>
                      <div>
                        <span className="text-slate-600">Conversion Rate</span>
                        <div className="font-semibold text-emerald-600">{(data.results.conversion_rate * 100).toFixed(1)}%</div>
                      </div>
                      <div>
                        <span className="text-slate-600">Quality Score</span>
                        <div className="font-semibold text-blue-600">{(data.results.quality_score * 100).toFixed(0)}%</div>
                      </div>
                      <div className="col-span-2">
                        <span className="text-slate-600">Cost</span>
                        <div className="font-semibold text-slate-900">${data.results.cost.toFixed(2)}</div>
                      </div>
                    </div>

                    {test.winner === variant && (
                      <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                        <div className="flex items-center gap-2 text-emerald-700">
                          <CheckCircle className="h-4 w-4" />
                          <span className="font-medium text-sm">Winner</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}