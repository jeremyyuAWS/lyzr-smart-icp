import React, { useState } from 'react';
import { Mail, Send, Copy, Edit3, Sparkles, Clock } from 'lucide-react';
import { InfoModal } from './InfoModal';
import emailDrafts from '../data/email_drafts.json';

export function EmailGenerator() {
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null);
  const [editingEmail, setEditingEmail] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState('');

  const handleEdit = (company: string, currentBody: string) => {
    setEditingEmail(company);
    setEditedContent(currentBody);
  };

  const handleSaveEdit = () => {
    // In a real app, this would save the changes
    setEditingEmail(null);
    setEditedContent('');
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <Mail className="h-6 w-6 text-blue-600" />
        <h2 className="text-2xl font-bold text-slate-900">AI Email Generator</h2>
        <InfoModal
          title="AI Email Generator"
          description="Generate highly personalized email drafts using AI analysis of company insights and contact profiles."
          features={[
            "Personalized content based on company research and contact background",
            "Multiple personalization signals incorporated into each email",
            "Optimized send timing recommendations",
            "Editable drafts with manual review workflow"
          ]}
          businessValue="AI-generated personalized emails achieve 47% higher open rates and 23% higher response rates compared to template-based outreach."
        />
      </div>

      <div className="grid gap-6">
        {emailDrafts.email_drafts.map((email, index) => (
          <div key={index} className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-slate-900 text-lg">{email.company}</h3>
                  <p className="text-slate-600">To: {email.recipient}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    email.priority === 'High' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {email.priority} Priority
                  </span>
                </div>
              </div>

              <div className="bg-slate-50 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-4 w-4 text-purple-600" />
                  <span className="font-medium text-slate-900 text-sm">Subject Line</span>
                </div>
                <p className="text-slate-800 font-medium">{email.subject}</p>
              </div>

              <div className="flex items-center gap-2 mb-3">
                <Clock className="h-4 w-4 text-blue-600" />
                <span className="text-sm text-slate-600">Recommended send time: {email.send_timing}</span>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium text-slate-900 text-sm">Personalization Signals</h4>
                <div className="flex flex-wrap gap-2">
                  {email.personalization_notes.map((note, i) => (
                    <span key={i} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded border border-blue-200">
                      {note}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium text-slate-900">Email Content</h4>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEdit(email.company, email.email_body)}
                    className="inline-flex items-center gap-2 px-3 py-1.5 text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
                  >
                    <Edit3 className="h-3 w-3" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleCopy(email.email_body)}
                    className="inline-flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors"
                  >
                    <Copy className="h-3 w-3" />
                    Copy
                  </button>
                </div>
              </div>

              {editingEmail === email.company ? (
                <div className="space-y-4">
                  <textarea
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    className="w-full h-64 p-4 border border-slate-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setEditingEmail(null)}
                      className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveEdit}
                      className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-50 rounded-lg p-4">
                  <pre className="whitespace-pre-wrap text-sm text-slate-700 font-mono leading-relaxed">
                    {email.email_body}
                  </pre>
                </div>
              )}
            </div>

            <div className="px-6 pb-6">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-amber-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-amber-800 text-xs font-bold">!</span>
                  </div>
                  <div>
                    <p className="text-amber-800 font-medium text-sm">Manual Review Required</p>
                    <p className="text-amber-700 text-sm mt-1">
                      Please review and edit this draft before sending. All emails require manual approval and sending through your email client.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}