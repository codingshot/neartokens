import { useState, useEffect } from 'react';

export const useGitHubData = () => {
  const [projects, setProjects] = useState([]);
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<string>('');

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Since we're now using tokens.json only, we'll fetch that data
      const response = await fetch('/data/tokens.json');
      if (!response.ok) {
        throw new Error('Failed to fetch tokens data');
      }
      const tokensData = await response.json();
      
      // Convert tokens data to projects format for backward compatibility
      const allProjects = [...(tokensData.token_sales || []), ...(tokensData.token_listings || [])];
      setProjects(allProjects);
      setIssues([]); // No issues data available from tokens.json
      setLastUpdate(tokensData.lastUpdate || new Date().toISOString());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Keep these methods for backward compatibility, but they won't generate functional URLs
  const generatePRUrl = (projectData: any) => {
    return '#'; // Placeholder since we don't have GitHub integration for tokens
  };

  const generateIssueUrl = (projectId: string, milestoneData: any) => {
    return '#'; // Placeholder since we don't have GitHub integration for tokens
  };

  const getDataUrl = () => {
    return '/data/tokens.json';
  };

  const getRepoUrl = () => {
    return 'https://github.com/near/ecosystem'; // Generic NEAR ecosystem repo
  };

  return {
    projects,
    issues,
    loading,
    error,
    lastUpdate,
    refetch: fetchData,
    generatePRUrl,
    generateIssueUrl,
    getDataUrl,
    getRepoUrl
  };
};
