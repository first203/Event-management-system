<script setup>
import { ref } from 'vue';
import PageContainer from '@/components/PageContainer.vue';
import { userUserStore } from '@/stores';
import { userUpdateInfoService } from '@/api/user'

const itemLabelPosition = ref('right')
const userStore = userUserStore()
const formModel = ref({ ...userStore.user //数据变量声明要和后端接口的命名一致
})
//声明表单校验规则
const rules= {
    nickname: [
        { required: true, message: '请输入昵称', trigger: 'blur' },
        { pattern: /^\S{2,10}$/,
          message: '昵称必须是2-10位的非空字符串',
          trigger: 'blur'
        }
    ],
    email: [
        { required: true, message: '请输入邮箱', trigger: 'blur' },
        { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
    ],
}

const formRef = ref()
//数据提交
const onSubmit = async () => {
    const valid = await formRef.value.validate()
    if(valid){
        await userUpdateInfoService(formModel.value)
        await userStore.getUser()
        ElMessage.success('修改成功')
    }
}
</script>

<template>
    <page-container title="基本资料">
        <el-form ref="formRef" :model="formModel" :rules="rules" size="large" label-width="auto" :label-position="itemLabelPosition">
            <el-form-item label="登录名称" >
                <el-input v-model="formModel.username" disabled="false" ></el-input>
            </el-form-item>
            <el-form-item label="用户昵称" prop="nickname">
                <el-input v-model="formModel.nickname" ></el-input>
            </el-form-item>
            <el-form-item label="用户邮箱" prop="email">
                <el-input v-model="formModel.email" ></el-input>
            </el-form-item>
            <el-form-item label=" ">
                <el-button type="primary" @click="onSubmit">提交修改</el-button>
            </el-form-item>
        </el-form>
    </page-container>
</template>

<style scoped>
.el-form {
    width: 440px;
}

</style>