import request from '@/utils/request'

//封装注册接口
export const userRegisterService = ({ username, password, repassword }) =>
    request.post('/api/reg', { username, password, repassword })


//封装登录接口
export const userLoginService = ({ username, password }) => 
    request.post('/api/login', {username, password} )

//注意箭头函数若代码块只有一个返回不需要花括号！！！

//封装请求用户接口
export const userGetInfoService = () => request.get('/my/userinfo')


//封装更新用户信息接口
export const userUpdateInfoService = ({ id, nickname, email }) =>  request.put('/my/userinfo', { id, nickname, email })

//封装更新用户头像接口
export const userUploadAvatarService = (avatar) => request.patch('/my/update/avatar', { avatar })

//封装更新用户密码接口
export const userUpdatePassService = ({ old_pwd, new_pwd, re_pwd }) =>
    request.patch('/my/updatepwd', { old_pwd, new_pwd, re_pwd })