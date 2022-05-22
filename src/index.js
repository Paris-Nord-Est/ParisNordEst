import "./style.css";

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
