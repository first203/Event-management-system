<!-- 封装对话框组件以方便编辑分类和添加分类两个功能复用 -->

<script setup>
import { ref, watch } from 'vue'
import { artAddChannelService, artEditChannelService } from '@/api/article'
import { ElMessage } from 'element-plus';
const dialogVisible = ref( false )
const form = ref()
const formModel = ref({
    cate_name: '',
    cate_alias: ''
})
//基于open传过来的参数row判断是否为空以区分是添加还是编辑
const open = (row) => {
    dialogVisible.value = true
    formModel.value = { ...row } /* ...表示将对象表达式按照key-value的方式展开 */
}//open中formModel.value = { ...row }相当于每次打开对话框，如果是添加数据则重置formModel的内容，如果是编辑数据给表单则渲染上内容

/* 对外暴露方法以方便使用组件时打开对话框 */
defineExpose({
    open
})


/* 表单信息 */
/* 表单校验规则 */
const rules = {
    cate_name: [
        { required: true, message: '请输入分类名称', trigger: 'blur'},
        {
            pattern: /^\S{1,10}$/,
            message: '分类名必须是 1-10 位的非空字符',
            trigger: 'blur'
        }
    ],
    cate_alias: [
        { required: true, message: '请输入分类别名', trigger: 'blur'},
        {
            pattern: /^[a-zA-Z0-9]{1,15}$/,
            message: '别名必须是 1-15 位的字母或数字',
            trigger: 'blur'
        }
    ]
}

const emit = defineEmits(['success']) /* defineEmits 是一个用于在组件内部声明可以触发的事件及其有效载荷类型的方法 */
 /* 通知表单进行数据更新 */
const confirm = async() => {
    await form.value.validate()
    const formId = formModel.value.id
    if(!formId){
        await artAddChannelService( formModel.value )
        ElMessage.success('添加成功')
    }
    else{
        await artEditChannelService( formModel.value )
        ElMessage.success('编辑成功')
    }
    dialogVisible.value = false
    emit('success')  /* 向父组件传递可以触发的事件 */
}

</script>

<template>
    <el-dialog
    v-model="dialogVisible"
    :title="formModel.id ? '编辑分类' : '添加分类'"
    width="30%"
  >
    <el-form ref="form" :model="formModel" :rules="rules" size="large" style="margin: 30px 30px">
        <el-form-item label="分类名称" prop="cate_name">
            <el-input v-model="formModel.cate_name"  placehoder="请输入分类名称"></el-input>
        </el-form-item>
        <el-form-item label="分类别名" prop="cate_alias">
            <el-input v-model="formModel.cate_alias" placehoder="请输入分类别名"></el-input>
        </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirm">
          确认
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>