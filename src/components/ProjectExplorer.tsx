
import { useState } from 'react';
import { ProjectCard } from '@/components/ProjectCard';
import { CalendarView } from '@/components/CalendarView';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, DollarSign, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

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

interface ProjectExplorerProps {
  projects: Project[];
  viewMode?: 'cards' | 'list' | 'calendar';
  onCategoryClick?: (category: string) => void;
}

export const ProjectExplorer = ({ projects, viewMode = 'cards', onCategoryClick }: ProjectExplorerProps) => {
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'status'>('date');

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
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="text-sm font-medium text-black/70">Sort by:</span>
          <button
            onClick={() => setSortBy('date')}
            className={`text-xs px-2 py-1 rounded ${sortBy === 'date' ? 'bg-[#00ec97] text-black' : 'bg-black/10 text-black/70 hover:bg-black/20'}`}
          >
            Launch Date
          </button>
          <button
            onClick={() => setSortBy('name')}
            className={`text-xs px-2 py-1 rounded ${sortBy === 'name' ? 'bg-[#00ec97] text-black' : 'bg-black/10 text-black/70 hover:bg-black/20'}`}
          >
            Name
          </button>
          <button
            onClick={() => setSortBy('status')}
            className={`text-xs px-2 py-1 rounded ${sortBy === 'status' ? 'bg-[#00ec97] text-black' : 'bg-black/10 text-black/70 hover:bg-black/20'}`}
          >
            Status
          </button>
        </div>

        <div className="space-y-3">
          {sortedProjects.map((project) => {
            const launchDate = project.sale_date || project.launch_date || 'TBD';
            const fdvAmount = project.size_fdv || project.expected_fdv;
            const categories = Array.isArray(project.category) ? project.category : [project.category];
            const backers = project.backers || [];

            return (
              <Card key={project.id} className="bg-white border-black/10 shadow-sm hover:shadow-md transition-all duration-200 hover:border-[#00ec97]/30">
                <CardContent className="p-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <Link 
                          to={`/project/${project.id}`}
                          className="font-semibold text-lg text-black hover:text-[#00ec97] transition-colors truncate"
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

                      <div className="flex flex-wrap gap-1 mb-2">
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
                    </div>

                    <div className="flex flex-col md:flex-row gap-4 text-sm shrink-0">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-black/60" />
                        <span className="font-medium text-black/80">{launchDate}</span>
                      </div>
                      
                      {fdvAmount && (
                        <div className="flex items-center space-x-2">
                          <DollarSign className="h-4 w-4 text-black/60" />
                          <span className="font-medium text-black/80">{fdvAmount}</span>
                        </div>
                      )}

                      {backers.length > 0 && (
                        <div className="flex items-center space-x-2">
                          <Users className="h-4 w-4 text-black/60" />
                          <span className="font-medium text-black/70">{backers.length} backers</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    );
  }

  // Cards view (default)
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 mb-4">
        <span className="text-sm font-medium text-black/70">Sort by:</span>
        <button
          onClick={() => setSortBy('date')}
          className={`text-xs px-2 py-1 rounded ${sortBy === 'date' ? 'bg-[#00ec97] text-black' : 'bg-black/10 text-black/70 hover:bg-black/20'}`}
        >
          Launch Date
        </button>
        <button
          onClick={() => setSortBy('name')}
          className={`text-xs px-2 py-1 rounded ${sortBy === 'name' ? 'bg-[#00ec97] text-black' : 'bg-black/10 text-black/70 hover:bg-black/20'}`}
        >
          Name
        </button>
        <button
          onClick={() => setSortBy('status')}
          className={`text-xs px-2 py-1 rounded ${sortBy === 'status' ? 'bg-[#00ec97] text-black' : 'bg-black/10 text-black/70 hover:bg-black/20'}`}
        >
          Status
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedProjects.map((project) => (
          <ProjectCard 
            key={project.id} 
            project={project} 
            onCategoryClick={onCategoryClick}
          />
        ))}
      </div>
    </div>
  );
};
