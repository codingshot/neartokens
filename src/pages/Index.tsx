import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProjectExplorer } from '@/components/ProjectExplorer';
import { CalendarView } from '@/components/CalendarView';
import { AnalyticsOverview } from '@/components/AnalyticsOverview';
import { ProjectStatusChart } from '@/components/ProjectStatusChart';
import { TwitterFeed } from '@/components/TwitterFeed';
import { Footer } from '@/components/Footer';
import { Search, Filter, Calendar, BarChart3, Zap, TrendingUp, Users, DollarSign, Clock, ExternalLink } from 'lucide-react';
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

const MOCK_PROJECTS: Project[] = [
  {
    id: '1',
    name: 'Intellex AI',
    category: ['AI', 'DeFi'],
    status: 'upcoming',
    type: 'sale',
    symbol: 'ILX',
    description: 'Decentralized AI compute and data marketplace',
    sale_date: '2024-08-15',
    size_fdv: '$50M',
    expected_fdv: '$200M',
    backers: ['NGC Ventures', 'NEAR Foundation']
  },
  {
    id: '2',
    name: 'VIBES',
    category: ['Social', 'DeFi'],
    status: 'upcoming',
    type: 'listing',
    symbol: 'VIBES',
    description: 'Social sentiment meets synthetic data',
    launch_date: '2024-09-01',
    size_fdv: '$20M',
    expected_fdv: '$80M',
    backers: ['Pantera Capital', 'Dragonfly Capital']
  },
  {
    id: '3',
    name: 'Aether Protocol',
    category: ['Infrastructure', 'DeFi'],
    status: 'completed',
    type: 'sale',
    symbol: 'ATH',
    description: 'Decentralized compute network for Web3',
    sale_date: '2024-07-01',
    size_fdv: '$100M',
    expected_fdv: '$400M',
    backers: ['a16z', 'Coinbase Ventures']
  },
  {
    id: '4',
    name: 'Aurora Cloud',
    category: ['Infrastructure', 'AI'],
    status: 'completed',
    type: 'listing',
    symbol: 'AURC',
    description: 'Decentralized cloud computing platform',
    launch_date: '2024-06-15',
    size_fdv: '$80M',
    expected_fdv: '$320M',
    backers: ['Binance Labs', 'Polychain Capital']
  },
  {
    id: '5',
    name: 'Celestial Exchange',
    category: ['DeFi', 'Infrastructure'],
    status: 'upcoming',
    type: 'sale',
    symbol: 'CELX',
    description: 'Decentralized exchange for NEAR assets',
    sale_date: '2024-10-01',
    size_fdv: '$60M',
    expected_fdv: '$240M',
    backers: ['Sequoia Capital', 'Paradigm']
  },
  {
    id: '6',
    name: 'Galactic Protocol',
    category: ['Social', 'AI'],
    status: 'completed',
    type: 'listing',
    symbol: 'GALT',
    description: 'Decentralized social media platform',
    launch_date: '2024-05-20',
    size_fdv: '$40M',
    expected_fdv: '$160M',
    backers: ['Lightspeed Venture Partners', 'Andreessen Horowitz']
  },
  {
    id: '7',
    name: 'Nova Network',
    category: ['Infrastructure', 'DeFi'],
    status: 'upcoming',
    type: 'sale',
    symbol: 'NOVA',
    description: 'Decentralized data storage network',
    sale_date: '2024-11-15',
    size_fdv: '$70M',
    expected_fdv: '$280M',
    backers: ['Union Square Ventures', 'Ribbit Capital']
  },
  {
    id: '8',
    name: 'Orion AI',
    category: ['AI', 'Social'],
    status: 'completed',
    type: 'listing',
    symbol: 'ORIA',
    description: 'Decentralized AI-powered content creation platform',
    launch_date: '2024-04-10',
    size_fdv: '$90M',
    expected_fdv: '$360M',
    backers: ['Khosla Ventures', 'Kleiner Perkins']
  },
  {
    id: '9',
    name: 'Polaris Protocol',
    category: ['DeFi', 'Social'],
    status: 'upcoming',
    type: 'sale',
    symbol: 'POLA',
    description: 'Decentralized lending and borrowing platform',
    sale_date: '2024-12-01',
    size_fdv: '$55M',
    expected_fdv: '$220M',
    backers: ['Digital Currency Group', 'Blockchain Capital']
  },
  {
    id: '10',
    name: 'Quantum Exchange',
    category: ['Infrastructure', 'AI'],
    status: 'completed',
    type: 'listing',
    symbol: 'QUEX',
    description: 'Decentralized exchange for AI models',
    launch_date: '2024-03-01',
    size_fdv: '$45M',
    expected_fdv: '$180M',
    backers: ['Sequoia Capital', 'Paradigm']
  }
];

export default function Index() {
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'cards' | 'list' | 'calendar'>('cards');

  const upcomingProjects = projects.filter(project => project.status === 'upcoming');

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
  };

  const filteredProjects = projects.filter(project => {
    const searchMatch = project.name.toLowerCase().includes(searchQuery.toLowerCase());
    const categoryMatch = selectedCategory ? (Array.isArray(project.category) ? project.category.includes(selectedCategory) : project.category === selectedCategory) : true;
    return searchMatch && categoryMatch;
  });

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory(null);
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      {/* Header */}
      <header className="bg-white border-b border-black/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center justify-between">
            <Link to="/" className="hover:opacity-80 transition-opacity">
              <h1 className="text-lg font-semibold text-black">NEAR Tokens</h1>
            </Link>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Link to="/submit" className="flex items-center space-x-2">
                  <Zap className="h-4 w-4" />
                  <span>Submit Token</span>
                </Link>
              </Button>
              <Button variant="ghost" size="sm">
                <Link to="/blog" className="flex items-center space-x-2">
                  <ExternalLink className="h-4 w-4" />
                  <span>Blog</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-white border-b border-black/10 py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl font-semibold text-black mb-4">
            Track token launches on NEAR Protocol ecosystem
          </h2>
          <p className="text-lg text-black/70 font-medium mb-6">
            Stay updated on upcoming and completed token sales, listings, and more.
          </p>
          <div className="flex items-center justify-center space-x-4">
            <Input
              type="text"
              placeholder="Search for tokens..."
              className="max-w-md"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Select onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={null}>All Categories</SelectItem>
                <SelectItem value="DeFi">DeFi</SelectItem>
                <SelectItem value="AI">AI</SelectItem>
                <SelectItem value="Social">Social</SelectItem>
                <SelectItem value="Infrastructure">Infrastructure</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
        </div>
      </section>

      {/* Upcoming Tokens Ticker */}
      <section className="bg-[#00ec97] py-3 overflow-hidden">
        <div className="animate-scroll whitespace-nowrap">
          {upcomingProjects.map((project) => (
            <span key={project.id} className="text-black font-semibold text-lg mx-4">
              {project.name} ({project.symbol}) - {project.status}
            </span>
          ))}
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-black">
            Token Launches
          </h3>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" onClick={() => setViewMode('cards')}>
              <Search className="h-4 w-4 mr-2" />
              <span>Cards</span>
            </Button>
            <Button variant="outline" size="sm" onClick={() => setViewMode('list')}>
              <Filter className="h-4 w-4 mr-2" />
              <span>List</span>
            </Button>
            <Button variant="outline" size="sm" onClick={() => setViewMode('calendar')}>
              <Calendar className="h-4 w-4 mr-2" />
              <span>Calendar</span>
            </Button>
          </div>
        </div>

        <ProjectExplorer
          projects={filteredProjects}
          viewMode={viewMode}
          onCategoryClick={handleCategoryClick}
        />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
