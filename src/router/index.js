import {createRouter, createWebHashHistory} from "vue-router";
import Home from "../views/Home.vue";

const routes = [
    {
        path: '/',
        redirect: '/dashboard'
    }, {
        path: "/",
        name: "Home",
        component: Home,
        children: [
            {
                path: "/dashboard",
                name: "dashboard",
                meta: {
                    title: '系统首页'
                },
                component: () => import ( /* webpackChunkName: "dashboard" */ "../views/Dashboard.vue")
            }, {
                path: "/essaydesc",
                name: "essaydesc",
                meta: {
                    title: '博客详情页'
                },
                component: () => import ( /* webpackChunkName: "table" */ "../views/blog/EssayDesc.vue")
            },{
                path: "/essayuserdesc",
                name: "essayuserdesc",
                meta: {
                    title: '博主详情页'
                },
                component: () => import ( /* webpackChunkName: "table" */ "../views/blog/EssayUserDesc.vue")
            },{
                path: "/searchessay",
                name: "searchessay",
                meta: {
                    title: '博客搜索页'
                },
                component: () => import ( /* webpackChunkName: "table" */ "../views/blog/SearchEssay.vue")
            },{
                path: "/users",
                name: "users",
                meta: {
                    title: '用户管理'
                },
                component: () => import ( /* webpackChunkName: "table" */ "../views/user/Users.vue")
            }, {
                path: "/operate",
                name: "operate",
                meta: {
                    title: '操作管理'
                },
                component: () => import ( /* webpackChunkName: "table" */ "../views/user/Operate.vue")
            }, {
                path: "/essay",
                name: "essay",
                meta: {
                    title: '博客管理'
                },
                component: () => import ( /* webpackChunkName: "table" */ "../views/blog/Essay.vue")
            }, {
                path: "/channel",
                name: "channel",
                meta: {
                    title: '轮播管理'
                },
                component: () => import ( /* webpackChunkName: "table" */ "../views/home/Channel.vue")
            }, {
                path: "/search",
                name: "search",
                meta: {
                    title: '搜索管理'
                },
                component: () => import ( /* webpackChunkName: "table" */ "../views/home/Search.vue")
            }, {
                path: "/history",
                name: "history",
                meta: {
                    title: '历史管理'
                },
                component: () => import ( /* webpackChunkName: "table" */ "../views/home/History.vue")
            },{
                path: "/recommend",
                name: "recommend",
                meta: {
                    title: '热门博客管理'
                },
                component: () => import ( /* webpackChunkName: "table" */ "../views/home/Recommend.vue")
            },{
                path: "/userRecommend",
                name: "userRecommend",
                meta: {
                    title: '热门博主管理'
                },
                component: () => import ( /* webpackChunkName: "table" */ "../views/home/UserRecommend.vue")
            }, {
                path: "/charts",
                name: "basecharts",
                meta: {
                    title: '图表'
                },
                component: () => import ( /* webpackChunkName: "charts" */ "../views/BaseCharts.vue")
            }, {
                path: '/user',
                name: 'user',
                meta: {
                    title: '个人中心'
                },
                component: () => import (/* webpackChunkName: "user" */ '../views/User.vue')
            }, 
        ]
    }, {
            path: '/editor',
            name: 'editor',
            meta: {
                title: '富文本编辑器'
            },
            component: () => import (/* webpackChunkName: "editor" */ '../views/Editor.vue')
    },{
        path: "/login",
        name: "Login",
        meta: {
            title: '登录'
        },
        component: () => import ( /* webpackChunkName: "login" */ "../views/Login.vue")
    },{
        path: "/register",
        name: "Register",
        meta: {
            title: '注册'
        },
        component: () => import ( /* webpackChunkName: "login" */ "../views/Register.vue")
    }
];

const router = createRouter({
    history: createWebHashHistory(),
    routes
});

router.beforeEach((to, from, next) => {
    document.title = `${to.meta.title} | 博客园`;
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role_id');
    if (token == null && role==null && to.path == '/user') {
        next('/login');
    } else {
        next();
    }
});

export default router;