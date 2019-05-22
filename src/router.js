import Vue from "vue";
import Router from "vue-router";
import index from "@/views";

Vue.use(Router);

export default new Router({
    base: process.env.BASE_URL,
    routes: [
      {
        path: "/",
        name: "index",
        component: index
      }
    ]
  });