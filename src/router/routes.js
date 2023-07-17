import Vue from 'vue';
import Router from 'vue-router';
import Login from '../views/login.vue'
Vue.use(Router);
const routes= [
    {
      path: '/',
      name: 'Login',
      component: Login
    },
  ]
export default routes;
