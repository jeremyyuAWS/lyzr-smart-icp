import React, { useState } from 'react';
import { Eye, TrendingUp, Target, Users, DollarSign, Building, AlertTriangle, CheckCircle, ArrowUp, ArrowDown, Filter, Calendar, BarChart3 } from 'lucide-react';
import { InfoModal } from './InfoModal';
import { Switch } from './ui/switch';

interface Competitor {
  id: string;
  name: string;
  domain: string;
  industry: string;
  last_funding: {
    round: string;
    amount: number;
    date: string;
  };
  employee_count: number;
  monitoring_since: string;
  threat_level: 'low' | 'medium' | 'high' | 'critical';
  market_overlap: number;
  recent_activities: CompetitorActivity[];
}

interface CompetitorActivity {
  id: string;
  type: 'funding' | 'hiring' | 'product_launch' | 'partnership' | 'acquisition' | 'executive_change';
  title: string;
  description: string;
  date: string;
  impact_score: number;
  source: string;
}

interface MarketTrend {
  id: string;
  category: string;
  trend: string;
  direction: 'up' | 'down' | 'stable';
  impact: 'low' | 'medium' | 'high';
  confidence: number;
  description: string;
  data_points: Array<{
    date: string;
    value: number;
    metric: string;
  }>;
}

interface WinLossRecord {
  id: string;
  deal_id: string;
  company: string;
  outcome: 'won' | 'lost';
  deal_value: number;
  competitor?: string;
  decision_factors: string[];
  sales_rep: string;
  close_date: string;
  notes: string;
}

export function CompetitiveIntelligence() {
  const [competitors] = useState<Competitor[]>([
    {
      id: 'comp-1',
      name: 'LeadFlow Pro',
      domain: 'leadflowpro.com',
      industry: 'Sales Intelligence',
      last_funding: {
        round: 'Series B',
        amount: 35000000,
        date: '2024-01-10'
      },
      employee_count: 245,
      monitoring_since: '2023-06-15',
      threat_level: 'high',
      market_overlap: 0.78,
      recent_activities: [
        {
          id: 'act-1',
          type: 'funding',
          title: 'Series B Funding - $35M',
          description: 'Raised $35M to expand AI capabilities and enter European markets',
          date: '2024-01-10',
          impact_score: 0.85,
          source: 'TechCrunch'
        },
        {
          id: 'act-2',
          type: 'product_launch',
          title: 'AI Email Composer Launch',
          description: 'Released new AI-powered email composition tool',
          date: '2024-01-05',
          impact_score: 0.72,
          source: 'Product Hunt'
        },
        {
          id: 'act-3',
          type: 'hiring',
          title: 'Hiring 15 Engineers',
          description: 'Major engineering team expansion focusing on ML/AI',
          date: '2023-12-28',
          impact_score: 0.68,
          source: 'LinkedIn'
        }
      ]
    },
    {
      id: 'comp-2',
      name: 'ProspectAI',
      domain: 'prospectai.io',
      industry: 'Lead Generation',
      last_funding: {
        round: 'Series A',
        amount: 18000000,
        date: '2023-11-22'
      },
      employee_count: 89,
      monitoring_since: '2023-08-01',
      threat_level: 'medium',
      market_overlap: 0.65,
      recent_activities: [
        {
          id: 'act-4',
          type: 'partnership',
          title: 'Salesforce Integration',
          description: 'Announced native Salesforce integration and app listing',
          date: '2024-01-12',
          impact_score: 0.79,
          source: 'Salesforce AppExchange'
        },
        {
          id: 'act-5',
          type: 'executive_change',
          title: 'New VP of Sales',
          description: 'Hired former HubSpot VP Sarah Williams as VP of Sales',
          date: '2024-01-08',
          impact_score: 0.64,
          source: 'LinkedIn'
        }
      ]
    },
    {
      id: 'comp-3',
      name: 'DataHunt Solutions',
      domain: 'datahunt.solutions',
      industry: 'Data Intelligence',
      last_funding: {
        round: 'Seed',
        amount: 7500000,
        date: '2023-09-15'
      },
      employee_count: 34,
      monitoring_since: '2023-09-20',
      threat_level: 'low',
      market_overlap: 0.42,
      recent_activities: [
        {
          id: 'act-6',
          type: 'product_launch',
          title: 'Chrome Extension Beta',
          description: 'Released Chrome extension for prospect research',
          date: '2024-01-14',
          impact_score: 0.45,
          source: 'Chrome Web Store'
        }
      ]
    }
  ]);

  const [marketTrends] = useState<MarketTrend[]>([
    {
      id: 'trend-1',
      category: 'AI Adoption',
      trend: 'AI-Powered Sales Tools',
      direction: 'up',
      impact: 'high',
      confidence: 0.89,
      description: 'Rapid adoption of AI-powered sales intelligence and automation tools',
      data_points: [
        { date: '2024-01-01', value: 23, metric: 'Market Penetration %' },
        { date: '2024-01-15', value: 31, metric: 'Market Penetration %' }
      ]
    },
    {
      id: 'trend-2',
      category: 'Integration Demand',
      trend: 'Native CRM Integrations',
      direction: 'up',
      impact: 'medium',
      confidence: 0.76,
      description: 'Increasing demand for native CRM integrations over API-based solutions',
      data_points: [
        { date: '2024-01-01', value: 67, metric: 'Customer Requests %' },
        { date: '2024-01-15', value: 74, metric: 'Customer Requests %' }
      ]
    },
    {
      id: 'trend-3',
      category: 'Privacy & Compliance',
      trend: 'Data Privacy Focus',
      direction: 'up',
      impact: 'medium',
      confidence: 0.82,
      description: 'Increased focus on data privacy and GDPR compliance in B2B tools',
      data_points: [
        { date: '2024-01-01', value: 45, metric: 'Compliance Mentions %' },
        { date: '2024-01-15', value: 52, metric: 'Compliance Mentions %' }
      ]
    }
  ]);

  const [winLossRecords] = useState<WinLossRecord[]>([
    {
      id: 'wl-1',
      deal_id: 'DEAL-2024-001',
      company: 'TechFlow Solutions',
      outcome: 'won',
      deal_value: 45000,
      competitor: 'LeadFlow Pro',
      decision_factors: ['Better AI accuracy', 'Superior customer support', 'More affordable pricing'],
      sales_rep: 'Sarah Chen',
      close_date: '2024-01-12',
      notes: 'Customer was impressed with our real-time alerts and workflow automation'
    },
    {
      id: 'wl-2',
      deal_id: 'DEAL-2024-002',
      company: 'DataStream Analytics',
      outcome: 'lost',
      deal_value: 78000,
      competitor: 'ProspectAI',
      decision_factors: ['Existing Salesforce investment', 'Change management concerns', 'Timeline pressure'],
      sales_rep: 'Mike Rodriguez',
      close_date: '2024-01-08',
      notes: 'Lost due to existing Salesforce ecosystem and integration requirements'
    },
    {
      id: 'wl-3',
      deal_id: 'DEAL-2024-003',
      company: 'CloudScale Technologies',
      outcome: 'won',
      deal_value: 125000,
      decision_factors: ['Advanced analytics', 'Predictive capabilities', 'ROI demonstration'],
      sales_rep: 'Emily Watson',
      close_date: '2024-01-05',
      notes: 'Enterprise features and predictive analytics were key differentiators'
    }
  ]);

  const [selectedCompetitor, setSelectedCompetitor] = useState<Competitor | null>(null);
  const [activeTab, setActiveTab] = useState<'competitors' | 'trends' | 'winloss' | 'battlecards'>('competitors');

  const getThreatLevelColor = (level: Competitor['threat_level']) => {
    switch (level) {
      case 'critical': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-amber-600 bg-amber-100';
      case 'low': return 'text-emerald-600 bg-emerald-100';
    }
  };

  const getActivityIcon = (type: CompetitorActivity['type']) => {
    switch (type) {
      case 'funding': return <DollarSign className="h-4 w-4 text-emerald-600" />;
      case 'hiring': return <Users className="h-4 w-4 text-blue-600" />;
      case 'product_launch': return <Target className="h-4 w-4 text-purple-600" />;
      case 'partnership': return <Building className="h-4 w-4 text-indigo-600" />;
      case 'acquisition': return <TrendingUp className="h-4 w-4 text-orange-600" />;
      case 'executive_change': return <Users className="h-4 w-4 text-pink-600" />;
    }
  };

  const getTrendIcon = (direction: MarketTrend['direction']) => {
    switch (direction) {
      case 'up': return <ArrowUp className="h-4 w-4 text-emerald-600" />;
      case 'down': return <ArrowDown className="h-4 w-4 text-red-600" />;
      case 'stable': return <div className="w-4 h-1 bg-slate-400 rounded" />;
    }
  };

  const battlecards = [
    {
      competitor: 'LeadFlow Pro',
      strengths: ['Strong brand recognition', 'Extensive feature set', 'Large customer base'],
      weaknesses: ['Higher pricing', 'Complex setup', 'Limited AI accuracy'],
      differentiators: ['Real-time alerts', 'Better AI models', 'Simpler onboarding'],
      pricing: '$299/month per user',
      target_customers: 'Enterprise sales teams',
      common_objections: ['Price sensitivity', 'Feature complexity', 'Integration concerns']
    },
    {
      competitor: 'ProspectAI',
      strengths: ['Salesforce native', 'Good UI/UX', 'Strong partnerships'],
      weaknesses: ['Limited data sources', 'No real-time features', 'Basic analytics'],
      differentiators: ['Multi-source intelligence', 'Predictive analytics', 'Workflow automation'],
      pricing: '$199/month per user',
      target_customers: 'Mid-market sales teams',
      common_objections: ['Salesforce dependency', 'Data accuracy', 'Limited customization']
    }
  ];

  const winRate = winLossRecords.filter(record => record.outcome === 'won').length / winLossRecords.length * 100;
  const avgDealValue = winLossRecords.reduce((sum, record) => sum + record.deal_value, 0) / winLossRecords.length;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Eye className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-slate-900">Competitive Intelligence</h2>
          <InfoModal
            title="Advanced Competitive Intelligence"
            description="Monitor competitors, track market trends, and analyze win/loss patterns to maintain competitive advantage and optimize sales strategies."
            features={[
              "Real-time competitor monitoring with funding and product alerts",
              "Market trend analysis with AI-powered insights and predictions",
              "Win/loss analysis with decision factor tracking and battlecard updates",
              "Automated competitive research and intelligence gathering",
              "Strategic recommendations based on competitive landscape changes"
            ]}
            businessValue="Competitive intelligence increases win rates by 23% and improves deal velocity by 18% through better positioning and strategic sales approaches."
          />
        </div>

        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Eye className="h-4 w-4 inline mr-2" />
            Add Competitor
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-slate-200">
        <nav className="flex space-x-8">
          {[
            { id: 'competitors', name: 'Competitor Monitoring', icon: Eye },
            { id: 'trends', name: 'Market Trends', icon: TrendingUp },
            { id: 'winloss', name: 'Win/Loss Analysis', icon: BarChart3 },
            { id: 'battlecards', name: 'Battle Cards', icon: Target }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Competitors Tab */}
      {activeTab === 'competitors' && (
        <div className="space-y-6">
          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <Eye className="h-5 w-5 text-blue-600" />
                <span className="font-medium text-slate-900">Monitored Competitors</span>
              </div>
              <div className="text-2xl font-bold text-slate-900">{competitors.length}</div>
              <div className="text-sm text-slate-600">across 3 categories</div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
                <span className="font-medium text-slate-900">High Threat</span>
              </div>
              <div className="text-2xl font-bold text-slate-900">
                {competitors.filter(c => c.threat_level === 'high' || c.threat_level === 'critical').length}
              </div>
              <div className="text-sm text-slate-600">require attention</div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="h-5 w-5 text-emerald-600" />
                <span className="font-medium text-slate-900">Avg Market Overlap</span>
              </div>
              <div className="text-2xl font-bold text-slate-900">
                {(competitors.reduce((sum, c) => sum + c.market_overlap, 0) / competitors.length * 100).toFixed(0)}%
              </div>
              <div className="text-sm text-slate-600">market similarity</div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <Building className="h-5 w-5 text-purple-600" />
                <span className="font-medium text-slate-900">Recent Activities</span>
              </div>
              <div className="text-2xl font-bold text-slate-900">
                {competitors.reduce((sum, c) => sum + c.recent_activities.length, 0)}
              </div>
              <div className="text-sm text-slate-600">this month</div>
            </div>
          </div>

          {/* Competitors List */}
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <h3 className="font-semibold text-slate-900 mb-6">Competitor Overview</h3>
            
            <div className="space-y-4">
              {competitors.map((competitor) => (
                <div
                  key={competitor.id}
                  onClick={() => setSelectedCompetitor(competitor)}
                  className="p-6 border border-slate-200 rounded-xl hover:shadow-md cursor-pointer transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-600 rounded-lg flex items-center justify-center">
                        <Eye className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h4 className="font-semibold text-slate-900 text-lg">{competitor.name}</h4>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getThreatLevelColor(competitor.threat_level)}`}>
                            {competitor.threat_level} threat
                          </span>
                        </div>
                        <p className="text-slate-600">{competitor.domain} • {competitor.industry}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                          <span>{competitor.employee_count} employees</span>
                          <span>{competitor.last_funding.round}: ${(competitor.last_funding.amount / 1000000).toFixed(0)}M</span>
                          <span>{(competitor.market_overlap * 100).toFixed(0)}% overlap</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-sm text-slate-600 mb-1">Recent Activities</div>
                      <div className="text-lg font-bold text-slate-900">{competitor.recent_activities.length}</div>
                    </div>
                  </div>

                  {/* Recent Activities Preview */}
                  <div className="space-y-2">
                    {competitor.recent_activities.slice(0, 2).map((activity) => (
                      <div key={activity.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                        {getActivityIcon(activity.type)}
                        <div className="flex-1">
                          <h5 className="font-medium text-slate-900 text-sm">{activity.title}</h5>
                          <p className="text-xs text-slate-600">{activity.description}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-slate-500">{new Date(activity.date).toLocaleDateString()}</div>
                          <div className={`text-xs font-medium ${
                            activity.impact_score >= 0.8 ? 'text-red-600' :
                            activity.impact_score >= 0.6 ? 'text-amber-600' : 'text-emerald-600'
                          }`}>
                            {(activity.impact_score * 100).toFixed(0)}% impact
                          </div>
                        </div>
                      </div>
                    ))}
                    {competitor.recent_activities.length > 2 && (
                      <div className="text-xs text-slate-500 text-center">
                        +{competitor.recent_activities.length - 2} more activities
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Market Trends Tab */}
      {activeTab === 'trends' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <h3 className="font-semibold text-slate-900 mb-6">Market Trend Analysis</h3>
            
            <div className="space-y-4">
              {marketTrends.map((trend) => (
                <div key={trend.id} className="p-6 border border-slate-200 rounded-xl">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        {getTrendIcon(trend.direction)}
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h4 className="font-semibold text-slate-900">{trend.trend}</h4>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            trend.impact === 'high' ? 'bg-red-100 text-red-800' :
                            trend.impact === 'medium' ? 'bg-amber-100 text-amber-800' :
                            'bg-emerald-100 text-emerald-800'
                          }`}>
                            {trend.impact} impact
                          </span>
                        </div>
                        <p className="text-slate-600 text-sm">{trend.category}</p>
                        <p className="text-slate-700 mt-2">{trend.description}</p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-sm text-slate-600 mb-1">Confidence</div>
                      <div className="text-lg font-bold text-emerald-600">
                        {(trend.confidence * 100).toFixed(0)}%
                      </div>
                    </div>
                  </div>

                  {/* Trend Data Points */}
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    {trend.data_points.map((point, i) => (
                      <div key={i} className="p-3 bg-slate-50 rounded-lg text-center">
                        <div className="text-lg font-bold text-slate-900">{point.value}%</div>
                        <div className="text-xs text-slate-600">{point.metric}</div>
                        <div className="text-xs text-slate-500">{new Date(point.date).toLocaleDateString()}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Win/Loss Analysis Tab */}
      {activeTab === 'winloss' && (
        <div className="space-y-6">
          {/* Win/Loss Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle className="h-5 w-5 text-emerald-600" />
                <span className="font-medium text-slate-900">Win Rate</span>
              </div>
              <div className="text-2xl font-bold text-emerald-600">{winRate.toFixed(0)}%</div>
              <div className="text-sm text-slate-600">this quarter</div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <DollarSign className="h-5 w-5 text-blue-600" />
                <span className="font-medium text-slate-900">Avg Deal Value</span>
              </div>
              <div className="text-2xl font-bold text-slate-900">${(avgDealValue / 1000).toFixed(0)}K</div>
              <div className="text-sm text-slate-600">per closed deal</div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <Target className="h-5 w-5 text-purple-600" />
                <span className="font-medium text-slate-900">Total Deals</span>
              </div>
              <div className="text-2xl font-bold text-slate-900">{winLossRecords.length}</div>
              <div className="text-sm text-slate-600">analyzed</div>
            </div>
          </div>

          {/* Win/Loss Records */}
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <h3 className="font-semibold text-slate-900 mb-6">Deal Analysis</h3>
            
            <div className="space-y-4">
              {winLossRecords.map((record) => (
                <div key={record.id} className="p-4 border border-slate-200 rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h4 className="font-medium text-slate-900">{record.company}</h4>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          record.outcome === 'won' 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {record.outcome.toUpperCase()}
                        </span>
                        {record.competitor && (
                          <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-xs rounded">
                            vs {record.competitor}
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-slate-600">
                        {record.sales_rep} • {new Date(record.close_date).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-lg font-bold text-slate-900">
                        ${(record.deal_value / 1000).toFixed(0)}K
                      </div>
                      <div className="text-xs text-slate-500">Deal Value</div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <h5 className="text-sm font-medium text-slate-700 mb-2">Decision Factors:</h5>
                    <div className="flex flex-wrap gap-2">
                      {record.decision_factors.map((factor, i) => (
                        <span key={i} className={`px-2 py-1 text-xs rounded ${
                          record.outcome === 'won'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-red-50 text-red-700 border border-red-200'
                        }`}>
                          {factor}
                        </span>
                      ))}
                    </div>
                  </div>

                  {record.notes && (
                    <div className="p-3 bg-slate-50 rounded-lg">
                      <span className="text-sm font-medium text-slate-700">Notes: </span>
                      <span className="text-sm text-slate-600">{record.notes}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Battle Cards Tab */}
      {activeTab === 'battlecards' && (
        <div className="space-y-6">
          <div className="grid gap-6">
            {battlecards.map((card, index) => (
              <div key={index} className="bg-white border border-slate-200 rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-semibold text-slate-900 text-lg">vs {card.competitor}</h3>
                  <div className="flex gap-2">
                    <button className="px-3 py-1.5 text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 rounded transition-colors">
                      Edit
                    </button>
                    <button className="px-3 py-1.5 text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 rounded transition-colors">
                      Export
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-slate-900 mb-2 flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-emerald-600" />
                        Their Strengths
                      </h4>
                      <ul className="space-y-1">
                        {card.strengths.map((strength, i) => (
                          <li key={i} className="text-sm text-slate-700 flex items-start gap-2">
                            <div className="w-1.5 h-1.5 bg-slate-400 rounded-full mt-2 flex-shrink-0" />
                            {strength}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-medium text-slate-900 mb-2 flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                        Their Weaknesses
                      </h4>
                      <ul className="space-y-1">
                        {card.weaknesses.map((weakness, i) => (
                          <li key={i} className="text-sm text-slate-700 flex items-start gap-2">
                            <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                            {weakness}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-medium text-slate-900 mb-2 flex items-center gap-2">
                        <Target className="h-4 w-4 text-blue-600" />
                        Our Differentiators
                      </h4>
                      <ul className="space-y-1">
                        {card.differentiators.map((diff, i) => (
                          <li key={i} className="text-sm text-slate-700 flex items-start gap-2">
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                            {diff}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 bg-slate-50 rounded-lg">
                      <h4 className="font-medium text-slate-900 mb-2">Competitive Info</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-600">Pricing:</span>
                          <span className="font-medium text-slate-900">{card.pricing}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Target:</span>
                          <span className="font-medium text-slate-900">{card.target_customers}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-slate-900 mb-2">Common Objections</h4>
                      <ul className="space-y-1">
                        {card.common_objections.map((objection, i) => (
                          <li key={i} className="text-sm text-slate-700 flex items-start gap-2">
                            <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 flex-shrink-0" />
                            {objection}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Competitor Detail Modal */}
      {selectedCompetitor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">{selectedCompetitor.name}</h2>
                  <p className="text-slate-600">{selectedCompetitor.domain}</p>
                </div>
                <button
                  onClick={() => setSelectedCompetitor(null)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <h3 className="font-medium text-slate-900 mb-2">Company Info</h3>
                    <div className="space-y-1 text-sm">
                      <div>Industry: {selectedCompetitor.industry}</div>
                      <div>Employees: {selectedCompetitor.employee_count}</div>
                      <div>Monitoring since: {new Date(selectedCompetitor.monitoring_since).toLocaleDateString()}</div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <h3 className="font-medium text-slate-900 mb-2">Latest Funding</h3>
                    <div className="space-y-1 text-sm">
                      <div>Round: {selectedCompetitor.last_funding.round}</div>
                      <div>Amount: ${(selectedCompetitor.last_funding.amount / 1000000).toFixed(0)}M</div>
                      <div>Date: {new Date(selectedCompetitor.last_funding.date).toLocaleDateString()}</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-slate-900 mb-4">Recent Activities</h3>
                  <div className="space-y-3">
                    {selectedCompetitor.recent_activities.map((activity) => (
                      <div key={activity.id} className="p-4 border border-slate-200 rounded-lg">
                        <div className="flex items-start gap-3">
                          {getActivityIcon(activity.type)}
                          <div className="flex-1">
                            <h4 className="font-medium text-slate-900">{activity.title}</h4>
                            <p className="text-sm text-slate-600 mt-1">{activity.description}</p>
                            <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                              <span>{new Date(activity.date).toLocaleDateString()}</span>
                              <span>•</span>
                              <span>{activity.source}</span>
                              <span>•</span>
                              <span className={`font-medium ${
                                activity.impact_score >= 0.8 ? 'text-red-600' :
                                activity.impact_score >= 0.6 ? 'text-amber-600' : 'text-emerald-600'
                              }`}>
                                {(activity.impact_score * 100).toFixed(0)}% impact
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
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