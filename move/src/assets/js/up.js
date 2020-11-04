
export function getDate(time) {
    // console.log(time);
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
export function power(_this){
    // console.log(_this.$route.path,'_this.$route.path');
    return JSON.parse( sessionStorage.getItem('SET_AUTH'))[_this.$route.path]
  }
  // 数据对比函数，value上次内容 orig2本次内容 textone放入旧内容元素 texttwo放入新内容元素
// temporary当前对比结果 CodeMirror存放内容的盒子 text放入新的元素
export function initUI(_this, value, orig2, temporary, text, document) {
    let dd = value.replace(/<\/?.+?>|&nbsp/g, "\n");
    let dds = dd.replace(/ /g, "\n");//dds为得到后的内容
    let bb = orig2.replace(/<\/?.+?>|&nbsp/g, "\n");
    let ddss = bb.replace(/ /g, "\n");//dds为得到后的内容
    if (value == null) return;
    let target = document.getElementById(temporary);
    _this.$CodeMirror.MergeView(target, {
      value: dds, //上次内容
      origLeft: null,
      orig: ddss, //本次内容
      lineNumbers: false, //显示行号
      mode: "text/html",
      highlightDifferences: true,
      connect: "align",
      readOnly: true //只读 不可修改
    });
    let htmlone = document.getElementsByClassName('CodeMirror-lines')[0];
    let htmltwo = document.getElementsByClassName('CodeMirror-lines')[1];
    setTimeout(() => {
      let textone = document.getElementsByClassName(text)[0];
      let texttwo = document.getElementsByClassName(text)[1];
      textone.innerHTML = htmlone.innerHTML
      // texttwo.innerHTML = htmltwo.innerHTML
    }, 100)
  
  
  }
  