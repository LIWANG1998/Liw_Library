// npm安装：npm install qiniu-js
import * as qiniu from 'qiniu-js'
// 七牛云上传
var qiniudnUploader = (token, file, key, obj) => {
    var putExtra = {
        fname: file.name,
        params: {}
    }

    var config = {
        useCdnDomain: true,
        region: qiniu.region.z2
    }

    // 上传回调
    var observer = {
        next(res) {
            // ...
            // console.log('next：' + JSON.stringify(res))
        },
        error(err) {
            // ...
            console.log('error：' + err)
        },
        complete(res) {
            // ...
            obj(res)
            // console.log('complete：' + JSON.stringify(res))
        }
    }
    var observable = qiniu.upload(file, key, token, putExtra, config)
    observable.subscribe(observer) // 上传开始
}

export { qiniudnUploader }