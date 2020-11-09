const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');

function resolve(dir) {
  return path.join(__dirname, dir)
}
module.exports = {
  productionSourceMap: false,
  chainWebpack: (config) => {
    //修改文件引入自定义路径
    config.resolve.alias
      .set('@', resolve('src'))
      .set('assets', resolve('src/assets'))
    config.module
      .rule('images')
      .use('url-loader')
      .loader('url-loader')
  },
  configureWebpack: config => {
    config.plugins.forEach((val) => {
      if (val instanceof HtmlWebpackPlugin) {
        val.options.title = "轻松任务"
      }
    })
  },
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: []
    },
  },
  css: {
    loaderOptions: {
      less: {
        lessOptions: {
          modifyVars: {
            'primary-color': '#0082EF',
            'link-color': '#0082ef',
            'border-radius-base': '4px',
          },
          javascriptEnabled: true,
        },
      },
    },
  },
  devServer: {
    // 设置代理
    host: '0.0.0.0',
    proxy: {
      "/api": {
        //目标接口域名
        // target: 'http://tast.mgtx-tech-dev.mgtx.com.cn',
        // target: 'http://www.task.com',
        // target: ' http://temp-dev-task.mgtx.com.cn/',
        // target: 'http://192.168.8.71:8090',//郑新
        target: 'http://192.168.8.250:9090',//小花花
        ws: false, // 是否启用websockets
        changOrigin: true, //开启代理
        pathRewrite: {
          "^/api": "/"//重写接口,后面可以使重写的新路径，一般不做更改
        }
      },
    }
    // https: true
  },
  publicPath: process.env.NODE_ENV === 'production' ? './' : './' // 打包文件访问路径
}
