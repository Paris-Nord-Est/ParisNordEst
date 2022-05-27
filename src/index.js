import "./style.css";

import { createApp } from "vue";
import App from "./App.vue";

// Vue part
const app = createApp(App);
app.mount("#vue");
// End Vue Part

if ($(".product-images-slideshow").length && !inPreview) {
    $(".product-images-slideshow").addClass("flexslider");
    $(".product-images-slideshow").flexslider({
        animation: "slide",
        animationLoop: false,
        controlsContainer: "canvas",
        directionNav: false,
    });
}
