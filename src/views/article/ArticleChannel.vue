<script setup>
import { artGetChannelsService, artDelChannelService } from '@/api/article'
import { ref, onMounted} from 'vue'
import { Edit, Delete } from '@element-plus/icons-vue'
import ChannelEdit from '@/views/article/components/ChannelEdit.vue'
import { ElMessage } from 'element-plus';
const channelList = ref([])
const loading = ref( false ) /* 用于表格加载动画 */
const dialog=ref()  /* 通过ref绑定获取ChannelEdit组件节点以使用它暴露的open方法 */

//向后端接口申请文章数据的方法
const getChannelList = async() => {
    loading.value = true
    const res = await artGetChannelsService()
    channelList.value = res.data.data
    loading.value = false
}
//渲染页面时向后端发送请求获取数据

getChannelList()


const onDelChannel = async (row) =>{
    await ElMessageBox.confirm('你确定要删除该分类吗？', '温馨提示',{
        type: 'warning',
        confirmButtonText: '确认',
        cancelButtonText: '取消'
    })
    await artDelChannelService(row.id)
    ElMessage.success('删除成功')
    getChannelList()
}

const onAddChannel = () =>{
    dialog.value.open({})
}

const onEditChannel = (row) => {
    dialog.value.open(row)
}

const onSuccess = () => {  /* 响应子组件数据更新回显 */
    console.log('test')
    getChannelList()
}

</script>

<template>
    <page-container title="文章分类">
        <template #extra>
            <el-button type="primary" @click="onAddChannel">添加文章</el-button>
        </template>
        
        <el-table :data="channelList" style="width: 100%" v-loading="loading">
            <el-table-column label="序号" type="index" width="100" />  <!-- type='index'自动添加序号 -->
            <el-table-column prop="cate_name" label="分类名称" />
            <el-table-column prop="cate_alias" label="分类别名" />
            <el-table-column label="操作" width="150">
                <!-- 自定义列显示内容 -->
                <template #default="{ row }">  <!-- row包含了当前行的数据 -->
                    <el-button
                        :icon="Edit"
                        circle
                        plain
                        type="primary"
                        @click="onEditChannel(row)"
                    ></el-button>
                    <el-button
                        :icon="Delete"
                        circle 
                        plain
                        type="danger"
                        @click="onDelChannel(row, $index)"
                    ></el-button>
                </template>
            </el-table-column>
            <!-- 空内容表格内容显示 -->
            <template #empty>
                <el-empty description="没有数据" />
            </template>
        </el-table>
        <channel-edit ref="dialog" @success="onSuccess"></channel-edit>  
    </page-container>
</template>

<style>
</style>
