import {
    Request
} from '@/api/services/http/request'

const url = {
    dataCount: '/api/Count/indexDataCount',
    companyList: '/api/Count/indexCompanyTop',
    draftsList: '/api/task/draftsTask',
    info: '/api/Taskpc/getMainTask',
    subList: "/api/Taskpc/getMainTaskIsSonList",
    personalList: '/api/Count/indexStaffTop',
    companyTaskItem: '/api/Count/getCompanyTask',
    personalTaskItem: '/api/Count/getStaffTask',
    roleUserAuthority: 'api/Role_manger/myPower',
    /*首页数据统计*/
    getMyTaskCount: '/api/count/myTaskCount',//获取我的任务统计
    getAllTaskCount: '/api/count/allUserCount',//获取全部任务统计
    getMyDepCount: '/api/count/myDepCount',//获取我的任务数统计
    getSeeMoreCount: 'api/count/seeMoreCount',//获取查看更多任务统计
    /*汇总排行榜*/
    rankList: '/api/count/rankList',//排行榜数据
    rankListMore: '/api/count/rankListMore',//排行榜数据
    rankListTask: '/api/count/rankUserlist',//排行榜数据
    rankListSeeMore: '/api/count/seeMoreCount',//排行榜数据
    allTask:'/api/count/taskAllList',//全部任务
    countDetail:'/api/count/countDetails',//数据统计详情
    peopleTask:'/api/count/countUdetails',//数据统计详情

    /*周月报*/
    summary: '/api/count/summary',//周/月报
}

class Statistics {
    service

    constructor(service) {
        this.service = service
    }

    // 获取统计数据
    async getStatisticsCount(data) {
        try {
            const optons = {
                url: url.dataCount,
                data
            }
            return await this.service.post(optons)
        } catch (error) {
            console.log(error);
            throw error
        }
    }

    // 获取公司排行列表
    async getCompanyList(data) {
        try {
            const optons = {
                url: url.companyList,
                data
            }
            return await this.service.post(optons)
        } catch (error) {
            console.log(error);
            throw error
        }
    }

    // 获取个人排行列表
    async getPersonalList(data) {
        try {
            const optons = {
                url: url.personalList,
                data
            }
            return await this.service.post(optons)
        } catch (error) {
            console.log(error);
            throw error
        }
    }

    // 获取公司逾期详情
    async getCompanyTaskItem(data) {
        try {
            const optons = {
                url: url.companyTaskItem,
                data
            }
            return await this.service.post(optons)
        } catch (error) {
            console.log(error);
            throw error
        }
    }

    // 获取个人逾期详情
    async getPersonalTaskItem(data) {
        try {
            const optons = {
                url: url.personalTaskItem,
                data
            }
            return await this.service.post(optons)
        } catch (error) {
            console.log(error);
            throw error
        }
    }

    // 获取权限
    async getUserAuthority() {
        try {
            const optons = {
                url: url.roleUserAuthority,
            }
            return await this.service.get(optons)
        } catch (error) {
            console.log(error);
            throw error
        }

    }

    // 获取我的任务统计
    async getMyTaskCount(data) {
        try {
            const optons = {
                url: url.getMyTaskCount,
                data
            }
            return await this.service.post(optons)
        } catch (error) {
            console.log(error);
            throw error
        }

    }

    // 获取我所在的部门任务统计
    async getMyDepCount(data) {
        try {
            const optons = {
                url: url.getMyDepCount,
                data
            }
            return await this.service.post(optons)
        } catch (error) {
            console.log(error);
            throw error
        }

    }

    // 获取所有任务统计
    async getAllTaskCount(data) {
        try {
            const optons = {
                url: url.getAllTaskCount,
                data
            }
            return await this.service.post(optons)
        } catch (error) {
            console.log(error);
            throw error
        }

    }

    // 获取首页查看更多任务统计
    async getSeeMoreCount(data) {
        try {
            const optons = {
                url: url.getSeeMoreCount,
                data
            }
            return await this.service.post(optons)
        } catch (error) {
            console.log(error);
            throw error
        }

    }

    //获取排行榜
    async getRankList(data) {
        try {
            const optons = {
                url: url.rankList,
                data
            }
            return await this.service.post(optons)
        } catch (error) {
            console.log(error);
            throw error
        }

    }

    //获取周、月报
    async summary(data) {
        try {
            const optons = {
                url: url.summary,
                data
            }
            return await this.service.post(optons)
        } catch (error) {
            console.log(error);
            throw error
        }

    }
    //获取排行榜查看更多
    async rankListMore(data) {
        try {
            const optons = {
                url: url.rankListMore,
                data
            }
            return await this.service.post(optons)
        } catch (error) {
            console.log(error);
            throw error
        }

    }
    //获取排行榜查看指定用户的任务
    async rankListTask(data) {
        try {
            const optons = {
                url: url.rankListTask,
                data
            }
            return await this.service.post(optons)
        } catch (error) {
            console.log(error);
            throw error
        }

    }

    //获取排行榜顶部数据统计
    async rankListSeeMore(data) {
        try {
            const optons = {
                url: url.rankListSeeMore,
                data
            }
            return await this.service.post(optons)
        } catch (error) {
            console.log(error);
            throw error
        }

    }
    //获取全部任务
    async allTask(data) {
        try {
            const optons = {
                url: url.allTask,
                data
            }
            return await this.service.post(optons)
        } catch (error) {
            console.log(error);
            throw error
        }

    }
    //获取数据统计详情
    async countDetail(data) {
        try {
            const optons = {
                url: url.countDetail,
                data
            }
            return await this.service.post(optons)
        } catch (error) {
            console.log(error);
            throw error
        }

    }
    //获取某个人的所有任务
    async peopleTask(data) {
        try {
            const optons = {
                url: url.peopleTask,
                data
            }
            return await this.service.post(optons)
        } catch (error) {
            console.log(error);
            throw error
        }

    }


}

const statistics = new Statistics(Request.getInstance())
export default statistics
