import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import DashBoardView from '../views/DashBoardView.vue'
import ClientsView from '../views/ClientsView.vue'
import AIView from '../views/AIView.vue'
import InboxView from '../views/InboxView.vue'

import { getAuth, onAuthStateChanged } from "firebase/auth";

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: {
      checkAuth: true
    }
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: DashBoardView,
    meta: {
      requiresAuth: true
    }
  },  {
    path: '/clients',
    name: 'clientsView',
    component: ClientsView,
    meta: {
      requiresAuth: true
    }
  },{
    path: '/aiengine',
    name: 'AIView',
    component: AIView,
    meta: {
      requiresAuth: true
    }
  },{
    path: '/inbox',
    name: 'InboxView',
    component: InboxView,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/about',
    name: 'about',
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  }, {
    path: '/logout',
    name: 'LogoutView',
    component: () => import(/* webpackChunkName: "logout" */ '../views/LogoutView.vue')
    //component: LogoutView,
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// Meta Handling


const auth = getAuth();

router.beforeEach((to, from, next) => {

  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User
      //alert('user state changed' + user)
      console.log('user signed in');
      // check if this is first login for broker
      // if it is then require additional info like institution and premium      

      next()
    } else {
      if (to.matched.some(record => record.meta.requiresAuth)) {

        console.log('user:' + auth.currentUser)
        next({ path: '/' })
        /* next({
           //name: '/',
           path: '/dashboar',
         })*/
      }
      else {
        next()
      }
    }
  });

})

export default router
