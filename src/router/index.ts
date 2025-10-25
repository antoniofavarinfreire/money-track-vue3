/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import { createRouter, createWebHistory } from 'vue-router'
const routes = [
  {
    path: "/app",
    component: () => import('@/pages/Layout/DashboardLayout.vue'),
    redirect: "/app/dashboard",
    children: [
      {
        path: "dashboard",
        name: "Dashboard",
        component: () => import ('@/pages/Dashboard.vue'),
      },
      // {
      //   path: "user",
      //   name: "User Profile",
      //   component: UserProfile,
      // },
      {
        path: "table",
        name: "Movimentação Financeira",
        component: () => import ('@/pages/TableList.vue'),
      },
      // {
      //   path: "typography",
      //   name: "Typography",
      //   component: Typography,
      // },
    ],
  },
] ;

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// Workaround for https://github.com/vitejs/vite/issues/11804
router.onError((err, to) => {
  if (err?.message?.includes?.('Failed to fetch dynamically imported module')) {
    if (localStorage.getItem('vuetify:dynamic-reload')) {
      console.error('Dynamic import error, reloading page did not fix it', err)
    } else {
      console.log('Reloading page to fix dynamic import error')
      localStorage.setItem('vuetify:dynamic-reload', 'true')
      location.assign(to.fullPath)
    }
  } else {
    console.error(err)
  }
})

router.isReady().then(() => {
  localStorage.removeItem('vuetify:dynamic-reload')
})

export default router
