# Domain Migration Guide: parisnordest.com → casquette.com

Complete guide to migrate from parisnordest.com to casquette.com while preserving SEO.

**Timeline**: Allow 2-3 hours for complete setup
**Cost**: ~$12-15/year (old domain registration only)
**SEO Preservation**: 90-95% of rankings maintained

---

## 📋 Pre-Migration Checklist

### Before You Start:
- [ ] New domain `casquette.com` purchased
- [ ] Access to BigCartel admin panel
- [ ] Access to domain registrar for both domains
- [ ] Cloudflare account (free) - create at https://dash.cloudflare.com/sign-up

---

## Part 1: Set Up New Domain (casquette.com)

### Step 1: Configure BigCartel for New Domain

1. Log into your **BigCartel admin panel**
2. Go to **Account Settings** → **Custom Domain**
3. Remove old domain: `parisnordest.com` (or leave it if BigCartel allows multiple)
4. Add new domain: `casquette.com`
5. BigCartel will provide DNS records (write these down):
   ```
   Type: CNAME
   Name: @
   Value: shops.bigcartel.com (or similar)

   Type: CNAME
   Name: www
   Value: shops.bigcartel.com
   ```

### Step 2: Add casquette.com to Cloudflare

1. Go to https://dash.cloudflare.com
2. Click **"Add a Site"**
3. Enter: `casquette.com`
4. Click **"Add Site"**
5. Select **"Free Plan"** → Click **"Continue"**
6. Cloudflare will scan existing DNS records → Click **"Continue"**

### Step 3: Configure DNS for casquette.com

1. In Cloudflare DNS settings, add BigCartel records:

   **Record 1:**
   - Type: `CNAME`
   - Name: `@` (or leave blank for root)
   - Target: `shops.bigcartel.com` (use value from BigCartel)
   - Proxy status: **Proxied** (orange cloud)
   - TTL: Auto

   **Record 2:**
   - Type: `CNAME`
   - Name: `www`
   - Target: `shops.bigcartel.com`
   - Proxy status: **Proxied** (orange cloud)
   - TTL: Auto

2. Click **"Save"**

### Step 4: Update Domain Nameservers

1. Cloudflare will show you 2 nameservers like:
   ```
   ava.ns.cloudflare.com
   bart.ns.cloudflare.com
   ```
   **Write these down!**

2. Go to your **domain registrar** (where you bought casquette.com):
   - Common registrars: Namecheap, GoDaddy, Google Domains, OVH, Gandi

3. Find **"Nameservers"** or **"DNS Management"**

4. Change from default nameservers to Cloudflare nameservers:
   ```
   Replace:
   ns1.yourregistrar.com → ava.ns.cloudflare.com
   ns2.yourregistrar.com → bart.ns.cloudflare.com
   ```

5. **Save changes**

6. **Wait 24-48 hours** for DNS propagation (usually faster, 1-4 hours)

### Step 5: Verify casquette.com is Live

1. Check DNS propagation: https://dnschecker.org
   - Enter: `casquette.com`
   - Should show Cloudflare nameservers globally (green checkmarks)

2. Visit `https://casquette.com` in browser
   - Should show your BigCartel store

3. Test `https://www.casquette.com`
   - Should also work

4. In Cloudflare, check status: Should say **"Active"**

---

## Part 2: Set Up Old Domain Redirect (parisnordest.com)

### Step 6: Add parisnordest.com to Cloudflare

1. In Cloudflare dashboard, click **"Add a Site"**
2. Enter: `parisnordest.com`
3. Select **"Free Plan"** → Continue
4. Cloudflare scans DNS → **Delete all existing DNS records** (we don't need them)

### Step 7: Create Minimal DNS for Redirect

We need DNS records for the redirect to work:

1. In Cloudflare DNS for `parisnordest.com`, add:

   **Record 1:**
   - Type: `A`
   - Name: `@`
   - IPv4 address: `192.0.2.1` (placeholder IP)
   - Proxy status: **Proxied** (orange cloud ☁️)
   - TTL: Auto

   **Record 2:**
   - Type: `A`
   - Name: `www`
   - IPv4 address: `192.0.2.1` (same placeholder)
   - Proxy status: **Proxied** (orange cloud ☁️)
   - TTL: Auto

   > **Note**: The IP doesn't matter because Cloudflare proxies the request and handles the redirect. We just need a valid DNS entry.

2. Click **"Save"**

### Step 8: Update parisnordest.com Nameservers

1. Cloudflare shows nameservers (different from casquette.com):
   ```
   charlie.ns.cloudflare.com
   dana.ns.cloudflare.com
   ```

2. Go to **parisnordest.com registrar**

3. Update nameservers to Cloudflare ones

4. **Save changes**

5. Wait for DNS propagation (1-24 hours)

### Step 9: Create 301 Redirect Rule

**WAIT** until parisnordest.com shows "Active" in Cloudflare (DNS propagated)

1. In Cloudflare dashboard for `parisnordest.com`

2. Go to **"Rules"** → **"Page Rules"** (left sidebar)

   > **Note**: Free plan includes 3 Page Rules

3. Click **"Create Page Rule"**

4. Configure redirect:
   ```
   If the URL matches:
   *parisnordest.com/*

   Then the settings are:
   Forwarding URL: 301 - Permanent Redirect

   Destination URL:
   https://casquette.com/$2
   ```

5. **Important**: Click to expand the rule and verify:
   - **Match**: `*parisnordest.com/*`
   - **Type**: `301 - Permanent Redirect`
   - **Destination**: `https://casquette.com/$2`

6. Click **"Save and Deploy"**

### Step 10: Create www Redirect (Optional but Recommended)

Create a second Page Rule for www subdomain:

1. Click **"Create Page Rule"**

2. Configure:
   ```
   If the URL matches:
   *www.parisnordest.com/*

   Then the settings are:
   Forwarding URL: 301 - Permanent Redirect

   Destination URL:
   https://casquette.com/$2
   ```

3. Click **"Save and Deploy"**

---

## Part 3: Testing & Verification

### Step 11: Test Redirects

Test these URLs (use different browsers/incognito to avoid cache):

1. **Root domain**: http://parisnordest.com
   - Should redirect to: https://casquette.com

2. **WWW subdomain**: http://www.parisnordest.com
   - Should redirect to: https://casquette.com

3. **HTTPS**: https://parisnordest.com
   - Should redirect to: https://casquette.com

4. **Deep links**: http://parisnordest.com/products
   - Should redirect to: https://casquette.com/products

5. **Product pages**: http://parisnordest.com/product/your-product
   - Should redirect to: https://casquette.com/product/your-product

### Step 12: Verify 301 Status Code

Use a redirect checker tool:

1. Go to: https://httpstatus.io
2. Enter: `http://parisnordest.com`
3. Should show:
   ```
   301 Moved Permanently
   Location: https://casquette.com
   ```

Alternatively, use browser DevTools:
1. Open DevTools (F12)
2. Go to Network tab
3. Visit `parisnordest.com`
4. Check first request shows "301" status

---

## Part 4: Google Search Console Setup

### Step 13: Add New Property (casquette.com)

1. Go to https://search.google.com/search-console

2. Click **"Add Property"**

3. Select **"URL prefix"** property

4. Enter: `https://casquette.com`

5. Click **"Continue"**

6. **Verify ownership** using one of these methods:

   **Option A: HTML Tag (Recommended)**
   - Copy the meta tag provided
   - Add to `source/layout.html` in `<head>` section:
     ```html
     <meta name="google-site-verification" content="YOUR_CODE_HERE" />
     ```
   - Deploy to BigCartel
   - Click "Verify" in Search Console

   **Option B: Google Analytics**
   - If you have GA4 already installed
   - Select "Google Analytics" verification
   - Click "Verify"

### Step 14: Submit New Sitemap

1. In Search Console for casquette.com

2. Go to **"Sitemaps"** (left sidebar)

3. Add sitemap URL:
   ```
   https://casquette.com/sitemap.xml
   ```

   > BigCartel automatically generates sitemaps

4. Click **"Submit"**

### Step 15: Change of Address (If Old Property Exists)

**Only do this if you have parisnordest.com in Search Console**

1. Go to old property (parisnordest.com) in Search Console

2. Click **"Settings"** (gear icon)

3. Click **"Change of address"**

4. Select new site: `casquette.com`

5. Confirm 301 redirects are in place

6. Click **"Validate and Update"**

7. Google will verify redirects and transfer data (takes 180 days)

---

## Part 5: Social Media & Marketing Updates

### Step 16: Update All External Links

Update domain on all platforms:

**Social Media:**
- [ ] Instagram bio link
- [ ] Facebook page link
- [ ] TikTok bio link
- [ ] Twitter/X bio link
- [ ] LinkedIn company page
- [ ] Pinterest profile

**Directories & Listings:**
- [ ] Google Business Profile (if applicable)
- [ ] Yelp
- [ ] Any local directories
- [ ] Industry-specific listings

**Marketing Materials:**
- [ ] Email signature
- [ ] Business cards (order new ones)
- [ ] Packaging/labels (if applicable)
- [ ] Print materials

**Email Marketing:**
- [ ] Update sender domain (if using custom email)
- [ ] Update footer links in email templates
- [ ] Send announcement email to customers

---

## Part 6: Monitoring & Maintenance

### Step 17: Monitor First Week

**Daily checks (first 7 days):**

1. **Google Search Console** (casquette.com)
   - Check "Coverage" for any errors
   - Monitor "Performance" for traffic drops

2. **Google Analytics**
   - Verify traffic tracking works
   - Check if sessions are being recorded

3. **Test random redirects**
   - Test 5-10 old URLs daily
   - Ensure all redirect to correct pages

### Step 18: Monthly Monitoring (12 months)

**Monthly tasks:**

1. **Check Search Console** (both domains)
   - Old domain: Should show declining traffic (expected)
   - New domain: Should show increasing traffic

2. **Review Rankings**
   - Use Google Search Console "Performance"
   - Track keyword positions
   - Should stabilize after 2-3 months

3. **Check Redirects Still Work**
   - Test a few old URLs
   - Verify 301 redirects active

### Step 19: After 12 Months

**When to stop redirects:**

✅ **Safe to let old domain expire if:**
- Search Console shows minimal traffic to old domain (<5% of total)
- New domain rankings are stable
- 12+ months have passed
- Most backlinks updated or aged out

⚠️ **Keep redirects longer if:**
- Old domain still receives 10%+ of traffic
- Important backlinks still pointing to old domain
- Rankings haven't fully stabilized

---

## 📊 What to Expect

### **Week 1-2:**
- Minor ranking fluctuations (±5-10 positions)
- Google discovers redirect
- Some cached results still show old domain

### **Month 1:**
- Rankings stabilize
- Google mostly updated to new domain
- Traffic ~95% of previous levels

### **Months 2-3:**
- Full SEO authority transfer
- Rankings return to normal or better
- Google fully updated

### **Months 6-12:**
- Old domain traffic drops to near-zero
- New domain fully established
- Safe to consider ending redirects

---

## 🆘 Troubleshooting

### Redirect Not Working

**Check:**
1. DNS propagated? Use dnschecker.org
2. Cloudflare status "Active" for both domains?
3. Page Rule order correct? (more specific rules first)
4. Proxy enabled (orange cloud)?

**Try:**
- Wait 5-10 minutes for Cloudflare rule to propagate
- Clear browser cache (Ctrl+Shift+Delete)
- Test in incognito/private mode
- Check Page Rule syntax

### SSL/HTTPS Errors

**Fix:**
1. In Cloudflare → SSL/TLS → Set to **"Full"**
2. Wait 5 minutes
3. Test again

### Redirect Loop

**Fix:**
1. Check Page Rule isn't redirecting to itself
2. Verify destination URL doesn't have trailing slash issues
3. Temporarily disable Page Rule to test

### Traffic Drop

**Normal drops (don't panic):**
- 5-10% in first 2 weeks (temporary)
- Some rankings fluctuate

**Investigate if:**
- 30%+ traffic drop lasting >2 weeks
- All redirects return 404
- Google Search Console shows errors

**Fix:**
1. Verify redirects working with httpstatus.io
2. Check Search Console Coverage for errors
3. Re-submit sitemap
4. Give it time (Google needs 2-4 weeks)

---

## 📞 Support Resources

### Cloudflare Help:
- Docs: https://developers.cloudflare.com/rules/page-rules/
- Community: https://community.cloudflare.com/
- Support: https://dash.cloudflare.com/?to=/:account/support

### Google Search Console:
- Help: https://support.google.com/webmasters/
- Change of Address: https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes

### Testing Tools:
- DNS Checker: https://dnschecker.org
- Redirect Checker: https://httpstatus.io
- Redirect Tester: https://www.redirect-checker.org/

---

## ✅ Final Checklist

Before going live:
- [ ] casquette.com working on BigCartel
- [ ] Both domains on Cloudflare
- [ ] Nameservers updated for both domains
- [ ] DNS showing "Active" in Cloudflare
- [ ] Page Rules created for redirects
- [ ] All test redirects working (root, www, deep links)
- [ ] 301 status confirmed (not 302)
- [ ] Google Search Console property added for casquette.com
- [ ] Sitemap submitted
- [ ] Change of Address submitted (if applicable)
- [ ] Social media links updated

Launch day:
- [ ] Final redirect tests
- [ ] Monitor Search Console for errors
- [ ] Check Analytics tracking
- [ ] Announce domain change to customers (optional)

---

## 💡 Pro Tips

1. **Keep detailed notes** of when you made each change (helps with troubleshooting)

2. **Screenshots** of Cloudflare Page Rule setup (for reference)

3. **Don't panic** if rankings drop slightly in first week (normal)

4. **Be patient** - Full SEO transfer takes 2-3 months

5. **Monitor weekly** for first month, then monthly

6. **Set calendar reminder** for 12 months to review if you can drop old domain

---

## 📅 Maintenance Schedule

**Set these calendar reminders:**

- **Day 7**: Check Search Console, verify redirects
- **Day 30**: Review rankings, check traffic levels
- **Day 60**: Verify SEO authority transferring
- **Day 90**: Full review, rankings should be stable
- **Day 180**: Google Search Console transfer complete
- **Day 365**: Decision point - keep or drop old domain

---

**Questions?** Review troubleshooting section or check Cloudflare docs.

**Good luck with your migration! 🚀**
