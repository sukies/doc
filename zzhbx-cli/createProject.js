let chalk = require("chalk");
let fs = require("fs");
let path = require("path");
require("shelljs/global");

var log = function (txt) {
  console.log(chalk.magenta.bold(txt));
};

function createProject(name, type) {
  var p = process.cwd();
  cd(p);

  if (fs.existsSync(name)) {
    log("project exsits,plese rename it");
    process.exit();
  }

  var np = path.join(__dirname, "template", type);
  console.log(np);
  // return
  cp("-R", np + "/", name);
  log("复制" + type + "项目源文件成功！");

  cd(name);
  log("设置淘宝镜像---npm config set registry http://registry.npm.taobao.org");
  exec("npm config set registry http://registry.npm.taobao.org");
  log("安装模块---npm install");
  exec("npm install");


}

module.exports=createProject