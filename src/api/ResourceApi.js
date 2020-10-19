import {
    postWithParams,
    getWithParams,
    deleteWithParams,
    patchWithParams
} from './utils'

export const getResources = params => {
    return getWithParams("/resource-manager", {
        params: params
    })
}

export const addResource = params => {
    return postWithParams("/resources-manager", params)
}

export const batchRemoveResource = params => {
    return deleteWithParams("/resource-batch-delete", {
        params: params
    })
}

export const removeResource = params => {
    return deleteWithParams("/resource-manager/" + params, null);
}

export const editResource = params => {
    return patchWithParams("/resource-manager", params);
}

export const getMenuResourceAll = params => {
    return getWithParams("/menus-resources-manager/" + params, null);
}

export const menuResourceAdd = (id, params) => {
    return postWithParams("/menus-resources-manager/" + id, params)
}