var fs = require('fs');
var sites = [
  {static: 'static/quanben', targetUrl: 'https://www.quanben.net', formatHtml: './public/format/quanben.js', source: ['localhost:8081']},
  {static: 'static/quanben_m', targetUrl: 'https://m.quanben.net', formatHtml: './public/format/quanben.js', source: ['localhost:8082']},
  {static: 'static/win4000', targetUrl: 'http://www.win4000.com', originStaticUrl: 'http://static.win4000.com', formatHtml: './public/format/win4000.js', source: ['localhost:8083']},
]
var common = {
  site: function (req) {
    var host = req.headers['host'];
    return currSite = sites.filter(function (item) {
      return item.source.indexOf(host) > -1;
    })[0];
  },
  mk_dir: function (ph) {
    var vm = this;
    var noPath = false;
    try {
      fs.accessSync('.' + ph, fs.F_OK);
    } catch (e) {
      noPath = true;
    }
    if (noPath) {
      fs.mkdirSync('.' + ph, function (err) {
        if(err){
          vm.mk_dir(ph)
        }
      });
    }
    return noPath
  },
  getFile: function (url) {
    var urlStr = '';
    var urlSplit = url.split('/');
    for (var i = 0; i < urlSplit.length; i++) {
      if (urlSplit[i] && urlSplit[i].indexOf('.') <= -1) {
        urlStr +=  '/' + urlSplit[i]
        this.mk_dir(urlStr);
      }
    }
    if (url.indexOf('.') <= -1) {
      var slash = urlSplit[urlSplit.length - 1] ? '/' : ''
      url += slash + 'index.html'
    }
    return url
  },
  getContType: function (value) {
    var contType = {
      "css": "text/css",
      "gif": "image/gif",
      "html": "text/html",
      "php": "text/html",
      "ico": "image/x-icon",
      "jpeg": "image/jpeg",
      "jpg": "image/jpeg",
      "js": "text/javascript",
      "json": "application/json",
      "pdf": "application/pdf",
      "png": "image/png",
      "svg": "image/svg+xml",
      "swf": "application/x-shockwave-flash",
      "tiff": "image/tiff",
      "txt": "text/plain",
      "wav": "audio/x-wav",
      "wma": "audio/x-ms-wma",
      "wmv": "video/x-ms-wmv",
      "xml": "text/xml"
    }
    var result = contType[value];
    if (result) {
      return result;
    } else {
      return 'text/html'
    }
  },
  writeJson: function writeJson(params){
    return new Promise((resolve, reject) => {
      fs.readFile('./time.json', function(err, data){
        if(err){
          console.error(err, 'writeJson');
          reject(err);
          return;
        }
        var person = data.toString();//将二进制的数据转换为字符串
        person = JSON.parse(person);//将字符串转换为json对象
        if (params.typeof == 'object') {
          person.data.push(params);//将传来的对象push进数组对象中
          var str = JSON.stringify(person);//因为nodejs的写入文件只认识字符串或者二进制数，所以把json对象转换成字符串重新写入json文件中
          fs.writeFile('./time.json',str,function(err){
            if(err){
                console.error(err);
            }
            resolve()
          })
        } else {
          var currentData = person.data.filter(item => item.url == params)[0]
          if (currentData) {}
        }
      })
    })
  }
}

module.exports = common;