Date.prototype.Format = function(fmt) { //author: meizz   
    var o = {
        "M+": this.getMonth() + 1, //月份   
        "d+": this.getDate(), //日   
        "h+": this.getHours(), //小时   
        "m+": this.getMinutes(), //分   
        "s+": this.getSeconds(), //秒   
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度   
        "S": this.getMilliseconds() //毫秒   
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

var utils = {
    showDialog: function(content, title, width, height) {
        title = title || '';
        width = width || 600;
        height = height || 400
        var div = document.getElementById('dialog');
        if (div) {
            document.body.removeChild(div);
        }
        var div = document.createElement('div');
        div.setAttribute('id', 'dialog');
        div.style.display = 'block';
        div.style.position = 'absolute';
        div.style.left = '100px';
        div.style.top = '100px';
        div.style.width = width + 'px';
        div.style.height = height + 'px';
        div.style.background = 'rgba(164,186,233,0.75)';
        div.style['border-radius'] = '5px';
        document.body.appendChild(div);

        var span = document.createElement('span');
        span.style.display = 'block';
        span.style.position = 'absolute';
        span.style.left = '10px';
        span.style.top = '2px';
        span.style['color'] = '#fff';
        span.style['font-size'] = '12px';
        span.innerHTML = title;
        div.appendChild(span);

        var img = document.createElement('img');
        img.style.position = 'absolute';
        img.style.right = '4px';
        img.style.top = '4px';
        img.setAttribute('src', '../res/images/close.png')
        img.onclick = function() {
            document.body.removeChild(div)
        };
        div.appendChild(img);

        if (content) {
            content.style.display = 'block';
            content.style.position = 'absolute';
            content.style.left = '9px';
            content.style.top = '24px';
            content.style.width = (width - 6) + 'px';
            content.style.height = (height - 26) + 'px';
            div.appendChild(content);
        }
    },

    showVideoDialog: function(title) {
        var video = document.createElement('video');
        video.setAttribute("src", '../res/images/test.mp4');
        video.setAttribute('Controls', 'true');
        video.setAttribute('autoPlay', 'true');
        utils.showDialog(video, title, 610, 280)
    },


    showDoorTable: function() {
        var table = document.createElement('table');
        table.setAttribute('class', 'gridtable');
        for (var k = 0; k < 8; k++) {
            var tr = document.createElement('tr');
            table.appendChild(tr);
            for (var i = 0; i < 3; i++) {
                var tagName = k == 0 ? 'th' : 'td';
                var td = document.createElement(tagName);
                tr.appendChild(td);
                if (k == 0) {
                    if (i == 0) {
                        td.innerHTML = '#';
                    }
                    if (i == 1) {
                        td.innerHTML = 'Time';
                    }
                    if (i == 2) {
                        td.innerHTML = 'Activity';
                    }
                } else {
                    if (i == 0) {
                        td.innerHTML = parseInt(Math.random() * 1000);
                    }
                    if (i == 1) {
                        td.innerHTML = new Date().Format('yyyy-MM-dd hh:mm:ss');
                    }
                    if (i == 2) {
                        if (Math.random() > 0.5) {
                            td.innerHTML = 'Door access allowed';
                        } else {
                            td.innerHTML = 'Instant Alart - Door access denied';
                        }
                    }
                }
            }
        }

        utils.showDialog(table, 'Door Security Records', 400, 240);
    },

    hideObjects: function(nt) {
        nt.getDataBox().forEach(function(element) {
            var type = element.getClient('type');
            if (type === 'waterCable') {
                element.setVislble(nt.waterView);
            } else if (type && type !== 'floorCombo' && type !== 'extinguisher' && type !== 'glassWall') {
                if (nt.waterView) {
                    if (type == 'rack' || type == "rack_door") {
                        element.oldTransparent = element.getStyle('m.transparent');
                        element.oldOpacity = element.getStyle('m.opacity');
                        element.setStyle('m.transparent', true);
                        element.setStyle('m.opcity', 0.1);
                    } else {
                        element.oldVisible = element.isVisible();
                        element.setStyle('m.visible', false);
                    }
                } else {
                    if (type == 'rack' || type == 'rack_door') {
                        element.setStyle('m.transparent', element.oldTransparent);
                        element.setStyle('m.opacity', element.oldOpacity);
                    } else {
                        element.setVisible(element.oldVisible);
                        element.setStyle('m.visible', true);
                    }
                }
            }
        })
    }
}