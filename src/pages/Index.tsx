
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProjectExplorer } from '@/components/ProjectExplorer';
import { CalendarView } from '@/components/CalendarView';
import { AnalyticsOverview } from '@/components/AnalyticsOverview';
import { ProjectStatusChart } from '@/components/ProjectStatusChart';
import { TwitterFeed } from '@/components/TwitterFeed';
import { Footer } from '@/components/Footer';
import { Search, Filter, Calendar, BarChart3, Zap, TrendingUp, Users, DollarSign, Clock, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

interface Project {
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
  backers?: string[];
}

interface TokensData {
  token_sales: Project[];
  token_listings: Project[];
}

const fetchTokensData = async (): Promise<TokensData> => {
  const response = await fetch('/data/tokens.json');
  if (!response.ok) {
    throw new Error('Failed to fetch tokens data');
  }
  return response.json();
};

export default function Index() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'cards' | 'list' | 'calendar'>('cards');

  const { data: tokensData, isLoading, error } = useQuery({
    queryKey: ['tokens'],
    queryFn: fetchTokensData,
  });

  const projects = tokensData ? [...tokensData.token_sales, ...tokensData.token_listings] : [];
  const upcomingProjects = projects.filter(project => project.status === 'upcoming');

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
  };

  const filteredProjects = projects.filter(project => {
    const searchMatch = project.name.toLowerCase().includes(searchQuery.toLowerCase());
    const categoryMatch = selectedCategory ? (Array.isArray(project.category) ? project.category.includes(selectedCategory) : project.category === selectedCategory) : true;
    return searchMatch && categoryMatch;
  });

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00ec97]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-semibold text-black mb-2">Error loading data</h1>
          <p className="text-black/60">Please try refreshing the page</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      {/* Header */}
      <header className="bg-white border-b border-black/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center justify-between">
            <Link to="/" className="hover:opacity-80 transition-opacity">
              <h1 className="text-lg font-semibold text-black">NEAR Tokens</h1>
            </Link>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Link to="/submit" className="flex items-center space-x-2">
                  <Zap className="h-4 w-4" />
                  <span>Submit Token</span>
                </Link>
              </Button>
              <Button variant="ghost" size="sm">
                <a href="https://www.near.org/blog/token-season-on-near" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2">
                  <ExternalLink className="h-4 w-4" />
                  <span>Blog</span>
                </a>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-white border-b border-black/10 py-6">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl font-semibold text-black mb-3">
            Track token launches on NEAR Protocol ecosystem
          </h2>
          <p className="text-lg text-black/70 font-medium mb-4">
            Stay updated on upcoming and completed token sales, listings, and more.
          </p>
          <div className="flex items-center justify-center space-x-4">
            <Input
              type="text"
              placeholder="Search for tokens..."
              className="max-w-md"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Select onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={null}>All Categories</SelectItem>
                <SelectItem value="DeFi">DeFi</SelectItem>
                <SelectItem value="AI">AI</SelectItem>
                <SelectItem value="Social">Social</SelectItem>
                <SelectItem value="Infrastructure">Infrastructure</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
        </div>
      </section>

      {/* Upcoming Tokens Ticker */}
      <section className="bg-[#00ec97] py-3 overflow-hidden relative">
        <div className="ticker-wrapper">
          <div className="ticker-content">
            {upcomingProjects.concat(upcomingProjects).map((project, index) => (
              <span key={`${project.id}-${index}`} className="ticker-item text-black font-semibold text-lg">
                {project.name} ({project.symbol || 'TBD'}) - {project.status}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-black">
            Token Launches
          </h3>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" onClick={() => setViewMode('cards')}>
              <Search className="h-4 w-4 mr-2" />
              <span>Cards</span>
            </Button>
            <Button variant="outline" size="sm" onClick={() => setViewMode('list')}>
              <Filter className="h-4 w-4 mr-2" />
              <span>List</span>
            </Button>
            <Button variant="outline" size="sm" onClick={() => setViewMode('calendar')}>
              <Calendar className="h-4 w-4 mr-2" />
              <span>Calendar</span>
            </Button>
          </div>
        </div>

        <ProjectExplorer
          projects={filteredProjects}
          viewMode={viewMode}
          onCategoryClick={handleCategoryClick}
        />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
