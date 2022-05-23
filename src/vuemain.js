import { createApp } from "vue";

console.log("test");

createApp({
    compilerOptions: {
        delimiters: ["%%", "%%"],
    },
    data() {
        return {
            count: 0,
            message: "test",
        };
    },
}).mount("#vue");
