// ==UserScript==
// @name         External Link Auto Redirect
// @name:zh-CN   外链自动重定向
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  redirect to the real URL directly when clicking on a link that contains a redirect URL
// @description:zh-CN  点击包含重定向 URL 的链接时，直接重定向到真实的 URL
// @author       uiliugang
// @run-at       document-start
// @match        *://*/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/462796/External%20Link%20Auto%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/462796/External%20Link%20Auto%20Redirect.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    const redirectRegex = /[?&#](target|to|ac=2&url|url|remoteUrl|redirect|u|goto|link)=([^&]+)/i;

    // 情形一：点击的元素具有 href 属性， 并且原网页链接就是重定向链接
    document.addEventListener('click', function(e) {
        let url = '';
        let processedUrl = '';
        // 检查点击的元素是否具有 href 属性
        if (e.target && e.target.href) {
            url = e.target.href;
            processedUrl = processUrl(url);
            if (processedUrl) {
                e.preventDefault();
                window.open(processedUrl, '_blank');
            }
        }

        // 如果点击的元素没有 href 属性，则检查其父元素
        else if (e.target.parentElement && e.target.parentElement.href) {
            url = e.target.parentElement.href;
            processedUrl = processUrl(url);
            if (processedUrl) {
                e.preventDefault();
                window.open(processedUrl, '_blank');
            }
        }
        // 如果点击的元素或其父元素都没有 href 属性，则检查其祖先元素
        else if (e.target.parentElement && e.target.parentElement.parentElement && e.target.parentElement.parentElement.href) {
            url = e.target.parentElement.parentElement.href;
            processedUrl = processUrl(url);
            if (processedUrl) {
                e.preventDefault();
                window.open(processedUrl, '_blank');
            }
        }
        // 调试信息
        console.log(`Original URL: ${url}`);
        console.log(`Processed URL: ${processedUrl}`);
    });

    // 情形二：原网页显示的链接是直链，但是监听 click 事件，当点击时，会发生重定向
    let processedUrl = processUrl(window.location.href);
    if(processedUrl){
        window.location.replace(processedUrl);
    }

    function processUrl(redirectURL) {
        const matches = redirectURL.match(redirectRegex);
        console.log(`Matches: ${matches}`);
        if (matches && matches[2]) {
            // 判断 URL 是否合法
            const urlRegex = /^(https?|ftp):\/\/(\S+)?/i;
            const realUrl = decodeURIComponent(matches[2]);
            if (realUrl.match(urlRegex)) {
                return realUrl;
            }
        }
        return null;
    }
})();



