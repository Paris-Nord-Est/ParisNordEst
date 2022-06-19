<script setup>
import { ref, onMounted, toRaw } from "vue";
import * as FlexMasonry from "flexmasonry";

// Components
import LoaderItem from "./LoaderItem.vue";

const photos = ref(null);
const loading = ref(true);
const error = ref(null);

const fetchDataFromContentFull = async () => {
  const data = await fetch("https://contentful-security.herokuapp.com");
  const res = await data.json();

  console.log(res.value);
  // const photosFromCloudinary = res

  loading.value = false;
  photos.value = res;
  // photos.value = photosFromCloudinary;
};

onMounted(() => {
  try {
    fetchDataFromContentFull();
  } catch (e) {
    console.log(e);
    error.value = e;
  }

  console.log(photos);
  // FlexMasonry.init(".grid");
});
</script>

<template>
  <Suspense>
    <template #default>
      <div v-if="photos" class="grid">
        <div
          v-for="{ url } in photos
            .filter(({ fields }) => fields.cloudinaryPhotos)
            .map(({ fields: { cloudinaryPhotos } }) => cloudinaryPhotos)"
          :key="url"
        >
          <div class="inner">
            <img :src="url" />
          </div>
        </div>
      </div>
    </template>
    <template #fallback>
      <loader-item />
    </template>
  </Suspense>
</template>
