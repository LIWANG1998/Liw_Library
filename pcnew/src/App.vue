<template>
    <div id="app">
        <a-config-provider :locale="zh_CN">
            <router-view />
        </a-config-provider>
    </div>
</template>

<script>
    import zh_CN from 'ant-design-vue/lib/locale-provider/zh_CN'
    import 'moment/locale/zh-cn'
    export default {
        name: 'App',
        data() {
            return {
                zh_CN,
            }
        },
        created() {
            this.$loading.show();
            //监听浏览器刷新 就触发加载动画  在home.vue的请求用户接口完毕后关闭loading
            window.addEventListener('beforeunload', () => this.beforeunloadHandler())
        },
        // destroyed () {
        //     window.removeEventListener('beforeunload', e => this.beforeunloadHandler())
        // },
        methods: {
            beforeunloadHandler () {
                this.$loading.show();
                return false
            },
        }
    }
</script>

<style>
    body{
        overflow-y: hidden;
    }
    #app {
        height: 100%;
    }
    * {
        padding: 0;
        margin: 0;
        list-style: none;
        font-family: "PingFang SC", "Microsoft YaHei", SCHeiti, Helvetica;
    }
    /**自定义滚动条样式 */
    ::-webkit-scrollbar {
        width: 6px;
        height: 6px
    }

    ::-webkit-scrollbar-track {
        background-color: transparent;
        -webkit-border-radius: 2em;
        -moz-border-radius: 2em;
        border-radius: 2em;
    }

    ::-webkit-scrollbar-thumb {
        background-color: #9c9da0;
        -webkit-border-radius: 2em;
        -moz-border-radius: 2em;
        border-radius: 2em
    }
</style>
