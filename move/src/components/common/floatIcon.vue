<template>
    <router-link tag="div" class="icon-warp" :to="to">
        <van-icon :name="icon" size="30" class="icon"/>
    </router-link>
</template>

<script>
    export default {
        name: "floatIcon",
        props: {
            to: {
                type: String,
                default: () => ''
            },
            icon: {
                type: String,
                default: () => ''
            }
        }
    }
</script>

<style scoped lang="scss">
    .icon-warp {
        position: fixed;
        right: 10px;
        bottom: 10%;
        z-index: 99;
        width: 60px;
        height: 60px;
        background: linear-gradient(52deg, #0082EF, #04A9FE);
        border-radius: 100%;
        box-shadow: 0 0 6PX #6DBCFF;
        display: flex;
        align-items: center;
        justify-content: center;

        .icon {
            display: block;
        }

    }

</style>