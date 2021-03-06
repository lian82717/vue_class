// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import axios from 'axios';
import VueAxios from 'vue-axios';
import Loading from 'vue-loading-overlay';
import 'bootstrap';
import 'vue-loading-overlay/dist/vue-loading.css';

import App from './App';
import router from './router';
import './bus'
import CurrencyFilter from './filters/currency';
import DateFilter from './filters/date';

Vue.config.productionTip = false;
Vue.use(VueAxios,axios);
axios.defaults.withCredentials = true;  
Vue.component('Loading',Loading);
Vue.filter('currency',CurrencyFilter);
Vue.filter('date',DateFilter);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})

router.beforeEach((to, from, next) =>{
  if(to.meta.requiresAuth){
    const api = `${process.env.APIPATH}/api/user/check`;
    axios.post(api).then((res)=>{
        if(res.data.success){
          next();
        }else{
          next({
            path: '/login'
          })
        }
    })
  } else {
    next();
  }
})