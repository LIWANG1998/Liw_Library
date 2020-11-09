import {
  Request
} from '@/api/services/http/request'
const url = {
  add: '/api/Taskpc/addTask', //添加任务
  edit: '/api/Taskpc/addTask', //编辑任务
  editData: '/api/Taskpc/getMainTask', //编辑任务
  list: '/api/Taskpc/getAllTaskList', //获取任务列表
  info: '/api/Taskpc/getMainTaskData', //获取任务信息
  complete: "/api//Taskpc/changeTaskState", //修改任务状态--完成任务
  del: "/api/Taskpc/deleteMainTask", //删除任务 --取消任务
  progressList: "/api/Taskpc/getMainTaskAllFinish", //获取任务进度
  progressInfo: "/api/Taskpc/getCompletionAmount", //获取任务进度信息
  updateProgress: "/api/Taskpc/editCompletionAmount", //获取任务进度信息
  subList: "/api/Taskpc/getMainTaskIsSonList", //获取子任务列表
  subListById:'/api/Taskpc/getSonTask',//通过id获取子任务
  addSub: "/api/Taskpc/addSonTask", //添加子任务
  editSub: "/api/Taskpc/editSonTask", //编辑子任务
  infoSub:"/api/Taskpc/getSonTaskData",
  delSub: "/api/Taskpc/deleteSonTask", //删除子任务
  remindUser: "/api/common/urgeUser", //获取催办人员
  remind: "/api/taskpc/sendUrge", //催办
  transfer: "/api/Deliver/deliver", //转办任务
  taskFile: "/api/Taskpc/getAllTaskFile", //查看任务文件
  downloadMoreFile:'/api/file_converter/downloadZip',//任务文件批量下载
}

class Task {
  service
  constructor(service) {
    this.service = service
  }
  // 获取任务列表
  async list(data) {
    try {
      const optons = {
        url: url.list,
        data
      }
      return await this.service.post(optons)
    } catch (error) {
      console.log(error);
      throw error
    }
  }
  // 新建任务
  async add(data) {
    try {
      const optons = {
        url: url.add,
        data
      }
      return await this.service.post(optons)
    } catch (error) {
      console.log(error);
      throw error
    }
  }
  // 删除任务
  async edit(data) {
    try {
      const optons = {
        url: url.edit,
        data
      }
      return await this.service.post(optons)
    } catch (error) {
      console.log(error);
      throw error
    }
  }
  // 获取编辑数据
  async editData(data) {
    try {
      const optons = {
        url: url.editData,
        data
      }
      return await this.service.post(optons)
    } catch (error) {
      console.log(error);
      throw error
    }
  }
  // 删除任务
  async del(data) {
    try {
      const optons = {
        url: url.del,
        data
      }
      return await this.service.post(optons)
    } catch (error) {
      console.log(error);
      throw error
    }
  }
  // 完成任务
  async complete(data) {
    try {
      const optons = {
        url: url.complete,
        data
      }
      return await this.service.post(optons)
    } catch (error) {
      console.log(error);
      throw error
    }
  }
  // 获取任务信息
  async getInfo(data) {
    try {
      const optons = {
        url: url.info,
        data
      }
      return await this.service.post(optons)
    } catch (error) {
      console.log(error);
      throw error
    }
  }
  // 获取进度列表
  async getProgressList(data) {
    try {
      const optons = {
        url: url.progressList,
        data
      }
      return await this.service.post(optons)
    } catch (error) {
      console.log(error);
      throw error
    }
  }
  // 获取进度详情
  async getProgressInfo(data) {
    try {
      const optons = {
        url: url.progressInfo,
        data
      }
      return await this.service.post(optons)
    } catch (error) {
      console.log(error);
      throw error
    }
  }
  // 更新进度
  async updateProgress(data) {
    try {
      const optons = {
        url: url.updateProgress,
        data
      }
      return await this.service.post(optons)
    } catch (error) {
      console.log(error);
      throw error
    }
  }
//查看任务文件
  async getFileTask(data) {
    try {
      const optons = {
        url: url.taskFile,
        data
      }
      return await this.service.post(optons)
    } catch (error) {
      console.log(error);
      throw error
    }
  }
  //任务文件批量下载
  async downLoadMoreFile(data) {
    try {
      const optons = {
        url: url.downloadMoreFile,
        data
      }
      return await this.service.post(optons)
    } catch (error) {
      console.log(error);
      throw error
    }
  }

  // 获取子任务列表
  async getSubList(data) {
    try {
      const optons = {
        url: url.subList,
        data
      }
      return await this.service.post(optons)
    } catch (error) {
      console.log(error);
      throw error
    }
  }
  // 获取子任务信息
  async getSubInfo(data){
    try {
      const optons = {
        url: url.infoSub,
        data
      }
      return await this.service.post(optons)
    } catch (error) {
      console.log(error);
      throw error
    }
  }
  //通过id获取子任务 subListById
  async getSubInfoById(data){
    try {
      const optons = {
        url: url.subListById,
        data
      }
      return await this.service.post(optons)
    } catch (error) {
      console.log(error);
      throw error
    }
  }
  // 新建子任务
  async addSub(data) {
    console.log(data, 'data');
    try {
      const optons = {
        url: url.addSub,
        data
      }
      return await this.service.post(optons)
    } catch (error) {
      console.log(error);
      throw error
    }
  }
  // 编辑子任务
  async editSub(data) {
    try {
      const optons = {
        url: url.editSub,
        data
      }
      return await this.service.post(optons)
    } catch (error) {
      console.log(error);
      throw error
    }
  }
  // 删除子任务
  async delSub(data) {
    try {
      const optons = {
        url: url.delSub,
        data
      }
      return await this.service.post(optons)
    } catch (error) {
      console.log(error);
      throw error
    }
  }
  // 获取催办人员
  async getRemindUser(data) {
    try {
      const optons = {
        url: url.remindUser,
        data
      }
      return await this.service.post(optons)
    } catch (error) {
      console.log(error);
      throw error
    }
  }
  // 催办
  async remind(data) {
    try {
      const optons = {
        url: url.remind,
        data
      }
      return await this.service.post(optons)
    } catch (error) {
      console.log(error);
      throw error
    }
  }
  // 转办任务
  async transfer(data) {
    try {
      const optons = {
        url: url.transfer,
        data
      }
      return await this.service.post(optons)
    } catch (error) {
      console.log(error);
      throw error
    }
  }
}

const task = new Task(Request.getInstance());
export default task
