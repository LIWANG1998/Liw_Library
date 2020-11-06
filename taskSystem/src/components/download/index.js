import Vue from 'vue'
import download from './index.vue'

let newInstance = null

//将vue组件变为构造函数
let DownloadConstructor = Vue.extend(download)

let init = (options)=>{
    //实例化组件
    newInstance = new DownloadConstructor()
   //合并配置选项
    Object.assign(newInstance,options)
   //使用$mount()后  可以理解为创建虚拟的dom
    document.body.appendChild(newInstance.$mount().$el)
}
let caller = (options)=>{
    //options 为调用组件方法时传入的配置选项
    if(!newInstance){
        init(options)
    }
    return newInstance.show(vm =>{newInstance = null})
}
export default {
    install(vue){
        vue.prototype.$download = caller
    }
}