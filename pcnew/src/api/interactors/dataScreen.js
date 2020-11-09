import {
    Request
} from '@/api/services/http/request'
const url = {
    totalTask:'/api/Count/totalTask',//一览图统计
    level:'/api/Count/level',//本月等级统计、完成未完成统计
    countResponse:'/api/Count/countResponse',//月响应时间数据

};
class DataScreen {
    service;
    constructor(service) {
        this.service = service
    }
    //一览图统计
    async totalTask(data) {
        try {
            const optons = {
                url: url.totalTask,
                data
            };
            console.log(optons)
            return await this.service.post(optons)
        } catch (error) {
            console.log(error);
            throw error
        }
    }
    //本月等级统计、完成未完成统计
    async level(data) {
        try {
            const optons = {
                url: url.level,
                data
            };
            console.log(optons)
            return await this.service.post(optons)
        } catch (error) {
            console.log(error);
            throw error
        }
    }
    //月响应时间数据countResponse
    async countResponse(data) {
        try {
            const optons = {
                url: url.countResponse,
                data
            };
            console.log(optons)
            return await this.service.post(optons)
        } catch (error) {
            console.log(error);
            throw error
        }
    }
}

const dataScreen = new DataScreen(Request.getInstance());
export default dataScreen
