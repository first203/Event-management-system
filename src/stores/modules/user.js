/* 存储登陆时服务器返回的表明用户身份唯一标识token、的仓库 */
import { defineStore } from "pinia"
import { ref } from 'vue'
import { userGetInfoService } from '@/api/user'

export const userUserStore = defineStore('big-user',
    () => {
        const token = ref('') //声明数据
        const setToken = (newToken) => {  //设置数据函数
            token.value = newToken 
        }
        const removeToken = () =>{  //移除数据函数
            token.value = ''
        }
        const user = ref({})
        const getUser = async () => {
            const res = await userGetInfoService() // 请求获取数据
            user.value = res.data.data
        }
        const setUser = (obj) => {
            user.value = obj
        }
        return { /*  将属性和方法都暴露出来 */
            token,
            setToken,
            removeToken,
            user,
            getUser,
            setUser
        }

    }, 
    {persist: true}  /* pinia持久化 */
)