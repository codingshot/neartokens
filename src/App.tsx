
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Footer } from "@/components/Footer";
import Index from "./pages/Index";
import Landing from "./pages/Landing";
import ProjectDetail from "./pages/ProjectDetail";
import ApiDocs from "./pages/ApiDocs";
import Updates from "./pages/Updates";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  // Update document title and meta tags for NEAR Tokens
  React.useEffect(() => {
    document.title = "NEAR Tokens - Track Token Launches on NEAR Protocol";
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Track upcoming token launches, sales, and listings on NEAR Protocol. Stay updated with the latest tokens, launch schedules, and project details in the NEAR ecosystem.');
    } else {
      const newMetaDescription = document.createElement('meta');
      newMetaDescription.name = 'description';
      newMetaDescription.content = 'Track upcoming token launches, sales, and listings on NEAR Protocol. Stay updated with the latest tokens, launch schedules, and project details in the NEAR ecosystem.';
      document.head.appendChild(newMetaDescription);
    }

    // Update meta keywords
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute('content', 'NEAR Protocol, tokens, cryptocurrency, token launch, NEAR tokens, blockchain, DeFi, Web3, token sales, token listings');
    } else {
      const newMetaKeywords = document.createElement('meta');
      newMetaKeywords.name = 'keywords';
      newMetaKeywords.content = 'NEAR Protocol, tokens, cryptocurrency, token launch, NEAR tokens, blockchain, DeFi, Web3, token sales, token listings';
      document.head.appendChild(newMetaKeywords);
    }

    // Add Open Graph meta tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', 'NEAR Tokens - Track Token Launches on NEAR Protocol');
    } else {
      const newOgTitle = document.createElement('meta');
      newOgTitle.setAttribute('property', 'og:title');
      newOgTitle.content = 'NEAR Tokens - Track Token Launches on NEAR Protocol';
      document.head.appendChild(newOgTitle);
    }

    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) {
      ogDescription.setAttribute('content', 'Track upcoming token launches, sales, and listings on NEAR Protocol. Stay updated with the latest tokens and project details.');
    } else {
      const newOgDescription = document.createElement('meta');
      newOgDescription.setAttribute('property', 'og:description');
      newOgDescription.content = 'Track upcoming token launches, sales, and listings on NEAR Protocol. Stay updated with the latest tokens and project details.';
      document.head.appendChild(newOgDescription);
    }

    const ogType = document.querySelector('meta[property="og:type"]');
    if (ogType) {
      ogType.setAttribute('content', 'website');
    } else {
      const newOgType = document.createElement('meta');
      newOgType.setAttribute('property', 'og:type');
      newOgType.content = 'website';
      document.head.appendChild(newOgType);
    }

    // Add Twitter Card meta tags
    const twitterCard = document.querySelector('meta[name="twitter:card"]');
    if (twitterCard) {
      twitterCard.setAttribute('content', 'summary_large_image');
    } else {
      const newTwitterCard = document.createElement('meta');
      newTwitterCard.name = 'twitter:card';
      newTwitterCard.content = 'summary_large_image';
      document.head.appendChild(newTwitterCard);
    }

    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (twitterTitle) {
      twitterTitle.setAttribute('content', 'NEAR Tokens - Track Token Launches');
    } else {
      const newTwitterTitle = document.createElement('meta');
      newTwitterTitle.name = 'twitter:title';
      newTwitterTitle.content = 'NEAR Tokens - Track Token Launches';
      document.head.appendChild(newTwitterTitle);
    }

    const twitterDescription = document.querySelector('meta[name="twitter:description"]');
    if (twitterDescription) {
      twitterDescription.setAttribute('content', 'Track upcoming token launches on NEAR Protocol. Stay updated with the latest tokens and project details.');
    } else {
      const newTwitterDescription = document.createElement('meta');
      newTwitterDescription.name = 'twitter:description';
      newTwitterDescription.content = 'Track upcoming token launches on NEAR Protocol. Stay updated with the latest tokens and project details.';
      document.head.appendChild(newTwitterDescription);
    }

    // Add viewport meta tag for mobile responsiveness
    const viewport = document.querySelector('meta[name="viewport"]');
    if (!viewport) {
      const newViewport = document.createElement('meta');
      newViewport.name = 'viewport';
      newViewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
      document.head.appendChild(newViewport);
    }

    // Add theme color for mobile browsers
    const themeColor = document.querySelector('meta[name="theme-color"]');
    if (!themeColor) {
      const newThemeColor = document.createElement('meta');
      newThemeColor.name = 'theme-color';
      newThemeColor.content = '#00ec97';
      document.head.appendChild(newThemeColor);
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen flex flex-col">
            <div className="flex-1">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/landing" element={<Landing />} />
                <Route path="/project/:projectId" element={<ProjectDetail />} />
                <Route path="/api" element={<ApiDocs />} />
                <Route path="/updates" element={<Updates />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
            <Footer />
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
