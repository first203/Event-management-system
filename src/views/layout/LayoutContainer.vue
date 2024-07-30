<script setup>
import {
  Management,
  Promotion,
  UserFilled,
  User,
  Crop,
  EditPen,
  SwitchButton,
  CaretBottom
} from '@element-plus/icons-vue'
import avatar from '@/assets/default.png'
import { userUserStore } from '@/stores'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router';

const userStore = userUserStore()
const router = useRouter()

onMounted(() => {
  userStore.getUser()
})

const handleCommand = key => {
    if(key === 'logout'){
        //弹出框提示确认退出
        //清除本地数据  < token和user >
        //退出操作
        ElMessageBox.confirm(
            '你确定要退出大事件吗？',   //提示消息
            '温馨提示',                //标题
            {
                confirmButtonText: '确认',
                cancelButtonText: '取消',
                type: 'warning',
            }
        )
        .then(() => {
            userStore.removeToken()
            userStore.setUser({})
            router.push('/login')
        })
    }
    else{
        router.push(`/user/${key}`)
    }
}
</script>

<template>
    <el-container>
        <el-aside width="200px">
            <div class="el-aside_logo"></div>
            <el-menu 
            :default-active="$route.path"
            active-text-color="#ffd04b"
            background-color="#232323"
            text-color="#fff"
            router>
                <el-menu-item index="/article/channel">
                    <el-icon><Management /></el-icon>
                    <span>文章分类</span>
                </el-menu-item>
                <el-menu-item index="/article/manage">
                    <el-icon><Promotion /></el-icon>
                    <span>文章管理</span>
                </el-menu-item>
                <el-sub-menu index="/user">
                    <template #title>
                        <el-icon><UserFilled /></el-icon>
                        <span>个人中心</span>
                    </template>
                    <el-menu-item index="/user/profile">
                        <el-icon><User /></el-icon>
                        <span>基本资料</span>
                    </el-menu-item>
                    <el-menu-item index="/user/avatar">
                        <el-icon><Crop /></el-icon>
                        <span>更换头像</span>
                    </el-menu-item>
                    <el-menu-item index="/user/password">
                        <el-icon><EditPen /></el-icon>
                        <span>重置密码</span>
                    </el-menu-item>
                </el-sub-menu>
            </el-menu>
        </el-aside>
        <el-container>
            <el-header class="flex">
                <div>黑马程序员：<strong>{{ userStore.user.nickname || userStore.user.username }}</strong></div>
                <el-dropdown placement="bottom-end" @command="handleCommand">
                    <!-- 展示给用户，默认看到的 -->
                    <span class="el-dropdown__box">
                        <el-avatar :src="userStore.user.user_pic || avatar" />    <!-- el-avatar：这是Element UI头像组件的开标签  -->
                        <el-icon><CaretBottom /></el-icon>
                    </span>

                    <!-- 折叠的下拉部分 -->
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item command="profile" :icon="User"    
                                >基本资料</el-dropdown-item>                     <!-- command	点击菜单项触发的事件回调  -->
                            <el-dropdown-item command="avatar" :icon="Crop"
                                >更换头像</el-dropdown-item>
                            <el-dropdown-item command="password" :icon="EditPen"
                                >重置密码</el-dropdown-item>
                            <el-dropdown-item command="logout" :icon="SwitchButton"
                                >退出登录</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </el-header>
            <el-main>
                <router-view></router-view>
            </el-main>
            <el-footer>大事件 @2024 少年正锦时的管理系统学习项目</el-footer>
        </el-container>
    </el-container>
</template>

<style lang="scss" scoped>
.el-container{
    height: 100vh;
    .el-aside{
        background-color: #232323;
        .el-aside_logo{
            height: 120px;
            background: url('../../assets/logo2.png') no-repeat center / contain;
        }
    }
}

.flex{
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.el-dropdown__box{
    display: flex;
    width: 64px;
    height: 40px;
    align-items: center;
    justify-content: space-between;
    outline: none;
}

.el-footer{
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    color: #666;
}
</style>