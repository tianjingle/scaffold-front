import axios from 'axios';
import {
    Message
} from 'element-ui'
let scaffold = '/scaffold';
import Login from '../views/Login.vue'


import VueRouter from 'vue-router'
import routes from '../routes'
const router = new VueRouter([
    {
        path: '/login',
        component: Login,
        name: '',
        hidden: true
    }
])


//通过url+参数的方式发送数据
export const postWithParams = (url, params) => {
    var that=this;
    return axios.post(`${scaffold}` + url, params)
        .then(function (res) {
            console.log(router)
            if (res.data.success == false) {
                if (res.data.message == "系统超时，请重新登录") {
                    alert(1)
                    sessionStorage.removeItem('user');
                    
                    router.push({
                        path: "/login"
                    });
                }
                Message.error({
                    message: res.data.message
                });
            } 
            return res.data;
        }.bind(this));
}

//get url+params
export const getWithParams = (url, params) => {
    var that=this;
    const getTimestamp = new Date().getTime();
    return axios.get(`${scaffold}` + url + "?time=" + getTimestamp, params)
        .then(function (res) {
            if (res.data.success == false) {
                Message.error({
                    message: res.data.message
                });
                if (res.data.message == "系统超时，请重新登录") {
                    alert(1)
                    sessionStorage.removeItem('user');
                    router.push({
                        path: "/login"
                    });
                }
            } else {
                return res.data;
            }
        }.bind(this));
}

export const deleteWithParams = (url, params) => {
    const getTimestamp = new Date().getTime();
    return axios.delete(`${scaffold}` + url + "?time=" + getTimestamp, params)
        .then(res => {
            if (res.data.success == false) {
                Message.error({
                    message: res.data.message
                });
            } else {
            }
            return res.data;
        });
}
export const patchWithParams = (url, params) => {
    const getTimestamp = new Date().getTime();
    return axios.patch(`${scaffold}` + url + "?time=" + getTimestamp, params)
        .then(res => {
            console.log(res.data);
            if (res.data.success == false) {
                Message.error({
                    message: res.data.message
                });
            } 
            return res.data;
        });
}