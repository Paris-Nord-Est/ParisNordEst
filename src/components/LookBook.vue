<script setup>
import { ref, onMounted } from "vue";
import * as FlexMasonry from "flexmasonry";

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

  // FlexMasonry.init(".grid");
});
</script>

<template>
  <Suspense>
    <template #default>
      <div v-if="photos" class="grid">
        <div v-for="photo in photos" :key="photo">
          <div class="inner">
            <img :src="photo" />
          </div>
        </div>
      </div>
    </template>
    <template #fallback>
      <loader-item />
    </template>
  </Suspense>
</template>
