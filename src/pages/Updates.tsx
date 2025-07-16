
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, TrendingUp, Coins, Plus, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Updates = () => {
  const updates = [
    {
      date: "2025-07-15",
      title: "NEAR Token Season 2025 Database Launch",
      description: "Launched comprehensive tracking for 12 token projects across NEAR ecosystem including AI, DeFi, and Wallet categories.",
      type: "launch",
      projects: ["Intellex", "ConsumerFi", "VIBES", "Fraction AI"]
    },
    {
      date: "2025-07-14",
      title: "Intents Launchpad Integration",
      description: "Added support for NEAR's Intents-based launchpad with fixed price and auction style sales tracking.",
      type: "feature",
      projects: []
    },
    {
      date: "2025-07-13",
      title: "Q3/Q4 2025 Launch Schedule",
      description: "Updated token launch calendar with confirmed dates for major NEAR ecosystem projects.",
      type: "data",
      projects: ["RHEA Finance", "PublicAI", "HOT Protocol"]
    },
    {
      date: "2025-07-12",
      title: "FDV Tracking & Categories",
      description: "Added comprehensive FDV range tracking and category filtering for AI, DeFi, Wallet, and RWA projects.",
      type: "feature",
      projects: []
    },
    {
      date: "2025-07-11",
      title: "Backer Network Database",
      description: "Integrated investor and backer information for all tracked token projects.",
      type: "data",
      projects: ["Shima Capital", "Animoca Brands", "Foresight Ventures"]
    }
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'launch':
        return 'bg-[#00ec97]/10 text-[#00ec97] border-[#00ec97]/30';
      case 'feature':
        return 'bg-[#17d9d4]/10 text-[#17d9d4] border-[#17d9d4]/30';
      case 'data':
        return 'bg-[#ff7966]/10 text-[#ff7966] border-[#ff7966]/30';
      default:
        return 'bg-black/5 text-black border-black/20';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'launch':
        return TrendingUp;
      case 'feature':
        return Plus;
      case 'data':
        return Coins;
      default:
        return Calendar;
    }
  };

  return (
    <div className="min-h-screen bg-[#f2f1e9]">
      {/* Header */}
      <header className="bg-white border-b border-black/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-black mb-4">NEAR Tokens Updates</h1>
            <p className="text-xl text-black/70 max-w-2xl mx-auto font-medium">
              Latest updates on NEAR Protocol token launches, project additions, and platform improvements
            </p>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="bg-white border-black/10 shadow-sm">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-[#00ec97]/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Coins className="h-6 w-6 text-[#00ec97]" />
              </div>
              <div className="text-3xl font-bold text-black mb-2">12</div>
              <div className="text-black/60 font-medium">Total Projects</div>
            </CardContent>
          </Card>
          
          <Card className="bg-white border-black/10 shadow-sm">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-[#17d9d4]/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-6 w-6 text-[#17d9d4]" />
              </div>
              <div className="text-3xl font-bold text-black mb-2">Q3-Q4</div>
              <div className="text-black/60 font-medium">2025 Launches</div>
            </CardContent>
          </Card>
          
          <Card className="bg-white border-black/10 shadow-sm">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-[#ff7966]/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-6 w-6 text-[#ff7966]" />
              </div>
              <div className="text-3xl font-bold text-black mb-2">8</div>
              <div className="text-black/60 font-medium">AI Projects</div>
            </CardContent>
          </Card>
        </div>

        {/* Updates Timeline */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-black mb-8">Recent Updates</h2>
          
          {updates.map((update, index) => {
            const Icon = getTypeIcon(update.type);
            
            return (
              <Card key={index} className="bg-white border-black/10 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-current/10 to-current/5 rounded-lg flex items-center justify-center">
                          <Icon className="h-5 w-5 text-black" />
                        </div>
                        <div>
                          <CardTitle className="text-xl font-semibold text-black">{update.title}</CardTitle>
                          <p className="text-sm text-black/60 font-medium">{update.date}</p>
                        </div>
                      </div>
                    </div>
                    <Badge className={`font-medium ${getTypeColor(update.type)}`}>
                      {update.type}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <p className="text-black/80 font-medium leading-relaxed">{update.description}</p>
                  
                  {update.projects.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-black">Related Projects:</p>
                      <div className="flex flex-wrap gap-2">
                        {update.projects.map((project, projectIndex) => (
                          <Badge key={projectIndex} variant="outline" className="bg-white border-black/20 text-black font-medium">
                            {project}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Call to Action */}
        <Card className="bg-gradient-to-r from-[#00ec97]/5 to-[#17d9d4]/5 border-black/10 mt-12">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold text-black mb-4">Stay Updated</h3>
            <p className="text-black/70 font-medium mb-6 max-w-2xl mx-auto">
              Track the latest NEAR Protocol token launches and get notified about new project additions to our database.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/"
                className="inline-flex items-center px-6 py-3 bg-[#00ec97] hover:bg-[#00ec97]/90 text-black font-semibold rounded-lg transition-colors"
              >
                View All Projects
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link
                to="/landing"
                className="inline-flex items-center px-6 py-3 border border-black/20 hover:bg-black/5 text-black font-semibold rounded-lg transition-colors"
              >
                Learn More
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Updates;
