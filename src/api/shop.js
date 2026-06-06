import request from "@/utils/request"

//条件分页查询
export const queryPageApi = (keyword,page,pageSize) => request.get(`/admin/shops/list?keyword=${keyword}&page=${page}&pageSize=${pageSize}`)

//新增
export const addApi = (shop) => request.post('/admin/shops',shop)

//根据id查询商家
export const queryByIdApi = (id) => request.get(`/admin/shops/${id}`)

//修改商家
export const updateApi = (id,shop) =>request.put(`/admin/shops/${id}`,shop)

//删除商家
export const deleteApi = (ids) =>request.delete('/admin/shops',{data:ids})




