
import { useState } from 'react';
import { ProjectCard } from '@/components/ProjectCard';
import { CalendarView } from '@/components/CalendarView';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Users, Search, Filter, Grid, List, Calendar as CalendarIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Project {
  id: number | string;
  name: string;
  category: string | string[];
  status: 'upcoming' | 'completed';
  progress?: number;
  nextMilestone?: string;
  dueDate?: string;
  team?: string[];
  dependencies?: string[];
  type?: 'sale' | 'listing';
  symbol?: string;
  description?: string;
  sale_date?: string;
  launch_date?: string;
  logo?: string;
  backers?: (string | {
    name: string;
    logo?: string;
    link?: string;
  })[];
}

interface ProjectExplorerProps {
  projects: Project[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedCategory: string;
  handleCategoryChange: (category: string) => void;
  selectedStatus: string;
  handleStatusChange: (status: string) => void;
  selectedType: string;
  handleTypeChange: (type: string) => void;
  viewMode?: 'cards' | 'list' | 'calendar';
  onCategoryClick?: (category: string) => void;
  sortBy?: 'name' | 'date' | 'status';
}

export const ProjectExplorer = ({ 
  projects, 
  searchTerm,
  setSearchTerm,
  selectedCategory,
  handleCategoryChange,
  selectedStatus,
  handleStatusChange,
  selectedType,
  handleTypeChange,
  viewMode = 'cards', 
  onCategoryClick, 
  sortBy = 'date' 
}: ProjectExplorerProps) => {
  const [currentViewMode, setCurrentViewMode] = useState<'cards' | 'list' | 'calendar'>(viewMode);

  // Get unique categories from all projects
  const allCategories = Array.from(new Set(
    projects.flatMap(project => 
      Array.isArray(project.category) ? project.category : [project.category]
    )
  )).sort();

  // Sort projects
  const sortedProjects = [...projects].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'date':
        const dateA = a.sale_date || a.launch_date || '';
        const dateB = b.sale_date || b.launch_date || '';
        // Sort upcoming first, then by date
        if (a.status === 'upcoming' && b.status !== 'upcoming') return -1;
        if (b.status === 'upcoming' && a.status !== 'upcoming') return 1;
        return dateA.localeCompare(dateB);
      case 'status':
        return a.status.localeCompare(b.status);
      default:
        return 0;
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'bg-[#00ec97]/10 text-black border-[#00ec97]/30';
      case 'completed':
        return 'bg-[#17d9d4]/10 text-black border-[#17d9d4]/30';
      default:
        return 'bg-black/5 text-black border-black/20';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'sale':
        return 'bg-[#ff7966]/10 text-black border-[#ff7966]/30';
      case 'listing':
        return 'bg-[#9797ff]/10 text-black border-[#9797ff]/30';
      default:
        return 'bg-black/5 text-black border-black/20';
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-black mb-2">NEAR Token Explorer</h1>
        <p className="text-black/60 text-lg">Discover upcoming token launches and listings on NEAR Protocol</p>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black/40 h-4 w-4" />
          <Input
            placeholder="Search projects, tokens, or descriptions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white border-black/20 text-black placeholder:text-black/40"
          />
        </div>

        {/* Filters Row */}
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-black/60" />
            <span className="text-sm font-medium text-black/80">Filters:</span>
          </div>

          <Select value={selectedCategory} onValueChange={handleCategoryChange}>
            <SelectTrigger className="w-[140px] bg-white border-black/20 text-black">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {allCategories.map(category => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedStatus} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-[120px] bg-white border-black/20 text-black">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="upcoming">Upcoming</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedType} onValueChange={handleTypeChange}>
            <SelectTrigger className="w-[120px] bg-white border-black/20 text-black">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="sale">Token Sale</SelectItem>
              <SelectItem value="listing">Listing</SelectItem>
            </SelectContent>
          </Select>

          {/* View Mode Toggle */}
          <div className="ml-auto flex items-center gap-1 bg-white border border-black/20 rounded-md p-1">
            <Button
              variant={currentViewMode === 'cards' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setCurrentViewMode('cards')}
              className="h-8 w-8 p-0"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={currentViewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setCurrentViewMode('list')}
              className="h-8 w-8 p-0"
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={currentViewMode === 'calendar' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setCurrentViewMode('calendar')}
              className="h-8 w-8 p-0"
            >
              <CalendarIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-4">
        <p className="text-sm text-black/60">
          Showing {sortedProjects.length} project{sortedProjects.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Content */}
      {sortedProjects.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-black/40 mb-4">
            <Calendar className="h-16 w-16 mx-auto" />
          </div>
          <h3 className="text-lg font-semibold text-black mb-2">No projects found</h3>
          <p className="text-black/60 mb-4">Try adjusting your search or filters to find more projects.</p>
          <Button 
            onClick={() => {
              setSearchTerm('');
              handleCategoryChange('all');
              handleStatusChange('all');
              handleTypeChange('all');
            }}
            variant="outline"
            className="text-sm"
          >
            Clear All Filters
          </Button>
        </div>
      ) : currentViewMode === 'calendar' ? (
        <CalendarView projects={sortedProjects} />
      ) : currentViewMode === 'list' ? (
        <div className="space-y-3">
          {sortedProjects.map((project) => {
            const launchDate = project.sale_date || project.launch_date || 'TBD';
            const categories = Array.isArray(project.category) ? project.category : [project.category];
            const backers = project.backers || [];

            // Helper function to get backer name
            const getBackerName = (backer: any): string => {
              if (typeof backer === 'string') return backer;
              if (typeof backer === 'object' && backer !== null && 'name' in backer) return backer.name;
              return '';
            };

            return (
              <Card key={project.id} className="bg-white border-black/10 shadow-sm hover:shadow-md transition-all duration-200 hover:border-[#00ec97]/30">
                <CardContent className="p-3 sm:p-4">
                  <div className="flex items-start gap-3">
                    {/* Project Logo */}
                    <div className="w-12 h-12 flex items-center justify-center flex-shrink-0">
                      {project.logo ? (
                        <img 
                          src={project.logo} 
                          alt={`${project.name} logo`}
                          className="w-12 h-12 rounded-full object-cover"
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
                        className="fallback-logo w-12 h-12 rounded-full bg-black/10 flex items-center justify-center"
                        style={{ display: project.logo ? 'none' : 'flex' }}
                      >
                        <span className="text-lg text-black/60 font-medium">
                          {project.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </div>

                    {/* Project Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <Link 
                          to={`/project/${project.id}`}
                          className="font-semibold text-base sm:text-lg text-black hover:text-[#00ec97] transition-colors truncate"
                        >
                          {project.name}
                        </Link>
                        {project.symbol && (
                          <span className="text-sm text-black/60 font-medium">${project.symbol}</span>
                        )}
                        <Badge className={`font-medium text-xs ${getStatusColor(project.status)}`}>
                          {project.status}
                        </Badge>
                        {project.type && (
                          <Badge className={`font-medium text-xs ${getTypeColor(project.type)}`}>
                            {project.type}
                          </Badge>
                        )}
                      </div>
                      
                      {project.description && (
                        <p className="text-sm text-black/70 font-medium line-clamp-2 mb-2">
                          {project.description}
                        </p>
                      )}

                      <div className="flex flex-wrap gap-1 mb-3">
                        {categories.slice(0, 3).map((cat: string) => (
                          <Badge 
                            key={cat} 
                            variant="outline" 
                            className="text-xs bg-white border-black/20 text-black font-medium px-1.5 py-0.5 h-5 cursor-pointer hover:bg-[#00ec97]/10"
                            onClick={() => handleCategoryChange(cat)}
                          >
                            {cat}
                          </Badge>
                        ))}
                        {categories.length > 3 && (
                          <Badge variant="outline" className="text-xs bg-white border-black/20 text-black font-medium px-1.5 py-0.5 h-5">
                            +{categories.length - 3}
                          </Badge>
                        )}
                      </div>

                      {/* Desktop: Grid layout for project details to prevent overlap */}
                      <div className="hidden sm:grid sm:grid-cols-1 lg:grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center space-x-2 min-w-0">
                          <Calendar className="h-4 w-4 text-black/60 shrink-0" />
                          <span className="font-medium text-black/80 truncate">{launchDate}</span>
                        </div>

                        {backers.length > 0 && (
                          <div className="flex items-center space-x-2 min-w-0">
                            <Users className="h-4 w-4 text-black/60 shrink-0" />
                            <div className="flex items-center gap-1 min-w-0">
                              <span className="font-medium text-black/70 whitespace-nowrap">
                                {backers.length} backer{backers.length > 1 ? 's' : ''}
                              </span>
                              {backers.length > 0 && (
                                <span className="text-black/50 truncate" title={backers.map(getBackerName).join(', ')}>
                                  ({backers.slice(0, 1).map(getBackerName).join('')}{backers.length > 1 ? '...' : ''})
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Mobile: Vertical stack to prevent overlap */}
                      <div className="sm:hidden space-y-2 text-sm">
                        <div className="flex items-center space-x-2 min-w-0">
                          <Calendar className="h-4 w-4 text-black/60 shrink-0" />
                          <span className="font-medium text-black/80 truncate">{launchDate}</span>
                        </div>

                        {backers.length > 0 && (
                          <div className="flex items-center space-x-2 min-w-0">
                            <Users className="h-4 w-4 text-black/60 shrink-0" />
                            <div className="flex items-center gap-1 min-w-0">
                              <span className="font-medium text-black/70 whitespace-nowrap">
                                {backers.length} backer{backers.length > 1 ? 's' : ''}
                              </span>
                              {backers.length > 0 && (
                                <span className="text-black/50 truncate" title={backers.map(getBackerName).join(', ')}>
                                  ({backers.slice(0, 2).map(getBackerName).join(', ')}{backers.length > 2 ? '...' : ''})
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        // Cards view (default)
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {sortedProjects.map((project) => (
            <ProjectCard 
              key={project.id} 
              project={project} 
              onCategoryClick={handleCategoryChange}
            />
          ))}
        </div>
      )}
    </div>
  );
};
