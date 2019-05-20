UA = navigator.userAgent.toLowerCase();
url = window.location;
url = url.toString();
if((UA.indexOf('iphone') != -1 || UA.indexOf('mobile') != -1 || UA.indexOf('android') != -1 || UA.indexOf('ipad') != -1 || UA.indexOf('windows ce') != -1 || UA.indexOf('ipod') != -1) && UA.indexOf('ipod') == -1) {
if (url.match(/^http:\/\/www\.quanben\.net\/$/) || url.match(/^http:\/\/www\.quanben\.net$/)) { Go('http:\/\/m\.quanben\.net'); }
if (url.match(/\/list\/1_1.html/))  {Go('http://m.quanben.net/sort-1-1/');}
if (url.match(/\/list\/2_1.html/))  {Go('http://m.quanben.net/sort-2-1/');}
if (url.match(/\/list\/3_1.html/))  {Go('http://m.quanben.net/sort-3-1/');}
if (url.match(/\/list\/4_1.html/))  {Go('http://m.quanben.net/sort-4-1/');}
if (url.match(/\/list\/5_1.html/))  {Go('http://m.quanben.net/sort-5-1/');}
if (url.match(/\/list\/6_1.html/))  {Go('http://m.quanben.net/sort-6-1/');}
if (url.match(/\/list\/7_1.html/))  {Go('http://m.quanben.net/sort-7-1/');}
if (url.match(/\/list\/8_1.html/))  {Go('http://m.quanben.net/sort-8-1/');}
if (url.match(/\/quanben.html/))      {Go('http://m.quanben.net/full-1/');}
if (url.match(/\/topbook\/lastupdate\//))  {Go('http://m.quanben.net/top-lastupdate-1/');}
if (url.match(/\/topbook\/allvisit\//))  {Go('http://m.quanben.net/top-allvisit-1/');}

if (url.match(/\/book\/(\d+)/)){id = url.match(/\/book\/(\d+)/);Go('http://m.quanben.net/info-' + id[1] + '/');}

if (url.match(/\/.*\/\d+?\//)) {id = url.match(/\/.*\/(\d+?)\//);idxx=parseInt(id[1]/1000);Go('http://m.quanben.net/'+idxx+'/'+id[1]+'/');}

if (url.match(/\/.*\/\d+?\/\d+?\.html/)){id = url.match(/\/.*\/(\d+?\/\d+?)\.html/);Go('http://m.quanben.net/'+idxx+'/'+id[1]+'.html');}
}
function Go(url) { window.location = url;}