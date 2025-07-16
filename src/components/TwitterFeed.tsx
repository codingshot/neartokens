
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Twitter, Heart, MessageCircle, Repeat2 } from 'lucide-react';

interface TwitterFeedProps {
  projectName: string;
}

export const TwitterFeed: React.FC<TwitterFeedProps> = ({ projectName }) => {
  // Mock Twitter data - in a real implementation, this would fetch from Twitter API
  const mockTweets = [
    {
      id: 1,
      content: `Excited to announce our latest milestone! ${projectName} is making great progress on the roadmap. 🚀`,
      author: projectName,
      timestamp: '2h',
      likes: 42,
      retweets: 15,
      replies: 8
    },
    {
      id: 2,
      content: `Community update: We've reached 10k+ users! Thank you for your continued support. Building the future together! 💪`,
      author: projectName,
      timestamp: '1d',
      likes: 128,
      retweets: 34,
      replies: 22
    },
    {
      id: 3,
      content: `New partnership announcement coming soon. This will unlock even more utility for our token holders. Stay tuned! 👀`,
      author: projectName,
      timestamp: '3d',
      likes: 87,
      retweets: 28,
      replies: 15
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Twitter className="h-5 w-5 text-blue-500" />
          <span>Recent Updates</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {mockTweets.map((tweet) => (
          <div key={tweet.id} className="border-b border-gray-100 pb-4 last:border-b-0">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="text-xs">
                  @{tweet.author.toLowerCase().replace(/\s+/g, '_')}
                </Badge>
                <span className="text-xs text-gray-500">{tweet.timestamp}</span>
              </div>
            </div>
            <p className="text-sm text-gray-700 mb-3">{tweet.content}</p>
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              <div className="flex items-center space-x-1">
                <Heart className="h-3 w-3" />
                <span>{tweet.likes}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Repeat2 className="h-3 w-3" />
                <span>{tweet.retweets}</span>
              </div>
              <div className="flex items-center space-x-1">
                <MessageCircle className="h-3 w-3" />
                <span>{tweet.replies}</span>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
