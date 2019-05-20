function killerrors() {
	return true; 
}
window.onerror = killerrors;

//jieqi common

//取得一个对象，相当于getElementById()
function GetObjcet() {
  var elements = new Array();
  for (var i = 0; i < arguments.length; i++) {
    var element = arguments[i];
    if (typeof element == 'string') element = document.getElementById(element);
	Method.Element.apply(element);
    if (arguments.length == 1) return element;
    elements.push(element);
  }
  return elements;
}

//把它接收到的单个的参数转换成一个Array对象。
function GetObjcetA(list){
	var arr = [];
	for (var i=0,len=list.length; i<len; i++){arr[i] = list[i];}
	return arr;
}

//常用函数扩展
var Method = {
	Element	: function(){
		this.hide = function(){this.style.display="none"; return this;};
		this.show = function(){this.style.display=""; return this;};
		this.getValue = function(){if(this.value===undefined) return this.innerHTML; else return this.value;};
		this.setValue = function(s){if(this.value === undefined) this.setInnerHTML(s); else this.value = s;};
		this.subTag = function(){return GetObjcetA(this.getElementsByTagName(arguments[0])).each(function(n){GetObjcet(n);});};
		this.remove = function(){return this.parentNode.removeChild(this);};
		this.nextElement = function(){var n = this;	for(var i=0,n; n = n.nextSibling; i++) if(n.nodeType==1) return GetObjcet(n); return null;};
		this.previousElement = function(){var n = this;	for (var i=0,n; n = n.previousSibling; i++) if(n.nodeType==1) return GetObjcet(n); return null;};
		this.getPosition =  function(){var e = this; var t=e.offsetTop; var l=e.offsetLeft; while(e=e.offsetParent){if(GetObjcet(e).getStyle('position') == 'absolute' || GetObjcet(e).getStyle('position') == 'relative') break; t+=e.offsetTop; l+=e.offsetLeft;} return {x:l, y:t};};
		this.getStyle = function(name){ if(this.style[name]) return this.style[name]; else if(this.currentStyle) return this.currentStyle[name]; else if(document.defaultView && document.defaultView.getComputedStyle){ name = name.replace(/([A-Z])/g,"-GetObjcet1").toLowerCase(); var s = document.defaultView.getComputedStyle(this,""); return s && s.getPropertyValue(name); } else return null;};
		this.setInnerHTML = function(s){var ua = navigator.userAgent.toLowerCase();s = s.replace(/<script([^>]+)src\s*=\s*\"([^>\"\']*)\"([^>]*)>\s*<\/script>/gi,'');if (ua.indexOf('msie') >= 0 && ua.indexOf('opera') < 0){ s = '<div style="display:none">for IE</div>' + s; s = s.replace(/<script([^>]*)>/gi,'<scriptGetObjcet1 defer>'); this.innerHTML = '';this.innerHTML = s;	this.removeChild(this.firstChild);}else{var el_next = this.nextSibling; var el_parent = this.parentNode; el_parent.removeChild(this); this.innerHTML = s; if(el_next) el_parent.insertBefore(this, el_next); else el_parent.appendChild(this);}};

		
	},
	Array :	function(){
		this.indexOf = function(){for (i=0; i<this.length; i++) if (this[i]==arguments[0]) return i; return -1;};
		this.each = function(fn){for (var i=0,len=this.length; i<len; i++){	fn(this[i],i);} return this;};
	},
	String : function(){
		this.trim = function(){var _re,_argument = arguments[0] || " ";	typeof(_argument)=="string"?(_argument == " "?_re = /(^\s*)|(\s*GetObjcet)/g : _re = new RegExp("(^"+_argument+"*)|("+_argument+"*GetObjcet)","g")) : _re = _argument; return this.replace(_re,"");};
		this.stripTags = function(){return this.replace(/<\/?[^>]+>/gi, '');};
		this.cint = function(){return this.replace(/\D/g,"")*1;};
		this.hasSubString = function(s,f){if(!f) f="";return (f+this+f).indexOf(f+s+f)==-1?false:true;};
	}
};

Method.Array.apply(Array.prototype);
Method.String.apply(String.prototype);

//form相关函数
var Form = {
	//把表格内容转化成string
  serialize: function(form) {
    var elements = Form.getElements($(form));
    var queryComponents = new Array();
    for (var i = 0; i < elements.length; i++) {
      var queryComponent = Form.Element.serialize(elements[i]);
      if (queryComponent) queryComponents.push(queryComponent);
    }
    return queryComponents.join('&');
  },
  //取得表单内容为数组形式
  getElements: function(form) {
    form = $(form);
    var elements = new Array();
    for (tagName in Form.Element.Serializers) {
      var tagElements = form.getElementsByTagName(tagName);
      for (var j = 0; j < tagElements.length; j++)
        elements.push(tagElements[j]);
    }
    return elements;
  },
  //disable表单所有内容
  disable: function(form) {
    var elements = Form.getElements(form);
    for (var i = 0; i < elements.length; i++) {
      var element = elements[i];
      element.blur();
      element.disabled = 'true';
    }
  },
  //enable表单所有内容
  enable: function(form) {
    var elements = Form.getElements(form);
    for (var i = 0; i < elements.length; i++) {
      var element = elements[i];
      element.disabled = '';
    }
  },
  //Reset表单
  reset: function(form) {
    $(form).reset();
  }
}

//form里面元素定义
Form.Element = {
  serialize: function(element) {
    element = $(element);
    var method = element.tagName.toLowerCase();
    var parameter = Form.Element.Serializers[method](element);
    if (parameter) {
      var key = encodeURIComponent(parameter[0]);
      if (key.length == 0) return;
      if (parameter[1].constructor != Array) return key + '=' + encodeURIComponent(parameter[1]);
	  tmpary = new Array();
	  for (var i = 0; i < parameter[1].length; i++) {
		  tmpary[i] = key + encodeURIComponent('[]') + '=' + encodeURIComponent(parameter[1][i]);
	  }
      return tmpary.join('&');
    }	
  },
  getValue: function(element) {
    element = $(element);
    var method = element.tagName.toLowerCase();
    var parameter = Form.Element.Serializers[method](element);
    if (parameter) return parameter[1];
  }
}

Form.Element.Serializers = {
  input: function(element) {
    switch (element.type.toLowerCase()) {
      case 'submit':
      case 'hidden':
      case 'password':
      case 'text':
        return Form.Element.Serializers.textarea(element);
      case 'checkbox':
      case 'radio':
        return Form.Element.Serializers.inputSelector(element);
    }
    return false;
  },

  inputSelector: function(element) {
    if (element.checked) return [element.name, element.value];
  },

  textarea: function(element) {
    return [element.name, element.value];
  },

  select: function(element) {
    return Form.Element.Serializers[element.type == 'select-one' ? 'selectOne' : 'selectMany'](element);
  },

  selectOne: function(element) {
    var value = '', opt, index = element.selectedIndex;
    if (index >= 0) {
      opt = element.options[index];
      value = opt.value;
      if (!value && !('value' in opt))
        value = opt.text;
    }
    return [element.name, value];
  },

  selectMany: function(element) {
    var value = new Array();
    for (var i = 0; i < element.length; i++) {
      var opt = element.options[i];
      if (opt.selected) {
        var optValue = opt.value;
        if (!optValue && !('value' in opt))
          optValue = opt.text;
        value.push(optValue);
      }
    }
    return [element.name, value];
  }
}

//取form里面物件的值，等同于Form.Element.getValue()
var $F = Form.Element.getValue;

//ajax处理
function jieqi_ajax() {
	this.init = function() {
		this.handler = null;
		this.method = "POST";
  		this.queryStringSeparator = "?";
		this.argumentSeparator = "&";
		this.URLString = "";
		this.encodeURIString = true;
  		this.execute = false;
		this.requestFile = null;
		this.vars = new Object();
		this.responseStatus = new Array(2);
		this.failed = false;
		this.response = "";
		this.asynchronous = true;

		this.onLoading = function() { };
  		this.onLoaded = function() { };
  		this.onInteractive = function() { };
  		this.onComplete = function() { };
  		this.onError = function() { };
		this.onFail = function() { };

		try {
			this.handler = new ActiveXObject("Msxml2.XMLHTTP");
		} catch (e) {
			try {
				this.handler = new ActiveXObject("Microsoft.XMLHTTP");
			} catch (e) {
				this.handler = null;
			}
		}

		if (! this.handler) {
			if (typeof XMLHttpRequest != "undefined") {
				this.handler = new XMLHttpRequest();
			} else {
				this.failed = true;
			}
		}
  	};
	this.setVar = function(name, value, encoded){
		this.vars[name] = Array(value, encoded);
	};
	this.encVar = function(name, value, returnvars) {
		if (true == returnvars) {
			return Array(encodeURIComponent(name), encodeURIComponent(value));
		} else {
			this.vars[encodeURIComponent(name)] = Array(encodeURIComponent(value), true);
		}
	};
	this.processURLString = function(string, encode) {
		//regexp = new RegExp(this.argumentSeparator + "|" + encodeURIComponent(this.argumentSeparator));
		regexp = new RegExp(this.argumentSeparator);
		varArray = string.split(regexp);
		for (i = 0; i < varArray.length; i++){
			urlVars = varArray[i].split("=");
			if (true == encode){
				this.encVar(urlVars[0], urlVars[1], false);
			} else {
				this.setVar(urlVars[0], urlVars[1], true);
			}
		}
	};
	this.createURLString = function(urlstring) {
		if (urlstring) {
			if (this.URLString.length) {
				this.URLString += this.argumentSeparator + urlstring;
			} else {
				this.URLString = urlstring;
			}
		}
		this.setVar("ajax_request", new Date().getTime(), false);
		urlstringtemp = new Array();
		for (key in this.vars) {
			if (false == this.vars[key][1] && true == this.encodeURIString) {
				encoded = this.encVar(key, this.vars[key][0], true);
				delete this.vars[key];
				this.vars[encoded[0]] = Array(encoded[1], true);
				key = encoded[0];
			}
			urlstringtemp[urlstringtemp.length] = key + "=" + this.vars[key][0];
		}
		if (urlstring){
			this.URLString += this.argumentSeparator + urlstringtemp.join(this.argumentSeparator);
		} else {
			this.URLString += urlstringtemp.join(this.argumentSeparator);
		}
	};
	this.runResponse = function() {
		eval(this.response);
	};
	this.runAJAX = function(urlstring) {
		if (this.failed) {
			this.onFail();
		} else {
			if(this.requestFile.indexOf(this.queryStringSeparator) > 0){
				var spoint = this.requestFile.indexOf(this.queryStringSeparator);
				this.processURLString(this.requestFile.substr(spoint + this.queryStringSeparator.length), false);
				this.requestFile = this.requestFile.substr(0, spoint);
			}
			this.createURLString(urlstring);
			if (this.handler) {
				var self = this;
				
				if (this.method == "GET") {
					totalurlstring = this.requestFile + this.queryStringSeparator + this.URLString;
					this.handler.open(this.method, totalurlstring, this.asynchronous);
				} else {
					this.handler.open(this.method, this.requestFile, this.asynchronous);
					try {
						this.handler.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
					} catch (e) { }
				}

				this.handler.onreadystatechange = function() {
					switch (self.handler.readyState) {
						case 1:
							self.onLoading();
							break;
						case 2:
							self.onLoaded();
							break;
						case 3:
							self.onInteractive();
							break;
						case 4:
							self.response = self.handler.responseText;
							self.responseXML = self.handler.responseXML;
							self.responseStatus[0] = self.handler.status;
							self.responseStatus[1] = self.handler.statusText;

							if (self.execute) {
								self.runResponse();
							}

							if (self.responseStatus[0] == "200") {
								self.onComplete();
							} else {
								self.onError();
							}

							self.URLString = "";
							break;
					}
				}
				this.handler.send(this.method == "GET" ? null : this.URLString);
			}
		}
	};
	this.submitForm = function(form) {
		if(this.requestFile == null) this.requestFile = GetObjcet(form).attributes["action"].value;
		this.runAJAX(Form.serialize(form));
	};
	this.init();
}

var Ajax = {
	Request	: function(vname, vars){
		var ajax = new jieqi_ajax();
		var param = {method:"",parameters:"",asynchronous:true,onLoading:function(){},onLoaded:function(){},onInteractive:function(){},onComplete:function(){},onError:function(){},onFail:function(){}};
		for (var key in vars) param[key] = vars[key];
		if(param["parameters"] != "") ajax.processURLString(param["parameters"], false);
		ajax.asynchronous = param["asynchronous"];
		ajax.onLoading = param["onLoading"];
		ajax.onLoaded = param["onLoaded"];
		ajax.onInteractive = param["onInteractive"];
		ajax.onError = param["onError"];
		ajax.onFail = param["onFail"];
		ajax.onComplete = param["onComplete"];
		if(GetObjcet(vname) != null && GetObjcet(vname).tagName.toLowerCase() == "form"){
			ajax.method = param["method"]=="" ? "POST" : param["method"];
			ajax.submitForm(vname);
		}else{
			ajax.method = param["method"]=="" ? "GET" : param["method"];
			ajax.requestFile = vname;
			ajax.runAJAX();
		}
	},
	Update : function(vname, vars){
		var param = {outid:"",tipid:"",onLoading:"", outhide:0, cursor:"wait", parameters:""};
		for (var key in vars) param[key] = vars[key];

		var isform = (GetObjcet(vname) != null && GetObjcet(vname).tagName.toLowerCase() == "form") ? true : false;

		if(typeof param["onLoading"] == 'function'){
			var doLoading = param["onLoading"];
		}else{
			var doLoading = function(){
				if(param["cursor"] != "") document.body.style.cursor=param["cursor"];
				if(param["tipid"] != null && param["tipid"] != "") {GetObjcet(param["tipid"]).setValue(param["onLoading"]);GetObjcet(param["tipid"]).show();}
				if(isform) Form.disable(vname);
			}
		}
		var doComplete = function(){
			if(param["cursor"] != "") document.body.style.cursor="auto";
			if(param["tipid"] != null && param["tipid"] != "") {GetObjcet(param["tipid"]).setValue("");GetObjcet(param["tipid"]).hide();}
			if(param["outid"] != "") {GetObjcet(param["outid"]).setValue(this.response);GetObjcet(param["outid"]).show();}
			if(param["outhide"] != "") {setTimeout(function(){GetObjcet(param["outid"]).hide()},param["outhide"]);}
			if(isform) Form.enable(vname);
		}
		var doError = function(){
			if(param["outid"] != "")  GetObjcet(param["outid"]).setValue("ERROR:"+this.responseStatus[1]+"("+this.responseStatus[0]+")");
			if(isform) Form.enable(vname);
		}
		var doFail = function() {
			alert("Your browser does not support AJAX!");
			if(isform) Form.enable(vname);
		}
		
		Ajax.Request(vname, {onLoading:doLoading, onComplete:doComplete, onError:doError, onFail:doFail, parameters:param["parameters"]});
	},
	Tip : function(event, url, timeout){
		event = event ? event : (window.event ? window.event : null);
		timeout = timeout ? timeout : 3000;
		var eid = event.srcElement ? event.srcElement.id : event.target.id;
		var tid = eid + "_tip";
		var ele = GetObjcet(eid);
		var pos = ele.getPosition();
		var atip  = GetObjcet(tid);
		if(!atip) {
			atip = document.createElement("div");
			atip.id = tid;
			atip.style.display = "none";
			atip.className = "ajaxtip";
			document.body.appendChild(atip);
			atip.onclick = function(){GetObjcet(tid).hide();};
		}
		atip.style.top = (pos.y + ele.offsetHeight + 2)  + "px";
		atip.style.left = pos.x + "px";
		atip.innerHTML = "";
		atip.style.display="";
		this.Update(url, {outid:tid, tipid:tid, onLoading:"Loading...", outhide:timeout, cursor:"wait"});
	}
}

//常用功能函数
function pageWidth(){
	return window.innerWidth != null ? window.innerWidth : document.documentElement && document.documentElement.clientWidth ? document.documentElement.clientWidth : document.body != null ? document.body.clientWidth : null;
}

function pageHeight(){
	return window.innerHeight != null? window.innerHeight : document.documentElement && document.documentElement.clientHeight ? document.documentElement.clientHeight : document.body != null? document.body.clientHeight : null;
}

function pageTop(){
	return typeof window.pageYOffset != 'undefined' ? window.pageYOffset : document.documentElement && document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop ? document.body.scrollTop : 0;
}

function pageLeft(){
	return typeof window.pageXOffset != 'undefined' ? window.pageXOffset : document.documentElement && document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft ? document.body.scrollLeft : 0;
}

function showMask(){
	var sWidth,sHeight;
	sWidth = document.body.scrollWidth;
	sWidth = window.screen.availWidth > document.body.scrollWidth ? window.screen.availWidth : document.body.scrollWidth;
	sHeight = window.screen.availHeight > document.body.scrollHeight ? window.screen.availHeight : document.body.scrollHeight;
	var mask = document.createElement("div");
	mask.setAttribute('id','mask');
	mask.style.width = sWidth + "px";
	mask.style.height = sHeight + "px";
	mask.style.zIndex = "5000";
	document.body.appendChild(mask);
}

function hideMask(){
	var mask = document.getElementById("mask");
	if(mask != null){
		if(document.body) document.body.removeChild(mask); 
		else document.documentElement.removeChild(mask); 
	}
}

var dialogs = new Array();

function displayDialog(html){
	var dialog;
	dialog = document.getElementById("dialog");
	if(dialog != null) closeDialog();
	dialog = document.createElement("div");
	dialog.setAttribute('id','dialog');
	dialog.style.zIndex = "6000";
	if(document.all){
		dialog.style.width = "250px";
		dialog.style.height = "150px";
	}
	document.body.appendChild(dialog);
	//GetObjcet("dialog").setInnerHTML( html + '<!--iframe src="" frameborder="0" style="position:absolute;visibility:inherit;top:0px;left:0px;width:expression(this.parentNode.offsetWidth);height:expression(this.parentNode.offsetHeight);z-index:-1;filter=\'progid:DXImageTransform.Microsoft.Alpha(style=0,opacity=0)\';"></iframe-->');
	GetObjcet("dialog").setInnerHTML( html);
	var dialog_w = parseInt(dialog.scrollWidth);
	var dialog_h = parseInt(dialog.scrollHeight);
	if(dialog_w < 300){
		dialog.style.width = "250px";
		dialog_w = parseInt(dialog.clientWidth);
	}else{
		dialog.style.width = dialog_w + "px";
	}
	if(dialog_h < 200){
		dialog.style.height = "150px";
		dialog_h = parseInt(dialog.clientHeight);
	}else{
		dialog.style.height = dialog_h + "px";
	}
	var page_w = pageWidth(); 
	var page_h = pageHeight();
	var page_l = pageLeft();
	var page_t = pageTop();

	var dialog_top = page_t + (page_h / 2) - (dialog_h / 2);
	if(dialog_top < page_t) dialog_top = page_t;
	var dialog_left = page_l + (page_w / 2) - (dialog_w / 2);
	if(dialog_left < page_l) dialog_left = page_l + page_w - dialog_w;

	dialog.style.left = dialog_left + "px";
	dialog.style.top =  dialog_top + "px";
	dialog.style.visibility = "visible";

	var dialogx = document.createElement("div");
	dialogx.setAttribute('id','dialogx');
	document.body.appendChild(dialogx);
	dialogx.innerHTML = '<a onclick="closeDialog()" style="cursor:pointer;font-size:14px;font-weight:bold;font-family:Arial;">X</a>';

	dialogx.style.position = "absolute";
	dialogx.style.zIndex = "6500";
	dialogx.style.left = (dialog_left + dialog_w - 10) + "px";
	dialogx.style.top =  (dialog_top + 10) + "px";
}

function openDialog(url, mask){
	
	if(mask) showMask();
	if(typeof dialogs[url] == 'undefined') 	Ajax.Request(url,{onLoading:function(){dialogs[url]=this.response; displayDialog('Loading...');}, onComplete:function(){dialogs[url]=this.response; displayDialog(this.response);}});
	else displayDialog(dialogs[url]);
}



function closeDialog(){
	var dialog = document.getElementById("dialog");
	var dialogx = document.getElementById("dialogx");
	if(document.body){
		document.body.removeChild(dialog); 
		document.body.removeChild(dialogx);
	}else{
		document.documentElement.removeChild(dialog); 
		document.documentElement.removeChild(dialogx);
	}
	hideMask();
}

function loadJs(url){
	if(arguments.length >= 2 && typeof arguments[1] == 'function') funload = arguments[1];
	if(arguments.length >= 3 && typeof arguments[2] == 'function') funerror = arguments[2];
	var ss=document.getElementsByTagName("script");
	for(i=0;i<ss.length;i++){
		if(ss[i].src && ss[i].src.indexOf(url) != -1){
			if(typeof funload == "function") funload();
			return;
		}
	}
	s=document.createElement("script");
	s.type="text/javascript";
	s.defer = "defer";
	s.src=url;
	document.getElementsByTagName("head")[0].appendChild(s);
	
	s.onload=s.onreadystatechange=function(){
		if(this.readyState && this.readyState=="loading") return;
		if(typeof funload == "function") funload();
	}
	s.onerror=function(){
		this.parentNode.removeChild(this);
		if(typeof funerror == "function") funerror();
	}
}

//fav
function fav() {
    URL = 'http://www.52xshuo.com'; title = '我爱小说网';
    try {
        window.external.addFavorite(URL, title);
    } catch (e) {
        try {
            window.sidebar.addPanel(title, URL, "");
        } catch (e) {
            alert("加入收藏失败，请使用Ctrl+D进行添加");
        }
    }
}
//通用功能
function GetObj(objName){
	if(document.getElementById){
		return eval('document.getElementById("' + objName + '")');
	}else if(document.layers){
		return eval("document.layers['" + objName +"']");
	}else{
		return eval('document.all.' + objName);
	}
}
//tab切换
function showTab(cid,no) 
{
	
	for (var i = 1; i < 10; i++){
		var tt = GetObj(cid + "_" + i);//区块隐藏
		if (tt != null) {
			tt.style.display = 'none';
		}
		else{
			break;
		}
		var oo = GetObj(cid + i);//按钮恢复
		if (oo!= null){
			oo.className = '';
		}
	}

	var tt = GetObj(cid + "_" + no);//区块显示
	if (tt != null) {
			tt.style.display = 'block';
	}
	var oo = GetObj(cid + no);//按钮变色
	if (oo!= null) 	{
			oo.className = 'on';
	}

}
//退出书签
function bookmark()
{
if(readCookie("bookmark")!="yes") 
{
saveCookie("bookmark","yes",1);
window.external.AddFavorite('http://www.52xshuo.com', '我爱小说网');
}
}

function saveCookie(name,value,days) {
     if (days) {
         var date = new Date();
         date.setTime(date.getTime()+(days*24*60*60*1000))
         var expires = "; expires="+date.toGMTString()
     }
     else expires = ""
     document.cookie = name+"="+value+expires+"; path=/"
}
function readCookie(name) {
     var nameEQ = name + "="
     var ca = document.cookie.split(';')
     for(var i=0;i<ca.length;i++) {
         var c = ca[i];
         while (c.charAt(0)==' ') c = c.substring(1,c.length)
         if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length)
     }
     return null
}

//投票
function vote(id)
{
	url="/modules/article/uservote.php?id="+id;
	
	Ajax.Request(url,{onComplete:function(){displayDialog(this.response.replace(/<br[^<>]*>/g,'\n'));}});
}
//书签
function addbookcase(bid,cid)
{
	
	url="/modules/article/addbookcase.php?bid="+bid+"&cid="+cid;
	Ajax.Request(url,{onComplete:function(){displayDialog(this.response.replace(/<br[^<>]*>/g,'\n'));}});
	//Ajax.Tip(event,url,3000);
}
//错误举报
function report(title)
{
	url="/newmessage.php?tosys=1&title="+title+"&content="+top.window.location.href+"%0D%0A%0D%0A举报原因如下："
	window.open(url);
	//openDialog(url,1)
}

function dlglogin()
{
	//openDialog("/common/dlglogin.php",1);
}

function addfriend(uid)
{
	url="/addfriends.php?id="+uid;
	Ajax.Tip(event,url,3000);
}

//用户
function get_cookie_value(Name) { 
  var search = Name + "=";
　var returnvalue = ""; 
　if (document.cookie.length > 0) { 
　  offset = document.cookie.indexOf(search) 
　　if (offset != -1) { 
　　  offset += search.length 
　　  end = document.cookie.indexOf(";", offset); 
　　  if (end == -1) 
　　  end = document.cookie.length; 
　　  returnvalue=unescape(document.cookie.substring(offset, end));
　　} 
　} 
　return returnvalue; 
}

function user(){
var jieqiUserId = 0;
var jieqiUserName = '';
var jieqiUserPassword = '';
var jieqiUserGroup = 0;
var jieqiNewMessage = 0;

if(document.cookie.indexOf('jieqiUserInfo') >= 0){
	
	var jieqiUserInfo = get_cookie_value('jieqiUserInfo');
	
	start = 0;
	offset = jieqiUserInfo.indexOf(',', start); 
	while(offset > 0){
		tmpval = jieqiUserInfo.substring(start, offset);
		tmpidx = tmpval.indexOf('=');
		if(tmpidx > 0){
           tmpname = tmpval.substring(0, tmpidx);
		   tmpval = tmpval.substring(tmpidx+1, tmpval.length);
		   if(tmpname == 'jieqiUserId') jieqiUserId = tmpval;
		   else if(tmpname == 'jieqiUserName_un') jieqiUserName = tmpval;
		   else if(tmpname == 'jieqiUserPassword') jieqiUserPassword = tmpval;
		   else if(tmpname == 'jieqiUserGroup') jieqiUserGroup = tmpval;
		   else if(tmpname == 'jieqiNewMessage') jieqiNewMessage = tmpval;
		}
		start = offset+1;
		if(offset < jieqiUserInfo.length){
		  offset = jieqiUserInfo.indexOf(',', start); 
		  if(offset == -1) offset =  jieqiUserInfo.length;
		}else{
          offset = -1;
		}
	}
}
	
if(jieqiUserId != 0 && jieqiUserName != '' && (document.cookie.indexOf('PHPSESSID') != -1 || jieqiUserPassword != '')){
  document.write('欢迎您！ '+jieqiUserName+'&nbsp;&nbsp;<a href="/modules/article/bookcase.php" target="_top">我的书架</a>');
  if(jieqiNewMessage > 0){
	  document.write(' | <a href="/message.php?box=inbox" target="_top" class="red">您有短信</a>');
  }else{
	  document.write(' | <a href="/message.php?box=inbox" target="_top">查看短信</a>');
  }
  document.write(' | <a href="/logout.php" target="_self">退出登陆</a>');
}else{
  var jumpurl="";
  if(location.href.indexOf("jumpurl") == -1){
    jumpurl=location.href;
  }
  document.write('<a href="/login.php" target="_top">会员登陆</a>&nbsp;┊&nbsp;<a href="/register.php" target="_top">用户注册</a>');
}

}

//改变阅读背景、字体大小和颜色的javascript
var ReadSet = {
	bgcolor : ["#e7f4fe", "#ffffed", "#efefef", "#fcefff", "#ffffff", "#eefaee"],
	bgcname : ["淡蓝海洋", "明黄淡雅", "灰色世界", "红粉世家", "白雪天地", "绿意春色"],
	bgcvalue : "#e7f4fe",
	fontcolor : ["#333333", "#ff0000", "#008000", "#ffc0cb", "#0000ff", "#ffffff"],
	fontcname : ["黑色", "红色", "绿色", "粉色", "蓝色", "白色"],
	fontcvalue : "#333333",
	fontsize : ["24px", "28px", "30px", "36px", "38px"],
	fontsname : ["很小", "较小", "中等", "较大", "很大"],
	fontsvalue : "20px",
	contentid : "BookCon",
    fontsizeid : "BookText",
	SetBgcolor : function(color){
		//document.bgColor = color;
		document.getElementById(this.contentid).style.backgroundColor = color;
		if(this.bgcvalue != color) this.SetCookies("bgcolor",color);
		this.bgcvalue = color;
	},
	SetFontcolor : function(color){
		document.getElementById(this.fontsizeid).style.color = color;
		if(this.fontcvalue != color) this.SetCookies("fontcolor",color);
		this.fontcvalue = color;
	},
	SetFontsize : function(size){
		document.getElementById(this.fontsizeid).style.fontSize = size;
		if(this.fontsvalue != size) this.SetCookies("fontsize",size);
		this.fontsvalue = size;
	},
	LoadCSS : function(){
			var style = "";
			style +=".readSet{padding:3px;clear:both;line-height:20px;width:700px;margin:auto;}\n";
			style +=".readSet .rc{color:#333333;float:left;padding-left:20px;}\n";
			style +=".readSet a.ra{border:1px solid #cccccc;display:block;width:16px;height:16px;float:left;margin-left:6px;overflow:hidden;}\n";
			style +=".readSet .rf{float:left;}\n";
			style +=".readSet .rt{padding:0px 5px;}\n";
			
			if (document.all){
				var oStyle=document.styleSheets[0];
				var a=style.split("\n");	
				for(var i=0;i<a.length;i++){
					if(a[i]=="") continue;
					var ad=a[i].replace(/([\s\S]*)\{([\s\S]*)\}/,"$1|$2").split("|");
					oStyle.addRule(ad[0],ad[1]);
				}
			}else{
				var styleobj = document.createElement('style');
				styleobj.type = 'text/css';
				styleobj.innerHTML=style;
				document.getElementsByTagName('HEAD').item(0).appendChild(styleobj);
			}
	},
	Show : function(){
		var output;
		output = '<div class="readSet">';
		output += '<span class="rc">阅读背景:</span>';
		for(i=0; i<this.bgcolor.length; i++){
			output += '<a style="background-color: '+this.bgcolor[i]+'" class="ra" title="'+this.bgcname[i]+'" onclick="ReadSet.SetBgcolor(\''+this.bgcolor[i]+'\')" href="javascript:;"></a>';
		}
		output += '<span class="rc">字体颜色:</span>';
		for(i=0; i<this.fontcolor.length; i++){
			output += '<a style="background-color: '+this.fontcolor[i]+'" class="ra" title="'+this.fontcname[i]+'" onclick="ReadSet.SetFontcolor(\''+this.fontcolor[i]+'\')" href="javascript:;"></a>';
		}
		output += '<span class="rc">字体大小:</span><span class="rf">[';
		for(i=0; i<this.fontsize.length; i++){
			output += '<a class="rt" onclick="ReadSet.SetFontsize(\''+this.fontsize[i]+'\')" href="javascript:;">'+this.fontsname[i]+'</a>';
		}
		output += ']</span>';
		output += '<div style="font-size:0px;clear:both;"></div></div>';
		document.write(output);
	},
	SetCookies : function(cookieName,cookieValue, expirehours){
		var today = new Date();
		var expire = new Date();
		expire.setTime(today.getTime() + 3600000 * 356 * 24);
		document.cookie = cookieName+'='+escape(cookieValue)+ ';expires='+expire.toGMTString()+'; path=/';
	},
	ReadCookies : function(cookieName){
		var theCookie=''+document.cookie;
		var ind=theCookie.indexOf(cookieName);
		if (ind==-1 || cookieName=='') return ''; 
		var ind1=theCookie.indexOf(';',ind);
		if (ind1==-1) ind1=theCookie.length;
		return unescape(theCookie.substring(ind+cookieName.length+1,ind1));
	},
	SaveSet : function(){
		this.SetCookies("bgcolor",this.bgcvalue);
		this.SetCookies("fontcolor",this.fontcvalue);
		this.SetCookies("fontsize",this.fontsvalue);
	},
	LoadSet : function(){
		tmpstr = this.ReadCookies("bgcolor");
		if(tmpstr != "") this.bgcvalue = tmpstr;
		this.SetBgcolor(this.bgcvalue);
		tmpstr = this.ReadCookies("fontcolor");
		if(tmpstr != "") this.fontcvalue = tmpstr;
		this.SetFontcolor(this.fontcvalue);
		tmpstr = this.ReadCookies("fontsize");
		if(tmpstr != "") this.fontsvalue = tmpstr;
		this.SetFontsize(this.fontsvalue);
	}
}

function bookset(){
	ReadSet.LoadCSS();
	ReadSet.Show();
} 

function LoadReadSet(){
	ReadSet.LoadSet();
}
if (document.all){
	window.attachEvent('onload',LoadReadSet);
}else{
	window.addEventListener('load',LoadReadSet,false);
} 
//baidu
document.writeln('<script type="text/javascript" src="http://cbjs.baidu.com/js/m.js"></script>');
document.writeln('<script type="text/javascript">BAIDU_CLB_preloadSlots("1004225","1004229");</script>');
function share(){
document.writeln("<div id=\"bdshare\" class=\"bdshare_t bds_tools get-codes-bdshare\">");
document.writeln("<a class=\"bds_qzone\"></a>");
document.writeln("<a class=\"bds_tsina\"></a>");
document.writeln("<a class=\"bds_tqq\"></a>");
document.writeln("<a class=\"bds_renren\"></a>");
document.writeln("<a class=\"bds_t163\"></a>");
document.writeln("<span class=\"bds_more\"></span>");
document.writeln("<a class=\"shareCount\"></a>");
document.writeln("</div>");
}

function cpa300_1(){

}

function cpa300_2(){

}

function cpa300_3(){

}

function cpa960(){

}

function cpa728_2(){

}


//function piao2(){
//
//}
//
//function piao(){
//
//}