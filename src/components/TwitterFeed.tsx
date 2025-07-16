
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Twitter, Heart, MessageCircle, Repeat2 } from 'lucide-react';

export const TwitterFeed = () => {
  // Mock data - this component shows placeholder data as it's not connected to live Twitter API
  const mockTweets = [
    {
      id: '1',
      user: '@NEARProtocol',
      handle: 'NEAR Protocol',
      content: 'Exciting developments in the NEAR ecosystem with new token launches coming this quarter! 🚀',
      timestamp: '2h',
      likes: 142,
      retweets: 23,
      replies: 8,
      verified: true
    },
    {
      id: '2',
      user: '@intellex_ai',
      handle: 'Intellex AI',
      content: 'Building the future of decentralized AI on NEAR. Our token sale is approaching - stay tuned! 🧠',
      timestamp: '4h',
      likes: 89,
      retweets: 15,
      replies: 12,
      verified: false
    },
    {
      id: '3',
      user: '@vibes_near',
      handle: 'VIBES',
      content: 'Social sentiment meets synthetic data. Trade narratives before they move the market. Q4 2025 launch! 📈',
      timestamp: '6h',
      likes: 76,
      retweets: 19,
      replies: 5,
      verified: false
    }
  ];

  return (
    <Card className="bg-white border-black/10 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2 text-lg font-semibold text-black">
          <Twitter className="h-5 w-5 text-[#1DA1F2]" />
          <span>Recent Updates</span>
          <Badge variant="outline" className="text-xs bg-yellow-100 border-yellow-300 text-yellow-800">
            Mock Data
          </Badge>
        </CardTitle>
        <p className="text-sm text-black/60 font-medium">
          Latest news from NEAR ecosystem projects (placeholder content)
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {mockTweets.map((tweet) => (
          <div key={tweet.id} className="border-b border-black/5 pb-4 last:border-b-0 last:pb-0">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-[#00ec97]/20 rounded-full flex items-center justify-center shrink-0">
                <span className="text-xs font-semibold text-black">
                  {tweet.handle.charAt(0)}
                </span>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-semibold text-sm text-black truncate">
                    {tweet.handle}
                  </span>
                  <span className="text-xs text-black/50 font-medium">
                    {tweet.user}
                  </span>
                  <span className="text-xs text-black/40">•</span>
                  <span className="text-xs text-black/50 font-medium">
                    {tweet.timestamp}
                  </span>
                </div>
                
                <p className="text-sm text-black/80 font-medium mb-3 leading-relaxed">
                  {tweet.content}
                </p>
                
                <div className="flex items-center space-x-6">
                  <button className="flex items-center space-x-1 text-black/50 hover:text-[#1DA1F2] transition-colors">
                    <MessageCircle className="h-4 w-4" />
                    <span className="text-xs font-medium">{tweet.replies}</span>
                  </button>
                  
                  <button className="flex items-center space-x-1 text-black/50 hover:text-[#17d9d4] transition-colors">
                    <Repeat2 className="h-4 w-4" />
                    <span className="text-xs font-medium">{tweet.retweets}</span>
                  </button>
                  
                  <button className="flex items-center space-x-1 text-black/50 hover:text-[#e91e63] transition-colors">
                    <Heart className="h-4 w-4" />
                    <span className="text-xs font-medium">{tweet.likes}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
