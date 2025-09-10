import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/LoginPage.vue'
import Main from '../views/MainPage.vue'
import Tracking from '../views/TrackingPage.vue'
import Report from '../views/ReportPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // {
    //   path: '/',
    //   name: 'home',
    //   component: HomeView,
    // },
    { path: '/', name: 'Login', component: Login },
    { path: '/main', name: 'Main', component: Main },
    { path: '/tracking', name: 'Tracking', component: Tracking },
    { path: '/report', name: 'Report', component: Report },
  ],
})

export default router
