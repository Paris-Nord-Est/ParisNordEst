# Cloudflare Page Rule - Quick Reference

**Goal**: Redirect all traffic from parisnordest.com → casquette.com

---

## DNS Setup (parisnordest.com)

Create these 2 DNS records in Cloudflare:

```
Record 1:
  Type: A
  Name: @
  IPv4: 192.0.2.1
  Proxy: ON (orange cloud ☁️)

Record 2:
  Type: A
  Name: www
  IPv4: 192.0.2.1
  Proxy: ON (orange cloud ☁️)
```

---

## Page Rules (parisnordest.com)

### Rule 1: Main Redirect
```
URL Pattern:
*parisnordest.com/*

Setting:
Forwarding URL: 301 - Permanent Redirect

Destination:
https://casquette.com/$2
```

### Rule 2: WWW Redirect
```
URL Pattern:
*www.parisnordest.com/*

Setting:
Forwarding URL: 301 - Permanent Redirect

Destination:
https://casquette.com/$2
```

---

## Quick Test

After setup, test these URLs:

✅ http://parisnordest.com → https://casquette.com
✅ https://parisnordest.com → https://casquette.com
✅ http://www.parisnordest.com → https://casquette.com
✅ http://parisnordest.com/products → https://casquette.com/products

**Verify 301 status**: https://httpstatus.io

---

## Visual Guide

```
Old URLs:                          New URLs:
───────────────────────────────   ──────────────────────
parisnordest.com              →   casquette.com
www.parisnordest.com          →   casquette.com
parisnordest.com/products     →   casquette.com/products
parisnordest.com/product/hat  →   casquette.com/product/hat
```

**Status Code**: 301 (Permanent Redirect) ✅
**Duration**: Keep active for 12 months minimum

---

## Troubleshooting

**Not redirecting?**
- Check Cloudflare status is "Active"
- Wait 5 minutes for rule propagation
- Clear browser cache / test in incognito
- Verify orange cloud (proxy) is enabled

**Redirect loop?**
- Check destination URL doesn't redirect back
- Ensure Page Rule syntax is exactly as shown above

**SSL errors?**
- Cloudflare → SSL/TLS → Set to "Full"
- Wait 5 minutes

---

**Full guide**: See `DOMAIN_MIGRATION_GUIDE.md`
