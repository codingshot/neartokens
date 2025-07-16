
export interface TokenSale {
  id: string;
  name: string;
  symbol: string;
  description: string;
  category: string[];
  sale_date: string;
  size_fdv: string;
  launchpad: string;
  sale_type: string;
  website: string;
  social: {
    twitter: string;
    telegram: string;
  };
  backers: string[];
  key_features: string[];
  partnerships?: string[];
  market_focus?: string;
  traction?: {
    [key: string]: any;
  };
  governance?: string;
  unique_value?: string;
  status: string;
}

export interface TokenListing {
  id: string;
  name: string;
  symbol: string;
  description: string;
  category: string[];
  launch_date: string;
  expected_fdv: string;
  listing_platform: string;
  website: string;
  social: {
    twitter: string;
    telegram: string;
  };
  backers?: string[];
  key_features: string[];
  token_utility?: string;
  adoption?: string;
  traction?: {
    [key: string]: any;
  };
  current_status?: string;
  target_audience?: string;
  status: string;
}

export interface TokenData {
  metadata: {
    title: string;
    description: string;
    last_updated: string;
    period: string;
    launchpad_type: string;
    token_standard: string;
  };
  token_sales: TokenSale[];
  token_listings: TokenListing[];
  ecosystem_programs: {
    liquidity_boost_program: {
      description: string;
      benefits: string[];
    };
    intents_launchpad_roadmap: {
      current_capabilities: string[];
      future_capabilities: string[];
      next_update: string;
    };
  };
  statistics: {
    total_token_sales: number;
    total_token_listings: number;
    total_projects: number;
    categories: {
      [key: string]: number;
    };
    fdv_ranges: {
      [key: string]: number;
    };
  };
  lastUpdate: string;
  version: string;
}

export interface Project {
  id: string;
  name: string;
  symbol: string;
  description: string;
  category: string[];
  type: 'sale' | 'listing';
  progress: number;
  nextMilestone: string;
  dueDate: string;
  team: string[];
  dependencies: string[];
  status: 'on-track' | 'at-risk' | 'delayed' | 'completed';
  key_features: string[];
  backers?: string[];
  size_fdv?: string;
  expected_fdv?: string;
  launchpad?: string;
  listing_platform?: string;
  sale_type?: string;
  website?: string;
  social?: {
    twitter?: string;
    telegram?: string;
  };
}
