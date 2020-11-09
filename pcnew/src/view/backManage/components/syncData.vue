<template>
    <div v-if="_show">
        <a-modal
                title="同步组织架构"
                :visible.sync="_show"
                width="550px"
                centered
                @cancel="_show = false"
                @ok="handleSync"
        >
            <div class="content">
                <a-row type="flex" justify="space-between" class="title">
                    <a-col
                    >
                        <a-icon
                                type="exclamation-circle"
                                theme="filled"
                                :style="{ color: '#ffbe00', fontSize: '22px' }"
                        />
                        同步组织架构
                    </a-col>
                    <a-col>
                        <a-button type="link" @click="secretShow = true">
                            如何获取通讯录secret?
                        </a-button>
                    </a-col>
                </a-row>
                <div class="input">
                    <a-input type="password" v-model="secret"></a-input>
                </div>
                <div>
                    请确认企业微信后台【轻松任务】应用可见范围内，<br/>
                    包含您本人，否则同步后您将被禁止登录!
                </div>
            </div>
        </a-modal>
        <a-modal
                title="通讯录secret获取方法"
                width="700px"
                centered
                :visible="secretShow"
                @cancel="secretShow = false"
                @ok="secretShow = false"
        >
            <a-carousel arrows :dots="false" class="swiper">
                <div
                    slot="prevArrow"
                    class="custom-slick-arrow"
                    style="left: 10px;zIndex: 1"
                    >
                <a-icon type="left" />
                </div>
                <div slot="nextArrow" class="custom-slick-arrow" style="right: 10px">
                    <a-icon type="right"/>
                </div>
                <div>
                    <div class="img"><img src="@/assets/images/depart/step1.png"/></div>
                    <div class="text">
                        <p class="step-title">第一步</p>
                        <p class="step-conut">
                            打开企业微信管理后台，点击「登录」，以管理员身份企业微信扫码登录。
                        </p>
                    </div>
                </div>
                <div>
                    <div class="img"><img src="@/assets/images/depart/step2.png"/></div>
                    <div class="text">
                        <p class="step-title">第二步</p>
                        <p class="step-conut">
                            登录成功后，在菜单栏点击「管理工具」，进入以后点击「通讯录同步」。
                        </p>
                    </div>
                </div>
                <div>
                    <div class="img"><img src="@/assets/images/depart/step3.png"/></div>
                    <div class="text">
                        <p class="step-title">第三步</p>
                        <p class="step-conut">
                            进入该界面后，在secret栏，直接复制对应链接。
                        </p>
                    </div>
                </div>
                <div>
                    <div class="img"><img src="@/assets/images/depart/step4.png"/></div>
                    <div class="text">
                        <p class="step-title">第四步</p>
                        <p class="step-conut">
                            将复制的链接粘贴至secret输入框，点击「确定」同步成功！
                        </p>
                    </div>
                </div>
                <div>
                    <div class="img"><img src="@/assets/images/depart/step5.png"/></div>
                    <div class="text">
                        <p class="step-title">第五步</p>
                        <p class="step-conut">
                            将复制的链接粘贴至secret输入框，点击“确定”同步成功！
                        </p>
                    </div>
                </div>
            </a-carousel>
        </a-modal>
        <a-modal
                title="同步中"
                :visible="progressShow"
                centered
                width="680px"
                @cancel="progressShow = false"
        >
            <template slot="footer">
                <a-button key="submit" type="primary" @click="handleBackGround">
                    后台同步
                </a-button>
            </template>
            <div style="margin-top: 10px">提示</div>
            <div style="margin-top: 10px">
                1、建议<span class="blue">企业微信</span
            >管理员先将需要使用部门或员工加入企业微信的应用可见范围中
            </div>
            <div style="margin-bottom: 10px">
                2、更新组织架构后，会根据<span class="blue">企业微信</span
            >中设置的可见范围来显示组织架构；显示为层级结构，同时会显示可见部门的上级部门
            </div>
            <a-progress :percent="percent" status="active"/>
            <div style="margin-top: 10px">
                您可点击“后台同步”按钮，关闭该窗口并在后台继续更新
            </div>
        </a-modal>
    </div>
</template>
<script>
    import {common} from "@/api";

    export default {
        props: ["show"],
        data() {
            return {
                loading: true,
                secret: "",
                secretShow: false,
                confirmLoading: false,
                progressShow: false,
                percent: 0,
                hide: "",
            };
        },
        watch: {
            _show(val) {
                if (val) {
                    this.getSecretData();
                }
            },
        },
        computed: {
            _show: {
                get: function () {
                    return this.show;
                },
                set: function (val) {
                    this.$emit("update:show", val);
                },
            },
        },
        methods: {
            async getSecretData() {
                const {data} = await common.getSecret();
                this.secret = data.secret;
            },
            async handleSync() {
                this.percent = 0;
                if (this.secret) {
                    let interval = setInterval(() => {
                        this.percent = this.percent + 2;
                        if (this.percent >= 80) clearInterval(interval);
                    }, 300);
                    this.progressShow = true;
                    this.hide = this.$message.loading("同步中...", 0);
                    const {code, msg} = await common.syncData({secret: this.secret});
                    setTimeout(() => {
                        clearInterval(interval);
                        setTimeout(this.hide, 0);
                    }, 600)
                    if (code) {
                        setTimeout(() => {
                            this.$message.success(msg);
                            this.$emit("update");
                            this.progressShow = false;
                            setTimeout(()=>{
                                this.$router.go(0)
                            },1000)
                        }, 2000)
                    } else {
                        setTimeout(() => {
                            this.$message.error(msg);
                            this.progressShow = false;
                        }, 2000)
                    }
                } else {
                    this.$message.error("请输入通讯录secret");
                }
            },
            handleBackGround() {
                this.progressShow = false;
                setTimeout(this.hide, 0);
            },
        },
    };
</script>
<style lang="less" scoped>
    .ant-carousel .slick-slide {
        text-align: center;
        height: 160px;
        line-height: 160px;
        background: #364d79;
        overflow: hidden;
    }

    .ant-carousel .slick-prev {
        left: 0;
    }

    .ant-carousel .custom-slick-arrow {
        font-size: 36px;
        color: #d2d2d2;
        top: 40%;
    }

    .ant-carousel .custom-slick-arrow:before {
        display: none;
    }

    .ant-carousel .custom-slick-arrow:hover {
        opacity: 0.5;
    }

    .content {
        padding: 20px;
        font-size: 14px;

        .title {
            line-height: 50px;
            font-size: 16px;

            /deep/ .ant-btn {
                padding: 0;

                span {
                    font-size: 14px;
                }
            }
        }

        .input {
            margin-bottom: 10px;

            input {
                height: 40px;
                line-height: 40px;
                border-radius: 0;
            }
        }
    }

    .swiper {
        .img {
            img {
                display: block;
                width: 80%;
                margin: 20px auto;
            }
        }

        .text {
            width: 80%;
            margin: 0 auto;
        }

        .step-title {
            font-size: 24px;
            color: #333333;
            line-height: 50px;
            font-weight: 500;
        }

        .step-count {
            font-size: 14px;
            color: #333333;
            line-height: 30px;
        }
    }
</style>
