<script setup>
import { Delete, Edit } from '@element-plus/icons-vue'
import { ref } from 'vue'
import ChannelSelect from './components/ChannelSelect.vue';
import { artGetListService, artDelService } from '@/api/article'
import { formatTime } from '@/utils/format'
import ArticleEdit  from './components/ArticleEdit.vue';
import { ElMessage, ElMessageBox } from 'element-plus';
const articleList = ref([]) //文章列表
const total = ref(0)  //总条数
const loading = ref( false ) /* 用于表格加载动画 */
//定义请求参数对象
//表格渲染多少条数据根据向后端传递的pagenum、pagesize决定，然后后端会自动返回相应的数据
const params = ref({
    pagenum: 1,
    pagesize: 10,
    cate_id: '',
    state: ''
})
//请求获取文章列表
const getArticleList = async () => {
    loading.value = true
    const res = await artGetListService(params.value)  //请求参数对象传过去 返回文章列表
    articleList.value = res.data.data
    total.value = res.data.total
    loading.value = false
}

getArticleList()

//处理分页逻辑
const onSizeChange = (size) => {
    params.value.pagenum = 1 /* 每页条数发生变化，则访问当前页就没有意义了，因此让其重新回到第一页渲染 */
    params.value.pagesize = size
    getArticleList()
}

//处理当前页的渲染
const onCurrentChange = (page) => {
    //更新当前页
    params.value.pagenum = page
    getArticleList()
}

//搜索按钮实现
//按最新的的条件检索，从第一页开始展示
const onSearch = () => {
    params.value.pagenum = 1
    getArticleList()
}

const onReset = () => {
    params.value.pagenum = 1
    params.value.cate_id = ''
    params.value.state = ''
    getArticleList()
}

const articleEditRef = ref()
//添加文章逻辑
const onAddArticle = () => {
    articleEditRef.value.open({})
}


//编辑文章逻辑
const onEditArticle = (row) => {
    articleEditRef.value.open(row)
}

const onDelArticle = async (row) => {
    await ElMessageBox.confirm('你确定删除该文章信息吗？', '温馨提示', {
        type: 'warning',
        confirmButtonText: '确认',
        cancelButtonText: '取消'
    })
    await artDelService(row.id)
    ElMessage.success('删除成功')
    getArticleList()
}

//添加或者编辑成功的回调
const onSuccess = (type) => {
    if(type === 'add'){
        //如果是添加，最好渲染最后一页
        const lastPage = Math.ceil((total.value + 1) / params.value.pagesize)  //注意Math大写
        params.value.pagenum = lastPage
        getArticleList()
    }
    else if(type === 'edit'){
        //如果是编辑直接渲染
        getArticleList()
    }
}

</script>

<template>
    <page-container title="文章管理" style="overflow: auto">
        <template #extra>
            <el-button type="primary" @click="onAddArticle">发布文章</el-button>
        </template>
        <!-- 表单区域 -->
        <el-form inline>
            <el-form-item label="文章分类：">
                <channel-select v-model="params.cate_id"></channel-select>
            </el-form-item>
            <el-form-item label="发布状态：">
                <el-select v-model="params.state" placeholder="请选择">
                    <!-- 这里后台标记的发布状态就是中文标记的，所以value也为已发布/草稿 -->
                    <el-option label="已发布" value="已发布" />
                    <el-option label="草稿" value="草稿" />
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSearch">搜索</el-button>
                <el-button @click="onReset">重置</el-button>
            </el-form-item>
        </el-form>
        <!-- 表格区域 -->
        <el-table
         :data="articleList"
         style="margin-top: 10px;
         width: 100%"
         v-loading="loading">
            <el-table-column label="文章标题" prop="title" width="400">
                <!-- 自定义列内容为链接文本 -->
                <template #default="{ row }">
                    <el-link type="primary" :underline="false">{{ row.title }}</el-link>
                </template>
            </el-table-column>
            <el-table-column label="分类" prop="cate_name"></el-table-column>
            <el-table-column label="发表时间" prop="pub_date">
                <!-- 自定义列内容为格式化时间 -->
                <template #default="{ row }">
                    {{ formatTime(row.pub_date) }}
                </template>
            </el-table-column>
            <el-table-column label="状态" prop="state"></el-table-column>
            <el-table-column label="操作" width="100">
                <template #default="{ row }">
                    <el-button
                        :icon="Edit"
                        circle
                        plain
                        type="primary"
                        @click="onEditArticle(row)"
                    ></el-button>
                    <el-button
                        :icon="Delete"
                        circle 
                        plain
                        type="danger"
                        @click="onDelArticle(row, $index)"
                    ></el-button>
                </template>
            </el-table-column>
            <!-- 表格没有数据时空页面显示 -->
            <template #empty>
                <el-empty description="没有数据" />
            </template>
        </el-table>
        <!-- 分页条 -->
        <!-- page-sizes: 可选的一页条数
            background：背景颜色，true则蓝色
            layout:工具栏及其顺序 -->
        <el-pagination
        v-model:current-page="params.pagenum"
        v-model:page-size="params.pagesize"
        :page-sizes="[2, 3, 5, 10]"
        :background="true"
        layout="jumper, total, sizes, prev, pager, next" 
        :total="total"
        @size-change="onSizeChange"
        @current-change="onCurrentChange"
        />
        <!-- 添加抽屉 -->
        <article-edit ref="articleEditRef" @success="onSuccess"></article-edit>
    </page-container>
</template>

<style scoped>
.el-card{
    position: relative;
}

.el-select{
    width: 220px;
}
/* 固定分页条在卡片的底部 */
.el-pagination{
    position: absolute;
    bottom: 10px;
    right: 10px;
}
</style>
