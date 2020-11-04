<template>
  <div class="box">
    <van-popup v-model="show">
      <div class="infoBox" @click="show=false">
        <div class="titleTable">
          <div>发文单</div>
        </div>
        <table align="center" cellspacing="0" cellpadding="6" border="1">
          <tbody>
            <tr align="center">
              <td height="44px">发文标题</td>
              <td colspan="3">{{document_arr.title}}</td>
            </tr>
            <tr align="center">
              <td height="44px">发文字号</td>
              <td colspan="3">发文后自动生成</td>
            </tr>
            <tr align="center">
              <td height="44px">密级程度</td>
              <td width="25%">{{document_arr.secret_level}}</td>
              <td width="25%">紧急程度</td>
              <td width="25%">{{document_arr.urgent_level}}</td>
            </tr>
            <tr align="center">
              <td height="80px">抄送单位</td>
              <td>{{document_arr.copy_users}}</td>
              <td>核稿人</td>
              <td>{{document_arr.reviewer}}</td>
            </tr>
            <tr align="center">
              <td height="80px">主送单位</td>
              <td>{{document_arr.main_delivery}}</td>
              <td>签发人</td>
              <td>{{document_arr.issuer}}</td>
            </tr>
            <!-- <tr align="center">
              <td height="44px"></td>
              <td colspan="3"></td>
            </tr> -->
          </tbody>
        </table>
        <div style="margin-top:5px" v-html="content"></div>
      </div>
    </van-popup>
  </div>
</template>

<script>
export default {
  props: {
    tableStatus: {
      default: () => ""
    }
  },
  data() {
    return {
      show: false,
      content: "", //正文内容
      document_arr: {} //正文的内容
    };
  },
  watch: {
    tableStatus(newValue, oldValue) {
      if (newValue || oldValue) {
        this.show = true;
        let document_arr = sessionStorage.getItem("document_arr");

        if (document_arr != null) {
          this.document_arr = JSON.parse(sessionStorage.getItem("document_arr"));
        }
      }
    }
  },
  activated() {
    this.content = sessionStorage.getItem("content");
  }
};
</script>
<style lang="scss" scoped>

</style>
