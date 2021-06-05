var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
// const CleanWebpackPlugin = require('clean-webpack-plugin');//清除缓存文件（hash值）
// var CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin");//公共的部分不打包

var page = ["index", "order", "my"];
var plugins = page.map(function (item, index, array) {
    return new HtmlWebpackPlugin({
            filename: __dirname + '/public/' + item + '.html', //通过模板生成的文件名
            template: __dirname + '/app/' + item + '.html',//模板路径
        }
    )
});
plugins.push(new webpack.optimize.UglifyJsPlugin());
// plugins.push(new ExtractTextPlugin("../css/style_[hash].css"));
// plugins.push(new CleanWebpackPlugin(
//     ['public/js', 'public/css', 'public/img'],　 //匹配删除的文件
//     {
//         root: __dirname,       　　　　　　　　　　//根目录
//         verbose: true,        　　　　　　　　　　//开启在控制台输出信息
//         dry: false        　　　　　　　　　　//启用删除文件
//     }
// ));
// plugins.push(new webpack.optimize.CommonsChunkPlugin({
//     name: 'main' // 指定公共 bundle 的名称。
// }));

module.exports = {
    devtool: 'eval-source-map',//配置生成Source Maps，选择合适的选项
    entry: {
        main: __dirname + "/app/main.js",//已多次提及的唯一入口文件
    },
    output: {//输出
        filename: '[name]_[hash].js',
        path: __dirname + '/public/js'
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
                test: /\.css$/,
                // exclude:node_modules,
                loader: 'style-loader!css-loader!postcss-loader'
                // use: ExtractTextPlugin.extract({fallback: "style-loader", use: ["css-loader"]}),
            },
            {
                test: /.less$/,
                // use: ExtractTextPlugin.extract({
                //     fallback: "style-loader",
                //     use: ["css-loader", {
                //         loader: "less-loader",
                //         options: {
                //             /* ... */
                //         }
                //     }]
                // }),
                loader: 'style-loader!css-loader!postcss-loader!less-loader'
            },
            {
                test: /.(png|jpg)$/, loader: "url-loader?limit=1024&name=../img/[name]_[hash].[ext]"
            },
        ]
    },
    plugins: plugins,
    devServer: {
        contentBase: __dirname + "/public",//本地服务器所加载的页面所在的目录
        inline: true//实时刷新
    }
};
