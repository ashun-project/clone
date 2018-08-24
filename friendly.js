
setTimeout(function () {
    var aList = [
        {
            name: '蔷薇福利导航',
            url: 'http://www.qweidh.xyz'
        },
        {
            name: '爱色导航',
            url: 'http://www.isedh.com'
        },
        {
            name: '爱搜导航',
            url: 'http://www.isodh.com'
        },
        {
            name: '700福利导航',
            url: 'http://700.baidfx.com/'
        },
        {
            name: '快狐福利导航',
            url: 'http://www.9347.ml'
        },
        {
            name: '火山小黄人导航',
            url: 'http://xiaohuangren.xyz/'
        },   
           
        {
            name: '华人社导航',
            url: 'http://www.huadh.xyz/'
        },   
        {
            name: '骑士导航',
            url: 'http://www.74fl.xyz/'
        },   
        {
            name: '品色堂导航',
            url: 'http://www.pstdh.xyz/'
        },   
        {
            name: '色狼窝导航',
            url: 'http://www.slwo1.xyz/'
        },   
        {
            name: '白洁导航',
            url: 'http://www.1368.ml'
        },   
        {
            name: '爱趣导航站',
            url: 'https://www.aiqudh.com'
        },   
        {
            name: '老司机在线',
            url: 'http://www.lsjdh.top'
        },   
        {
            name: '撸撸导航',
            url: 'http://www.laldh.space'
        },   
        {
            name: '一点啪在线',
            url: 'http://www.yidianpa.online'
        },   
        {
            name: '狼友导航',
            url: 'http://www.lydh.online'
        }
    ];
	var friendly = document.getElementsByClassName('my-friendly')[0];
	var aEvent = '';
	for (var i = 0; i < aList.length; i++) {
        aEvent = document.createElement('a');
        aEvent.innerHTML = aList[i].name;
        aEvent.href = aList[i].url;
        if (friendly) {
            friendly.appendChild(aEvent);
        }
	}
}, 1000);
