<script setup>
import { ref, onMounted } from "vue";
import Swiper from "swiper";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

import * as showdown from "showdown";

// Components
import LoaderItem from "./LoaderItem.vue";

const data = ref(null);
// const loading = ref(true);
// const error = ref(null);

const imageSkeleton = ref(true);

const link = ref(null);

// const fetchDataFromContentFull = async () => {
//   const data = await fetch("https://contentful-security.herokuapp.com");
//   const res = await data.json();

//   loading.value = false;
//   data.value = res;
// };

// const converter = new showdown.Converter();

const loadImage = () => {
  imageSkeleton.value = false;
  console.log("Image Loaded");
};

const loadSlider = () => {
  setTimeout(() => {
    const swiperEl = document.querySelector(".product-images-slideshow");
    console.log("Swiper element found:", swiperEl);
    if (swiperEl) {
      const swiper = new Swiper(swiperEl, {
        modules: [Navigation, Autoplay],
        slidesPerView: 1,
        spaceBetween: 0,
        loop: true,
        grabCursor: true,
        mousewheel: {
          forceToAxis: true,
        },
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },
        autoplay: {
          delay: 4000,
          disableOnInteraction: false,
        },
      });
      console.log("Swiper initialized:", swiper);
    } else {
      console.error("Swiper element not found!");
    }
  }, 100);
};

onMounted(() => {
  // fetchDataFromContentFull();

  loadSlider();

  link.value = location.href.match(/.+\/(.+)$/)[1];
});
</script>

<template>
  <Suspense>
    <template #default>
      <div v-for="{ fields, sys } in data" :key="sys.id">
        <div v-if="fields.link === link">
          <img
            :src="`${fields.mainPhoto?.fields?.file?.url}?fm=jpg&fl=progressive`"
            class="border-[15px] border-solid border-yellow-50 w-full"
            @load="loadImage"
          />
          <div
            class="content-history"
            v-html="converter.makeHtml(fields.history)"
          />
        </div>
      </div>
    </template>
    <template #fallback>
      <LoaderItem class="w-[200px] mx-auto" />
    </template>
  </Suspense>
</template>

<style lang="scss">
.content-history {
  & > p {
    margin: 2rem 0;
  }
  blockquote {
    padding: 1rem 3rem;
    background: #fffef7;
    border-radius: 5px;
    border-left: 4px solid #ccc;
    border-bottom-left-radius: 0;
    border-top-left-radius: 0;
    margin-top: 2rem;
  }
}

/* Center images in swiper slides */
.swiper-slide {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;

  img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    display: block;
    margin: 0 auto;
  }
}

/* Custom Swiper navigation arrows */
.swiper-button-prev,
.swiper-button-next {
  width: 30px !important;
  height: 60px !important;
  background: rgba(0, 0, 0, 0.5) !important;
  color: rgba(255, 255, 255, 0.85) !important;
  transition: all 0.3s ease !important;
  padding: 10px !important;
  opacity: 0 !important;

  &:after {
    font-size: 18px !important;
    font-weight: normal !important;
  }

  &:hover {
    background: rgba(0, 0, 0, 0.8) !important;
    color: rgba(255, 255, 255, 1) !important;
  }
}

.swiper-button-prev {
  left: 10px !important;
}

.swiper-button-next {
  right: 10px !important;
}

/* Show arrows on slider hover */
.product-images-slideshow:hover .swiper-button-prev,
.product-images-slideshow:hover .swiper-button-next {
  opacity: 1 !important;
}

/* Hide arrows when disabled */
.swiper-button-disabled {
  opacity: 0 !important;
  cursor: default !important;
}
</style>
