// Enhanced API Integration with Rate Limiting and Error Handling
import { validateApiKey } from './api';

interface RateLimitConfig {
  requestsPerMinute: number;
  requestsPerHour: number;
  costPerRequest: number;
}

interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  rateLimitInfo?: {
    remaining: number;
    resetTime: number;
    cost: number;
  };
  metadata?: {
    executionTime: number;
    retryCount: number;
    cacheHit: boolean;
  };
}

class APIRateLimiter {
  private requests: Map<string, number[]> = new Map();
  private costs: Map<string, number> = new Map();

  constructor(private configs: Map<string, RateLimitConfig>) {}

  canMakeRequest(service: string): { allowed: boolean; waitTime?: number } {
    const config = this.configs.get(service);
    if (!config) return { allowed: true };

    const now = Date.now();
    const serviceRequests = this.requests.get(service) || [];
    
    // Remove requests older than 1 hour
    const recentRequests = serviceRequests.filter(time => now - time < 3600000);
    this.requests.set(service, recentRequests);

    // Check hourly limit
    if (recentRequests.length >= config.requestsPerHour) {
      const oldestRequest = Math.min(...recentRequests);
      const waitTime = 3600000 - (now - oldestRequest);
      return { allowed: false, waitTime };
    }

    // Check per-minute limit
    const lastMinuteRequests = recentRequests.filter(time => now - time < 60000);
    if (lastMinuteRequests.length >= config.requestsPerMinute) {
      const oldestRequest = Math.min(...lastMinuteRequests);
      const waitTime = 60000 - (now - oldestRequest);
      return { allowed: false, waitTime };
    }

    return { allowed: true };
  }

  recordRequest(service: string, cost: number = 0): void {
    const now = Date.now();
    const requests = this.requests.get(service) || [];
    requests.push(now);
    this.requests.set(service, requests);

    const totalCost = this.costs.get(service) || 0;
    this.costs.set(service, totalCost + cost);
  }

  getCostInfo(service: string): { totalCost: number; requestCount: number } {
    return {
      totalCost: this.costs.get(service) || 0,
      requestCount: (this.requests.get(service) || []).length
    };
  }
}

class APICircuitBreaker {
  private failures: Map<string, number> = new Map();
  private lastFailure: Map<string, number> = new Map();
  private state: Map<string, 'closed' | 'open' | 'half-open'> = new Map();

  constructor(
    private failureThreshold: number = 5,
    private resetTimeoutMs: number = 60000
  ) {}

  canExecute(service: string): boolean {
    const currentState = this.state.get(service) || 'closed';
    const now = Date.now();

    if (currentState === 'open') {
      const lastFailureTime = this.lastFailure.get(service) || 0;
      if (now - lastFailureTime > this.resetTimeoutMs) {
        this.state.set(service, 'half-open');
        return true;
      }
      return false;
    }

    return true;
  }

  recordSuccess(service: string): void {
    this.failures.set(service, 0);
    this.state.set(service, 'closed');
  }

  recordFailure(service: string): void {
    const currentFailures = this.failures.get(service) || 0;
    const newFailures = currentFailures + 1;
    
    this.failures.set(service, newFailures);
    this.lastFailure.set(service, Date.now());

    if (newFailures >= this.failureThreshold) {
      this.state.set(service, 'open');
    }
  }

  getState(service: string): string {
    return this.state.get(service) || 'closed';
  }
}

// API Integration Manager
export class APIIntegrationManager {
  private rateLimiter: APIRateLimiter;
  private circuitBreaker: APICircuitBreaker;
  private cache: Map<string, { data: any; timestamp: number; ttl: number }> = new Map();

  constructor() {
    const rateLimitConfigs = new Map([
      ['exa', { requestsPerMinute: 60, requestsPerHour: 1000, costPerRequest: 0.01 }],
      ['phind', { requestsPerMinute: 30, requestsPerHour: 500, costPerRequest: 0.02 }],
      ['perplexity', { requestsPerMinute: 20, requestsPerHour: 300, costPerRequest: 0.05 }],
      ['openai', { requestsPerMinute: 60, requestsPerHour: 2000, costPerRequest: 0.002 }]
    ]);

    this.rateLimiter = new APIRateLimiter(rateLimitConfigs);
    this.circuitBreaker = new APICircuitBreaker();
  }

  private getCacheKey(service: string, params: any): string {
    return `${service}:${JSON.stringify(params)}`;
  }

  private getFromCache(key: string): any | null {
    const cached = this.cache.get(key);
    if (!cached) return null;

    const now = Date.now();
    if (now - cached.timestamp > cached.ttl) {
      this.cache.delete(key);
      return null;
    }

    return cached.data;
  }

  private setCache(key: string, data: any, ttlMs: number = 300000): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttlMs
    });
  }

  async executeAPICall<T>(
    service: string,
    apiCall: () => Promise<T>,
    params: any,
    options: {
      useCache?: boolean;
      cacheTTL?: number;
      retryCount?: number;
      timeout?: number;
    } = {}
  ): Promise<APIResponse<T>> {
    const startTime = Date.now();
    const {
      useCache = true,
      cacheTTL = 300000,
      retryCount = 3,
      timeout = 30000
    } = options;

    // Check cache first
    if (useCache) {
      const cacheKey = this.getCacheKey(service, params);
      const cachedData = this.getFromCache(cacheKey);
      if (cachedData) {
        return {
          success: true,
          data: cachedData,
          metadata: {
            executionTime: Date.now() - startTime,
            retryCount: 0,
            cacheHit: true
          }
        };
      }
    }

    // Check circuit breaker
    if (!this.circuitBreaker.canExecute(service)) {
      return {
        success: false,
        error: `Service ${service} is temporarily unavailable (circuit breaker open)`,
        metadata: {
          executionTime: Date.now() - startTime,
          retryCount: 0,
          cacheHit: false
        }
      };
    }

    // Check rate limits
    const rateLimitCheck = this.rateLimiter.canMakeRequest(service);
    if (!rateLimitCheck.allowed) {
      return {
        success: false,
        error: `Rate limit exceeded for ${service}. Wait ${Math.ceil((rateLimitCheck.waitTime || 0) / 1000)}s`,
        metadata: {
          executionTime: Date.now() - startTime,
          retryCount: 0,
          cacheHit: false
        }
      };
    }

    let lastError: string = '';
    let actualRetryCount = 0;

    for (let attempt = 0; attempt <= retryCount; attempt++) {
      try {
        // Create timeout promise
        const timeoutPromise = new Promise<never>((_, reject) => {
          setTimeout(() => reject(new Error('Request timeout')), timeout);
        });

        // Execute API call with timeout
        const result = await Promise.race([apiCall(), timeoutPromise]);

        // Record success
        this.circuitBreaker.recordSuccess(service);
        this.rateLimiter.recordRequest(service, 0.01); // Base cost

        // Cache result if successful
        if (useCache) {
          const cacheKey = this.getCacheKey(service, params);
          this.setCache(cacheKey, result, cacheTTL);
        }

        const costInfo = this.rateLimiter.getCostInfo(service);

        return {
          success: true,
          data: result,
          rateLimitInfo: {
            remaining: 100 - (costInfo.requestCount % 100), // Simplified
            resetTime: Date.now() + 3600000,
            cost: costInfo.totalCost
          },
          metadata: {
            executionTime: Date.now() - startTime,
            retryCount: actualRetryCount,
            cacheHit: false
          }
        };

      } catch (error) {
        actualRetryCount = attempt;
        lastError = error instanceof Error ? error.message : 'Unknown error';
        
        // Record failure
        this.circuitBreaker.recordFailure(service);

        // Wait before retry (exponential backoff)
        if (attempt < retryCount) {
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
        }
      }
    }

    return {
      success: false,
      error: lastError,
      metadata: {
        executionTime: Date.now() - startTime,
        retryCount: actualRetryCount,
        cacheHit: false
      }
    };
  }

  // Test API connection
  async testAPIConnection(service: string, apiKey: string): Promise<{
    success: boolean;
    latency?: number;
    error?: string;
    details?: any;
  }> {
    if (!validateApiKey(service, apiKey)) {
      return {
        success: false,
        error: 'Invalid API key format'
      };
    }

    const startTime = Date.now();

    try {
      let testCall: () => Promise<any>;

      switch (service) {
        case 'exa':
          testCall = () => this.testExaConnection(apiKey);
          break;
        case 'perplexity':
          testCall = () => this.testPerplexityConnection(apiKey);
          break;
        case 'openai':
          testCall = () => this.testOpenAIConnection(apiKey);
          break;
        default:
          return {
            success: false,
            error: `Unsupported service: ${service}`
          };
      }

      const result = await this.executeAPICall(
        service,
        testCall,
        { test: true },
        { useCache: false, retryCount: 1, timeout: 10000 }
      );

      return {
        success: result.success,
        latency: Date.now() - startTime,
        error: result.error,
        details: result.data
      };

    } catch (error) {
      return {
        success: false,
        latency: Date.now() - startTime,
        error: error instanceof Error ? error.message : 'Connection test failed'
      };
    }
  }

  private async testExaConnection(apiKey: string): Promise<any> {
    const response = await fetch('https://api.exa.ai/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
      },
      body: JSON.stringify({
        query: 'test query',
        numResults: 1,
        type: 'neural'
      })
    });

    if (!response.ok) {
      throw new Error(`Exa API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  private async testPerplexityConnection(apiKey: string): Promise<any> {
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-small-128k-online',
        messages: [
          { role: 'user', content: 'Test connection' }
        ],
        max_tokens: 10
      })
    });

    if (!response.ok) {
      throw new Error(`Perplexity API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  private async testOpenAIConnection(apiKey: string): Promise<any> {
    const response = await fetch('https://api.openai.com/v1/models', {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      }
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // Get comprehensive API status
  getAPIStatus(): {
    services: Record<string, {
      circuitBreakerState: string;
      rateLimitInfo: { totalCost: number; requestCount: number };
      cacheSize: number;
    }>;
    totalCacheSize: number;
  } {
    const services: Record<string, any> = {};
    
    for (const service of ['exa', 'phind', 'perplexity', 'openai']) {
      services[service] = {
        circuitBreakerState: this.circuitBreaker.getState(service),
        rateLimitInfo: this.rateLimiter.getCostInfo(service),
        cacheSize: Array.from(this.cache.keys()).filter(key => key.startsWith(service)).length
      };
    }

    return {
      services,
      totalCacheSize: this.cache.size
    };
  }

  // Clear cache for optimization
  clearCache(service?: string): void {
    if (service) {
      for (const [key] of this.cache) {
        if (key.startsWith(service)) {
          this.cache.delete(key);
        }
      }
    } else {
      this.cache.clear();
    }
  }
}

// Global instance
export const apiManager = new APIIntegrationManager();