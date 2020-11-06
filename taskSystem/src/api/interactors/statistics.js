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
  roleUserAuthority: '/api/Role_manger/myPower',
  statis: "/api/count/seeMoreCount",
  statisTask: "/api/count/taskAllList",
  rankData: "/api/count/rankList",
  rankInfo:"/api/count/rankListMore",
  rankInfoList:"/api/count/rankUserlist",
  report: "/api/count/summary",
  taskCount: "/api/count/countDetails",//数据详情数
  countUdetails: "/api/count/countUdetails",//通过userId查询任务列表
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
  // 获取统计数据
  async getStatis(data) {
    try {
      const optons = {
        url: url.statis,
        data
      }
      return await this.service.post(optons)
    } catch (error) {
      console.log(error);
      throw error
    }
  }

  //获取统计所有任务
  async getStatisTask(data) {
    try {
      const optons = {
        url: url.statisTask,
        data
      }
      return await this.service.post(optons)
    } catch (error) {
      console.log(error);
      throw error
    }
  }
  //获取排行榜数据
  async getRankData(data) {
    try {
      const optons = {
        url: url.rankData,
        data
      }
      return await this.service.post(optons)
    } catch (error) {
      console.log(error);
      throw error
    }
  }
  //获取排行榜详情
  async getRankInfo(data) {
    try {
      const optons = {
        url: url.rankInfo,
        data
      }
      return await this.service.post(optons)
    } catch (error) {
      console.log(error);
      throw error
    }
  }
  //获取排行榜指定成员任务
  async getRankInfoList(data) {
    try {
      const optons = {
        url: url.rankInfoList,
        data
      }
      return await this.service.post(optons)
    } catch (error) {
      console.log(error);
      throw error
    }
  }
  //获取周报月报数据
  async getReportData(data) {
    try {
      const optons = {
        url: url.report,
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
//数据详情数
  async getCountDetails(data) {
    try {
      const optons = {
        url: url.taskCount,
        data
      }
      return await this.service.post(optons)
    } catch (error) {
      console.log(error);
      throw error
    }
  }
  //通过userId查询任务列表
  async getCountUserDetails(data) {
    try {
      const optons = {
        url: url.countUdetails,
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
