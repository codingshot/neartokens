import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Calculates token statistics dynamically from token data
 * @param tokenData - The token data object containing token_sales and token_listings arrays
 * @returns Object with calculated statistics including counts, categories, and FDV ranges
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
  
  // Calculate FDV ranges
  const fdvRanges: { [key: string]: number } = {
    under_25mm: 0,
    "25mm_to_50mm": 0,
    "50mm_to_160mm": 0,
    over_160mm: 0,
    undisclosed: 0
  };
  
  // Process token sales FDV
  tokenSales.forEach((sale: any) => {
    const fdv = sale.size_fdv?.toLowerCase() || '';
    if (fdv.includes('< $25mm') || fdv.includes('< 25mm')) {
      fdvRanges.under_25mm++;
    } else if (fdv.includes('25mm') && fdv.includes('50mm')) {
      fdvRanges["25mm_to_50mm"]++;
    } else if (fdv.includes('50mm') && fdv.includes('160mm')) {
      fdvRanges["50mm_to_160mm"]++;
    } else if (fdv.includes('> $160mm') || fdv.includes('> 160mm')) {
      fdvRanges.over_160mm++;
    } else if (fdv.includes('tbc') || fdv.includes('undisclosed') || fdv === '') {
      fdvRanges.undisclosed++;
    }
  });
  
  // Process token listings FDV
  tokenListings.forEach((listing: any) => {
    const fdv = listing.expected_fdv?.toLowerCase() || '';
    if (fdv.includes('< 25mm') || fdv.includes('< $25mm')) {
      fdvRanges.under_25mm++;
    } else if (fdv.includes('25mm') && fdv.includes('50mm')) {
      fdvRanges["25mm_to_50mm"]++;
    } else if (fdv.includes('50mm') && fdv.includes('160mm')) {
      fdvRanges["50mm_to_160mm"]++;
    } else if (fdv.includes('> 160mm') || fdv.includes('> $160mm')) {
      fdvRanges.over_160mm++;
    } else if (fdv.includes('tbc') || fdv.includes('undisclosed') || fdv === '') {
      fdvRanges.undisclosed++;
    }
  });
  
  return {
    total_token_sales: totalTokenSales,
    total_token_listings: totalTokenListings,
    total_projects: totalProjects,
    categories,
    fdv_ranges: fdvRanges
  };
}
