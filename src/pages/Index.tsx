
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MultiSelect } from '@/components/ui/multi-select';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ProjectExplorer } from '@/components/ProjectExplorer';
import { CalendarView } from '@/components/CalendarView';
import { AnalyticsOverview } from '@/components/AnalyticsOverview';
import { ProjectStatusChart } from '@/components/ProjectStatusChart';
import { TwitterFeed } from '@/components/TwitterFeed';
import { Footer } from '@/components/Footer';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, Filter, Calendar, BarChart3, Zap, TrendingUp, Users, DollarSign, Clock, ExternalLink, BookOpen, Grid2X2, List, ChevronDown, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Project, TokensData } from '@/types/project';

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
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'status'>('date');

  const { data: tokensData, isLoading, error } = useQuery({
    queryKey: ['tokens'],
    queryFn: fetchTokensData,
  });

  // Debug log to check data loading
  console.log('Tokens data loaded:', tokensData);
  console.log('Token sales:', tokensData?.token_sales?.length || 0);
  console.log('Token listings:', tokensData?.token_listings?.length || 0);

  const projects = tokensData ? [...(tokensData.token_sales || []), ...(tokensData.token_listings || [])] : [];
  
  console.log('Total projects:', projects.length);
  console.log('Projects sample:', projects.slice(0, 3));
  
  // Get all unique backers for the filter - improved logic
  const allBackers = React.useMemo(() => {
    const backerSet = new Set<string>();
    projects.forEach(project => {
      if (project.backers && Array.isArray(project.backers)) {
        project.backers.forEach((backer: any) => {
          if (typeof backer === 'string') {
            backerSet.add(backer);
          } else if (typeof backer === 'object' && backer !== null && 'name' in backer) {
            backerSet.add(backer.name);
          }
        });
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
    
    // Fixed backers filtering logic
    const backersMatch = selectedBackers.length === 0 || (
      project.backers && 
      Array.isArray(project.backers) && 
      project.backers.some((backer: any) => {
        const backerName = typeof backer === 'string' ? backer : (typeof backer === 'object' && backer !== null && 'name' in backer ? backer.name : null);
        return backerName && selectedBackers.includes(backerName);
      })
    );
    
    return searchMatch && categoryMatch && backersMatch;
  });

  console.log('Filtered projects:', filteredProjects.length);
  console.log('Search query:', searchQuery);
  console.log('Selected category:', selectedCategory);
  console.log('Selected backers:', selectedBackers);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedBackers([]);
  };

  // Check if any filters are applied
  const hasFilters = searchQuery.trim() !== '' || selectedCategory !== '' || selectedBackers.length > 0;

  // Get active filters for display
  const activeFilters = [];
  if (searchQuery.trim()) activeFilters.push({ type: 'search', value: searchQuery.trim() });
  if (selectedCategory) activeFilters.push({ type: 'category', value: selectedCategory });
  selectedBackers.forEach(backer => activeFilters.push({ type: 'backer', value: backer }));

  const removeFilter = (type: string, value: string) => {
    if (type === 'search') setSearchQuery('');
    if (type === 'category') setSelectedCategory('');
    if (type === 'backer') setSelectedBackers(prev => prev.filter(b => b !== value));
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
          <h2 className="text-2xl sm:text-3xl font-semibold text-black mb-3">
            Track tokens on NEAR Protocol
          </h2>
          <p className="text-base sm:text-lg text-black/70 font-medium mb-4">
            Stay updated on upcoming and completed token sales, listings, and more.
          </p>
          <div className="space-y-4">
            {/* Search Input - Full width */}
            <div className="w-full">
              <Input
                type="text"
                placeholder="Search for tokens..."
                className="w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            {/* Filters Row - All filters on one row for desktop */}
            <div className="flex flex-col lg:flex-row items-center justify-center gap-2 w-full">
              <div className="flex flex-col lg:flex-row items-center gap-2 w-full lg:w-auto">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full lg:w-[140px]">
                    <SelectValue placeholder="Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DeFi">DeFi</SelectItem>
                    <SelectItem value="AI">AI</SelectItem>
                    <SelectItem value="Social">Social</SelectItem>
                    <SelectItem value="Infrastructure">Infrastructure</SelectItem>
                  </SelectContent>
                </Select>
                
                <div className="w-full lg:w-[140px]">
                  <MultiSelect
                    options={allBackers}
                    selected={selectedBackers}
                    onChange={setSelectedBackers}
                    placeholder="Backers"
                    className="w-full"
                  />
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="w-full lg:w-[120px]">
                      <span className="capitalize text-sm">
                        {sortBy === 'date' ? 'Launch Date' : sortBy}
                      </span>
                      <ChevronDown className="ml-1 h-4 w-4 shrink-0" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setSortBy('date')}>
                      Launch Date
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy('name')}>
                      Name
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy('status')}>
                      Status
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <ToggleGroup 
                  type="single" 
                  value={viewMode} 
                  onValueChange={(value) => value && setViewMode(value as 'cards' | 'list' | 'calendar')} 
                  className="border rounded-md w-full lg:w-auto"
                >
                  <ToggleGroupItem value="cards" aria-label="Card view" className="flex-1 lg:flex-initial px-2 sm:px-3">
                    <Grid2X2 className="h-4 w-4" />
                    <span className="sr-only lg:not-sr-only lg:ml-1 hidden lg:inline">Cards</span>
                  </ToggleGroupItem>
                  <ToggleGroupItem value="list" aria-label="List view" className="flex-1 lg:flex-initial px-2 sm:px-3">
                    <List className="h-4 w-4" />
                    <span className="sr-only lg:not-sr-only lg:ml-1 hidden lg:inline">List</span>
                  </ToggleGroupItem>
                  <ToggleGroupItem value="calendar" aria-label="Calendar view" className="flex-1 lg:flex-initial px-2 sm:px-3">
                    <Calendar className="h-4 w-4" />
                    <span className="sr-only lg:not-sr-only lg:ml-1 hidden lg:inline">Calendar</span>
                  </ToggleGroupItem>
                </ToggleGroup>

                {hasFilters && (
                  <Button variant="outline" size="sm" onClick={clearFilters} className="w-full lg:w-auto">
                    Clear Filters
                  </Button>
                )}
              </div>
            </div>
            
            {/* Active Filters Row - Full width */}
            {activeFilters.length > 0 && (
              <div className="flex flex-wrap gap-2 justify-center w-full">
                {activeFilters.map((filter, index) => (
                  <Badge 
                    key={`${filter.type}-${filter.value}-${index}`}
                    variant="secondary" 
                    className="flex items-center gap-1 bg-[#00ec97]/10 text-black border-[#00ec97]/30"
                  >
                    <span className="text-xs font-medium truncate max-w-[120px]" title={filter.value}>
                      {filter.type === 'search' ? 'Search: ' : ''}
                      {filter.value}
                    </span>
                    <button
                      onClick={() => removeFilter(filter.type, filter.value)}
                      className="ml-1 hover:bg-black/10 rounded-full p-0.5 shrink-0"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
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
                className="text-black font-semibold mr-4 sm:mr-8 hover:opacity-80 transition-opacity cursor-pointer inline-flex items-center space-x-2 align-middle"
                style={{ lineHeight: '32px', height: '32px' }}
              >
                <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                  {project.logo ? (
                    <img 
                      src={project.logo} 
                      alt={`${project.name} logo`}
                      className="w-5 h-5 rounded-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          const fallback = parent.querySelector('.fallback-logo') as HTMLElement;
                          if (fallback) {
                            fallback.style.display = 'flex';
                          }
                        }
                      }}
                    />
                  ) : null}
                  <div 
                    className="fallback-logo w-5 h-5 rounded-full bg-black/10 flex items-center justify-center"
                    style={{ display: project.logo ? 'none' : 'flex' }}
                  >
                    <span className="text-[10px] text-black/60 font-medium">
                      {project.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>
                <span className="text-sm sm:text-lg">{project.name}</span>
                {project.symbol && <span className="text-xs sm:text-sm ml-2">${project.symbol}</span>}
                <span className="text-xs ml-2 opacity-75 hidden sm:inline">{project.sale_date || project.launch_date || 'TBD'}</span>
              </Link>
            ))}
            {/* Duplicate for seamless scrolling */}
            {upcomingProjects.map((project, index) => (
              <Link 
                key={`${project.id}-duplicate-${index}`}
                to={`/project/${project.id}`}
                className="text-black font-semibold mr-4 sm:mr-8 hover:opacity-80 transition-opacity cursor-pointer inline-flex items-center space-x-2 align-middle"
                style={{ lineHeight: '32px', height: '32px' }}
              >
                <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                  {project.logo ? (
                    <img 
                      src={project.logo} 
                      alt={`${project.name} logo`}
                      className="w-5 h-5 rounded-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          const fallback = parent.querySelector('.fallback-logo') as HTMLElement;
                          if (fallback) {
                            fallback.style.display = 'flex';
                          }
                        }
                      }}
                    />
                  ) : null}
                  <div 
                    className="fallback-logo w-5 h-5 rounded-full bg-black/10 flex items-center justify-center"
                    style={{ display: project.logo ? 'none' : 'flex' }}
                  >
                    <span className="text-[10px] text-black/60 font-medium">
                      {project.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>
                <span className="text-sm sm:text-lg">{project.name}</span>
                {project.symbol && <span className="text-xs sm:text-sm ml-2">${project.symbol}</span>}
                <span className="text-xs ml-2 opacity-75 hidden sm:inline">{project.sale_date || project.launch_date || 'TBD'}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <ProjectExplorer
          projects={filteredProjects}
          viewMode={viewMode}
          onCategoryClick={handleCategoryClick}
          sortBy={sortBy}
        />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
