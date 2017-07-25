import Vue from 'vue';
import Router from 'vue-router';
import Index from '@/pages/Index';
import Browse from '@/pages/Browse';
import Acknowledgments from '@/pages/Acknowledgments';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      component: Index,
    },
    {
      path: '/browse/:fileId',
      component: Browse,
    },
    {
      path: '/acknowledgments',
      component: Acknowledgments,
    },
  ],
});
