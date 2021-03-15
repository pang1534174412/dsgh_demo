import Vue from "vue";
import VueRouter from "vue-router";
import Login from "../views/Login.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Login",
    component: Login,
  },
  {
<<<<<<< HEAD
    path: '/about',
    name: 'About',
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
 ,  children:[
   {
     path:"users",
     component:()=>import("./../components/user/users.vue")
   },
   {
    path:"roles",
    component:()=>import("./../components/quanxian/roles.vue")
   },
   {
    path:"rights",
    component:()=>import("./../components/quanxian/rights.vue")
   },
   {
    path:"goods",
    component:()=>import("./../components/commodity/goods.vue")
   },
   {
    path:"params",
    component:()=>import("./../components/commodity/params.vue"),
    children:[
      {
        path:"dynamic",/**动态参数 */
        component:()=>import("./../components/commodity/sorting/dynamic.vue"),
      },
      {
        path:"static",/**静态参数 */
        component:()=>import("./../components/commodity/sorting/static.vue"),
      },
     
    ]
   },
   {
    path:"categories",
    component:()=>import("./../components/commodity/categories.vue")
   },
   {
    path:"orders",/**订单管理 */
    component:()=>import("./../components/order")
   },
 ]
    
  }
]
=======
    path: "/about",
    name: "About",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue"),
    children: [
      {
        path: "/",
        redirect: "/about/users",
      },
      {
        path: "home",
        component: () => import("./../views/Hoime.vue"),
      },
      {
        path: "users",
        component: () => import("./../components/user/users.vue"),
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
        path: "add",
        component: () => import("./../components/commodity/Add.vue"),
      },

      {
        path: "params",
        component: () => import("./../components/commodity/params.vue"),
      },
      {
        path: "categories",
        component: () => import("./../components/commodity/categories.vue"),
      },
      {
        path: "reports",
        component: () => import("./../components/reports/reports.vue"),
      },
    ],
  },
  
];
>>>>>>> fa773fd6554c7c58b5af56b18717cdff74b46fb9

const router = new VueRouter({
  routes,
});

export default router;
