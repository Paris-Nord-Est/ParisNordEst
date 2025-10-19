import "./style.css";

import { createApp } from "vue";
import App from "./App.vue";

import LookBook from "./components/LookBook.vue";
import Homepage from "./components/Homepage.vue";

// Homepage Vue App
if (document.getElementById("homepage-app")) {
  const homepageApp = createApp(Homepage);
  homepageApp.mount("#homepage-app");
}

// Product Data Vue part (for product pages)
if (document.getElementById("vue")) {
  const app = createApp(App);
  app.mount("#vue");
}

// Page Lookbook
if (document.getElementById("lookbook")) {
  const lookbook = createApp(LookBook);
  lookbook.mount("#lookbook");
  document.getElementById("lookbook").style.position = "relative";
}
// End Vue Part
