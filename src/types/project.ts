
export interface Project {
  id: number | string;
  name: string;
  category: string | string[];
  status: 'upcoming' | 'completed';
  type?: 'sale' | 'listing';
  symbol?: string;
  description?: string;
  sale_date?: string;
  launch_date?: string;
  size_fdv?: string;
  expected_fdv?: string;
  logo?: string;
  backers?: string[];
}

export interface TokensData {
  token_sales: Project[];
  token_listings: Project[];
}
