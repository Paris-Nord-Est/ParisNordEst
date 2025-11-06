# Changelog

All notable changes to Paris Nord-Est theme will be documented in this file.

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
