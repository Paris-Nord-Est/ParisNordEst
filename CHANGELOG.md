# Changelog

All notable changes to Paris Nord-Est theme will be documented in this file.

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
