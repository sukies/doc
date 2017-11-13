var webpack = require('webpack');
const path = require('path');
const merge = require('webpack-merge');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');//清除缓存文件（hash值）
var CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin");//公共的部分不打包
const common = require('./webpack.common');

module.exports = merge(common, {
    devtool: 'source-map',
    output: {//输出
        filename: '[name]_[hash].js',
        path:path.resolve(__dirname, '../public/js')
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({fallback: "style-loader", use: ["css-loader"]}),
            },
            {
                test: /.less$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: ["css-loader", {
                        loader: "less-loader",
                        options: {
                            /* ... */
                        }
                    }]
                }),
            },
        ]
    },
    plugins: [
        new CleanWebpackPlugin(
            ['public/js', 'public/css', 'public/img'],　 //匹配删除的文件
            {
                root: path.resolve(__dirname, '../'),       　　　　　　　　　　//根目录
                verbose: true,        　　　　　　　　　　//开启在控制台输出信息
                dry: false        　　　　　　　　　　//启用删除文件
            }
        ),
        new ExtractTextPlugin("../css/style_[hash].css"),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'main' // 指定公共 bundle 的名称。
        }),
        new webpack.optimize.UglifyJsPlugin({sourceMap: true}),

    ]
});