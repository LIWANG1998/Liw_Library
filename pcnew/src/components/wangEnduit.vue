<template lang="html">
    <div class="editor">
        <div ref="toolbar" class="toolbar"></div>
        <div ref="editor" class="text"></div>
        <span class="count-length">{{countLength}} / 500</span>
        <p class="overflow-tips">{{tipsText}}</p>
    </div>
</template>

<script>
    import E from "wangeditor";
    import emojiJSON from "@/assets/js/emoji.json"; // "src": "https://btsstatic.oss-cn-shanghai.aliyuncs.com/admin/emoji/2.gif"
    export default {
        name: "editoritem",
        data() {
            return {
                // uploadPath,
                editor: null,
                info_: null,
                countLength: 0,
                emojiList: emojiJSON,
                isShow: false,
                tipsText: "",
            };
        },
        model: {
            prop: "value",
            event: "change",
        },
        props: {
            value: {
                type: String,
                default: "",
            },
            isClear: {
                type: Boolean,
                default: false,
            },
        },
        watch: {
            isClear(val) {
                // 触发清除文本域内容
                if (val) {
                    this.editor.txt.clear();
                    this.info_ = null;
                }
            },
            value: function (value) {
                if (value !== this.editor.txt.html()) {
                    this.editor.txt.html(this.value);
                }
                var temp = this.value.replace(/<\/?.+?>/g, "");
                var result = temp.replace(/&nbsp;/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>'); //result为获取冲文字得到后的内容
                // var result = temp.replace(/ /g, ""); //result为获取冲文字得到后的内容

                // 获取img标签
                var re = /<img[^>]+>/g;
                var ImgA = this.value.match(re);
                let imgLen;
                if (ImgA) {
                    imgLen = ImgA.length;
                }
                if (!ImgA) {
                    imgLen = 0;
                }
                // console.log(value.indexOf('&nbsp;'))
                // console.log(value.substr(value.indexOf('&nbsp;'),6));
                this.countLength = imgLen + result.length;
                if (this.countLength <= 0) {
                    this.tipsText = "内容不能为空";
                } else if (this.countLength > 500) {
                    this.tipsText = "输入内容不能超过500字符";
                } else {
                    this.tipsText = "";
                }
                this.editor.txt.html(this.value);
            },
            //value为编辑框输入的内容，这里我监听了一下值，当父组件调用得时候，如果给value赋值了，子组件将会显示父组件赋给的值
        },
        mounted() {
            this.seteditor();
            this.editor.txt.html(this.value);
        },
        methods: {
            seteditor() {
                // http://192.168.2.125:8080/admin/storage/create
                this.editor = new E(this.$refs.toolbar, this.$refs.editor);
                //配置表情
                this.editor.customConfig.emotions = [
                    {
                        title: "默认",
                        type: "image",
                        content: this.emojiList,
                    },
                ];
                // 配置菜单
                this.editor.customConfig.menus = [
                    "head", // 标题
                    "bold", // 粗体
                    "fontSize", // 字号
                    "fontName", // 字体
                    "italic", // 斜体
                    "underline", // 下划线
                    "strikeThrough", // 删除线
                    "foreColor", // 文字颜色
                    "backColor", // 背景颜色
                    // "link", // 插入链接
                    "list", // 列表
                    "justify", // 对齐方式
                    // 'quote', // 引用
                    // "emoticon", // 表情
                    // "undo", // 撤销
                    // "redo", // 重复
                    // "fullscreen", // 全屏
                ];
                // this.editor.customConfig.colors = [
                //     "#000000",
                //     "#333333",
                // ];
                this.editor.customConfig.onchange = (html) => {
                    this.info_ = html; // 绑定当前逐渐地值
                    this.$emit("change", this.info_); // 将内容同步到父组件中
                };
                // 创建富文本编辑器
                this.editor.create();
            },
        },
    };
</script>

<style lang="less">
    .editor {
        width: 100%;
        margin: 0 auto;
        position: relative;
        z-index: 0;
        .w-e-text-container{
            ul,ul li{
                list-style: disc;
            }
            ol,ol li{

                list-style:decimal;
            }
        }

    }

    .toolbar {
        border: 1px solid #d9d9d9;
        height: 36px;
        line-height: 36px;
        border-radius: 4px 4px 0 0;
    }

    .text {
        border-radius: 0 0 4px 4px;
        border: 1px solid #d9d9d9;
        border-top: none;
        height: 200px;
    }

    .overflow-tips {
        font-size: 14px;
        color: #f5222d;
        position: absolute;
        left: 0;
        bottom: -30px;
    }

    .border-red {
        border: 1px solid #f5222d;
    }
</style>