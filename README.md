# Terra Luna 😂

**We've made this theme code public so that other [theme developers](https://help.bigcartel.com/developers/themes/) can learn from it.** It's designed to work on [Big Cartel](https://www.bigcartel.com/) or locally with [Dugway](https://github.com/bigcartel/dugway). You're welcome to download, fork, read, and run this theme. However, you are not permitted to sell, distribute, or use this theme outside of Big Cartel. Thanks.


## This is Paris Nord-Est Theme

How to deploy :

Run `npm run watch`
Push to master and create a new tag. (v1.3)
Change CDN in layout. `<script src="https://cdn.jsdelivr.net/gh/Baldrani/ParisNordEst@v1.3/source/dist/app.js"></script>`

Then in theme.js remove the line `// = require dist/app` (only used on dev).
Run `dugway build` extract the CSS file and upload it on bigcartel.

Change the differents files.