<script setup>
import { artGetChannelsService } from '@/api/article'
import { ref } from 'vue'

defineProps({
    modelValue: {
        type: [Number, String]
    }
})

const emit = defineEmits(['update:modelValue'])
const channelList = ref([])
const getChannelList = async () => {
    const res = await artGetChannelsService()
    channelList.value = res.data.data
}

getChannelList()

</script>
<!-- 封装文章分类下拉菜单 -->
<template>
    <el-select
     :modelValue="modelValue"
     @update:modelValue="emit('update:modelValue',$event)" 
     placeholder="请选择">
     <!-- 当选中下拉菜单中的某个选项后激发子传父将这个数据$event回传给父元素 -->
        <!-- label是展示给用户看的，value是提交到后台用来将对应的label渲染到el-select上的，因此这里的el-select 中:modelValue="modelValue"相当于v-model='channel.id',不过要将数据一并传回父组件用上了父子数据之间的绑定-->
        <el-option
        v-for="channel in channelList"
        :key="channel.id"
        :label="channel.cate_name"
        :value="channel.id" />
    </el-select>
</template>