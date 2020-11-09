<template>
    <div class="layuimini-loader"  v-if="show">
        <div class="layuimini-loader-inner"></div>
    </div>
</template>

<script>
    export default {
        name: "loading",
        props: {
            show: Boolean
        },
        data() {
            return {
            }
        }
    }
</script>

<style scoped>
    /**初始化加载层*/
    .layuimini-loader {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        /*background-color: #ffffff;*/
        background-color: rgba(255,255,255,0.6);
        z-index: 999999;
    }

    .layuimini-loader .layuimini-loader-inner {
        display: block;
        position: relative;
        left: 50%;
        top: 50%;
        width: 150px;
        height: 150px;
        margin: -75px 0 0 -75px;
        border-radius: 50%;
        border: 3px solid transparent;
        border-top-color: #1E9FFF;
        animation: spin 2s linear infinite;
    }

    .layuimini-loader .layuimini-loader-inner:before {
        content: "";
        position: absolute;
        top: 5px;
        left: 5px;
        right: 5px;
        bottom: 5px;
        border-radius: 50%;
        border: 3px solid transparent;
        border-top-color: #1E9FFF;
        animation: spin 3s linear infinite;
    }

    .layuimini-loader .layuimini-loader-inner:after {
        content: "";
        position: absolute;
        top: 15px;
        left: 15px;
        right: 15px;
        bottom: 15px;
        border-radius: 50%;
        border: 3px solid transparent;
        border-top-color: #1E9FFF;
        animation: spin 1.5s linear infinite;
    }

    @keyframes spin {
        0% {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(1turn);
        }
    }

</style>