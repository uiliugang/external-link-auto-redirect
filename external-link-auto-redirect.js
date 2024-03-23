// ==UserScript==
// @name         External Link Auto Redirect(Direct Link)
// @name:zh-CN   外链自动重定向（默认直链）
// @namespace    http://tampermonkey.net/
// @version      1.3.3
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

    const httpPattern = /http/g;
    const excludedKeyWords = ['.m3u8', '.flv', '.ts', 'portal', 'qrcode', 'login','sign','auth','logout','register','upload','share','video','player','play','watch','stream','live','api','callback', 'token'];

    function processUrl(redirectURL) {
        let index = findSecondHttpPosition(redirectURL);
        if (index !== -1) {
            let url = redirectURL.toLowerCase();
            for (const ext of excludedKeyWords) {
                if (url.includes(ext)) {
                    console.log(`Excluded Keyword: ${ext}`);
                    return null;
                }
            }
            let realUrl = decodeURIComponent(redirectURL.substring(index));
            console.log(`Decoded URL: ${realUrl}`);
            if (isValidUrl(realUrl)) {
                return realUrl;
            }
        }
        return null;
    }

    function findSecondHttpPosition(redirectURL) {
        let match;
        let position = -1;
        let count = 0;
        console.log(`redirectURL : ${redirectURL}`);

        while ((match = httpPattern.exec(redirectURL)) !== null) {
            count++;
            if (count === 2) {
                position = match.index;
                return position;
            }
        }
        return -1;
    }

    function isValidUrl(realUrl) {
        try {
            const url = new URL(realUrl);
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
        console.log(`Original URL: ${element.href}`);
        console.log(`Processed URL: ${processedUrl}`);
    });

    let processedUrl = processUrl(window.location.href);
    if (processedUrl) {
        window.location.replace(processedUrl);
    }
})();
