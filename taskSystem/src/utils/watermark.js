'use strict'
 
let watermark = {}
 
let setWatermark = (str) => {
  let id = '1.23452384164.123412415'
 
  if (document.getElementById(id) !== null) {
    document.body.removeChild(document.getElementById(id))
  }
  let can = document.createElement('canvas')
  can.width = 300
  can.height = 300
  let cans = can.getContext('2d');
  can.width = cans.measureText(str).width + 120;
  can.height = can.width;
  let rectCenterPoint = {x: can.width/2, y: can.width/2};
  cans.translate(rectCenterPoint.x + 20, rectCenterPoint.y + 20);
  cans.rotate(-20 * Math.PI / 180);
  cans.translate(-rectCenterPoint.x, -rectCenterPoint.y);
  cans.font = '12px Vedana';
  //cans.fillStyle = 'rgba(200, 200, 200, 0.20)'
  cans.fillStyle = '#bfbfbf'; // 字体颜色
  cans.textAlign = 'left';
  cans.textBaseline = 'bottom';
  //cans.fillText(str, can.width / 3, can.height / 2)
  cans.fillText(str, 15, 60);    //第一行字体
 
  let div = document.createElement('div')
  div.id = id
  div.style.pointerEvents = 'none';
  div.style.top = '70px';
  div.style.left = '0px';
  div.style.opacity=0.2    //调节字体颜色的深浅
  div.style.position = 'absolute';
  div.style.zIndex = '1';
  div.style.width = document.documentElement.clientWidth + 'px';
  div.style.height = document.documentElement.clientHeight -150 + 'px';
  div.style.background = 'url(' + can.toDataURL('image/png') + ') left top repeat';
  document.body.appendChild(div)
  return id
}
 
watermark.set = (str) => {
  let id = setWatermark(str)
  setInterval(() => {
    if (document.getElementById(id) === null) {
      id = setWatermark(str)
    }
  }, 500)
window.onresize = () => {
    setWatermark(str)
  }
}
 
export default watermark