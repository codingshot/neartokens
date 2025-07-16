
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, ArrowLeft, Clock, User } from 'lucide-react';

const blogPosts = [
  {
    id: 1,
    title: "NEAR Token Season 2025: What to Expect",
    excerpt: "An overview of the upcoming token launches and listings on NEAR Protocol for 2025.",
    author: "NEAR Team",
    date: "2025-01-15",
    readTime: "5 min read",
    category: "Ecosystem",
    image: "/placeholder.svg"
  },
  {
    id: 2,
    title: "Understanding Token Utility in NEAR Projects",
    excerpt: "Deep dive into how tokens are used across different NEAR ecosystem projects.",
    author: "DeFi Analyst",
    date: "2025-01-12",
    readTime: "8 min read",
    category: "Analysis",
    image: "/placeholder.svg"
  },
  {
    id: 3,
    title: "Investment Guide: Evaluating NEAR Token Launches",
    excerpt: "Key metrics and factors to consider when evaluating new token launches.",
    author: "Investment Team",
    date: "2025-01-10",
    readTime: "6 min read",
    category: "Investment",
    image: "/placeholder.svg"
  }
];

const Blog = () => {
  return (
    <div className="min-h-screen bg-[#f2f1e9]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 md:py-8">
        {/* Header */}
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center text-black/60 hover:text-black mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-black mb-4">
              NEAR Token <span className="text-[#00ec97]">Blog</span>
            </h1>
            <p className="text-lg text-black/70 font-medium max-w-2xl mx-auto">
              Stay updated with the latest insights, analysis, and news from the NEAR token ecosystem.
            </p>
          </div>
        </div>

        {/* Featured Post */}
        <div className="mb-8">
          <Card className="bg-white border-black/10 shadow-sm overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/3">
                <img 
                  src={blogPosts[0].image} 
                  alt={blogPosts[0].title}
                  className="w-full h-48 md:h-full object-cover"
                />
              </div>
              <div className="md:w-2/3 p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Badge className="bg-[#00ec97]/10 text-black border-[#00ec97]/30">
                    Featured
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {blogPosts[0].category}
                  </Badge>
                </div>
                <h2 className="text-2xl font-bold text-black mb-3">
                  {blogPosts[0].title}
                </h2>
                <p className="text-black/70 font-medium mb-4">
                  {blogPosts[0].excerpt}
                </p>
                <div className="flex items-center gap-4 text-sm text-black/60">
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    {blogPosts[0].author}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {blogPosts[0].date}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {blogPosts[0].readTime}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Recent Posts */}
        <div>
          <h2 className="text-2xl font-bold text-black mb-6">Recent Posts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {blogPosts.slice(1).map((post) => (
              <Card key={post.id} className="bg-white border-black/10 shadow-sm hover:shadow-md transition-shadow">
                <div className="aspect-video bg-gray-100 rounded-t-lg overflow-hidden">
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="text-xs">
                      {post.category}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg text-black line-clamp-2">
                    {post.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-black/70 font-medium mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center gap-3 text-sm text-black/60">
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {post.author}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {post.date}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {post.readTime}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;
