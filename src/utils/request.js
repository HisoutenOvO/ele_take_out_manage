import axios from 'axios'
import {ElMessage} from "element-plus";
import router from '../router'

const request = axios.create({
    baseURL:'/api',
    timeout:600
})

request.interceptors.request.use(
    (config)=>{
        const token = localStorage.getItem('token')
        if(token){
            config.headers.token = token;
        }
        return config
    },
    (error)=> {
        return Promise.reject(error)
    }
)
request.interceptors.response.use(
    (response)=>{
        if(response.data.code === 401){
            ElMessage.error("登录超时，请重新登录！")
            router.push('/login')
        }
        return response.data
    },
    (error)=>{
        if(error.response && error.response.status === 401){
            ElMessage.error("登录超时，请重新登录！")
            router.push('/login')
        }
        else{
            ElMessage.error(result.msg)
        }
        return Promise.reject(error)
    }
)



export default request