
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Calendar, Users, SlidersHorizontal, X } from 'lucide-react';
import { ProjectCard } from './ProjectCard';

interface Project {
  id: number | string;
  name: string;
  category: string;
  status: 'upcoming' | 'completed';
  progress: number;
  nextMilestone: string;
  dueDate: string;
  team: string[];
  dependencies: string[];
  fundingType?: string;
  description?: string;
  type?: 'sale' | 'listing';
  sale_date?: string;
  launch_date?: string;
  size_fdv?: string;
  expected_fdv?: string;
}

interface ProjectExplorerProps {
  projects: Project[];
}

export const ProjectExplorer = ({ projects }: ProjectExplorerProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [dateRangeFilter, setDateRangeFilter] = useState('all');
  const [fdvFilter, setFdvFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.team.some(member => member.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || project.category === categoryFilter;
    const matchesType = typeFilter === 'all' || project.type === typeFilter;
    
    // Date range filtering for Q3, Q4 2025, etc.
    const matchesDateRange = dateRangeFilter === 'all' ||
      (dateRangeFilter === 'q3-2025' && (project.sale_date?.includes('Q3 2025') || project.launch_date?.includes('Q3 2025'))) ||
      (dateRangeFilter === 'q4-2025' && (project.sale_date?.includes('Q4 2025') || project.launch_date?.includes('Q4 2025'))) ||
      (dateRangeFilter === '2026' && (project.sale_date?.includes('2026') || project.launch_date?.includes('2026')));
    
    // FDV filtering
    const fdvValue = project.size_fdv || project.expected_fdv || '';
    const matchesFdv = fdvFilter === 'all' ||
      (fdvFilter === 'under-25mm' && fdvValue.includes('< $25mm')) ||
      (fdvFilter === '25mm-50mm' && (fdvValue.includes('20mm') || fdvValue.includes('40mm'))) ||
      (fdvFilter === 'over-50mm' && fdvValue.includes('> 50mm')) ||
      (fdvFilter === 'over-160mm' && fdvValue.includes('> $160mm')) ||
      (fdvFilter === 'undisclosed' && (fdvValue.includes('TBC') || fdvValue.includes('Undisclosed')));
    
    return matchesSearch && matchesStatus && matchesCategory && matchesType && matchesDateRange && matchesFdv;
  });

  // Sort projects
  const sortedProjects = [...filteredProjects].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'launch_date':
        const dateA = a.sale_date || a.launch_date || '';
        const dateB = b.sale_date || b.launch_date || '';
        comparison = dateA.localeCompare(dateB);
        break;
      case 'fdv':
        const fdvA = a.size_fdv || a.expected_fdv || '';
        const fdvB = b.size_fdv || b.expected_fdv || '';
        comparison = fdvA.localeCompare(fdvB);
        break;
      case 'status':
        const statusOrder = { 'upcoming': 0, 'completed': 1 };
        comparison = statusOrder[a.status] - statusOrder[b.status];
        break;
      default:
        comparison = a.name.localeCompare(b.name);
    }
    
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const categories = [...new Set(projects.map(p => p.category))];

  const clearAllFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setCategoryFilter('all');
    setDateRangeFilter('all');
    setFdvFilter('all');
    setTypeFilter('all');
  };

  const activeFiltersCount = [
    searchTerm,
    statusFilter !== 'all' && statusFilter,
    categoryFilter !== 'all' && categoryFilter,
    dateRangeFilter !== 'all' && dateRangeFilter,
    fdvFilter !== 'all' && fdvFilter,
    typeFilter !== 'all' && typeFilter
  ].filter(Boolean).length;

  return (
    <div className="space-y-6">
      {/* Token Launch Search and Filters */}
      <Card className="bg-white border-black/10 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-xl font-semibold text-black">
            <div className="flex items-center space-x-3">
              <Search className="h-5 w-5" />
              <span>Token Launch Explorer</span>
            </div>
            <Badge variant="outline" className="font-medium border-black/20 text-black">
              {activeFiltersCount} Active Filter{activeFiltersCount !== 1 ? 's' : ''}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Search Input */}
          <div className="flex flex-col lg:flex-row gap-3">
            <div className="flex-1">
              <Input
                placeholder="Search token projects, descriptions, or teams..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border-black/20 focus:border-[#00ec97] font-medium"
              />
            </div>
          </div>
          
          {/* Filters Row */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="border-black/20 font-medium text-xs h-8">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="sale">Token Sales</SelectItem>
                <SelectItem value="listing">Token Listings</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="border-black/20 font-medium text-xs h-8">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="upcoming">Upcoming</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="border-black/20 font-medium text-xs h-8">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={dateRangeFilter} onValueChange={setDateRangeFilter}>
              <SelectTrigger className="border-black/20 font-medium text-xs h-8">
                <SelectValue placeholder="Launch Period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Periods</SelectItem>
                <SelectItem value="q3-2025">Q3 2025</SelectItem>
                <SelectItem value="q4-2025">Q4 2025</SelectItem>
                <SelectItem value="2026">2026</SelectItem>
              </SelectContent>
            </Select>

            <Select value={fdvFilter} onValueChange={setFdvFilter}>
              <SelectTrigger className="border-black/20 font-medium text-xs h-8">
                <SelectValue placeholder="FDV Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All FDV</SelectItem>
                <SelectItem value="under-25mm">Under $25M</SelectItem>
                <SelectItem value="25mm-50mm">$25M - $50M</SelectItem>
                <SelectItem value="over-50mm">Over $50M</SelectItem>
                <SelectItem value="over-160mm">Over $160M</SelectItem>
                <SelectItem value="undisclosed">Undisclosed</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex gap-1">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className={`text-xs h-8 px-2 ${viewMode === 'grid' ? 'bg-[#00ec97] hover:bg-[#00ec97]/90 text-black font-medium' : 'border-black/20 hover:border-[#00ec97] font-medium'}`}
              >
                Grid
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
                className={`text-xs h-8 px-2 ${viewMode === 'list' ? 'bg-[#00ec97] hover:bg-[#00ec97]/90 text-black font-medium' : 'border-black/20 hover:border-[#00ec97] font-medium'}`}
              >
                List
              </Button>
            </div>
          </div>

          {/* Controls Row */}
          <div className="flex flex-wrap items-center gap-2">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="border-black/20 font-medium text-xs h-8 w-32">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="launch_date">Launch Date</SelectItem>
                <SelectItem value="fdv">FDV</SelectItem>
                <SelectItem value="status">Status</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex gap-1">
              <Button
                variant={sortOrder === 'asc' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSortOrder('asc')}
                className={`text-xs h-8 px-2 ${sortOrder === 'asc' ? 'bg-[#00ec97] hover:bg-[#00ec97]/90 text-black font-medium' : 'border-black/20 hover:border-[#00ec97] font-medium'}`}
              >
                A-Z
              </Button>
              <Button
                variant={sortOrder === 'desc' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSortOrder('desc')}
                className={`text-xs h-8 px-2 ${sortOrder === 'desc' ? 'bg-[#00ec97] hover:bg-[#00ec97]/90 text-black font-medium' : 'border-black/20 hover:border-[#00ec97] font-medium'}`}
              >
                Z-A
              </Button>
            </div>

            {/* Clear Filters */}
            {activeFiltersCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="font-medium hover:bg-black/5 text-xs h-8 px-2 ml-auto"
              >
                <X className="mr-1 h-3 w-3" />
                Clear All
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <p className="text-sm text-black/60 font-medium">
            Showing {sortedProjects.length} of {projects.length} token projects
          </p>
          <div className="flex items-center space-x-2">
            <SlidersHorizontal className="h-4 w-4 text-black/60" />
            <span className="text-sm text-black/60 font-medium">
              Sorted by {sortBy} ({sortOrder === 'asc' ? 'ascending' : 'descending'})
            </span>
          </div>
        </div>
      </div>

      {/* Projects Grid/List */}
      <div className={
        viewMode === 'grid'
          ? 'grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6'
          : 'space-y-4'
      }>
        {sortedProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>

      {sortedProjects.length === 0 && (
        <Card className="bg-white border-black/10 shadow-sm">
          <CardContent className="py-12 text-center">
            <div className="text-black/60">
              <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-2 text-black">No token projects found</h3>
              <p className="font-medium mb-4">Try adjusting your search terms or filters</p>
              <Button
                variant="outline"
                size="sm"
                onClick={clearAllFilters}
                className="font-medium border-black/20 hover:border-[#00ec97]"
              >
                <X className="mr-2 h-4 w-4" />
                Clear All Filters
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
