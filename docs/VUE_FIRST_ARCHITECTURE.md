# Vue-First Architecture Migration Plan

This document outlines the migration from the hybrid Liquid/Vue architecture to a Vue-first approach where all UI rendering is handled by Vue components.

## Architecture Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Form submissions | HTML forms (BigCartel native) | Simpler integration, works with BigCartel backend |
| SEO | Client-side rendering + Liquid meta tags | Modern crawlers handle JS well, can optimize later |
| Images | BigCartel JS API | Consistent data source |
| State management | Pinia | Official Vue.js recommendation |
| Styling | TailwindCSS | Single source of truth, drop SASS complexity |

## Core Philosophy

1. **Dugway becomes infrastructure only** - handles routing, API connection, and provides raw data
2. **Vue handles ALL rendering** - every page is a Vue component
3. **Liquid templates become minimal shells** - just mount points + data injection
4. **Single source of truth for UI** - TailwindCSS + Vue components

## New Directory Structure

```
src/
├── index.js                    # Main entry - mounts apps based on page
├── composables/                # Shared logic
│   └── useBigCartel.js         # BigCartel API wrapper (promisified)
│
├── stores/                     # Pinia stores for state management
│   ├── cart.js                 # Cart state (reactive, syncs with BigCartel)
│   └── theme.js                # Theme config from window.BIGCARTEL_DATA
│
├── components/
│   ├── layout/                 # Global layout components
│   │   ├── AppShell.vue        # Main wrapper (Nav + content + Footer)
│   │   ├── Navigation.vue      # Header navigation
│   │   └── Footer.vue          # Footer
│   │
│   ├── pages/                  # Full page components
│   │   ├── HomePage.vue        # Homepage
│   │   ├── ProductsPage.vue    # Products listing
│   │   ├── ProductPage.vue     # Single product detail
│   │   ├── CartPage.vue        # Shopping cart
│   │   ├── ContactPage.vue     # Contact form
│   │   ├── LookbookPage.vue    # Lookbook gallery
│   │   └── CustomPage.vue      # Generic custom page renderer
│   │
│   ├── products/               # Product-related components
│   │   ├── ProductGrid.vue     # Reusable product grid
│   │   ├── ProductCard.vue     # Single product card
│   │   ├── ProductGallery.vue  # Image carousel/gallery
│   │   ├── ProductOptions.vue  # Variant selector
│   │   ├── ProductPrice.vue    # Price display
│   │   └── AddToCart.vue       # Add to cart form
│   │
│   ├── cart/                   # Cart components
│   │   ├── CartItem.vue        # Single cart item row
│   │   ├── CartSummary.vue     # Totals, checkout
│   │   └── CartEmpty.vue       # Empty cart state
│   │
│   ├── home/                   # Homepage components
│   │   ├── HeroSection.vue     # Hero slider
│   │   └── BannerSection.vue   # Banner sections
│   │
│   └── ui/                     # Reusable UI primitives
│       ├── LoaderItem.vue      # Loading skeleton
│       └── Button.vue          # Styled button
│
├── i18n/                       # Internationalization
│   └── index.js
│
└── locales/                    # Translation files
    ├── fr.json
    └── en.json
```

## Page Template Format

Each Liquid template becomes a minimal shell with a mount point:

```html
<!-- source/home.html -->
<div id="app" data-page="home"></div>

<!-- source/products.html -->
<div id="app" data-page="products" data-category="{{ category.permalink }}"></div>

<!-- source/product.html -->
<div id="app" data-page="product" data-product="{{ product.permalink }}"></div>

<!-- source/cart.html -->
<div id="app" data-page="cart"></div>

<!-- source/contact.html -->
<div id="app" data-page="contact"></div>
```

## Data Flow

### Global Data Injection (layout.html)

```javascript
window.BIGCARTEL_DATA = {
  store: {
    name: "Store Name",
    currency: "EUR",
    website: "https://...",
    moneyFormat: "{{amount}} EUR"
  },
  pages: [/* custom pages */],
  categories: [/* product categories */],
  cart: { count: 0, url: "/cart" },
  navigation: { products, contact, home, lookbook },
  currentPage: { name, permalink, category, fullUrl }
};
```

### BigCartel API (via useBigCartel composable)

```javascript
const { findAllProducts, findProduct, addToCart } = useBigCartel()

// Products are fetched dynamically
const products = await findAllProducts()
const product = await findProduct('product-slug')

// Cart operations
await addToCart(optionId, quantity)
```

## Migration Phases

### Phase 1: Infrastructure Setup ✅ COMPLETED
- [x] Install Pinia
- [x] Create `useBigCartel.js` composable
- [x] Create `cart.js` Pinia store
- [x] Create `theme.js` Pinia store
- [x] Create `AppShell.vue` layout component
- [x] Refactor `index.js` for page-based mounting
- [x] Update `layout.html` with conditional rendering

### Phase 2: Products Page ✅ COMPLETED
- [x] Create `ProductsPage.vue` with category filtering
- [x] Create `ProductCard.vue` component
- [x] Add category filtering support
- [x] Simplify `source/products.html` to mount point
- [x] Update translations (fr.json, en.json)

### Phase 3: Product Detail Page ✅ COMPLETED
- [x] Create `ProductPage.vue` with full product layout
- [x] Create `ProductGallery.vue` (Splide carousel with thumbnails)
- [x] Create `ProductOptions.vue` (variant selector + option groups)
- [x] Create `AddToCart.vue` (HTML form submission)
- [x] Create `ProductPrice.vue` (price display with sale support)
- [x] Simplify `source/product.html` to mount point
- [x] Update translations (fr.json, en.json)

### Phase 4: Cart Page ✅ COMPLETED
- [x] Create `CartPage.vue` (full cart with reactive state)
- [x] Create `CartItem.vue` (item row with quantity controls)
- [x] Create `CartSummary.vue` (totals + checkout form)
- [x] Create `CartEmpty.vue` (empty state with CTA)
- [x] Simplify `source/cart.html` to mount point
- [x] Update `layout.html` for cart page detection
- [x] Update translations (fr.json, en.json)

### Phase 5: Contact + Custom Pages (TODO)
- [ ] Create `ContactPage.vue` (HTML form)
- [ ] Create `CustomPage.vue` (generic renderer)
- [ ] Migrate `source/contact.html`
- [ ] Migrate custom pages

## Backward Compatibility

The new architecture supports both:
1. **New architecture**: `#app` with `data-page` attribute → AppShell
2. **Legacy architecture**: Old mount points (`#homepage-app`, `#lookbook`, etc.)

This allows gradual migration page by page.

## How to Add a New Page to Vue-First Architecture

1. Create page component in `src/components/pages/NewPage.vue`
2. Register in `src/index.js` pageComponents registry
3. Update `source/new-page.html`:
   ```html
   <div id="app" data-page="new-page" data-any-prop="value"></div>
   ```
4. Add page to `is_vue_first_page` check in `layout.html`
5. Build and test

## Testing

```bash
# Development
npm run watch && dugway serve

# Build
npm run build
```

## Files Created/Modified

### Created
- `src/composables/useBigCartel.js`
- `src/stores/cart.js`
- `src/stores/theme.js`
- `src/components/layout/AppShell.vue`
- `src/components/pages/HomePage.vue`
- `src/components/pages/ProductsPage.vue`
- `src/components/pages/ProductPage.vue`
- `src/components/pages/CartPage.vue`
- `src/components/pages/ContactPage.vue`
- `src/components/pages/LookbookPage.vue`
- `src/components/pages/CustomPage.vue`
- `src/components/products/ProductCard.vue`
- `src/components/products/ProductGallery.vue`
- `src/components/products/ProductOptions.vue`
- `src/components/products/ProductPrice.vue`
- `src/components/products/AddToCart.vue`
- `src/components/cart/CartItem.vue`
- `src/components/cart/CartSummary.vue`
- `src/components/cart/CartEmpty.vue`

### Modified
- `src/index.js` - New page-based mounting system
- `source/layout.html` - Enhanced data injection, conditional rendering
- `source/home.html` - New architecture mount point
- `source/products.html` - New architecture mount point with category/search data
- `source/product.html` - New architecture mount point
- `source/cart.html` - New architecture mount point
- `src/locales/fr.json` - Added products and cart translations
- `src/locales/en.json` - Added products and cart translations
- `package.json` - Added Pinia dependency
