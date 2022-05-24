<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const count = ref(0);
const breweries = ref([{ name: 'lesButtes', image: 'https://www.carnets-de-traverse.com/blog/wp-content/uploads/2014/10/Photo24_22A.jpg', history: 'Lorem Ipsum' }, { name: 'Bar' }])
const infos = ref({ name: 'lesButtes', image: 'https://www.carnets-de-traverse.com/blog/wp-content/uploads/2014/10/Photo24_22A.jpg', history: 'Lorem Ipsum' })


const fetchData = async () => {
  const { data } = await axios.get('https://api.openbrewerydb.org/breweries')
  return data;
}

onMounted( async () => {
  const breweries = await fetchData();
  console.log(breweries);
  
  breweries.value = breweries
});
</script>

<template>
  <img :src="infos.image" />
  <p>{{infos.history}}</p>
  <button @click="count++">You clicked me {{ count }} times.</button>
  <ul>
    <li v-for="brewery in breweries">{{brewery.name}}</li>
  </ul> 
</template>