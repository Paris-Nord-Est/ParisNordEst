import "./style.css";

import { createApp } from "vue";
import App from "./App.vue";

import LookBook from "./components/LookBook.vue";

// Vue part
const app = createApp(App);
app.mount("#vue");

// Page Lookbook
const lookbook = createApp(LookBook);
lookbook.mount("#lookbook");
document.getElementById("lookbook").style.position = "relative";
// End Vue Part
