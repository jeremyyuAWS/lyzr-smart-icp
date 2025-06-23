import React, { useState } from 'react';
import { Target, CheckCircle, AlertTriangle, TrendingUp, ArrowRight, Award, Zap, Info } from 'lucide-react';
import { InfoModal } from './InfoModal';
import scoringScorcards from '../data/scoring_scorecards.json';

export function ScorecardRenderer() {
  const [selectedScorecard, setSelectedScorecard] = useState<any>(null);

  const getScoreIcon = (status: string) => {
    switch (status) {
      case 'perfect':
      case 'excellent':
        return <CheckCircle className="h-4 w-4 text-emerald-600" />;
      case 'good':
      case 'strong':
        return <CheckCircle className="h-4 w-4 text-blue-600" />;
      case 'fair':
        return <AlertTriangle className="h-4 w-4 text-amber-600" />;
      case 'poor':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return <Info className="h-4 w-4 text-slate-600" />;
    }
  };

  const getScoreColor = (status: string) => {
    switch (status) {
      case 'perfect':
      case 'excellent':
        return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'good':
      case 'strong':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'fair':
        return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'poor':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  const getOverallScoreColor = (score: number) => {
    if (score >= 0.9) return 'text-emerald-600';
    if (score >= 0.8) return 'text-blue-600';
    if (score >= 0.7) return 'text-purple-600';
    if (score >= 0.6) return 'text-amber-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <Award className="h-6 w-6 text-blue-600" />
        <h2 className="text-2xl font-bold text-slate-900">Transparent Lead Scorecards</h2>
        <InfoModal
          title="Transparent Scoring Breakdown"
          description="Detailed lead scoring analysis that shows exactly why leads are ranked highly or poorly, with actionable insights for improvement."
          features={[
            "Comprehensive factor-by-factor scoring breakdown",
            "Visual indicators for each scoring component",
            "Positive indicators and improvement areas clearly highlighted",
            "Weighted scoring with customizable factor importance",
            "Actionable next steps based on score analysis"
          ]}
          businessValue="Transparent scoring builds trust with sales teams, improves lead quality by 40%, and enables data-driven sales strategy optimization."
        />
      </div>

      {/* Scorecard Grid */}
      <div className="grid gap-6">
        {scoringScorcards.scoring_scorecards.map((scorecard) => (
          <div
            key={scorecard.lead_id}
            onClick={() => setSelectedScorecard(scorecard)}
            className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-lg hover:border-blue-300 transition-all cursor-pointer group"
          >
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <Award className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 text-xl group-hover:text-blue-600 transition-colors">
                    {scorecard.company}
                  </h3>
                  <p className="text-slate-600 mt-1">Lead Scoring Analysis</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className={`text-3xl font-bold ${getOverallScoreColor(scorecard.overall_score)}`}>
                      {Math.round(scorecard.overall_score * 100)}%
                    </span>
                    <span className="text-sm text-slate-600">Overall Score</span>
                  </div>
                </div>
              </div>
              
              <div className="text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowRight className="h-5 w-5" />
              </div>
            </div>

            {/* Score Breakdown Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {Object.entries(scorecard.scorecard_breakdown).map(([factor, data]: [string, any]) => (
                <div key={factor} className={`p-4 border rounded-lg ${getScoreColor(data.status)}`}>
                  <div className="flex items-center gap-2 mb-2">
                    {getScoreIcon(data.status)}
                    <span className="font-medium text-sm capitalize">{factor.replace('_', ' ')}</span>
                  </div>
                  <div className="text-lg font-bold mb-1">
                    {Math.round(data.score * 100)}%
                  </div>
                  <div className="text-xs opacity-80">
                    Weight: {Math.round(data.weight * 100)}%
                  </div>
                  <div className="text-xs mt-1 opacity-90">
                    {data.details}
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Indicators */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h5 className="font-medium text-slate-900 mb-2 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-600" />
                  Positive Indicators
                </h5>
                <div className="space-y-1">
                  {scorecard.positive_indicators.slice(0, 3).map((indicator: string, i: number) => (
                    <div key={i} className="text-sm text-emerald-700 bg-emerald-50 px-2 py-1 rounded">
                      {indicator}
                    </div>
                  ))}
                  {scorecard.positive_indicators.length > 3 && (
                    <div className="text-xs text-slate-500">
                      +{scorecard.positive_indicators.length - 3} more indicators
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h5 className="font-medium text-slate-900 mb-2 flex items-center gap-2">
                  <Target className="h-4 w-4 text-blue-600" />
                  Next Steps
                </h5>
                <div className="space-y-1">
                  {scorecard.recommended_next_steps.slice(0, 2).map((step: string, i: number) => (
                    <div key={i} className="text-sm text-blue-700 bg-blue-50 px-2 py-1 rounded">
                      {step}
                    </div>
                  ))}
                  {scorecard.recommended_next_steps.length > 2 && (
                    <div className="text-xs text-slate-500">
                      +{scorecard.recommended_next_steps.length - 2} more steps
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-500">
              Lead ID: {scorecard.lead_id} • Click for detailed breakdown
            </div>
          </div>
        ))}
      </div>

      {/* Detailed Scorecard Modal */}
      {selectedScorecard && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-emerald-50 to-blue-50">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">{selectedScorecard.company}</h2>
                  <p className="text-slate-600 mt-1">Detailed Scoring Analysis</p>
                  <div className="flex items-center gap-3 mt-3">
                    <span className={`text-4xl font-bold ${getOverallScoreColor(selectedScorecard.overall_score)}`}>
                      {Math.round(selectedScorecard.overall_score * 100)}%
                    </span>
                    <div>
                      <div className="text-sm text-slate-600">Overall Score</div>
                      <div className="text-xs text-slate-500">Based on weighted factors</div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedScorecard(null)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="space-y-6">
                {/* Detailed Factor Breakdown */}
                <div>
                  <h3 className="font-semibold text-slate-900 mb-4">Scoring Factor Breakdown</h3>
                  <div className="space-y-4">
                    {Object.entries(selectedScorecard.scorecard_breakdown).map(([factor, data]: [string, any]) => (
                      <div key={factor} className={`p-4 border rounded-lg ${getScoreColor(data.status)}`}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {getScoreIcon(data.status)}
                            <span className="font-medium capitalize">{factor.replace('_', ' ')}</span>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold">{Math.round(data.score * 100)}%</div>
                            <div className="text-xs opacity-80">Weight: {Math.round(data.weight * 100)}%</div>
                          </div>
                        </div>
                        <div className="text-sm opacity-90">{data.details}</div>
                        <div className="w-full bg-white bg-opacity-50 rounded-full h-2 mt-2">
                          <div
                            className="h-2 rounded-full bg-current opacity-60"
                            style={{ width: `${data.score * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Positive Indicators */}
                <div>
                  <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-emerald-600" />
                    Positive Indicators
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {selectedScorecard.positive_indicators.map((indicator: string, i: number) => (
                      <div key={i} className="flex items-start gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                        <CheckCircle className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-emerald-800">{indicator}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Areas for Improvement */}
                <div>
                  <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-amber-600" />
                    Areas for Improvement
                  </h3>
                  <div className="space-y-2">
                    {selectedScorecard.areas_for_improvement.map((area: string, i: number) => (
                      <div key={i} className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                        <ArrowRight className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-amber-800">{area}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommended Next Steps */}
                <div>
                  <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <Zap className="h-5 w-5 text-blue-600" />
                    Recommended Next Steps
                  </h3>
                  <div className="space-y-2">
                    {selectedScorecard.recommended_next_steps.map((step: string, i: number) => (
                      <div key={i} className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <Target className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-blue-800">{step}</span>
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