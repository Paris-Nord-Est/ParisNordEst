<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

import * as contentful from "contentful";

// Components
import Loader from './Loader.vue'

const client = contentful.createClient({
    space: "1rmfbgapbw5t",
    accessToken: "39TK_xI5H56kai0cCc4ueibhiY23LCcFlHTYiLg11qM",
});


const data = ref(null);
const loading = ref(true);
const error = ref(null);


const fetchDataFromContentFull = async () => {
  const { items } = await client.getEntries()
  console.log(items)

  loading.value = false;
  data.value =  items;
}

onMounted(() => {
  fetchDataFromContentFull()
});
</script>

<template>
  <div v-if="loading">
    <Loader class="w-[200px] mx-auto"/>
  </div>
  <p v-else-if="error">
    {{error}}
  </p>
  <div v-else-if="data">
    <div v-for="({fields, metadata}, index) in data">
      <img :src="fields.mainPhoto?.fields?.file?.url" />
      <p>{{fields.history}}</p>
    </div>
  </div>
</template>