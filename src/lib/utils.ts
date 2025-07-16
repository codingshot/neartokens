
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Calculates token statistics dynamically from token data
 * @param tokenData - The token data object containing token_sales and token_listings arrays
 * @returns Object with calculated statistics including counts and categories
 */
export function calculateTokenStatistics(tokenData: any) {
  const tokenSales = tokenData.token_sales || [];
  const tokenListings = tokenData.token_listings || [];
  
  // Calculate total counts
  const totalTokenSales = tokenSales.length;
  const totalTokenListings = tokenListings.length;
  const totalProjects = totalTokenSales + totalTokenListings;
  
  // Calculate categories
  const categories: { [key: string]: number } = {};
  
  // Count categories from token sales
  tokenSales.forEach((sale: any) => {
    if (sale.category) {
      sale.category.forEach((cat: string) => {
        categories[cat] = (categories[cat] || 0) + 1;
      });
    }
  });
  
  // Count categories from token listings
  tokenListings.forEach((listing: any) => {
    if (listing.category) {
      listing.category.forEach((cat: string) => {
        categories[cat] = (categories[cat] || 0) + 1;
      });
    }
  });
  
  return {
    total_token_sales: totalTokenSales,
    total_token_listings: totalTokenListings,
    total_projects: totalProjects,
    categories
  };
}
