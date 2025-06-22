import React, { useState } from 'react';
import { BarChart3, TrendingUp, Target, Brain, Zap, DollarSign, Users, Calendar, ArrowUp, ArrowDown, Activity } from 'lucide-react';
import { InfoModal } from './InfoModal';

interface PredictiveModel {
  id: string;
  name: string;
  type: 'lead_scoring' | 'conversion_prediction' | 'churn_prediction' | 'revenue_forecast';
  accuracy: number;
  last_trained: string;
  predictions_made: number;
  features: string[];
  status: 'active' | 'training' | 'inactive';
}

interface PredictionResult {
  id: string;
  model: string;
  company: string;
  prediction: number;
  confidence: number;
  factors: Array<{
    factor: string;
    impact: number;
    direction: 'positive' | 'negative';
  }>;
  timestamp: number;
}

interface ROIAttribution {
  source: string;
  leads_generated: number;
  pipeline_value: number;
  closed_deals: number;
  revenue: number;
  cost: number;
  roi: number;
  conversion_rate: number;
}

export function PredictiveAnalytics() {
  const [models] = useState<PredictiveModel[]>([
    {
      id: 'lead-scoring-v2',
      name: 'Advanced Lead Scoring',
      type: 'lead_scoring',
      accuracy: 0.89,
      last_trained: '2024-01-15',
      predictions_made: 12456,
      features: ['Company Size', 'Tech Stack', 'Funding Stage', 'Hiring Velocity', 'Website Traffic'],
      status: 'active'
    },
    {
      id: 'conversion-predictor',
      name: 'Conversion Probability',
      type: 'conversion_prediction',
      accuracy: 0.82,
      last_trained: '2024-01-14',
      predictions_made: 8934,
      features: ['Lead Score', 'Contact Quality', 'Response Time', 'Engagement Level', 'Industry Match'],
      status: 'active'
    },
    {
      id: 'revenue-forecast',
      name: 'Revenue Forecasting',
      type: 'revenue_forecast',
      accuracy: 0.76,
      last_trained: '2024-01-13',
      predictions_made: 2341,
      features: ['Pipeline Value', 'Deal Stage', 'Historical Close Rate', 'Sales Cycle Length'],
      status: 'training'
    },
    {
      id: 'churn-detector',
      name: 'Customer Churn Prediction',
      type: 'churn_prediction',
      accuracy: 0.91,
      last_trained: '2024-01-12',
      predictions_made: 5678,
      features: ['Usage Patterns', 'Support Tickets', 'Payment History', 'Feature Adoption'],
      status: 'active'
    }
  ]);

  const [predictions] = useState<PredictionResult[]>([
    {
      id: 'pred-1',
      model: 'Advanced Lead Scoring',
      company: 'TechFlow Solutions',
      prediction: 0.92,
      confidence: 0.87,
      factors: [
        { factor: 'Recent Funding', impact: 0.25, direction: 'positive' },
        { factor: 'Hiring Velocity', impact: 0.20, direction: 'positive' },
        { factor: 'Tech Stack Match', impact: 0.18, direction: 'positive' },
        { factor: 'Company Size', impact: 0.15, direction: 'positive' }
      ],
      timestamp: Date.now() - 300000
    },
    {
      id: 'pred-2',
      model: 'Conversion Probability',
      company: 'DataStream Analytics',
      prediction: 0.78,
      confidence: 0.82,
      factors: [
        { factor: 'Contact Quality', impact: 0.30, direction: 'positive' },
        { factor: 'Industry Match', impact: 0.25, direction: 'positive' },
        { factor: 'Response Time', impact: -0.15, direction: 'negative' }
      ],
      timestamp: Date.now() - 600000
    },
    {
      id: 'pred-3',
      model: 'Advanced Lead Scoring',
      company: 'CloudScale Technologies',
      prediction: 0.95,
      confidence: 0.91,
      factors: [
        { factor: 'Large Funding Round', impact: 0.35, direction: 'positive' },
        { factor: 'Enterprise Focus', impact: 0.28, direction: 'positive' },
        { factor: 'Executive Team', impact: 0.22, direction: 'positive' }
      ],
      timestamp: Date.now() - 900000
    }
  ]);

  const [roiData] = useState<ROIAttribution[]>([
    {
      source: 'Exa AI Discovery',
      leads_generated: 1247,
      pipeline_value: 3400000,
      closed_deals: 89,
      revenue: 1200000,
      cost: 15600,
      roi: 76.9,
      conversion_rate: 0.28
    },
    {
      source: 'Phind Signals',
      leads_generated: 892,
      pipeline_value: 2100000,
      closed_deals: 56,
      revenue: 780000,
      cost: 22400,
      roi: 34.8,
      conversion_rate: 0.21
    },
    {
      source: 'Perplexity Contacts',
      leads_generated: 634,
      pipeline_value: 1800000,
      closed_deals: 67,
      revenue: 920000,
      cost: 31200,
      roi: 29.5,
      conversion_rate: 0.35
    },
    {
      source: 'Manual Upload',
      leads_generated: 456,
      pipeline_value: 890000,
      closed_deals: 23,
      revenue: 340000,
      cost: 8900,
      roi: 38.2,
      conversion_rate: 0.15
    },
    {
      source: 'Workflow Automation',
      leads_generated: 2134,
      pipeline_value: 5600000,
      closed_deals: 145,
      revenue: 2100000,
      cost: 45600,
      roi: 46.1,
      conversion_rate: 0.32
    }
  ]);

  const [selectedModel, setSelectedModel] = useState<PredictiveModel | null>(null);

  const getModelStatusColor = (status: PredictiveModel['status']) => {
    switch (status) {
      case 'active': return 'text-emerald-600 bg-emerald-100';
      case 'training': return 'text-blue-600 bg-blue-100';
      case 'inactive': return 'text-slate-600 bg-slate-100';
    }
  };

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 0.85) return 'text-emerald-600';
    if (accuracy >= 0.75) return 'text-blue-600';
    if (accuracy >= 0.65) return 'text-amber-600';
    return 'text-red-600';
  };

  const getModelIcon = (type: PredictiveModel['type']) => {
    switch (type) {
      case 'lead_scoring': return <Target className="h-4 w-4" />;
      case 'conversion_prediction': return <TrendingUp className="h-4 w-4" />;
      case 'revenue_forecast': return <DollarSign className="h-4 w-4" />;
      case 'churn_prediction': return <Users className="h-4 w-4" />;
    }
  };

  const totalPipelineValue = roiData.reduce((sum, item) => sum + item.pipeline_value, 0);
  const totalRevenue = roiData.reduce((sum, item) => sum + item.revenue, 0);
  const totalCost = roiData.reduce((sum, item) => sum + item.cost, 0);
  const overallROI = ((totalRevenue - totalCost) / totalCost) * 100;

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <Brain className="h-6 w-6 text-blue-600" />
        <h2 className="text-2xl font-bold text-slate-900">Predictive Analytics & Performance Attribution</h2>
        <InfoModal
          title="Advanced Predictive Analytics"
          description="Machine learning-powered insights for lead scoring, conversion prediction, and ROI optimization with real-time performance attribution."
          features={[
            "Advanced ML models for lead scoring and conversion prediction",
            "Revenue forecasting with confidence intervals",
            "Multi-source ROI attribution and cost optimization",
            "Predictive churn analysis and retention insights",
            "Real-time model performance monitoring and retraining"
          ]}
          businessValue="Predictive analytics improve lead quality by 45%, increase conversion rates by 30%, and optimize marketing spend with 95% attribution accuracy."
        />
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <Brain className="h-5 w-5 text-purple-600" />
            <span className="font-medium text-slate-900">Active Models</span>
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {models.filter(m => m.status === 'active').length}
          </div>
          <div className="text-sm text-slate-600">89% avg accuracy</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <Target className="h-5 w-5 text-emerald-600" />
            <span className="font-medium text-slate-900">Predictions Today</span>
          </div>
          <div className="text-2xl font-bold text-slate-900">1,247</div>
          <div className="text-sm text-emerald-600">+18% from yesterday</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <DollarSign className="h-5 w-5 text-blue-600" />
            <span className="font-medium text-slate-900">Overall ROI</span>
          </div>
          <div className="text-2xl font-bold text-slate-900">{overallROI.toFixed(1)}x</div>
          <div className="text-sm text-slate-600">${(totalRevenue / 1000000).toFixed(1)}M revenue</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="h-5 w-5 text-orange-600" />
            <span className="font-medium text-slate-900">Model Accuracy</span>
          </div>
          <div className="text-2xl font-bold text-slate-900">89%</div>
          <div className="text-sm text-slate-600">across all models</div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* ML Models */}
        <div className="xl:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <h3 className="font-semibold text-slate-900 mb-6">Machine Learning Models</h3>
            
            <div className="space-y-4">
              {models.map((model) => (
                <div
                  key={model.id}
                  onClick={() => setSelectedModel(model)}
                  className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        {getModelIcon(model.type)}
                      </div>
                      <div>
                        <h4 className="font-medium text-slate-900">{model.name}</h4>
                        <p className="text-sm text-slate-600 capitalize">{model.type.replace('_', ' ')}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className={`text-lg font-bold ${getAccuracyColor(model.accuracy)}`}>
                          {(model.accuracy * 100).toFixed(0)}%
                        </div>
                        <div className="text-xs text-slate-500">accuracy</div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getModelStatusColor(model.status)}`}>
                        {model.status}
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-slate-600">Predictions:</span>
                      <span className="font-medium text-slate-900 ml-1">{model.predictions_made.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-slate-600">Last Trained:</span>
                      <span className="font-medium text-slate-900 ml-1">{new Date(model.last_trained).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <span className="text-xs text-slate-600">Features: </span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {model.features.slice(0, 3).map((feature, i) => (
                        <span key={i} className="px-2 py-0.5 bg-slate-100 text-slate-700 text-xs rounded">
                          {feature}
                        </span>
                      ))}
                      {model.features.length > 3 && (
                        <span className="text-xs text-slate-500">+{model.features.length - 3} more</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Predictions */}
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <h3 className="font-semibold text-slate-900 mb-6">Recent Predictions</h3>
            
            <div className="space-y-4">
              {predictions.map((prediction) => (
                <div key={prediction.id} className="p-4 border border-slate-200 rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-medium text-slate-900">{prediction.company}</h4>
                      <p className="text-sm text-slate-600">{prediction.model}</p>
                    </div>
                    
                    <div className="text-right">
                      <div className={`text-lg font-bold ${getAccuracyColor(prediction.prediction)}`}>
                        {(prediction.prediction * 100).toFixed(0)}%
                      </div>
                      <div className="text-xs text-slate-500">
                        {(prediction.confidence * 100).toFixed(0)}% confidence
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h5 className="text-sm font-medium text-slate-700">Key Factors:</h5>
                    {prediction.factors.slice(0, 3).map((factor, i) => (
                      <div key={i} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          {factor.direction === 'positive' ? (
                            <ArrowUp className="h-3 w-3 text-emerald-600" />
                          ) : (
                            <ArrowDown className="h-3 w-3 text-red-600" />
                          )}
                          <span className="text-slate-700">{factor.factor}</span>
                        </div>
                        <span className={`font-medium ${
                          factor.direction === 'positive' ? 'text-emerald-600' : 'text-red-600'
                        }`}>
                          {factor.direction === 'positive' ? '+' : ''}{(factor.impact * 100).toFixed(0)}%
                        </span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="text-xs text-slate-500 mt-2">
                    {new Date(prediction.timestamp).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ROI Attribution */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <h3 className="font-semibold text-slate-900 mb-6">ROI Attribution by Source</h3>
            
            <div className="space-y-4">
              {roiData.map((source, index) => (
                <div key={index} className="p-4 border border-slate-200 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-slate-900">{source.source}</h4>
                    <div className={`text-lg font-bold ${
                      source.roi >= 40 ? 'text-emerald-600' : 
                      source.roi >= 20 ? 'text-blue-600' : 'text-amber-600'
                    }`}>
                      {source.roi.toFixed(1)}x
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                    <div>
                      <span className="text-slate-600">Leads:</span>
                      <span className="font-medium text-slate-900 ml-1">{source.leads_generated}</span>
                    </div>
                    <div>
                      <span className="text-slate-600">Revenue:</span>
                      <span className="font-medium text-slate-900 ml-1">${(source.revenue / 1000).toFixed(0)}K</span>
                    </div>
                    <div>
                      <span className="text-slate-600">Pipeline:</span>
                      <span className="font-medium text-slate-900 ml-1">${(source.pipeline_value / 1000).toFixed(0)}K</span>
                    </div>
                    <div>
                      <span className="text-slate-600">Conv Rate:</span>
                      <span className="font-medium text-slate-900 ml-1">{(source.conversion_rate * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                  
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-emerald-500 h-2 rounded-full"
                      style={{ width: `${Math.min((source.roi / 80) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Performance Insights */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-6">
            <h3 className="font-semibold text-slate-900 mb-4">AI Insights</h3>
            
            <div className="space-y-3">
              <div className="p-3 bg-white border border-purple-200 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Activity className="h-4 w-4 text-purple-600" />
                  <span className="font-medium text-purple-900 text-sm">Optimization Opportunity</span>
                </div>
                <p className="text-sm text-purple-800">
                  Exa AI Discovery shows highest ROI (76.9x). Consider increasing budget allocation by 25%.
                </p>
              </div>
              
              <div className="p-3 bg-white border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                  <span className="font-medium text-blue-900 text-sm">Trend Alert</span>
                </div>
                <p className="text-sm text-blue-800">
                  Conversion rates up 18% this week. Lead scoring model accuracy improved to 92%.
                </p>
              </div>
              
              <div className="p-3 bg-white border border-emerald-200 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Target className="h-4 w-4 text-emerald-600" />
                  <span className="font-medium text-emerald-900 text-sm">Model Recommendation</span>
                </div>
                <p className="text-sm text-emerald-800">
                  Revenue forecast model ready for retraining with 156 new data points.
                </p>
              </div>
            </div>
          </div>

          {/* Pipeline Forecast */}
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <h3 className="font-semibold text-slate-900 mb-4">Pipeline Forecast</h3>
            
            <div className="space-y-4">
              <div className="text-center p-4 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-slate-900 mb-1">
                  ${(totalPipelineValue / 1000000).toFixed(1)}M
                </div>
                <div className="text-sm text-slate-600">Current Pipeline Value</div>
              </div>
              
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="p-3 bg-slate-50 rounded text-center">
                  <div className="font-bold text-emerald-600">73%</div>
                  <div className="text-slate-600">Close Probability</div>
                </div>
                <div className="p-3 bg-slate-50 rounded text-center">
                  <div className="font-bold text-blue-600">23 days</div>
                  <div className="text-slate-600">Avg Sales Cycle</div>
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-lg font-bold text-purple-600">
                  ${((totalPipelineValue * 0.73) / 1000000).toFixed(1)}M
                </div>
                <div className="text-sm text-slate-600">Forecasted Revenue</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Model Detail Modal */}
      {selectedModel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    {getModelIcon(selectedModel.type)}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">{selectedModel.name}</h2>
                    <p className="text-slate-600 capitalize">{selectedModel.type.replace('_', ' ')}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getModelStatusColor(selectedModel.status)}`}>
                        {selectedModel.status}
                      </span>
                      <span className="text-sm text-slate-600">
                        {selectedModel.predictions_made.toLocaleString()} predictions
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedModel(null)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <div className="space-y-6">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-emerald-50 rounded-lg">
                    <div className={`text-2xl font-bold ${getAccuracyColor(selectedModel.accuracy)}`}>
                      {(selectedModel.accuracy * 100).toFixed(0)}%
                    </div>
                    <div className="text-sm text-slate-600">Accuracy</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {selectedModel.predictions_made.toLocaleString()}
                    </div>
                    <div className="text-sm text-slate-600">Predictions</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {selectedModel.features.length}
                    </div>
                    <div className="text-sm text-slate-600">Features</div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-slate-900 mb-3">Model Features</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedModel.features.map((feature, i) => (
                      <div key={i} className="p-2 bg-slate-50 rounded text-sm">
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-slate-900 mb-3">Training Information</h3>
                  <div className="bg-slate-50 rounded-lg p-4 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Last Trained:</span>
                      <span className="font-medium">{new Date(selectedModel.last_trained).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Model Type:</span>
                      <span className="font-medium capitalize">{selectedModel.type.replace('_', ' ')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Status:</span>
                      <span className={`font-medium capitalize ${
                        selectedModel.status === 'active' ? 'text-emerald-600' :
                        selectedModel.status === 'training' ? 'text-blue-600' : 'text-slate-600'
                      }`}>
                        {selectedModel.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Retrain Model
                  </button>
                  <button className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
                    Export Results
                  </button>
                  <button className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors">
                    View Logs
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