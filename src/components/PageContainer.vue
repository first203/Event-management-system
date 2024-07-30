<!-- 封装基本的文章页面架子 -->

<script setup>
    defineProps({
        title:{
            require: true,
            type: String
        }
    })
</script>

<template>
    <el-card class="page_container">
        <template #header>
            <div class="card-header">
                <span>{{ title }}</span>
                <div>
                    <!-- 具名插槽 -->
                    <slot name="extra"></slot>
                </div>
            </div>
        </template>
        <!-- 默认插槽 -->
        <slot></slot>
    </el-card>
</template>

<style scoped>
.page_container{
    height: 100%;
    box-sizing: border-box;
    .card-header{
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
}

</style>