import mgxtQiniu from "@/js/updata.js"
import { qiniuToken } from "@/api/home";
import md5 from "js-md5";
import axios from "axios";
import vue from "vue";
import { Toast } from "vant";

import store from "@/store";
import router from "@/router";
export var http_url = "http://lotus.mgtx-tech-dev.mgtx.com.cn";

//转换时间
export function getDate(time) {
    let formatNumber = function (n) {
        return n < 10 ? "0" + n : n;
    };
    let dd = new Date(time);
    let y = dd.getFullYear();
    let m = formatNumber(dd.getMonth() + 1);
    let d = formatNumber(dd.getDate());
    let h = formatNumber(dd.getHours());
    let mm = formatNumber(dd.getMinutes());
    let ss = formatNumber(dd.getSeconds());
    let newD = y + m + d + h + mm + ss;
    return newD;
}

let fileimg = {
    sheet: "svg-excel", //
    file: "svg-file",
    image: "svg-img", //
    audio: "svg-music", //
    pdf: "svg-pdf", //
    presentat: "svg-ppt", //
    text: "svg-txt", //
    video: "svg-video", //
    word: "svg-word", //
    download: "svg-ysfile", //
};

// 上传附件到七牛云
export function saveFile(files, callback) {
    Toast.loading({
        message: "上传中...",
        duration: 0,
        forbidClick: true,
    });
    let text = files.file.name.split("."); // 获取文件后缀
    let timestamp = Date.parse(new Date()); // 获取当前事件戳
    let randomnumber = Math.round(Math.random() * 10000); // 获取4位随机数
    let num = String(timestamp) + String(randomnumber); // 拼接当前事件戳转加随机数
    let key = `document/${getDate(timestamp)}${md5(num)}.${text[text.length - 1]}`; // 拼成完整的key

    // let types = files.file.type;
    // let type="svg-txt";
    // let regs="";
    // for (let _key in fileimg) {
    //   regs =new RegExp(_key);
    //   if(regs.test(types)){
    //     type=fileimg[_key]
    //   }
    // }
    // // console.log(type)
    const { file } = files;
    //获取七牛token
    qiniuToken().then((res) => {
        // console.log("这就是七牛");
        if (res.wx3 == 0) {
            let path = res.url;
            let token = res.token;
            // 上传提交
            const formData = new FormData();
            formData.append("file", file);
            formData.append("key", key);
            formData.append("token", token);
            axios
                .post("https://upload-z2.qiniup.com", formData)
                .then(function (response) {
                    let cardNumObj = {
                        oldname: files.file.name,
                        path: path + "/" + response.data.key,
                        // size: Math.ceil(files.file.size / 1024),
                        size: files.file.size,
                        // icon_type:type,
                    };
                    // console.log(cardNumObj)
                    Toast.clear();
                    Toast.success('上传成功');
                    callback(cardNumObj);
                })
                .catch(function (error) {
                    Toast.clear();
                    Toast.fail('上传失败');
                });
        } else {
            mgxtQiniu.on('complete', (res) => {
                res.data.key = res.data.path;
                callback({
                    // data: res.data,
                    path: `http://${res.data.domain}/${res.data.path}`,
                    oldname: files.file.name,
                    // size: Math.ceil(files.file.size / 1024),
                    size: files.file.size,
                    // uid: files.file.uid

                });
                Toast.clear();
            })
            mgxtQiniu.upload(res.token, file, {}, mgxtQiniu.config)
        }
    });
}

// 上传附件到七牛云(签章的base64转的图片)
export function saveFile_sign(files, callback) {
    let timestamp = Date.parse(new Date()); // 获取当前事件戳
    let randomnumber = Math.round(Math.random() * 10000); // 获取4位随机数
    let num = String(timestamp) + String(randomnumber); // 拼接当前事件戳转加随机数
    let key = `document/${getDate(timestamp)}${md5(num)}.${files.type.split("/")[files.type.split("/").length - 1]
        }`; // 拼成完整的key

    const file = files;

    //获取七牛token
    qiniuToken().then((res) => {
        if (res.wx3 == 0) {
            let path = res.url;
            let token = res.token;
            // 上传提交
            const formData = new FormData();
            formData.append("file", file);
            formData.append("key", key);
            formData.append("token", token);
            axios
                .post("https://upload-z2.qiniup.com", formData)
                .then(function (response) {
                    let cardNumObj = {
                        oldname: file.name,
                        path: path + "/" + response.data.key,
                        size: file.size,
                    };
                    // console.log(cardNumObj);
                    callback(cardNumObj);
                })
                .catch(function (error) {
                });
        } else {
            mgxtQiniu.on('complete', (res) => {
                res.data.key = res.data.path;
                callback({
                    // data: res.data,
                    path: `http://${res.data.domain}/${res.data.path}`,
                    oldname: file.name,
                    size: file.size,
                    // uid: files.file.uid
                });
                Toast.clear();
            })
            mgxtQiniu.upload(res.token, file, {}, mgxtQiniu.config)
        }
    });

}

// 验证文件类型和大小
export function public_data_files(file, type, size) {
    let isJPG = type;
    let text = file.name.split(".")[1];
    if (!isJPG.includes(text)) {
        Toast(`上传的文件只能是${type.join("、")}格式`);
    }
    let isLt2M = file.size / 1024 / 1024 < size;
    if (!isLt2M) {
        Toast(`文件不能大于${size}MB`);
    }
    return isJPG.includes(text) && isLt2M;
}

// //调用
// var blob = dataURLtoBlob(base64Data);
// var file = blobToFile(blob, imgName);
// 先将base64转换成blob，再将blob转换成file文件，此方法不存在浏览器不兼容问题。
//将base64转换为blob
export function dataURLtoBlob(dataurl) {
    var arr = dataurl.split(","),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
}

//将blob转换为file
export function blobToFile(theBlob, fileName) {
    theBlob.lastModifiedDate = new Date();
    theBlob.name = fileName;
    return theBlob;
}

export function dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(","),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
}

export function openpage(el) {
    // 预览附件
    store.commit("set_openpage", { path: el, type: get_file_img(el) });
    let word_arrey = ["svg-ppt", "svg-excel", "svg-word"];
    if (word_arrey.includes(get_file_img(el))) {
        window.location.href =
            "https://view.officeapps.live.com/op/view.aspx?src=" + el;
    } else {
        router.push({ path: "/openpage" });
    }
}
//获取文件图片
export function get_file_img(suffixs) {
    let a_suffix = suffixs.split(".");
    let suffix = a_suffix[a_suffix.length - 1];
    if (["txt"].includes(suffix)) {
        return "svg-txt"
    }
    if (["doc", "docx"].includes(suffix)) {
        return "svg-word"
    }
    if (["jpg", "jpeg", "png", "bmp"].includes(suffix)) {
        return "svg-img"
    }
    if (["pptx", "ppt"].includes(suffix)) {
        return "svg-ppt"
    }
    if (["pdf"].includes(suffix)) {
        return "svg-pdf"
    }
    if (["xls", "xlsx"].includes(suffix)) {
        return "svg-excel"
    }
    if (["mp3"].includes(suffix)) {
        return "svg-music"
    }
    if (["mp4"].includes(suffix)) {
        return "svg-video"
    }
    if (["zip", "rar"].includes(suffix)) {
        return "svg-ysfile"
    }

}

// 获取token
export function setToken(_token, callback) {
    sessionStorage.setItem("token", _token);
    axios.get(`${url}/power_setting_menu`, {
        headers: {
            token: _token,
        },
    }).then(function (response) {
        if (response.data.code == 1) {
            sessionStorage.setItem(
                "SET_AUTH",
                JSON.stringify(response.data.data)
            );
            homeInitApi(callback);
        }
    }).catch(function (error) {
        console.log(error);
    });
}
// 获取token
export function homeInitApi(callback) {
    let data = new URLSearchParams();
    memberDetail(data).then((res) => {
        if (res.code == 1) {
            _this.res = res.data;
            sessionStorage.setItem("userInfo", JSON.stringify(res.data)); //用户信息
            callback();
        }
    });
}