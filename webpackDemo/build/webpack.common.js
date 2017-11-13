var webpack = require('webpack');
const path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');


var page = ["index","my","order"];
var plugins = page.map(function (item, index, array) {
    return new HtmlWebpackPlugin({
            filename: path.resolve(__dirname, '../public/' + item + '.html'), //通过模板生成的文件名
            template: path.resolve(__dirname,  '../app/' + item + '.html'),//模板路径
        })
});


module.exports = {
    entry: {
        ajax:path.resolve(__dirname, "../app/ajax.js"),
        main:path.resolve(__dirname,"../app/main.js"),
    },
    output: {//输出
        filename: '[name]_[hash].js',
        path:path.resolve(__dirname, '../public')
    },
    module: {//在配置文件里添加JSON loader
        rules: [
            {
                test: /\.json$/,
                loader: "json-loader"
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',//在webpack的module部分的loaders里进行配置即可
                query: {
                    presets: ['es2015', 'react']
                }
            },
            {
                // test: /.(png|jpg)$/, loader: "url-loader?limit=1024&name=../img/[name]_[hash].[ext]"
                test: /.(png|jpg)$/, loader: "url-loader"
            },
        ]
    },
    plugins: plugins,
};
