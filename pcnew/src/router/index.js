// 路由配置
import Vue from 'vue'
import VueRouter from 'vue-router'
import { checkDev } from '@/assets/js/dev';
Vue.use(VueRouter);
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}
var router = new VueRouter({
    routes: [
        { path: '/', redirect: '/home' },// 重定向
        { path: '/login', name: 'login', meta: { title: '登录' }, component: () => import('@/view/login.vue') },// 登录
        // 首页
        {
            path: '/home', name: 'home', meta: { title: '轻松任务' }, component: () => import('@/view/home.vue'),
            redirect: "/homePage",
            children: [
                /*导航菜单*/
                { path: '/homePage', meta: { title: '轻松任务-首页', tag: "home" }, component: () => import('@/view/homePage.vue') },//首页-报表
                { path: '/labelManage', meta: { title: '轻松任务-标签管理', tag: "home" }, component: () => import('@/view/labelManage.vue') },//标签管理
                { path: '/taskList/executing', meta: { title: '轻松任务-执行中', tag: "execute" }, component: () => import('@/view/taskList/executing.vue') },//执行中
                { path: '/taskList/finished', meta: { title: '轻松任务-已结束', tag: "finish" }, component: () => import('@/view/taskList/finished.vue') },//已结束
                { path: '/taskDetail/addTask', meta: { title: '轻松任务-发起任务', tag: "add" }, component: () => import('@/view/taskDetail/addTask.vue') },//添加任务
                { path: '/taskList/drafts', meta: { title: '轻松任务-草稿箱', tag: "draft" }, component: () => import('@/view/taskList/drafts.vue') },//草稿箱
                { path: '/taskList/recycleBin', meta: { title: '轻松任务-回收站', tag: "home" }, component: () => import('@/view/taskList/recycleBin.vue') },//回收站
                /*后台管理*/
                { path: '/backManage/depart', meta: { title: '轻松任务-通讯录', tag: "home", requireAuth: true }, component: () => import('@/view/backManage/depart.vue') },//通讯录
                { path: '/backManage/interface', meta: { title: '轻松任务-接口管理', tag: "home", requireAuth: true }, component: () => import('@/view/backManage/interface.vue') },//接口管理
                { path: '/backManage/role', meta: { title: '轻松任务-权限管理', tag: "home", requireAuth: true }, component: () => import('@/view/backManage/role.vue') },//角色管理
                { path: '/backManage/encourageWords', meta: { title: '轻松任务-激励语管理', tag: "home", requireAuth: true }, component: () => import('@/view/backManage/encourageWords.vue') },//激励语管理
                { path: '/backManage/setRole', meta: { title: '轻松任务-角色权限', tag: "home" }, component: () => import('@/view/backManage/setRole.vue') },//角色权限
              /*数据统计*/
                { path: '/dataSta/rankingList', meta: { title: '轻松任务-汇总排行榜', tag: "statis" }, component: () => import('@/view/dataSta/rankingList.vue') },//汇总排行榜
                { path: '/taskList/allTask', meta: { title: '轻松任务-全部任务', tag: "allTask" }, component: () => import('@/view/taskList/allTask.vue') },//所有任务
                { path: '/dataSta/monthlyReport', meta: { title: '轻松任务-周/月报历史', tag: "report" }, component: () => import('@/view/dataSta/monthlyReport.vue') },//周/月报历史
                { path: '/dataSta/rankDetail', meta: { title: '轻松任务-汇总排行榜详情', tag: "chartInfo" }, component: () => import('@/view/dataSta/rankDetail.vue') },//汇总排行榜详情
                { path: '/dataSta/rankTaskDetail', meta: { title: '轻松任务-人员任务列表', tag: "chartInfoList" }, component: () => import('@/view/dataSta/rankTaskDetail.vue') },//轻松任务-人员任务列表
                { path: '/dataSta/taskCountPeople', meta: { title: '轻松任务-数据详情', tag: "chartInfoList" }, component: () => import('@/view/dataSta/taskCountPeople.vue') },//数据统计人员详情
                { path: '/dataSta/taskCountTask', meta: { title: '轻松任务-数据详情', tag: "chartInfoList" }, component: () => import('@/view/dataSta/taskCountTask.vue') },//数据统计任务详情
                /*任务详情*/
                { path: '/taskDetail/taskDetail', meta: { title: '轻松任务-任务详情', tag: "info" }, component: () => import('@/view/taskDetail/taskDetail') },//任务详情
                { path: '/taskDetail/editTask', meta: { title: '轻松任务-编辑任务', tag: "edit" }, component: () => import('@/view/taskDetail/editTask') },//编辑任务
                { path: '/taskDetail/seeTaskFile', meta: { title: '轻松任务-查看任务文件', tag: 'info' }, component: () => import('@/view/taskDetail/seeTaskFile') },//编辑任务
                /*子任务*/
                { path: '/taskDetail/addSubTask', meta: { title: '轻松任务-新增子任务', tag: 'add' }, component: () => import('@/view/taskDetail/addSubTask') },//新增子任务
                { path: '/taskDetail/editSubTask', meta: { title: '轻松任务-编辑子任务', tag: 'add' }, component: () => import('@/view/taskDetail/editSubTask') },//新增子任务
                { path: '/taskDetail/subTaskDetail', meta: { title: '轻松任务-子任务详情', tag: 'info' }, component: () => import('@/view/taskDetail/subTaskDetail') },//子任务详情
                //关于轻松任务
                { path: '/homePage/taskUs', meta: { title: '轻松任务-关于轻松任务', tag: 'about' }, component: () => import('@/view/aboutUs') },//新增子任务



            ]
        },
        //
        { path: '/dataSta/dataScreen', meta: { title: '轻松任务-数据大屏', tag: 'home', requireAuth: true }, component: () => import('@/view/dataSta/dataScreen.vue') },//数据大屏


    ]
});
router.beforeEach((to, from, next) => {
    checkDev(to.meta.tag, to.query);
    // console.log(to, from)
    next()
    // const {
    //   is_initiate,
    //   type,
    //   is_super_admin,
    //   is_system
    // } = {};
    // // 关闭提示 loading动画
    // if (to.meta.keepAlive === false) {
    //   // 页面没缓存 滚动到页面顶部
    //   let vue = new Vue();
    //   vue.$nextTick(() => {
    //     document.documentElement.scrollTop = document.body.scrollTop = 0;
    //   });
    // }
    // // 判断当前是pc还是移动端
    // document.title = to.meta.title || "任务管理系统";
    // if ((to.meta.requireAuth && to.meta.type == "add" && (is_initiate == 0 || is_super_admin == 1 || is_system == 3)) || (to.meta.requireAuth && to.meta.type == "statistics" && type == 0)) {
    //   Dialog.alert({
    //     title: "提示",
    //     message: "暂无权限访问该页面，请联系管理员设置权限",
    //     confirmButtonColor: "#467db9",
    //     confirmButtonText: "返回首页"
    //   })
    //     .then(() => {
    //       next("/");
    //     })
    // } else {
    //   next();
    // }

});
export default router
