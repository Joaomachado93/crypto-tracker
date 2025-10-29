import { createRouter, createWebHistory } from 'vue-router'

export default createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: () => import('@/views/ListView.vue') },
    { path: '/coin/:symbol', name: 'detail', component: () => import('@/views/DetailView.vue') },
  ],
})
