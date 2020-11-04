<template>
  <div class="logintransfer"></div>
</template>
<script>
import { LoginTransfer } from "@/api/public.js";
import { tokeninfo } from "@/api/login.js";
import { get_roloe_menu } from "@/api/router.js";
export default {
  name: "logintransfer",
  data() {
    return {};
  },
  created() {
    let _this = this;
    let back_url = this.$route.query.back_url;
    if (back_url) {
      back_url = back_url.substr(0, back_url.length - 1);
      console.log(atob(back_url));
      sessionStorage.setItem("token", atob(back_url));
      tokeninfo().then((data) => {
        this.$store.commit("USERINFO", data.data);
        this.addroloe_menu();
        if (_this.$route.query.grade) {
          if (_this.$route.query.grade == "3") {
            this.$router.push({
              path: "/accept/acceptadd",
              query: {
                cut: _this.$route.query.cut,
                num: _this.$route.query.num,
                type: _this.$route.query.type,
                id: _this.$route.query.id,
              },
            });
          } else {
            this.$router.push({
              path: "/home/incoming",
              query: {
                file_type: _this.$route.query.file_type,
                id: _this.$route.query.id,
              },
            });
          }
        } else {
          this.$router.push({ name: "home" });
        }
      });
    } else {
      LoginTransfer(this.$route.query).then((data) => {
        this.$store.commit("USERINFO", data.data.userinfo);
        sessionStorage.setItem("token", data.data.token);
        this.addroloe_menu();
        this.$router.push({ name: "home" });
      });
    }
  },
  methods: {
    addroloe_menu() {
      get_roloe_menu().then((data) => {
        this.$store.commit("SET_LEFTDATA_jurisdiction", data.data);
      });
    },
  },
};
</script>
