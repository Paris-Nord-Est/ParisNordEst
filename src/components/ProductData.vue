<script setup>
import { ref, onMounted } from "vue";

import * as showdown from "showdown";

import * as contentful from "contentful";

// Components
import LoaderItem from "./LoaderItem.vue";

const client = contentful.createClient({
  space: "1rmfbgapbw5t",
  accessToken: "39TK_xI5H56kai0cCc4ueibhiY23LCcFlHTYiLg11qM",
});

const data = ref(null);
const loading = ref(true);
// const error = ref(null);

const imageSkeleton = ref(true);

const link = ref(null);

const fetchDataFromContentFull = async () => {
  const { items } = await client.getEntries();
  console.log(items);

  loading.value = false;
  data.value = items;
};

const converter = new showdown.Converter();

const loadImage = () => {
  imageSkeleton.value = false;
  console.log("Image Loaded");
};

const loadSlider = () => {
  $(".product-images-slideshow").addClass("flexslider");
  $(".product-images-slideshow").flexslider({
    animation: "slide",
    animationLoop: false,
    controlsContainer: "canvas",
    directionNav: false,
  });
};

onMounted(() => {
  fetchDataFromContentFull();

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
</style>
