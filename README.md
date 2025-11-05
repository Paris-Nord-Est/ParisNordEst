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
<!-- DEV: Load live CSS from webpack-dev-server -->
<link href="http://localhost:8080/main.css" media="screen" rel="stylesheet" type="text/css">

<!-- Before </body> tag -->
<script src="http://localhost:8080/app.js"></script>
<!-- <script src="https://cdn.jsdelivr.net/gh/Baldrani/ParisNordEst@v1.4.4/source/dist/app.js"></script> -->
```

**Why?** Dugway serves compiled CSS from disk (`/theme.css`), but webpack-dev-server serves live CSS with Hot Module Replacement. Without loading `http://localhost:8080/main.css`, your CSS changes won't appear until you rebuild.

---

## This is Paris Nord-Est Theme

How to deploy :

Run `npm run watch`
Push to master and create a new tag. (v1.3)
Change CDN in layout. `<script src="https://cdn.jsdelivr.net/gh/Baldrani/ParisNordEst@v1.3/source/dist/app.js"></script>`
Change CSS also : ` <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Baldrani/ParisNordEst@v1.3/source/dist/main.css">` 

DON'T FORGET TO CHANGE THE TAG

Then in theme.js remove the line `// = require dist/app` (only used on dev).
Run `dugway build` extract the CSS file and upload it on bigcartel.

Change the differents files.