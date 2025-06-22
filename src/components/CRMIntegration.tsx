import React, { useState, useEffect } from 'react';
import { Database, FolderSync as Sync, Settings, CheckCircle, AlertCircle, ArrowUpDown, Webhook, MapPin, Users } from 'lucide-react';
import { InfoModal } from './InfoModal';
import { Switch } from './ui/switch';

interface CRMProvider {
  id: string;
  name: string;
  logo?: string;
  color: string;
  features: string[];
  status: 'connected' | 'disconnected' | 'error';
  lastSync?: string;
  fieldMapping: Record<string, string>;
  webhookUrl?: string;
  syncSettings: {
    autoSync: boolean;
    syncInterval: number; // minutes
    bidirectional: boolean;
    createTasks: boolean;
    assignOwner: boolean;
  };
}

interface SyncHistory {
  id: string;
  crm: string;
  type: 'sync' | 'webhook';
  direction: 'import' | 'export' | 'bidirectional';
  timestamp: number;
  status: 'success' | 'error' | 'partial';
  recordsProcessed: number;
  errors?: string[];
}

export function CRMIntegration() {
  const [crmProviders, setCrmProviders] = useState<Record<string, CRMProvider>>({
    hubspot: {
      id: 'hubspot',
      name: 'HubSpot',
      color: 'orange',
      features: ['Contacts', 'Companies', 'Deals', 'Tasks', 'Notes', 'Webhooks'],
      status: 'connected',
      lastSync: '2024-01-15 14:30:00',
      fieldMapping: {
        company_name: 'name',
        domain: 'domain',
        email: 'email',
        phone: 'phone',
        score: 'hs_lead_score',
        industry: 'industry',
        employees: 'numberofemployees',
        revenue: 'annualrevenue',
        stage: 'lifecyclestage'
      },
      webhookUrl: 'https://webhook.smarticp.com/hubspot',
      syncSettings: {
        autoSync: true,
        syncInterval: 15,
        bidirectional: true,
        createTasks: true,
        assignOwner: true
      }
    },
    salesforce: {
      id: 'salesforce',
      name: 'Salesforce',
      color: 'blue',
      features: ['Leads', 'Accounts', 'Opportunities', 'Tasks', 'Campaigns'],
      status: 'disconnected',
      fieldMapping: {
        company_name: 'Name',
        domain: 'Website',
        email: 'Email',
        phone: 'Phone',
        score: 'Lead_Score__c',
        industry: 'Industry',
        employees: 'NumberOfEmployees',
        revenue: 'AnnualRevenue',
        stage: 'Status'
      },
      syncSettings: {
        autoSync: false,
        syncInterval: 30,
        bidirectional: false,
        createTasks: false,
        assignOwner: false
      }
    },
    pipedrive: {
      id: 'pipedrive',
      name: 'Pipedrive',
      color: 'emerald',
      features: ['Persons', 'Organizations', 'Deals', 'Activities', 'Notes'],
      status: 'error',
      lastSync: '2024-01-15 12:15:00',
      fieldMapping: {
        company_name: 'name',
        domain: 'website',
        email: 'email',
        phone: 'phone',
        score: 'custom_score',
        industry: 'category',
        employees: 'people_count',
        revenue: 'revenue',
        stage: 'stage_id'
      },
      syncSettings: {
        autoSync: true,
        syncInterval: 20,
        bidirectional: true,
        createTasks: true,
        assignOwner: false
      }
    }
  });

  const [syncHistory, setSyncHistory] = useState<SyncHistory[]>([
    {
      id: '1',
      crm: 'hubspot',
      type: 'sync',
      direction: 'export',
      timestamp: Date.now() - 900000, // 15 minutes ago
      status: 'success',
      recordsProcessed: 23
    },
    {
      id: '2',
      crm: 'pipedrive',
      type: 'sync',
      direction: 'export',
      timestamp: Date.now() - 3600000, // 1 hour ago
      status: 'error',
      recordsProcessed: 0,
      errors: ['API rate limit exceeded', 'Invalid API key']
    },
    {
      id: '3',
      crm: 'hubspot',
      type: 'webhook',
      direction: 'import',
      timestamp: Date.now() - 7200000, // 2 hours ago
      status: 'success',
      recordsProcessed: 5
    }
  ]);

  const [selectedCRM, setSelectedCRM] = useState<string>('hubspot');
  const [isSyncing, setIsSyncing] = useState<Record<string, boolean>>({});
  const [fieldMappingMode, setFieldMappingMode] = useState(false);

  const connectCRM = async (crmId: string) => {
    setCrmProviders(prev => ({
      ...prev,
      [crmId]: {
        ...prev[crmId],
        status: 'connected',
        lastSync: new Date().toISOString()
      }
    }));
  };

  const disconnectCRM = (crmId: string) => {
    setCrmProviders(prev => ({
      ...prev,
      [crmId]: {
        ...prev[crmId],
        status: 'disconnected',
        lastSync: undefined
      }
    }));
  };

  const syncCRM = async (crmId: string, direction: 'import' | 'export' | 'bidirectional' = 'export') => {
    setIsSyncing(prev => ({ ...prev, [crmId]: true }));

    // Simulate sync operation
    await new Promise(resolve => setTimeout(resolve, 3000));

    const newSync: SyncHistory = {
      id: Date.now().toString(),
      crm: crmId,
      type: 'sync',
      direction,
      timestamp: Date.now(),
      status: Math.random() > 0.1 ? 'success' : 'error',
      recordsProcessed: Math.floor(Math.random() * 50) + 1,
      errors: Math.random() > 0.1 ? undefined : ['Sample error message']
    };

    setSyncHistory(prev => [newSync, ...prev]);
    setCrmProviders(prev => ({
      ...prev,
      [crmId]: {
        ...prev[crmId],
        lastSync: new Date().toISOString()
      }
    }));

    setIsSyncing(prev => ({ ...prev, [crmId]: false }));
  };

  const updateFieldMapping = (crmId: string, smartICPField: string, crmField: string) => {
    setCrmProviders(prev => ({
      ...prev,
      [crmId]: {
        ...prev[crmId],
        fieldMapping: {
          ...prev[crmId].fieldMapping,
          [smartICPField]: crmField
        }
      }
    }));
  };

  const updateSyncSettings = (crmId: string, settings: Partial<CRMProvider['syncSettings']>) => {
    setCrmProviders(prev => ({
      ...prev,
      [crmId]: {
        ...prev[crmId],
        syncSettings: {
          ...prev[crmId].syncSettings,
          ...settings
        }
      }
    }));
  };

  const getStatusIcon = (status: CRMProvider['status']) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="h-4 w-4 text-emerald-600" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <div className="w-4 h-4 bg-slate-300 rounded-full" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'text-emerald-600';
      case 'error': return 'text-red-600';
      default: return 'text-slate-400';
    }
  };

  const smartICPFields = [
    { key: 'company_name', label: 'Company Name', required: true },
    { key: 'domain', label: 'Domain/Website', required: true },
    { key: 'email', label: 'Contact Email', required: true },
    { key: 'phone', label: 'Phone Number', required: false },
    { key: 'score', label: 'Lead Score', required: true },
    { key: 'industry', label: 'Industry', required: false },
    { key: 'employees', label: 'Employee Count', required: false },
    { key: 'revenue', label: 'Annual Revenue', required: false },
    { key: 'stage', label: 'Lead Stage', required: true }
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Database className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-slate-900">CRM Integration Hub</h2>
          <InfoModal
            title="Advanced CRM Integration"
            description="Bi-directional CRM sync with custom field mapping, webhook automation, and real-time data synchronization across all major CRM platforms."
            features={[
              "Two-way sync with HubSpot, Salesforce, and Pipedrive",
              "Custom field mapping with validation and data transformation",
              "Real-time webhook automation for instant updates",
              "Automated task creation and lead assignment",
              "Sync history and error tracking for reliability"
            ]}
            businessValue="CRM integration eliminates manual data entry, reduces lead response time by 75%, and ensures 100% data accuracy across sales systems."
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setFieldMappingMode(!fieldMappingMode)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              fieldMappingMode 
                ? 'bg-purple-600 text-white' 
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <MapPin className="h-4 w-4 inline mr-2" />
            Field Mapping
          </button>
          <button
            onClick={() => syncCRM(selectedCRM, 'bidirectional')}
            disabled={isSyncing[selectedCRM]}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSyncing[selectedCRM] ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <Sync className="h-4 w-4" />
            )}
            {isSyncing[selectedCRM] ? 'Syncing...' : 'Sync All'}
          </button>
        </div>
      </div>

      {!fieldMappingMode ? (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* CRM Providers */}
          <div className="xl:col-span-2 space-y-6">
            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <h3 className="font-semibold text-slate-900 mb-6">Connected CRM Systems</h3>
              
              <div className="grid gap-6">
                {Object.values(crmProviders).map((crm) => (
                  <div key={crm.id} className="p-6 border border-slate-200 rounded-xl hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 bg-${crm.color}-100 rounded-lg flex items-center justify-center`}>
                          <Database className={`h-6 w-6 text-${crm.color}-600`} />
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-900 text-lg">{crm.name}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            {getStatusIcon(crm.status)}
                            <span className={`text-sm font-medium capitalize ${getStatusColor(crm.status)}`}>
                              {crm.status}
                            </span>
                            {crm.lastSync && (
                              <>
                                <span className="text-slate-400">•</span>
                                <span className="text-xs text-slate-500">
                                  Last sync: {new Date(crm.lastSync).toLocaleString()}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {crm.status === 'connected' ? (
                          <>
                            <button
                              onClick={() => syncCRM(crm.id)}
                              disabled={isSyncing[crm.id]}
                              className="px-3 py-1.5 text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg disabled:opacity-50 transition-colors"
                            >
                              {isSyncing[crm.id] ? 'Syncing...' : 'Sync'}
                            </button>
                            <button
                              onClick={() => disconnectCRM(crm.id)}
                              className="px-3 py-1.5 text-sm bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors"
                            >
                              Disconnect
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => connectCRM(crm.id)}
                            className="px-3 py-1.5 text-sm bg-emerald-100 hover:bg-emerald-200 text-emerald-700 rounded-lg transition-colors"
                          >
                            Connect
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                      <div className="text-sm">
                        <span className="text-slate-600">Features</span>
                        <div className="font-medium text-slate-900">{crm.features.length} available</div>
                      </div>
                      <div className="text-sm">
                        <span className="text-slate-600">Sync Interval</span>
                        <div className="font-medium text-slate-900">{crm.syncSettings.syncInterval}m</div>
                      </div>
                      <div className="text-sm">
                        <span className="text-slate-600">Direction</span>
                        <div className="font-medium text-slate-900">
                          {crm.syncSettings.bidirectional ? 'Bi-directional' : 'One-way'}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {crm.features.map((feature, index) => (
                        <span key={index} className={`px-2 py-1 bg-${crm.color}-50 text-${crm.color}-700 text-xs rounded-full`}>
                          {feature}
                        </span>
                      ))}
                    </div>

                    {crm.status === 'connected' && (
                      <div className="space-y-3 pt-4 border-t border-slate-200">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-600">Auto Sync</span>
                          <Switch
                            checked={crm.syncSettings.autoSync}
                            onCheckedChange={(checked) => updateSyncSettings(crm.id, { autoSync: checked })}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-600">Bidirectional Sync</span>
                          <Switch
                            checked={crm.syncSettings.bidirectional}
                            onCheckedChange={(checked) => updateSyncSettings(crm.id, { bidirectional: checked })}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-600">Create Tasks</span>
                          <Switch
                            checked={crm.syncSettings.createTasks}
                            onCheckedChange={(checked) => updateSyncSettings(crm.id, { createTasks: checked })}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sync History & Webhooks */}
          <div className="space-y-6">
            {/* Sync History */}
            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <h3 className="font-semibold text-slate-900 mb-4">Sync History</h3>
              
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {syncHistory.map((sync) => (
                  <div key={sync.id} className={`p-3 rounded-lg border ${
                    sync.status === 'success' ? 'border-emerald-200 bg-emerald-50' :
                    sync.status === 'error' ? 'border-red-200 bg-red-50' :
                    'border-amber-200 bg-amber-50'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {sync.type === 'webhook' ? (
                          <Webhook className="h-4 w-4 text-purple-600" />
                        ) : (
                          <ArrowUpDown className="h-4 w-4 text-blue-600" />
                        )}
                        <span className="font-medium text-slate-900 capitalize">{sync.crm}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          sync.direction === 'import' ? 'bg-blue-100 text-blue-700' :
                          sync.direction === 'export' ? 'bg-emerald-100 text-emerald-700' :
                          'bg-purple-100 text-purple-700'
                        }`}>
                          {sync.direction}
                        </span>
                      </div>
                      <span className="text-xs text-slate-500">
                        {new Date(sync.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">
                        {sync.recordsProcessed} records
                      </span>
                      <span className={`text-xs font-medium ${
                        sync.status === 'success' ? 'text-emerald-600' :
                        sync.status === 'error' ? 'text-red-600' : 'text-amber-600'
                      }`}>
                        {sync.status}
                      </span>
                    </div>
                    
                    {sync.errors && sync.errors.length > 0 && (
                      <div className="mt-2 text-xs text-red-600">
                        {sync.errors.join(', ')}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Webhook Configuration */}
            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <h3 className="font-semibold text-slate-900 mb-4">Webhook Configuration</h3>
              
              <div className="space-y-4">
                {Object.values(crmProviders)
                  .filter(crm => crm.status === 'connected')
                  .map((crm) => (
                    <div key={crm.id} className="p-3 bg-slate-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Webhook className="h-4 w-4 text-purple-600" />
                        <span className="font-medium text-slate-900">{crm.name}</span>
                      </div>
                      
                      <div className="text-xs text-slate-600 mb-2">Webhook URL:</div>
                      <div className="text-xs font-mono bg-white p-2 rounded border border-slate-200 break-all">
                        {crm.webhookUrl}
                      </div>
                      
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-xs text-slate-600">Active</span>
                        <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <h3 className="font-semibold text-slate-900 mb-4">Performance Metrics</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Sync Success Rate</span>
                  <span className="font-medium text-emerald-600">96%</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Avg Sync Time</span>
                  <span className="font-medium text-blue-600">2.3s</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Records Synced Today</span>
                  <span className="font-medium text-slate-900">1,247</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Webhook Events</span>
                  <span className="font-medium text-purple-600">89</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Field Mapping Interface */
        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-slate-900 text-lg">Field Mapping Configuration</h3>
            <select
              value={selectedCRM}
              onChange={(e) => setSelectedCRM(e.target.value)}
              className="px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {Object.values(crmProviders).map((crm) => (
                <option key={crm.id} value={crm.id}>{crm.name}</option>
              ))}
            </select>
          </div>

          <div className="grid gap-4">
            {smartICPFields.map((field) => {
              const crmField = crmProviders[selectedCRM]?.fieldMapping[field.key] || '';
              
              return (
                <div key={field.key} className="grid grid-cols-3 gap-4 items-center p-4 bg-slate-50 rounded-lg">
                  <div>
                    <span className="font-medium text-slate-900">{field.label}</span>
                    {field.required && (
                      <span className="text-red-500 ml-1">*</span>
                    )}
                    <div className="text-xs text-slate-500 mt-1">SmartICP Field</div>
                  </div>
                  
                  <div className="flex items-center justify-center">
                    <ArrowUpDown className="h-4 w-4 text-slate-400" />
                  </div>
                  
                  <div>
                    <input
                      type="text"
                      value={crmField}
                      onChange={(e) => updateFieldMapping(selectedCRM, field.key, e.target.value)}
                      placeholder={`${crmProviders[selectedCRM]?.name} field name`}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="text-xs text-slate-500 mt-1">{crmProviders[selectedCRM]?.name} Field</div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-3">
              <Users className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900">Field Mapping Guidelines</h4>
                <ul className="text-sm text-blue-800 mt-1 space-y-1">
                  <li>• Required fields must be mapped for successful sync</li>
                  <li>• Custom fields should include the full API name</li>
                  <li>• Data types must be compatible between systems</li>
                  <li>• Changes take effect on the next sync operation</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}