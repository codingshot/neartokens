
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, X, GitPullRequest } from 'lucide-react';

export const SubmitTokenDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [tokenType, setTokenType] = useState<'sale' | 'listing'>('sale');
  const [formData, setFormData] = useState({
    name: '',
    symbol: '',
    description: '',
    category: [] as string[],
    date: '',
    fdv: '',
    launchpad: '',
    website: '',
    twitter: '',
    telegram: '',
    keyFeatures: [] as string[]
  });
  const [newCategory, setNewCategory] = useState('');
  const [newFeature, setNewFeature] = useState('');

  const handleSubmit = () => {
    const tokenData = {
      id: formData.name.toLowerCase().replace(/\s+/g, '_'),
      name: formData.name,
      symbol: formData.symbol || 'TBD',
      description: formData.description,
      category: formData.category,
      [tokenType === 'sale' ? 'sale_date' : 'launch_date']: formData.date,
      [tokenType === 'sale' ? 'size_fdv' : 'expected_fdv']: formData.fdv || 'TBD',
      [tokenType === 'sale' ? 'launchpad' : 'listing_platform']: formData.launchpad || 'TBD',
      website: formData.website || 'TBD',
      social: {
        twitter: formData.twitter || 'TBD',
        telegram: formData.telegram || 'TBD'
      },
      key_features: formData.keyFeatures,
      status: 'upcoming'
    };

    const prUrl = generateSubmissionPR(tokenData, tokenType);
    window.open(prUrl, '_blank');
    setIsOpen(false);
    
    // Reset form
    setFormData({
      name: '',
      symbol: '',
      description: '',
      category: [],
      date: '',
      fdv: '',
      launchpad: '',
      website: '',
      twitter: '',
      telegram: '',
      keyFeatures: []
    });
  };

  const generateSubmissionPR = (tokenData: any, type: 'sale' | 'listing') => {
    const title = encodeURIComponent(`Add ${tokenData.name} Token ${type === 'sale' ? 'Sale' : 'Listing'}`);
    
    const jsonToAdd = JSON.stringify(tokenData, null, 2);
    const arrayName = type === 'sale' ? 'token_sales' : 'token_listings';
    
    const body = encodeURIComponent(`## New Token ${type === 'sale' ? 'Sale' : 'Listing'} Submission

**Token Details:**
- Name: ${tokenData.name}
- Symbol: ${tokenData.symbol}
- Description: ${tokenData.description}
- Categories: ${tokenData.category.join(', ')}
- ${type === 'sale' ? 'Sale Date' : 'Launch Date'}: ${tokenData[type === 'sale' ? 'sale_date' : 'launch_date']}
- ${type === 'sale' ? 'Size FDV' : 'Expected FDV'}: ${tokenData[type === 'sale' ? 'size_fdv' : 'expected_fdv']}
- ${type === 'sale' ? 'Launchpad' : 'Listing Platform'}: ${tokenData[type === 'sale' ? 'launchpad' : 'listing_platform']}

**Social Links:**
- Website: ${tokenData.website}
- Twitter: ${tokenData.social.twitter}
- Telegram: ${tokenData.social.telegram}

**Key Features:**
${tokenData.key_features.map((feature: string) => `- ${feature}`).join('\n')}

---
*This submission was created via the NEAR Tokens website*

## Instructions for Maintainers

Please add the following JSON object to the \`${arrayName}\` array in \`public/data/tokens.json\`:

\`\`\`json
${jsonToAdd}
\`\`\`

**Steps:**
1. Open \`public/data/tokens.json\`
2. Find the \`"${arrayName}": [\` array
3. Add the above JSON object to the array (don't forget the comma if it's not the last item)
4. Update the \`statistics\` section to reflect the new totals
5. Update the \`last_updated\` field in metadata

Thank you for maintaining the NEAR Tokens database!`);

    return `https://github.com/codingshot/neartokens/compare/main...?quick_pull=1&title=${title}&body=${body}`;
  };

  const addCategory = () => {
    if (newCategory && !formData.category.includes(newCategory)) {
      setFormData({ ...formData, category: [...formData.category, newCategory] });
      setNewCategory('');
    }
  };

  const removeCategory = (category: string) => {
    setFormData({ ...formData, category: formData.category.filter(c => c !== category) });
  };

  const addFeature = () => {
    if (newFeature && !formData.keyFeatures.includes(newFeature)) {
      setFormData({ ...formData, keyFeatures: [...formData.keyFeatures, newFeature] });
      setNewFeature('');
    }
  };

  const removeFeature = (feature: string) => {
    setFormData({ ...formData, keyFeatures: formData.keyFeatures.filter(f => f !== feature) });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="font-medium border-black/20 hover:border-[#00ec97]">
          <GitPullRequest className="h-4 w-4 mr-2" />
          Submit Token
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-black">Submit New Token</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Token Type */}
          <div>
            <label className="block text-sm font-semibold text-black mb-2">Token Type</label>
            <div className="flex space-x-4">
              <Button
                variant={tokenType === 'sale' ? 'default' : 'outline'}
                onClick={() => setTokenType('sale')}
                className={tokenType === 'sale' ? 'bg-[#00ec97] text-black' : ''}
              >
                Token Sale
              </Button>
              <Button
                variant={tokenType === 'listing' ? 'default' : 'outline'}
                onClick={() => setTokenType('listing')}
                className={tokenType === 'listing' ? 'bg-[#00ec97] text-black' : ''}
              >
                Token Listing
              </Button>
            </div>
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-black mb-2">Token Name *</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Intellex"
                className="border-black/20"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-black mb-2">Symbol</label>
              <Input
                value={formData.symbol}
                onChange={(e) => setFormData({ ...formData, symbol: e.target.value })}
                placeholder="e.g., INTX or TBD"
                className="border-black/20"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-black mb-2">Description *</label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief description of the project"
              className="border-black/20"
              rows={3}
            />
          </div>

          {/* Categories */}
          <div>
            <label className="block text-sm font-semibold text-black mb-2">Categories</label>
            <div className="flex space-x-2 mb-2">
              <Input
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="e.g., AI, DeFi, Wallet"
                className="border-black/20"
                onKeyPress={(e) => e.key === 'Enter' && addCategory()}
              />
              <Button onClick={addCategory} size="sm" className="bg-[#00ec97] text-black">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-1">
              {formData.category.map((cat) => (
                <Badge key={cat} variant="outline" className="bg-[#f2f1e9] border-black/20 text-xs px-2 py-0.5">
                  {cat}
                  <button onClick={() => removeCategory(cat)} className="ml-1">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          {/* Date and FDV */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-black mb-2">
                {tokenType === 'sale' ? 'Sale Date' : 'Launch Date'} *
              </label>
              <Input
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                placeholder="e.g., Q3 2025 or 2025-09-15"
                className="border-black/20"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-black mb-2">
                {tokenType === 'sale' ? 'Size FDV' : 'Expected FDV'}
              </label>
              <Input
                value={formData.fdv}
                onChange={(e) => setFormData({ ...formData, fdv: e.target.value })}
                placeholder="e.g., < $25mm or $50mm"
                className="border-black/20"
              />
            </div>
          </div>

          {/* Launchpad/Platform */}
          <div>
            <label className="block text-sm font-semibold text-black mb-2">
              {tokenType === 'sale' ? 'Launchpad' : 'Listing Platform'}
            </label>
            <Input
              value={formData.launchpad}
              onChange={(e) => setFormData({ ...formData, launchpad: e.target.value })}
              placeholder={tokenType === 'sale' ? 'e.g., Intents Launchpad' : 'e.g., RHEA Finance'}
              className="border-black/20"
            />
          </div>

          {/* Social Links */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-black mb-2">Website</label>
              <Input
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                placeholder="https://..."
                className="border-black/20"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-black mb-2">Twitter</label>
              <Input
                value={formData.twitter}
                onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                placeholder="@username"
                className="border-black/20"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-black mb-2">Telegram</label>
              <Input
                value={formData.telegram}
                onChange={(e) => setFormData({ ...formData, telegram: e.target.value })}
                placeholder="@username"
                className="border-black/20"
              />
            </div>
          </div>

          {/* Key Features */}
          <div>
            <label className="block text-sm font-semibold text-black mb-2">Key Features</label>
            <div className="flex space-x-2 mb-2">
              <Input
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                placeholder="e.g., AI agent interoperability"
                className="border-black/20"
                onKeyPress={(e) => e.key === 'Enter' && addFeature()}
              />
              <Button onClick={addFeature} size="sm" className="bg-[#00ec97] text-black">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-2">
              {formData.keyFeatures.map((feature) => (
                <div key={feature} className="flex items-center justify-between p-2 bg-[#f2f1e9] rounded">
                  <span className="text-sm text-black">{feature}</span>
                  <button onClick={() => removeFeature(feature)}>
                    <X className="h-4 w-4 text-black/60" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!formData.name || !formData.description || !formData.date}
              className="bg-[#00ec97] hover:bg-[#00ec97]/90 text-black"
            >
              <GitPullRequest className="h-4 w-4 mr-2" />
              Create Pull Request
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
