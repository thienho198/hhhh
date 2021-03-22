export const BaseUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:3005/' : 'http://27.71.227.174:3001/'
export const AUTH = {
    obtainToken: BaseUrl + 'auth/token',  
    refreshToken: BaseUrl + 'refresh-token', 
}

export const ACCOUNT = {
    getInfo: BaseUrl + 'account/get-info'
}