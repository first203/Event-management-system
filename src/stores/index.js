import { createPinia } from 'pinia'
import persist from 'pinia-plugin-persistedstate' //导入pinia持久化插件

const pinia=createPinia()
pinia.use(persist)

export default pinia

export * from './modules/user'  //导出modules中的user库以让App.vue导入