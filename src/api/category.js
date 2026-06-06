import request from "@/utils/request"

//分页查询分类
export const CategoryQueryPageApi = (keyword,page,pageSize) => request.get(`/shop/categories/list?keyword=${keyword}&page=${page}&pageSize=${pageSize}`)

//新增分类
export const CategoryAddApi = (category) => request.post('/shop/categories',category)

//根据id查询分类
export const QueryByIdApi = (id) => request.get(`/shop/categories/${id}`)

//修改分类
export const CategoryUpdateApi = (id,category) => request.put(`/shop/categories/${id}`,category)

//批量删除分类
export const CategoryDeleteApi = (id) => request.delete(`/shop/categories/${id}`)

//菜品查询分类
export const GetCategoryName = () => request.get('/shop/categories/dish')


