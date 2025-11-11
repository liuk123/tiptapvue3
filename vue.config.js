// const { defineConfig } = require('@vue/cli-service')
// module.exports = defineConfig({
//   transpileDependencies: true
// })
const webpack = require('webpack')
const VirtualModulesPlugin = require('webpack-virtual-modules')
const fs = require('fs')
const path = require('path')


// 获取所有模块
const getModulesCount = () => fs.readdirSync('./src-modules/').length

const modules = ['demo', 'demo2']

let buildDynamicModules = []

if(modules){
  buildDynamicModules = modules.map((module, index)=>{
    console.log(`编译模块(${index + 1})：${module}\n`)

    const modulePath = path.join(__dirname, `./src-modules/${module}/index.js`);
    if (!fs.existsSync(modulePath)) {
      console.error(`\n\n错误：模块 "${module}" 的入口文件不存在于 ${modulePath}！\n`);
      process.exit(1); // 使用非0退出码表示错误
    }
    return `require.context("@modules/${module}", false, /index\\.js$/)`
  })
}else{
  // eslint-disable-next-line no-console
  console.log(`全部模块，总共：${getModulesCount()} 个，建议采用模块化按需编译方式！\n`)
  buildDynamicModules.push('require.context("@modules", true, /^\\.\\/[a-zA-Z]+\\/index\\.js$/)')
}

// 创建虚拟模块文件（hack）
const virtualModules = new VirtualModulesPlugin({
  'node_modules/vue-dynamic-modules.js': `module.exports = [${buildDynamicModules.join(',')}];`
})

const isPro = process.env.NODE_ENV === 'production'

const serverProxy = require('./dev.server.proxy.js')

module.exports={
  runtimeCompiler: true,
  lintOnSave: 'error',
  devServer: {
    port: 4201,
    proxy: serverProxy,
    client:{
      overlay: {
        warnings: true,
        errors: true
      }
    }
  },
  publicPath: isPro ? './' : '/',
  productionSourceMap: false,
  css: {
    loaderOptions: {
      less: {
        lessOptions: {
          javascriptEnabled: true
        }
      }
    }
  },
  configureWebpack: {
    optimization: {
      runtimeChunk: 'single',
      splitChunks: {
        chunks: 'all', // 对所有类型的 chunk 进行拆分（包括异步和同步）
        maxSize: 244000, // 尝试拆分超过 ~244KB 的块（适用于 HTTP/2/3）
        cacheGroups: {
          libs: {
            name: 'chunk-libs',
            test: /[\\/]node_modules[\\/]/,
            priority: 20, // 优先级较高
            chunks: 'initial',
            reuseExistingChunk: true
          },
          vue: {
            name: 'chunk-vue',
            test: /[\\/]node_modules[\\/](vue|vuex|vue-router)[\\/]/,
            priority: 30, // 优先级最高
            chunks: 'initial',
            reuseExistingChunk: true
          },
        }
      }
    },
    module: {
      rules: [
        {
          test: /\.(png|jpe?g|gif|webp|svg)(\?.*)?$/,
          use: [
            {
              loader: 'url-loader',
              options: {
                limit: 8192, // 小于 8KB 的图片转为 base64
                fallback: {
                  loader: 'file-loader',
                  options: {
                    name: 'img/[name].[hash:8].[ext]',
                    esModule: false
                  }
                }
              }
            },
            // 生产环境下对图片进行压缩
            ...(isPro
              ? [
                  {
                    loader: 'image-webpack-loader',
                    options: {
                      mozjpeg: { progressive: true, quality: 65 },
                      optipng: { enabled: false },
                      pngquant: { quality: [0.65, 0.9], speed: 4 },
                      gifsicle: { interlaced: false }
                      // 更多选项请参考对应文档
                    }
                  }
                ]
              : [])
          ]
        }
      ]
    },
    resolve: {
      alias: {
        '@modules': path.resolve(process.cwd(), 'src-modules'),
        '@': path.resolve(process.cwd(), 'src'),
        // Rx: path.join(__dirname, 'node_modules', 'rxjs')
      }
    },
    plugins: [
      new webpack.ProvidePlugin({
        // PubSub: 'pubsub-js',
        // dayjs: 'dayjs',
        // $: 'jquery',
      }),
      virtualModules
    ],
    cache: {
      type: 'filesystem', // 使用文件系统缓存
      buildDependencies: {
        config: [__filename], // 当本配置文件改变时，缓存失效
      },
    },
  },
  chainWebpack: config => {
    if (process.env.use_analyzer) {
      config
        .plugin('webpack-bundle-analyzer')
        .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin)
    }
    if (isPro) {
      config.plugin('extract-css').use(require('mini-css-extract-plugin'), [
        {
          ignoreOrder: true,
          filename: 'css/[name].[contenthash:8].css',
          chunkFilename: 'css/[name].[contenthash:8].css'
        }
      ]);
    }
    config.plugins.delete('preload')
    config.plugins.delete('prefetch')
  }
}