// 模块4：业务模块,对外暴露一个对象，包含多个方法

var fs = require("fs");
var path = require("path");
var querystring = require("querystring");
var config = require("./config.js");

module.exports.index = function(req, res){
    readNewsData(function (list){
        //将新闻信息以对象形式作为参数，替换html文件中的模板
        res.render(path.join(config.viewPath,"index.html"),{list: list});
    });
}

module.exports.submit = function(req,res) {
    res.render(path.join(config.viewPath,"submit.html"));
}

module.exports.item = function(req,res){
    readNewsData(function (list_news) {

        var model = null;
        for (var i=0; i<list_news.length ;i++){
            //若用户输入的ID在数据中存在
            if(list_news[i].id.toString() === req.query.id){
                model = list_news[i];
                break;
            }
        }

        if(model){
            res.render(path.join(config.viewPath,"details.html"),{item:model});
        }else {
            res.end("No such item");
        }
    });
}

module.exports.addGet = function(req,res){
    readNewsData(function (list) {
        req.query.id = list.length;

        list.push(req.query);// 将这一次的数据加到list中，此时list里有之前的数据和这一次的数据

        writeNewsData(JSON.stringify(list),function () {
            //重定向
            res.statusCode = 302;
            res.statusMessage = "Found";
            res.setHeader("Location","/");
            res.end();
        })
    })
}

module.exports.addPost = function(req ,res){
    readNewsData(function (list) {

        postBodydata(req,  function (postData) {
            postData.id = list.length;
            list.push(postData);

            writeNewsData(JSON.stringify(list),function () {
                //重定向
                res.statusCode = 302;
                res.statusMessage = "Found";
                res.setHeader("Location", "/");

                res.end();
            });
        })
    });
}

module.exports.static = function(req,res){
    res.render(path.join(__dirname, req.url));
}

module.exports.handleErrors = function(req,res){
    res.writeHead(404,"Not Found",{
        "Content-Type":"text/html ; charset=utf8"
    });
    res.end("404, Page Not Found!");
}




//封装读取data.json函数
function readNewsData(callback) {
    fs.readFile(config.dataPath,"utf8",function (err,data) {
        if (err && err.code !== "ENOENT") {
            throw err;
        }
        var list = JSON.parse(data || "[]");

        callback(list);
    });

}

//封装写入data.json函数
function writeNewsData(data, callback) {
    fs.writeFile(config.dataPath, data, function (err) {
        if (err) {
            throw err;
        }
        callback();
    });
}

//封装获取post提交数据的方法
function postBodydata(req, callback) {
    var array = [];
    req.on("data", function (chunk) {
        array.push(chunk);
    });

    req.on("end", function () {
        // Buffer.concat(array)将array中的所有buffer对象组合成一个buffer对象
        var postBody = Buffer.concat(array);
        //把获取到的buffer对象转换为字符串
        postBody = postBody.toString("utf8");
        //再把查询字符串转换为json对象
        var jsonData = querystring.parse(postBody);

        callback(jsonData);
    });
}