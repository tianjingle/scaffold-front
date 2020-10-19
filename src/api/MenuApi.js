import {
    postWithParams,
    getWithParams,
    deleteWithParams,
    patchWithParams
} from './utils'

export const getMenus = params => {
    return getWithParams("/menu-manager", {
        params: params
    })
}

export const batchRemoveMenu = params => {
    return deleteWithParams("/menu-batch-remove", {
        params: params
    })
}

export const addMenu = params => {
    return postWithParams("/menu-manager", params)
}

export const removeMenu = params => {
    return deleteWithParams("/menu-manager/" + params)
}

export const editMenu = params => {
    debugger;
    return patchWithParams("/menu-manager", params)
}