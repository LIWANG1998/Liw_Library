import store from '../store'
// 服务器地址
export const HttpUrl =
  process.env.NODE_ENV === "development"
    ? "http://lotus.mgtx-tech-dev.mgtx.com.cn"
    : window.location.protocol + "//" + window.location.host;
// export const HttpUrl = "http://192.168.8.182"; // 韩杰的本地服务器

// 防抖
export const debounce = (func, wait) => {
  var timeout;

  return function () {
    var context = this;
    var args = arguments;

    clearTimeout(timeout);
    timeout = setTimeout(function () {
      func.apply(context, args);
    }, wait);
  };
};

// 节流
export const throttle = (fn, wait) => {
  let canRun = true; // 通过闭包保存一个标记
  return function () {
    if (!canRun) return; // 在函数开头判断标记是否为true，不为true则return
    canRun = false; // 立即设置为false
    setTimeout(() => {
      // 将外部传入的函数的执行放在setTimeout中
      fn.apply(this, arguments);
      // 最后在setTimeout执行完毕后再把标记设置为true(关键)表示可以执行下一次循环了。当定时器没有执行的时候标记永远是false，在开头被return掉
      canRun = true;
    }, wait);
  };
};

// 提交电子签章的时候修改比例
export const enlarge = (num, e_n) => {
  // 1 放大 2 缩小
  let _bl = e_n == 1 ? 795 / 414 : 414 / 795;
  return (Number(num) * _bl).toFixed(1);
};

export const small_down = (e) => {
  var obig = document.getElementById("big");
  var osmall = document.getElementById("small");
  var e = e || window.event;
  /*用于保存小的div拖拽前的坐标*/
  osmall.startX = e.clientX - osmall.offsetLeft;
  osmall.startY = e.clientY - osmall.offsetTop;
  /*鼠标的移动事件*/
  document.onmousemove = function (e) {
    var e = e || window.event;
    osmall.style.left = e.clientX - osmall.startX + "px";
    osmall.style.top = e.clientY - osmall.startY + "px";
    /*对于大的DIV四个边界的判断*/
    if (e.clientX - osmall.startX <= 0) {
      osmall.style.left = 0 + "px";
    }
    if (e.clientY - osmall.startY <= 0) {
      osmall.style.top = 0 + "px";
    }
    if (e.clientX - osmall.startX >= 250) {
      osmall.style.left = 250 + "px";
    }
    if (e.clientY - osmall.startY >= 2950) {
      osmall.style.top = 250 + "px";
    }
  };
  /*鼠标的抬起事件,终止拖动*/
  document.onmouseup = function () {
    document.onmousemove = null;
    document.onmouseup = null;
  };
};

// 处理发文数据

// 设置vuex数据e
export const set_vuex_data = (type) => {
  let fields_data = store.state.edittext.document_arrs;
  // 提交前处理数据
  let a = {};
  for (let key in fields_data) {
    if (typeof fields_data[key].value == "string") {
      if (fields_data[key].input_type_new > 1) {
        if (key == "word_no" || fields_data[key].input_type == 2) {
          a[key] = fields_data[key].value_id;
        } else {
          a[key] = fields_data[key].value;
        }
      } else {
        a[key] = fields_data[key].value;
      }
    } else if (typeof fields_data[key].value == "object") {
      let ass = {};
      let text = [];
      ass.select = [];
      fields_data[key].e_name == "main_delivery" || fields_data[key].e_name == "receiving_unit" ? ass.inter = [] : "";
      fields_data[key].values.forEach((v) => {
        if (v.type == 100) {
          text.push(v.title);
        } else {
          if (fields_data[key].e_name == "main_delivery" || fields_data[key].e_name == "receiving_unit") {
            if (v.type == 7) {
              ass.inter.push({
                id: v.id,
                name: v.title,
              })
            }
            else {
              ass.select.push({
                id: v.id,
                name: v.title,
              })
            }
          } else {
            ass.select.push(fields_data[key].e_name == "reviewer" || fields_data[key].e_name == "receiving_user" ? {
              id: v.id,
              name: v.title,
              wid: v.wid
            } : {
                id: v.id,
                name: v.title,
              });
          }
        }
      });
      ass.text = text.join();
      if (fields_data[key].input_type_new == 1) {
        a[key] = text.join();
      } else {
        a[key] = ass;
      }
    }
  }
  store.commit("setdocument_arr", a);
  console.log(a);
  set_view_document_data(type);
};

function set_view_document_data(type) {
  let datas = store.state.edittext.datas;
  let fields_data = store.state.edittext.document_arrs;
  let iss = store.state.edittext.iss;
  let red = store.state.edittext.red;
  let content = store.state.edittext.content;

  let fls = JSON.parse(JSON.stringify(fields_data));
  fls.word_no.value = iss.value.length > 0 ? iss.value[0].word_no : "";
  datas.fields = fls;
  datas.process = red.value[0];
  datas.content = content;
  datas.type = type ? type : 1;
}


// 这个方法通过递归找到滚动的元素,用于置顶页面
export const getScrollParent = (node) => {
  if (node == null) {
    return null
  }
  if (node.scrollHeight > node.clientHeight) {
    return node
  } else {
    return getScrollParent(node.parentNode)
  }
}

