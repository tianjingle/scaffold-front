import Login from './views/Login.vue'
import NotFound from './views/404.vue'
import Home from './views/Home.vue'
import Main from './views/Main.vue'

import Form from './views/baseService/Form.vue'

import MenuManager from './views/baseService/menuManager.vue'
import RoleManager from './views/baseService/roleManager.vue'
import ResourceManager from './views/baseService/resourceManager.vue'
import UserManager from './views/baseService/userManager.vue'
import GroupManager from './views/baseService/groupManager.vue'
import Organization from './views/orgService/Organization.vue'
import MyProjectManager from './views/projectService/myProjectManager.vue'
import Page4 from './views/nav2/Page4.vue'
import Page5 from './views/nav2/Page5.vue'
import page6 from './views/nav3/Page6.vue'
import echarts from './views/charts/echarts.vue'
import page7 from './views/nav4/page7.vue'
import page8 from './views/nav4/page8.vue'
import page9 from './views/nav4/page9.vue'

let routes = [{
        path: '/login',
        component: Login,
        name: '',
        hidden: true
    },
    {
        path: '/404',
        component: NotFound,
        name: '',
        hidden: true
    },
    // { 
    //     path: '/main', 
    //     component: Main 
    // },
    {
        path: '/',
        component: Home,
        iconCls: 'el-icon-message',
        name: '基础管理',
        children: [{
                path: '/menuManager',
                component: MenuManager,
                name: ' 菜单管理',
                hidden: true
            },
            {
                path: '/resourceManager',
                component: ResourceManager,
                name: ' 资源管理'
            },
            {
                path: '/roleManager',
                component: RoleManager,
                name: ' 角色管理'
            },
            {
                path: '/userManager',
                component: UserManager,
                name: ' 用户管理'
            },
            {
                path :'/groupManager',
                component:GroupManager,
                name:'组员管理'
            }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '项目平台',
        iconCls: 'fa fa-id-card-o',
        children: [{
                path: '/myProjectManager',
                component: MyProjectManager,
                name: '我的项目'
            },
            {
                path: '/page5',
                component: Page5,
                name: '我的项目'
            }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '基础组件',
        iconCls: 'fa fa-id-card-o',
        children: [{
            path: '/organization',
            component: Organization,
            name: '技术组件'
        }]
    },
    {
        path: '/',
        component: Home,
        name: '服务管理',
        iconCls: 'fa fa-address-card',
        children: [{
                path: '/page6',
                component: page6,
                name: '配置中心'
            },
            {
                path: '/page7',
                component: page7,
                name: '注册中心'
            },
            {
                path: '/page8',
                component: page8,
                name: '服务消费'
            },
            {
                path: '/page9',
                component: page9,
                name: '服务提供'
            }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '链路追踪',
        iconCls: 'fa fa-bar-chart',
        children: [{
            path: '/echarts',
            component: echarts,
            name: 'echarts'
        }]
    },
    {
        path: '*',
        hidden: true,
        redirect: {
            path: '/404'
        }
    }
];

export default routes;