import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CalendarDays, Coins, DollarSign, TrendingUp, Zap } from 'lucide-react';
import { ProjectExplorer } from '@/components/ProjectExplorer';
import { CalendarView } from '@/components/CalendarView';
import { useQuery } from '@tanstack/react-query';
import { useIsMobile } from '@/hooks/use-mobile';

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const isMobile = useIsMobile();

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

  // Combine token sales and listings for unified view
  const allProjects = tokenData ? [
    ...tokenData.token_sales.map((token: any) => ({
      ...token,
      type: 'sale',
      progress: token.status === 'upcoming' ? 25 : 100,
      nextMilestone: `Token Sale - ${token.sale_date}`,
      dueDate: token.sale_date,
      team: token.backers || [],
      dependencies: [],
      status: token.status === 'upcoming' ? 'on-track' : 'completed'
    })),
    ...tokenData.token_listings.map((token: any) => ({
      ...token,
      type: 'listing',
      progress: token.status === 'upcoming' ? 45 : 100,
      nextMilestone: `Token Listing - ${token.launch_date}`,
      dueDate: token.launch_date,
      team: token.backers || [],
      dependencies: [],
      status: token.status === 'upcoming' ? 'on-track' : 'completed'
    }))
  ] : [];

  // Calculate ecosystem stats
  const ecosystemStats = tokenData ? {
    totalProjects: tokenData.statistics.total_projects,
    tokenSales: tokenData.statistics.total_token_sales,
    tokenListings: tokenData.statistics.total_token_listings,
    aiProjects: tokenData.statistics.categories.AI,
    defiProjects: tokenData.statistics.categories.DeFi,
    walletProjects: tokenData.statistics.categories.Wallet,
    totalFDV: `$${Object.keys(tokenData.statistics.fdv_ranges).length * 25}M+`
  } : {
    totalProjects: 0,
    tokenSales: 0,
    tokenListings: 0,
    aiProjects: 0,
    defiProjects: 0,
    walletProjects: 0,
    totalFDV: '$0'
  };

  return (
    <div className="bg-[#f2f1e9]">
      {/* Header */}
      <header className="bg-white border-b border-black/10 px-4 sm:px-6 py-4 sm:py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
            <div className="text-center lg:text-left">
              <h1 className="text-2xl sm:text-3xl font-semibold text-black mb-2">NEAR Tokens</h1>
              <p className="text-sm sm:text-base text-black/70 font-medium">
                Tokens on NEAR, launch schedule
                {isLoading && <span className="ml-2 text-[#17d9d4]">(Loading token data...)</span>}
                {error && <span className="ml-2 text-[#ff7966]">(Using cached data)</span>}
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center lg:justify-end gap-2 sm:gap-4">
              <Badge variant="outline" className="bg-[#00ec97]/10 text-black border-[#00ec97]/30 font-medium text-xs sm:text-sm">
                {ecosystemStats.tokenSales} Token Sales
              </Badge>
              <Badge variant="outline" className="bg-[#17d9d4]/10 text-black border-[#17d9d4]/30 font-medium text-xs sm:text-sm">
                {ecosystemStats.tokenListings} Token Listings
              </Badge>
              <Badge variant="outline" className="bg-[#9797ff]/10 text-black border-[#9797ff]/30 font-medium text-xs sm:text-sm">
                {ecosystemStats.aiProjects} AI Projects
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6 sm:space-y-8">
          <div className="w-full overflow-x-auto">
            <TabsList className={`
              ${isMobile 
                ? 'flex w-full min-w-max bg-white border border-black/10' 
                : 'grid w-full grid-cols-3 lg:w-[600px] bg-white border border-black/10'
              }
            `}>
              <TabsTrigger value="dashboard" className="font-medium data-[state=active]:bg-[#00ec97] data-[state=active]:text-black whitespace-nowrap px-4 sm:px-6">
                Dashboard
              </TabsTrigger>
              <TabsTrigger value="projects" className="font-medium data-[state=active]:bg-[#00ec97] data-[state=active]:text-black whitespace-nowrap px-4 sm:px-6">
                Projects
              </TabsTrigger>
              <TabsTrigger value="calendar" className="font-medium data-[state=active]:bg-[#00ec97] data-[state=active]:text-black whitespace-nowrap px-4 sm:px-6">
                Calendar
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="dashboard" className="space-y-8">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-white border-black/10 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                  <CardTitle className="text-sm font-semibold text-black">Total Projects</CardTitle>
                  <Coins className="h-5 w-5 text-black/60" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-semibold text-black">{ecosystemStats.totalProjects}</div>
                  <p className="text-sm text-black/60 font-medium mt-1">Token launches & listings</p>
                </CardContent>
              </Card>

              <Card className="bg-white border-black/10 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                  <CardTitle className="text-sm font-semibold text-black">Combined FDV</CardTitle>
                  <DollarSign className="h-5 w-5 text-black/60" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-semibold text-black">{ecosystemStats.totalFDV}</div>
                  <p className="text-sm text-black/60 font-medium mt-1">Estimated market value</p>
                </CardContent>
              </Card>

              <Card className="bg-white border-black/10 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                  <CardTitle className="text-sm font-semibold text-black">Upcoming Sales</CardTitle>
                  <CalendarDays className="h-5 w-5 text-black/60" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-semibold text-[#00ec97]">{ecosystemStats.tokenSales}</div>
                  <p className="text-sm text-black/60 font-medium mt-1">Q3-Q4 2025 schedule</p>
                </CardContent>
              </Card>

              <Card className="bg-white border-black/10 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                  <CardTitle className="text-sm font-semibold text-black">AI Category</CardTitle>
                  <Zap className="h-5 w-5 text-[#17d9d4]" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-semibold text-[#17d9d4]">{ecosystemStats.aiProjects}</div>
                  <p className="text-sm text-black/60 font-medium mt-1">Leading sector</p>
                </CardContent>
              </Card>
            </div>

            {/* Featured Projects */}
            <Card className="bg-white border-black/10 shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-black">Featured Token Launches</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {allProjects.slice(0, 6).map((project) => (
                    <div key={project.id} className="p-4 border border-black/10 rounded-lg bg-[#f2f1e9]">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-black">{project.name}</h3>
                          <p className="text-sm text-black/60 font-medium">{project.symbol}</p>
                        </div>
                        <Badge 
                          variant="outline" 
                          className={`${project.type === 'sale' ? 'bg-[#00ec97]/10 border-[#00ec97]/30' : 'bg-[#17d9d4]/10 border-[#17d9d4]/30'} text-black font-medium`}
                        >
                          {project.type === 'sale' ? 'Sale' : 'Listing'}
                        </Badge>
                      </div>
                      <p className="text-sm text-black/70 font-medium mb-3 line-clamp-2">{project.description}</p>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {project.category.slice(0, 2).map((cat: string) => (
                          <Badge key={cat} variant="outline" className="text-xs bg-white border-black/20 text-black font-medium">
                            {cat}
                          </Badge>
                        ))}
                      </div>
                      <div className="text-sm text-black/60 font-medium">
                        {project.type === 'sale' ? project.sale_date : project.launch_date}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Market Overview */}
            <Card className="bg-white border-black/10 shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-black">NEAR Ecosystem Health</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-[#f2f1e9] rounded-lg">
                    <div className="text-2xl font-semibold text-[#00ec97] mb-2">{ecosystemStats.aiProjects}</div>
                    <div className="text-sm text-black/60 font-medium">AI Projects</div>
                  </div>
                  <div className="text-center p-4 bg-[#f2f1e9] rounded-lg">
                    <div className="text-2xl font-semibold text-[#17d9d4] mb-2">{ecosystemStats.defiProjects}</div>
                    <div className="text-sm text-black/60 font-medium">DeFi Projects</div>
                  </div>
                  <div className="text-center p-4 bg-[#f2f1e9] rounded-lg">
                    <div className="text-2xl font-semibold text-[#9797ff] mb-2">{ecosystemStats.walletProjects}</div>
                    <div className="text-sm text-black/60 font-medium">Wallet Projects</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="projects">
            <ProjectExplorer projects={allProjects} />
          </TabsContent>

          <TabsContent value="calendar">
            <CalendarView projects={allProjects} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
