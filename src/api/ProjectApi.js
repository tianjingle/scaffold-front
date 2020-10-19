import {
    postWithParams,
    getWithParams,
    deleteWithParams,
    patchWithParams
} from './utils'

export const getToolProjects = params => {
    return getWithParams("/org/find", {
        params: params
    })
}


export const addToolProject = params => {
    return postWithParams("/org/add", params)
}

export const removeToolProject = params => {
    return deleteWithParams("/org/delete/" + params, null);
}

export const editToolProject = params => {
    return patchWithParams("/org/modify", params)
}