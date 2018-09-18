export var demo = {
    RES_PATH: '../res/images',

    getRes: function(file) {
        return demo.RES_PATH + '/' + file;
    },



    create2DPath: function(pathData) {
        var path;
        for (var j = 0; j < pathData.length; j++) {
            var point = pathData[j];
            if (path) {
                path.lineTo(point[0], point[1], 0);
            } else {
                path = new mono.Path();
                path.moveTo(point[0], point[1], 0);
            }
        }
        return path;
    },

    create3DPath: function(pathData) {
        var path;
        for (var j = 0; j < pathData.length; j++) {
            var point = pathData[j];
            if (path) {
                path.lineTo(point[0], point[1], point[2]);
            } else {
                path = new mono.Path();
                path = mono.PathNode.prototype.adjustPath(path, 0.5, 20);
                path.moveTo(point[0], point[1], point[2]);
            }
        }
        return path;
    },

    resetCamera: function(network) {
        network.getCamera().setPosition(4000, 3000, 6000);
        network.getCamera().lookAt(new mono.Vec3(0, 0, 0));
    },

    createWall: function(path, thick, height, insideColor, outsideColor, topColor) {
        var wall = new mono.PathCube(path, thick, height);
        wall.s({
            'outside.m.color': outsideColor,
            'inside.m.type': 'basic',
            'inside.m.color': insideColor,
            'aside.m.color': outsideColor,
            'zside.m.color': outsideColor,
            'top.m.color': topColor,
            'bottom.m.color': topColor,
            'inside.m.lightmap.image': demo.getRes('inside_lightmap.jpg'),
            'outside.m.lightmap.image': demo.getRes('outside_lightmap.jpg'),
            'aside.m.lightmap.image': demo.getRes('outside_lightmap.jpg'),
            'zside.m.lightmap.image': demo.getRes('outside_lightmap.jpg'),
        });
        return wall;
    },

    createPathObject: function(json) {
        var translate = json.translate || [0, 0, 0];
        var pathWidth = json.width;
        var pathHeight = json.height;
        var pathData = json.data;
        var path = this.create2DPath(pathData);
        var pathInsideColor = json.insideColor;
        var pathOutsideColor = json.outsideColor;
        var pathTopColor = json.topColor;

        var object3d = this.createWall(path, pathWidth, pathHeight, pathInsideColor, pathOutsideColor, pathTopColor);
        object3d.setPosition(translate[0], translate[1], -translate[2]);
        object3d.shadow = json.shadow;

        return object3d;
    },

    createConnectionBillboardImage: function(value) {
        var width = 512;
        var height = 256;
        var text = "当前网络流量";
        var canvas = document.createElement('canvas');
        canvas['width'] = width;
        canvas['height'] = height;
        var context = canvas.getContext('2d'); //开始2d绘图环境
        context.fillStyle = '#FE642E';
        context.fillRect(0, 0, width, height - height / 6); //矩形左上角和右下角坐标

        //绘制矩形框
        context.beginPath(); //开启一个路径的集合
        context.moveTo(width * 0.2, 0);
        context.lineTo(width / 2, height);
        context.lineTo(width * 0.8, 0);
        context.fill(); //填充路径

        // 绘制文本 "当前网络流量"
        var color = "#fff";
        context.font = "40px Microsoft UI";
        context.fillStyle = color;
        context.textAlign = "left";
        context.textBaseline = "middle";
        context.fillText(text, height / 10, height / 5); //绘制文本以及坐标实心

        // 绘制 "544.8"
        var color = '#fff';
        text = value;
        context.font = "100px Microsoft UI";
        context.fillStyle = color;
        context.textAlign = "left";
        context.textBaseline = "middle";
        context.fillText(text, height / 10, height / 2);
        context.strokeStyle = color;
        context.lineWidth = 4;
        context.strokeText(text, height / 10, height / 2); //绘制文本以及坐标空心

        // 绘制文本 "Mb/s"
        text = 'Mb/s'
        context.font = "50px Microsoft UI";
        context.fillStyle = color;
        context.textAlign = "right";
        context.textBaseline = "middle";
        context.fillText(text, width - height / 10, height / 2 + 20);

        return canvas;
    }
}