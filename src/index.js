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

// Mobile Menu Toggle
document.addEventListener("DOMContentLoaded", function () {
  const mobileMenuToggle = document.querySelector(".mobile-menu-toggle");
  const mobileNav = document.querySelector(".mobile-nav");

  if (mobileMenuToggle && mobileNav) {
    mobileMenuToggle.addEventListener("click", function () {
      mobileNav.classList.toggle("active");

      // Animate hamburger icon
      const spans = mobileMenuToggle.querySelectorAll("span");
      if (mobileNav.classList.contains("active")) {
        spans[0].style.transform = "rotate(45deg) translate(5px, 5px)";
        spans[1].style.opacity = "0";
        spans[2].style.transform = "rotate(-45deg) translate(7px, -6px)";
      } else {
        spans[0].style.transform = "none";
        spans[1].style.opacity = "1";
        spans[2].style.transform = "none";
      }
    });
  }
});
