import Vue from "vue";
import VueRouter from "vue-router";
import HomeView from "../views/HomeView.vue";
import Main from "../views/Main.vue";
import ProductList from "../views/products/List.vue";
import ProductDetail from "../views/products/Detail.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    component: Main,
  },
  {
    path: "/products",
    component: ProductList,
  },
  {
    path: "/products/:id",
    component: ProductDetail,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
