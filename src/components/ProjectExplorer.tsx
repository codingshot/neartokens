
import { useState } from 'react';
import { ProjectCard } from '@/components/ProjectCard';
import { CalendarView } from '@/components/CalendarView';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Project } from '@/types/project';

interface ProjectExplorerProps {
  projects: Project[];
  viewMode?: 'cards' | 'list' | 'calendar';
  onCategoryClick?: (category: string) => void;
  sortBy?: 'name' | 'date' | 'status';
}

export const ProjectExplorer = ({ projects, viewMode = 'cards', onCategoryClick, sortBy = 'date' }: ProjectExplorerProps) => {
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

  if (sortedProjects.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-black/40 mb-4">
          <Calendar className="h-16 w-16 mx-auto" />
        </div>
        <h3 className="text-lg font-semibold text-black mb-2">No projects found</h3>
        <p className="text-black/60 mb-4">Try adjusting your search or filters to find more projects.</p>
        <Button 
          onClick={() => window.location.href = '/'}
          variant="outline"
          className="text-sm"
        >
          Clear All Filters
        </Button>
      </div>
    );
  }

  if (viewMode === 'calendar') {
    return <CalendarView projects={sortedProjects} />;
  }

  if (viewMode === 'list') {
    return (
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

          // Helper function to truncate text in the middle
          const truncateMiddle = (text: string, maxLength: number) => {
            if (text.length <= maxLength) return text;
            const start = Math.ceil((maxLength - 3) / 2);
            const end = Math.floor((maxLength - 3) / 2);
            return text.slice(0, start) + '...' + text.slice(-end);
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
                          onClick={() => onCategoryClick?.(cat)}
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
    );
  }

  // Cards view (default)
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {sortedProjects.map((project) => (
        <ProjectCard 
          key={project.id} 
          project={project} 
          onCategoryClick={onCategoryClick}
        />
      ))}
    </div>
  );
};
