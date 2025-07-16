
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MessageCircle, ExternalLink, Heart, Repeat, Calendar } from 'lucide-react';

interface TwitterFeedProps {
  twitterHandle?: string;
}

interface Tweet {
  id: string;
  text: string;
  created_at: string;
  public_metrics: {
    like_count: number;
    retweet_count: number;
    reply_count: number;
  };
  author: {
    name: string;
    username: string;
    profile_image_url: string;
  };
}

export const TwitterFeed = ({ twitterHandle }: TwitterFeedProps) => {
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Since we can't access Twitter API directly from the frontend,
  // we'll show mock data for demonstration
  useEffect(() => {
    if (twitterHandle) {
      setLoading(true);
      // Simulate API call with mock data
      setTimeout(() => {
        const mockTweets: Tweet[] = [
          {
            id: '1',
            text: `🚀 Exciting update on our ${twitterHandle.replace('@', '')} project! We've just completed our latest milestone and are ready for the next phase. Stay tuned for more updates! #blockchain #development`,
            created_at: '2024-01-15T10:00:00Z',
            public_metrics: {
              like_count: 42,
              retweet_count: 8,
              reply_count: 5
            },
            author: {
              name: twitterHandle.replace('@', '').charAt(0).toUpperCase() + twitterHandle.replace('@', '').slice(1),
              username: twitterHandle.replace('@', ''),
              profile_image_url: '/placeholder.svg'
            }
          },
          {
            id: '2',
            text: 'Just deployed our smart contracts to testnet! 🎉 Testing phase begins now. Community feedback is always welcome.',
            created_at: '2024-01-12T14:30:00Z',
            public_metrics: {
              like_count: 67,
              retweet_count: 15,
              reply_count: 12
            },
            author: {
              name: twitterHandle.replace('@', '').charAt(0).toUpperCase() + twitterHandle.replace('@', '').slice(1),
              username: twitterHandle.replace('@', ''),
              profile_image_url: '/placeholder.svg'
            }
          },
          {
            id: '3',
            text: 'Big announcement coming next week! 👀 #staytuned',
            created_at: '2024-01-10T09:15:00Z',
            public_metrics: {
              like_count: 89,
              retweet_count: 23,
              reply_count: 18
            },
            author: {
              name: twitterHandle.replace('@', '').charAt(0).toUpperCase() + twitterHandle.replace('@', '').slice(1),
              username: twitterHandle.replace('@', ''),
              profile_image_url: '/placeholder.svg'
            }
          }
        ];
        setTweets(mockTweets);
        setLoading(false);
      }, 1000);
    }
  }, [twitterHandle]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  if (!twitterHandle) {
    return null;
  }

  const cleanHandle = twitterHandle.replace('@', '');

  return (
    <Card className="bg-white border-black/10 shadow-sm hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-black flex items-center space-x-2">
            <MessageCircle className="h-5 w-5" />
            <span>Recent Tweets</span>
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(`https://twitter.com/${cleanHandle}`, '_blank')}
            className="font-medium"
          >
            @{cleanHandle}
            <ExternalLink className="h-3 w-3 ml-1" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-black/10 rounded mb-2"></div>
                <div className="h-3 bg-black/5 rounded mb-1"></div>
                <div className="h-3 bg-black/5 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-8 text-black/60">
            <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="font-medium">Unable to load tweets</p>
            <p className="text-sm">{error}</p>
          </div>
        ) : tweets.length > 0 ? (
          <div className="space-y-4">
            {tweets.map((tweet) => (
              <div key={tweet.id} className="border-l-2 border-[#1da1f2] pl-4 pb-4">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-[#1da1f2]/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="h-5 w-5 text-[#1da1f2]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="font-semibold text-black text-sm">{tweet.author.name}</span>
                      <span className="text-xs text-black/60">@{tweet.author.username}</span>
                      <span className="text-xs text-black/40">·</span>
                      <span className="text-xs text-black/60">{formatDate(tweet.created_at)}</span>
                    </div>
                    <p className="text-sm text-black/80 leading-relaxed mb-3">{tweet.text}</p>
                    <div className="flex items-center space-x-4 text-xs text-black/60">
                      <div className="flex items-center space-x-1">
                        <MessageCircle className="h-3 w-3" />
                        <span>{tweet.public_metrics.reply_count}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Repeat className="h-3 w-3" />
                        <span>{tweet.public_metrics.retweet_count}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Heart className="h-3 w-3" />
                        <span>{tweet.public_metrics.like_count}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div className="text-center pt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(`https://twitter.com/${cleanHandle}`, '_blank')}
                className="font-medium"
              >
                View more on Twitter
                <ExternalLink className="h-3 w-3 ml-1" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-black/60">
            <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="font-medium">No recent tweets</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
