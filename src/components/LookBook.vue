<script setup>
import { ref, onMounted } from "vue";

import "lazysizes";

// Components
import LoaderItem from "./LoaderItem.vue";

const photos = ref(null);
const loading = ref(true);
const error = ref(null);

const sizes = [300, 700];

const getDataSrcSet = (url) => {
  const responsiveUrl = sizes.map((s) =>
    url.replace(/\/upload\//, `/upload/c_scale,w_${s},q_auto:best/`)
  );

  return `${responsiveUrl[0]} ${sizes[0]}w, ${responsiveUrl[1]} ${sizes[1]}w, ${url} 1200w`;
};

const fetchDataFromCloudinary = async () => {
  const data = await fetch("https://contentful-security.herokuapp.com");
  const res = await data.json();

  const cloudinaryPhotos = res.cloudinaryImages?.resources?.map(
    ({ secure_url }) => secure_url
  );

  loading.value = false;
  photos.value = cloudinaryPhotos.sort(() => 0.5 - Math.random());
};

onMounted(async () => {
  try {
    await fetchDataFromCloudinary();
  } catch (e) {
    console.log(e);
    error.value = e;
  }
});
</script>

<template>
  <Suspense>
    <template #default>
      <div v-if="photos" class="ml">
        <div v-for="photo in photos" :key="photo" class="p-1 photo">
          <img
            loading="lazy"
            data-sizes="auto"
            :data-src="photo"
            :data-srcset="getDataSrcSet(photo)"
            class="lazyload"
          />
        </div>
      </div>
    </template>
    <template #fallback>
      <loader-item />
    </template>
  </Suspense>
</template>
<style lang="scss">
/* MASONRY CSS */
.ml {
  box-sizing: border-box;
  column-count: 1;
  column-gap: 0;
  position: relative;
  * {
    box-sizing: border-box;
  }
  div:hover {
    img {
      transform: rotateY(180deg);
    }
  }
  img {
    transition: transform 0.8s;
    transform-style: preserve-3d;
    transition-delay: 250ms;
  }
  @media (min-width: 768px) {
    column-count: 2;
  }
  @media (min-width: 1200px) {
    column-count: 3;
  }
}
</style>
