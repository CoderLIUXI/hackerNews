// 模块3：该模块负责封装路由

var handler = require("./handler");

module.exports = function (req,res) {
    if (req.pathname === "/" || req.pathname === "/index" && req.method ==="get"){
        handler.index(req, res);
    }else if (req.pathname === "/submit" && req.method ==="get") {
        handler.submit(req, res);
    }else if (req.url.startsWith("/item") && req.method ==="get") {
        handler.item(req, res);
    }else if (req.url.startsWith("/add") && req.method ==="get") {
        handler.addGet(req, res);
    }else if (req.url.startsWith("/add") && req.method ==="post") {
        handler.addPost(req, res);
    }else if (req.url.startsWith("/resources") && req.method ==="get"){
        handler.static(req,res);
    }
    else {
        handler.handleErrors(req, res);
    }
}