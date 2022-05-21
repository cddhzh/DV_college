import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Login from "../views/Login.vue";
import uploadXlsx from "@/views/uploadXlsx";
import firstPage from "@/views/FirstPage";
import secondPage from "@/views/SecondPage";
import thirdPage from "@/views/ThirdPage"
import fourthPage from "@/views/FourthPage";

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'login',
        component: Login
    },
    {
        path: '/about',
        name: 'about',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
    },
    {
        path: '/home',
        component: HomeView
    },
    {
        path: '/upload',
        component: uploadXlsx
    },
    {
        path: '/firstPage',
        component: firstPage
    },
    {
        path: '/secondPage',
        component: secondPage
    },
    {
        path: '/thirdPage',
        component: thirdPage
    },
    {
        path: '/fourthPage',
        component: fourthPage
    }
]

const router = new VueRouter({
    // mode: 'history',
    routes
})

export default router
