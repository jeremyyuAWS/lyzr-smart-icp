import React, { useState } from 'react';
import { Brain, User, Shield } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './components/ui/tabs';
import { Switch } from './components/ui/switch';
import { ICPBuilder } from './components/ICPBuilder';
import { CompanyDiscovery } from './components/CompanyDiscovery';
import { LeadScoring } from './components/LeadScoring';
import { EmailGenerator } from './components/EmailGenerator';
import { EmailOrchestration } from './components/EmailOrchestration';
import { IntegrationHub } from './components/IntegrationHub';
import { CompetitiveIntelligence } from './components/CompetitiveIntelligence';
import { LeadUpload } from './components/LeadUpload';
import { AdminConsole } from './components/AdminConsole';
import { DebugConsole } from './components/DebugConsole';
import { WorkflowBuilder } from './components/WorkflowBuilder';
import { LeadLifecycle } from './components/LeadLifecycle';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { APITestingConsole } from './components/APITestingConsole';
import { CRMIntegration } from './components/CRMIntegration';
import { ABTestingDashboard } from './components/ABTestingDashboard';
import { RealTimeAlerts } from './components/RealTimeAlerts';
import { WorkflowTriggers } from './components/WorkflowTriggers';
import { PredictiveAnalytics } from './components/PredictiveAnalytics';

function App() {
  const [isAdminView, setIsAdminView] = useState(false);
  const [activeTab, setActiveTab] = useState('icp-builder');

  const switchToTab = (tabId: string) => {
    setActiveTab(tabId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <img 
                  src="/images/Lyzr-logo cropped.webp" 
                  alt="Lyzr" 
                  className="h-8 w-auto"
                />
                <div className="w-px h-8 bg-slate-300"></div>
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <Brain className="h-6 w-6 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">SmartICP</h1>
                <p className="text-sm text-slate-600">Intelligent Customer Profile Generator</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <User className="h-4 w-4 text-slate-600" />
                <span className="text-sm font-medium text-slate-700">User View</span>
                <Switch
                  checked={isAdminView}
                  onCheckedChange={setIsAdminView}
                />
                <span className="text-sm font-medium text-slate-700">Admin View</span>
                <Shield className="h-4 w-4 text-slate-600" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-18 lg:w-auto lg:inline-flex mb-8">
            <TabsTrigger value="icp-builder">ICP Builder</TabsTrigger>
            <TabsTrigger value="discovery">Discovery</TabsTrigger>
            <TabsTrigger value="scoring">Scoring</TabsTrigger>
            <TabsTrigger value="lifecycle">Pipeline</TabsTrigger>
            <TabsTrigger value="emails">Emails</TabsTrigger>
            <TabsTrigger value="orchestration">Orchestration</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
            <TabsTrigger value="triggers">Triggers</TabsTrigger>
            <TabsTrigger value="predictive">Predictive</TabsTrigger>
            <TabsTrigger value="competitive">Competitive</TabsTrigger>
            <TabsTrigger value="workflow">Workflow</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
            <TabsTrigger value="upload">Upload</TabsTrigger>
            <TabsTrigger value="crm">CRM Sync</TabsTrigger>
            <TabsTrigger value="ab-testing">A/B Tests</TabsTrigger>
            {isAdminView && <TabsTrigger value="api-testing">API Testing</TabsTrigger>}
            {isAdminView && <TabsTrigger value="admin">Admin</TabsTrigger>}
            {isAdminView && <TabsTrigger value="debug">Debug</TabsTrigger>}
          </TabsList>

          <TabsContent value="icp-builder" className="space-y-6">
            <ICPBuilder />
          </TabsContent>

          <TabsContent value="discovery" className="space-y-6">
            <CompanyDiscovery onNavigateToTab={switchToTab} />
          </TabsContent>

          <TabsContent value="scoring" className="space-y-6">
            <LeadScoring onNavigateToTab={switchToTab} />
          </TabsContent>

          <TabsContent value="lifecycle" className="space-y-6">
            <LeadLifecycle onNavigateToTab={switchToTab} />
          </TabsContent>

          <TabsContent value="emails" className="space-y-6">
            <EmailGenerator />
          </TabsContent>

          <TabsContent value="orchestration" className="space-y-6">
            <EmailOrchestration />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <AnalyticsDashboard />
          </TabsContent>

          <TabsContent value="alerts" className="space-y-6">
            <RealTimeAlerts />
          </TabsContent>

          <TabsContent value="triggers" className="space-y-6">
            <WorkflowTriggers />
          </TabsContent>

          <TabsContent value="predictive" className="space-y-6">
            <PredictiveAnalytics />
          </TabsContent>

          <TabsContent value="competitive" className="space-y-6">
            <CompetitiveIntelligence />
          </TabsContent>

          <TabsContent value="workflow" className="space-y-6">
            <WorkflowBuilder />
          </TabsContent>

          <TabsContent value="integrations" className="space-y-6">
            <IntegrationHub />
          </TabsContent>

          <TabsContent value="upload" className="space-y-6">
            <LeadUpload />
          </TabsContent>

          <TabsContent value="crm" className="space-y-6">
            <CRMIntegration />
          </TabsContent>

          <TabsContent value="ab-testing" className="space-y-6">
            <ABTestingDashboard />
          </TabsContent>

          {isAdminView && (
            <TabsContent value="api-testing" className="space-y-6">
              <APITestingConsole />
            </TabsContent>
          )}

          {isAdminView && (
            <TabsContent value="admin" className="space-y-6">
              <AdminConsole />
            </TabsContent>
          )}

          {isAdminView && (
            <TabsContent value="debug" className="space-y-6">
              <DebugConsole />
            </TabsContent>
          )}
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-16">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center text-sm text-slate-600">
            <p>SmartICP • Powered by Lyzr • Enterprise-ready with advanced automation</p>
            <p className="mt-1">Email orchestration • Competitive intelligence • Predictive analytics • Real-time integrations</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;