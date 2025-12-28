# Changelog

All notable changes to Paris Nord-Est theme will be documented in this file.

## [2025-12-28]

### Infrastructure
- **CDN Asset Delivery**: Implemented automatic CDN path resolution for all static images using jsDelivr with `@latest` tag
- **Automatic Version Updates**: Images now automatically serve from the latest git tag without manual version updates
- **Centralized CDN Configuration**: Created single configuration file for managing CDN base URL and asset paths
- **Improved Deployment**: Simplified deployment workflow - just create git tags and jsDelivr automatically serves the latest version
- **Automated Cache Purge**: GitHub Action automatically purges jsDelivr cache when new tags are pushed, making deployments instant
- **Zero-Touch Deployment**: Deploy new versions without accessing BigCartel directly (except for CSS uploads)

### Features
- **Fully Automated Deployment**: Complete CI/CD pipeline - just push code and changes go live automatically
- **Semantic Versioning**: Automatic version bumping based on conventional commit messages (feat:, fix:, BREAKING CHANGE:)
- **Auto-Tagging Workflow**: GitHub Action analyzes commits and creates version tags automatically
- **Automated Cache Purge**: GitHub Action automatically purges JavaScript, CSS, and image assets from jsDelivr cache
- **Zero-Touch Deployment**: Deploy JavaScript and image changes without accessing BigCartel (CSS still requires manual upload)
- **Deployment Summary**: GitHub Actions provide detailed summary of version bumps, purged assets, and next steps
- **Commit Convention Guide**: Comprehensive documentation for conventional commits and semantic versioning

### Files Created
- `src/config/cdn.js` - CDN configuration with automatic latest tag detection and helper function
- `.github/workflows/auto-deploy.yml` - Unified GitHub Action for automatic tagging and cache purging
- `.github/COMMIT_CONVENTION.md` - Comprehensive guide for conventional commits and semantic versioning

### Files Modified
- `src/components/Homepage.vue` - Updated 3 image paths (hero slider images and banner) to use CDN URLs
- `src/components/Navigation.vue` - Updated logo path to use CDN URL
- `src/components/Footer.vue` - Updated logo path to use CDN URL
- `README.md` - Updated deployment documentation with automated cache purge workflow
- `CHANGELOG.md` - Added CDN infrastructure improvements

## [2025-12-27]

### Product Page UX Enhancements
- **Interactive Image Gallery**: Added hover zoom effect (1.5x magnification) that follows mouse movement for detailed product viewing
- **Lightbox Mode**: Click any product image to view full-screen with keyboard navigation (arrow keys, ESC), image counter, and smooth animations
- **Larger Thumbnails**: Increased thumbnail size from 60px to 80px with hover effects that lift thumbnails slightly for better visibility
- **Zoom Indicator**: Animated badge appears on hover showing "Cliquer pour agrandir" (Click to enlarge) with pulsing animation
- **Enhanced Add to Cart Button**: Added shopping cart icon with subtle bounce animation, ripple hover effect, improved padding and rounded corners (8px)
- **Button Micro-animations**: Cart icon shakes playfully on hover, button lifts with shadow effect for tactile feedback
- **Typography Improvements**: Increased product title size (2rem → 2.75rem on desktop) with improved letter spacing and fade-in animation on page load
- **Klarna Payment Option**: Added Klarna logo and payment text below Add to Cart button showing "Pay in 3 interest-free installments" with i18n support
- **Inventory Warnings**: Enhanced stock warnings with icon and colored left border for better visibility

### SEO Improvements
- **Homepage Social Media Optimization**: Added Open Graph image, Twitter Card tags, and image dimensions for better social sharing previews
- **LocalBusiness Structured Data**: Added comprehensive local business schema with Saint-Denis location, geo-coordinates, opening hours, and price range
- **Product Page Enhancement**: Enhanced product structured data with all product images (not just first), SKU/MPN identifiers, item condition (NewCondition), and price validity dates
- **Breadcrumb Navigation**: Added BreadcrumbList structured data to product pages for better search engine navigation (Accueil → Boutique → Product)
- **Enhanced Meta Descriptions**: Improved homepage and products listing page descriptions for better SEO
- **Twitter Cards**: Added complete Twitter Card implementation for homepage with large image previews

### Rebranding
- **Brand Update**: Changed brand name from "Paris Nord-Est" to "Casquette" across all pages and structured data
- **Translation Updates**: Updated all language files (French and English) to reflect new brand identity while maintaining "Saint-Denis" as location reference
- **Banner Updates**: Updated homepage banner text to reference "Saint-Denis" instead of "Paris Nord-Est"
- **Collection Names**: Updated collection titles from "PARIS NORD-EST COLLECTION" to "CASQUETTE COLLECTION"
- **Footer Updates**: Updated footer descriptions to reference "Saint-Denis" as the geographic identifier

### Documentation
- **Domain Migration Guide**: Complete step-by-step guide for migrating from parisnordest.com to casquette.com using Cloudflare 301 redirects
- **Cloudflare Quick Setup**: Quick reference card for Cloudflare Page Rule configuration
- **SEO Preservation Strategy**: Documentation on maintaining 90-95% SEO authority during domain migration

### Files Created
- `docs/DOMAIN_MIGRATION_GUIDE.md` - Comprehensive migration guide with testing, monitoring, and troubleshooting
- `docs/CLOUDFLARE_QUICK_SETUP.md` - Quick reference for Cloudflare redirect configuration

### Files Modified
- `src/components/products/ProductGallery.vue` - Added zoom functionality, lightbox mode, keyboard navigation, larger thumbnails, and zoom indicator
- `src/components/products/AddToCart.vue` - Added shopping cart icon, ripple effect, micro-animations, and enhanced button styling
- `src/components/pages/ProductPage.vue` - Added Klarna payment section, improved title typography with animations
- `src/locales/fr.json` - Added "Payez en 3x sans frais" (klarnaPayment) translation
- `src/locales/en.json` - Added "Pay in 3 interest-free installments" (klarnaPayment) translation
- `source/layout.html` - Added complete SEO meta tags, Open Graph tags, Twitter Cards, LocalBusiness schema, enhanced Product schema, and BreadcrumbList
- `src/components/Homepage.vue` - Updated banner alt text and code comments

## [2025-11-22]

### Architecture
- **Vue-First Architecture**: Major refactor moving from hybrid Liquid/Vue to Vue-first approach where all UI rendering is handled by Vue components
- **Page-Based Mounting**: New system using `data-page` attribute to automatically mount the correct Vue page component
- **AppShell Layout**: Single layout wrapper (Navigation + Content + Footer) for all Vue-first pages
- **Pinia State Management**: Added Pinia for centralized state (cart, theme configuration)
- **BigCartel API Wrapper**: Created promisified composable for all BigCartel API calls
- **Backward Compatibility**: Legacy mount points still work during migration

### Features
- **Products Page Redesign**: Complete Vue rewrite with category filtering and search support
- **ProductCard Component**: New reusable product card with status badges (sold out, coming soon, on sale)
- **Category Navigation**: Client-side category filtering on products page
- **Enhanced Data Injection**: Layout now injects categories, current page info, and more data for Vue

### Dependencies
- Added `pinia` for Vue state management

### Files Created
- `src/composables/useBigCartel.js` - Promisified BigCartel API wrapper
- `src/stores/cart.js` - Reactive cart state with API integration
- `src/stores/theme.js` - Theme configuration from BigCartel data
- `src/components/layout/AppShell.vue` - Main layout wrapper
- `src/components/pages/HomePage.vue` - Homepage page component
- `src/components/pages/ProductsPage.vue` - Products listing with filtering
- `src/components/pages/ProductPage.vue` - Product detail placeholder
- `src/components/pages/CartPage.vue` - Cart page placeholder
- `src/components/pages/ContactPage.vue` - Contact page placeholder
- `src/components/pages/LookbookPage.vue` - Lookbook page wrapper
- `src/components/pages/CustomPage.vue` - Generic custom page placeholder
- `src/components/products/ProductCard.vue` - Reusable product card
- `docs/VUE_FIRST_ARCHITECTURE.md` - Migration plan and documentation

### Files Modified
- `src/index.js` - New page-based mounting system with legacy support
- `source/layout.html` - Enhanced data injection, conditional rendering for Vue-first pages
- `source/home.html` - Simplified to Vue-first mount point
- `source/products.html` - Simplified to Vue-first mount point with category/search data
- `src/locales/fr.json` - Added products page translations
- `src/locales/en.json` - Added products page translations

## [2025-11-06]

### Architecture
- **Vue/BigCartel Page Separation**: Implemented clean separation between Vue-powered pages and traditional BigCartel theme pages
- **is_vue_page Helper**: Created single source of truth variable to identify Vue pages (Homepage, Product pages, Products listing, Lookbook)
- **Conditional Asset Loading**: Vue pages now load only webpack assets (CSS/JS), BigCartel pages load only theme assets
- **Conditional Footer**: Vue pages use Vue Footer component, BigCartel pages use original HTML footer
- **Development Workflow**: Established dual-server setup with webpack dev server (port 8080) and Dugway server (port 9292)

### Features
- **Products Listing Page**: Converted /products from BigCartel Liquid template to Vue component
- **ProductsListing Component**: New Vue component with bilingual title and ProductGrid integration
- **Clean Vue Pages**: Homepage, product pages, products listing, and lookbook now free from BigCartel CSS conflicts

### Bug Fixes
- Fixed BigCartel CSS interfering with Vue pages by implementing conditional loading
- Fixed footer appearing on Vue pages when it should only show on BigCartel pages
- Fixed page detection using reliable `page.permalink` and `page.full_url` checks instead of unreliable `page.category`
- Fixed blank Vue pages by ensuring webpack dev server runs alongside Dugway

### Files Created
- `src/components/ProductsListing.vue` - Vue component for products listing page
- `.vscode/settings.json` - VS Code customization with pink title bar

### Files Modified
- `source/layout.html` - Added is_vue_page variable, conditional CSS/JS/footer loading
- `source/products.html` - Simplified from 132-line Liquid template to Vue mount point
- `src/index.js` - Added ProductsListing mounting logic
- `src/locales/fr.json` - Added productsListing.title translation ("BOUTIQUE")
- `src/locales/en.json` - Added productsListing.title translation ("SHOP")

## [2025-10-19]

### Features
- **Bilingual Support**: Complete internationalization (i18n) system with French and English language support
- **Language Switcher**: Added FR/EN toggle button in navigation for instant language switching
- **Vue Navigation**: New black sticky navigation with centered links (BOUTIQUE, LOOKBOOK, CONTACT, PANIER)
- **Vue Footer**: New footer component with circular smiley face logo and navigation links
- **Homepage Redesign**: Redesigned homepage to match new design specifications
- **3-Column Product Grid**: Updated product grid to display 3 columns on desktop/tablet
- **Full-Width Sections**: Hero slider and banner sections now span full viewport width
- **Language Persistence**: User language preference saved in browser localStorage
- **Mobile Menu**: Responsive hamburger menu with smooth animations
- **Translated UI**: All static text, navigation, and product states now support both languages

### Architecture
- **Vue Layout System**: Implemented Layout component wrapping Navigation, content, and Footer
- **Data Injection**: BigCartel data (pages, cart, store info) injected from Liquid to Vue via `window.BIGCARTEL_DATA`
- **Translation Files**: Centralized translations in `src/locales/fr.json` and `src/locales/en.json`
- **i18n Configuration**: Language preference management with localStorage and HTML lang attribute updates
- **Component Structure**: Homepage and Lookbook pages now use Layout wrapper for consistent UI

### Dependencies
- Added `vue-i18n@9` for internationalization
- Added `@vueuse/head` for dynamic meta tag management

### Files Created
- `src/locales/fr.json` - French translations
- `src/locales/en.json` - English translations
- `src/i18n/index.js` - i18n configuration and language management
- `src/components/Navigation.vue` - Vue-based navigation with language switcher
- `src/components/Footer.vue` - Reusable footer component
- `src/components/Layout.vue` - Layout wrapper component

### Files Modified
- `source/layout.html` - Added BigCartel data injection, removed Liquid-based header
- `src/index.js` - Added i18n plugin, wrapped pages in Layout component
- `src/components/Homepage.vue` - Updated to use i18n, removed inline footer
- `src/components/ProductGrid.vue` - Added i18n for loading/error states and product badges
- `src/components/HeroSection.vue` - Enhanced styling for full-width display
- `src/components/BannerSection.vue` - Enhanced overlay and full-width styling
- `src/style.css` - Removed navigation styles (moved to Navigation.vue), added full-width layout system

## [2025-10-08]

### Performance
- Rebuilt masonry layout with JavaScript-based positioning for stable, jump-free image flow
- Implemented progressive image loading with blur-up effect (20px placeholders ~1-2KB each)
- Added Intersection Observer for true lazy loading - images only load when scrolled into view
- Optimized Cloudinary URLs: reduced from 4160px to responsive 400px/800px/1200px variants
- Initial page load reduced from ~100MB to ~30KB (placeholders only)
- Removed `lazysizes` library (5.3.2) in favor of custom Intersection Observer implementation
- Optimized hover animations: replaced heavy 3D flip effect with subtle scale transformation (1.02x)
- Images now load with proper aspect ratios in natural masonry columns
- Reduced JavaScript bundle size by removing unused dependencies

### Features
- Added progressive loading with blur-up effect (Medium-style image loading)
- Implemented smart lazy loading with Intersection Observer API
- Added loading state with visual loader for LookBook
- Added error state with retry button when images fail to load
- Added per-image error handling that automatically filters out broken images
- Added empty state display when no images are available
- Improved responsive design with better mobile, tablet, and desktop breakpoints
- Full-width masonry layout that breaks out of theme wrapper constraints

### Bug Fixes
- Fixed slow LookBook performance issues
- Fixed non-working masonry layout
- Fixed HTML mounting issue (changed self-closing div to proper closing tag)
- Fixed Cloudinary URL transformations to properly optimize images
- Disabled hover effects on mobile devices to prevent unwanted interactions

### Dependencies
- Removed `flexmasonry` (unused dependency)
- Removed `lazysizes` (replaced with native loading)

### Files Modified
- `src/components/LookBook.vue` - Complete rewrite with modern CSS Grid and better UX
- `package.json` - Removed unused dependencies
- `source/stylesheets/layout.sass` - Removed flexmasonry import
