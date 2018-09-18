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
}