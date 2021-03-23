import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import "@/styles/global.scss";
import "@/config/faIcons";

Vue.config.productionTip = false;

new Vue({
  render: (h) => h(App),
}).$mount("#app");
