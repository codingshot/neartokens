import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Calendar, DollarSign, ExternalLink, Twitter, MessageCircle, Globe } from 'lucide-react';
import { LoadingSpinner } from '@/components/LoadingSpinner';

interface TokenData {
  id: string;
  name: string;
  symbol?: string;
  description?: string;
  category: string | string[];
  status: 'upcoming' | 'completed';
  type?: 'sale' | 'listing';
  sale_date?: string;
  launch_date?: string;
  size_fdv?: string;
  expected_fdv?: string;
  backers?: string[];
  social?: {
    twitter?: string;
    telegram?: string;
  };
  website?: string;
  key_features?: string[];
  partnerships?: string[];
  traction?: Record<string, any>;
  token_utility?: string;
  governance?: string;
}

interface TokensData {
  token_sales: TokenData[];
  token_listings: TokenData[];
}

const fetchTokensData = async (): Promise<TokensData> => {
  const response = await fetch('/data/tokens.json');
  if (!response.ok) {
    throw new Error('Failed to fetch tokens data');
  }
  return response.json();
};

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  
  const { data: tokensData, isLoading, error } = useQuery({
    queryKey: ['tokens'],
    queryFn: fetchTokensData,
  });

  console.log('ProjectDetail - URL ID:', id);
  console.log('ProjectDetail - Tokens Data:', tokensData);

  if (isLoading) {
    return <LoadingSpinner centered />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#f2f1e9] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-semibold text-black mb-2">Error loading data</h1>
          <p className="text-black/60">Please try refreshing the page</p>
        </div>
      </div>
    );
  }

  const allProjects = [...(tokensData?.token_sales || []), ...(tokensData?.token_listings || [])];
  console.log('ProjectDetail - All Projects:', allProjects);
  console.log('ProjectDetail - All Project IDs:', allProjects.map(p => p.id));
  
  // Enhanced ID matching with multiple fallback strategies
  let project = null;
  
  if (id) {
    // Strategy 1: Exact match
    project = allProjects.find(p => p.id === id);
    
    // Strategy 2: Case-insensitive exact match
    if (!project) {
      project = allProjects.find(p => p.id.toLowerCase() === id.toLowerCase());
    }
    
    // Strategy 3: Remove underscores and match
    if (!project) {
      const normalizedId = id.replace(/_/g, '').toLowerCase();
      project = allProjects.find(p => p.id.replace(/_/g, '').toLowerCase() === normalizedId);
    }
    
    // Strategy 4: Match by name (case-insensitive)
    if (!project) {
      const normalizedId = id.replace(/_/g, ' ').toLowerCase();
      project = allProjects.find(p => p.name.toLowerCase() === normalizedId);
    }
    
    // Strategy 5: Partial name match
    if (!project) {
      const searchTerm = id.replace(/_/g, ' ').toLowerCase();
      project = allProjects.find(p => 
        p.name.toLowerCase().includes(searchTerm) || 
        p.id.toLowerCase().includes(searchTerm)
      );
    }
  }

  console.log('ProjectDetail - Found Project:', project);

  if (!project) {
    return (
      <div className="min-h-screen bg-[#f2f1e9] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-semibold text-black mb-2">Project not found</h1>
          <p className="text-black/60 mb-4">The project you're looking for doesn't exist.</p>
          <p className="text-sm text-black/50 mb-2">Looking for ID: {id}</p>
          <p className="text-sm text-black/50 mb-4">Available IDs:</p>
          <div className="text-xs text-black/40 mb-4 max-w-lg">
            {allProjects.map(p => p.id).join(', ')}
          </div>
          <Link to="/">
            <Button variant="outline">Back to All Launches</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Check if data exists for each section
  const hasOverviewData = project.key_features?.length > 0 || project.token_utility;
  const hasDetailsData = project.partnerships?.length > 0 || project.traction;
  const hasBackersData = project.backers?.length > 0;

  // Check if social links exist
  const hasSocialLinks = project.website || project.social?.twitter || project.social?.telegram;

  // Determine available tabs and default tab
  const availableTabs = [];
  if (hasOverviewData) availableTabs.push('overview');
  if (hasDetailsData) availableTabs.push('details');
  if (hasBackersData) availableTabs.push('backers');

  const defaultTab = availableTabs[0] || 'overview';

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

  const categories = Array.isArray(project.category) ? project.category : [project.category];
  const launchDate = project.sale_date || project.launch_date;
  const fdvAmount = project.size_fdv || project.expected_fdv;

  return (
    <div className="min-h-screen bg-[#f2f1e9]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 md:py-8">
        {/* Header */}
        <div className="mb-6">
          <Link to="/" className="inline-flex items-center text-black/60 hover:text-black mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            All Launches
          </Link>
          
          <div className="bg-white rounded-lg border border-black/10 p-6 shadow-sm">
            <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-4">
              <div>
                <h1 className="text-3xl font-bold text-black mb-2">
                  {project.name}
                  {project.symbol && (
                    <span className="text-xl text-black/60 ml-2">${project.symbol}</span>
                  )}
                </h1>
                {project.description && (
                  <p className="text-lg text-black/70 font-medium leading-relaxed">
                    {project.description}
                  </p>
                )}
              </div>
              
              <div className="flex flex-col gap-2">
                <Badge className={`font-medium ${getStatusColor(project.status)}`}>
                  {project.status}
                </Badge>
                {project.type && (
                  <Badge className={`font-medium ${getTypeColor(project.type)}`}>
                    {project.type}
                  </Badge>
                )}
              </div>
            </div>

            {/* Key Info */}
            <div className={`grid grid-cols-1 ${hasSocialLinks ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-4 mb-4`}>
              {launchDate && (
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-black/60" />
                  <div>
                    <span className="font-semibold text-black">Launch Date:</span>
                    <p className="text-black/80">{launchDate}</p>
                  </div>
                </div>
              )}
              
              {fdvAmount && (
                <div className="flex items-center space-x-3">
                  <DollarSign className="h-5 w-5 text-black/60" />
                  <div>
                    <span className="font-semibold text-black">
                      {project.status === 'upcoming' ? 'Expected FDV:' : 'FDV:'}
                    </span>
                    <p className="text-black/80">{fdvAmount}</p>
                  </div>
                </div>
              )}

              {/* Social Links - Only show if any social links exist */}
              {hasSocialLinks && (
                <div className="flex space-x-3">
                  {project.website && (
                    <a
                      href={project.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-10 h-10 bg-black/5 hover:bg-black/10 rounded-lg transition-colors"
                    >
                      <Globe className="h-5 w-5 text-black/60" />
                    </a>
                  )}
                  {project.social?.twitter && (
                    <a
                      href={project.social.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-10 h-10 bg-black/5 hover:bg-black/10 rounded-lg transition-colors"
                    >
                      <Twitter className="h-5 w-5 text-black/60" />
                    </a>
                  )}
                  {project.social?.telegram && (
                    <a
                      href={project.social.telegram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-10 h-10 bg-black/5 hover:bg-black/10 rounded-lg transition-colors"
                    >
                      <MessageCircle className="h-5 w-5 text-black/60" />
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-2">
              {categories.map((cat: string) => (
                <Badge key={cat} variant="outline" className="bg-white border-black/20 text-black font-medium">
                  {cat}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Content Tabs - Only show if there are available tabs */}
        {availableTabs.length > 0 && (
          <Tabs defaultValue={defaultTab} className="space-y-4">
            <TabsList className={`grid w-full grid-cols-${availableTabs.length} bg-white border border-black/10`}>
              {hasOverviewData && <TabsTrigger value="overview">Overview</TabsTrigger>}
              {hasDetailsData && <TabsTrigger value="details">Details</TabsTrigger>}
              {hasBackersData && <TabsTrigger value="backers">Backers</TabsTrigger>}
            </TabsList>

            {hasOverviewData && (
              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Key Features */}
                  {project.key_features && project.key_features.length > 0 && (
                    <Card className="bg-white border-black/10">
                      <CardHeader>
                        <CardTitle className="text-black">Key Features</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {project.key_features.map((feature, index) => (
                            <li key={index} className="flex items-start space-x-2">
                              <span className="w-1.5 h-1.5 bg-[#00ec97] rounded-full mt-2 flex-shrink-0"></span>
                              <span className="text-black/80 font-medium">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )}

                  {/* Token Utility */}
                  {project.token_utility && (
                    <Card className="bg-white border-black/10">
                      <CardHeader>
                        <CardTitle className="text-black">Token Utility</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-black/80 font-medium">{project.token_utility}</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>
            )}

            {hasDetailsData && (
              <TabsContent value="details" className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Partnerships */}
                  {project.partnerships && project.partnerships.length > 0 && (
                    <Card className="bg-white border-black/10">
                      <CardHeader>
                        <CardTitle className="text-black">Partnerships</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {project.partnerships.map((partner, index) => (
                            <Badge key={index} variant="outline" className="bg-[#00ec97]/5 border-[#00ec97]/30 text-black">
                              {partner}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Traction */}
                  {project.traction && (
                    <Card className="bg-white border-black/10">
                      <CardHeader>
                        <CardTitle className="text-black">Traction</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {Object.entries(project.traction).map(([key, value]) => (
                            <div key={key} className="flex justify-between">
                              <span className="font-medium text-black/70 capitalize">{key.replace(/_/g, ' ')}:</span>
                              <span className="font-semibold text-black">{String(value)}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>
            )}

            {hasBackersData && (
              <TabsContent value="backers" className="space-y-4">
                <Card className="bg-white border-black/10">
                  <CardHeader>
                    <CardTitle className="text-black">Backers & Investors</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {project.backers?.map((backer, index) => (
                        <div key={index} className="p-3 bg-black/5 rounded-lg">
                          <span className="font-medium text-black">{backer}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            )}
          </Tabs>
        )}

        {/* Show message if no tabs are available */}
        {availableTabs.length === 0 && (
          <Card className="bg-white border-black/10">
            <CardContent className="p-8 text-center">
              <p className="text-black/60">Additional project details are not available at this time.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ProjectDetail;
