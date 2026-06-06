import request from "@/utils/request"

// 分页查询订单列表
export const OrderQueryPageApi = (status, page, pageSize) => request.get('/shop/orders/list', { params: { status, page, pageSize } })

// 获取订单详情
export const OrderDetailApi = (orderId) => request.get(`/shop/orders/${orderId}`)

// 删除订单（按照菜品删除的方式，传递单个ID数组）
export const OrderDeleteApi = (ids) => request.delete(`/shop/orders/${ids}`)