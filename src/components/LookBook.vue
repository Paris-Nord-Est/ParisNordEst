<script setup>
import { ref, onMounted } from "vue";

// Components
import LoaderItem from "./LoaderItem.vue";

const photos = ref(null);
const loading = ref(true);
const error = ref(null);

const fetchDataFromCloudinary = async () => {
  // const headers = new Headers();
  // headers.append("Directory", "photo-shoots");
  // headers.append("Accept", "application/json");

  // const data = await fetch("https://contentful-security.herokuapp.com", {
  //   method: "GET",
  //   headers,
  //   moder: "cors",
  // });
  // const res = await data.json();
  // console.log(res);

  // const photosFromCloudinary = res
  //   .filter(({ fields }) => fields.cloudinaryPhotos)
  //   .map(({ fields: { cloudinaryPhotos } }) => cloudinaryPhotos);

  const data = await fetch("https://contentful-security.herokuapp.com");
  const res = await data.json();

  const cloudinaryPhotos = res.cloudinaryImages?.resources?.map(
    ({ secure_url }) => secure_url
  );

  loading.value = false;
  photos.value = cloudinaryPhotos;
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
          <img :src="photo" />
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
  }
  @media (min-width: 768px) {
    column-count: 2;
  }
  @media (min-width: 1200px) {
    column-count: 3;
  }
}
</style>
