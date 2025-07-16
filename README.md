
# NEAR Tokens - Token Launch Database

A comprehensive database tracking token launches and listings on the NEAR Protocol ecosystem for 2025.

## About

NEAR Tokens is a community-driven platform that tracks upcoming token sales and listings in the NEAR ecosystem. We provide detailed information about launch schedules, funding rounds, key features, and project details to help the NEAR community stay informed about new opportunities.

## Features

- **Token Launch Tracking**: Comprehensive database of upcoming token sales and listings
- **Launch Calendar**: Visual timeline of token launches with date ranges and specifics
- **Project Details**: In-depth information about each project including backers, features, and traction
- **Community Contributions**: GitHub-based contribution system for submitting new tokens
- **Real-time Updates**: Live data updates from GitHub repository

## Data Coverage

Our database includes:
- **Token Sales**: Pre-launch funding rounds and public sales
- **Token Listings**: Direct platform listings and exchange debuts
- **Project Categories**: AI, DeFi, Wallets, RWA, Gaming, Social, and more
- **Launch Platforms**: NEAR Intents Launchpad, DEXs, and major exchanges
- **Funding Information**: FDV ranges, backers, and investment details

## Contributing

We welcome community contributions! You can submit new token information in several ways:

### Submit via Website
1. Visit [NEAR Tokens](https://neartokens.lovableproject.com)
2. Click "Submit Token" in the footer
3. Fill out the token information form
4. Submit as a GitHub Pull Request

### Submit via GitHub
1. Fork the [repository](https://github.com/codingshot/neartokens)
2. Edit `public/data/tokens.json`
3. Add your token to the appropriate section (`token_sales` or `token_listings`)
4. Submit a pull request with detailed information

### Data Requirements
When submitting a token, please include:
- Project name and symbol
- Description and category tags
- Launch/sale date
- Expected FDV or funding size
- Launchpad or listing platform
- Key features and differentiators
- Social links and website
- Backer information (if available)

## Project Structure

```
src/
├── components/         # React components
├── pages/             # Route pages
├── services/          # API and data services
├── hooks/             # Custom React hooks
└── types/             # TypeScript definitions

public/
└── data/
    └── tokens.json    # Main token database
```

## Technology Stack

This project is built with:
- **Frontend**: React, TypeScript, Tailwind CSS
- **Data**: JSON-based database with GitHub integration
- **Deployment**: Lovable platform
- **Version Control**: GitHub with automated PR workflows

## API Access

The token data is publicly accessible via:
- JSON API: `/data/tokens.json`
- GitHub Raw: `https://raw.githubusercontent.com/codingshot/neartokens/main/public/data/tokens.json`

## Development

### Prerequisites
- Node.js & npm
- Git

### Setup
```sh
# Clone the repository
git clone https://github.com/codingshot/neartokens.git

# Navigate to project directory
cd neartokens

# Install dependencies
npm install

# Start development server
npm run dev
```

## Community

- **Repository**: [github.com/codingshot/neartokens](https://github.com/codingshot/neartokens)
- **Website**: [neartokens.lovableproject.com](https://neartokens.lovableproject.com)
- **Issues**: Report bugs or request features via GitHub Issues
- **Discussions**: Join community discussions in GitHub Discussions

## Data Sources

Our token information comes from:
- Official project announcements
- NEAR Foundation updates
- Community submissions
- Launchpad partnerships
- Ecosystem program participants

## Disclaimer

This database is for informational purposes only. Token information may change, and projects may be delayed or cancelled. Always verify information with official project sources before making any decisions.

## License

This project is open source and available under the MIT License.

---

**Contributing to NEAR's Token Season 2025** 🚀

Help us build the most comprehensive database of NEAR Protocol token launches. Submit your project or updates to keep the community informed!
