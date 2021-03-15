import axios from "axios";

export default function(aa,data,method) {
  const request = axios.create({
    baseURL: "/api",
    timeout: 1000,
    data,
    method
  });

  // 添加响应拦截器
  request.interceptors.response.use(
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
  request.interceptors.request.use(
    function(config) {
      // 在发送请求之前做些什么
      let token = sessionStorage.getItem("token");
      if (token) {
        config.headers["token"] = token;
      }
      return config;
    },
    function(error) {
      // 对请求错误做些什么
      return Promise.reject(error);
    }
  );
  return request(aa);
}
