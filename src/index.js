import "./style.css";

import { createApp } from "vue";
import App from "./App.vue";

// Vue part
const app = createApp(App);
app.mount("#vue");

// End Vue Part

const nameToString = string => string.toLowercase().replace(" ", "_");

const productsEnhance = {
    belleville: "https://www.carnets-de-traverse.com/blog/wp-content/uploads/2014/10/Photo24_22A.jpg",
};

(() => {
    Product.findAll({}, function (products) {
        console.log(productsEnhance[nameToString(products)]);
        console.log("I found " + products.length + " products!");
    });
})();
