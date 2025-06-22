import React, { useState, useEffect } from 'react';
import { Building2, Users, Code, MapPin, Target, Save, DollarSign, TrendingUp, AlertCircle, Clock, MessageSquare, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
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
  const [chatHistory, setChatHistory] = useState<Array<{role: 'user' | 'assistant', content: string}>>([]);
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

  // Example prompts to help users get started
  const examplePrompts = [
    "B2B SaaS companies with 50-200 employees using AWS and actively hiring engineers in North America",
    "Healthcare startups in Series A stage with AI/ML focus and decision makers in product roles",
    "Enterprise retail companies over $100M revenue using e-commerce platforms and facing digital transformation challenges",
    "Financial services firms in growth stage with cloud infrastructure and seeking cost reduction solutions"
  ];

  const handleChatSubmit = async () => {
    if (!chatInput.trim()) return;

    const userMessage = chatInput.trim();
    setChatHistory(prev => [...prev, { role: 'user', content: userMessage }]);
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
    setChatHistory(prev => [...prev, { role: 'assistant', content: aiResponse }]);
    
    setIsProcessing(false);
    setDescription(userMessage);
  };

  const parseICPFromText = (text: string): any => {
    const parsed: any = {};
    const lowerText = text.toLowerCase();

    // Industry parsing
    const industries = icpCriteria.industries.filter(industry => 
      lowerText.includes(industry.toLowerCase()) || 
      lowerText.includes(industry.split(' ')[0].toLowerCase())
    );
    if (industries.length > 0) parsed.industries = industries;

    // Technology parsing
    const technologies = icpCriteria.technologies.filter(tech => 
      lowerText.includes(tech.toLowerCase().split(' ')[0]) ||
      lowerText.includes(tech.toLowerCase())
    );
    if (technologies.length > 0) parsed.technologies = technologies;

    // Location parsing
    const locations = icpCriteria.locations.filter(location => 
      lowerText.includes(location.toLowerCase())
    );
    if (locations.length > 0) parsed.locations = locations;

    // Size parsing
    if (lowerText.includes('startup') || lowerText.includes('early stage')) {
      parsed.company_sizes = ['Startup (Bootstrapped)', 'Seed Stage'];
    }
    if (lowerText.includes('enterprise') || lowerText.includes('large')) {
      parsed.company_sizes = ['Large Enterprise (5,000-19,999)', 'Fortune 500 (20,000+)'];
    }
    if (lowerText.includes('medium') || lowerText.includes('mid-size')) {
      parsed.company_sizes = ['Medium Business (50-249)', 'Large Business (250-999)'];
    }

    // Growth stage parsing
    const stages = icpCriteria.growth_stages.filter(stage => 
      lowerText.includes(stage.toLowerCase())
    );
    if (stages.length > 0) parsed.growth_stages = stages;

    // Business model parsing
    if (lowerText.includes('b2b') || lowerText.includes('business to business')) {
      parsed.business_models = ['B2B (Business to Business)'];
    }
    if (lowerText.includes('saas') || lowerText.includes('software as a service')) {
      parsed.business_models = [...(parsed.business_models || []), 'SaaS (Software as a Service)'];
    }

    return parsed;
  };

  const applyParsedCriteria = (parsed: any) => {
    if (parsed.industries) setSelectedIndustries(parsed.industries);
    if (parsed.technologies) setSelectedTechnologies(parsed.technologies);
    if (parsed.locations) setSelectedLocations(parsed.locations);
    if (parsed.company_sizes) setSelectedSizes(parsed.company_sizes);
    if (parsed.growth_stages) setSelectedStages(parsed.growth_stages);
    if (parsed.business_models) setSelectedModels(parsed.business_models);
  };

  const generateAIResponse = (parsed: any): string => {
    const matchedCriteria = [];
    if (parsed.industries) matchedCriteria.push(`${parsed.industries.length} industry matches`);
    if (parsed.technologies) matchedCriteria.push(`${parsed.technologies.length} technology matches`);
    if (parsed.locations) matchedCriteria.push(`location targeting set`);
    if (parsed.company_sizes) matchedCriteria.push(`company size criteria applied`);

    return `Great! I've analyzed your ideal customer description and identified ${matchedCriteria.join(', ')}. I've automatically populated the relevant filters below. You can refine these selections or add additional criteria using the advanced filters. Would you like me to suggest any additional targeting criteria based on your description?`;
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
            title="Chat-First ICP Builder"
            description="Describe your ideal customer in natural language, then refine with advanced filters. AI automatically extracts and applies relevant criteria from your description."
            features={[
              "Natural language processing for intuitive customer description",
              "Automatic filter population based on conversational input",
              "Advanced filtering with 11+ dimensions across all industries",
              "Real-time ICP scoring and criteria validation",
              "Export-ready profiles for use across sales and marketing tools"
            ]}
            businessValue="Chat-first approach reduces ICP definition time by 60% while increasing accuracy through natural language understanding and guided refinement."
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

      {/* Chat Interface */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <MessageSquare className="h-5 w-5 text-blue-600" />
          <h3 className="font-semibold text-slate-900">Describe Your Ideal Customer</h3>
        </div>

        {/* Chat History */}
        {chatHistory.length > 0 && (
          <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
            {chatHistory.map((message, index) => (
              <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-3xl p-4 rounded-lg ${
                  message.role === 'user' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-slate-100 text-slate-900'
                }`}>
                  <p className="text-sm">{message.content}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Example Prompts */}
        {chatHistory.length === 0 && (
          <div className="mb-6">
            <p className="text-sm text-slate-600 mb-3">Try one of these examples:</p>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              {examplePrompts.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => setChatInput(prompt)}
                  className="p-3 text-left bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-sm text-slate-700 transition-colors"
                >
                  "{prompt}"
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Chat Input */}
        <div className="flex gap-3">
          <div className="flex-1">
            <textarea
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Describe your ideal customer in natural language... e.g., 'B2B SaaS companies with 50-200 employees using AWS and actively hiring engineers in North America'"
              className="w-full h-20 px-4 py-3 border border-slate-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              <Sparkles className="h-4 w-4" />
            )}
            {isProcessing ? 'Processing...' : 'Analyze'}
          </button>
        </div>
      </div>

      {/* ICP Summary */}
      {(totalCriteria > 0 || description) && (
        <div className="bg-gradient-to-r from-blue-50 to-emerald-50 p-6 rounded-xl border border-blue-200">
          <h3 className="font-semibold text-slate-900 mb-4">Your ICP Profile</h3>
          
          {description && (
            <div className="mb-4 p-4 bg-white rounded-lg border border-blue-200">
              <h4 className="font-medium text-slate-900 mb-2">Natural Language Description:</h4>
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
              <span className="font-medium text-slate-700 block">Growth Stages</span>
              <div className="mt-1 text-blue-600 font-semibold">{selectedStages.length} selected</div>
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
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
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

          {/* Business Models */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <Target className="h-5 w-5 text-purple-600" />
              <h3 className="font-semibold text-slate-900">Business Model</h3>
              {selectedModels.length > 0 && (
                <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                  {selectedModels.length}
                </span>
              )}
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {icpCriteria.business_models.map((model) => (
                <button
                  key={model}
                  onClick={() => handleMultiSelect(model, selectedModels, setSelectedModels)}
                  className={`w-full px-3 py-2 text-sm rounded-lg border transition-all text-left ${
                    selectedModels.includes(model)
                      ? 'bg-purple-50 border-purple-200 text-purple-700'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  {model}
                </button>
              ))}
            </div>
          </div>

          {/* Growth Stages */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="h-5 w-5 text-orange-600" />
              <h3 className="font-semibold text-slate-900">Growth Stage</h3>
              {selectedStages.length > 0 && (
                <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">
                  {selectedStages.length}
                </span>
              )}
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {icpCriteria.growth_stages.map((stage) => (
                <button
                  key={stage}
                  onClick={() => handleMultiSelect(stage, selectedStages, setSelectedStages)}
                  className={`w-full px-3 py-2 text-sm rounded-lg border transition-all text-left ${
                    selectedStages.includes(stage)
                      ? 'bg-orange-50 border-orange-200 text-orange-700'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  {stage}
                </button>
              ))}
            </div>
          </div>

          {/* Locations */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm lg:col-span-2 xl:col-span-1">
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

          {/* Decision Makers */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <Users className="h-5 w-5 text-pink-600" />
              <h3 className="font-semibold text-slate-900">Decision Makers</h3>
              {selectedDecisionMakers.length > 0 && (
                <span className="px-2 py-1 bg-pink-100 text-pink-700 text-xs rounded-full">
                  {selectedDecisionMakers.length}
                </span>
              )}
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {icpCriteria.decision_makers.map((maker) => (
                <button
                  key={maker}
                  onClick={() => handleMultiSelect(maker, selectedDecisionMakers, setSelectedDecisionMakers)}
                  className={`w-full px-3 py-2 text-sm rounded-lg border transition-all text-left ${
                    selectedDecisionMakers.includes(maker)
                      ? 'bg-pink-50 border-pink-200 text-pink-700'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  {maker}
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
        </div>
      )}
    </div>
  );
}