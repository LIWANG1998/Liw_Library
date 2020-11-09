<template>
    <div class="input-area-limit">
        <a-textarea
                placeholder="请输入..." class="input-area-limit"
                :class="inputVal.length > totalLength ? 'border-red' : ''"
                :rows="5" @input="titleChange" v-model="inputVal" :maxLength="totalLength"/>
        <span class="count-length">{{countLength}} / {{totalLength}}</span>
        <p class="overflow-tips" v-show="inputVal.length > totalLength">{{tipsText}}</p>
    </div>
</template>

<script>
    export default {
        name: "textareaLimit",
        props: {
            totalLength: {type: Number, default: 500},
            value: {type: String, default: ''}
        },
        data() {
            return {
                countLength: this.value.length,
                isShow: false,
                inputVal: this.value,
                tipsText: '输入不能超过' + this.totalLength + '字',
            }
        },
        methods: {
            //统计字符数量
            titleChange() {
                this.countLength = this.inputVal.length;
                this.$emit('textAreaVal', this.inputVal)
            },
        }
    }
</script>

<style scoped>
    .input-area-limit {
        position: relative;
        resize: none;
    }

    .count-length {
        background-color: #fff;
        position: absolute;
        right: 5px;
        bottom: 5px;
    }

    .overflow-tips {
        font-size: 14px;
        color: #f5222d;
        position: absolute;
        left: 0;
        bottom: -30px;
    }
    .border-red{
        background-color: #fff;
        border-color: #f5222d!important;
    }
</style>