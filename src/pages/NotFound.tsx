import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Home, Search, ArrowLeft } from 'lucide-react';
import { useSEO } from '@/hooks/useSEO';

const NotFound = () => {
  // Apply SEO metadata for 404 page
  const baseUrl = 'https://nearplays.com';
  useSEO({
    title: 'Page Not Found - NEAR Tokens',
    description: 'The page you are looking for could not be found. Return to NEAR Tokens to explore upcoming token launches on NEAR Protocol.',
    keywords: 'NEAR Protocol, token launches, page not found, 404 error',
    image: `${baseUrl}/tokenseason.webp`,
    url: `${baseUrl}/404`
  });

  return (
    <div className="min-h-screen bg-[#f2f1e9] flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-semibold text-black mb-4">
          Oops! Page Not Found
        </h1>
        <p className="text-black/60 mb-8">
          The page you are looking for does not exist or has been moved.
        </p>
        <div className="flex items-center justify-center space-x-4">
          <Link to="/">
            <Button variant="outline" className="bg-white border-black/20 text-black hover:bg-black/5">
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Button>
          </Link>
          <Button variant="outline" className="bg-white border-black/20 text-black hover:bg-black/5">
            <Search className="w-4 h-4 mr-2" />
            Search
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
