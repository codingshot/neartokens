const GITHUB_REPO_OWNER = 'codingshot';
const GITHUB_REPO_NAME = 'neartokens';
const GITHUB_DATA_PATH = 'public/data/tokens.json';
const GITHUB_API_BASE = 'https://api.github.com';

export class GitHubService {
  private static instance: GitHubService;
  private cache: Map<string, any> = new Map();
  private cacheExpiry = 5 * 60 * 1000; // 5 minutes

  static getInstance(): GitHubService {
    if (!GitHubService.instance) {
      GitHubService.instance = new GitHubService();
    }
    return GitHubService.instance;
  }

  async fetchProjectsData(): Promise<any> {
    const cacheKey = 'tokens-data';
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
      return cached.data;
    }

    try {
      // Try to fetch from the raw GitHub content first
      const rawUrl = `https://raw.githubusercontent.com/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/main/${GITHUB_DATA_PATH}`;
      const rawResponse = await fetch(rawUrl);
      
      if (rawResponse.ok) {
        const content = await rawResponse.json();
        this.cache.set(cacheKey, {
          data: content,
          timestamp: Date.now()
        });
        return content;
      }

      // Fallback to GitHub API
      const response = await fetch(
        `${GITHUB_API_BASE}/repos/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/contents/${GITHUB_DATA_PATH}`
      );
      
      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.statusText}`);
      }
      
      const fileData = await response.json();
      const content = JSON.parse(atob(fileData.content));
      
      this.cache.set(cacheKey, {
        data: content,
        timestamp: Date.now()
      });
      
      return content;
    } catch (error) {
      console.error('Error fetching GitHub data:', error);
      // Return mock data as fallback
      return this.getMockTokenData();
    }
  }

  async fetchIssues(): Promise<any[]> {
    const cacheKey = 'issues-data';
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
      return cached.data;
    }

    try {
      const response = await fetch(
        `${GITHUB_API_BASE}/repos/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/issues?state=all&labels=milestone`
      );
      
      if (!response.ok) {
        throw new Error(`Failed to fetch issues: ${response.statusText}`);
      }
      
      const issues = await response.json();
      
      this.cache.set(cacheKey, {
        data: issues,
        timestamp: Date.now()
      });
      
      return issues;
    } catch (error) {
      console.error('Error fetching GitHub issues:', error);
      return [];
    }
  }

  generatePRUrl(projectData: any): string {
    if (projectData.action === 'mark-complete') {
      const baseUrl = 'https://github.com/near/ecosystem-directory/compare/main...';
      const branch = `milestone-complete-${projectData.projectId}-${projectData.milestoneId}`;
      const title = encodeURIComponent(`Mark milestone ${projectData.milestoneId} as complete for ${projectData.projectId}`);
      const body = encodeURIComponent(`This PR marks milestone ${projectData.milestoneId} as completed for project ${projectData.projectId}.

**Changes:**
- Updated milestone status to 'completed'
- Set progress to 100%
- Updated completion date

Please review and merge if the milestone completion criteria have been met.`);
      
      return `${baseUrl}${branch}?quick_pull=1&title=${title}&body=${body}`;
    }

    const baseUrl = 'https://github.com/near/ecosystem-directory/compare/main...';
    const branch = `update-${projectData.id || 'project'}-${Date.now()}`;
    const title = encodeURIComponent(`Update project: ${projectData.name || projectData.id}`);
    const body = encodeURIComponent(`Automated update for project ${projectData.name || projectData.id}`);
    
    return `${baseUrl}${branch}?quick_pull=1&title=${title}&body=${body}`;
  }

  generateIssueUrl(projectId: string, milestoneData: any): string {
    const title = `[${projectId}] Milestone: ${milestoneData.title}`;
    const body = `## Milestone Details\n\n**Project:** ${projectId}\n**Milestone:** ${milestoneData.title}\n**Due Date:** ${milestoneData.dueDate}\n**Status:** ${milestoneData.status}\n\n### Description\n${milestoneData.description || 'No description provided'}\n\n### Acceptance Criteria\n- [ ] Deliverable 1\n- [ ] Deliverable 2\n- [ ] Deliverable 3\n\n### Dependencies\n${milestoneData.dependencies?.map((dep: string) => `- ${dep}`).join('\n') || 'No dependencies'}\n\n---\n*This issue was created via the NEAR Ecosystem Tracker*`;
    
    return `https://github.com/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/issues/new?title=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}&labels=milestone,${projectId}`;
  }

  getDataUrl(): string {
    return `https://github.com/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/blob/main/${GITHUB_DATA_PATH}`;
  }

  getRepoUrl(): string {
    return `https://github.com/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}`;
  }

  private getMockTokenData() {
    return {
      metadata: {
        title: "NEAR Token Season 2025 Database",
        description: "Token launches and listings on NEAR blockchain for 2025",
        last_updated: "2025-07-15",
        period: "July 2025 - January 2026"
      },
      token_sales: [
        {
          id: "intellex",
          name: "Intellex",
          symbol: "TBD",
          description: "Infrastructure for AI agent interoperability across blockchains",
          category: ["AI", "dAGI", "A2A"],
          sale_date: "Q3 2025",
          size_fdv: "< $25mm",
          status: "upcoming"
        }
      ],
      token_listings: [
        {
          id: "rhea_finance",
          name: "RHEA Finance",
          symbol: "RHEA",
          description: "NEAR's premier DEX, Lending, and Multi-Chain Swap Platform",
          category: ["DeFi", "Intents", "Chain Signatures"],
          launch_date: "Q3 2025",
          expected_fdv: "20mm",
          status: "upcoming"
        }
      ],
      statistics: {
        total_projects: 12,
        total_token_sales: 6,
        total_token_listings: 6,
        categories: {
          AI: 8,
          DeFi: 2,
          Wallet: 3
        }
      }
    };
  }
}
