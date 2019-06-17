var request = require("request");
var cheerio = require('cheerio');
const iconv = require('iconv-lite');
// var resour = 'https://www.quanben.net';
// var resour2 = 'https://m.quanben.net';

var friendly = [];

var ip = [
    '14.192.76.22',
    '27.54.72.21',
    '27.224.0.14',
    '36.0.32.19',
    '36.37.40.21',
    '36.96.0.11',
    '39.0.0.24',
    '39.0.128.17',
    '40.0.255.24',
    '40.251.227.24',
    '42.0.8.21',
    '42.1.48.21',
    '42.1.56.22',
    '42.62.128.19',
    '42.80.0.15',
    '42.83.64.20',
    '42.96.96.21',
    '42.99.112.22',
    '42.99.120.21',
    '42.100.0.14',
    '42.157.128.20',
    '42.187.96.20',
    '42.194.64.18',
    '42.248.0.13',
    '43.224.212.22',
    '43.225.236.22',
    '43.226.32.19',
    '43.241.88.21',
    '43.242.64.22',
    '43.247.152.22',
    '45.116.208.24',
    '45.120.243.24'
];
function getAjax(url) {
    return new Promise((resolve, reject) => {
        var options = {
            method: 'GET',
            url: url,
            gzip: true,
            encoding: null,
            headers: {
                "X-Forwarded-For": ip[Math.floor(Math.random() * ip.length)] || '42.194.64.18',
                'User-Agent': 'Mozilla/8.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.101 Safari/537.36',
                'referer': 'http://baidu.com',
                'Cookie': "PHPSESSID=88f1qocpntbtjnp990pkqvo3a4; UM_distinctid=16846df58e71c8-0735f5020bd16-10326653-13c680-16846df58e8f22; CNZZDATA1273706240=1075868105-1547372666-http%253A%252F%252Fmvxoxo.com%252F%7C1547431260; CNZZDATA1275906764=206766016-1547375436-http%253A%252F%252Fmvxoxo.com%252F%7C1547430243"
            }
        };
        request(options, function (error, response, body) {
            if (response && response.statusCode === 404) {
                reject(response.statusMessage);
                return;
            }
            try {
                if (error) throw error;
                var buf = iconv.decode(body, 'utf-8');//获取内容进行转码
                var htmlHeadCharset = '';
                var htmlHeadContent = '';
                var decodeHtmlData;
                var charset = '';
                $ = cheerio.load(buf);


                $('meta', 'head').each(function (i, e) {

                    htmlHeadCharset = $(e).attr('charset');
                    htmlHeadContent = $(e).attr('content');

                    if (typeof (htmlHeadCharset) != 'undefined') {

                        charset = htmlHeadCharset;
                    }

                    if (typeof (htmlHeadContent) != 'undefined') {

                        if (htmlHeadContent.match(/charset=/ig)) {

                            index = htmlHeadContent.indexOf('=');
                            charset = htmlHeadContent.substring(index + 1);
                        }
                    }
                });

                //此处为什么需要对整个网页进行转吗，是因为cheerio这个组件不能够返回buffer,iconv则无法转换之
                if (charset.match(/gb/ig)) {

                    decodeHtmlData = iconv.decode(body, 'gbk');
                }
                else {//因为有可能返回的网页中不存在charset字段，因此默认都是按照utf8进行处理

                    decodeHtmlData = iconv.decode(body, 'utf8');
                }
                $ = cheerio.load(decodeHtmlData);
                resolve();
            } catch (e) {
                console.log(options.url, 'eeeeeeeß')
                reject(e);
            }
        })
    });
}

var addScript = "<script>if((navigator.userAgent.match(/(iPhone|iPod|Android|ios)/i))){var _url = document.domain;if(_url.indexOf('m.sexs8.com') == -1){window.location.href = 'm.sexse.com';}}</script>";
var rel = /https\:\/\/www\.quanben\.net|\/\/www\.quanben\.net|http\:\/\/www\.quanben\.net|https\:\/\/\.quanben\.net|http\:\/\/\.quanben\.net|www\.quanben\.net/ig;
var rel2 = /https\:\/\/m\.quanben\.net|\/\/m\.quanben\.net|http\:\/\/m\.quanben\.net|m\.quanben\.net/ig;
function getHtml(req, resour) {
    var url = req.url;
    var rsr = resour;
    return new Promise((resolve, reject) => {
        getAjax(rsr+url).then(function () {
            var script = $('script');
            var alist = $('a');
            var head = $('head');
            var title = $('title');
            var body = $('body');
            var style = $('link');
            var imgs = $('img');
            var form = $('form');
            // var titleTxt = title.text();
            // title.text(titleTxt + '_阿顺小说');
            script.each(function () {
                var src = $(this).attr('src');
                if (src && src.indexOf('quanben.net') > -1) {
                    $(this).attr('src', src.replace(rel, '').replace(rel2, ''));
                } else {
                    $(this).remove();
                }
            });
            style.each(function () {
                var src = $(this).attr('href');
                if (src && src.indexOf('quanben.net') > -1) {
                    $(this).attr('href', src.replace(rel, '').replace(rel2, ''));
                }
            });
            imgs.each(function () {
                var src = $(this).attr('src');
                $(this).attr('onerror', '');
                if (src) {
                    if (src.indexOf('http') > -1) {
                        if (src.indexOf('m.quanben.net') > -1) {
                            $(this).attr('src', src.replace(rel2, ''));
                        } else {
                            $(this).attr('src', src.replace(rel, ''));
                        }
                    }
                }
            });
            form.each(function () {
                var src = $(this).attr('action');
                if (src) {
                    $(this).attr('action', src.replace(rel, ''));
                }
            });
            for (var i = 0; i < alist.length; i++) {
                var hf = $(alist[i]).attr('href');
                var txt = $(alist[i]).text();
                var hfRe = '';
                if (txt == '投推荐票' || txt == '加入书架' || txt == '错误举报' || txt == '会员登陆' || txt == '用户注册' || txt == '加入书签' || txt == '我的书架' || hf == '/mybook.php') {
                    $(alist[i]).remove();
                } else {
                    if (hf) {
                        if (hf.indexOf('www.quanben.net') > -1 || (hf.indexOf('quanben.net') > -1 && hf.indexOf('m.quanben.net') <= -1)) {
                            hfRe = hf.replace(rel, '');
                        } else if (hf.indexOf('m.quanben.net') > -1) {
                            hfRe = hf.replace(rel2, '');
                        } else if (hf.indexOf('javascript:') > -1 || hf == '#top' || hf == '/') {
                            hfRe = hf;
                        } else if (hf.indexOf('http') > -1 && hf.indexOf('quanben.net') <= -1) {
                            hfRe = '';
                        } else {
                            hfRe = hf;
                        }
                        $(alist[i]).attr('href', hfRe);
                    }
                }
            }
    
            var friendHtml = '';
            for (var a = 0; a < friendly.length; a++) {
                friendHtml += '<a href="' + friendly[a].url + '" rel="nofollow" target="_blank">' + friendly[a].name + '</a>'
            }
            $('#notice').remove();
            $('.item-youlian').html(friendHtml);
            // head.append('<meta name="referrer" content="never">');
            head.append(addScript);
           
            // body.append("<script>var imgUrl='//www'+'.quanben'+'.net';var imgs = document.querySelectorAll('img');for(var i = 0; i < imgs.length; i++){var src = imgs[i].getAttribute('src');if(src.indexOf('imgStatic') > -1){imgs[i].setAttribute('src', src.replace('imgStatic', imgUrl));}}</script>");
            var html = $.html();
            html = html.replace('全本小说', '阿顺小说');
            html = html.replace(/&#x5168;&#x672C;&#x5C0F;&#x8BF4;/g, '&#x963F;&#x987A;&#x5C0F;&#x8BF4;');
            html = html.replace(rel2, 'http://m.sexs8.com');
            html = html.replace(rel, 'http://www.sexs8.com');
            resolve(html)
        }).catch(err => {
            reject(err)
        })
    })
}

module.exports = getHtml;