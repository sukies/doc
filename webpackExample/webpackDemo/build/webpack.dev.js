const path = require('path');
const merge = require('webpack-merge');//用户引入webpack.common.js的配置，无需重写相同的配置
var webpack = require('webpack');
const common = require('./webpack.common');

module.exports = merge(common, {
    devtool: 'eval-source-map',
    //输出
    output: {
        filename: '[name].js',
        path:path.resolve(__dirname, '../public')//开发环境中，输出的js要在输出文件夹的根目录，不能在根目录里面
    },
    module:{
        rules:[
            {
                test: /\.css$/,
                loader: 'style-loader!css-loader!postcss-loader'
            },
            {
                test: /.less$/,
                loader: 'style-loader!css-loader!postcss-loader!less-loader'
            },
        ]
    },
    devServer: {
        contentBase: path.resolve(__dirname, '../public'),//本地服务器所加载的页面所在的目录
        inline: true,//实时刷新
    },
});
