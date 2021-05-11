export const BaseUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:3005/' : 'http://27.71.227.174:3001/'
export const AUTH = {
    obtainToken: BaseUrl + 'auth-srv/token',  
    refreshToken: BaseUrl + 'refresh-token', 
}

export const ACCOUNT = {
    getInfo: BaseUrl + 'account-srv/account/get-info',
    getList: BaseUrl + 'account-srv/account', 
    create: BaseUrl + 'account-srv/account/create',
    update: BaseUrl + 'account-srv/account/update',
}

export const ROLE = {
    get: BaseUrl + 'auth-srv/role',
    create: BaseUrl + 'auth-srv/role/create',
    delete: BaseUrl + 'auth-srv/role/delete',
    update: BaseUrl + 'auth-srv/role/update'
}

export const MENU = {
    get: BaseUrl + 'account-srv/menu',
    create: BaseUrl + 'account-srv/menu/create',
    update: BaseUrl + 'account-srv/menu/update', 
    delete: BaseUrl + 'account-srv/menu/delete'
}

export const TYPE = {
    get: BaseUrl + 'account-srv/type'
}