
import { Badge } from '@/components/ui/badge';

export const HeroSection = () => {
  const trendingTokens = [
    'NEAR Protocol', 'Aurora', 'Ref Finance', 'Paras', 'Octopus Network',
    'Meta Pool', 'Skyward Finance', 'Flux Protocol', 'Pulse', 'Tonic'
  ];

  return (
    <section className="bg-[#f2f1e9] py-12 md:py-20">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-4xl mx-auto">
          <Badge className="mb-6 bg-[#00ec97]/10 text-black border-[#00ec97]/30 hover:bg-[#00ec97]/20">
            Token Season 2025
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold text-black mb-6 leading-tight">
            Track Upcoming Token
            <br />
            <span className="text-[#00ec97]">Launches on NEAR</span>
          </h1>
          
          <p className="text-lg md:text-xl text-black/70 mb-8 max-w-2xl mx-auto">
            Discover new projects, token sales, listings, and investment opportunities across the NEAR blockchain ecosystem.
          </p>

          {/* Trending Ticker */}
          <div className="bg-white/50 backdrop-blur-sm rounded-lg p-4 border border-black/10">
            <div className="text-sm font-medium text-black/60 mb-2">Trending Projects</div>
            <div className="overflow-hidden relative">
              <div className="flex space-x-6 animate-scroll">
                {[...trendingTokens, ...trendingTokens].map((token, index) => (
                  <span
                    key={index}
                    className="text-black font-medium whitespace-nowrap flex-shrink-0"
                  >
                    {token}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
