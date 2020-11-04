<template>
  <!-- 意见审批 -->
  <div class="box">
    <div class="flexHeader" @click="chioseSub()">
      <div>{{status==2?'优化建议':'bug反馈'}}</div>
      <div>
        <van-icon name="arrow-down" />
      </div>
    </div>
    <div class="textarea">
      <textarea
      v-model="remark"
        class="yjtext"
        maxlength="200"
        :placeholder="status==2?'如果您有什么优化和建议！请在此输入。':'如果您发现有什么BUG！请在此输入。'"
      ></textarea>
    </div>
    <div class="upFile">
      <div>
        <span style="font-size:17px">图片上传</span>
        <span style="font-size:14px;color:#9B9B9B">（最多上传1张）</span>
      </div>
      <div class="upIocn">
        <van-uploader
          v-model="fileList"
          :max-count="1"
          style="width: 80px;height: 80px;"
          :after-read="afterRead"
          accept="image/*"
        >
          <van-button style="width: 80px;height: 80px;"></van-button>
          <div class="icon">
            <van-icon name="plus" size="50" color="#d9d9d9" />
          </div>
        </van-uploader>
      </div>
    </div>
    <div class="btn">
      <van-button type="default" @click="cancle()">取消</van-button>
      <van-button type="info" @click="subBug">确定</van-button>
    </div>
    <!-- 弹出层 -->
    <div class="pop" v-if="isShow">
      <div class="chiose">
        请选择
        <div class="subBtn">确定</div>
      </div>
      <div class="funBox">
        <div class="fun" v-for="(item,index) in list" :key="index" @click="determine(item.id)">
          <div>{{item.text}}</div>
          <div v-if="item.id==status">
            <van-icon name="success" color="#248DFF" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { qiniuToken, bug } from "../../../api/home";
export default {
  data() {
    return {
      isShow: false,
      status: 2,
      list: [
        {
          id: 1,
          text: "bug反馈"
        },
        {
          id: 2,
          text: "优化建议"
        }
      ],
      fileList: [],
      file_info: {
        url: "",
        name: "",
        size: ""
      },
      remark: "", //内容
      type: "2", //1是bug2是反馈问题
      qiniuYun: {
        key: "", //图片名字
        token: "" //token
      },
      path: "" //图片地址
    };
  },
  methods: {
    getDate(time) {
      // console.log(time);
      let formatNumber = function(n) {
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
    },
    // 获取七牛云
    getQiniuToken() {
      qiniuToken().then(res => {
        this.path = res.url;
        this.qiniuYun.token = res.token;
      });
    },
    // 图片上传
    afterRead(files) {
      this.file_info.name = files.file.name;
      this.file_info.size = files.file.size;
      let text = files.file.name.split("."); // 获取文件后缀
      let timestamp = Date.parse(new Date()); // 获取当前事件戳
      let randomnumber = Math.round(Math.random() * 10000); // 获取4位随机数
      let num = String(timestamp) + String(randomnumber); // 拼接当前事件戳转加随机数
      let key = `document/${this.getDate(timestamp)}${this.$md5(num)}.${
        text[1]
      }`; // 拼成完整的key
      let _this = this;
      const { file } = files;
      // 上传提交
      const formData = new FormData();
      formData.append("file", file);
      formData.append("key", key);
      formData.append("token", this.qiniuYun.token);
      this.$axios
        .post("https://upload-z2.qiniup.com", formData)
        .then(function(response) {
          _this.file_info.url = _this.path + "/" + response.data.key;
        })
        .catch(function(error) {});
    },
    //提交bug
    subBug() {
      if(this.remark==''){
        this.$toast("请填写描述信息之后再提交")
        return
      }
      let data = new URLSearchParams();
      data.append("file_info", JSON.stringify(this.file_info));
      data.append("remark", this.remark);
      data.append("type", this.type);
      bug(data).then(res => {
        // console.log(res);
      });
    },
    chioseSub() {
      this.isShow = true;
    },
    determine(id) {
      this.isShow = false;
      this.status = id;
      this.type=id
    },
    cancle(){
      this.file_info={}
      this.fileList=[]
      this.remark=''
    }
  },
  mounted() {
    this.getQiniuToken();
  }
};
</script>
<style lang="scss" scoped>
.box {
  height: 97vh;
  background-color: #f5f5f5;
  position: relative;
}
.flexHeader {
  display: flex;
  justify-content: space-between;
  padding: 0 15px;
  font-size: 17px;
  background-color: #fff;
  height: 46px;
  margin-top: 10px;
  line-height: 46px;
  box-sizing: border-box;
}
.textarea {
  height: 186px;
  width: 100%;
  font-size: 14px;
  padding: 10px 20px;
  box-sizing: border-box;
  .yjtext {
    width: 100%;
    height: 100%;
    border: none;
    resize: none;
    background-color: #f5f5f5 !important;
  }
}
.upFile {
  height: 154px;
  background-color: #fff;
  padding: 15px;
  box-sizing: border-box;
}
.upIocn {
  position: relative;
  margin-top: 10px;
  .van-uploader {
    border: 0.5px solid #d9d9d9;
  }
  .icon {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
.btn {
  position: absolute;
  bottom: 10px;
  display: flex;
  padding: 0 10px;
  box-sizing: border-box;
  width: 100%;
  justify-content: space-around;
  background-color: #fff;
  .van-button {
    width: 188px;
    height: 47px;
    font-size: 16px;
    // margin-left: 10px;
  }
}
//弹出层
.pop {
  position: absolute;
  bottom: -7px;
  width: 100%;
  height: 176px;
  border-top: 1px solid #d9d9d9;
  .chiose {
    position: relative;
    height: 66px;
    background-color: #f7f7f8;
    font-size: 16px;
    line-height: 66px;
    text-align: center;
  }
  .subBtn {
    position: absolute;
    right: 20px;
    top: 0;
    color: #2e70b9;
  }
  .funBox {
    padding-left: 15px;
    width: 100%;
    box-sizing: border-box;
    background-color: #fff;
  }
  .fun {
    display: flex;
    justify-content: space-between;
    padding: 15px 15px 15px 0;
    border-bottom: 1px solid #d9d9d9;
    font-size: 17px;
  }
}
</style>