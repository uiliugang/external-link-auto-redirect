// ==UserScript==
// @name         External Link Auto Redirect
// @name:zh-CN   外链自动重定向
// @namespace    http://tampermonkey.net/
// @version      1.3.4
// @description  redirect to the real URL directly when clicking on a link that contains a redirect URL
// @description:zh-CN  点击包含重定向 URL 的链接时，直接跳转到到真实的 URL
// @author       uiliugang
// @run-at       document-start
// @match        *://*/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/462796/External%20Link%20Auto%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/462796/External%20Link%20Auto%20Redirect.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const httpPattern = /http/g;
    const firstHttpExcludeWords = ['portal', 'token', 'sorry', 'qrcode', 'account', 'login', 'sign', 'auth', 'logout', 'register', 'upload', 'share', 'video', 'player', 'play', 'watch', 'stream', 'live', 'api', 'callback'];
    const secondHttpExcludeWords = ['.m3u8', '.flv', '.ts']


    function parseUrl(redirectURL) {
        let index = findSecondHttpPosition(redirectURL);
        if (index !== -1) {
            let realUrl = redirectURL.substring(index);
            let firstHttp = redirectURL.substring(0, index).toLowerCase();
            let secondHttp = realUrl.toLowerCase();

            for (const ext of firstHttpExcludeWords) {
                if (firstHttp.includes(ext)) {
                    console.log(`firstHttpExcludeWord: ${ext}`);
                    return null;
                }
            }

            for (const ext of secondHttpExcludeWords) {
                if (secondHttp.includes(ext)) {
                    console.log(`secondHttpExcludeWord: ${ext}`);
                    return null;
                }
            }

            realUrl = decodeURIComponent(realUrl);

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

        while ((match = httpPattern.exec(redirectURL)) !== null) {
            count++;
            if (count === 2) {
                position = match.index;
                console.log(`Redirect URL: ${redirectURL}`);
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

    document.addEventListener('click', function (e) {
        const element = e.target.closest('a[href]');
        if (element) {
            const parsedUrl = parseUrl(element.href);
            if (parsedUrl) {
                e.preventDefault();
                window.open(parsedUrl, '_blank');
            }
        }
    });

    let parsedUrl = parseUrl(window.location.href);
    if (parsedUrl) {
        window.location.replace(parsedUrl);
    }

    console.log(`parsed URL: ${parsedUrl}`);
})();
