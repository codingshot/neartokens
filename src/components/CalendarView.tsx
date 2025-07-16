import { useState } from 'react';
import { Calendar, CalendarDays } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Project } from '@/types/project';

interface CalendarViewProps {
  projects: Project[];
}

export const CalendarView = ({ projects }: CalendarViewProps) => {
  const [selectedPeriod, setSelectedPeriod] = useState('all');

  // Filter projects that have launch dates
  const projectsWithDates = projects.filter(project => 
    project.sale_date || project.launch_date
  );

  // Helper function to extract quarter and year from date strings
  const parseQuarterFromDate = (dateStr: string) => {
    if (!dateStr) return null;
    
    try {
      // Handle quarter format like "Early Q4 2024", "Late Q3 2025", "Q4 2025"
      const quarterMatch = dateStr.match(/(Early|Late)?\s*(Q[1-4])\s*(\d{4})/i);
      if (quarterMatch) {
        const quarter = quarterMatch[2]; // Q1, Q2, Q3, Q4
        const year = quarterMatch[3];
        return { quarter, year };
      }
      
      // Handle regular date format
      const date = new Date(dateStr);
      if (!isNaN(date.getTime())) {
        const year = date.getFullYear();
        const month = date.getMonth();
        const quarter = `Q${Math.floor(month / 3) + 1}`;
        return { quarter, year: year.toString() };
      }
    } catch (error) {
      console.warn('Invalid date format:', dateStr);
    }
    
    return null;
  };

  // Group projects by quarters and periods
  const projectsByPeriod = projectsWithDates.reduce((acc, project) => {
    const dateStr = project.sale_date || project.launch_date;
    if (!dateStr) return acc;
    
    const parsedDate = parseQuarterFromDate(dateStr);
    if (parsedDate) {
      const { quarter, year } = parsedDate;
      
      const allKey = 'all';
      const yearKey = year;
      const quarterKey = `${quarter} ${year}`;
      
      if (!acc[allKey]) acc[allKey] = [];
      if (!acc[yearKey]) acc[yearKey] = [];
      if (!acc[quarterKey]) acc[quarterKey] = [];
      
      acc[allKey].push(project);
      acc[yearKey].push(project);
      acc[quarterKey].push(project);
    }
    
    return acc;
  }, {} as Record<string, Project[]>);

  const currentPeriodProjects = projectsByPeriod[selectedPeriod] || [];

  const getPeriodOptions = () => {
    const options = [{ value: 'all', label: 'All Time' }];
    
    // Add predefined quarters first
    const predefinedQuarters = ['Q3 2024', 'Q4 2024', 'Q1 2025', 'Q2 2025', 'Q3 2025', 'Q4 2025', '2026'];
    
    predefinedQuarters.forEach(period => {
      if (projectsByPeriod[period]?.length > 0) {
        options.push({ value: period, label: period });
      }
    });
    
    // Add any other quarters/years found in data that aren't in predefined list
    const foundPeriods = Object.keys(projectsByPeriod)
      .filter(key => key !== 'all' && !predefinedQuarters.includes(key))
      .sort();
    
    foundPeriods.forEach(period => {
      if (projectsByPeriod[period]?.length > 0) {
        options.push({ value: period, label: period });
      }
    });
    
    return options;
  };

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

  if (projectsWithDates.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-black/40 mb-4">
          <CalendarDays className="h-16 w-16 mx-auto" />
        </div>
        <h3 className="text-lg font-semibold text-black mb-2">No launches found</h3>
        <p className="text-black/60 mb-4">No projects have scheduled launch dates.</p>
        <Button 
          onClick={() => window.location.href = '/'}
          variant="outline"
          className="text-sm"
        >
          Clear Filters
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Period Selector */}
      <Card className="bg-white border-black/10">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-black">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Launch Calendar
            </div>
            <div className="flex items-center gap-3">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-3 py-1 border border-black/20 rounded-md bg-white text-sm font-medium focus:border-[#00ec97] focus:outline-none"
              >
                {getPeriodOptions().map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
              <div className="text-sm font-normal text-black/60">
                {currentPeriodProjects.length} launches
              </div>
            </div>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Projects for Selected Period */}
      {currentPeriodProjects.length > 0 ? (
        <div className="grid gap-4">
          {currentPeriodProjects.map((project) => {
            const categories = Array.isArray(project.category) ? project.category : [project.category];
            const launchDate = project.sale_date || project.launch_date;
            
            return (
              <Card key={project.id} className="bg-white border-black/10 shadow-sm hover:shadow-md transition-all duration-200 hover:border-[#00ec97]/30">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
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
                          className="font-semibold text-lg text-black hover:text-[#00ec97] transition-colors"
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

                      <div className="flex flex-wrap gap-1">
                        {categories.slice(0, 3).map((cat: string) => (
                          <Badge key={cat} variant="outline" className="text-xs bg-white border-black/20 text-black font-medium">
                            {cat}
                          </Badge>
                        ))}
                        {categories.length > 3 && (
                          <Badge variant="outline" className="text-xs bg-white border-black/20 text-black font-medium">
                            +{categories.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Launch Date */}
                    <div className="text-right flex-shrink-0">
                      <div className="text-sm font-semibold text-black mb-1">Launch Date</div>
                      <div className="text-lg font-bold text-[#00ec97]">{launchDate}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="bg-white border-black/10">
          <CardContent className="p-8 text-center">
            <CalendarDays className="h-12 w-12 text-black/40 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-black mb-2">No launches found</h3>
            <p className="text-black/60 mb-4">No projects found for the selected period.</p>
            <Button 
              onClick={() => setSelectedPeriod('all')}
              variant="outline"
              className="text-sm"
            >
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
