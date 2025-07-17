
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Filter, Grid, List, Calendar } from 'lucide-react';

interface TokenFiltersProps {
  selectedCategory: string;
  handleCategoryChange: (category: string) => void;
  selectedStatus: string;
  handleStatusChange: (status: string) => void;
  selectedType: string;
  handleTypeChange: (type: string) => void;
  viewMode?: string;
  onViewModeChange?: (mode: 'cards' | 'list' | 'calendar') => void;
}

export const TokenFilters = ({
  selectedCategory,
  handleCategoryChange,
  selectedStatus,
  handleStatusChange,
  selectedType,
  handleTypeChange,
  viewMode = 'cards',
  onViewModeChange
}: TokenFiltersProps) => {
  const categories = [
    'all', 'DeFi', 'NFT', 'Gaming', 'Infrastructure', 'Social', 'DAO', 'Metaverse'
  ];

  const statuses = [
    { value: 'all', label: 'All Status' },
    { value: 'upcoming', label: 'Upcoming' },
    { value: 'completed', label: 'Completed' }
  ];

  const types = [
    { value: 'all', label: 'All Types' },
    { value: 'sale', label: 'Token Sale' },
    { value: 'listing', label: 'Listing' }
  ];

  return (
    <div className="bg-white border-b border-black/10 py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters */}
          <div className="flex-1 space-y-4">
            {/* Categories */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm font-semibold text-black">
                <Filter className="h-4 w-4" />
                <span>Categories</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Badge
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    className={`cursor-pointer transition-all hover:scale-105 ${
                      selectedCategory === category
                        ? 'bg-[#00ec97] text-black border-[#00ec97]'
                        : 'border-black/20 text-black hover:bg-black/5'
                    }`}
                    onClick={() => handleCategoryChange(category)}
                  >
                    {category === 'all' ? 'All Categories' : category}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Status and Type Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Status */}
              <div className="space-y-2">
                <div className="text-sm font-semibold text-black">Status</div>
                <div className="flex flex-wrap gap-2">
                  {statuses.map((status) => (
                    <Badge
                      key={status.value}
                      variant={selectedStatus === status.value ? "default" : "outline"}
                      className={`cursor-pointer transition-all hover:scale-105 ${
                        selectedStatus === status.value
                          ? 'bg-[#17d9d4] text-black border-[#17d9d4]'
                          : 'border-black/20 text-black hover:bg-black/5'
                      }`}
                      onClick={() => handleStatusChange(status.value)}
                    >
                      {status.label}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Type */}
              <div className="space-y-2">
                <div className="text-sm font-semibold text-black">Type</div>
                <div className="flex flex-wrap gap-2">
                  {types.map((type) => (
                    <Badge
                      key={type.value}
                      variant={selectedType === type.value ? "default" : "outline"}
                      className={`cursor-pointer transition-all hover:scale-105 ${
                        selectedType === type.value
                          ? 'bg-[#ff7966] text-black border-[#ff7966]'
                          : 'border-black/20 text-black hover:bg-black/5'
                      }`}
                      onClick={() => handleTypeChange(type.value)}
                    >
                      {type.label}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* View Mode Toggle */}
          {onViewModeChange && (
            <div className="space-y-2">
              <div className="text-sm font-semibold text-black">View</div>
              <div className="flex gap-1 bg-black/5 rounded-lg p-1">
                <Button
                  variant={viewMode === 'cards' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => onViewModeChange('cards')}
                  className={viewMode === 'cards' ? 'bg-white shadow-sm' : ''}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => onViewModeChange('list')}
                  className={viewMode === 'list' ? 'bg-white shadow-sm' : ''}
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'calendar' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => onViewModeChange('calendar')}
                  className={viewMode === 'calendar' ? 'bg-white shadow-sm' : ''}
                >
                  <Calendar className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
