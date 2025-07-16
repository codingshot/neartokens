
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Calendar, TrendingUp, DollarSign, Users, Coins, Clock, ArrowRight, AlertCircle } from 'lucide-react';
import { ProjectExplorer } from '@/components/ProjectExplorer';
import { CalendarView } from '@/components/CalendarView';

const Index = () => {
  const [activeTab, setActiveTab] = useState('projects');

  // Fetch token data
  const { data: tokenData, isLoading, error } = useQuery({
    queryKey: ['tokens'],
    queryFn: async () => {
      const response = await fetch('/data/tokens.json');
      if (!response.ok) {
        throw new Error('Failed to fetch token data');
      }
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f2f1e9] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00ec97] mx-auto mb-4"></div>
          <p className="text-black/60 font-medium">Loading NEAR token data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#f2f1e9] flex items-center justify-center">
        <div className="text-center space-y-4">
          <AlertCircle className="h-12 w-12 text-red-600 mx-auto" />
          <div>
            <p className="text-red-600 font-medium mb-2">Error loading token data</p>
            <p className="text-black/60 text-sm">Please refresh the page or try again later</p>
          </div>
        </div>
      </div>
    );
  }

  // Safely combine token sales and listings for projects
  const tokenSales = tokenData?.token_sales || [];
  const tokenListings = tokenData?.token_listings || [];
  
  const allProjects = [
    ...tokenSales.map((project: any) => ({ ...project, type: 'sale' })),
    ...tokenListings.map((project: any) => ({ ...project, type: 'listing' }))
  ];

  // Get upcoming launches for ticker
  const upcomingLaunches = allProjects
    .filter((project: any) => project.status === 'upcoming')
    .slice(0, 8);

  // Calculate stats with better error handling
  const stats = [
    {
      title: "Total Projects",
      value: tokenData?.statistics?.total_projects || allProjects.length,
      icon: Coins,
      color: "text-[#00ec97]"
    },
    {
      title: "Token Sales",
      value: tokenData?.statistics?.total_token_sales || tokenSales.length,
      icon: TrendingUp,
      color: "text-[#ff7966]"
    },
    {
      title: "Token Listings",
      value: tokenData?.statistics?.total_token_listings || tokenListings.length,
      icon: Clock,
      color: "text-[#17d9d4]"
    },
    {
      title: "AI Projects",
      value: tokenData?.statistics?.categories?.AI || 0,
      icon: Users,
      color: "text-[#9797ff]"
    },
    {
      title: "DeFi Projects",
      value: tokenData?.statistics?.categories?.DeFi || 0,
      icon: DollarSign,
      color: "text-[#00ec97]"
    },
    {
      title: "Q3 2025 Launches",
      value: allProjects.filter((p: any) => 
        (p.sale_date?.includes('Q3 2025') || p.launch_date?.includes('Q3 2025'))
      ).length,
      icon: Calendar,
      color: "text-[#ff7966]"
    }
  ];

  return (
    <div className="min-h-screen bg-[#f2f1e9]">
      {/* Header */}
      <header className="bg-white border-b border-black/10 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-black">NEAR Tokens</h1>
              <p className="text-black/60 font-medium">Track upcoming token launches on NEAR Protocol</p>
            </div>
            <Badge className="bg-[#00ec97]/10 text-[#00ec97] border-[#00ec97]/20 font-semibold">
              {tokenData?.metadata?.period || 'Live'}
            </Badge>
          </div>
        </div>
      </header>

      {/* Upcoming Launches Ticker */}
      {upcomingLaunches.length > 0 && (
        <div className="bg-gradient-to-r from-[#00ec97]/5 to-[#17d9d4]/5 border-b border-black/10 py-3 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-black font-semibold">
                <TrendingUp className="h-4 w-4" />
                <span className="text-sm">Upcoming Launches:</span>
              </div>
              <div className="flex-1 overflow-hidden">
                <div className="flex space-x-6 animate-[marquee_30s_linear_infinite]">
                  {upcomingLaunches.map((project: any, index: number) => (
                    <div key={`${project.id}-${index}`} className="flex items-center space-x-2 whitespace-nowrap">
                      <span className="text-sm font-medium text-black">{project.name}</span>
                      <span className="text-xs text-black/60">
                        {project.sale_date || project.launch_date}
                      </span>
                      <ArrowRight className="h-3 w-3 text-black/40" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="bg-white border-black/10 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-4 text-center">
                <div className={`inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-current/10 to-current/5 mb-2 ${stat.color}`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
                <div className="text-2xl font-bold text-black mb-1">{stat.value}</div>
                <div className="text-xs text-black/60 font-medium">{stat.title}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-white border border-black/10">
            <TabsTrigger value="projects" className="font-medium">
              Token Projects ({allProjects.length})
            </TabsTrigger>
            <TabsTrigger value="calendar" className="font-medium">
              Launch Calendar
            </TabsTrigger>
          </TabsList>

          <TabsContent value="projects" className="space-y-6">
            <ProjectExplorer projects={allProjects} />
          </TabsContent>

          <TabsContent value="calendar" className="space-y-6">
            <CalendarView projects={allProjects} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
