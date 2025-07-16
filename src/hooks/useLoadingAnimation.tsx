
import { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

interface TokenData {
  id: string;
  name: string;
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

export const useLoadingAnimation = () => {
  const location = useLocation();
  const { id: projectId } = useParams();
  const [currentLogoIndex, setCurrentLogoIndex] = useState(0);

  const { data: tokensData } = useQuery({
    queryKey: ['tokens'],
    queryFn: fetchTokensData,
  });

  const isProjectPage = location.pathname.includes('/project/');
  const allProjects = tokensData ? [...tokensData.token_sales, ...tokensData.token_listings] : [];
  
  // Get logos that exist
  const availableLogos = allProjects
    .filter(project => project.logo)
    .map(project => ({ logo: project.logo!, name: project.name }));

  // Find specific project for project pages
  const currentProject = isProjectPage && projectId 
    ? allProjects.find(p => 
        p.id === projectId || 
        p.id.toLowerCase() === projectId.toLowerCase() ||
        p.id.replace(/_/g, '').toLowerCase() === projectId.replace(/_/g, '').toLowerCase() ||
        p.name.toLowerCase() === projectId.replace(/_/g, ' ').toLowerCase()
      )
    : null;

  // Cycle through logos on general pages
  useEffect(() => {
    if (!isProjectPage && availableLogos.length > 1) {
      const interval = setInterval(() => {
        setCurrentLogoIndex(prev => (prev + 1) % availableLogos.length);
      }, 800); // Change logo every 800ms

      return () => clearInterval(interval);
    }
  }, [isProjectPage, availableLogos.length]);

  // Determine which logo to show
  const getCurrentLogo = () => {
    if (isProjectPage && currentProject?.logo) {
      return { logo: currentProject.logo, name: currentProject.name };
    }
    
    if (availableLogos.length > 0) {
      return availableLogos[currentLogoIndex];
    }
    
    // Fallback to NEAR logo
    return { 
      logo: "/lovable-uploads/2f7587c3-547e-4d5b-b88d-d510b8d304a6.png", 
      name: "NEAR" 
    };
  };

  return getCurrentLogo();
};
