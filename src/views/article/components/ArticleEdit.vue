<script setup>
import { ref } from 'vue'
import ChannelSelect from './ChannelSelect.vue';
import { Plus } from '@element-plus/icons-vue' 
import { QuillEditor } from '@vueup/vue-quill' //富文本编辑器库包
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import { artPublishService, artGetDetailService, artEditService } from '@/api/article'
import { baseURL } from '@/utils/request'
import axios from 'axios'

const visibleDrawer = ref( false ) /* 控制抽屉显示隐藏 */
//默认的空数据
const defaultModel = {
    title: '', //标题
    cate_id: '', //分类id
    cover_img: '', //图片
    content: '', //文本内容
    state: '' //状态
}
const formModel = ref({ ...defaultModel })
const rules = {
    title: [
        { required: true, message: '请输入文章标题', trigger: 'blur'}
    ],
    cate_id: [
        { required: true, message: '选中文章分类', trigger: 'blur'}
    ],
    cover_img: [
        { required: true, message: '请上传图片', trigger: 'blur'}
    ],
    content: [
        { required: true, message: '请输入文章内容', trigger: 'blur'}
    ]
}

//图片上传相关逻辑
const imgUrl = ref('')
const onSelectFile = (uploadFile) => {
    imgUrl.value = URL.createObjectURL(uploadFile.raw)   //预览图片
    //将图片对象存入formModel用于提交
    formModel.value.cover_img = uploadFile.raw  
}

const formRef = ref()
const emit = defineEmits(['success'])
const onPublish = async (state) => {
    formModel.value.state = state
    //注意当前的接口需要的是formData对象
    //需要将对象 => 转换为 formData对象
    const fd = new FormData()
    for(let key in formModel.value){  //注意是formModel.value！！！！！！！！not formModel！！！！！！
        fd.append(key, formModel.value[key])
    }
    //发请求
    if(formModel.value.id){
        //编辑操作
        await artEditService(fd)
        ElMessage.success('修改成功')
        emit('success', 'edit')
    }
    else{
        //添加操作
        await formRef.value.validate() /* 表单校验 */
        await artPublishService(fd)
        ElMessage.success('添加成功')
        //通知父组件回显
        emit('success', 'add')
    }
    console.log('1')
    visibleDrawer.value = false
}

//组件对外暴露一个open方法，基于open方法传进来的参数 区分是添加还是编辑
//open({}) 表单无需渲染，说明是添加
//open({row}) 表单需要渲染，说明是编辑
//open调用后可以打开抽屉
const editorRef = ref()
const open = async (row) => {
    visibleDrawer.value = true
    //由于传过来的表格数据并不全包含了formModel中的数据，因此要基于row.id发送请求，获取编辑对应的详情数据进行回显
    if(row.id){ //如果是编辑则发请求申请相应的表格数据
        const res = await artGetDetailService( row.id )
        formModel.value = res.data.data
        //图片需要单独处理
        //注意提交给后台需要的数据格式是file对象格式
        //需要将网络图片地址转换成file对象存储起来
        imgUrl.value = baseURL + formModel.value.cover_img
        const file = await imageUrlToFile( imgUrl.value, formModel.value.cover_img)
        formModel.value.cover_img = file
    }   
    else{
        //若果是添加则重置表单数据为空
        formModel.value = {...defaultModel}
        //图片和富文本编辑器需要手动重置
        imgUrl.value = ''
        await editorRef.value.setHTML('')
    }
}

defineExpose({
    open
})

// 将网络图片地址转换为File对象
async function imageUrlToFile(url, fileName) {
  try {
    // 第一步：使用axios获取网络图片数据
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const imageData = response.data;

    // 第二步：将图片数据转换为Blob对象
    const blob = new Blob([imageData], { type: response.headers['content-type'] });

    // 第三步：创建一个新的File对象
    const file = new File([blob], fileName, { type: blob.type });

    return file;
  } catch (error) {
    console.error('将图片转换为File对象时发生错误:', error);
    throw error;
  }
}
</script>

<template>
    <!-- 抽屉 -->
    <el-drawer
     v-model="visibleDrawer"
     :title="formModel.id ? '编辑文章' : '添加文章'"
     direction="rtl"
     size="50%">
        <el-form 
         ref="formRef"
         :model="formModel"
         :rules="rules">
            <el-form-item label="文章标题" prop="title">
                <el-input v-model="formModel.title" placeholder="请输入标题"></el-input>
            </el-form-item>
            <el-form-item label="文章分类" prop="cate_id">
                <channel-select v-model="formModel.cate_id"></channel-select>
            </el-form-item>
            <el-form-item label="文章封面" prop="cover_img">
            <!-- 此处需要auto-upload关闭element-plus的自动上传，不需要配置action等参数
                只需要做前端的本地预览，无需在提交前上传图标
                语法：URL.createObjectURL(...)创建本地预览地址来预览
                on-change: 文件状态改变时的钩子，包括添加文件、上传成功、上传失败, 添加文件时这个钩子的调用的函数的参数就包含了该文件 -->
                <el-upload
                 class="avatar-uploader"                 
                 :show-file-list="false"
                 :auto-upload="false"
                 :on-change= "onSelectFile"
                 >
                    <img v-if="imgUrl" :src="imgUrl" class="avatar" />
                    <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
                </el-upload>
            </el-form-item>
            <el-form-item label="文章内容" prop="content">
                <div class="editor">
                    <quill-editor
                     ref="editorRef"
                     theme="snow"
                     v-model:content="formModel.content"
                     contentType="html"
                     ></quill-editor>
                </div>
            </el-form-item>      
            <el-form-item>
                <el-button type="primary" @click="onPublish('已发布')">发布</el-button>
                <el-button type="info"  @click="onPublish('草稿')">草稿</el-button>
            </el-form-item>
        </el-form>
    </el-drawer>

</template>

<style lang="scss" scoped>
.avatar-uploader {
  :deep() {
    .avatar {
      width: 178px;
      height: 178px;
      display: block;
    }
    .el-upload {
      border: 1px dashed var(--el-border-color);
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: var(--el-transition-duration-fast);
    }
    .el-upload:hover {
      border-color: var(--el-color-primary);
    }
    .el-icon.avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      text-align: center;
    }
  }
}

.editor {
    width: 100%;
    :deep(.ql-editor){
        min-height: 200px;
    }
}
</style>