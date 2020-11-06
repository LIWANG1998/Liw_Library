<template>
  <van-popup
    v-if="_show"
    v-model="_show"
    :class="['remind-user', 'popup']"
    :overlay="false"
  >
    <van-skeleton :row="10" :loading="loading">
      <template v-if="userData.length > 0">
        <van-checkbox-group v-model="selectData">
          <van-cell
            v-for="(item, index) in userData"
            :key="index"
            clickable
            center
            class="item"
            @click="openUser(item.userid)"
          >
            <template #right-icon>
              <van-checkbox
                shape="square"
                :name="item.userid ? item.userid : item.id"
              />
            </template>
            <template #title>
              <div>{{ item.label ? item.label : item.name }}</div>
            </template>
          </van-cell>
        </van-checkbox-group>
      </template>
      <van-empty
        v-else
        class="custom-image"
        :image="require('@/assets/images/nodata.png')"
        description="暂无数据"
      />
    </van-skeleton>
    <footer>
      <van-button type="default" native-type="button" @click="handleCancel">
        取消
      </van-button>
      <van-button
        type="info"
        native-type="button"
        :loading="button.loading"
        :loading-text="button.text"
        @click="onSubmit"
      >
        确定
      </van-button>
    </footer>
  </van-popup>
</template>
<script>
import { task } from "@/api";

export default {
  props: {
    show: {
      type: Boolean,
      required: true,
    },
    id: {
      type: [Number, String],
      required: true,
    },
    data: {
      type: Object,
      default:()=> {},
    },
    selectUser:{
      type:[Array, Object],
      default:()=> {}
    }
  },
  data() {
    return {
      userData: [],
      selectData: [],
      loading: false,
      button: {
        loading: false,
        text: "保存中",
      },
    };
  },
  computed: {
    _show: {
      get: function () {
        console.log(this.data)
        return this.show;
      },
      set: function (val) {
        this.$emit("update:show", val);
      },
    },
  },
  watch: {
    show(val) {
      if (val) {
        this.data.user.forEach(item=>{
          item.id = item.id?item.id:item.userid;
          item.name = item.name?item.name:item.label;
        })
        this.userData = this.data.user;
        console.log(this.selectUser)
        this.selectData = this.selectUser.split(',')
      }
    },
    selectData: {
      deep: true,
      immediate: true,
      handler(val) {
        console.log('selectData', val)
      }
    },
  },
  methods: {
    handleCancel() {
      this._show = false;
      this.button.loading = false;
      this.userData = [];
    },
    onSubmit() {
      if (this.selectData.length == 0) {
        return this.$notify({ type: "danger", message: "请选择子任务人员" });
      }
      let data = this.userData.filter(item=>this.selectData.indexOf(item.id) > -1);
      console.log('huhu', data)
      this.$emit("done", data);
      this.button.loading = true;
      setTimeout(() => {
        this._show = false;
        this.button.loading = false;
      },1000);
    },
    async openUser(userid) {
      let that = this;
      if (this.isSelect) {
        return false;
      }
      wx.ready(function () {
        let userId = userid;
        if (userId) {
          let user = userId.split("_")[1];
          wx.invoke(
            "openUserProfile",
            {
              type: 1, //1表示该userid是企业成员，2表示该userid是外部联系人
              userid: user, //可以是企业成员，也可以是外部联系人
            },
            function (res) {
              if (res.err_msg != "openUserProfile:ok") {
                that.$toast("该成员不是当前企业成员");
              }
            }
          );
        }
      });
    },
  },
};
</script>
<style lang="less" scoped>
.remind-user {
  .icon-file {
    width: 32px;
    margin-right: 10px;
    border-radius: 4px;
  }
  .van-checkbox {
    margin-right: 10px;
  }
  .gray {
    color: @gray;
    margin-left: 15px;
  }
  .green {
    color: @green-light;
  }
  .blue {
    color: @blue;
  }
}
</style>
