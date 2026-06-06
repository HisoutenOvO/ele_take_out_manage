import request from "@/utils/request"

//分页查询菜品
export const DishQueryPageApi = (categoryName,keyword,page,pageSize) => request.get(`/shop/dishes/list?categoryName=${categoryName}&keyword=${keyword}&page=${page}&pageSize=${pageSize}`)

//新增菜品
export const DishAddApi = (dish) => request.post('/shop/dishes',dish)

//根据id查询菜品
export const QueryByIdApi = (id) => request.get(`/shop/dishes/${id}`)

//修改菜品
export const DishUpdateApi = (id,dish) => request.put(`/shop/dishes/${id}`,dish)

//批量删除菜品
export const DishDeleteApi = (ids) => request.delete(`/shop/dishes/${ids}`)


