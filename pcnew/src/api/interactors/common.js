import {
  Request
} from '@/api/services/http/request'
const url = {
  nodeInit: "/api/common/getNodeInit",
  nodeChild: "/api/common/getNodeChild",
  nodeSearch: "/api/common/getNodeSearch",
  user: "/api/common/getUserList",
  tags: "/api/Tags/getTagsList",//获取标签列表
  tagsUser: "/api/Tags/getTags",//查看 修改标签
  tagsAdd: "/api/Tags/addTagPeopleNum",//添加标签
  tagsDel: '/api//Tags/deleteTags',//删除标签
  userInfo: "/api/index/get_userinfo",
  remind: "/api/task/remindModel",
  upload: "/api/task/fileUpload",
  delFile: "/api/Task/deletelFile",
  signature: "/api/jsapi/getSignature",
  cloudFileList: "/api/Disk/getDirAndFiles",
  cloudFileUpload: "/api/Disk/uploadFiles",
  previewPdf: "/api/File_Converter/fileTpdf",
  delPdf: "/api/File_Converter/delFile",
  downLoadRemoteImg: "/api/File_Converter/downImgRar",
  appTime: "/api/index/isOverdue",
  loginIn: "/structure/login/do_login",//登陆
  getCompany: '/structure/login/companyList',//获取企业
  getLoginErCode: '/structure/login/login_type',//获取登陆二维码
  qiNiuUrl: 'https://upload-z2.qiniup.com/',//七牛云上传
  getQNToken: '/api/upload/getQnToken',//获取七牛云token
  getLogo: '/api/Logo/getMyLogo',//获取企业logo
  setLogo: '/api/Logo/setMyLogo',//设置企业logo
  exitLogin: '/structure/login/logout',//退出登陆
  departList: '/structure/Query/depList',
  userList: '/structure/Query/userList',
  syncDepart: "/structure/api/sync",
  getAllRole: "/api/Role_manger/getAllRoleList",
  setRole: "/api/Role_manger/setRole",
  getSecret: "/api/user/sync",
  sync: "/api/User/sync",
  taskmsg: "/auto/taskmsg/get_list",
  isOverdue: "/api/index/isOverdue",//到期时间
};

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
  //删除标签
  async delTags(data) {
    try {
      const optons = {
        url: url.tagsDel,
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
  //登录
  async loginIn(data) {
    try {
      const optons = {
        url: url.loginIn,
        data
      }
      return await this.service.post(optons)
    } catch (error) {
      console.log(error);
      throw error
    }
  }
  //登录获取组织架构
  async getCompany(data) {
    try {
      const optons = {
        url: url.getCompany,
        data
      }
      return await this.service.post(optons)
    } catch (error) {
      console.log(error);
      throw error
    }
  }
  //获取登陆二维码
  async getLoginErCode(data) {
    try {
      const optons = {
        url: url.getLoginErCode,
        data
      }
      return await this.service.post(optons)
    } catch (error) {
      console.log(error);
      throw error
    }
  }
  //上传文件到七牛云
  async uploadQN(data) {
    try {
      const optons = {
        url: url.qiNiuUrl,
        data
      }
      return await this.service.post(optons)
    } catch (error) {
      console.log(error);
      throw error
    }
  }
  //获取七牛云token
  async getQNToken(data) {
    try {
      const optons = {
        url: url.getQNToken,
        data
      };
      return await this.service.post(optons)
    } catch (error) {
      console.log(error);
      throw error
    }
  }
  //获取logo
  async getLogo(data) {
    try {
      const optons = {
        url: url.getLogo,
        data
      };
      return await this.service.post(optons)
    } catch (error) {
      console.log(error);
      throw error
    }
  }
  //设置logo
  async setLogo(data) {
    try {
      const optons = {
        url: url.setLogo,
        data
      };
      return await this.service.post(optons)
    } catch (error) {
      console.log(error);
      throw error
    }
  }
  //退出登录
  async exitLogin(data) {
    try {
      const optons = {
        url: url.exitLogin,
        data
      };
      return await this.service.post(optons)
    } catch (error) {
      console.log(error);
      throw error
    }
  }
  //获取部门
  async getDepart(params) {
    try {
      const optons = {
        url: url.departList,
        params
      };
      return await this.service.get(optons)
    } catch (error) {
      console.log(error);
      throw error
    }
  }
  //获取通讯录用户
  async getUsers(params) {
    try {
      const optons = {
        url: url.userList,
        params
      };
      return await this.service.get(optons)
    } catch (error) {
      console.log(error);
      throw error
    }
  }
  //获取所有显示角色
  async getAllRole(params) {
    try {
      const optons = {
        url: url.getAllRole,
        params
      };
      return await this.service.get(optons)
    } catch (error) {
      console.log(error);
      throw error
    }
  }
  //设置角色
  async setRole(data) {
    try {
      const optons = {
        url: url.setRole,
        data
      };
      return await this.service.post(optons)
    } catch (error) {
      console.log(error);
      throw error
    }
  }
  //获取通讯录secret
  async getSecret() {
    try {
      const optons = {
        url: url.getSecret,
      };
      return await this.service.get(optons)
    } catch (error) {
      console.log(error);
      throw error
    }
  }

  //同步数据
  async syncData(data) {
    try {
      const optons = {
        url: url.sync,
        data
      };
      return await this.service.post(optons)
    } catch (error) {
      console.log(error);
      throw error
    }
  }
  //同步数据
  async getTaskmsgList(data) {
    try {
      const optons = {
        url: url.taskmsg,
        data
      };
      return await this.service.post(optons)
    } catch (error) {
      console.log(error);
      throw error
    }
  }
  //到期时间isOverdue
  async getOverdue(data) {
    try {
      const optons = {
        url: url.isOverdue,
        data
      };
      return await this.service.post(optons)
    } catch (error) {
      console.log(error);
      throw error
    }
  }
}

const common = new Common(Request.getInstance())
export default common
