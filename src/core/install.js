import Vue from 'vue';
/**
 * @name 注册插件
 */
import ElementUI from 'element-ui';
Vue.use(ElementUI);
import axios from '@/api/axios';
Vue.prototype.$axios = axios;
/**
 * @name 注册样式
 */
import '../assets/css/element-variables.scss';
import "../../public/config.js"