import React, { useState, useEffect } from 'react';
import { Mail, Send, Copy, Edit3, Sparkles, Clock, User, RefreshCw } from 'lucide-react';
import { InfoModal } from './InfoModal';
import emailDrafts from '../data/email_drafts.json';

export function EmailGenerator() {
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null);
  const [editingEmail, setEditingEmail] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState('');
  const [generatedEmails, setGeneratedEmails] = useState(emailDrafts.email_drafts);
  const [isGenerating, setIsGenerating] = useState(false);

  // Check for new leads to generate emails for
  useEffect(() => {
    const checkForNewEmailRequests = () => {
      const selectedLeadData = localStorage.getItem('selectedLeadForEmail');
      if (selectedLeadData) {
        try {
          const leadData = JSON.parse(selectedLeadData);
          generateEmailForLead(leadData);
          localStorage.removeItem('selectedLeadForEmail');
        } catch (error) {
          console.error('Error parsing lead data for email:', error);
        }
      }
    };

    checkForNewEmailRequests();
    const interval = setInterval(checkForNewEmailRequests, 1000);
    
    return () => clearInterval(interval);
  }, []);

  const generateEmailForLead = async (leadData: any) => {
    setIsGenerating(true);
    
    // Simulate AI email generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newEmail = {
      company: leadData.company,
      recipient: leadData.contact || 'Decision Maker',
      subject: `Partnership opportunity - ${leadData.company}`,
      email_body: `Hi ${leadData.contact || 'there'},\n\n${generatePersonalizedEmail(leadData)}\n\nBest regards,\n[Your Name]`,
      personalization_notes: [
        'Lead score: ' + Math.round((leadData.score || 0.8) * 100) + '%',
        'Source: Lead Pipeline',
        'Recently added to CRM',
        'High-priority prospect'
      ],
      send_timing: 'Next business day 10 AM',
      priority: leadData.score > 0.8 ? 'High' : 'Medium'
    };

    setGeneratedEmails(prev => [newEmail, ...prev]);
    setIsGenerating(false);

    // Show success notification
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded z-50';
    notification.innerHTML = `
      <div class="flex items-center gap-2">
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
        </svg>
        <span>Email generated for ${leadData.company}</span>
      </div>
    `;
    document.body.appendChild(notification);
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 3000);
  };

  const generatePersonalizedEmail = (leadData: any) => {
    const templates = [
      `I noticed ${leadData.company} has been expanding recently, and I thought you might be interested in how we've helped similar companies streamline their operations and achieve better results.\n\nWe specialize in helping companies like yours optimize their workflows and improve efficiency. Based on your company's profile, I believe there could be some valuable synergies.\n\nWould you be open to a brief 15-minute conversation to explore how we might be able to help ${leadData.company} achieve its goals?`,
      
      `I came across ${leadData.company} while researching innovative companies in your space, and I was impressed by your recent growth trajectory.\n\nGiven your focus on scaling operations, I thought you might find value in our solutions that have helped similar companies reduce costs while improving performance.\n\nI'd love to share some relevant case studies and discuss how this might apply to ${leadData.company}'s current initiatives.`,
      
      `Congratulations on ${leadData.company}'s continued success! I've been following your company's progress and wanted to reach out about an opportunity that might align with your current objectives.\n\nWe've been working with companies in similar growth stages to help them optimize their processes and achieve better outcomes. I think there could be some interesting possibilities for collaboration.\n\nWould you be interested in a quick call to discuss how this might benefit ${leadData.company}?`
    ];
    
    return templates[Math.floor(Math.random() * templates.length)];
  };

  const handleEdit = (company: string, currentBody: string) => {
    setEditingEmail(company);
    setEditedContent(currentBody);
  };

  const handleSaveEdit = () => {
    setGeneratedEmails(prev => prev.map(email => 
      email.company === editingEmail 
        ? { ...email, email_body: editedContent }
        : email
    ));
    setEditingEmail(null);
    setEditedContent('');
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    // Show brief success message
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded z-50';
    notification.innerHTML = 'Email copied to clipboard!';
    document.body.appendChild(notification);
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 2000);
  };

  const handleGenerateNew = () => {
    // Simulate generating a new email
    setIsGenerating(true);
    setTimeout(() => {
      const sampleCompanies = ['TechVenture Inc', 'GrowthCorp', 'InnovateLabs', 'ScaleUp Solutions'];
      const randomCompany = sampleCompanies[Math.floor(Math.random() * sampleCompanies.length)];
      
      generateEmailForLead({
        company: randomCompany,
        contact: 'Team',
        score: Math.random() * 0.3 + 0.7 // Score between 0.7-1.0
      });
    }, 2000);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
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
              "Editable drafts with manual review workflow",
              "Automatic generation from pipeline actions"
            ]}
            businessValue="AI-generated personalized emails achieve 47% higher open rates and 23% higher response rates compared to template-based outreach."
          />
        </div>

        <button
          onClick={handleGenerateNew}
          disabled={isGenerating}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {isGenerating ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          Generate New Email
        </button>
      </div>

      {isGenerating && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
            <div>
              <span className="font-medium text-blue-900">Generating personalized email...</span>
              <p className="text-sm text-blue-700">Analyzing lead data and crafting targeted message</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-6">
        {generatedEmails.map((email, index) => (
          <div key={index} className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 text-lg">{email.company}</h3>
                    <p className="text-slate-600">To: {email.recipient}</p>
                    {index === 0 && generatedEmails.length > emailDrafts.email_drafts.length && (
                      <span className="inline-block mt-1 px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">
                        Just Generated
                      </span>
                    )}
                  </div>
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
                  <pre className="whitespace-pre-wrap text-sm text-slate-700 font-sans leading-relaxed">
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