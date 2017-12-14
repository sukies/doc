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
                test: /.(css|less)$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: [
                        {
                        loader: 'css-loader',
                        options: {
                            minimize: true //css压缩
                        }
                    },
                        {
                            loader: "postcss-loader",
                            options: {
                                plugins: function () {
                                    return [
                                        require('autoprefixer')({
                                            browsers: ["iOS >= 7", "Android >= 4", "> 5%"]
                                        })
                                    ]
                                }
                            }
                        },
                        {
                            loader: "less-loader",
                        }]
                }),
            },
            {
                test: /.(png|jpg)$/, loader: "url-loader?limit=1024&name=../img/[name].[ext]"
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
