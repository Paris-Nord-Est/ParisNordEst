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

The theme uses **fully automated deployment** with jsDelivr CDN, semantic versioning, and automatic cache purging. You just push your code and everything else happens automatically!

#### Deployment Steps (Fully Automated):

1. **Build and commit your changes:**
   ```bash
   npm run watch
   git add .
   git commit -m "feat: add new hero section"
   git push origin main
   ```

**That's it!** 🎉 Your changes are now live!

#### What Happens Automatically:

1. ✅ **Auto-Tagging:** GitHub Action analyzes your commit message and creates a version tag
   - `feat:` → minor version (v3.0.0 → v3.1.0)
   - `fix:` → patch version (v3.0.0 → v3.0.1)
   - `BREAKING CHANGE:` → major version (v3.0.0 → v4.0.0)

2. ✅ **Cache Purge:** Another GitHub Action automatically purges jsDelivr cache

3. ✅ **Live Deployment:** Your changes are live within ~30 seconds

#### CSS Updates (Only When Needed)

If you made CSS changes, you still need to upload CSS to BigCartel:

1. In `theme.js`, remove the line `// = require dist/app` (only used in dev)
2. Run `dugway build` to extract the CSS file
3. Upload the CSS to BigCartel

#### Commit Message Format

Use [Conventional Commits](/.github/COMMIT_CONVENTION.md) for automatic versioning:

```bash
# Feature (minor version bump)
git commit -m "feat: add language switcher"

# Bug fix (patch version bump)
git commit -m "fix: resolve navigation overlap"

# Breaking change (major version bump)
git commit -m "feat!: redesign homepage layout"
```

See [Commit Convention Guide](/.github/COMMIT_CONVENTION.md) for detailed examples.

#### How CDN Auto-Update Works

- The `layout.html` file references: `https://cdn.jsdelivr.net/gh/Baldrani/ParisNordEst@latest/source/dist/app.js`
- All images use the `@latest` tag via the `getCdnPath()` helper in `src/config/cdn.js`
- When you create a new git tag, jsDelivr automatically resolves `@latest` to that tag
- **Cache duration:** jsDelivr caches `@latest` for approximately 12 hours

#### Automated Cache Purge (GitHub Action)

A GitHub Action automatically purges the jsDelivr cache when you push a new tag:

- **Triggers:** Automatically when you push any tag starting with `v` (e.g., `v3.0.1`)
- **What it purges:**
  - JavaScript bundle (`app.js`)
  - CSS bundle (`main.css`)
  - All static images (hero slider, banner, logos)
- **Timing:** Waits 30 seconds for jsDelivr to index the new tag, then purges
- **Result:** Your changes go live immediately without manual cache clearing

You can view the purge status in the "Actions" tab on GitHub after pushing a tag.

#### Manual Cache Purge (If Needed)

If you need to manually purge the cache for any reason:

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