
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
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
  backers?: string[];
}

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard = ({ project }: ProjectCardProps) => {
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
  const backers = project.backers || project.team || [];

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

          {/* Categories - More compact */}
          {categories.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {categories.slice(0, 4).map((cat: string) => (
                <Badge key={cat} variant="outline" className="text-xs bg-white border-black/20 text-black font-medium px-1.5 py-0.5 h-5">
                  {cat}
                </Badge>
              ))}
              {categories.length > 4 && (
                <Badge variant="outline" className="text-xs bg-white border-black/20 text-black font-medium px-1.5 py-0.5 h-5">
                  +{categories.length - 4}
                </Badge>
              )}
            </div>
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
          {backers.length > 0 && (
            <div className="flex items-center space-x-3 text-sm">
              <Users className="h-4 w-4 text-black/60 flex-shrink-0" />
              <span className="font-semibold text-black">Backers:</span>
              <span className="text-black/70 font-medium line-clamp-1">
                {backers.slice(0, 2).join(', ')}
                {backers.length > 2 && ` +${backers.length - 2} more`}
              </span>
            </div>
          )}
        </CardContent>
      </Link>
      
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
