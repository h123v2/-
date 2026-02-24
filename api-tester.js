(function() {
    // 确保在正确的上下文
    if (typeof Utils === 'undefined') {
        alert('Utils not found. Make sure you are in the iframe context.');
        return;
    }

    // 定义一个测试函数映射
    const tests = {
        // 按类别组织，便于选择
        'sync (提示框)': function() {
            Utils.sync(0, ["测试提示", "副文本"], function() {
                Utils.sync(0, ["点击了确定"], null);
            });
        },
        'sync (输入框)': function() {
            Utils.sync(2, ["请输入内容"], function(input) {
                Utils.sync(0, ["你输入了: " + input], null);
            });
        },
        'database': function() {
            const key = 'testKey_' + Date.now();
            Utils.database(key, 'test value');
            const val = Utils.database(key);
            Utils.sync(0, ["存储并读取:", val], null);
        },
        'copyData': function() {
            const text = '测试文本 ' + new Date();
            const success = Utils.copyData(text);
            Utils.sync(0, ["复制" + (success ? "成功" : "失败"), "文本: " + text], null);
        },
        'Resource.notiSound (system)': function() {
            Utils.Resource.notiSound('system');
        },
        'Resource.notiSound (at)': function() {
            Utils.Resource.notiSound('at');
        },
        'Sound.play (2)': function() {
            Utils.Sound.play(2);
        },
        'LRUD (小聊天框)': function() {
            Utils.LRUD();
            Utils.sync(0, ["已切换小聊天框状态"], null);
        },
        'backward (返回)': function() {
            Utils.backward();
        },
        'Style.fontSize': function() {
            Utils.Style.fontSize(0, '20');
            Utils.sync(0, ["字体大小已设置为20"], null);
        },
        'danmakuMode (0)': function() {
            Utils.danmakuMode(0, true); // true 不通知
            Utils.sync(0, ["弹幕模式已切换为完整气泡"], null);
        },
        'adjustVideoSize (如果存在视频)': function() {
            const video = document.querySelector('video');
            if (video) {
                Utils.adjustVideoSize($(video), [16,9], true, [1920,1080], true, null);
                Utils.sync(0, ["已尝试调整视频大小"], null);
            } else {
                Utils.sync(0, ["未找到视频元素"], null);
            }
        },
        'buildSelect (演示)': function() {
            const input = document.querySelector('textarea.psion-textarea');
            if (!input) {
                Utils.sync(0, ["未找到输入框"], null);
                return;
            }
            const options = [
                [0, '选项A', '<span>🔴</span>'],
                [1, '选项B', '<span>🟢</span>'],
                [2, '选项C', '<span>🔵</span>']
            ];
            Utils.buildSelect(
                input,
                options,
                function(idx, text) {
                    Utils.sync(0, ["你选择了: " + idx + " " + text], null);
                },
                null,
                true,
                '<div>测试选择框</div>',
                null,
                function() { Utils.sync(0, ["取消选择"], null); },
                false
            );
        },
        'buildSelect2 (演示)': function() {
            const input = document.querySelector('textarea.psion-textarea');
            if (!input) {
                Utils.sync(0, ["未找到输入框"], null);
                return;
            }
            const options = [
                [0, '选项1', '<div>📦 选项1</div>'],
                [1, '选项2', '<div>📦 选项2</div>']
            ];
            Utils.buildSelect2(
                input,
                options,
                function(idx, item) {
                    Utils.sync(0, ["选择了: " + idx], null);
                },
                false,
                true,
                '<div>测试Select2</div>',
                false,
                '<div>底部</div>',
                function() { Utils.sync(0, ["返回"], null); }
            );
        },
        'blobToDataURL': function() {
            const blob = new Blob(["Hello, world!"], { type: "text/plain" });
            Utils.blobToDataURL(blob, function(dataURL) {
                Utils.sync(0, ["转换结果:", dataURL.substring(0, 50) + "..."], null);
            });
        },
        'dataURLtoBlob': function() {
            const dataURL = "data:text/plain;base64,SGVsbG8sIHdvcmxkIQ==";
            const blob = Utils.dataURLtoBlob(dataURL);
            Utils.sync(0, ["转换得到的Blob大小:", blob.size + " bytes"], null);
        },
        'deepCopy': function() {
            const obj = { a: 1, b: { c: 2 } };
            const copy = Utils.deepCopy(obj);
            Utils.sync(0, ["拷贝结果:", JSON.stringify(copy)], null);
        },
        'demandGetDef': function() {
            const def = Utils.demandGetDef(1, '1');
            Utils.sync(0, ["demandGetDef(1, '1') 返回:", def], null);
        },
        'comDemandPic': function() {
            const result = Utils.comDemandPic(false, 0, "http://example.com/img.jpg", 100);
            Utils.sync(0, ["comDemandPic 返回:", result], null);
        },
        'compareScroll': function() {
            const elements = document.getElementsByClassName('homeHolderMsgBox');
            if (elements.length > 1) {
                const isScrolled = Utils.compareScroll(elements[1], 800);
                Utils.sync(0, ["compareScroll 结果:", isScrolled ? "已滚动到底部" : "未到底部"], null);
            } else {
                Utils.sync(0, ["未找到元素"], null);
            }
        },
        'uploadImg (模拟)': function() {
            const file = new File(["dummy"], "test.txt", { type: "text/plain" });
            Utils.uploadImg(file, function(xhr) {
                Utils.sync(0, ["上传回调，xhr状态:", xhr.status], null);
            });
        },
        'bgMove': function() {
            Utils.bgMove(true, true); // 开启，不通知
            Utils.sync(0, ["已尝试开启移动壁纸"], null);
        },
        'buildPm': function() {
            // 使用一个示例用户ID，但为了避免真实私聊，我们可以测试返回值
            const e = "625874e344db0"; // 示例用户ID
            const t = ['http://r.iirose.com/i/23/1/16/19/5713-GK.jpg#e', 'ffffa7', '用户名', '4', 'http://r.iirose.com/i/24/1/18/11/3943-HK.png'];
            const result = Utils.buildPm(e, t, 1, 1, undefined);
            Utils.sync(0, ["buildPm 返回值:", result], null);
        },
        // 其他API可以继续添加...
    };

    // 构建菜单项
    const menuItems = Object.keys(tests).map((name, index) => [index, name, '']); // 可以添加图标

    // 获取触发元素（比如聊天输入框）
    const trigger = document.querySelector('textarea.psion-textarea') || document.body;

    // 显示选择菜单
    Utils.buildSelect2(
        trigger,
        menuItems,
        function(selectedIndex, selectedName) {
            const testFunc = tests[selectedName];
            if (testFunc) {
                try {
                    testFunc();
                } catch (e) {
                    Utils.sync(0, ["测试出错:", e.toString()], null);
                }
            }
        },
        false,  // 允许清空
        false,  // 不显示图标（因为没有图标数据）
        '<div>🧪 IIROSE API 测试工具</div>',
        false,  // 单选
        '<div>选择要测试的API</div>',
        function() { console.log('测试菜单关闭'); }
    );
})();