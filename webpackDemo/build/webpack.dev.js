const path = require('path');
const merge = require('webpack-merge');
var webpack = require('webpack');
const common = require('./webpack.common');

module.exports = merge(common, {
    devtool: 'eval-source-map',
    output: {//输出
        filename: '[name].js',
        path:path.resolve(__dirname, '../public')
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