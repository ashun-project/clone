var express = require('express');
var fs = require('fs');
var request = require('request');
var getHtml = require('./htmlTxt');
var common = require('./common');
var app = express();
var static = './static';
var targetUrl = 'https://www.quanben.net';
app.use('/public', express.static('public'));

app.all('/*', function(req, res, next) {
  if (req.url == '/favicon.ico') {
    res.end()
    return
  }

  var reqUrl = common.getFile(req.url).split('?')[0];
  var resource = fs.existsSync(static+reqUrl);
  var houZ = reqUrl.split('.')[1];
  if (!resource) {
    if (common.getContType(houZ) === 'text/html') {
      getHtml(req).then(function(data) {
        if (houZ !== 'php') {
          fs.writeFileSync(static+reqUrl, data);
        }
        res.writeHead(200, {'Content-Type': common.getContType(houZ)})
        res.end(data);
      }).catch(err => {
        res.writeHead(404, {'Content-Type': 'text/html'})
        var content = fs.readFileSync(static+'/404.html', "binary");
        res.write(content, "binary")
        res.end();
      })
    } else {
      request({
        url: targetUrl + req.url,   // 请求的URL
        method: 'GET',                   // 请求方法
        headers: {                       // 指定请求头
          'Accept-Language': 'zh-CN,zh;q=0.8',         // 指定 Accept-Language
          'Cookie': '__utma=4454.11221.455353.21.143;' // 指定 Cookie
        }
      }).pipe(fs.createWriteStream(static+reqUrl)).on('finish',function() {
        var content = fs.readFileSync(static+reqUrl, "binary");
        res.writeHead(200, {'Content-Type': common.getContType(houZ)})
        res.write(content, "binary")
        res.end();
      })
    }
  } else {
    var expireTime = 0;
    if (common.getContType(houZ) === 'text/html') {
      var stat = fs.statSync(static+reqUrl);
      var exTime = stat.mtime.getTime();
      var nowTime = new Date().getTime();
      var expireTime = (nowTime - exTime) / 1000 / 60 / 60;
    }
    if (expireTime > 8) {
      getHtml(req).then(function(data) {
        fs.writeFileSync(static+reqUrl, data);
        res.writeHead(200, {'Content-Type': common.getContType(houZ)})
        res.end(data);
      })
    } else {
      var content =  fs.readFileSync(static+reqUrl,"binary");
      res.writeHead(200, {'Content-Type': common.getContType(houZ)})
      res.write(content, "binary")
      res.end();
    }
  }
})
var server = app.listen(8081)