import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ProjectExplorer } from '@/components/ProjectExplorer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Search, Grid3X3, List, Filter, TrendingUp, Clock, Users, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

interface TokenData {
  id: string;
  name: string;
  symbol?: string;
  description?: string;
  category: string | string[];
  status: 'upcoming' | 'completed';
  type?: 'sale' | 'listing';
  sale_date?: string;
  launch_date?: string;
  size_fdv?: string;
  expected_fdv?: string;
  backers?: string[];
  social?: {
    twitter?: string;
    telegram?: string;
  };
  website?: string;
  key_features?: string[];
}

interface TokensData {
  token_sales: TokenData[];
  token_listings: TokenData[];
  metadata: {
    title: string;
    description: string;
    last_updated: string;
  };
  statistics: {
    total_token_sales: number;
    total_token_listings: number;
    total_projects: number;
    categories: Record<string, number>;
  };
}

const fetchTokensData = async (): Promise<TokensData> => {
  const response = await fetch('/data/tokens.json');
  if (!response.ok) {
    throw new Error('Failed to fetch tokens data');
  }
  return response.json();
};

const Index = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Initialize state from URL parameters
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [selectedStatus, setSelectedStatus] = useState(searchParams.get('status') || 'all');
  const [selectedType, setSelectedType] = useState(searchParams.get('type') || 'all');
  const [viewMode, setViewMode] = useState<'cards' | 'list' | 'calendar'>(
    (searchParams.get('view') as 'cards' | 'list' | 'calendar') || 'cards'
  );

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchTerm) params.set('search', searchTerm);
    if (selectedCategory !== 'all') params.set('category', selectedCategory);
    if (selectedStatus !== 'all') params.set('status', selectedStatus);
    if (selectedType !== 'all') params.set('type', selectedType);
    if (viewMode !== 'cards') params.set('view', viewMode);
    
    setSearchParams(params);
  }, [searchTerm, selectedCategory, selectedStatus, selectedType, viewMode, setSearchParams]);

  const { data: tokensData, isLoading, error } = useQuery({
    queryKey: ['tokens'],
    queryFn: fetchTokensData,
  });

  const allProjects = useMemo(() => {
    if (!tokensData) return [];
    return [...tokensData.token_sales, ...tokensData.token_listings];
  }, [tokensData]);

  const categories = useMemo(() => {
    const cats = new Set<string>();
    allProjects.forEach(project => {
      if (Array.isArray(project.category)) {
        project.category.forEach(cat => cats.add(cat));
      } else {
        cats.add(project.category);
      }
    });
    return Array.from(cats).sort();
  }, [allProjects]);

  const filteredProjects = useMemo(() => {
    let filtered = allProjects.filter(project => {
      const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           project.description?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategory === 'all' || 
                             (Array.isArray(project.category) 
                               ? project.category.includes(selectedCategory)
                               : project.category === selectedCategory);
      
      const matchesStatus = selectedStatus === 'all' || project.status === selectedStatus;
      
      const matchesType = selectedType === 'all' || project.type === selectedType;

      return matchesSearch && matchesCategory && matchesStatus && matchesType;
    });

    // Enhanced sorting by launch date with proper quarter and prefix handling
    return filtered.sort((a, b) => {
      const dateA = a.sale_date || a.launch_date || '';
      const dateB = b.sale_date || b.launch_date || '';
      
      // Prioritize upcoming status
      if (a.status === 'upcoming' && b.status !== 'upcoming') return -1;
      if (b.status === 'upcoming' && a.status !== 'upcoming') return 1;
      
      // Custom date parsing for quarters and prefixes
      const parseCustomDate = (dateStr: string) => {
        if (!dateStr) return { year: 9999, quarter: 5, prefix: 2 }; // Sort empty dates last
        
        // Extract year
        const yearMatch = dateStr.match(/(\d{4})/);
        const year = yearMatch ? parseInt(yearMatch[1]) : 9999;
        
        // Extract quarter
        let quarter = 5; // Default for non-quarter dates
        const quarterMatch = dateStr.match(/Q(\d)/);
        if (quarterMatch) {
          quarter = parseInt(quarterMatch[1]);
        }
        
        // Extract prefix (Early = 0, no prefix = 1, Late = 2)
        let prefix = 1;
        if (dateStr.toLowerCase().includes('early')) {
          prefix = 0;
        } else if (dateStr.toLowerCase().includes('late')) {
          prefix = 2;
        }
        
        return { year, quarter, prefix };
      };
      
      const parsedA = parseCustomDate(dateA);
      const parsedB = parseCustomDate(dateB);
      
      // Sort by year first
      if (parsedA.year !== parsedB.year) {
        return parsedA.year - parsedB.year;
      }
      
      // Then by quarter
      if (parsedA.quarter !== parsedB.quarter) {
        return parsedA.quarter - parsedB.quarter;
      }
      
      // Finally by prefix (Early < no prefix < Late)
      return parsedA.prefix - parsedB.prefix;
    });
  }, [allProjects, searchTerm, selectedCategory, selectedStatus, selectedType]);

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedStatus('all');
    setSelectedType('all');
    setSearchParams(new URLSearchParams());
  };

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f2f1e9] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00ec97]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#f2f1e9] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-semibold text-black mb-2">Error loading data</h1>
          <p className="text-black/60">Please try refreshing the page</p>
        </div>
      </div>
    );
  }

  const upcomingProjects = allProjects.filter(p => p.status === 'upcoming').slice(0, 20);

  return (
    <div className="min-h-screen bg-[#f2f1e9]">
      {/* Hero Section - Reduced padding */}
      <section className="bg-white border-b border-black/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 md:py-6">
          <div className="text-center mb-4">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-black mb-2">
              NEAR Token Season <span className="text-[#00ec97]">2025</span>
            </h1>
            <p className="text-lg md:text-xl text-black/70 font-medium max-w-3xl mx-auto leading-relaxed">
              Track upcoming token launches and listings on NEAR Protocol. 
              Stay updated with the latest projects building on NEAR's ecosystem.
            </p>
          </div>

          {/* Stats Cards - Reduced spacing */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-[#00ec97]/5 border-[#00ec97]/20 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-4 md:p-6 text-center">
                <TrendingUp className="h-8 w-8 text-[#00ec97] mx-auto mb-2" />
                <div className="text-2xl md:text-3xl font-bold text-black mb-1">
                  {tokensData?.statistics.total_projects || 0}
                </div>
                <div className="text-sm text-black/60 font-medium">Total Projects</div>
              </CardContent>
            </Card>
            
            <Card className="bg-[#ff7966]/5 border-[#ff7966]/20 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-4 md:p-6 text-center">
                <Clock className="h-8 w-8 text-[#ff7966] mx-auto mb-2" />
                <div className="text-2xl md:text-3xl font-bold text-black mb-1">
                  {tokensData?.statistics.total_token_sales || 0}
                </div>
                <div className="text-sm text-black/60 font-medium">Token Sales</div>
              </CardContent>
            </Card>
            
            <Card className="bg-[#9797ff]/5 border-[#9797ff]/20 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-4 md:p-6 text-center">
                <Users className="h-8 w-8 text-[#9797ff] mx-auto mb-2" />
                <div className="text-2xl md:text-3xl font-bold text-black mb-1">
                  {tokensData?.statistics.total_token_listings || 0}
                </div>
                <div className="text-sm text-black/60 font-medium">Token Listings</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Upcoming Tokens Ticker */}
      {upcomingProjects.length > 0 && (
        <div className="w-full bg-black/5 border-b border-black/10 py-2 overflow-hidden">
          <div className="flex items-center mb-1 px-6">
            <Clock className="h-4 w-4 mr-2 text-black/60" />
            <h3 className="text-sm font-semibold text-black">Upcoming Tokens</h3>
          </div>
          
          <div className="relative">
            <div className="animate-scroll flex whitespace-nowrap">
              {/* Duplicate items for seamless loop */}
              {[...upcomingProjects, ...upcomingProjects, ...upcomingProjects].map((project, index) => {
                const launchDate = project.sale_date || project.launch_date || 'TBD';
                const symbol = project.symbol || 'TBD';
                
                return (
                  <Link
                    key={`${project.id}-${index}`}
                    to={`/project/${project.id}`}
                    className="inline-flex items-center bg-white rounded-lg border border-black/10 p-2 mx-2 hover:border-[#00ec97] hover:shadow-sm transition-all duration-200 flex-shrink-0"
                  >
                    <div className="flex items-center space-x-2">
                      <div className="font-semibold text-sm text-black">
                        {project.name}
                      </div>
                      <div className="text-xs text-black/60 font-medium">
                        ${symbol}
                      </div>
                      <Badge className="bg-[#00ec97]/10 text-black border-[#00ec97]/30 text-xs px-2 py-0.5">
                        {launchDate}
                      </Badge>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-lg border border-black/10 p-4 md:p-6 mb-6 shadow-sm">
          <div className="flex flex-col space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-black/40" />
              <Input
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-black/20 focus:border-[#00ec97] font-medium"
              />
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              {/* Category Filter */}
              <div>
                <label className="block text-xs font-semibold text-black/70 mb-1">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-black/20 rounded-md bg-white text-sm font-medium focus:border-[#00ec97] focus:outline-none"
                >
                  <option value="all">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-xs font-semibold text-black/70 mb-1">Status</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-black/20 rounded-md bg-white text-sm font-medium focus:border-[#00ec97] focus:outline-none"
                >
                  <option value="all">All Status</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              {/* Type Filter */}
              <div>
                <label className="block text-xs font-semibold text-black/70 mb-1">Type</label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full px-3 py-2 border border-black/20 rounded-md bg-white text-sm font-medium focus:border-[#00ec97] focus:outline-none"
                >
                  <option value="all">All Types</option>
                  <option value="sale">Token Sale</option>
                  <option value="listing">Token Listing</option>
                </select>
              </div>

              {/* View Mode */}
              <div>
                <label className="block text-xs font-semibold text-black/70 mb-1">View</label>
                <div className="flex border border-black/20 rounded-md overflow-hidden">
                  <Button
                    variant={viewMode === 'cards' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('cards')}
                    className={`flex-1 rounded-none border-none ${viewMode === 'cards' ? 'bg-[#00ec97] text-black' : 'hover:bg-black/5'}`}
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className={`flex-1 rounded-none border-none ${viewMode === 'list' ? 'bg-[#00ec97] text-black' : 'hover:bg-black/5'}`}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'calendar' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('calendar')}
                    className={`flex-1 rounded-none border-none ${viewMode === 'calendar' ? 'bg-[#00ec97] text-black' : 'hover:bg-black/5'}`}
                  >
                    <Calendar className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Active Filters */}
            {(selectedCategory !== 'all' || selectedStatus !== 'all' || selectedType !== 'all' || searchTerm) && (
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-xs font-semibold text-black/70">Active filters:</span>
                {searchTerm && (
                  <Badge variant="outline" className="text-xs font-medium">
                    Search: "{searchTerm}"
                    <button
                      onClick={() => setSearchTerm('')}
                      className="ml-1 hover:text-red-500"
                    >
                      ×
                    </button>
                  </Badge>
                )}
                {selectedCategory !== 'all' && (
                  <Badge variant="outline" className="text-xs font-medium">
                    {selectedCategory}
                    <button
                      onClick={() => setSelectedCategory('all')}
                      className="ml-1 hover:text-red-500"
                    >
                      ×
                    </button>
                  </Badge>
                )}
                {selectedStatus !== 'all' && (
                  <Badge variant="outline" className="text-xs font-medium">
                    {selectedStatus}
                    <button
                      onClick={() => setSelectedStatus('all')}
                      className="ml-1 hover:text-red-500"
                    >
                      ×
                    </button>
                  </Badge>
                )}
                {selectedType !== 'all' && (
                  <Badge variant="outline" className="text-xs font-medium">
                    {selectedType}
                    <button
                      onClick={() => setSelectedType('all')}
                      className="ml-1 hover:text-red-500"
                    >
                      ×
                    </button>
                  </Badge>
                )}
                <Button
                  onClick={clearAllFilters}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                >
                  Clear All
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Results */}
        <div className="bg-white rounded-lg border border-black/10 shadow-sm">
          <div className="p-4 md:p-6 border-b border-black/10">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <h2 className="text-xl font-semibold text-black">
                Projects ({filteredProjects.length})
              </h2>
            </div>
          </div>
          
          <div className="p-4 md:p-6">
            <ProjectExplorer 
              projects={filteredProjects} 
              viewMode={viewMode} 
              onCategoryClick={handleCategoryClick}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
