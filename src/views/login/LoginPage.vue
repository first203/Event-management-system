<script setup>
import { ref, reactive, watch } from 'vue' 
import { User, Lock } from '@element-plus/icons-vue' /*图标组件*/

import { userRegisterService,userLoginService } from '@/api/user'
import { userUserStore } from '@/stores/index'
import { useRouter} from 'vue-router'  //登录后跳转到首页
const isRegister = ref( false ) /*响应式的引用数据访问其下的属性和方法需要加.value*/
const form = ref()  /* 用于表单校验 */
//注册表单绑定数据对象
var ruleForm = reactive({
    username: '',
    password: '',
    repassword: ''
})
//注册表单校验规则
const rules =  reactive({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },  //trigger: 'blur'失焦时触发校验; trigger: 'change' 实时校验
    { min: 5, max: 10, message: '用户名必须是5-10位的字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    {
      pattern: /^\S{6,15}$/,
      message: '密码必须是6-15位的非空字符',
      trigger: 'blur'
    }
  ],
  repassword: [
    { required: true, message: '请再次输入密码', trigger: 'blur' },
    {
      pattern: /^\S{6,15}$/,
      message: '密码必须是6-15的非空字符',
      trigger: 'blur'
    },
    {
      validator: (rule, value, callback) => {
        //判断value和当前ruleForm中收集的password是否一致
        if (value !== ruleForm.password) {
          callback(new Error('两次输入密码不一致!'))
        } else {
          callback() //就算校验成功也要callback 
        }
      },
      trigger: 'blur'
    }
  ]
})


const register = async() => {
    //注册成功之前先进行预校验，校验成功=> 请求，校验失败=>自动提示
    await form.value.validate()
    //注册请求
    await userRegisterService(ruleForm)
    ElMessage.success('注册成功！') /*自动导入了ElMessage,不需要再重新导入，否则没有提示*/
    //注册成功切换到登录页面
    isRegister.value = false
}

//登陆前进行预校验
//调用方法将 token 存入 pinia 并 自动持久化本地
//登陆成功跳转到首页
const userStore = userUserStore()
const router = useRouter()
const login = async() => {
    await form.value.validate()
    const res = await userLoginService(ruleForm)
    userStore.setToken(res.data.token)
    ElMessage.success('登录成功！')
    router.push('/')
} 

//由于登录和注册使用同一个ruleForm对象,因此在切换时需要清空ruleFrom的数据,防止表单有输入时切换后输入带到另一个页面
//需要引入watch
watch(isRegister.value, () => {
    ruleForm = {
        username: '',
        password: '',
        repassword: ''
    }
})


</script>

<template>
<!--el-row 表示一行,一行分成24份
    el-col表示列
    (1) :span='12'表示一行中占12份
    (2) :offset='3'表示一行中,左侧margin份数

    el-form 整个表单组件
    el-form-item 表单的一行（一行表单域）
    el-input 表单元素（输入框） -->

<!-- 2.表单校验
    (1) el-form => :model="ruleForm" 给el-form绑定整个ruleForm数据对象
    (2) el-form => :rules="rules" 给el-form绑定rules对象规则,rules中的字段和ruleForm中的属性对应
    (3) 表单元素 => v-model="ruleForm.xxx" 给表单元素绑定ruleForm的子属性
    (4) el-form-item => prop="xxx" 配置生效的是哪个校验规则(和rules中的字段对应)
 -->
<!-- 3.自定义校验
    validator: (rule, value, callback)
    (1) rule 当前的校验规则相关信息
    (2) value 所校验的表单元素目前的表单值
    (3) callback 无论成功失败都需要callback回调
 -->
    <el-row class="loginPage">
        <el-col :span="12" class="bg"></el-col>
        <el-col :span="6" :offset="3" class="form">
            <el-form ref="form"
            :model="ruleForm"
            :rules="rules"
            size="large"
            v-if="isRegister">  <!-- el-form组件的宽度为el-col的宽度 -->
                <el-form-item>
                    <h1>注册</h1>
                </el-form-item>
                <el-form-item prop="username">
                    <el-input 
                        :prefix-icon="User" 
                        placeholder="请输入用户名"
                        v-model="ruleForm.username"
                        ></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input
                        :prefix-icon="Lock"
                        type="password"
                        placeholder="请输入密码"
                        v-model="ruleForm.password"
                    ></el-input>
                </el-form-item>
                <el-form-item prop="repassword">
                    <el-input
                        :prefix-icon="Lock"
                        type="password"
                        placeholder="请输入再次密码"
                        v-model="ruleForm.repassword"
                    ></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button
                    class="button"
                    type="primary"
                    auto-insert-space
                    @click="register"
                    >注册</el-button>
                </el-form-item>
                <el-form-item>
                    <el-link type="info" :underline="false" @click="isRegister = false">←返回</el-link>  <!-- 在template中不需要对ref函数创建的响应式数据进行.value来使用 -->
                </el-form-item>
            </el-form>
            <el-form ref="form"
            size="large"
            :model="ruleForm"
            :rules="rules"
            v-else>
                <el-form-item>
                    <h1>登录</h1>
                </el-form-item>
                <el-form-item prop="username">
                    <el-input 
                        v-model="ruleForm.username" 
                        :prefix-icon="User" 
                        placeholder="请输入用户名"
                    ></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input
                        name="password"
                        :prefix-icon="Lock"
                        type="password"
                        placeholder="请输入密码"
                        v-model="ruleForm.password"
                    ></el-input>
                </el-form-item>
                <el-form-item >
                    <div class="flex">
                        <el-checkbox>记住我</el-checkbox>
                        <el-link type="primary" :underline="false">忘记密码？</el-link>
                    </div>
                </el-form-item>
                <el-form-item>
                    <el-button 
                        class="button" 
                        type="primary" 
                        auto-insert-space
                        @click="login"
                    >登录</el-button>
                </el-form-item>
                <el-form-item>
                    <el-link type="info" :underline="false" @click="isRegister = true">注册 →</el-link>
                </el-form-item>
            </el-form>
        </el-col>
    </el-row>
</template>

<style scoped>

.loginPage{
    height: 100vh;
    background-color: #fff;
}

.bg {
    background: url('@/assets/logo2.png') no-repeat 60% center / 240px auto,
      url('@/assets/login_bg.jpg') no-repeat center / cover;
    border-radius: 10px 20px 20px 10px;
}

.form{
    display: flex;
    flex-direction: column;
    justify-content: center;
    user-select: none; /* 禁止用户选择文本内容 */
}

.button{
    width: 100%;
}

.flex{
    width: 100%;
    display: flex;
    justify-content: space-between;
}

</style>