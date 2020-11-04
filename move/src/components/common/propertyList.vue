<template>
    <div class="property-list-warp">
        <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
            <van-list
                    v-model="loading"
                    finished="finished"
                    @load="onLoad"
                    finished-text="没有更多了"
            >
                <slot v-for="item in propertyList" name="propertyItem" :propertyItem="item" />
            </van-list>
        </van-pull-refresh>
    </div>
</template>

<script>
    export default {
        name: "propertyList",
        props: {
            propertyList: {
                type: Array,
                default: () => []
            }
        },
        data() {
            return {
                loading: false,
                finished: false,
                refreshing: false,
            }
        },
        methods: {
            onLoad() {
                // console.log(123456)
                setTimeout(() => {
                    if (this.refreshing) {
                        // this.propertyList = [];
                        this.$emit("update:propertyList", []) //修改外部传过来的值
                        this.refreshing = false;
                    }

                    for (let i = 0; i < 1; i++) {
                        let array = this.propertyList;
                        const item = this.propertyList[i];
                        array.push(item)
                        this.$emit("update:propertyList", array) //外部的值变成新的
                        // this.propertyList.push(item);
                    }
                    this.loading = false;

                    if (this.propertyList.length >= 1) {
                        this.finished = true;
                    }
                }, 1000);
            },
            onRefresh() {
                // 清空列表数据
                this.finished = false;
                // 重新加载数据
                // 将 loading 设置为 true，表示处于加载状态
                this.loading = true;
                this.onLoad();
            },
        },
        created() {
            // console.log(this.loading)
        }
    }
</script>

<style scoped lang="scss">

</style>