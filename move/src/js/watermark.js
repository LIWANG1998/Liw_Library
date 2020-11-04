let watermark = {};

let setWatermark = (str, elt) => {
  let id = "1.23452384164.123412415";

  if (document.getElementById(id) !== null) {
    document.getElementById(elt).removeChild(document.getElementById(id));
  }
  let can = document.createElement("canvas");
  can.width = 207;
  can.height = 130;
  let cans = can.getContext("2d");
  cans.rotate((-20 * Math.PI) / 180);
  cans.font = "16px Vedana";
  cans.fillStyle = "rgba(0, 0, 0, 0.07)";
  cans.textAlign = "left";
  cans.textBaseline = "Middle";
  cans.fillText(str, can.width / 9, can.height);

  let div = document.createElement("div");
  div.id = id;
  div.style.top = "0";
  div.style.left = "0";
  div.style.right = "0";
  div.style.bottom = "0";
  div.style.pointerEvents = "none";
  div.style.position = "absolute";
  div.style.zIndex = "20";
  div.style.width = "100%";
  div.style.height = "100%";
  div.style.background =
    "url(" + can.toDataURL("image/png") + ") left top repeat";
  document.getElementById(elt).appendChild(div);
  return id;
};

// 该方法只允许调用一次
watermark.set = (str, elt) => {
  // console.log("axb");
  // setTimeout(() => {
  setWatermark(str, elt);
  // let id = setWatermark(str);
  // setInterval(() => {
  //   if (document.getElementById(id) === null) {
  //     id = setWatermark(str);
  //   }
  // }, 2000);
  window.onresize = () => {
    setWatermark(str, elt);
  };
  // }, 350);
};

export default watermark;
