<template>
  <div class="box"></div>
</template>

<script>
import { url } from "@/utils/utils.js";
import axios from "axios";
export default {
  data() {
    return {
      token: "",
    };
  },
  mounted() {
    let _this = this;
    this.token = this.$route.query.back_url;
    // console.log("token", this.token);
    if (this.token != undefined) {
      this.token = this.token.substr(0, this.token.length - 1);
      sessionStorage.setItem("token",atob(this.token));
      axios
        .get(`${url}/power_setting_menu`, {
          headers: {
            token: atob(this.token),
          },
        })
        .then(function (response) {
          if (response.data.code == 1) {
            // console.log(response.data.data, "555");
            sessionStorage.setItem(
              "SET_AUTH",
              JSON.stringify(response.data.data)
            );
            _this.$router.push({
              path: "/home",
            });
          }
        })
        .catch(function (error) {
          // console.log(error);
        });
    }
  },
};
</script>
<style lang="scss" scoped>
</style>