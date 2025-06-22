// API integration functions for SmartICP
// Handles both demo mode and production API calls

interface ICPCriteria {
  industries: string[];
  company_sizes: string[];
  revenue_ranges?: string[];
  business_models?: string[];
  growth_stages?: string[];
  technologies: string[];
  locations: string[];
  description?: string;
}

interface ExaResult {
  company_name: string;
  domain: string;
  similarity_score: number;
  description: string;
  source: string;
}

interface PhindSignal {
  company: string;
  hiring_signals: string[];
  tech_stack: string[];
  growth_indicators: string[];
  headcount_growth?: string;
}

interface PerplexityContact {
  company: string;
  contacts: Array<{
    name: string;
    title: string;
    email: string;
    linkedin: string;
    background: string;
  }>;
}

// Exa API Integration
export async function callExaAPI(
  icpCriteria: ICPCriteria, 
  apiKey: string,
  demoMode: boolean = false
): Promise<ExaResult[]> {
  if (demoMode || !apiKey) {
    // Return demo data
    const demoData = await import('../data/exa_results.json');
    return demoData.results;
  }

  try {
    // Construct search query from ICP criteria
    const searchQuery = constructExaQuery(icpCriteria);
    
    const response = await fetch('https://api.exa.ai/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
      },
      body: JSON.stringify({
        query: searchQuery,
        type: 'neural',
        useAutoprompt: true,
        numResults: 20,
        includeDomains: [],
        excludeDomains: ['linkedin.com', 'facebook.com', 'twitter.com'],
        startCrawlDate: '2023-01-01',
        endCrawlDate: new Date().toISOString().split('T')[0],
        startPublishedDate: '2023-01-01',
        endPublishedDate: new Date().toISOString().split('T')[0],
        includeText: ['company', 'about', 'products', 'services'],
        textLengthMin: 100,
        textLengthMax: 2000
      })
    });

    if (!response.ok) {
      throw new Error(`Exa API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Transform Exa results to our format
    return data.results.map((result: any) => ({
      company_name: extractCompanyName(result.title, result.url),
      domain: new URL(result.url).hostname,
      similarity_score: result.score || 0.8,
      description: result.text?.substring(0, 200) || 'No description available',
      source: 'Exa AI Search'
    }));

  } catch (error) {
    console.error('Exa API call failed:', error);
    // Fallback to demo data
    const demoData = await import('../data/exa_results.json');
    return demoData.results;
  }
}

// Phind API Integration (simulated - Phind doesn't have public API)
export async function callPhindAPI(
  companies: string[],
  apiKey: string,
  demoMode: boolean = false
): Promise<PhindSignal[]> {
  if (demoMode || !apiKey) {
    const demoData = await import('../data/phind_signals.json');
    return demoData.signals;
  }

  // In production, this would integrate with job boards and tech signal APIs
  // For now, simulate the call
  try {
    const signals = await Promise.all(
      companies.map(async (company) => {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        return {
          company,
          hiring_signals: ['Senior Software Engineer', 'Product Manager', 'DevOps Engineer'],
          tech_stack: ['React', 'Node.js', 'AWS', 'PostgreSQL'],
          growth_indicators: ['Recent funding', 'Team expansion', 'New product launch'],
          headcount_growth: '+25% YoY'
        };
      })
    );

    return signals;
  } catch (error) {
    console.error('Phind API simulation failed:', error);
    const demoData = await import('../data/phind_signals.json');
    return demoData.signals;
  }
}

// Perplexity API Integration
export async function callPerplexityAPI(
  companies: string[],
  apiKey: string,
  demoMode: boolean = false
): Promise<PerplexityContact[]> {
  if (demoMode || !apiKey) {
    const demoData = await import('../data/perplexity_contacts.json');
    return demoData.contacts;
  }

  try {
    const contacts = await Promise.all(
      companies.map(async (company) => {
        const query = `Find the CEO, CTO, and key executives at ${company} including their names, titles, and contact information`;
        
        const response = await fetch('https://api.perplexity.ai/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: 'llama-3.1-sonar-small-128k-online',
            messages: [
              {
                role: 'system',
                content: 'You are a research assistant that finds company executives and their contact information from publicly available sources.'
              },
              {
                role: 'user',
                content: query
              }
            ],
            max_tokens: 1000,
            temperature: 0.1,
            return_citations: true
          })
        });

        if (!response.ok) {
          throw new Error(`Perplexity API error: ${response.status}`);
        }

        const data = await response.json();
        
        // Parse the response to extract contact information
        const contacts = parsePerplexityResponse(data.choices[0].message.content);
        
        return {
          company,
          contacts
        };
      })
    );

    return contacts;
  } catch (error) {
    console.error('Perplexity API call failed:', error);
    const demoData = await import('../data/perplexity_contacts.json');
    return demoData.contacts;
  }
}

// Helper functions
function constructExaQuery(criteria: ICPCriteria): string {
  const parts = [];
  
  if (criteria.industries.length > 0) {
    parts.push(`companies in ${criteria.industries.join(' or ')}`);
  }
  
  if (criteria.technologies.length > 0) {
    parts.push(`using ${criteria.technologies.join(' or ')}`);
  }
  
  if (criteria.company_sizes.length > 0) {
    parts.push(`company size ${criteria.company_sizes.join(' or ')}`);
  }
  
  if (criteria.locations.length > 0) {
    parts.push(`located in ${criteria.locations.join(' or ')}`);
  }
  
  if (criteria.description) {
    parts.push(criteria.description);
  }
  
  return parts.join(' ');
}

function extractCompanyName(title: string, url: string): string {
  // Extract company name from title or URL
  const domain = new URL(url).hostname;
  const domainParts = domain.split('.');
  const companyName = domainParts[0];
  
  // Clean up the name
  return companyName.charAt(0).toUpperCase() + companyName.slice(1);
}

function parsePerplexityResponse(content: string): Array<{
  name: string;
  title: string;
  email: string;
  linkedin: string;
  background: string;
}> {
  // This would parse the LLM response to extract structured contact data
  // For now, return a placeholder structure
  return [
    {
      name: 'John Doe',
      title: 'CEO',
      email: 'john@company.com',
      linkedin: 'linkedin.com/in/johndoe',
      background: 'Former executive at Fortune 500 company'
    }
  ];
}

// API key validation
export function validateApiKey(service: string, key: string): boolean {
  if (!key) return false;
  
  switch (service) {
    case 'exa':
      return key.length > 20 && key.startsWith('exa_');
    case 'openai':
      return key.length > 20 && key.startsWith('sk-');
    case 'perplexity':
      return key.length > 20 && key.startsWith('pplx-');
    default:
      return key.length > 10;
  }
}