# Commit Message Convention

This project uses **Conventional Commits** for automatic semantic versioning. Your commit messages determine how the version number is incremented.

## Format

```
<type>: <description>

[optional body]

[optional footer]
```

## Types and Version Bumps

| Commit Type | Version Bump | Example | Result |
|-------------|--------------|---------|--------|
| `feat:` or `feature:` | **Minor** (v3.0.0 → v3.1.0) | `feat: add new hero section` | New feature added |
| `fix:` or `bugfix:` | **Patch** (v3.0.0 → v3.0.1) | `fix: correct image alignment` | Bug fix |
| `BREAKING CHANGE:` or `!:` | **Major** (v3.0.0 → v4.0.0) | `feat!: redesign homepage` | Breaking change |
| Other (`chore:`, `docs:`, etc.) | **Patch** (v3.0.0 → v3.0.1) | `chore: update dependencies` | Default patch bump |

## Examples

### Feature (Minor Version Bump)
```bash
git commit -m "feat: add language switcher to navigation"
# v3.0.0 → v3.1.0
```

### Bug Fix (Patch Version Bump)
```bash
git commit -m "fix: resolve broken image paths in footer"
# v3.0.0 → v3.0.1
```

### Breaking Change (Major Version Bump)
```bash
git commit -m "feat!: redesign product page layout

BREAKING CHANGE: Product page now uses Vue components exclusively"
# v3.0.0 → v4.0.0
```

### Other Types (Patch Version Bump)
```bash
git commit -m "chore: update webpack configuration"
git commit -m "docs: improve README deployment section"
git commit -m "style: format code with prettier"
git commit -m "refactor: simplify CDN helper function"
# All result in: v3.0.0 → v3.0.1
```

## Multi-Commit Pushes

When you push multiple commits, the **highest priority change** determines the version bump:

```bash
git commit -m "fix: correct typo in footer"          # patch
git commit -m "feat: add new banner component"       # minor
git commit -m "chore: update dependencies"           # patch
git push origin main

# Result: v3.0.0 → v3.1.0 (minor bump wins)
```

Priority order: **Major > Minor > Patch**

## Workflow

1. **Make changes and commit with conventional message:**
   ```bash
   git add .
   git commit -m "feat: add CDN configuration"
   ```

2. **Push to main:**
   ```bash
   git push origin main
   ```

3. **Automatic process:**
   - ✅ GitHub Action analyzes your commit messages
   - ✅ Determines version bump type (major/minor/patch)
   - ✅ Creates and pushes new version tag
   - ✅ Webpack reads git tag and injects version into build
   - ✅ CDN cache purge workflow triggers automatically
   - ✅ Your changes go live within ~30 seconds

4. **Verify deployment:**
   ```javascript
   // Open your store and check the console:
   window.PNE_VERSION  // Shows current deployed version
   ```

   The version is automatically injected from git tags at build time - no manual updates needed!

## Best Practices

### ✅ Good Commit Messages
```bash
feat: add hover effect to product images
fix: resolve navigation menu overlap on mobile
feat!: migrate to Vue 3 composition API
chore: update eslint configuration
docs: add deployment guide to README
```

### ❌ Avoid These
```bash
update stuff                    # Too vague
Fixed bug                       # Should be lowercase "fix:"
WIP                            # Work in progress, don't commit yet
asdfasdf                       # Not descriptive
```

## Skip Auto-Tagging

If you need to push changes **without** creating a new version tag (rare cases), modify files that are ignored in the workflow:

- `README.md`
- `CHANGELOG.md`
- Files in `docs/`
- Files in `.github/`

These files can be updated without triggering auto-tagging.

## Manual Override

If you need to create a specific version manually:

```bash
# Create tag manually
git tag v4.2.0 -m "Manual release v4.2.0"
git push origin v4.2.0

# This will trigger the CDN purge workflow
```

## Troubleshooting

### Tag Already Exists
If the auto-tag workflow finds a tag already exists, it will skip tag creation. Check the Actions tab for details.

### Wrong Version Created
If an incorrect version is created, you can delete the tag:

```bash
# Delete local tag
git tag -d v3.1.0

# Delete remote tag
git push origin :refs/tags/v3.1.0
```

Then push a corrected commit to create the proper version.

## Learn More

- [Conventional Commits Specification](https://www.conventionalcommits.org/)
- [Semantic Versioning](https://semver.org/)
