import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import LoginPage from "@/components/LoginPage.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Login",
    component: LoginPage,
  },
  {
    path: "/home",
    name: "home",
    component: () => import(/* webpackChunkName: "about" */ "../views/HomeView.vue"),
  },
  {
    path: "/sign-up",
    name: "signup",
    component: () => import(/* webpackChunkName: "about" */ "../components/SignUp.vue"),
  },
  {
    path: "/about",
    name: "about",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ "../views/AboutView.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
