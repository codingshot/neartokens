
import { useState, useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { Header } from '@/components/Header';
import { HeroSection } from '@/components/HeroSection';
import { TokenFilters } from '@/components/TokenFilters';
import { ProjectExplorer } from '@/components/ProjectExplorer';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Footer } from '@/components/Footer';
import { useSEO } from '@/hooks/useSEO';

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
  logo?: string;
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

const Index = () => {
  const [searchParams] = useSearchParams();
  const categoryFromUrl = searchParams.get('category');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryFromUrl || 'all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'cards' | 'list' | 'calendar'>('cards');

  // Apply SEO metadata for the main page
  const baseUrl = 'https://nearplays.com';
  useSEO({
    title: 'NEAR Tokens - Track Upcoming Token Launches on NEAR Protocol',
    description: 'Track upcoming token launches on NEAR Protocol. Discover new projects, token sales, listings, and investment opportunities across the NEAR blockchain ecosystem. Token Season 2025.',
    keywords: 'NEAR Protocol, token launches, upcoming tokens, blockchain ecosystem, Web3, DeFi, NFT, smart contracts, cryptocurrency, blockchain development, token tracking, NEAR tokens, token season 2025',
    image: `${baseUrl}/tokenseason.webp`,
    url: baseUrl,
    type: 'website'
  });

  const { data: tokensData, isLoading, error } = useQuery({
    queryKey: ['tokens'],
    queryFn: fetchTokensData,
  });

  useEffect(() => {
    // Set selected category from URL on initial load
    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl);
    }
  }, [categoryFromUrl]);

  const filteredProjects = useMemo(() => {
    if (!tokensData) return [];

    let allProjects = [...tokensData.token_sales, ...tokensData.token_listings];

    if (selectedCategory !== 'all') {
      allProjects = allProjects.filter(project => {
        if (Array.isArray(project.category)) {
          return project.category.includes(selectedCategory);
        } else {
          return project.category === selectedCategory;
        }
      });
    }

    if (selectedStatus !== 'all') {
      allProjects = allProjects.filter(project => project.status === selectedStatus);
    }

    if (selectedType !== 'all') {
      allProjects = allProjects.filter(project => project.type === selectedType);
    }

    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      allProjects = allProjects.filter(project =>
        project.name.toLowerCase().includes(lowerCaseSearchTerm) ||
        project.description?.toLowerCase().includes(lowerCaseSearchTerm) ||
        project.symbol?.toLowerCase().includes(lowerCaseSearchTerm)
      );
    }

    return allProjects;
  }, [tokensData, selectedCategory, selectedStatus, selectedType, searchTerm]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const handleStatusChange = (status: string) => {
    setSelectedStatus(status);
  };

  const handleTypeChange = (type: string) => {
    setSelectedType(type);
  };

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f2f1e9]">
        <LoadingSpinner centered />
      </div>
    );
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

  return (
    <div className="min-h-screen bg-[#f2f1e9]">
      <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <HeroSection />
      <TokenFilters
        selectedCategory={selectedCategory}
        handleCategoryChange={handleCategoryChange}
        selectedStatus={selectedStatus}
        handleStatusChange={handleStatusChange}
        selectedType={selectedType}
        handleTypeChange={handleTypeChange}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-black mb-2">
            {filteredProjects.length} Token{filteredProjects.length !== 1 ? 's' : ''} Found
          </h2>
          <p className="text-black/60">
            Showing {selectedCategory === 'all' ? 'all categories' : selectedCategory} • {selectedStatus === 'all' ? 'all statuses' : selectedStatus} • {selectedType === 'all' ? 'all types' : selectedType}
          </p>
        </div>

        <ProjectExplorer
          projects={filteredProjects}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedCategory={selectedCategory}
          handleCategoryChange={handleCategoryChange}
          selectedStatus={selectedStatus}
          handleStatusChange={handleStatusChange}
          selectedType={selectedType}
          handleTypeChange={handleTypeChange}
          viewMode={viewMode}
          onCategoryClick={handleCategoryClick}
        />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
