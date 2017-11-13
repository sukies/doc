var webpack = require('webpack');
const path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');


/**
*多页面，对于public文件中的index.html,my.html,order.html打包到app文件件夹内
*/
var page = ["index","my","order"];
var plugins = page.map(function (item, index, array) {
    return new HtmlWebpackPlugin({
            filename: path.resolve(__dirname, '../public/' + item + '.html'), //通过模板生成的文件名
            template: path.resolve(__dirname,  '../app/' + item + '.html'),//模板路径
        })
});


module.exports = {
    //入口文件
    entry: {
        ajax:path.resolve(__dirname, "../app/ajax.js"),
        main:path.resolve(__dirname,"../app/main.js"),
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
                // test: /.(png|jpg)$/, loader: "url-loader?limit=1024&name=../img/[name]_[hash].[ext]"//用于将png，jpg的图片打包到img文件夹
                test: /.(png|jpg)$/, loader: "url-loader"//将图片转为数据流内嵌在css文件内
            },
        ]
    },
    plugins: plugins,
};
