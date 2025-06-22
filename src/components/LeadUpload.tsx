import React, { useState } from 'react';
import { Upload, FileText, Users, Download, AlertCircle } from 'lucide-react';
import { InfoModal } from './InfoModal';

export function LeadUpload() {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedLeads, setUploadedLeads] = useState<any[]>([]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    setUploadedFile(file);
    
    // Simulate file processing and lead scoring
    setTimeout(() => {
      const mockProcessedLeads = [
        {
          company: "Acme Corp",
          contact: "John Smith",
          title: "CTO",
          email: "john@acmecorp.com",
          score: 0.87,
          source: "ZoomInfo Upload"
        },
        {
          company: "Beta Solutions",
          contact: "Sarah Johnson",
          title: "VP Engineering",
          email: "sarah@betasolutions.com",
          score: 0.76,
          source: "ZoomInfo Upload"
        },
        {
          company: "Gamma Tech",
          contact: "Mike Chen",
          title: "Head of Product",
          email: "mike@gammatech.com",
          score: 0.82,
          source: "ZoomInfo Upload"
        }
      ];
      
      setUploadedLeads(mockProcessedLeads);
    }, 2000);
  };

  const downloadTemplate = () => {
    const csvContent = "Company,Contact Name,Title,Email,Industry,Employee Count,Location\n" +
                      "Example Corp,Jane Doe,CTO,jane@example.com,Technology,150,San Francisco\n" +
                      "Sample Inc,Bob Smith,VP Sales,bob@sample.com,SaaS,75,New York";
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'lead_upload_template.csv';
    link.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <Upload className="h-6 w-6 text-blue-600" />
        <h2 className="text-2xl font-bold text-slate-900">Lead Upload & Scoring</h2>
        <InfoModal
          title="Lead Upload & Scoring"
          description="Upload your existing lead lists from ZoomInfo, Apollo, or other sources to apply SmartICP scoring."
          features={[
            "CSV/Excel file upload with automatic field mapping",
            "Batch processing and enrichment of uploaded leads",
            "AI scoring applied to all uploaded contacts",
            "Integration with existing lead scoring methodology"
          ]}
          businessValue="Transform existing lead databases with AI scoring, improving qualification accuracy by 45% and reducing manual review time by 60%."
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upload Section */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <h3 className="font-semibold text-slate-900 mb-4">Upload Lead File</h3>
            
            <div className="mb-4">
              <button
                onClick={downloadTemplate}
                className="inline-flex items-center gap-2 px-3 py-2 text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
              >
                <Download className="h-4 w-4" />
                Download Template
              </button>
            </div>

            <div
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                dragActive 
                  ? 'border-blue-400 bg-blue-50' 
                  : 'border-slate-300 hover:border-slate-400'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="mb-4">
                <FileText className="h-12 w-12 text-slate-400 mx-auto" />
              </div>
              <div className="space-y-2">
                <p className="text-slate-700 font-medium">
                  Drop your CSV file here, or{' '}
                  <label className="text-blue-600 hover:text-blue-700 cursor-pointer underline">
                    browse to upload
                    <input
                      type="file"
                      accept=".csv,.xlsx,.xls"
                      onChange={handleFileInput}
                      className="hidden"
                    />
                  </label>
                </p>
                <p className="text-sm text-slate-500">
                  Supports CSV, Excel files up to 10MB
                </p>
              </div>
            </div>

            {uploadedFile && (
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-blue-900">{uploadedFile.name}</p>
                    <p className="text-sm text-blue-700">
                      {(uploadedFile.size / 1024).toFixed(1)} KB • Processing...
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-amber-900">Supported Formats</h4>
                <ul className="text-sm text-amber-800 mt-2 space-y-1">
                  <li>• ZoomInfo exports (CSV)</li>
                  <li>• Apollo.io lists (CSV)</li>
                  <li>• Custom CSV with company, contact, email columns</li>
                  <li>• Excel files (.xlsx, .xls)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Users className="h-5 w-5 text-emerald-600" />
              <h3 className="font-semibold text-slate-900">Processed Leads</h3>
            </div>

            {uploadedLeads.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500">Upload a file to see processed leads</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-sm text-slate-600">
                  {uploadedLeads.length} leads processed and scored
                </div>
                
                {uploadedLeads.map((lead, index) => (
                  <div key={index} className="p-4 border border-slate-200 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium text-slate-900">{lead.company}</h4>
                        <p className="text-sm text-slate-600">{lead.contact} • {lead.title}</p>
                        <p className="text-xs text-slate-500">{lead.email}</p>
                      </div>
                      <div className="text-right">
                        <div className={`text-lg font-bold ${lead.score >= 0.8 ? 'text-emerald-600' : lead.score >= 0.6 ? 'text-blue-600' : 'text-amber-600'}`}>
                          {Math.round(lead.score * 100)}%
                        </div>
                        <div className="text-xs text-slate-500">ICP Score</div>
                      </div>
                    </div>
                    
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-emerald-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${lead.score * 100}%` }}
                      />
                    </div>
                  </div>
                ))}

                <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Export Scored Leads
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}