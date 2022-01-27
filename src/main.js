import Vue from 'vue'
import App from './App.vue'
import router from './router';
import store from './store';
import api from '@/request/api/index.js'
import commonQuery from '@/mixin/common-query.js'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(ElementUI)

Vue.mixin(commonQuery)

import '@/styles/index.scss' // global css
import { getAllRoutes, objectToUrl, urlToObject } from '@/utils/route-handle.js';

Vue.config.productionTip = false
Vue.prototype.$api = api

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

// 页面跳转相关代码 代替location.href 尽量做到不刷新跳转 如果c端spa url等同于 router.push 如果是其他url 等同于 location.href
const routerMap = getAllRoutes();

Vue.prototype.$wm_page = {
  // 拦截器 如果有拦截器的情况下 push方法的以及vueRouter的beforeEnter会被拦截 interceptor返回为false则拦截成功
  interceptor: null,
  replace(url) {
    if (this.interceptor) {
      this.push(url);
      return;
    }
    window.location.replace(url);
  },
  push(url, force = false) {
    return new Promise((resolve, reject) => {
      if (force) {
        if (typeof url == 'object') {
          url = objectToUrl(url);
        }
        location.href = url;
        resolve();
        return;
      }
      if (typeof url == 'object') {
        // 除了云会场之外 其他路径如果前后路径相同 或者 router.js没有定义的路径 都走刷新跳转
        if ((url.path != location.pathname || url.path == '/mobile/home') && routerMap[url.path]) {
          router.push(url);
        } else {
          location.href = objectToUrl(url);
        }
        resolve();
        return;
      }
      const { host, hostname, pathname, query } = urlToObject(url);
      if (hostname != location.hostname) {
        location.href = url;
        resolve();
        return;
      }
      // 基于互动间的特殊需求 中间加了个拦截器 特殊页面跳转会在固定容器内跳转 而不是整个页面跳转
      if (this.interceptor) {
        const res = this.interceptor({
          path: pathname,
          query
        });
        if (!res) {
          reject();
          return;
        }
      }
      // 除了云会场之外 其他路径如果前后路径相同 或者 router.js没有定义的路径 都走刷新跳转
      if ((pathname != location.pathname || pathname == '/mobile/home') && routerMap[pathname]) {
        router.push({
              path: pathname,
              query
            })
            .then(() => {
              resolve();
            })
            .catch((err) => {
              reject(err);
            });
      } else {
        location.href = url;
        resolve();
      }
    }).catch((err) => {
      console.warn(`WM Page: push err ,`, url);
    });
  },
  reload() {
    location.reload();
  },
  setInterceptor(func) {
    this.interceptor = func || null;
  }
};

window.$wm_page = Vue.prototype.$wm_page;


