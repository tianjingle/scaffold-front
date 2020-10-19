import {
    postWithParams,
    getWithParams,
    deleteWithParams,
    patchWithParams
} from './utils'

//用户登录
export const requestLogin = params => {
    return postWithParams("/users-login", params)
};
//获取用户菜单
export const getMenuByUser = params => {
    return getWithParams("/user-menus", "");
}
//获取用户列表
export const getUserList = params => {
    return getWithParams("/user-find", {
        params: params
    });
};
//添加用户
export const addUsers = params => {
    return postWithParams("/user-add", params);
}

//批量删除用户
export const batchRemoveUser = params => {
    return deleteWithParams("/users-delete", {
        params: params
    })
}
//删除用户
export const userDelete = params => {
    return deleteWithParams("/user-delete/" + params, null);
}
//编辑用户
export const editUser = params => {
    return patchWithParams("/user-update", params);
}

export const getRolesAll = params => {
    return getWithParams("/role-manager-all", null);
}