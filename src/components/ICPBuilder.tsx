import React, { useState, useEffect } from 'react';
import { Building2, Users, Code, MapPin, Target, Save, DollarSign, TrendingUp, AlertCircle, Clock, MessageSquare, Sparkles, ChevronDown, ChevronUp, Send, User, Bot } from 'lucide-react';
import { InfoModal } from './InfoModal';
import icpCriteria from '../data/icp_criteria.json';

interface ICPCriteria {
  industries: string[];
  company_sizes: string[];
  revenue_ranges: string[];
  business_models: string[];
  growth_stages: string[];
  technologies: string[];
  locations: string[];
  decision_makers: string[];
  pain_points: string[];
  buying_behavior: string[];
  urgency_indicators: string[];
}

export function ICPBuilder() {
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{role: 'user' | 'assistant', content: string, timestamp: number}>>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter states
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedRevenue, setSelectedRevenue] = useState<string[]>([]);
  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  const [selectedStages, setSelectedStages] = useState<string[]>([]);
  const [selectedTechnologies, setSelectedTechnologies] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedDecisionMakers, setSelectedDecisionMakers] = useState<string[]>([]);
  const [selectedPainPoints, setSelectedPainPoints] = useState<string[]>([]);
  const [selectedBuyingBehavior, setSelectedBuyingBehavior] = useState<string[]>([]);
  const [selectedUrgencyIndicators, setSelectedUrgencyIndicators] = useState<string[]>([]);
  const [description, setDescription] = useState('');

  // Example prompts spanning different industries
  const examplePrompts = [
    "Mid-size manufacturing companies implementing digital transformation initiatives in the Midwest",
    "Healthcare organizations with 200-500 employees adopting new patient management systems",
    "Financial services firms facing regulatory compliance challenges and seeking automation solutions",
    "Retail chains expanding their e-commerce capabilities and customer analytics",
    "Professional services companies transitioning to remote work and digital collaboration tools",
    "Construction companies investing in project management software and IoT solutions"
  ];

  const [currentExampleIndex, setCurrentExampleIndex] = useState(0);

  // Auto-rotate example prompts every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentExampleIndex((prev) => (prev + 1) % examplePrompts.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleChatSubmit = async () => {
    if (!chatInput.trim()) return;

    const userMessage = chatInput.trim();
    const timestamp = Date.now();
    setChatHistory(prev => [...prev, { role: 'user', content: userMessage, timestamp }]);
    setChatInput('');
    setIsProcessing(true);

    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Parse the input and extract criteria
    const parsedCriteria = parseICPFromText(userMessage);
    
    // Update filter selections based on parsed criteria
    applyParsedCriteria(parsedCriteria);

    // Generate AI response
    const aiResponse = generateAIResponse(parsedCriteria);
    setChatHistory(prev => [...prev, { role: 'assistant', content: aiResponse, timestamp: Date.now() }]);
    
    setIsProcessing(false);
    setDescription(userMessage);
  };

  const parseICPFromText = (text: string): any => {
    const parsed: any = {};
    const lowerText = text.toLowerCase();

    // Industry parsing - more comprehensive
    const industries = icpCriteria.industries.filter(industry => 
      lowerText.includes(industry.toLowerCase()) || 
      lowerText.includes(industry.split(' ')[0].toLowerCase()) ||
      (industry.includes('Technology') && (lowerText.includes('tech') || lowerText.includes('software'))) ||
      (industry.includes('Healthcare') && (lowerText.includes('health') || lowerText.includes('medical'))) ||
      (industry.includes('Financial') && (lowerText.includes('finance') || lowerText.includes('banking'))) ||
      (industry.includes('Manufacturing') && lowerText.includes('manufacturing')) ||
      (industry.includes('Retail') && (lowerText.includes('retail') || lowerText.includes('e-commerce')))
    );
    if (industries.length > 0) parsed.industries = industries;

    // Technology parsing
    const technologies = icpCriteria.technologies.filter(tech => 
      lowerText.includes(tech.toLowerCase().split(' ')[0]) ||
      lowerText.includes(tech.toLowerCase()) ||
      (tech.includes('Digital') && lowerText.includes('digital')) ||
      (tech.includes('Cloud') && lowerText.includes('cloud'))
    );
    if (technologies.length > 0) parsed.technologies = technologies;

    // Location parsing
    const locations = icpCriteria.locations.filter(location => 
      lowerText.includes(location.toLowerCase()) ||
      (location.includes('Midwest') && lowerText.includes('midwest'))
    );
    if (locations.length > 0) parsed.locations = locations;

    // Size parsing - more nuanced
    if (lowerText.includes('startup') || lowerText.includes('early stage')) {
      parsed.company_sizes = ['Startup (Bootstrapped)', 'Seed Stage'];
    }
    if (lowerText.includes('enterprise') || lowerText.includes('large')) {
      parsed.company_sizes = ['Large Enterprise (5,000-19,999)', 'Fortune 500 (20,000+)'];
    }
    if (lowerText.includes('mid-size') || lowerText.includes('medium') || (lowerText.includes('200') && lowerText.includes('500'))) {
      parsed.company_sizes = ['Medium Business (50-249)', 'Large Business (250-999)'];
    }
    if (lowerText.includes('small business') || lowerText.includes('smb')) {
      parsed.company_sizes = ['Small Business (10-49)'];
    }

    // Pain points parsing
    const painPoints = icpCriteria.pain_points.filter(pain => {
      const painLower = pain.toLowerCase();
      return lowerText.includes(painLower) ||
        (painLower.includes('digital transformation') && lowerText.includes('digital')) ||
        (painLower.includes('compliance') && lowerText.includes('compliance')) ||
        (painLower.includes('remote work') && lowerText.includes('remote'))
    });
    if (painPoints.length > 0) parsed.pain_points = painPoints;

    return parsed;
  };

  const applyParsedCriteria = (parsed: any) => {
    if (parsed.industries) setSelectedIndustries(parsed.industries);
    if (parsed.technologies) setSelectedTechnologies(parsed.technologies);
    if (parsed.locations) setSelectedLocations(parsed.locations);
    if (parsed.company_sizes) setSelectedSizes(parsed.company_sizes);
    if (parsed.growth_stages) setSelectedStages(parsed.growth_stages);
    if (parsed.business_models) setSelectedModels(parsed.business_models);
    if (parsed.pain_points) setSelectedPainPoints(parsed.pain_points);
  };

  const generateAIResponse = (parsed: any): string => {
    const matchedCriteria = [];
    if (parsed.industries) matchedCriteria.push(`${parsed.industries.length} industry matches`);
    if (parsed.technologies) matchedCriteria.push(`${parsed.technologies.length} technology matches`);
    if (parsed.locations) matchedCriteria.push(`location targeting set`);
    if (parsed.company_sizes) matchedCriteria.push(`company size criteria applied`);
    if (parsed.pain_points) matchedCriteria.push(`pain points identified`);

    if (matchedCriteria.length === 0) {
      return "I've analyzed your description and I'm ready to help you build your Ideal Customer Profile. I can help identify specific industries, company sizes, technologies, and other criteria that match your target market. Feel free to use the advanced filters below to refine your targeting further.";
    }

    return `Perfect! I've analyzed your ideal customer description and identified ${matchedCriteria.join(', ')}. I've automatically populated the relevant filters below. You can refine these selections or add additional criteria using the advanced filters. Would you like me to suggest any additional targeting criteria based on your description?`;
  };

  const handleMultiSelect = (
    value: string,
    selected: string[],
    setter: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    if (selected.includes(value)) {
      setter(selected.filter(item => item !== value));
    } else {
      setter([...selected, value]);
    }
  };

  const handleSave = () => {
    const icpData = {
      chat_description: description,
      industries: selectedIndustries,
      company_sizes: selectedSizes,
      revenue_ranges: selectedRevenue,
      business_models: selectedModels,
      growth_stages: selectedStages,
      technologies: selectedTechnologies,
      locations: selectedLocations,
      decision_makers: selectedDecisionMakers,
      pain_points: selectedPainPoints,
      buying_behavior: selectedBuyingBehavior,
      urgency_indicators: selectedUrgencyIndicators,
      created_at: new Date().toISOString()
    };
    
    console.log('Saving ICP:', icpData);
    alert('ICP criteria saved successfully!');
  };

  const useExamplePrompt = (prompt: string) => {
    setChatInput(prompt);
  };

  const totalCriteria = selectedIndustries.length + selectedSizes.length + selectedRevenue.length + 
    selectedModels.length + selectedStages.length + selectedTechnologies.length + 
    selectedLocations.length + selectedDecisionMakers.length + selectedPainPoints.length + 
    selectedBuyingBehavior.length + selectedUrgencyIndicators.length;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Target className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-slate-900">Define Your Ideal Customer Profile</h2>
          <InfoModal
            title="AI-Powered ICP Builder"
            description="Describe your ideal customer in natural language and let AI automatically extract and apply relevant targeting criteria across industries."
            features={[
              "Natural language processing for intuitive customer description",
              "Automatic filter population based on conversational input",
              "11+ targeting dimensions across all industries and markets",
              "Real-time ICP validation and criteria refinement",
              "Export-ready profiles for use across sales and marketing tools"
            ]}
            businessValue="AI-powered ICP building reduces profile creation time by 60% while increasing targeting accuracy through natural language understanding."
          />
        </div>
        <button
          onClick={handleSave}
          disabled={totalCriteria === 0 && !description}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Save className="h-4 w-4" />
          Save ICP
        </button>
      </div>

      {/* Main Chat Interface */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm">
        {/* Chat Header */}
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center gap-3 mb-2">
            <MessageSquare className="h-5 w-5 text-blue-600" />
            <h3 className="font-semibold text-slate-900">Describe Your Ideal Customer</h3>
          </div>
          <p className="text-slate-600 text-sm">
            Tell me about the types of companies you want to target. I'll help you build a comprehensive customer profile.
          </p>
        </div>

        {/* Chat Messages */}
        <div className="max-h-96 overflow-y-auto">
          {chatHistory.length === 0 ? (
            <div className="p-6">
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Bot className="h-8 w-8 text-blue-600" />
                </div>
                <h4 className="font-medium text-slate-900 mb-2">Let's build your Ideal Customer Profile</h4>
                <p className="text-slate-600 text-sm mb-6">
                  Describe your target customers in your own words. I'll identify the key criteria and help you refine your targeting.
                </p>

                {/* Auto-rotating Example */}
                <div className="bg-slate-50 rounded-lg p-4 mb-4">
                  <p className="text-xs text-slate-500 mb-2">Example:</p>
                  <button
                    onClick={() => useExamplePrompt(examplePrompts[currentExampleIndex])}
                    className="text-left w-full p-3 bg-white border border-slate-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all text-sm text-slate-700 italic"
                  >
                    "{examplePrompts[currentExampleIndex]}"
                  </button>
                  <div className="flex justify-center mt-3 gap-1">
                    {examplePrompts.map((_, index) => (
                      <div
                        key={index}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          index === currentExampleIndex ? 'bg-blue-600' : 'bg-slate-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* More Examples Button */}
                <details className="text-left">
                  <summary className="text-xs text-blue-600 hover:text-blue-700 cursor-pointer mb-3">
                    Show more examples
                  </summary>
                  <div className="grid gap-2">
                    {examplePrompts.filter((_, i) => i !== currentExampleIndex).map((prompt, index) => (
                      <button
                        key={index}
                        onClick={() => useExamplePrompt(prompt)}
                        className="text-left p-3 bg-slate-50 hover:bg-blue-50 border border-slate-200 rounded-lg text-xs text-slate-600 italic transition-colors"
                      >
                        "{prompt}"
                      </button>
                    ))}
                  </div>
                </details>
              </div>
            </div>
          ) : (
            <div className="p-6 space-y-4">
              {chatHistory.map((message, index) => (
                <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-3xl p-4 rounded-lg ${
                    message.role === 'user' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-slate-100 text-slate-900'
                  }`}>
                    <div className="flex items-start gap-3">
                      {message.role === 'assistant' && (
                        <Bot className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      )}
                      {message.role === 'user' && (
                        <User className="h-5 w-5 text-blue-100 flex-shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <p className="text-sm">{message.content}</p>
                        <div className="text-xs opacity-75 mt-1">
                          {new Date(message.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {isProcessing && (
                <div className="flex justify-start">
                  <div className="max-w-3xl p-4 rounded-lg bg-slate-100">
                    <div className="flex items-center gap-3">
                      <Bot className="h-5 w-5 text-blue-600" />
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Chat Input */}
        <div className="p-6 border-t border-slate-100">
          <div className="flex gap-3">
            <div className="flex-1">
              <textarea
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Describe your ideal customers... e.g., 'Mid-size healthcare organizations implementing digital patient management systems'"
                className="w-full h-16 px-4 py-3 border border-slate-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleChatSubmit();
                  }
                }}
              />
            </div>
            <button
              onClick={handleChatSubmit}
              disabled={!chatInput.trim() || isProcessing}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {isProcessing ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Send className="h-4 w-4" />
              )}
              Send
            </button>
          </div>
        </div>
      </div>

      {/* ICP Summary */}
      {(totalCriteria > 0 || description) && (
        <div className="bg-gradient-to-r from-blue-50 to-emerald-50 p-6 rounded-xl border border-blue-200">
          <h3 className="font-semibold text-slate-900 mb-4">Your ICP Profile</h3>
          
          {description && (
            <div className="mb-4 p-4 bg-white rounded-lg border border-blue-200">
              <h4 className="font-medium text-slate-900 mb-2">Description:</h4>
              <p className="text-slate-700 italic">"{description}"</p>
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 text-sm">
            <div className="bg-white p-3 rounded-lg">
              <span className="font-medium text-slate-700 block">Industries</span>
              <div className="mt-1 text-blue-600 font-semibold">{selectedIndustries.length} selected</div>
            </div>
            <div className="bg-white p-3 rounded-lg">
              <span className="font-medium text-slate-700 block">Company Sizes</span>
              <div className="mt-1 text-blue-600 font-semibold">{selectedSizes.length} selected</div>
            </div>
            <div className="bg-white p-3 rounded-lg">
              <span className="font-medium text-slate-700 block">Technologies</span>
              <div className="mt-1 text-blue-600 font-semibold">{selectedTechnologies.length} selected</div>
            </div>
            <div className="bg-white p-3 rounded-lg">
              <span className="font-medium text-slate-700 block">Locations</span>
              <div className="mt-1 text-blue-600 font-semibold">{selectedLocations.length} selected</div>
            </div>
            <div className="bg-white p-3 rounded-lg">
              <span className="font-medium text-slate-700 block">Pain Points</span>
              <div className="mt-1 text-blue-600 font-semibold">{selectedPainPoints.length} selected</div>
            </div>
            <div className="bg-white p-3 rounded-lg">
              <span className="font-medium text-slate-700 block">Total Criteria</span>
              <div className="mt-1 text-emerald-600 font-bold">{totalCriteria} filters</div>
            </div>
          </div>
        </div>
      )}

      {/* Advanced Filters Toggle */}
      <div className="flex items-center justify-center">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors text-sm"
        >
          <span>Advanced Filters & Refinement</span>
          {showFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
      </div>

      {/* Advanced Filter Grid */}
      {showFilters && (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* Industries */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <Building2 className="h-5 w-5 text-emerald-600" />
              <h3 className="font-semibold text-slate-900">Industries</h3>
              {selectedIndustries.length > 0 && (
                <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full">
                  {selectedIndustries.length}
                </span>
              )}
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {icpCriteria.industries.map((industry) => (
                <button
                  key={industry}
                  onClick={() => handleMultiSelect(industry, selectedIndustries, setSelectedIndustries)}
                  className={`w-full px-3 py-2 text-sm rounded-lg border transition-all text-left ${
                    selectedIndustries.includes(industry)
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  {industry}
                </button>
              ))}
            </div>
          </div>

          {/* Company Sizes */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <Users className="h-5 w-5 text-blue-600" />
              <h3 className="font-semibold text-slate-900">Company Size</h3>
              {selectedSizes.length > 0 && (
                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                  {selectedSizes.length}
                </span>
              )}
            </div>
            <div className="space-y-2">
              {icpCriteria.company_sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => handleMultiSelect(size, selectedSizes, setSelectedSizes)}
                  className={`w-full px-3 py-2 text-sm rounded-lg border transition-all text-left ${
                    selectedSizes.includes(size)
                      ? 'bg-blue-50 border-blue-200 text-blue-700'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Technologies */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <Code className="h-5 w-5 text-indigo-600" />
              <h3 className="font-semibold text-slate-900">Technologies</h3>
              {selectedTechnologies.length > 0 && (
                <span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-full">
                  {selectedTechnologies.length}
                </span>
              )}
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {icpCriteria.technologies.map((tech) => (
                <button
                  key={tech}
                  onClick={() => handleMultiSelect(tech, selectedTechnologies, setSelectedTechnologies)}
                  className={`w-full px-3 py-2 text-sm rounded-lg border transition-all text-left ${
                    selectedTechnologies.includes(tech)
                      ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  {tech}
                </button>
              ))}
            </div>
          </div>

          {/* Revenue Ranges */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <DollarSign className="h-5 w-5 text-green-600" />
              <h3 className="font-semibold text-slate-900">Revenue Range</h3>
              {selectedRevenue.length > 0 && (
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                  {selectedRevenue.length}
                </span>
              )}
            </div>
            <div className="space-y-2">
              {icpCriteria.revenue_ranges.map((range) => (
                <button
                  key={range}
                  onClick={() => handleMultiSelect(range, selectedRevenue, setSelectedRevenue)}
                  className={`w-full px-3 py-2 text-sm rounded-lg border transition-all text-left ${
                    selectedRevenue.includes(range)
                      ? 'bg-green-50 border-green-200 text-green-700'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>

          {/* Pain Points */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <h3 className="font-semibold text-slate-900">Pain Points</h3>
              {selectedPainPoints.length > 0 && (
                <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">
                  {selectedPainPoints.length}
                </span>
              )}
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {icpCriteria.pain_points.map((pain) => (
                <button
                  key={pain}
                  onClick={() => handleMultiSelect(pain, selectedPainPoints, setSelectedPainPoints)}
                  className={`w-full px-3 py-2 text-sm rounded-lg border transition-all text-left ${
                    selectedPainPoints.includes(pain)
                      ? 'bg-red-50 border-red-200 text-red-700'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  {pain}
                </button>
              ))}
            </div>
          </div>

          {/* Locations */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <MapPin className="h-5 w-5 text-amber-600" />
              <h3 className="font-semibold text-slate-900">Locations</h3>
              {selectedLocations.length > 0 && (
                <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs rounded-full">
                  {selectedLocations.length}
                </span>
              )}
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {icpCriteria.locations.map((location) => (
                <button
                  key={location}
                  onClick={() => handleMultiSelect(location, selectedLocations, setSelectedLocations)}
                  className={`w-full px-3 py-2 text-sm rounded-lg border transition-all text-left ${
                    selectedLocations.includes(location)
                      ? 'bg-amber-50 border-amber-200 text-amber-700'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  {location}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}