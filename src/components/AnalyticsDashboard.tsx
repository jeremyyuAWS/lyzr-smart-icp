import React, { useState } from 'react';
import { BarChart3, TrendingUp, Users, Target, DollarSign, Clock, Zap, Award, ArrowUp, ArrowDown, Filter, Calendar, Download } from 'lucide-react';
import { InfoModal } from './InfoModal';
import pipelineAnalytics from '../data/pipeline_analytics.json';

export function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedWorkflow, setSelectedWorkflow] = useState('all');

  const { analytics } = pipelineAnalytics;

  const getMetricTrend = (current: number, previous: number) => {
    const change = ((current - previous) / previous) * 100;
    return {
      value: Math.abs(change).toFixed(1),
      isPositive: change > 0,
      icon: change > 0 ? ArrowUp : ArrowDown,
      color: change > 0 ? 'text-emerald-600' : 'text-red-600',
      bgColor: change > 0 ? 'bg-emerald-50' : 'bg-red-50'
    };
  };

  const kpiCards = [
    {
      title: 'Total Leads Generated',
      value: analytics.overview.total_leads_generated.toLocaleString(),
      trend: getMetricTrend(15624, 12890),
      icon: Users,
      color: 'blue'
    },
    {
      title: 'Conversion Rate',
      value: `${(analytics.overview.avg_conversion_rate * 100).toFixed(1)}%`,
      trend: getMetricTrend(23, 18.5),
      icon: Target,
      color: 'emerald'
    },
    {
      title: 'Pipeline Velocity',
      value: analytics.overview.avg_pipeline_velocity,
      trend: getMetricTrend(14.2, 16.8),
      icon: Clock,
      color: 'purple'
    },
    {
      title: 'Workflow Success Rate',
      value: '87%',
      trend: getMetricTrend(87, 82),
      icon: Award,
      color: 'amber'
    }
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BarChart3 className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-slate-900">Analytics Dashboard</h2>
          <InfoModal
            title="Real-time Analytics Dashboard"
            description="Comprehensive performance analytics for your AI-powered lead generation workflows with executive-level insights and ROI tracking."
            features={[
              "Pipeline performance metrics and conversion tracking",
              "Agent performance analytics with accuracy scoring",
              "Revenue attribution and ROI analysis",
              "Workflow optimization recommendations",
              "Executive dashboards with strategic insights"
            ]}
            businessValue="Data-driven insights increase pipeline performance by 40% and help optimize AI agent configurations for maximum ROI and lead quality."
          />
        </div>
        
        <div className="flex items-center gap-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Download className="h-4 w-4" />
            Export Report
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {kpiCards.map((kpi, index) => (
          <div key={index} className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 bg-${kpi.color}-100 rounded-lg flex items-center justify-center`}>
                <kpi.icon className={`h-6 w-6 text-${kpi.color}-600`} />
              </div>
              <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${kpi.trend.bgColor} ${kpi.trend.color}`}>
                <kpi.trend.icon className="h-3 w-3" />
                {kpi.trend.value}%
              </div>
            </div>
            <div className="text-2xl font-bold text-slate-900 mb-1">{kpi.value}</div>
            <div className="text-sm text-slate-600">{kpi.title}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Workflow Performance */}
        <div className="xl:col-span-2 bg-white border border-slate-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-slate-900 text-lg">Workflow Performance</h3>
            <select
              value={selectedWorkflow}
              onChange={(e) => setSelectedWorkflow(e.target.value)}
              className="px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Workflows</option>
              {analytics.workflow_performance.map((workflow) => (
                <option key={workflow.workflow_id} value={workflow.workflow_id}>
                  {workflow.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="space-y-4">
            {analytics.workflow_performance.map((workflow, index) => (
              <div key={index} className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-medium text-slate-900">{workflow.name}</h4>
                    <p className="text-sm text-slate-600">{workflow.runs} runs • {workflow.leads_generated.toLocaleString()} leads</p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-emerald-600">{workflow.roi}x ROI</div>
                    <div className="text-xs text-slate-500">Return on Investment</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="text-slate-600">Success Rate</div>
                    <div className="font-medium text-slate-900">{(workflow.success_rate * 100).toFixed(0)}%</div>
                  </div>
                  <div>
                    <div className="text-slate-600">Avg Time</div>
                    <div className="font-medium text-slate-900">{workflow.avg_execution_time}</div>
                  </div>
                  <div>
                    <div className="text-slate-600">Conversion</div>
                    <div className="font-medium text-slate-900">{(workflow.conversion_rate * 100).toFixed(0)}%</div>
                  </div>
                  <div>
                    <div className="text-slate-600">Quality Score</div>
                    <div className="font-medium text-slate-900">
                      {workflow.success_rate >= 0.9 ? 'Excellent' : 
                       workflow.success_rate >= 0.8 ? 'Good' : 'Fair'}
                    </div>
                  </div>
                </div>
                
                <div className="mt-3">
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-emerald-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${workflow.success_rate * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Agent Performance */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <h3 className="font-semibold text-slate-900 text-lg mb-4">AI Agent Performance</h3>
            
            <div className="space-y-4">
              {analytics.agent_performance.map((agent, index) => (
                <div key={index} className="p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {agent.agent === 'Exa Discovery' && <img src="/images/Exa-logo-square.jpeg" alt="Exa" className="w-8 h-8 rounded-md object-cover" />}
                      {agent.agent === 'Phind Signals' && <img src="/images/Phind-logo-square.png" alt="Phind" className="w-8 h-8 rounded-md object-cover" />}
                      {agent.agent === 'Perplexity Contacts' && <img src="/images/Perplexity-logo-square.jpeg" alt="Perplexity" className="w-8 h-8 rounded-md object-cover" />}
                      <div>
                        <div className="font-medium text-slate-900 text-sm">{agent.agent}</div>
                        <div className="text-xs text-slate-500">{agent.companies_discovered || agent.signals_extracted || agent.contacts_found} processed</div>
                      </div>
                    </div>
                    <div className={`text-xs px-2 py-1 rounded-full font-medium ${
                      agent.success_rate >= 0.9 ? 'bg-emerald-100 text-emerald-700' :
                      agent.success_rate >= 0.8 ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {(agent.success_rate * 100).toFixed(0)}%
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 mb-3">
                    <div>
                      <span className="block">Response Time</span>
                      <span className="font-medium text-slate-900">{agent.avg_response_time}</span>
                    </div>
                    <div>
                      <span className="block">Accuracy</span>
                      <span className="font-medium text-slate-900">{(agent.accuracy_score * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                  
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                      style={{ width: `${agent.accuracy_score * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pipeline Velocity */}
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <h3 className="font-semibold text-slate-900 text-lg mb-4">Pipeline Velocity</h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Discovery → Contact</span>
                <span className="font-medium text-slate-900">{analytics.pipeline_velocity.avg_time_to_contact}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Contact → Qualified</span>
                <span className="font-medium text-slate-900">{analytics.pipeline_velocity.avg_time_to_qualify}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Qualified → Opportunity</span>
                <span className="font-medium text-slate-900">{analytics.pipeline_velocity.avg_time_to_opportunity}</span>
              </div>
              <div className="flex justify-between items-center border-t border-slate-200 pt-2">
                <span className="text-sm font-medium text-slate-900">Total Cycle Time</span>
                <span className="font-bold text-blue-600">{analytics.pipeline_velocity.avg_time_to_close}</span>
              </div>
            </div>
          </div>

          {/* CRM Sync Status */}
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <h3 className="font-semibold text-slate-900 text-lg mb-4">CRM Integration Status</h3>
            
            <div className="space-y-3">
              {Object.entries(analytics.crm_sync_stats).map(([crm, stats]) => (
                <div key={crm} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div>
                    <div className="font-medium text-slate-900 capitalize">{crm}</div>
                    <div className="text-xs text-slate-600">{stats.leads_synced} leads synced</div>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-medium ${
                      stats.success_rate >= 0.95 ? 'text-emerald-600' : 
                      stats.success_rate >= 0.9 ? 'text-blue-600' : 'text-amber-600'
                    }`}>
                      {(stats.success_rate * 100).toFixed(0)}%
                    </div>
                    <div className="text-xs text-slate-500">{stats.avg_sync_time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Lead Quality Distribution */}
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <h3 className="font-semibold text-slate-900 text-lg mb-6">Lead Quality Distribution</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          {Object.entries(analytics.lead_quality_metrics.score_distribution).map(([range, count]) => (
            <div key={range} className="text-center p-4 bg-slate-50 rounded-lg">
              <div className="text-2xl font-bold text-slate-900 mb-1">{count}</div>
              <div className="text-xs text-slate-600">{range}% Score</div>
              <div className={`text-xs font-medium mt-1 ${
                range === '90-100' ? 'text-emerald-600' :
                range === '80-89' ? 'text-blue-600' :
                range === '70-79' ? 'text-purple-600' :
                range === '60-69' ? 'text-amber-600' : 'text-red-600'
              }`}>
                {range === '90-100' ? 'Excellent' :
                 range === '80-89' ? 'High' :
                 range === '70-79' ? 'Good' :
                 range === '60-69' ? 'Fair' : 'Poor'}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 grid grid-cols-3 gap-6 pt-6 border-t border-slate-200">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{(analytics.lead_quality_metrics.avg_lead_score * 100).toFixed(0)}%</div>
            <div className="text-sm text-slate-600">Average Lead Score</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald-600">{(analytics.lead_quality_metrics.qualification_rate * 100).toFixed(0)}%</div>
            <div className="text-sm text-slate-600">Qualification Rate</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{(analytics.lead_quality_metrics.contact_accuracy * 100).toFixed(0)}%</div>
            <div className="text-sm text-slate-600">Contact Accuracy</div>
          </div>
        </div>
      </div>

      {/* Executive Summary */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6">
        <h3 className="font-semibold text-slate-900 text-lg mb-4">Executive Summary</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-slate-900 mb-3">Key Achievements</h4>
            <ul className="space-y-2 text-sm text-slate-700">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2 flex-shrink-0" />
                Generated {analytics.overview.total_leads_generated.toLocaleString()} qualified leads with 23% conversion rate
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2 flex-shrink-0" />
                Reduced pipeline velocity to {analytics.overview.avg_pipeline_velocity} (industry avg: 21 days)
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2 flex-shrink-0" />
                Achieved 87% workflow success rate with AI-powered automation
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2 flex-shrink-0" />
                Enterprise workflow delivers 7.8x ROI with 42% conversion rate
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-slate-900 mb-3">Optimization Opportunities</h4>
            <ul className="space-y-2 text-sm text-slate-700">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 flex-shrink-0" />
                Improve Perplexity agent response time (currently 3.4s)
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 flex-shrink-0" />
                Enhance contact accuracy from 83% to target 90%
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 flex-shrink-0" />
                Scale startup workflow (currently 15% conversion vs 28% target)
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 flex-shrink-0" />
                Optimize lead scoring to reduce 'below 50%' segment
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}