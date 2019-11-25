// 模块1：（服务模块）负责启动服务
// 模块2：（扩展模块）负责扩展req和res对象，增加更方便好用的API
// 模块3：（路由模块）负责进行路由判断
// 模块4：（业务模块）负责处理具体路由的业务代码
// 模块5：（数据操作模块）负责进行数据库操作
// 模块6：（配置模块）负责保存各种项目中用到的配置信息

var http = require("http");

var context = require("./context.js");
var router = require("./router.js");
var config = require("./config.js");

http.createServer(function (req,res) {

    context(req, res);// 引用模块2

    router(req, res);//引入模块3

}).listen(config.port,function () {
    console.log("success! port:"+config.port);
})


