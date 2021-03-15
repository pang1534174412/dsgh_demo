import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
Vue.use(ElementUI);
import axios from "axios";
import VueAxios from "vue-axios";
Vue.use(VueAxios, axios);
Vue.config.productionTip = false;
<<<<<<< HEAD
// import  '../public/js/city_data2017_element.js'//城市选择


=======
//富文本编辑器
import quillEditor from "vue-quill-editor";
// 将富文本编辑器，注册为全局可用的组件
Vue.use(quillEditor);
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
>>>>>>> fa773fd6554c7c58b5af56b18717cdff74b46fb9
// 添加响应拦截器
axios.interceptors.response.use(
  function(response) {
    // 对响应数据做点什么
    if (response.data.status === 400) {
      router.replace("/");
    }
    return response.data;
  },
  function(error) {
    // 对响应错误做点什么
    return Promise.reject(error);
  }
);

// 添加请求拦截器
axios.interceptors.request.use(
  function(config) {
    // 在发送请求之前做些什么
    if (config.url === "/login") {
      return config;
    } else {
      let token = sessionStorage.getItem("token");
      config.headers["Authorization"] = token;
    }
    return config;
  },
  function(error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);
new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
