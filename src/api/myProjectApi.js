import {
    postWithParams,
    getWithParams,
    deleteWithParams,
    patchWithParams
} from './utils'

export const getProjects = params => {
    return getWithParams("/projects-scaffold-find", {
        params: params
    })
}

export const addMyProject=params=>{
    return postWithParams("/projects-scaffold-create",params)
}