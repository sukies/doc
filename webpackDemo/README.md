
<h1>webpack配置demo</h1>
<h3>demo为多入口文件配置</h3>
<p>build文件夹为webpack配置内容</p>
<p><a href="build/webpack.common.js">公共配置</a></p>
<p><a href="build/webpack.dev.js">开发环境配置</a></p>
<p><a href="build/webpack.prod.js">生产环境配置</a></p>
<h3>目录结构</h3>
<div>
package.json<br>
  <br>
build//webpack配置<br>
--webpack.common.js//公共<br>
--webpack.dev.js//开发环境配置<br>
--webpack.prod.js//生产环境配置<br>
  <br>
public//开发<br>
--js<br>
--css<br>
--img<br>
--main.js//入口文件<br>
  <br>
app//生产<br>
--js//出口文件<br>
--css<br>
<div>
  <h3>学习总结</h3>
  <h5>1.webpack安装</h5>
安装命令：npm install webpack -g<br>
查看：webpack -v<br>
安装到项目目录：npm install --save-dev webpack<br>

<h5>2.创建项目</h5>
进入项目文件夹，输入命令：npm init，一路回车<br>
完成后会自动创建package.json文件<br>

<h5>3.正式使用webpack</h5>
 1.命令：$ webpack （入口文件） （编译后文件）<br>

 2.webpack编译<br>
在项目根目录下新建webpack.config.js<br>

输入内容<br>

<p style="pre-line:pre-line;">module.exports = {
  entry:  __dirname + "/app/main.js",//已多次提及的唯一入口文件
  output: {
    path: __dirname + "/public",//打包后的文件存放的地方
    filename: "bundle.js"//打包后输出文件的文件名
  }
}</p>

在终端输入$ webpack<br>
 3.在package.json文件配置<br>



在终端输入$npm webpack //如果不是start，则为$npm run （名字）<br>

3.实现自动更新<br>
1.安装webpack-dev-server<br>

安装命令：$npm install -g --save-dev webpack-dev-server　　//-g 全局模式<br>

在webpack.config.js文件添加代码<br>

devServer: {<br>
contentBase:__dirname+ "/public",//本地服务器所加载的页面所在的目录<br>
inline: true//实时刷新<br>
}<br>
