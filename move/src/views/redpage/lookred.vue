<template>
  <div class="lookred init">
    <div class="lookred-box"
    >
      <div class="content"
           v-html="content"></div>
    </div>

<!--        <div class="tool">-->
<!--          <div class="scale">-->
<!--            <div class="tosmall"-->
<!--                 @click="tosmall"></div>-->
<!--            <div class="scale-num">{{ size }}%</div>-->
<!--            <div class="tobig"-->
<!--                 @click="tobig"></div>-->
<!--          </div>-->
<!--        </div>-->
  </div>
</template>
<script>
export default {
  name: 'lookred',
  data() {
    return {
      content: '',
      size: 100,
    }
  },
  created() {
    this.content = this.$route.query.content
  },
  methods: {
    tosmall() {
      if (this.size <= 50) {
        return
      }
      this.size -= 10
    },
    tobig() {
      if (this.size >= 200) {
        return
      }
      this.size += 10
    },
  },
}
</script>
<style lang="scss" scoped>
.lookred {
  height: 100%;
  width: 100vw;
  background-color: white;
  padding-top: 20px;
  //overflow: auto;

  $scale_num: 414 / 700;

  /deep/ .lookred-box {
    width: 700px;
    transform: scale($scale_num);
    transform-origin: top left;
    //width: 100%;
    //text-align: center;
    //border-bottom: 3px 、solid #f56c6c;
    transition: all 0.4s;

    .content {
      margin: 0 auto;
      width: 558px;
    }

    /deep/ p,
    pre {
      text-indent: 0px !important;
    }

    * {
      position: relative !important;
      max-width: 558px !important;
      word-break: break-all !important;
      word-wrap: break-word !important;
      white-space: pre-wrap !important;

    }
  }

  .tool {
    margin-top: 600px;
    display: flex;
    align-items: center;
    justify-content: center;

    .scale {
      display: flex;
      position: fixed;
      left: 50%;
      transform: translate(-50%);
      align-items: center;
      justify-content: space-between;
      width: 128px;
      background: #f6f6f6;
      border-radius: 22px;

      .tosmall {
        width: 40px;
        height: 40px;
        background: url('../../assets/img/document/tosmall.png');
        background-size: 40px 40px;
      }

      .scale-num {
        font-size: 14px;
        font-family: PingFang SC;
        font-weight: 500;
        line-height: 22px;
        color: #aaaaaa;
      }

      .tobig {
        width: 40px;
        height: 40px;
        background: url('../../assets/img/document/tobig.png');
        background-size: 40px 40px;
      }
    }
  }
}
</style>