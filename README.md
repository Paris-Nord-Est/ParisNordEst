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

1. **Commit your changes:**
   ```bash
   git add .
   git commit -m "feat: add new hero section"
   git push origin main
   ```

**That's it!** 🎉

The workflow automatically:
- Builds production assets
- Injects the version from git tag
- Commits built files
- Creates version tag
- Purges CDN cache
- Your changes are live in ~30 seconds!

#### What Happens Automatically:

1. ✅ **Auto-Versioning:** Analyzes commit messages (feat/fix/BREAKING CHANGE)
2. ✅ **Production Build:** Runs `npm run build` with version injection
3. ✅ **Commit Build:** Commits built assets to main branch
4. ✅ **Tag Creation:** Creates git tag with new version
5. ✅ **Cache Purge:** Purges jsDelivr cache for JS & CSS
6. ✅ **Live in 30s:** Changes appear on your store

**Version bumps:**
- `feat:` → minor (v3.0.0 → v3.1.0)
- `fix:` → patch (v3.0.0 → v3.0.1)
- `BREAKING CHANGE:` → major (v3.0.0 → v4.0.0)

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

#### Automated Deployment Workflow

A single GitHub Action handles everything when you push to main:

- **Triggers:** Automatically on every push to `main`
- **What it does:**
  1. Analyzes your commit messages (conventional commits)
  2. Calculates new version number (major/minor/patch)
  3. Creates and pushes a git tag
  4. Waits 30 seconds for jsDelivr to index the tag
  5. Purges all assets from jsDelivr cache:
     - JavaScript bundle (`app.js`)
     - CSS bundle (`main.css`)
     - All static images (hero slider, banner, logos)
- **Result:** Your changes go live within ~30 seconds

You can view the deployment status in the "Actions" tab on GitHub.

#### Verify Deployed Version

Check which version is currently deployed:

**Method 1: Browser Console (Easiest)**
```javascript
// Open DevTools Console on your store
window.PNE_VERSION  // e.g., "v3.0.2"
window.PNE_BUILD    // e.g., "2025-12-28T10:15:30.123Z"
```

**Method 2: Console Log (On Page Load)**
- Open DevTools Console
- Refresh the page
- Look for the styled version banner: `🧢 Paris Nord-Est v3.0.2`

**Method 3: Check jsDelivr Headers**
```bash
curl -I https://cdn.jsdelivr.net/gh/Baldrani/ParisNordEst@latest/source/dist/app.js
# Look for "x-served-by" header
```

**Method 4: Network Tab**
- DevTools → Network tab
- Find `app.js` request
- Check Response Headers for version info

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