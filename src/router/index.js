import Vue from "vue";
import VueRouter from "vue-router";
import CreateMinyan from "../views/CreateMinyan.vue";
import Minyan from "../views/Minyan.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Landing",
    component: CreateMinyan,
  },
  {
    path: "/Minyan/:minyanid",
    name: "Minyan",
    component: Minyan,
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
