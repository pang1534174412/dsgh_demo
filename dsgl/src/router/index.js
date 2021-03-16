import Vue from "vue";
import VueRouter from "vue-router";
import Login from "../views/Login.vue";
import Home from "../views/Home.vue"
Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Login",
    component: Login,
  },
  {
    path: "/about",
    name: "About",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue"),
    children: [
      // {
      //   path: "/",
      //   redirect: "/about/users",
      // },
      {
<<<<<<< HEAD
        path:"/",
        component:() => import('./../views/Home.vue')
      },
      {
=======
>>>>>>> a6077bc3779a65e6649eeea5bfcf58ba98500d1d
        path: "users",
        component: () => import("./../components/user/users.vue"),
      },
      
      {
        path: "home",
        component: () => import("./../views/Hoime.vue"),
      },
      {
        path: "roles",
        component: () => import("./../components/quanxian/roles.vue"),
      },
      {
        path: "rights",
        component: () => import("./../components/quanxian/rights.vue"),
      },
      {
        path: "goods",
        component: () => import("./../components/commodity/goods.vue"),
      },
      {
        path: "params",
        component: () => import("./../components/commodity/params.vue"),
        children: [
          {
            path: "dynamic" /**动态参数 */,
            component: () =>
              import("./../components/commodity/sorting/dynamic.vue"),
          },
          {
            path: "static" /**静态参数 */,
            component: () =>
              import("./../components/commodity/sorting/static.vue"),
          },
        ],
      },
      {
        path: "categories",
        component: () => import("./../components/commodity/categories.vue"),
      },
      {
        path: "orders" /**订单管理 */,
        component: () => import("./../components/order"),
      },
      {
        path: "params",
        component: () => import("./../components/commodity/params.vue"),
      },
      {
        path: "reports",
        component: () => import("./../components/reports/reports.vue"),
      },
    ],
  },
];

const router = new VueRouter({
  routes,
  Home
});

export default router;
