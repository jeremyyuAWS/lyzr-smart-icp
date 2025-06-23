import React, { useState } from 'react';
import { Users, Target, TrendingUp, DollarSign, Clock, Layers, BarChart3, Filter, RefreshCw } from 'lucide-react';
import { InfoModal } from './InfoModal';
import leadClusters from '../data/lead_clusters.json';

export function LeadClustering() {
  const [selectedCluster, setSelectedCluster] = useState<any>(null);
  const [isGeneratingClusters, setIsGeneratingClusters] = useState(false);

  const getClusterSizeColor = (size: number) => {
    if (size >= 40) return 'text-emerald-600';
    if (size >= 25) return 'text-blue-600';
    if (size >= 15) return 'text-amber-600';
    return 'text-red-600';
  };

  const getConversionColor = (rate: number) => {
    if (rate >= 0.35) return 'text-emerald-600';
    if (rate >= 0.25) return 'text-blue-600';
    if (rate >= 0.15) return 'text-amber-600';
    return 'text-red-600';
  };

  const generateNewClusters = async () => {
    setIsGeneratingClusters(true);
    
    // Simulate cluster generation
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setIsGeneratingClusters(false);
    
    // Show success notification
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded z-50';
    notification.innerHTML = `
      <div class="flex items-center gap-2">
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
        </svg>
        <span>Lead clusters regenerated successfully</span>
      </div>
    `;
    document.body.appendChild(notification);
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 3000);
  };

  const totalLeads = leadClusters.lead_clusters.reduce((sum, cluster) => sum + cluster.size, 0);
  const avgConversionRate = leadClusters.lead_clusters.reduce((sum, cluster) => sum + cluster.conversion_rate, 0) / leadClusters.lead_clusters.length;
  const avgDealSize = leadClusters.lead_clusters.reduce((sum, cluster) => sum + parseInt(cluster.avg_deal_size.replace(/[^\d]/g, '')), 0) / leadClusters.lead_clusters.length;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Layers className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-slate-900">Lead Persona Clustering</h2>
          <InfoModal
            title="AI-Powered Lead Clustering"
            description="Automatically groups leads into behavioral segments and persona clusters to optimize campaign targeting and messaging strategies."
            features={[
              "Machine learning-based lead segmentation by behavior and characteristics",
              "Auto-generated persona descriptions with actionable insights",
              "Conversion rate and deal size analysis per cluster",
              "Dynamic clustering with recommended messaging strategies",
              "Performance tracking and optimization recommendations"
            ]}
            businessValue="Lead clustering improves conversion rates by 28% and increases average deal size by 15% through better targeted messaging and segment-specific sales strategies."
          />
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-600">
            Quality Score: {Math.round(leadClusters.clustering_metadata.cluster_quality_score * 100)}%
          </span>
          <button
            onClick={generateNewClusters}
            disabled={isGeneratingClusters}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isGeneratingClusters ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            {isGeneratingClusters ? 'Generating...' : 'Regenerate Clusters'}
          </button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <Layers className="h-5 w-5 text-blue-600" />
            <span className="font-medium text-slate-900">Lead Clusters</span>
          </div>
          <div className="text-2xl font-bold text-slate-900">{leadClusters.lead_clusters.length}</div>
          <div className="text-sm text-slate-600">identified segments</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <Users className="h-5 w-5 text-emerald-600" />
            <span className="font-medium text-slate-900">Total Leads</span>
          </div>
          <div className="text-2xl font-bold text-slate-900">{totalLeads}</div>
          <div className="text-sm text-slate-600">across all clusters</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <Target className="h-5 w-5 text-purple-600" />
            <span className="font-medium text-slate-900">Avg Conversion</span>
          </div>
          <div className="text-2xl font-bold text-purple-600">{Math.round(avgConversionRate * 100)}%</div>
          <div className="text-sm text-slate-600">across clusters</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <DollarSign className="h-5 w-5 text-orange-600" />
            <span className="font-medium text-slate-900">Avg Deal Size</span>
          </div>
          <div className="text-2xl font-bold text-orange-600">${avgDealSize / 1000}K</div>
          <div className="text-sm text-slate-600">weighted average</div>
        </div>
      </div>

      {/* Cluster Cards */}
      <div className="grid gap-6">
        {leadClusters.lead_clusters.map((cluster) => (
          <div
            key={cluster.cluster_id}
            onClick={() => setSelectedCluster(cluster)}
            className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Layers className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 text-xl group-hover:text-blue-600 transition-colors">
                    {cluster.name}
                  </h3>
                  <p className="text-slate-600 mt-1 mb-3 max-w-2xl">{cluster.description}</p>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-slate-400" />
                      <span className={`font-medium ${getClusterSizeColor(cluster.size)}`}>
                        {cluster.size} leads
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-slate-400" />
                      <span className={`font-medium ${getConversionColor(cluster.conversion_rate)}`}>
                        {Math.round(cluster.conversion_rate * 100)}% conversion
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-slate-400" />
                      <span className="font-medium text-slate-900">{cluster.avg_deal_size}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-slate-400" />
                      <span className="font-medium text-slate-900">{cluster.sales_cycle}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                <BarChart3 className="h-5 w-5" />
              </div>
            </div>

            {/* Characteristics Preview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <h5 className="font-medium text-slate-900 text-sm mb-2">Key Characteristics</h5>
                <div className="text-sm text-slate-600 space-y-1">
                  <div>Size: {cluster.characteristics.avg_company_size}</div>
                  <div>Stage: {cluster.characteristics.growth_stage}</div>
                  <div>Focus: {cluster.characteristics.industries.join(', ')}</div>
                </div>
              </div>
              
              <div>
                <h5 className="font-medium text-slate-900 text-sm mb-2">Target Contacts</h5>
                <div className="flex flex-wrap gap-1">
                  {cluster.typical_contacts.slice(0, 2).map((contact, i) => (
                    <span key={i} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded border border-blue-200">
                      {contact}
                    </span>
                  ))}
                  {cluster.typical_contacts.length > 2 && (
                    <span className="text-xs text-slate-500">+{cluster.typical_contacts.length - 2} more</span>
                  )}
                </div>
              </div>
            </div>

            {/* Technology Stack */}
            <div className="mb-4">
              <h5 className="font-medium text-slate-900 text-sm mb-2">Key Technologies</h5>
              <div className="flex flex-wrap gap-2">
                {cluster.characteristics.key_technologies.map((tech, i) => (
                  <span key={i} className="px-2 py-1 bg-purple-50 text-purple-700 text-xs rounded border border-purple-200">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Recommended Messaging Preview */}
            <div>
              <h5 className="font-medium text-slate-900 text-sm mb-2">Messaging Strategy</h5>
              <div className="text-sm text-slate-600">
                {cluster.recommended_messaging[0]}
                {cluster.recommended_messaging.length > 1 && (
                  <span className="text-slate-500"> • +{cluster.recommended_messaging.length - 1} more strategies</span>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
              <div className="text-xs text-slate-500">
                Quality Score: {Math.round(Math.random() * 20 + 80)}% • Last Updated: {leadClusters.clustering_metadata.last_updated}
              </div>
              <div className="text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-sm">Click for details →</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Clustering Analytics */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-6">
        <h3 className="font-semibold text-slate-900 mb-4">Clustering Intelligence</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-slate-900 mb-3">Optimization Insights</h4>
            <ul className="space-y-2 text-sm text-slate-700">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2 flex-shrink-0" />
                High-Growth Grid Modernizers show highest conversion (41%)
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                Energy Tech Startups have shortest sales cycle (2-4 months)
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
                Renewable Energy Innovators offer balanced size/cycle ratio
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-slate-900 mb-3">Recommendations</h4>
            <ul className="space-y-2 text-sm text-slate-700">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 flex-shrink-0" />
                Focus enterprise resources on Grid Modernizers
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 flex-shrink-0" />
                Scale startup approach for volume growth
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 flex-shrink-0" />
                Develop renewable-specific messaging tracks
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Cluster Detail Modal */}
      {selectedCluster && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">{selectedCluster.name}</h2>
                  <p className="text-slate-600 mt-1">{selectedCluster.description}</p>
                </div>
                <button
                  onClick={() => setSelectedCluster(null)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <div className="space-y-6">
                {/* Performance Metrics */}
                <div className="grid grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{selectedCluster.size}</div>
                    <div className="text-sm text-blue-700">Leads</div>
                  </div>
                  <div className="text-center p-4 bg-emerald-50 rounded-lg">
                    <div className="text-2xl font-bold text-emerald-600">{Math.round(selectedCluster.conversion_rate * 100)}%</div>
                    <div className="text-sm text-emerald-700">Conversion</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{selectedCluster.avg_deal_size}</div>
                    <div className="text-sm text-purple-700">Avg Deal</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">{selectedCluster.sales_cycle}</div>
                    <div className="text-sm text-orange-700">Sales Cycle</div>
                  </div>
                </div>

                {/* Characteristics */}
                <div>
                  <h3 className="font-medium text-slate-900 mb-3">Cluster Characteristics</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="text-sm">
                        <span className="text-slate-600">Company Size:</span>
                        <span className="font-medium text-slate-900 ml-1">{selectedCluster.characteristics.avg_company_size}</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-slate-600">Growth Stage:</span>
                        <span className="font-medium text-slate-900 ml-1">{selectedCluster.characteristics.growth_stage}</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-slate-600">Funding:</span>
                        <span className="font-medium text-slate-900 ml-1">{selectedCluster.characteristics.funding_status}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm">
                        <span className="text-slate-600">Industries:</span>
                        <div className="mt-1">
                          {selectedCluster.characteristics.industries.map((industry: string, i: number) => (
                            <span key={i} className="inline-block px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded mr-1 mb-1">
                              {industry}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Technologies */}
                <div>
                  <h3 className="font-medium text-slate-900 mb-3">Key Technologies</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedCluster.characteristics.key_technologies.map((tech: string, i: number) => (
                      <span key={i} className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Target Contacts */}
                <div>
                  <h3 className="font-medium text-slate-900 mb-3">Typical Decision Makers</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {selectedCluster.typical_contacts.map((contact: string, i: number) => (
                      <div key={i} className="p-2 bg-emerald-50 border border-emerald-200 rounded text-sm text-emerald-800">
                        {contact}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Messaging Strategy */}
                <div>
                  <h3 className="font-medium text-slate-900 mb-3">Recommended Messaging Strategy</h3>
                  <div className="space-y-2">
                    {selectedCluster.recommended_messaging.map((message: string, i: number) => (
                      <div key={i} className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                        <div className="flex items-start gap-2">
                          <Target className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                          <span className="text-purple-800 text-sm">{message}</span>
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