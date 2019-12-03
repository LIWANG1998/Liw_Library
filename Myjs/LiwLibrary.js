
// 获取元素
// $(el,isAll);
// el:传入一个选择器
// isAll:传入一个Boolean值
//（选择多个要设为true，单个可以不用写）；
function $(el, isAll) {
    if (isAll)
        return document.querySelectorAll(el);
    return document.querySelector(el);
}