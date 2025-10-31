import { createRouter, createWebHistory } from 'vue-router'
import ListView from '../views/ListView.vue'
import DetailView from '../views/DetailView.vue'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: ListView },
    { path: '/:symbol', name: 'detail', component: DetailView, props: true },
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})
