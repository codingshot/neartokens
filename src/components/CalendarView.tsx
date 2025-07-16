
import { useState } from 'react';
import { Calendar, CalendarDays } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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

interface CalendarViewProps {
  projects: Project[];
}

export const CalendarView = ({ projects }: CalendarViewProps) => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Filter projects that have launch dates
  const projectsWithDates = projects.filter(project => 
    project.sale_date || project.launch_date
  );

  // Group projects by month/year
  const projectsByMonth = projectsWithDates.reduce((acc, project) => {
    const dateStr = project.sale_date || project.launch_date;
    if (!dateStr) return acc;
    
    try {
      const date = new Date(dateStr);
      const month = date.getMonth();
      const year = date.getFullYear();
      const key = `${year}-${month}`;
      
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(project);
    } catch (error) {
      console.warn('Invalid date format:', dateStr);
    }
    
    return acc;
  }, {} as Record<string, Project[]>);

  const currentMonthKey = `${selectedYear}-${selectedMonth}`;
  const currentMonthProjects = projectsByMonth[currentMonthKey] || [];

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

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
          Clear All Filters
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Month/Year Selector */}
      <Card className="bg-white border-black/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-black">
            <Calendar className="h-5 w-5" />
            Launch Calendar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              className="px-3 py-2 border border-black/20 rounded-md bg-white text-sm font-medium focus:border-[#00ec97] focus:outline-none"
            >
              {months.map((month, index) => (
                <option key={index} value={index}>{month}</option>
              ))}
            </select>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="px-3 py-2 border border-black/20 rounded-md bg-white text-sm font-medium focus:border-[#00ec97] focus:outline-none"
            >
              {[2024, 2025, 2026].map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
          
          <p className="text-sm text-black/60">
            Viewing {months[selectedMonth]} {selectedYear} - {currentMonthProjects.length} launches
          </p>
        </CardContent>
      </Card>

      {/* Projects for Selected Month */}
      {currentMonthProjects.length > 0 ? (
        <div className="grid gap-4">
          {currentMonthProjects.map((project) => {
            const categories = Array.isArray(project.category) ? project.category : [project.category];
            const launchDate = project.sale_date || project.launch_date;
            
            return (
              <Card key={project.id} className="bg-white border-black/10 shadow-sm hover:shadow-md transition-all duration-200 hover:border-[#00ec97]/30">
                <CardContent className="p-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
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

                    <div className="text-right">
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
            <h3 className="text-lg font-semibold text-black mb-2">No launches in {months[selectedMonth]} {selectedYear}</h3>
            <p className="text-black/60">Try selecting a different month or clearing your filters.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
