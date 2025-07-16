
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, DollarSign, Users } from 'lucide-react';
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
  size_fdv?: string;
  expected_fdv?: string;
  backers?: Array<{
    name: string;
    logo?: string;
    link?: string;
  }> | string[];
}

interface ProjectCardProps {
  project: Project;
  onCategoryClick?: (category: string) => void;
}

export const ProjectCard = ({ project, onCategoryClick }: ProjectCardProps) => {
  // Validate project data
  if (!project || !project.id || !project.name) {
    console.warn('Invalid project data:', project);
    return null;
  }

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

  const launchDate = project.sale_date || project.launch_date || project.dueDate || 'TBD';
  const fdvAmount = project.size_fdv || project.expected_fdv;
  const categories = Array.isArray(project.category) ? project.category : [project.category];
  
  // Handle both old format (string[]) and new format (object[])
  const backers = project.backers || [];
  const normalizedBackers = backers.map((backer, index) => {
    if (typeof backer === 'string') {
      return { name: backer, logo: undefined, link: undefined };
    }
    return {
      name: backer.name || `Backer ${index + 1}`,
      logo: backer.logo,
      link: backer.link
    };
  });

  return (
    <Card className="bg-white border-black/10 shadow-sm hover:shadow-md transition-all duration-200 hover:border-[#00ec97]/30 cursor-pointer group">
      <Link to={`/project/${project.id}`} className="block">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="space-y-2 flex-1">
              <h3 className="font-semibold text-lg text-black group-hover:text-[#00ec97] transition-colors line-clamp-1">
                {project.name}
              </h3>
              {project.symbol && (
                <p className="text-sm text-black/60 font-medium">${project.symbol}</p>
              )}
            </div>
            <div className="flex flex-col gap-1 ml-4">
              <Badge className={`font-medium text-xs ${getStatusColor(project.status)}`}>
                {project.status}
              </Badge>
              {project.type && (
                <Badge className={`font-medium text-xs ${getTypeColor(project.type)}`}>
                  {project.type}
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Description */}
          {project.description && (
            <p className="text-sm text-black/70 font-medium line-clamp-2 leading-relaxed">
              {project.description}
            </p>
          )}

          {/* Launch Date */}
          <div className="flex items-center space-x-3 text-sm">
            <Calendar className="h-4 w-4 text-black/60 flex-shrink-0" />
            <span className="font-semibold text-black">Launch:</span>
            <span className="text-black/80 font-medium">{launchDate}</span>
          </div>

          {/* FDV */}
          {fdvAmount && (
            <div className="flex items-center space-x-3 text-sm">
              <DollarSign className="h-4 w-4 text-black/60 flex-shrink-0" />
              <span className="font-semibold text-black">FDV:</span>
              <span className="text-black/80 font-medium">{fdvAmount}</span>
            </div>
          )}

          {/* Backers */}
          {normalizedBackers.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm">
                <Users className="h-4 w-4 text-black/60 flex-shrink-0" />
                <span className="font-semibold text-black">Backers:</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {normalizedBackers.slice(0, 3).map((backer, index) => (
                  <Badge 
                    key={`${backer.name}-${index}`}
                    variant="outline" 
                    className="text-xs bg-white border-black/20 text-black font-medium px-2 py-1 h-6 flex items-center gap-1"
                  >
                    {backer.logo ? (
                      <Avatar className="h-3 w-3">
                        <AvatarImage src={backer.logo} alt={backer.name} />
                        <AvatarFallback className="text-[8px] bg-black/10">
                          {backer.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    ) : (
                      <div className="h-3 w-3 rounded-full bg-black/10 flex items-center justify-center">
                        <span className="text-[8px] font-medium text-black/60">
                          {backer.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <span className="truncate max-w-[80px]">{backer.name}</span>
                  </Badge>
                ))}
                {normalizedBackers.length > 3 && (
                  <Badge variant="outline" className="text-xs bg-white border-black/20 text-black font-medium px-2 py-1 h-6">
                    +{normalizedBackers.length - 3}
                  </Badge>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Link>

      {/* Categories - Outside of Link to handle clicks */}
      {categories.length > 0 && (
        <div className="px-6 pb-2">
          <div className="flex flex-wrap gap-1">
            {categories.slice(0, 4).map((cat: string) => (
              <Badge 
                key={cat} 
                variant="outline" 
                className="text-xs bg-white border-black/20 text-black font-medium px-1.5 py-0.5 h-5 cursor-pointer hover:bg-[#00ec97]/10 transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onCategoryClick?.(cat);
                }}
              >
                {cat}
              </Badge>
            ))}
            {categories.length > 4 && (
              <Badge variant="outline" className="text-xs bg-white border-black/20 text-black font-medium px-1.5 py-0.5 h-5">
                +{categories.length - 4}
              </Badge>
            )}
          </div>
        </div>
      )}
      
      <div className="px-6 pb-6">
        <Link to={`/project/${project.id}`}>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full font-medium border-black/20 hover:border-[#00ec97] hover:bg-[#00ec97]/5 transition-all duration-200"
          >
            View Details
          </Button>
        </Link>
      </div>
    </Card>
  );
};
