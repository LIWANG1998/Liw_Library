const path = require("path");
const theme = path.resolve(__dirname, "src/assets/theme/index.less");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin')
function resolve(dir) {
    return path.join(__dirname, dir)
}
const {
    NODE_ENV
} = process.env

const DEV = NODE_ENV === 'development'

module.exports = {
    publicPath: !DEV ? './' : '/',
    outputDir: 'dist',
    assetsDir: 'static',
    lintOnSave: false,
    productionSourceMap: false,
    chainWebpack: (config) => {
        //修改文件引入自定义路径
        config.resolve.alias
            .set('@', resolve('src'))
            .set('assets', resolve('src/assets'))
        // config.plugin('prefetch').tap(options => {
        //     options[0].fileBlacklist = options[0].fileBlacklist || []
        //     options[0].fileBlacklist.push(/myasyncRoute(.)+?\.js$/)
        //     return options
        // })
        config.externals({
            'vue': 'Vue',
            'vue-router': 'VueRouter',
            'vuex': 'Vuex',
            'axios': 'axios',
            "moment": "moment",
            "vant": "vant",
        })
        config.module
            .rule('images')
            .use('url-loader')
            .loader('url-loader')
            .tap(options => Object.assign(options, { limit: 1000 }))
        const svgRule = config.module.rule('svg') // 找到svg-loader
        svgRule.uses.clear() // 清除已有的loader, 如果不这样做会添加在此loader之后
        svgRule.exclude.add(/node_modules/) // 正则匹配排除node_modules目录
        svgRule // 添加svg新的loader处理
            .test(/\.svg$/)
            .use('svg-sprite-loader')
            .loader('svg-sprite-loader')
            .options({
                symbolId: 'icon-[name]',
            })
    },
    configureWebpack: config => {
        config.plugins.forEach((val) => {
            if (val instanceof HtmlWebpackPlugin) {
                val.options.title = "轻松任务"
            }
        })
        if (process.env.NODE_ENV === "production") {
            // 为生产环境修改配置...
            config.mode = "production";
            // 这里修改下
            config.optimization.minimizer = [new TerserPlugin({
                parallel: 4, // 并行打包
                terserOptions: {
                    ecma: undefined,
                    warnings: false,
                    parse: {},
                    compress: {
                        drop_debugger: false,  // 除了这两句是我加的，基他都是默认配置
                        drop_console: true
                    },
                    mangle: false, // Note `mangle.properties` is `false` by default.
                    module: false,
                    output: null,
                    toplevel: false,
                    nameCache: null,
                    ie8: false,
                    keep_classnames: undefined,
                    keep_fnames: false,
                    safari10: false,
                }
            })]
            return {
                plugins: [new CompressionPlugin({
                    test: /\.js$|\.html$|\.css/, //匹配文件名
                    threshold: 10240, //对超过10k的数据进行压缩
                    deleteOriginalAssets: false //是否删除原文件
                })]
            }
        } else {
            // 为开发环境修改配置...
            config.mode = "development";
        }
    },
    css: {
        loaderOptions: {
            less: {
                modifyVars: {
                    hack: `true; @import "${theme}";`
                }
            },
        }
    },
    devServer: {
        // 设置代理
        host: '0.0.0.0',
        proxy: {
            "/api": {
                //目标接口域名
                // target: 'http://tast.mgtx-tech-dev.mgtx.com.cn',
                // target: 'http://www.task.com',
                target: 'http://192.168.8.250:9090',//小花花的ip
                // target: 'http://192.168.8.71:8090',//小新新的ip
                ws: false, // 是否启用websockets
                changOrigin: true, //开启代理
                pathRewrite: {
                    "^/api": "/"//重写接口,后面可以使重写的新路径，一般不做更改
                }
            }
        }
        // https: true
    },
}
