import { cardjson, jsonObject, line, railInfo, points, } from './carddata.js';
import { demo } from './demo.js';
console.log(demo);
console.log(line);

init();
var network;

function init(htmlElementId) {
    make.Default.path = '../'; //指定模型库的目录
    network = new mono.Network3D(); //创建3D显示视图
    network.setClearColor('#39609B');
    var box = network.getDataBox(); //创建容器

    //镜头shezhi
    var camera = new mono.PerspectiveCamera(30, 1.5, 30, 30000); //新建镜头对象
    // var camera = network.getCamera();获取network镜头对象
    // camera.setPosition(-4000, 3000, -6000);//镜头位置
    camera.setPosition(4000, 3000, 6000); //镜头位置
    camera.lookAt(new mono.Vec3(0, 0, 0)); //设置镜头焦点
    network.setCamera(camera);
    // 交互设置
    var interaction = network.getDefaultInteraction();
    interaction.maxDistance = 20000;
    interaction.minDistance = 30;
    interaction.zoomSpeed = 3;
    interaction.panSpeed = 0.2;

    //获取包含底层、network和底层画布的div元素
    document.getElementById('main').appendChild(network.getRootView());
    //自动根据窗口大小调整network的大小
    mono.Utils.autoAdjustNetworkBounds(network, document.documentElement, 'clientWidth', 'clientHeight');

    //光源设置
    var pointLight = new mono.PointLight(0xFFFFFF, 0.1);
    pointLight.setPosition(8000, 8000, 8000);
    box.add(pointLight);
    box.add(new mono.AmbientLight('white')); //光源颜色

    network.setShowFps(true);
    /**
     * 找到第一个点击的对象
     */
    var findFirstObjectByMouse = function(network, e) {
        var objects = network.getElementsByMouseEvent(e);
        if (objects.length) {
            for (var i = 0; i < objects.length; i++) {
                var first = objects[i];
                var object3d = first.element;
                if (!(object3d instanceof mono.Billboard)) {
                    return first;
                }
            }
        }
        return null;
    }

    /**
     * 镜头移动切换
     */
    var animateCamera = function(camera, interaction, oldPoint, newPoint, onDone) {
        var offset = camera.getPosition().sub(camera.getTarget());
        var animation = new twaver.Animate({
            from: 0,
            to: 1,
            dur: 500,
            easing: 'easeBoth',
            onUpdata: function(value) {
                var x = oldPoint.x + (newPoint.x - oldPoint.x) * value;
                var y = oldPoint.y + (newPoint.y - oldPoint.y) * value;
                var z = oldPoint.z + (newPoint.z - oldPoint.z) * value;
                var target = new mono.Vec3(x, y, z);
                camera.lookAt(target);
                interaction.target = target;
                var position = new mono.Vec3().addVectors(offset, target);
                camera.setCamera(position);
            }
        })
        animation.onDone = onDone;
        animation.play();
    };

    /**
     * 双击找到第一个目标物体，切换动画
     */
    //获取network顶层dom元素
    network.getRootView().addEventListener('dblclick', function(e) {
        var firstClickObject = findFirstObjectByMouse(network, e);
        if (firstClickObject) {
            var element = firstClickObject.element;
            var oldPoint = camera.t();
            var newPoint = firstClickObject.point;
            var interaction = network.getDefaultInteraction()
            if (element.getClient('animation')) {
                make.Default.playAnimation(element, element.getClient('animation'));
            } else {
                animateCamera(camera, interaction, oldPoint, newPoint);
            }
        }
    });

    //显示坐标轴
    network.setShowAxis(true);
    network.setShowAxisText(true);


    //加载地板、墙、摄像头、植物、电视等数据
    var object3ds = make.Default.load(jsonObject);
    for (var i = 0; i < object3ds.length; i++) {
        var obj = object3ds[i];
        network.getDataBox().addByDescendant(obj); //添加数据
    }
    console.log(object3ds);

    //接待桌
    make.Default.load('twaver.meeting.receptionDesk', function(objects) {
        objects.setPosition(700, 60, -800);
        network.getDataBox().addByDescendant(objects);
    })

    //灭火器
    make.Default.load('twaver.idc.fire', function(objects) {
        objects.setPosition(-50, 40, -950);
        network.getDataBox().addByDescendant(objects);
    })

    //空调
    var object3d = make.Default.load('twaver.idc.airCondition');
    object3d.setPosition(-800, object3d.getHeight() / 2, -900)
    network.getDataBox().addByDescendant(object3d);

    //ups 
    var object3d = make.Default.load('twaver.idc.ups');
    object3d.setPosition(-200, object3d.getHeight() / 2, -900)
    network.getDataBox().addByDescendant(object3d);

    //机柜 
    function createRacks() {
        var rackNumber = 20;
        var rackWidth = 71;

        for (var i = 0; i < rackNumber; i++) {
            var equip = make.Default.load({
                'id': 'twaver.idc.rack200',
                'label': (function() {
                    var label = 'A';
                    if (i < 9) {
                        label += '0';
                    }
                    label += (i + 1)
                    return label;
                })(i)
            }); //equip is comboNode

            var equip_1 = make.Default.load({
                'id': 'twaver.idc.rack200',
                'severity': 'mono.AlarmSeverity.CRITICAL',
                'label': (function() {
                    var label = 'B';
                    if (i < 9) {
                        label += '0';
                    }
                    label += (i + 1)
                    return label;
                })(i)
            });

            var equip_2 = make.Default.load({
                'id': 'twaver.idc.rack200',
                'label': (function() {
                    var label = 'C';
                    if (i < 9) {
                        label += '0';
                    }
                    label += (i + 1);
                    return label;
                })(i)
            });
            console.log(equip.oldRack)
            equip.setPositionX(-rackNumber / 4 * rackWidth + rackWidth / 2 - 500 + i * rackWidth / 2);
            equip_1.setPositionX(-rackNumber / 4 * rackWidth + rackWidth / 2 + 500 + i * rackWidth / 2);
            equip_2.setPositionX(-rackNumber / 4 * rackWidth + rackWidth / 2 - 500 + i * rackWidth / 2);

            equip.setPositionY(100);
            equip_1.setPositionY(100);
            equip_2.setPositionY(100);
            var start = -rackNumber / 4 * rackWidth + 35
            var gap = rackWidth - 50;
            if (i % 2 == 0) {
                creatorComboDevices(start + (50 + i / 2 * gap + (i / 2 - 1) * 50) - 500, 0, -400, cardjson);
                creatorComboDevices(start + (50 + i / 2 * gap + (i / 2 - 1) * 50) + 500, 0, 400, cardjson);
                creatorComboDevices(start + (50 + i / 2 * gap + (i / 2 - 1) * 50) - 500, 0, 400, cardjson);
                equip.setPositionZ(-400);
                equip_1.setPositionZ(400);
                equip_2.setPositionZ(400);
            } else {
                creatorComboDevices(start - 35 + (50 + i / 2 * gap + (i / 2 - 1) * 50) - 500, 0, -600, cardjson);
                creatorComboDevices(start - 35 + (50 + i / 2 * gap + (i / 2 - 1) * 50) + 500, 0, 600, cardjson);
                creatorComboDevices(start - 35 + (50 + i / 2 * gap + (i / 2 - 1) * 50) - 500, 0, 600, cardjson);
                equip.setPositionX(equip.getX() - 35);
                equip_1.setPositionX(equip_1.getX() - 35);
                equip_2.setPositionX(equip_2.getX() - 35);
                equip.setPositionZ(-600);
                equip_1.setPositionZ(600);
                equip_2.setPositionZ(600);
            }

            network.getDataBox().addByDescendant(equip);
            network.getDataBox().addByDescendant(equip_1);
            network.getDataBox().addByDescendant(equip_2);
        }
    }
    createRacks();

    function creatorCards(x, y, z) {
        var cardNums = 10; //机柜宽度60-10除以卡板宽度5 ,卡板高度为50
        for (var i = 0; i < cardNums; i++) {
            var card = make.Default.load({ id: "twaver.idc.card" });
            card.setPositionX(x + (i * 5) - 22.5);
            card.setPositionY(y + 25);
            card.setPositionZ(z + 25);
            network.getDataBox().addByDescendant(card);
        }
    }


    function creatorNetWorkDevices(x, y, z, json) {
        var udevice = make.Default.load(json);
        var d = 4.445; //每u之间的差值
        var a1 = 4.445; //1u设备的高度

        for (var i = 0; i < udevice.length; i++) {
            var u = udevice[i];
            var n = i + 1;
            var sn = n * a1 + n * (n - 1) * d / 2; //等差数列求和
            u.setPositionX(x)
            u.setPositionY(50 + y + sn);
            u.setPositionZ(z)
            network.getDataBox().addByDescendant(u); //添加数据
        }
    }

    function creatorComboDevices(x, y, z, json) {
        creatorCards(x, y, z);
        creatorNetWorkDevices(x, y, z, json)
    }

    /**
     * 侧栏导航条
     */
    var buttons = [{
            label: '场景复位',
            icon: 'reset.png',
        },
        {
            label: '走线管理',
            icon: 'connection.png',
            clickFunction: function() {
                var showing = network.connectionView;
                demo.resetView(network);
                if (!showing) {
                    demo.toggleConnectionView(network);
                }
            }
        },
        {
            label: '人工路径',
            icon: 'person.png'
        },
        {
            label: '拖拽机柜',
            icon: 'edit.png'
        }, {
            label: '可用空间',
            icon: 'space.png'
        },
        {
            label: '温度图',
            icon: 'temperature.png'
        },
        {
            label: '机柜利用率',
            icon: 'usage.png'
        },
        {
            label: '空调风向',
            icon: 'air.png'
        }, {
            label: '烟雾监控',
            icon: 'smoke.png'
        },
        {
            label: '漏水监控',
            icon: 'water.png'
        }, {
            label: '防盗监控',
            icon: 'security.png'
        }, {
            label: '供电电缆',
            icon: 'power.png'
        },
        {
            label: '告警巡航',
            icon: 'alarm.png'
        }
    ]

    function setupToolbar(buttons) {
        var count = buttons.length;
        var step = 32;

        var div = document.createElement('div');
        div.setAttribute('id', 'toolbar');
        div.style.display = 'block';
        div.style.position = 'absolute';
        div.style.left = '10px';
        div.style.top = '100px';
        div.style.width = '32px';
        div.style.height = (count * step + step) + 'px';
        div.style.background = 'rgba(255,255,255,0.75)';
        div.style['border-radius'] = '5px';
        document.body.appendChild(div);

        for (var i = 0; i < count; i++) {
            var button = buttons[i];
            var icon = button.icon;
            var img = document.createElement('img');
            img.style.position = 'absolute';
            img.style.left = '4px';
            img.style.top = (step / 2 + (i * step)) + 'px';
            img.style['cursor'] = 'pointer';
            img.style['pointer-events'] = 'auto';
            img.setAttribute('src', demo.getRes(icon));
            img.style.width = '24px';
            img.style.height = '24px';
            img.setAttribute('title', button.label);
            img.onclick = button.clickFunction;
            div.appendChild(img);
        }
    }

    setupToolbar(buttons);

    /**
     * 走线
     */
    var connections = make.Default.load(line);
    for (var i = 0; i < connections.length; i++) {
        var obj = connections[i];
        network.getDataBox().addByDescendant(obj); //添加数据
    }

    /**
     * 走线架
     */
    function createRail(params) {
        var rail = demo.createPathObject(params);
        rail.s({
            'm.texture.image': '../res/images/rail.png',
            'm.type': 'phong',
            'm.transparent': true,
            'm.color': '#CEECF5',
            'm.ambient': '#CEECF5',
            'aside.m.visible': false,
            'zside.m.visible': false,
            'm.specularStrength': 50,
        });
        rail.setPositionY(268);
        rail.setVisible(true);
        rail.setClient('type', 'rail');
        return rail;
    }
    var rail = createRail(railInfo);
    box.add(rail);

}

/**
 * 路径规划
 */
function loadObj() {
    //加载人物模型
    var obj = demo.getRes('worker.obj');
    var mtl = demo.getRes('worker.mtl');
    var loader = new mono.OBJMTLLoader(); //解析obj文件生成相关3D对象
    loader.load(obj, mtl, { 'worker': demo.getRes('worker.png'), }, function(object) {
        object.setScale(3, 3, 3);
        object.setClient('type', 'person');
        box.addByDescendant(object);

        var updater = function(elememt) {
            if (elememt && elememt.getChildren()) {
                elememt.getChildren().forEach(function(child) {
                    child.setStyle('m.normalType', mono.NormalTypeSmooth); //平滑效果
                    updater(child);
                })
            }
        }
        updater(object);

        var cameraFollow = new cameraFollow();
        cameraFollow.setHost(object);
        var leftDoor = demo.typeFiner.findFirst('left-door');
        var rightDoor = demo.typeFiner.findFirst('right-door');
        demo.playAnimation(leftDoor, leftDoor.getClient('animation'));
        demo.playAnimation(rightDoor, rightDoor.getClient('animation'), function() {
            object.animate = demo.createPathAnimates(camera, object, points, false, null, function() {
                demo._playRackDoorAnimate('A03');
            });
            object.animate.play()
        })
        var x = -650,
            z = 600,
            angle = 0;
        object.setPosition(x, 0, z);
        object.setPositionY(angle);
        var path = new mono.Path();
        path.moveTo(object.getPositionX(), object.getPositionY());
        for (var i = 0; i < points.length; i++) {
            path.lineTo(points[i][0], points[i][1]);
        }
        path = mono.PathNode.prototype.adjustPath(path, 20);
        var trail = new mono.PathCube(path, 10, 3);
        trail.s({
            'm.type': 'phone',
            'm.specularStrength': 30,
            'm.color': '#298A08',
            'm.ambient': '#298A08',
            'm.texture.image': demo.getRes('flow.jpg'),
            'm.texture.repeat': new mono.Vec2(150, 1),
        });
        trail.setRotationX(Math.PI);
        trail.setPositionY(5);
        trail.setClient('type', 'trail');
        box.add(trail)
    })


}