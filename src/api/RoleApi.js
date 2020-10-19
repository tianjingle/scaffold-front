import {
    postWithParams,
    getWithParams,
    deleteWithParams,
    patchWithParams
} from './utils'

export const getRole = params => {
    return getWithParams("/role-manager", {
        params: params
    })
}

export const addRole = params => {
    return postWithParams("/role-manager", params)
}

export const batchRemoveRole = params => {
    return deleteWithParams("/role-batch-remove", {
        params: params
    })
}

export const removeRole = params => {
    return deleteWithParams("/role-manager/" + params, null)
}

export const editRole = params => {
    return patchWithParams("/role-manager", params)
}

export const getRoleMenus = params => {
    return getWithParams("/roles-menus-manager/" + params, null)
}

export const roleMenuAdd = (id, params) => {
    return patchWithParams("/roles-menus-manager/" + id, params)
}