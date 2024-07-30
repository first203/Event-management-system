<script setup>
import { ref } from 'vue'
import { Plus, Upload } from '@element-plus/icons-vue'
import { userUserStore } from '@/stores'
import { userUploadAvatarService } from '@/api/user'
const userStore = userUserStore()
const imgUrl = ref(userStore.user.user_pic)
const uploadRef = ref()
const disable = ref( true )  //上传图像按钮显控
//图片预览
const onUploadFile = (file) => {
  const reader = new FileReader()
  reader.readAsDataURL(file.raw)
  reader.onload = () => {
    imgUrl.value = reader.result
  }
  disable.value = false
}
//图片提交
const onSubmit = async () => {
    await userUploadAvatarService(imgUrl.value)
    await userStore.getUser()
    ElMessage({ type: 'success', message: '更换头像成功' })
    disable.value = true
}
</script>

<template>
  <page-container title="更换头像">
    <el-row>
      <el-col :span="12">
        <el-upload
          ref="uploadRef"
          class="avatar-uploader"
          :auto-upload="false"
          :show-file-list="false"
          :on-change="onUploadFile"
        >
          <img v-if="imgUrl" :src="imgUrl" class="avatar" />
          <img v-else src="@/assets/avatar.jpg" width="278" />
        </el-upload>
        <br />
        <el-button @click="uploadRef.$el.querySelector('input').click()"
         type="primary"
         :icon="Plus"
         size="large"><!-- 当用户点击绑定了这个事件的元素时，它会找到 uploadRef 引用的元素内部的第一条 <input> 元素，并模拟点击这个 <input> 元素 -->
          选择图片
        </el-button>
        <el-button type="success" :icon="Upload" size="large" @click="onSubmit" :disabled="disable">
          上传头像
        </el-button>
      </el-col>
    </el-row>
  </page-container>
</template>

<style lang="scss" scoped>
.avatar-uploader {
  :deep() {
    .avatar {
      width: 278px;
      height: 278px;
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
      width: 278px;
      height: 278px;
      text-align: center;
    }
  }
}
</style>