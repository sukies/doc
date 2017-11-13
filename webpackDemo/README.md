
<h1>webpack配置demo</h1>
<h3>demo为多入口文件配置</h3>
<p>build文件夹为webpack配置内容</p>
<p><a href="build/webpack.common.js">公共配置</a></p>
<p><a href="build/webpack.dev.js">开发环境配置</a></p>
<p><a href="build/webpack.prod.js">生产环境配置</a></p>
<h3>目录结构<h3>
<p>
package.json<br>
build//webpack配置<br>
--webpack.common.js//公共<br>
--webpack.dev.js//开发环境配置<br>
--webpack.prod.js//生产环境配置<br>
public//开发<br>
--js<br>
--css<br>
--img<br>
--main.js//入口文件<br>
app//生产<br>
--js//出口文件<br>
--css<br>
<p>
