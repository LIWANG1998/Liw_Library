// 导出页面为PDF格式
import html2Canvas from "html2canvas";
import jsPDF from "jspdf";
export default {
  install(Vue, options) {
    Vue.prototype.getPdf = function() {
      var title = "公文";
      // console.log(document.querySelector("#print"));
      html2Canvas(document.querySelector("#print"), {
        allowTaint: true,
      }).then(function(canvas) {
        let dataURL = canvas.toDataURL("image/png");
        // console.log(dataURL);
        // console.log("canvas", canvas);
        let contentWidth = canvas.width;
        let contentHeight = canvas.height;
        let pageHeight = (contentWidth / 592.28) * 841.89;
        let leftHeight = contentHeight;
        let position = 0;
        let imgWidth = 595.28;
        let imgHeight = (592.28 / contentWidth) * contentHeight;
        let pageData = canvas.toDataURL("image/jpeg", 1.0);
        let PDF = new jsPDF("", "pt", "a4");
        if (leftHeight < pageHeight) {
          PDF.addImage(pageData, "JPEG", 0, 0, imgWidth, imgHeight);
        } else {
          while (leftHeight > 0) {
            PDF.addImage(pageData, "JPEG", 0, position, imgWidth, imgHeight);
            leftHeight -= pageHeight;
            position -= 841.89;
            if (leftHeight > 0) {
              PDF.addPage();
            }
          }
        }
        PDF.save(title + ".pdf");
      });
    };
  },
};
