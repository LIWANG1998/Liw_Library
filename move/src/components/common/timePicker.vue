<template>
    <div class="time-warp" v-show="showTime">
        <van-datetime-picker
                v-model="currentDate"
                :type="type"
                title="选择年月日"
                :min-date="minDate"
                :max-date="maxDate"
                @cancel="cancel" @confirm="confirm"
                :formatter="formatter"
        />
    </div>
</template>

<script>
    import {formatDate} from '@/utils/utils'

    export default {
        name: "timePicker",
        props: {
            showTime: {
                type: Boolean,
                default: () => false
            },
            type: {
                type: String,
                default: () => 'date'
            }
        },
        data() {
            return {
                minDate: new Date(2020, 0, 1),
                maxDate: new Date(2025, 10, 1),
                currentDate: new Date(),
            }
        },
        methods: {
            confirm(value) {
                this.type == 'year-month' ? value = formatDate(value, 'yyyy年MM月') : value = formatDate(value, 'yyyy/MM/dd')
                this.$emit('getTime', value)
                this.$emit('update:showTime', false)
            },
            cancel() {
                this.$emit('update:showTime', false)
            },
            formatter(type, val) {
                if (this.type == 'year-month') {
                    if (type === 'year') {
                        return `${val}年`;
                    } else if (type === 'month') {
                        return `${val}月`;
                    }

                }
                return val;
            }
        }
    }
</script>

<style scoped lang="scss">
    .time-warp {
        position: fixed;
        bottom: 0;
        right: 0;
        left: 0;
        z-index: 99999;
    }

</style>