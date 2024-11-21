import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Router Modules */
// import chartsRouter from './modules/charts'
// import tableRouter from './modules/table'

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: 'Dashboard', icon: 'dashboard', affix: true }
      }
    ]
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    path: '/data',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/data/index'),
        name: 'Data',
        meta: { title: 'Data', icon: 'chart' }
      }
    ]
  },
  {
    path: '/catalog',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/catalog/index'),
        name: 'Catalog',
        meta: { title: 'Catalog', icon: 'star' }
      }
    ]
  },
  {
    path: '/rule',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/rule/index'),
        name: 'Rule',
        meta: { title: 'Rule', icon: 'list' }
      }
    ]
  },
  {
    path: '/task',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/task/index'),
        name: 'Task',
        meta: { title: 'Task', icon: 'tab' }
      }
    ]
  },
  {
    path: '/area',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/area/index'),
        name: 'Area',
        meta: { title: 'Area', icon: 'theme' }
      }
    ]
  },
  /** when your routing map is too long, you can split it into small modules **/
  // chartsRouter,
  // tableRouter,

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
