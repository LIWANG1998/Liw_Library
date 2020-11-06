<template>
  <van-popup
    v-if="_show"
    v-model="_show"
    :class="['remind-user','popup']"
    :overlay="false"
  >
    <van-skeleton
      :row="10"
      :loading="loading"
    >
      <template v-if="userData.length>0">
        <template v-if="type==1">
          <van-checkbox-group v-model="selectData">
            <div
              v-for="(item,index) in userData"
              :key="index"
              class="item"
            >
              <van-cell>
                <template #title>
                  <label>{{ item.dep_name }}</label>
                  <label class="gray">{{ item.user_list.length }} 人</label>
                </template>
              </van-cell>
              <van-cell
                v-for="(uItem,uIndex) in item.user_list"
                :key="uIndex"
                clickable
                center
                @click="openUser(uItem.userid)"
              >
                <template #icon>
                  <van-checkbox
                    v-if="isSelect"
                    shape="square"
                    :name="uItem.userid"
                  />
                  <img
                    :src="uItem.avatar"
                    class="icon-file"
                  >
                </template>
                <template #title>
                  <div>{{ uItem.name }}</div>
                </template>
                <template
                  v-if="isSelect"
                  #right-icon
                >
                  <span
                    v-if="uItem.is_leader==0&&uItem.is_look==0"
                    class="gray"
                  >未阅读</span>
                  <span
                    v-if="uItem.is_leader==0&&uItem.is_look==1&&uItem.receive_status==0"
                    class="blue"
                  >进行中</span>
                  <span
                    v-if="uItem.is_leader==0&&uItem.is_look==1&&uItem.receive_status==1"
                    class="green"
                  >已完成</span>
                </template>
                <template v-else>
                  <span
                    v-if="uItem.is_look==0"
                    class="gray"
                  >未阅读</span>
                  <span
                    v-else
                    class="green"
                  >已阅读</span>
                </template>
              </van-cell>
            </div>
          </van-checkbox-group>
        </template>
        <template v-else>
          <div class="item">
            <van-cell
              v-for="(uItem,uIndex) in userData"
              :key="uIndex"
              clickable
              center
              @click="openUser(uItem.userid)"
            >
              <template #icon>
                <img
                  :src="uItem.avatar"
                  class="icon-file"
                >
              </template>
              <template #title>
                <div>{{ uItem.name }}</div>
              </template>
              <span
                v-if="uItem.is_see==0"
                class="gray"
              >未阅读</span>
              <span
                v-else
                class="green"
              >已阅读</span>
            </van-cell>
          </div>
        </template>
      </template>
      <van-empty
        v-else
        class="custom-image"
        :image="require('@/assets/images/nodata.png')"
        description="暂无数据"
      />
    </van-skeleton>
    <footer>
      <van-button
        type="default"
        native-type="button"
        @click="handleCancel"
      >
        取消
      </van-button>
      <van-button
        v-if="isSelect"
        type="info"
        :loading="button.loading"
        :loading-text="button.text"
        @click="onSubmit"
      >
        一键催办
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
      required: true
    },
    id: {
      type: Number | String,
      required: true
    },
    type: {
      type: Number | String,
      default: 1
    },
    isSelect: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      userData: [],
      selectData: [],
      loading: true,
      button: {
        loading: false,
        text: "保存中"
      },
      sonUser:'',//子任务负责人
      sonType:false,//页面为子任务负责人
    };
  },
  computed: {
    _show: {
      get: function() {
        return this.show;
      },
      set: function(val) {
        this.$emit("update:show", val);
      }
    }
  },
  watch: {
    show(val) {
      if (val) {
        this.getRemindUser();
      }
    }
  },
  created() {
    this.$bus.on('showSonUser', (data) =>{//显示子任务负责人并蒋子任务负责人传入
      if (data){
        this.sonUser = data
        this.sonType = true
      }
    })
  },
  methods: {
    async getRemindUser() {
      try {
      const { data } = await task.getRemindUser({
        id: this.id,
        type: this.type
      });
      if (this.type == 2) {
        this.userData = data;
        setTimeout(() => {
          this.loading = false;
        }, 100);
        return false;
      }
      data.forEach(item => {
        this.selectData = [];
        for (let i = 0; i < item.user_list.length; i++) {
          if (
            !item.user_list[i].is_leader &&
            !item.user_list[i].receive_status
          ) {
            this.selectData.push(item.user_list[i].userid);
          }
        }
        if (!this.isSelect) {
          item.user_list = item.user_list.filter(user => user.is_leader == 0);
        }
      });
      setTimeout(() => {
        this.loading = false;
      }, 100);
      if (this.sonType){//筛选子责任人
        let _sonUser = this.sonUser.split(',')
       let _sonArr = data?.filter(item =>{
         let _user = item.user_list?.filter(it =>{
           return _sonUser.some(its => its == it.userid)
         })
         item.user_list = _user ? _user : []
         return _user?.length > 0
        })
        // console.log(data)
        // console.log(_sonArr)
      }
      this.userData = data;
      } catch {
        this.loading = false;
      }
    },
    handleCancel() {
      this.sonType = false,
        this.sonUser = '',
      this._show = false;
      this.button.loading = false;
      this.userData = [];
    },
    onSubmit() {
      if (this.selectData.length == 0) {
        return this.$notify({ type: "danger", message: "请选择催办人" });
      }
      this.button.loading = true;
      this.remind();
    },
    async openUser(userid) {
      let that = this;
      if (this.isSelect) {
        return false;
      }
      wx.ready(function() {
        let userId = userid;
        if (userId) {
          let user = userId;
          wx.invoke(
            "openUserProfile",
            {
              type: 1, //1表示该userid是企业成员，2表示该userid是外部联系人
              userid: user //可以是企业成员，也可以是外部联系人
            },
            function(res) {
              if (res.err_msg != "openUserProfile:ok") {
                that.$toast("该成员不是当前企业成员");
              }
            }
          );
        }
      });
    },
    async remind() {
      try {
        const { code, msg } = await task.remind({
          id: this.id,
          userid: this.selectData
        });
        if (code == 1) {
          this.$notify({ type: "success", message: msg });
          this._show = false;
          this.button.loading = false;
        } else {
          this.$notify({ type: "danger", message: msg });
        }
      } catch {
        this.button.loading = false;
        this.$notify({ type: "danger", message: "催办失败" });
      }
    }
  }
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
