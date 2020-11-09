import {Modal} from 'ant-design-vue'

let commonFn = {
    //下载方法
    downLoadFile(name, url) {
        Modal.confirm({
            title: '是否确定下载该附件？',
            content: '',
            centered: true,
            onOk() {
                let host = '';
                if (url.indexOf('http://') === -1 && url.indexOf('https://') === -1) {
                    host = JSON.parse(sessionStorage.getItem("userInfo")).host;
                } else {
                    host = ''
                }
                let downloadFileUrl = host + url + "?attname=" + encodeURIComponent(name);
                let elemIF = document.createElement("iframe");
                elemIF.src = downloadFileUrl;
                elemIF.style.display = "none";
                document.body.appendChild(elemIF);
            }
        })

    },
    //判断文件类型展示前面的文件类型icon
    judeFileType(fileType, path) {
        if (fileType === ('xlsx' || 'xstx')) {
            return require('@/assets/images/taskDetail/excelIcon.png')
        } else if (fileType === ('pptx' || 'ppt')) {
            return require('@/assets/images/taskDetail/pptIcon.png')
        } else if (fileType === ('docx' || 'doc')) {
            return require('@/assets/images/taskDetail/wordIcon.png')
        } else if (fileType === 'pdf') {
            return require('@/assets/images/taskDetail/pdfIcon.png')
        } else if (fileType === ('zip' || 'rar')) {
            return require('@/assets/images/taskDetail/zipIcon.png')
        } else if (fileType === ('jpg' || 'jpge' || 'png' || 'gif' || 'svg' || 'raw')) {
            return path
        } else {
            return require('@/assets/images/defaultImg.jpg')
        }
    },
    //预览文件
    previewFile(name, url) {
        console.log(name, url)
    },
    //图片预览加水印
    createImg(url, warterMark) {
        // let time = new Date();
        // let year = time.getFullYear() + "年";
        // let month = parseInt(time.getMonth()) + 1 + "月";
        // let day = time.getDate() + "日";
        // let hour = time.getHours() + ":";
        // let min = time.getMinutes();
        // let nowTime = year + month + day + " " + hour + min;
        let img = new Image();
        img.setAttribute('crossOrigin', 'anonymous');
        img.src = url;
        img.setAttribute("crossorigin", "crossorigin");
        return new Promise((resolve) => {
            img.onload = () => {
                var canvas = document.createElement('canvas');
                canvas.width = 500;
                canvas.height = 500 / img.width * img.height;
                var ctx = canvas.getContext('2d');

                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                for (var i = 0; i < 50; i++) {
                    ctx.rotate((-45 * Math.PI) / 180); // 水印初始偏转角度
                    for (var j = 0; j < 10; j++) {
                        ctx.textAlign = "left";
                        ctx.textBaseline = "Middle";
                        ctx.font = "14px microsoft yahei";
                        ctx.fillStyle = "rgba(180,180,180,0.4)";
                        ctx.fillText(warterMark, (j * 260) - 600, i * 100, 200);
                        // ctx.fillText('1111111111111111', (j * 260) - 600, i * 100, 200);
                    }
                    ctx.rotate((45 * Math.PI) / 180); // 把水印偏转角度调整为原来的，不然他会一直转
                }
                // console.log(canvas.toDataURL())
                resolve(canvas.toDataURL());
                // return canvas.toDataURL()
            }
        })
    },
};
export default commonFn;

export function judgeType(obj) {
    // tostring会返回对应不同的标签的构造函数
    const toString = Object.prototype.toString;
    const map = {
        '[object Boolean]': 'boolean',
        '[object Number]': 'number',
        '[object String]': 'string',
        '[object Function]': 'function',
        '[object Array]': 'array',
        '[object Date]': 'date',
        '[object RegExp]': 'regExp',
        '[object Undefined]': 'undefined',
        '[object Null]': 'null',
        '[object Object]': 'object',
    };
    if (obj instanceof Element) {
        return 'element';
    }
    return map[toString.call(obj)];
}

export function deepClone(data) {
    const type = judgeType(data);
    let obj;
    if (type === 'array') {
        obj = [];
    } else if (type === 'object') {
        obj = {};
    } else {
        // 不再具有下一层次
        return data;
    }
    if (type === 'array') {
        for (let i = 0, len = data.length; i < len; i++) {
            obj.push(deepClone(data[i]));
        }
    } else if (type === 'object') {
        // 对原型上的方法也拷贝了....
        for (const key in data) {
            obj[key] = deepClone(data[key]);
        }
    }
    return obj;
}

// 防抖
export function debounce(fn) {
    var delay = 500;
    var timer;
    return function () {
        var th = this;
        var args = arguments;
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(function () {
            timer = null;
            fn.apply(th, args);
        }, delay);
    };
}

// 节流
export function throttle(fn) {
    var last;
    var timer;
    var interval = 1000;
    return function () {
        var th = this;
        var args = arguments;
        var now = +new Date();
        if (last && now - last < interval) {
            clearTimeout(timer);
            timer = setTimeout(function () {
                last = now;
                fn.apply(th, args);
            }, interval);
        } else {
            last = now;
            fn.apply(th, args);
        }
    }
}