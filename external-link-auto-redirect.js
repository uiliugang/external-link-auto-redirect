// ==UserScript==
// @name         External Link Auto Redirect(Direct Link)
// @name:zh-CN   外链自动重定向（默认直链）
// @namespace    http://tampermonkey.net/
// @version      1.3.1
// @description  redirect to the real URL directly when clicking on a link that contains a redirect URL
// @description:zh-CN  点击包含重定向 URL 的链接时，直接跳转到到真实的 URL
// @author       uiliugang
// @run-at       document-start
// @match        *://*/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/462796/External%20Link%20Auto%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/462796/External%20Link%20Auto%20Redirect.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const redirectRegex = /^https?:\/\/.*\?.*https?/;
    const excludedKeyWords = ['.m3u8', '.flv', '.ts', 'login','sign','auth','logout','register','logout','download','upload','share','video','play','watch','stream','live','embed','api','callback', 'token'];

    function processUrl(redirectURL) {
        const matches = redirectURL.match(redirectRegex);
        console.log(`Matches: ${matches}`);
        if (matches) {
            let index = redirectURL.substring(4).indexOf("http")+3;
            let realUrl = decodeURIComponent(redirectURL.substring(index + 1));
            //console.log(`Decoded URL: ${realUrl}`);
            if (isValidUrlAndNotExclude(realUrl)) {
                return realUrl;
            }
        }
        return null;
    }

    function isValidUrlAndNotExclude(string) {
        try {
            const url = new URL(string);
            const pathname = url.pathname;
            for (const ext of excludedKeyWords) {
                if (pathname.includes(ext)) {
                    return false;
                }
            }
            return true;
        } catch (e) {
            return false;
        }
    }

    document.addEventListener('click', function(e) {
        const element = e.target.closest('a[href]');
        if (element) {
            const processedUrl = processUrl(element.href);
            if (processedUrl) {
                e.preventDefault();
                window.open(processedUrl, '_blank');
            }
        }
        //console.log(`Original URL: ${element.href}`);
        //console.log(`Processed URL: ${processedUrl}`);
    });

    let processedUrl = processUrl(window.location.href);
    if (processedUrl) {
        window.location.replace(processedUrl);
    }
})();