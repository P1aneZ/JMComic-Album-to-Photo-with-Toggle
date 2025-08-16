// ==UserScript==
// @name         JM Album to Photo with Toggle
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  带开关控制的jmcomic album 到 photo 重定向
// @author       You
// @match        *://18comic.vip/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';
    
    // 添加自定义样式
    GM_addStyle(`
        .redirect-toggle {
            position: fixed;
            top: 15px;
            right: 15px;
            z-index: 9999;
            background: rgba(255,255,255,0.9);
            padding: 10px 15px;
            border-radius: 20px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            display: flex;
            align-items: center;
            font-family: Arial, sans-serif;
        }
        .switch {
            position: relative;
            display: inline-block;
            width: 50px;
            height: 24px;
            margin: 0 10px;
        }
        .switch input {
            opacity: 0;
            width: 0;
            height: 0;
        }
        .slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #ccc;
            transition: .4s;
            border-radius: 24px;
        }
        .slider:before {
            position: absolute;
            content: "";
            height: 16px;
            width: 16px;
            left: 4px;
            bottom: 4px;
            background-color: white;
            transition: .4s;
            border-radius: 50%;
        }
        input:checked + .slider {
            background-color: #4CAF50;
        }
        input:checked + .slider:before {
            transform: translateX(26px);
        }
    `);
    
    // 主功能
    (function init() {
        // 检查重定向是否启用（默认启用）
        const enabled = GM_getValue('redirectEnabled', true);
        
        // 在页面顶部创建开关
        const createToggle = () => {
            const container = document.createElement('div');
            container.className = 'redirect-toggle';
            
            container.innerHTML = `
                <span>跳转开关:</span>
                <label class="switch">
                    <input type="checkbox" id="redirectToggle" ${enabled ? 'checked' : ''}>
                    <span class="slider"></span>
                </label>
                <span id="status-label">${enabled ? '启用' : '禁用'}</span>
            `;
            
            document.body.appendChild(container);
            
            const toggle = document.getElementById('redirectToggle');
            const statusLabel = document.getElementById('status-label');
            
            toggle.addEventListener('change', function() {
                GM_setValue('redirectEnabled', this.checked);
                statusLabel.textContent = this.checked ? '启用' : '禁用';
                
                // 如果在相册页面且启用了跳转，立即重定向
                if (this.checked && window.location.pathname.includes('/album/')) {
                    redirectAlbum();
                }
            });
        };
        
        // 重定向函数
        const redirectAlbum = () => {
            const path = window.location.pathname;
            if (path.includes('/album/')) {
                const newPath = path.replace('/album/', '/photo/');
                window.location.replace(newPath + window.location.search + window.location.hash);
            }
        };
        
        // 如果启用了重定向且当前是相册URL，立即重定向
        if (enabled && window.location.pathname.includes('/album/')) {
            redirectAlbum();
        }
        
        // 在所有情况下都创建开关（DOM加载完成后）
        window.addEventListener('DOMContentLoaded', createToggle);
    })();
})();