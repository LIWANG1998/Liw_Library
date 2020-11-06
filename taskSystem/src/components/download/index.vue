<template>
  <van-popup
    v-model="showPop"
    class="main"
  >
    <van-icon
      name="cross"
      size="20"
      class="close"
      @click="close"
    />
    <div class="content">
      {{ title }}
    </div>
    <div class="van-hairline--top van-dialog__footer van-dialog__footer--buttons">
      <van-button
        type="default"
        size="large"
        class="btn"
        @click="cancel"
      >
        {{ cancelText }}
      </van-button>
      <van-button
        type="default"
        size="large"
        class="btn confirm"
        @click="confirm"
      >
        {{ confirmText }}
      </van-button>
    </div>
  </van-popup>
</template>

<script>
export default {
  name: "",
  data() {
    return {
      title: "下载文件",
      confirmText: "确定",
      cancelText: "取消",
      showPop: true
    };
  },
  methods: {
    show(cb) {
      typeof cb === "function" && cb.call(this, this);
      return new Promise(resolve => {
        this.resolve = resolve;
      });
    },
    confirm() {
      this.resolve("confirm");
      this.hide();
    },
    cancel() {
      this.resolve("cancel");
      this.hide();
    },
    close() {
      this.hide();
    },
    hide() {
      document.body.removeChild(this.$el);
      this.$destroy();
    }
  }
};
</script>

<style scoped>
.main {
  border-radius: 10px;
  overflow: hidden;
  width: 85%;
}
.close {
  position: absolute;
  right: 10px;
  top: 10px;
  color: #666;
}
.content {
  color: #424242;
  font-size: 14px;
  padding: 20px;
  text-align: center;
  margin: 30px 0 20px;
}
.btn-grounp {
  margin-top: 15px;
  display: flex;
  justify-content: flex-end;
}
.btn {
  border: none;
}
.confirm {
  color: #0082ef;
  border-left: 1px solid #ebedf0;
}
</style>
