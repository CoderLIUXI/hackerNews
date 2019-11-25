// 模块2：负责扩展req和res对象

var url = require("url");
var fs = require("fs");
var mime = require("mime");
var _ = require("underscore");

//让当前模块对外暴露一个函数，用来将index.js中的res,req传递给context.js
module.exports = function (req,res) {
    var urlObj = url.parse(req.url.toLowerCase(),true);
    req.query = urlObj.query;
    req.pathname = urlObj.pathname;

    req.method = req.method.toLowerCase();

    res.render = function (filename, tplData) {
        fs.readFile(filename,function (err,data) {
            if (err){
                res.writeHead(404,"Not Found",{
                    "Content-Type" : "text/html; charset=utf8"
                });
                res.end("404, not Found");
                return;
            }
            //如果传入了此参数，那么将读取到的data转换为字符串,
            if (tplData){
                var fn = _.template(data.toString("utf8"));
                data = fn(tplData);// 再传入tplData(data.json转成的对象)
            }

            res.setHeader("Content-Type",mime.getType(filename));
            res.end(data);
        });
    }
}

