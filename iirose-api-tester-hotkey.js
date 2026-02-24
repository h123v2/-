// IIROSE API 测试工具（快捷键版） - 按 Ctrl+Shift+A 唤出菜单
(function() {
    // 确保在正确的上下文
    if (typeof Utils === 'undefined') {
        alert('错误：Utils 未定义。请确保在聊天室 iframe 内运行此脚本（例如通过 rgsh 的 js -c 注入）。');
        return;
    }

    // 防止重复注入
    if (window.__apiTesterInstalled) {
        console.log('API测试工具已存在，跳过安装');
        return;
    }
    window.__apiTesterInstalled = true;

    // ==================== 测试函数定义 ====================
    const tests = {
        // 提示框类
        'sync (提示框)': function() {
            Utils.sync(0, ['这是一个测试提示', '副文本'], function() {
                Utils.sync(0, ['用户点击了确定'], null);
            });
        },
        'sync (验证框)': function() {
            Utils.sync(1, ['是否确认测试？'], function(confirmed) {
                Utils.sync(0, ['用户选择：' + (confirmed ? '是' : '否')], null);
            });
        },
        'sync (输入框)': function() {
            Utils.sync(2, ['请输入一段文字'], function(input) {
                Utils.sync(0, ['你输入了：' + (input || '取消')], null);
            });
        },
        'sync (多行输入)': function() {
            Utils.sync(3, ['请输入多行文本'], function(input) {
                Utils.sync(0, ['你输入了：' + (input || '取消')], null);
            });
        },
        // 数据存储
        'database (读写)': function() {
            const key = '_test_' + Date.now();
            Utils.database(key, '测试值');
            const val = Utils.database(key);
            Utils.sync(0, ['存储成功，读取值：' + val], null);
        },
        // 复制文本
        'copyData (复制)': function() {
            const text = '测试复制文本 ' + new Date().toLocaleTimeString();
            const ok = Utils.copyData(text);
            Utils.sync(0, ['复制' + (ok ? '成功' : '失败'), '文本：' + text], null);
        },
        // 提示音
        'Resource.notiSound (system)': function() {
            Utils.Resource.notiSound('system');
        },
        'Resource.notiSound (at)': function() {
            Utils.Resource.notiSound('at');
        },
        'Sound.play (2)': function() {
            Utils.Sound.play(2);
        },
        'Sound.gameAudioPlayer (3)': function() {
            Utils.Sound.gameAudioPlayer(3);
        },
        // 界面操作
        'LRUD (小聊天框)': function() {
            Utils.LRUD();
            Utils.sync(0, ['已切换小聊天框状态'], null);
        },
        'backward (返回)': function() {
            Utils.backward();
        },
        'Style.fontSize (设置20)': function() {
            Utils.Style.fontSize(0, '20');
            Utils.sync(0, ['字体大小已设为20'], null);
        },
        'danmakuMode (完整气泡)': function() {
            Utils.danmakuMode(0, true);
            Utils.sync(0, ['弹幕模式：完整气泡'], null);
        },
        'danmakuMode (轻量气泡)': function() {
            Utils.danmakuMode(1, true);
            Utils.sync(0, ['弹幕模式：轻量气泡'], null);
        },
        // 视频相关
        'adjustVideoSize (调整视频)': function() {
            const video = document.querySelector('video');
            if (video) {
                Utils.adjustVideoSize($(video), [16,9], true, [1920,1080], true, null);
                Utils.sync(0, ['已尝试调整视频大小'], null);
            } else {
                Utils.sync(0, ['未找到视频元素'], null);
            }
        },
        'createJsPlayer (HLS模拟)': function() {
            if (typeof Hls === 'undefined') {
                Utils.sync(0, ['Hls 未定义，无法测试'], null);
                return;
            }
            let playerObj = { hls: new Hls() };
            Utils.createJsPlayer(0, playerObj, 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', function(err) {
                Utils.sync(0, ['播放器创建回调', err ? '错误：' + err : '可能成功'], null);
            });
        },
        'demandGetDef (获取分辨率信息)': function() {
            const res = Utils.demandGetDef(1, '1');
            Utils.sync(0, ['demandGetDef(1,"1") = ' + res], null);
        },
        // 选择框构建
        'buildSelect (演示)': function() {
            const trigger = document.querySelector('textarea.psion-textarea') || document.body;
            const options = [
                [0, '选项A', '<span style="color:red">🔴</span>'],
                [1, '选项B', '<span style="color:green">🟢</span>'],
                [2, '选项C', '<span style="color:blue">🔵</span>']
            ];
            Utils.buildSelect(
                trigger,
                options,
                function(idx, text) {
                    Utils.sync(0, ['选中：' + idx + ' ' + text], null);
                },
                null,
                true,
                '<div>测试选择框</div>',
                null,
                function() { Utils.sync(0, ['取消选择'], null); },
                              false
            );
        },
        'buildSelect2 (演示)': function() {
            const trigger = document.querySelector('textarea.psion-textarea') || document.body;
            const options = [
                [0, '选项1', '<div>📦 选项1</div>'],
                [1, '选项2', '<div>📦 选项2</div>']
            ];
            Utils.buildSelect2(
                trigger,
                options,
                function(idx, item) {
                    Utils.sync(0, ['选中：' + idx], null);
                },
                false,
                true,
                '<div>测试Select2</div>',
                false,
                '<div>底部</div>',
                function() { Utils.sync(0, ['返回'], null); }
            );
        },
        // 文件/Blob 转换
        'blobToDataURL': function() {
            const blob = new Blob(['Hello, IIROSE!'], { type: 'text/plain' });
            Utils.blobToDataURL(blob, function(dataURL) {
                Utils.sync(0, ['转换结果（前50字符）：', dataURL.substring(0, 50) + '…'], null);
            });
        },
        'dataURLtoBlob': function() {
            const dataURL = 'data:text/plain;base64,SGVsbG8sIElJUk9TRSE=';
            const blob = Utils.dataURLtoBlob(dataURL);
            Utils.sync(0, ['转换得到 Blob 大小：' + blob.size + ' 字节'], null);
        },
        // 对象工具
        'deepCopy': function() {
            const obj = { a: 1, b: { c: [2,3] } };
            const copy = Utils.deepCopy(obj);
            Utils.sync(0, ['深拷贝结果：', JSON.stringify(copy)], null);
        },
        'comDemandPic': function() {
            const res = Utils.comDemandPic(false, 0, 'http://example.com/img.jpg', 100);
            Utils.sync(0, ['comDemandPic 返回：', res], null);
        },
        'compareScroll (检测滚动)': function() {
            const boxes = document.getElementsByClassName('homeHolderMsgBox');
            if (boxes.length > 1) {
                const scrolled = Utils.compareScroll(boxes[1], 800);
                Utils.sync(0, ['第二个消息盒子是否滚动到底部？', scrolled ? '是' : '否'], null);
            } else {
                Utils.sync(0, ['未找到 .homeHolderMsgBox 元素'], null);
            }
        },
        // 上传模拟
        'uploadImg (模拟)': function() {
            const file = new File(['dummy content'], 'test.txt', { type: 'text/plain' });
            Utils.uploadImg(file, function(xhr) {
                Utils.sync(0, ['上传回调，xhr.readyState=' + xhr.readyState + ' status=' + xhr.status], null);
            });
        },
        // 其他
        'bgMove (开启壁纸移动)': function() {
            Utils.bgMove(true, true);
            Utils.sync(0, ['已尝试开启移动壁纸（不通知）'], null);
        },
        'buildPm (构建私聊)': function() {
            const uid = '625874e344db0'; // 示例用户ID
            const params = [
                'http://r.iirose.com/i/23/1/16/19/5713-GK.jpg#e',
                'ffffa7',
                '测试用户',
                '4',
                'http://r.iirose.com/i/24/1/18/11/3943-HK.png'
            ];
            const result = Utils.buildPm(uid, params, 1, 1, undefined);
            Utils.sync(0, ['buildPm 返回值：', result], null);
        },
        // 未逆向占位
        'Adapter.bgmSeter (未逆向)': function() {
            Utils.sync(0, ['此 API 尚未逆向，暂无测试'], null);
        },
        'Timer.uploadHelper (未逆向)': function() {
            Utils.sync(0, ['此 API 尚未逆向，暂无测试'], null);
        }
    };

    // ==================== 显示菜单的函数 ====================
    function showApiTesterMenu() {
        // 构建菜单项
        const menuItems = Object.keys(tests).map((name, index) => [index, name, '']);
        // 获取触发元素（优先用聊天输入框，否则用 body）
        const trigger = document.querySelector('textarea.psion-textarea, .room_chat_content') || document.body;

        Utils.buildSelect2(
            trigger,
            menuItems,
            function(selectedIndex, selectedName) {
                const testFunc = tests[selectedName];
                if (testFunc) {
                    try {
                        testFunc();
                    } catch (e) {
                        Utils.sync(0, ['测试执行出错：', e.toString()], null);
                        console.error(e);
                    }
                }
            },
            false,  // 允许点击空白关闭
            false,  // 不显示图标（因为没有图标数据）
            '<div style="font-size:18px;padding:8px;">🧪 IIROSE API 测试工具 (Ctrl+Shift+A)</div>',
                           false,  // 单选
                           '<div style="opacity:0.7;padding:4px;">共 ' + menuItems.length + ' 个 API 可测试</div>',
                           function() { console.log('测试菜单已关闭'); }
        );
    }

    // ==================== 快捷键监听 ====================
    function handleKeyDown(e) {
        // 检查是否为 Ctrl+Shift+A（忽略大小写）
        if (e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
            // 阻止默认行为和冒泡，防止触发浏览器快捷键
            e.preventDefault();
            e.stopPropagation();

            // 如果当前焦点在输入框内，不触发（避免干扰打字）
            const active = document.activeElement;
            if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.isContentEditable)) {
                console.log('输入框焦点中，忽略快捷键');
                return;
            }

            // 显示菜单
            showApiTesterMenu();
        }
    }

    // 添加事件监听
    document.addEventListener('keydown', handleKeyDown, true); // 使用捕获阶段以确保优先

    console.log('✅ IIROSE API 测试工具已安装，请按 Ctrl+Shift+A 唤出菜单');

    // 可选：在控制台打印所有 API 路径
    (function listAPIs(obj, prefix = 'Utils') {
        for (let key in obj) {
            if (typeof obj[key] === 'function') {
                console.log(prefix + '.' + key + '()');
            } else if (obj[key] && typeof obj[key] === 'object') {
                listAPIs(obj[key], prefix + '.' + key);
            }
        }
    })(Utils);
})();
