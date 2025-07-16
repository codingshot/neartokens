
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Heart, MessageCircle, Repeat2 } from 'lucide-react';

interface TwitterFeedProps {
  projectName: string;
}

export const TwitterFeed: React.FC<TwitterFeedProps> = ({ projectName }) => {
  // Mock project updates - these are example updates, not real social media feeds
  const mockUpdates = [
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
          <MessageSquare className="h-5 w-5 text-blue-500" />
          <span>Project Updates</span>
          <Badge variant="outline" className="text-xs">Demo</Badge>
        </CardTitle>
        <p className="text-sm text-black/60">Sample project updates - actual social feeds will be integrated soon</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {mockUpdates.map((update) => (
          <div key={update.id} className="border-b border-gray-100 pb-4 last:border-b-0">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="text-xs">
                  @{update.author.toLowerCase().replace(/\s+/g, '_')}
                </Badge>
                <span className="text-xs text-gray-500">{update.timestamp}</span>
              </div>
            </div>
            <p className="text-sm text-gray-700 mb-3">{update.content}</p>
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              <div className="flex items-center space-x-1">
                <Heart className="h-3 w-3" />
                <span>{update.likes}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Repeat2 className="h-3 w-3" />
                <span>{update.retweets}</span>
              </div>
              <div className="flex items-center space-x-1">
                <MessageCircle className="h-3 w-3" />
                <span>{update.replies}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
