import {
    Request
} from '@/api/services/http/request'
const url = {
    /*角色管理*/
    getRole:'/api/Role_manger/getRoleList',//获取角色
    addRole:'/api/Role_manger/addRole',//新增角色
    changeRoleState:'/api/Role_manger/changeRoleState',//改变角色状态
    editRole:'/api/Role_manger/editRole',//编辑角色,
    delRole:'/api//Role_manger/deleteRole',//删除角色
    getPower:'/api/Role_manger/getRole',//获取角色权限
    /*接口管理*/
    getInterFace:'/api/Face/getFaceList',//获取接口
    editInterFace:'/api/Face/editFace',//编辑接口
    addInterFace:'/api/Face/addFace',//新增接口
    stopInterFace:'/api/Face/changeFaceState',//停用接口
    delInterFace:'/api/Face/deleteFace',//删除接口
    getOneInterface:'/api/Face/getFace',//获取单个接口
    /*激励语管理*/
    getEncourage:'/auto/Excitation/get_list',//获取激励语列表
    randomEncourage:'/auto/Excitation/show_excitation',//随机抽取一条激励语
    addEncourage:'/auto/Excitation/create_excitation',//新增激励语
    delEncourage:'/auto/Excitation/del_excitation',//删除激励语
    editEncourage:'/auto/Excitation/edit_excitation'//编辑激励语

};
class BackManage {
    service;
    constructor(service) {
        this.service = service
    }
    /*---------------角色管理---------------------*/
    //获取角色
    async getRole(data) {
        try {
            const optons = {
                url: url.getRole,
                data
            };
            return await this.service.post(optons)
        } catch (error) {
            console.log(error);
            throw error
        }
    }
    //新增角色
    async addRole(data) {
        try {
            const optons = {
                url: url.addRole,
                data
            };
            return await this.service.post(optons)
        } catch (error) {
            console.log(error);
            throw error
        }
    }
    //编辑角色
    async editRole(data) {
        try {
            const optons = {
                url: url.editRole,
                data
            };
            return await this.service.post(optons)
        } catch (error) {
            console.log(error);
            throw error
        }
    }
    //改变角色状态
    async changeRoleState(data) {
        try {
            const optons = {
                url: url.changeRoleState,
                data
            };
            return await this.service.post(optons)
        } catch (error) {
            console.log(error);
            throw error
        }
    }
    //删除
    async delRole(data) {
        try {
            const optons = {
                url: url.delRole,
                data
            };
            return await this.service.post(optons)
        } catch (error) {
            console.log(error);
            throw error
        }
    }
    //获取角色权限
    async getPower(data) {
        try {
            const optons = {
                url: url.getPower,
                data
            };
            return await this.service.post(optons)
        } catch (error) {
            console.log(error);
            throw error
        }
    }
    /*---------------接口管理---------------------*/
    //获取接口
    async getInterFace(data) {
        try {
            const optons = {
                url: url.getInterFace,
                data
            };
            return await this.service.post(optons)
        } catch (error) {
            console.log(error);
            throw error
        }
    }
    //编辑接口
    async editInterFace(data) {
        try {
            const optons = {
                url: url.editInterFace,
                data
            };
            return await this.service.post(optons)
        } catch (error) {
            console.log(error);
            throw error
        }
    }
    //新增
    async addInterFace(data) {
        try {
            const optons = {
                url: url.addInterFace,
                data
            };
            return await this.service.post(optons)
        } catch (error) {
            console.log(error);
            throw error
        }
    }
    //停用
    async stopInterFace(data) {
        try {
            const optons = {
                url: url.stopInterFace,
                data
            };
            return await this.service.post(optons)
        } catch (error) {
            console.log(error);
            throw error
        }
    }
    //获取单个接口
    async getOneInterface(data) {
        try {
            const optons = {
                url: url.getOneInterface,
                data
            };
            return await this.service.post(optons)
        } catch (error) {
            console.log(error);
            throw error
        }
    }
    //删除接口
    async delInterFace(data) {
        try {
            const optons = {
                url: url.delInterFace,
                data
            };
            return await this.service.post(optons)
        } catch (error) {
            console.log(error);
            throw error
        }
    }
    /*--------------激励语管理---------------------*/
    //获取激励语
    async getEncourage(data) {
        try {
            const optons = {
                url: url.getEncourage,
                data
            };
            return await this.service.post(optons)
        } catch (error) {
            console.log(error);
            throw error
        }
    }
    //随机一条激励语
    async randomEncourage(data) {
        try {
            const optons = {
                url: url.randomEncourage,
                data
            };
            return await this.service.post(optons)
        } catch (error) {
            console.log(error);
            throw error
        }
    }
    //新增激励语
    async addEncourage(data) {
        try {
            const optons = {
                url: url.addEncourage,
                data
            };
            return await this.service.post(optons)
        } catch (error) {
            console.log(error);
            throw error
        }
    }
    //删除激励语
    async delEncourage(data) {
        try {
            const optons = {
                url: url.delEncourage,
                data
            };
            return await this.service.post(optons)
        } catch (error) {
            console.log(error);
            throw error
        }
    }
    //编辑激励语
    async editEncourage(data) {
        try {
            const optons = {
                url: url.editEncourage,
                data
            };
            return await this.service.post(optons)
        } catch (error) {
            console.log(error);
            throw error
        }
    }

}

const backManage = new BackManage(Request.getInstance());
export default backManage
