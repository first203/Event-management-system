//数据交互-请求工具的设计

import axios from 'axios'
import { userUserStore } from '../stores/index'
import { ElMessage } from 'element-plus'
import router from '@/router'
const baseURL = 'http://big-event-vue-api-t.itheima.net'

//创建axios实例
const instance = axios.create({
  // TODO 1:基础地址，超时时间
  baseURL,
  timeout: 100000
})


//请求拦截
instance.interceptors.request.use(
  (config) => {
    // TODO 2. 携带token
    const userStore = userUserStore()
    if(userStore.token){  //判断是否请求携带token
        config.headers.Authorization=userStore.token
    }
    return config
  },
  (err) => Promise.reject(err)
)
//响应拦截
instance.interceptors.response.use(
  (res) => {
    // TODO 3. 处理业务失败
    // TODO 4. 摘取核心响应数据
    if(res.data.code === 0){
        return res
    }
    //处理业务失败，给错误提示，抛出错误
    ElMessage.error(res.data.message || '服务异常')
    return Promise.reject(res.data)
  },
  (err) => {
    // TODO 5. 处理401错误
    //错误的特殊情况 => 401 权限不足 或 token 过期 => 拦截到登录
    if(err.response?.status === 401){
        router.push('/login')
    }

    //错误的默认情况
    ElMessage.error(err.response.data.message || '服务异常')
    return Promise.reject(err)
  }
)

export default instance
export {baseURL} //按需导出