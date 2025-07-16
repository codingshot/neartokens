
import { useState, useMemo } from 'react';
import { ProjectExplorer } from '@/components/ProjectExplorer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Search, Grid3X3, List, Filter, TrendingUp, Clock, Users } from 'lucide-react';
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
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'cards' | 'list' | 'calendar'>('cards');

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

    // Sort by upcoming launches first
    return filtered.sort((a, b) => {
      const dateA = a.sale_date || a.launch_date || '';
      const dateB = b.sale_date || b.launch_date || '';
      
      if (a.status === 'upcoming' && b.status !== 'upcoming') return -1;
      if (b.status === 'upcoming' && a.status !== 'upcoming') return 1;
      
      return dateA.localeCompare(dateB);
    });
  }, [allProjects, searchTerm, selectedCategory, selectedStatus, selectedType]);

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedStatus('all');
    setSelectedType('all');
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

  const upcomingProjects = allProjects.filter(p => p.status === 'upcoming').slice(0, 8);

  return (
    <div className="min-h-screen bg-[#f2f1e9]">
      {/* Hero Section */}
      <section className="bg-white border-b border-black/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-black mb-4">
              NEAR Token Season <span className="text-[#00ec97]">2025</span>
            </h1>
            <p className="text-lg md:text-xl text-black/70 font-medium max-w-3xl mx-auto leading-relaxed">
              Track upcoming token launches and listings on NEAR Protocol. 
              Stay updated with the latest projects building on NEAR's ecosystem.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
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

          {/* Upcoming Projects Ticker */}
          {upcomingProjects.length > 0 && (
            <div className="bg-black/5 rounded-lg p-4 mb-6">
              <h3 className="text-sm font-semibold text-black mb-3 flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                Upcoming Projects
              </h3>
              <div className="flex flex-wrap gap-2">
                {upcomingProjects.map((project) => (
                  <Link
                    key={project.id}
                    to={`/project/${project.id}`}
                    className="hover:scale-105 transition-transform"
                  >
                    <Badge 
                      variant="outline" 
                      className="bg-white border-black/20 text-black hover:border-[#00ec97] hover:bg-[#00ec97]/5 cursor-pointer transition-all font-medium px-2 py-1 text-xs"
                    >
                      {project.name}
                      {project.symbol && ` ($${project.symbol})`}
                    </Badge>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

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
            <ProjectExplorer projects={filteredProjects} viewMode={viewMode} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
