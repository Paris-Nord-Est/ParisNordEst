import "./style.css";

import { createApp, h } from "vue";
import i18n from "./i18n";

import App from "./App.vue";
import LookBook from "./components/LookBook.vue";
import Homepage from "./components/Homepage.vue";
import Layout from "./components/Layout.vue";

// Homepage Vue App with Layout
if (document.getElementById("homepage-app")) {
  const homepageApp = createApp({
    render: () => h(Layout, {}, () => h(Homepage)),
  });
  homepageApp.use(i18n);
  homepageApp.mount("#homepage-app");
}

// Product Data Vue part (for product pages)
if (document.getElementById("vue")) {
  const app = createApp(App);
  app.use(i18n);
  app.mount("#vue");
}

// Page Lookbook with Layout
if (document.getElementById("lookbook")) {
  const lookbookApp = createApp({
    render: () => h(Layout, {}, () => h(LookBook)),
  });
  lookbookApp.use(i18n);
  lookbookApp.mount("#lookbook");
  document.getElementById("lookbook").style.position = "relative";
}
// End Vue Part
