//报事报修子目录
const repairPage = () => import('views/repair/page/repairPage.vue')
const repairAdd = () => import('views/repair/repairadd/repairAdd.vue')
const repairInfo = () => import('views/repair/repairinfo/repairInfo')
const repairHandle = () => import('views/repair/repairhandle/repairHandle')


const children = [
    {
        path: '',
        name: 'repairPage',
        component: repairPage    //报事报修首页
    },
    {
        path: 'repair-add',
        name: 'repair-add',
        component: repairAdd    //报事报修添加
    },
    {
        path: 'repair-info',
        name: 'repair-info',
        component: repairInfo    //报事报修查看详情
    },
    {
        path: 'repair-handle',
        name: 'repair-handle ',
        component: repairHandle    //报事报修立即处理

    }

]

export default children