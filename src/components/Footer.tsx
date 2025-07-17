import { GitHubService } from '@/services/githubService';
import { Link } from 'react-router-dom';
import { SubmitTokenDialog } from './SubmitTokenDialog';
export const Footer = () => {
  const githubService = GitHubService.getInstance();
  return <footer className="bg-white border-t border-black/10 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="text-center md:text-left">
            <Link to="/" className="hover:opacity-80 transition-opacity">
              <h3 className="text-lg font-semibold text-black mb-2">NEAR Tokens</h3>
            </Link>
            <p className="text-sm text-black/60 font-medium">
              Track token launches on NEAR Protocol ecosystem
            </p>
          </div>

          {/* DeFi Section */}
          <div className="text-center md:text-left">
            <h4 className="text-sm font-semibold text-black mb-3">DeFi</h4>
            <div className="space-y-2">
              <a href="https://rhea.finance" target="_blank" rel="noopener noreferrer" className="block text-sm text-black/60 hover:text-[#00ec97] transition-colors">
                Rhea Finance
              </a>
              <a href="https://near-intents.org" target="_blank" rel="noopener noreferrer" className="block text-sm text-black/60 hover:text-[#00ec97] transition-colors">
                NEAR Intents
              </a>
            </div>
          </div>

          {/* Projects Section */}
          <div className="text-center md:text-left">
            <h4 className="text-sm font-semibold text-black mb-3">Projects</h4>
            <div className="space-y-2">
              <a href="https://nearcatalog.xyz" target="_blank" rel="noopener noreferrer" className="block text-sm text-black/60 hover:text-[#00ec97] transition-colors">
                NEAR Catalog
              </a>
            </div>
          </div>

          {/* Links Section */}
          <div className="text-center md:text-left">
            <h4 className="text-sm font-semibold text-black mb-3">Links</h4>
            <div className="space-y-2">
              <a href="https://near.org/blog/token-season-on-near" target="_blank" rel="noopener noreferrer" className="block text-sm text-black/60 hover:text-[#17d9d4] transition-colors">
                Blog
              </a>
              
              <a href={githubService.getRepoUrl()} target="_blank" rel="noopener noreferrer" className="block text-sm text-black/60 hover:text-[#00ec97] transition-colors">
                GitHub
              </a>

              
            </div>
          </div>
        </div>
      </div>
    </footer>;
};