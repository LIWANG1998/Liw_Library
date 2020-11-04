<template>
    <div class="picker-warp">
        <van-picker
                :title="title"
                show-toolbar
                :columns="columns"
                @cancel="cancel"
                @confirm="confirm"
        />
    </div>
</template>

<script>
    export default {
        name: "picker",
        props: {
            showPicker: {
                type: Boolean,
                default: () => false
            },
            title: {
                type: String,
                default: () => ''
            }
        },
        data() {
            return {
                columns: ['张三', '李四', '王五', '小明', '校长'],
            }
        },
        methods: {
            cancel() {
                this.$emit('update:showPicker', false)
            },
            confirm(value) {
                this.$emit('getPickerValue', value)
                this.$emit('update:showPicker', false)

            }
        }
    }
</script>

<style scoped lang="scss">
    .picker-warp {
        position: fixed;
        bottom: 0;
        right: 0;
        left: 0;
        z-index: 99999;
    }
</style>