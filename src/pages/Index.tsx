import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MultiSelect } from '@/components/ui/multi-select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProjectExplorer } from '@/components/ProjectExplorer';
import { CalendarView } from '@/components/CalendarView';
import { AnalyticsOverview } from '@/components/AnalyticsOverview';
import { ProjectStatusChart } from '@/components/ProjectStatusChart';
import { TwitterFeed } from '@/components/TwitterFeed';
import { Footer } from '@/components/Footer';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, Filter, Calendar, BarChart3, Zap, TrendingUp, Users, DollarSign, Clock, ExternalLink, BookOpen } from 'lucide-react';
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
  logo?: string;
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

// Helper function to parse dates and convert to comparable format
const parseLaunchDate = (dateStr: string): Date => {
  if (!dateStr) return new Date('9999-12-31'); // Far future for TBD dates
  
  // Handle "Early Q4 2024", "Late Q3 2024", etc.
  const quarterMatch = dateStr.match(/(Early|Late)?\s*(Q[1-4])\s*(\d{4})/i);
  if (quarterMatch) {
    const [, timing, quarter, year] = quarterMatch;
    const quarterNum = parseInt(quarter.replace('Q', ''));
    const yearNum = parseInt(year);
    
    // Convert quarters to months (Q1=Jan-Mar, Q2=Apr-Jun, Q3=Jul-Sep, Q4=Oct-Dec)
    const quarterStartMonth = (quarterNum - 1) * 3;
    
    // For sorting: Early = start of quarter, no timing = middle, Late = end of quarter
    let month = quarterStartMonth + 1; // Default to middle month of quarter
    let day = 15; // Default to middle of month
    
    if (timing?.toLowerCase() === 'early') {
      month = quarterStartMonth; // First month of quarter
      day = 1;
    } else if (timing?.toLowerCase() === 'late') {
      month = quarterStartMonth + 2; // Last month of quarter
      day = 28; // Near end of month
    }
    
    return new Date(yearNum, month, day);
  }
  
  // Try parsing as regular date
  const parsed = new Date(dateStr);
  return isNaN(parsed.getTime()) ? new Date('9999-12-31') : parsed;
};

export default function Index() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedBackers, setSelectedBackers] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'cards' | 'list' | 'calendar'>('cards');

  const { data: tokensData, isLoading, error } = useQuery({
    queryKey: ['tokens'],
    queryFn: fetchTokensData,
  });

  const projects = tokensData ? [...tokensData.token_sales, ...tokensData.token_listings] : [];
  
  // Get all unique backers for the filter
  const allBackers = React.useMemo(() => {
    const backerSet = new Set<string>();
    projects.forEach(project => {
      if (project.backers) {
        project.backers.forEach(backer => backerSet.add(backer));
      }
    });
    return Array.from(backerSet).sort();
  }, [projects]);
  
  // Sort upcoming projects by launch date for ticker
  const upcomingProjects = projects
    .filter(project => project.status === 'upcoming')
    .sort((a, b) => {
      const dateA = parseLaunchDate(a.sale_date || a.launch_date || '');
      const dateB = parseLaunchDate(b.sale_date || b.launch_date || '');
      return dateA.getTime() - dateB.getTime();
    });

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
  };

  const filteredProjects = projects.filter(project => {
    const searchMatch = project.name.toLowerCase().includes(searchQuery.toLowerCase());
    const categoryMatch = !selectedCategory || (Array.isArray(project.category) ? project.category.includes(selectedCategory) : project.category === selectedCategory);
    const backersMatch = selectedBackers.length === 0 || (project.backers && project.backers.some(backer => selectedBackers.includes(backer)));
    return searchMatch && categoryMatch && backersMatch;
  });

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedBackers([]);
  };

  // Check if any filters are applied
  const hasFilters = searchQuery.trim() !== '' || selectedCategory !== '' || selectedBackers.length > 0;

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
            <Link to="/" className="hover:opacity-80 transition-opacity flex items-center space-x-2">
              <img 
                src="/lovable-uploads/2f7587c3-547e-4d5b-b88d-d510b8d304a6.png" 
                alt="NEAR Protocol Logo" 
                className="h-6 w-6"
              />
              <h1 className="text-lg font-semibold text-black">NEAR Tokens</h1>
            </Link>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <a 
                  href="https://near.org/blog/token-season-on-near" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2"
                >
                  <BookOpen className="h-4 w-4" />
                  <span className="hidden sm:inline">Blog</span>
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
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-4">
            <Input
              type="text"
              placeholder="Search for tokens..."
              className="max-w-md"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DeFi">DeFi</SelectItem>
                <SelectItem value="AI">AI</SelectItem>
                <SelectItem value="Social">Social</SelectItem>
                <SelectItem value="Infrastructure">Infrastructure</SelectItem>
              </SelectContent>
            </Select>
            <MultiSelect
              options={allBackers}
              selected={selectedBackers}
              onChange={setSelectedBackers}
              placeholder="Filter by backers"
              className="w-full sm:w-auto"
            />
            {hasFilters && (
              <Button variant="outline" size="sm" onClick={clearFilters}>
                <span className="sm:hidden">Clear</span>
                <span className="hidden sm:inline">Clear Filters</span>
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Upcoming Tokens Ticker */}
      <section className="bg-[#00ec97] py-3 overflow-hidden relative">
        <div className="whitespace-nowrap">
          <div className="inline-block animate-scroll">
            {upcomingProjects.map((project, index) => (
              <Link 
                key={`${project.id}-${index}`}
                to={`/project/${project.id}`}
                className="text-black font-semibold mr-8 hover:opacity-80 transition-opacity cursor-pointer inline-flex items-center space-x-2"
              >
                {project.logo && (
                  <Avatar className="h-5 w-5">
                    <AvatarImage src={project.logo} alt={`${project.name} logo`} />
                    <AvatarFallback className="text-[10px] bg-black/10 text-black/60">
                      {project.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                )}
                <span className="text-lg">{project.name}</span>
                {project.symbol && <span className="text-sm ml-2">${project.symbol}</span>}
                <span className="text-xs ml-2 opacity-75">{project.sale_date || project.launch_date || 'TBD'}</span>
              </Link>
            ))}
            {upcomingProjects.map((project, index) => (
              <Link 
                key={`${project.id}-duplicate-${index}`}
                to={`/project/${project.id}`}
                className="text-black font-semibold mr-8 hover:opacity-80 transition-opacity cursor-pointer inline-flex items-center space-x-2"
              >
                {project.logo && (
                  <Avatar className="h-5 w-5">
                    <AvatarImage src={project.logo} alt={`${project.name} logo`} />
                    <AvatarFallback className="text-[10px] bg-black/10 text-black/60">
                      {project.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                )}
                <span className="text-lg">{project.name}</span>
                {project.symbol && <span className="text-sm ml-2">${project.symbol}</span>}
                <span className="text-xs ml-2 opacity-75">{project.sale_date || project.launch_date || 'TBD'}</span>
              </Link>
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
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Button variant="outline" size="sm" onClick={() => setViewMode('cards')}>
              <Search className="h-4 w-4" />
              <span className="hidden sm:inline sm:ml-2">Cards</span>
            </Button>
            <Button variant="outline" size="sm" onClick={() => setViewMode('list')}>
              <Filter className="h-4 w-4" />
              <span className="hidden sm:inline sm:ml-2">List</span>
            </Button>
            <Button variant="outline" size="sm" onClick={() => setViewMode('calendar')}>
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline sm:ml-2">Calendar</span>
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
