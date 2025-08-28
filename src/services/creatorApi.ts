interface Creator {
  id: string;
  name: string;
  role: string;
  avatar: string;
  tagline: string;
  followers: number;
  platform: string;
  topics: string[];
  style: string;
  profilePhoto: string;
  gender: string;
  ageGroup: string;
  ethnicity: string;
  careerStage: string;
  hasRecruitingExperience: boolean;
  contentStyle: string[];
  knownFor: string;
  subCategory: string[];
  targetAudience: string[];
  followers_detail?: Record<string, number>;
  linkedinUrl?: string;
  instagramUrl?: string;
  tiktokUrl?: string;
  website?: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  total?: number;
  count?: number;
  message?: string;
}

interface CreatorFilters {
  limit?: number;
  offset?: number;
  role?: string;
  platform?: string;
}

class CreatorApiService {
  private baseUrl: string;
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
  }

  private getCacheKey(url: string, params?: any): string {
    return `${url}${params ? JSON.stringify(params) : ''}`;
  }

  private isValidCache(timestamp: number): boolean {
    return Date.now() - timestamp < this.CACHE_DURATION;
  }

  private async fetchWithCache<T>(
    endpoint: string, 
    params?: any
  ): Promise<ApiResponse<T>> {
    const cacheKey = this.getCacheKey(endpoint, params);
    const cached = this.cache.get(cacheKey);

    if (cached && this.isValidCache(cached.timestamp)) {
      return cached.data;
    }

    try {
      const url = new URL(`${this.baseUrl}${endpoint}`);
      
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            url.searchParams.append(key, value.toString());
          }
        });
      }

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ApiResponse<T> = await response.json();
      
      // Cache successful responses
      this.cache.set(cacheKey, {
        data,
        timestamp: Date.now()
      });

      return data;

    } catch (error) {
      console.error(`API Error for ${endpoint}:`, error);
      throw new Error(`Failed to fetch data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getAllCreators(filters?: CreatorFilters): Promise<Creator[]> {
    try {
      const response = await this.fetchWithCache<Creator[]>('/api/creators', filters);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch creators');
      }

      return response.data;
    } catch (error) {
      console.error('Error fetching creators:', error);
      // Return empty array as fallback
      return [];
    }
  }

  async getCreatorById(id: string): Promise<Creator | null> {
    try {
      const response = await this.fetchWithCache<Creator>(`/api/creators/${id}`);
      
      if (!response.success) {
        return null;
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching creator ${id}:`, error);
      return null;
    }
  }

  async getCreatorsByRole(role: string): Promise<Creator[]> {
    return this.getAllCreators({ role });
  }

  async getCreatorsByPlatform(platform: string): Promise<Creator[]> {
    return this.getAllCreators({ platform });
  }

  getImageUrl(filename: string): string {
    if (!filename) return '';
    
    // Handle both old and new formats
    if (filename.startsWith('/api/images/')) {
      return `${this.baseUrl}${filename}`;
    }
    
    if (filename.includes('profile_photos/')) {
      const imageName = filename.split('/').pop();
      return `${this.baseUrl}/api/images/${imageName}`;
    }
    
    return `${this.baseUrl}/api/images/${filename}`;
  }

  clearCache(): void {
    this.cache.clear();
  }

  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/health`);
      return response.ok;
    } catch {
      return false;
    }
  }
}

export const creatorApi = new CreatorApiService();
export type { Creator, CreatorFilters };
export default CreatorApiService;