import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, User, ArrowRight, Clock, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Footer } from '@/components/Footer';
import { useSEO } from '@/hooks/useSEO';

const Blog = () => {
  // Apply SEO metadata for the blog page
  const baseUrl = 'https://nearplays.com';
  useSEO({
    title: 'NEAR Token Blog - Latest News & Updates | NEAR Tokens',
    description: 'Stay updated with the latest NEAR Protocol token launches, ecosystem news, and blockchain developments. Expert insights on token trends and market analysis.',
    keywords: 'NEAR Protocol blog, token news, blockchain updates, NEAR ecosystem, token launches news, cryptocurrency blog, Web3 news, DeFi updates, token market analysis',
    image: `${baseUrl}/tokenseason.webp`,
    url: `${baseUrl}/blog`,
    type: 'website'
  });

  const blogPosts = [
    {
      id: 1,
      title: "NEAR Protocol's Token Season 2025: What to Expect",
      author: "Jane Doe",
      date: "July 15, 2025",
      category: "Ecosystem News",
      description: "A deep dive into the upcoming token launches and listings on the NEAR blockchain for 2025.",
      link: "/blog/near-token-season-2025",
    },
    {
      id: 2,
      title: "Top 5 DeFi Projects Launching on NEAR This Quarter",
      author: "John Smith",
      date: "July 10, 2025",
      category: "DeFi",
      description: "An overview of the most promising decentralized finance projects set to launch on NEAR Protocol in Q3 2025.",
      link: "/blog/top-5-defi-projects",
    },
    {
      id: 3,
      title: "How NEAR's Intents-Based Launchpad is Revolutionizing Token Sales",
      author: "Alice Johnson",
      date: "July 5, 2025",
      category: "Technology",
      description: "Exploring the innovative features and benefits of NEAR's Intents-Based Launchpad for token sales.",
      link: "/blog/near-intents-launchpad",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f2f1e9]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 md:py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-black mb-4">
            NEAR Tokens Blog
          </h1>
          <p className="text-lg text-black/70 font-medium leading-relaxed">
            Stay updated with the latest news, insights, and updates from the NEAR Protocol ecosystem.
          </p>
        </div>

        {/* Blog Posts */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogPosts.map((post) => (
            <Card key={post.id} className="bg-white border-black/10 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-black">{post.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center space-x-2 text-black/60">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm">{post.date}</span>
                  <User className="h-4 w-4" />
                  <span className="text-sm">{post.author}</span>
                </div>
                <Badge variant="secondary" className="bg-[#00ec97]/10 text-black border-[#00ec97]/30 font-medium">
                  {post.category}
                </Badge>
                <p className="text-black/70 font-medium leading-relaxed">{post.description}</p>
                <Link to={post.link}>
                  <Button variant="link" className="pl-0">
                    Read More <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Blog;
