// IIROSE 美化空白窗口 - 按 Alt+B 显示/隐藏
(function() {
    'use strict';

    // 防止重复注入
    if (window.__blankPanelInstalled) return;
    window.__blankPanelInstalled = true;

    // 检查 Utils（仅用于通知，非必须）
    const hasUtils = typeof window.Utils !== 'undefined';

    // ----- 样式注入 -----
    const style = document.createElement('style');
    style.textContent = `
    /* 毛玻璃背景遮罩 */
    .blank-panel-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(4px);
        z-index: 99999;
        opacity: 0;
        transition: opacity 0.25s ease;
        pointer-events: none;
    }
    .blank-panel-overlay.show {
        opacity: 1;
        pointer-events: auto;
    }

    /* 右侧滑出面板 */
    .blank-panel {
        position: fixed;
        top: 0;
        right: 0;
        width: 480px;
        max-width: 90vw;
        height: 100%;
        background-color: rgba(32, 32, 32, 0.85);
        backdrop-filter: blur(16px);
        box-shadow: -2px 0 12px rgba(0, 0, 0, 0.3);
        color: #fff;
        transform: translateX(100%);
        transition: transform 0.25s ease;
        display: flex;
        flex-direction: column;
        font-family: system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
        z-index: 100000;
    }
    .blank-panel.show {
        transform: translateX(0);
    }

    /* 标题栏 */
    .blank-panel-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 16px 20px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        font-size: 18px;
        font-weight: 500;
    }
    .blank-panel-header-left {
        display: flex;
        align-items: center;
        gap: 12px;
    }
    .blank-panel-header-icon {
        font-family: 'md', 'Material Design Icons', sans-serif;
        font-size: 24px;
        color: #aaccff;
    }
    .blank-panel-header-title {
        letter-spacing: 0.5px;
    }
    .blank-panel-close {
        font-family: 'md', 'Material Design Icons', sans-serif;
        font-size: 24px;
        cursor: pointer;
        opacity: 0.7;
        transition: opacity 0.2s;
        padding: 4px;
    }
    .blank-panel-close:hover {
        opacity: 1;
    }

    /* 内容区域 - 完全空白，由你填充 */
    .blank-panel-content {
        flex: 1;
        padding: 24px 20px;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 16px;
        color: rgba(255, 255, 255, 0.9);
        font-size: 14px;
        line-height: 1.6;
    }

    /* 简单占位提示（可删除） */
    .blank-panel-placeholder {
        text-align: center;
        margin-top: 40px;
        opacity: 0.5;
        font-style: italic;
        border: 2px dashed rgba(255, 255, 255, 0.2);
        border-radius: 12px;
        padding: 40px 20px;
    }
    `;
    document.head.appendChild(style);

    // ----- 创建 DOM -----
    const overlay = document.createElement('div');
    overlay.className = 'blank-panel-overlay';
    overlay.id = 'blankPanelOverlay';

    const panel = document.createElement('div');
    panel.className = 'blank-panel';
    panel.id = 'blankPanel';

    panel.innerHTML = `
    <div class="blank-panel-header">
    <div class="blank-panel-header-left">
    <span class="blank-panel-header-icon">󰀥</span> <!-- 对应 mdi-window (如果字体支持) -->
    <span class="blank-panel-header-title">空白面板</span>
    </div>
    <span class="blank-panel-close" id="blankPanelClose">󰅖</span> <!-- 对应 mdi-close -->
    </div>
    <div class="blank-panel-content" id="blankPanelContent">
    <!-- 这里是完全空白的区域，你可以动态插入任何内容 -->
    <div class="blank-panel-placeholder">
    此处可放置你的自定义内容<br>
    通过 JavaScript 操作 blankPanelContent 元素
    </div>
    </div>
    `;

    overlay.appendChild(panel);
    document.body.appendChild(overlay);

    // ----- 元素引用 -----
    const closeBtn = document.getElementById('blankPanelClose');
    const contentDiv = document.getElementById('blankPanelContent');

    // ----- 显示/隐藏函数 (暴露给全局) -----
    function showPanel() {
        overlay.classList.add('show');
        panel.classList.add('show');
        // 可选：触发一个自定义事件
        window.dispatchEvent(new CustomEvent('blankPanelShown'));
    }

    function hidePanel() {
        overlay.classList.remove('show');
        panel.classList.remove('show');
        window.dispatchEvent(new CustomEvent('blankPanelHidden'));
    }

    function togglePanel() {
        if (overlay.classList.contains('show')) {
            hidePanel();
        } else {
            showPanel();
        }
    }

    // 暴露到全局，方便控制台调用
    window.blankPanel = {
        show: showPanel,
        hide: hidePanel,
        toggle: togglePanel,
        content: contentDiv,  // 直接暴露内容元素，便于后续填充
    };

    // ----- 事件监听 -----
    closeBtn.addEventListener('click', hidePanel);

    // 点击遮罩关闭
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) hidePanel();
    });

        // Esc 键关闭
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && overlay.classList.contains('show')) {
                hidePanel();
                e.preventDefault();
            }
        });

        // 快捷键 Alt+B 显示/隐藏 (避免输入框内触发)
        document.addEventListener('keydown', (e) => {
            if (e.altKey && (e.key === 'b' || e.key === 'B')) {
                const active = document.activeElement;
                if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.isContentEditable)) {
                    return; // 输入框内不触发
                }
                e.preventDefault();
                togglePanel();
            }
        });

        // 可选：移动端双指下滑手势 (类似媒体中心，简单起见不实现，可根据需要添加)
        // 如果你想加入触摸手势，可以仿照 media 插件中的 os 类

        // 如果 Utils 存在，可以用一个简单的通知提示已加载
        if (hasUtils) {
            console.log('✅ 空白窗口已安装，按 Alt+B 打开');
            // 也可以轻提示，但避免弹窗打扰
        } else {
            console.log('✅ 空白窗口已安装 (Utils未找到，部分功能可能受限)');
        }
})();
