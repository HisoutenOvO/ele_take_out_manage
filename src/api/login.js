import request from '@/utils/request'

// 管理员登录
export const adminLoginApi = (data) => request.post('/admin/login', data)

// 商家登录
export const shopLoginApi = (data) => request.post('/shop/shops/login', data)

// 管理员修改自己的密码
export const adminChangePasswordApi = (data) => request.put('/admin/changePassword', data)
// 商家修改自己的密码
export const shopChangePasswordApi = (data) => request.put('/shop/shops/changePassword', data)