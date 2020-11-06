import {
  Request
} from '@/api/services/http/request'
const url = {
  nodeInit: "/api/common/getNodeInit",
  nodeChild: "/api/common/getNodeChild",
  nodeSearch: "/api/common/getNodeSearch",
  user: "/api/common/getUserList",
  tags: "/api/Tags/getTagsList",
  tagsUser: "/api/Tags/getTags",
  tagsAdd: "/api/Tags/addTagPeopleNum",
  userInfo: "/api/index/get_userinfo",
  remind: "/api/task/remindModel",
  upload: "/api/task/fileUpload",
  delFile: "/api/Task/deletelFile",
  signature:"/api/jsapi/getSignature",
  cloudFileList:"/api/Disk/getDirAndFiles",
  cloudFileUpload:"/api/Disk/uploadFiles",
  previewPdf:"/api/File_Converter/fileTpdf",
  delPdf:"/api/File_Converter/delFile",
  downLoadRemoteImg:"/api/File_Converter/downImgRar",
  qiniuToken:"/api/upload/getQnToken",
  appTime:"/api/index/isOverdue",
  notice:"/auto/taskmsg/get_list",
  sendToQywx:"/api/File_Converter/sendToQywx",
}

class Common {
  service
  constructor(service) {
    this.service = service
  }
  // 获取部门信息
  async getDepartNodeInit(params) {
    try {
      const optons = {
        url: url.nodeInit,
        params
      }
      return await this.service.get(optons)
    } catch (error) {
      console.log(error);
      throw error
    }
  }
  // 获取子部门及其成员
  async getDepartNodeChild(params) {
    try {
      const optons = {
        url: url.nodeChild,
        params
      }
      return await this.service.get(optons)
    } catch (error) {
      console.log(error);
      throw error
    }
  }
  // 获取子部门及其成员
  async getUserSearch(params) {
    try {
      const optons = {
        url: url.nodeSearch,
        params
      }
      return await this.service.get(optons)
    } catch (error) {
      console.log(error);
      throw error
    }
  }
  // 获取用户
  async getUserList(params) {
    try {
      const optons = {
        url: url.user,
        params
      }
      return await this.service.post(optons)
    } catch (error) {
      console.log(error);
      throw error
    }
  }
  //获取标签
  async getTags(data) {
    try {
      const optons = {
        url: url.tags,
        data
      }
      return await this.service.post(optons)
    } catch (error) {
      console.log(error);
      throw error
    }
  }

  //获取标签内用户
  async getTagsUser(data) {
    try {
      const optons = {
        url: url.tagsUser,
        data
      }
      return await this.service.post(optons)
    } catch (error) {
      console.log(error);
      throw error
    }
  }
  //添加标签
  async addTags(data) {
    try {
      const optons = {
        url: url.tagsAdd,
        data
      }
      return await this.service.post(optons)
    } catch (error) {
      console.log(error);
      throw error
    }
  }
  //获取用户信息
  async getUserInfo() {
    try {
      const optons = {
        url: url.userInfo
      }
      return await this.service.get(optons)
    } catch (error) {
      console.log(error);
      throw error
    }
  }
  //获取用户信息
  async getSignature(params) {
    try {
      const optons = {
        url: url.signature,
        params
      }
      return await this.service.get(optons)
    } catch (error) {
      console.log(error);
      throw error
    }
  }
  // 获取提醒模式
  async getRemind() {
    try {
      const optons = {
        url: url.remind
      }
      return await this.service.get(optons)
    } catch (error) {
      console.log(error);
      throw error
    }
  }
  // 上传文件
  async upload(data) {
    try {
      const optons = {
        url: url.upload,
        data
      }
      return await this.service.post(optons)
    } catch (error) {
      console.log(error);
      throw error
    }
  }
  // 上传文件
  async cloudFileList(data) {
    try {
      const optons = {
        url: url.cloudFileList,
        data
      }
      return await this.service.post(optons)
    } catch (error) {
      console.log(error);
      throw error
    }
  }
  // 上传文件
  async cloudFileUpload(data) {
    try {
      const optons = {
        url: url.cloudFileUpload,
        data
      }
      return await this.service.post(optons)
    } catch (error) {
      console.log(error);
      throw error
    }
  }
  // 预览文件
  async previewPdf(data) {
    try {
      const optons = {
        url: url.previewPdf,
        data
      }
      return await this.service.post(optons)
    } catch (error) {
      console.log(error);
      throw error
    }
  }
  async delPdf(data) {
    try {
      const optons = {
        url: url.delPdf,
        data
      }
      return await this.service.post(optons)
    } catch (error) {
      console.log(error);
      throw error
    }
  }
  // 删除文件
  async delFile(data) {
    try {
      const optons = {
        url: url.delFile,
        data
      }
      return await this.service.post(optons)
    } catch (error) {
      console.log(error);
      throw error
    }
  }
  // 删除文件
  async downLoadRemoteImg(data) {
    try {
      const optons = {
        url: url.downLoadRemoteImg,
        data
      }
      return await this.service.post(optons)
    } catch (error) {
      console.log(error);
      throw error
    }
  }
  // 删除文件
  async qiniuToken(data) {
    try {
      const optons = {
        url: url.qiniuToken,
        data
      }
      return await this.service.post(optons)
    } catch (error) {
      console.log(error);
      throw error
    }
  }
  // 获取通知
  async getNotice(data) {
    try {
      const optons = {
        url: url.notice,
        data
      }
      return await this.service.post(optons)
    } catch (error) {
      console.log(error);
      throw error
    }
  }
  // 获取过期时间
  async getAppTime() {
    try {
      const optons = {
        url: url.appTime
      }
      return await this.service.get(optons)
    } catch (error) {
      console.log(error);
      throw error
    }
  }
  // 下载附件
  async downloadFile(data) {
    try {
      const optons = {
        url: url.sendToQywx,
        data
      }
      return await this.service.post(optons)
    } catch (error) {
      console.log(error);
      throw error
    }
  }
}

const common = new Common(Request.getInstance())
export default common
