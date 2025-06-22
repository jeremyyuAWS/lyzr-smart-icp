import React, { useState } from 'react';
import { Terminal, Code, Zap, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { InfoModal } from './InfoModal';

interface LogEntry {
  timestamp: string;
  agent: string;
  action: string;
  status: 'success' | 'error' | 'pending';
  details: string;
  duration?: number;
}

export function DebugConsole() {
  const [logs, setLogs] = useState<LogEntry[]>([
    {
      timestamp: '2024-01-15 14:32:15',
      agent: 'Exa Agent',
      action: 'Semantic Search',
      status: 'success',
      details: 'Found 47 companies matching ICP criteria',
      duration: 1200
    },
    {
      timestamp: '2024-01-15 14:32:18',
      agent: 'Phind Agent',
      action: 'Tech Stack Analysis',
      status: 'success',
      details: 'Analyzed hiring signals for 4 companies',
      duration: 850
    },
    {
      timestamp: '2024-01-15 14:32:22',
      agent: 'Perplexity Agent',
      action: 'Contact Discovery',
      status: 'success',
      details: 'Enriched contact data for 8 decision makers',
      duration: 950
    },
    {
      timestamp: '2024-01-15 14:32:25',
      agent: 'SERP Agent',
      action: 'Online Presence Analysis',
      status: 'pending',
      details: 'Processing company web presence...',
    },
    {
      timestamp: '2024-01-15 14:32:20',
      agent: 'Scraper Agent',
      action: 'Website Content',
      status: 'error',
      details: 'Blocked by robots.txt - skipping techflowsolutions.com/admin',
    }
  ]);

  const [selectedAgent, setSelectedAgent] = useState<string>('');
  const [testPrompt, setTestPrompt] = useState('');

  const runTest = () => {
    if (!testPrompt || !selectedAgent) return;

    const newLog: LogEntry = {
      timestamp: new Date().toLocaleString(),
      agent: selectedAgent,
      action: 'Manual Test',
      status: 'pending',
      details: `Testing: ${testPrompt.substring(0, 50)}...`,
    };

    setLogs(prev => [newLog, ...prev]);

    // Simulate test completion
    setTimeout(() => {
      setLogs(prev => prev.map((log, index) => 
        index === 0 
          ? { ...log, status: 'success' as const, details: 'Test completed successfully', duration: 750 }
          : log
      ));
    }, 1500);

    setTestPrompt('');
  };

  const getStatusIcon = (status: LogEntry['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-emerald-600" />;
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-amber-600 animate-spin" />;
    }
  };

  const getStatusColor = (status: LogEntry['status']) => {
    switch (status) {
      case 'success':
        return 'border-emerald-200 bg-emerald-50';
      case 'error':
        return 'border-red-200 bg-red-50';
      case 'pending':
        return 'border-amber-200 bg-amber-50';
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <Terminal className="h-6 w-6 text-blue-600" />
        <h2 className="text-2xl font-bold text-slate-900">Debug Console</h2>
        <InfoModal
          title="Debug Console"
          description="Real-time monitoring and testing interface for AI agents and system operations."
          features={[
            "Live agent execution logs with timestamps and performance metrics",
            "Manual prompt testing for individual agents",
            "Error tracking and debugging information",
            "Performance monitoring and response time analysis"
          ]}
          businessValue="Debug console enables rapid troubleshooting, agent optimization, and confidence in system reliability for production deployments."
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Test Interface */}
        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Code className="h-5 w-5 text-purple-600" />
            <h3 className="font-semibold text-slate-900">Agent Testing</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block font-medium text-slate-900 mb-2">Select Agent</label>
              <select
                value={selectedAgent}
                onChange={(e) => setSelectedAgent(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Choose an agent...</option>
                <option value="Exa Agent">Exa Agent</option>
                <option value="Phind Agent">Phind Agent</option>
                <option value="Perplexity Agent">Perplexity Agent</option>
                <option value="SERP Agent">SERP Agent</option>
                <option value="Email Generator">Email Generator</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-slate-900 mb-2">Test Prompt</label>
              <textarea
                value={testPrompt}
                onChange={(e) => setTestPrompt(e.target.value)}
                placeholder="Enter a test prompt for the selected agent..."
                className="w-full h-24 px-3 py-2 border border-slate-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              onClick={runTest}
              disabled={!testPrompt || !selectedAgent}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Zap className="h-4 w-4" />
              Run Test
            </button>
          </div>

          <div className="mt-6 p-4 bg-slate-50 rounded-lg">
            <h4 className="font-medium text-slate-900 mb-2">Example Prompts</h4>
            <div className="space-y-2 text-sm">
              <div className="p-2 bg-white rounded border border-slate-200">
                <strong>Exa:</strong> Find SaaS companies in healthcare with 50-200 employees
              </div>
              <div className="p-2 bg-white rounded border border-slate-200">
                <strong>Phind:</strong> Analyze hiring signals for TechFlow Solutions
              </div>
              <div className="p-2 bg-white rounded border border-slate-200">
                <strong>Perplexity:</strong> Find contacts at DataStream Analytics
              </div>
            </div>
          </div>
        </div>

        {/* Activity Logs */}
        <div className="xl:col-span-2 bg-white border border-slate-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Terminal className="h-5 w-5 text-emerald-600" />
              <h3 className="font-semibold text-slate-900">Agent Activity Logs</h3>
            </div>
            <button
              onClick={() => setLogs([])}
              className="px-3 py-1 text-sm text-slate-600 hover:text-slate-800 border border-slate-200 rounded hover:bg-slate-50 transition-colors"
            >
              Clear Logs
            </button>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {logs.map((log, index) => (
              <div key={index} className={`p-4 rounded-lg border ${getStatusColor(log.status)}`}>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(log.status)}
                    <div>
                      <span className="font-medium text-slate-900">{log.agent}</span>
                      <span className="text-slate-600 mx-2">•</span>
                      <span className="text-slate-700">{log.action}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-slate-500">{log.timestamp}</div>
                    {log.duration && (
                      <div className="text-xs text-slate-500">{log.duration}ms</div>
                    )}
                  </div>
                </div>
                <p className="text-sm text-slate-700 ml-7">{log.details}</p>
              </div>
            ))}
          </div>

          {logs.length === 0 && (
            <div className="text-center py-8">
              <Terminal className="h-12 w-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500">No activity logs yet</p>
              <p className="text-sm text-slate-400 mt-1">Agent operations will appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}