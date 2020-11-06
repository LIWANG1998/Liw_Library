import Vue from "vue";
import Router from 'vue-router';
import store from '@/store';
import {
  checkPc
} from "@/utils/dev";
import {
  Dialog
} from "vant";
Vue.use(Router);

const router = new Router({
  mode: "hash",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      redirect: "/index"
    },
    {
      path: "*",
      redirect: "/index"
    },
    {
      path: "/info",
      name: "info",
      meta: {
        title: "任务详情",
        // requireAuth: true
        tag:"info"
      },
      component: () => import( /* webpackChunkName: "info" */ "@/views/task/info.vue"),
    },
    {
      path: "/notice",
      name: "notice",
      meta: {
        title: "消息通知",
        tag:"home"
        // requireAuth: true
      },
      component: () => import( /* webpackChunkName: "info" */ "@/views/my/notice/index.vue"),
    },
    {
      path: "/notice/info/:id",
      name: "noticeInfo",
      meta: {
        title: "消息通知",
        tag:"home"
        // requireAuth: true
      },
      component: () => import( /* webpackChunkName: "info" */ "@/views/my/notice/info.vue"),
    },
    {
      path: "/about",
      name: "about",
      meta: {
        title: "关于轻松任务",
        tag:"about"
        // requireAuth: true
      },
      component: () => import( /* webpackChunkName: "info" */ "@/views/my/about/index.vue"),
    },
    {
      path: "/updateLog",
      name: "updateLog",
      meta: {
        title: "关于轻松任务",
        // requireAuth: true
      },
      component: () => import( /* webpackChunkName: "info" */ "@/views/my/about/updateLog.vue"),
    },
    {
      path: "/course",
      name: "course",
      meta: {
        title: "操作流程",
        // requireAuth: true
      },
      component: () => import( /* webpackChunkName: "info" */ "@/views/my/about/course.vue"),
    },
    {
      path: "/contact",
      name: "contact",
      meta: {
        title: "联系客服",
        tag:"about"
        // requireAuth: true
      },
      component: () => import( /* webpackChunkName: "info" */ "@/views/my/contact.vue"),
    },
    {
      path: "/statistics",
      name: "statistics",
      meta: {
        title: "任务统计",
        tag:"statis"
        // requireAuth: true
      },
      component: () => import( /* webpackChunkName: "infoList" */ "@/views/statistics/index.vue"),
    },
    {
      path: "/report",
      name: "report",
      meta: {
        title: "任务报表历史",
        tag:"report"
        // requireAuth: true
      },
      component: () => import( /* webpackChunkName: "infoList" */ "@/views/report/index.vue"),
    },
    {
      path: "/my/taskList",
      name: "myTaskList",
      meta: {
        title: "任务总数",
        tag:"allTask"
        // requireAuth: true
      },
      component: () => import( /* webpackChunkName: "infoList" */ "@/views/statistics/my/taskList.vue"),
    },
    {
      path: "/statistics/chart",
      name: "overdueRank",
      meta: {
        title: "排行榜",
        type: "statistics",
        tag:"statistics"
      },
      hide: true,
      component: () =>
        import(
          /* webpackChunkName: "chart" */
          "@/views/statistics/chart/chart.vue"
        )
    },
    {
      path: "/statistics/chart/info",
      name: "overdueRank",
      meta: {
        title: "排行榜详情",
        type: "statistics",
        tag:"chartInfo"
      },
      hide: true,
      component: () =>
        import(
          /* webpackChunkName: "chart" */
          "@/views/statistics/chart/info.vue"
        )
    },
    {
      path: "/statistics/chart/infoList",
      name: "overdueRank",
      meta: {
        title: "排行榜详情",
        type: "statistics",
        tag:"chartInfoList"
      },
      hide: true,
      component: () =>
        import(
          /* webpackChunkName: "chart" */
          "@/views/statistics/chart/infoList.vue"
        )
    },
    {
      path: "/statistics/overdueList",
      name: "overdueList",
      meta: {
        // title: "逾期公司排行榜",
        type: "statistics",
        tag:"statistics"
      },
      hide: true,
      component: () =>
        import(
          /* webpackChunkName: "overdueList" */
          "@/views/statistics/overdueList.vue"
        )
    },

    {
      path: "/statistics/overdueItem",
      name: "overdueItem",
      meta: {
        title: "逾期详情",
        type: "statistics",
        tag:"statistics"
      },
      hide: true,
      component: () =>
        import(
          /* webpackChunkName: "overdueItem" */
          "@/views/statistics/overdueItem.vue"
        )
    },
    {
      path: "/add",
      name: "add",
      meta: {
        title: "发起任务",
        requireAuth: true,
        type: "add",
        tag:"add"
      },
      component: () => import( /* webpackChunkName: "taskAdd" */ "@/views/task/add.vue"),
    },
    {
      path: "/countList",
      name: "countList",
      meta: {
        title: "数据详情",
        tag:"countList",
      },
      component: () => import( /* webpackChunkName: "statistics" */ "@/views/statistics/count/countList.vue"),
    },
    {
      path: "/taskUserList",
      name: "taskUserList",
      meta: {
        title: "数据详情",
        tag:"taskUserList",
      },
      component: () => import( /* webpackChunkName: "statistics" */ "@/views/statistics/count/taskUserList.vue"),
    },
    {
      path: "/edit",
      name: "edit",
      meta: {
        title: "编辑任务",
        tag:"edit",
        // requireAuth: true
      },
      component: () => import( /* webpackChunkName: "task" */ "@/views/task/add.vue"),
    },
    {
      path: "/index",
      name: "index",
      redirect: '/execute',
      component: () => import("@/views/index.vue"),
      children: [
        {
          path: "/execute",
          name: "execute",
          meta: {
            title: "执行中",
            tag:"execute",
          },
          component: () => import( /* webpackChunkName: "execute" */ "@/views/task/execute.vue"),
        },
        {
          path: "/finish",
          name: "finish",
          meta: {
            title: "已结束",
            tag:"finish",
          },
          component: () => import( /* webpackChunkName: "finish" */ "@/views/task/finish.vue"),
        },
        {
          path: "/draft",
          name: "draft",
          meta: {
            title: "草稿箱",
            tag:"draft",
          },
          component: () => import( /* webpackChunkName: "draft" */ "@/views/task/draft.vue"),
        },
        {
          path: "/my",
          name: "my",
          meta: {
            title: "个人中心",
            tag:"home",
          },
          component: () => import( /* webpackChunkName: "statistics" */ "@/views/my/index.vue"),
        },
      ]
    }
  ]
})

// 获取用户权限
router.beforeEach((to, from, next) => {
  const {
    is_initiate,
    type,
    is_super_admin,
    is_system
  } = store.getters.power;
  // 关闭提示 loading动画
  if (to.meta.keepAlive === false) {
    // 页面没缓存 滚动到页面顶部
    let vue = new Vue();
    vue.$nextTick(() => {
      document.documentElement.scrollTop = document.body.scrollTop = 0;
    });
  }
  // 判断当前是pc还是移动端
  checkPc(to.meta.tag, to.query);
  document.title = to.meta.title || "任务管理系统";
  if ((to.meta.requireAuth && to.meta.type == "add" && (is_initiate == 0 || is_super_admin == 1 || is_system == 3)) || (to.meta.requireAuth && to.meta.type == "statistics" && type == 0)) {
    Dialog.alert({
      title: "提示",
      message: "暂无权限访问该页面，请联系管理员设置权限",
      confirmButtonColor: "#467db9",
      confirmButtonText: "返回首页"
    })
      .then(() => {
        next("/");
      })
  } else {
    next();
  }

});

export default router;
