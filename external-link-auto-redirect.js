// ==UserScript==
// @name         External Link Auto Redirect
// @name:zh-CN   外链自动重定向
// @namespace    http://tampermonkey.net/
// @version      0.4
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

    document.addEventListener('click', function(e) {
        let url  = '';
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
        // 调试打印信息
        console.log(`Original URL: ${url}`);
        console.log(`Processed URL: ${processedUrl}`);
    });

    function processUrl(redirectURL) {
        const matches = redirectURL.match(redirectRegex);
        console.log(`Matches: ${matches}`);
        if (matches && matches[2]) {
            return decodeURIComponent(matches[2]);
        }
        return null;
    }
})();



