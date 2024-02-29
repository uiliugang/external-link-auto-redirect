// ==UserScript==
// @name         External Link Auto Redirect
// @name:zh-CN   外链自动重定向
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  redirect to the real URL quickly, 快速重定向
// @author       uiliugang
// @run-at       document-start
// @match        *://*/*
// @license      MIT
// ==/UserScript==

(function() {
    'use strict';
    let url = window.location.href;
    if (!url.includes('?')) return;
    let processedUrl = processUrl(url);
    if (processedUrl) {
        window.location.replace(processedUrl);
    }

    function processUrl(redirectURL) {
        const redirectRegex = /[?&](target|to|ac=2&url|url|remoteUrl|redirect|u|goto|link)=([^&]+)/i;
        const matches = redirectURL.match(redirectRegex);
        if (matches && matches[2]) {
            try {
                return decodeURIComponent(matches[2]);
            } catch (e) {
                console.error('Error decoding URL:', e);
                return redirectURL;
            }
        }
        return null;
    }
})();