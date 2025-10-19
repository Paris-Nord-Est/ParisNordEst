<script setup>
import { onMounted } from "vue";
import Splide from "@splidejs/splide";
import "@splidejs/splide/css";

// Initialize Splide for homepage slideshow
const initHomeSlideshow = () => {
  const homeSlideshow = document.querySelector(".home-slideshow");

  if (homeSlideshow) {
    // Get theme options from global themeOptions object (set in layout.html)
    const options = window.themeOptions || {};

    const splideConfig = {
      type: options.homepageSlideshowTransition === "fade" ? "fade" : "slide",
      rewind: true,
      pagination: false,
      arrows: true,
      keyboard: true,
      drag: true,
      autoplay: options.homepageSlideshowAutoplay || false,
      interval: options.homepageSlideshowSpeed || 3000,
      pauseOnHover: true,
      pauseOnFocus: true,
    };

    new Splide(homeSlideshow, splideConfig).mount();

    console.log("Home slideshow initialized with config:", splideConfig);

    // Handle slideshow link if configured
    if (options.homepageSlideshowLink) {
      const slides = homeSlideshow.querySelectorAll(".splide__slide");
      slides.forEach((slide) => {
        slide.style.cursor = "pointer";
        slide.addEventListener("click", () => {
          window.location.href = options.homepageSlideshowLink;
        });
      });
    }
  }
};

onMounted(() => {
  initHomeSlideshow();
});
</script>

<template>
  <div></div>
</template>

<style lang="scss">
/* Custom Splide styling for home slideshow */
.home-slideshow {
  .splide__arrow {
    width: 50px;
    height: 50px;
    background: rgba(0, 0, 0, 0.3);
    opacity: 0;
    transition: all 0.3s ease;

    &:hover {
      background: rgba(0, 0, 0, 0.6);
    }

    svg {
      fill: rgba(255, 255, 255, 0.9);
    }
  }

  &:hover .splide__arrow {
    opacity: 1;
  }

  .splide__arrow--prev {
    left: 20px;
  }

  .splide__arrow--next {
    right: 20px;
  }

  .splide__slide {
    img {
      width: 100%;
      height: auto;
      display: block;
    }
  }
}
</style>
