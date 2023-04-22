import App from './App'
import Vue from 'vue'
import store from "./store/store.js"

// 导入网络请求的包
import {$http} from "@escook/request-miniprogram"
uni.$http = $http

// 请求的根路径
$http.baseUrl = "https://www.uinav.com"

// 请求拦截器(路由守卫?)
$http.beforeRequest = function(options){
	uni.showLoading({
		title:"数据加载中"
	})
}

$http.afterRequest = function(){
	uni.hideLoading();
}

// 封装弹窗展示消息提示的方法
uni.$showMsg = function(title = '数据加载失败!',duration=1500){
	uni.showToast({
		title,
		duration,
		icon:'none'
	})
}

 
// #ifndef VUE3
Vue.config.productionTip = false
App.mpType = 'app'

try {
  function isPromise(obj) {
    return (
      !!obj &&
      (typeof obj === "object" || typeof obj === "function") &&
      typeof obj.then === "function"
    );
  }

  // 统一 vue2 API Promise 化返回格式与 vue3 保持一致
  uni.addInterceptor({
    returnValue(res) {
      if (!isPromise(res)) {
        return res;
      }
      return new Promise((resolve, reject) => {
        res.then((res) => {
          if (res[0]) {
            reject(res[0]);
          } else {
            resolve(res[1]);
          }
        });
      });
    },
  });
} catch (error) { }

const app = new Vue({
  ...App,
  // 将store挂载到vm身上
  store,
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif