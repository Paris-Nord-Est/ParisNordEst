# Paris Nord-Est 🧢

**We've made this theme code public so that other [theme developers](https://help.bigcartel.com/developers/themes/) can learn from it.** 

## Develop locally

Install ruby
Install node

Run `gem install dugway`
Run `npm i`

Run `npm run dev` in one terminal (starts webpack-dev-server on port 8080)
Run `dugway serve` in another terminal (starts Dugway on port 9292)
Then access: `http://127.0.0.1:9292`

**Important:** In `layout.html`, you must load BOTH JavaScript AND CSS from webpack-dev-server for HMR to work:

```html
<!-- Inside <head> tag -->
<link href="{{ theme | theme_css_url }}" media="screen" rel="stylesheet" type="text/css">
<!-- DEV: Load live CSS from webpack-dev-server (homepage and product pages) -->
{% if page.category == 'home' or page.category == 'product' %}
<link href="http://localhost:8080/main.css" media="screen" rel="stylesheet" type="text/css">
{% endif %}

<!-- Before </body> tag -->
<script src="http://localhost:8080/app.js"></script>
<!-- <script src="https://cdn.jsdelivr.net/gh/Baldrani/ParisNordEst@v1.4.4/source/dist/app.js"></script> -->
```

**Why?**
- Dugway serves compiled CSS from disk (`/theme.css`), but webpack-dev-server serves live CSS with Hot Module Replacement
- Without loading `http://localhost:8080/main.css`, your CSS changes won't appear until you rebuild
- The CSS is loaded on homepage and product pages (which use Vue components and Tailwind for layout)
- Other pages (cart, contact, products list, etc.) don't load it to prevent Tailwind base styles from interfering with BigCartel theme styles

---

## This is Paris Nord-Est Theme

### How to Deploy

The theme uses jsDelivr CDN with automatic `@latest` tag resolution, which means you **no longer need to manually update version numbers** in your code!

#### Deployment Steps:

1. **Build assets:**
   ```bash
   npm run watch
   ```

2. **Commit and push your changes:**
   ```bash
   git add .
   git commit -m "Your commit message"
   git push origin main
   ```

3. **Create and push a new git tag:**
   ```bash
   git tag v3.0.1
   git push origin v3.0.1
   ```

4. **Update theme files:**
   - In `theme.js`, remove the line `// = require dist/app` (only used in dev)
   - Run `dugway build` to extract the CSS file
   - Upload the CSS to BigCartel

That's it! The CDN automatically serves from your latest tag.

#### How CDN Auto-Update Works

- The `layout.html` file references: `https://cdn.jsdelivr.net/gh/Baldrani/ParisNordEst@latest/source/dist/app.js`
- All images use the `@latest` tag via the `getCdnPath()` helper in `src/config/cdn.js`
- When you create a new git tag, jsDelivr automatically resolves `@latest` to that tag
- **Cache duration:** jsDelivr caches `@latest` for approximately 12 hours

#### Force Immediate Updates (Cache Purge)

If you need your changes to appear immediately without waiting for cache expiration:

1. Visit the jsDelivr Purge Tool: https://www.jsdelivr.com/tools/purge
2. Enter your CDN URL (e.g., `https://cdn.jsdelivr.net/gh/Baldrani/ParisNordEst@latest/source/dist/app.js`)
3. Click "Purge" to clear the cache
4. Your latest version will be served immediately

#### Emergency: Use Specific Version

If you need to temporarily bypass `@latest` and use a specific version:

1. Open `src/config/cdn.js`
2. Change:
   ```javascript
   export const CDN_BASE_URL = 'https://cdn.jsdelivr.net/gh/Baldrani/ParisNordEst@latest/source';
   ```
   to:
   ```javascript
   export const CDN_BASE_URL = 'https://cdn.jsdelivr.net/gh/Baldrani/ParisNordEst@v3.0.1/source';
   ```
3. Rebuild and redeploy