// ==UserScript==
// @name         External Link Auto Redirect(Direct Link)
// @name:zh-CN   外链自动重定向（默认直链）
// @namespace    http://tampermonkey.net/
// @version      1.0
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

    const redirectRegex = /[?&#](target|to|ac=2&url|url|remoteUrl|redirect|u|goto|link)=([^&]+)/i;
    const videoExtensions = ['.mp4', '.m3u8', '.avi', '.mov', '.wmv', '.mkv', '.flv', '.webm', '.mpeg', '.mpg', '.mp2v', '.m4v', '.svi', '.asx', '.wmv', '.wmx', '.m4p', '.m4b', '.mxf', '.roq', '.nsv', '.flv', '.mpe?g', '.mp3v', '.m1v', '.m2v', '.vob', '.ifo', '.dat', '.divx', '.cpk', '.dirac', '.drc', '.mj2', '.mjv', '.mod', '.tod', '.rec', '.uvh', '.uvu', '.qt', '.rm', '.ram', '.rpm', '.smil', '.ice', '.gifv', '.nsv', '.3ivx', '.3gpp', '.f4v', '.f4p', '.f4a', '.f4b', '.mxf', '.roq', '.nsv', '.flv', '.m4v', '.avi', '.dat', '.divx', '.cpk', '.dirac', '.drc', '.mj2', '.mjp2', '.mjv', '.mod', '.tod', '.rec', 'uvh', 'uvu', 'qt', 'mov', 'movie', 'rm', 'ra', 'ram', 'rpm', 'smil', 'ice', 'mpe?g', 'mp2v', 'mp3v', 'm4v', 'svi', '.asx', 'wmv', 'wmx', 'wm', 'asf', 'amv', 'mpv', 'm1v', 'm2v', 'vob', '.ifo'];

    function processUrl(redirectURL) {
        const matches = redirectURL.match(redirectRegex);
        let realUrl = null;
        if (matches && matches[2]) {
            realUrl = decodeURIComponent(matches[2]);
            if (isValidUrlAndNotVideo(realUrl)) {
                console.log(`Matches: ${realUrl}`);
                return realUrl;
            }
        }
        return null;
    }

    function isValidUrlAndNotVideo(string) {
        try {
            const url = new URL(string);
            const pathname = url.pathname;
            for (const ext of videoExtensions) {
                if (pathname.endsWith(ext)) {
                    return false;
                }
            }
            return true;
        } catch (e) {
            return false;
        }
    }

    function handleClick(e) {
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
    }

    document.addEventListener('click', handleClick);

    let processedUrl = processUrl(window.location.href);
    if (processedUrl) {
        window.location.replace(processedUrl);
    }
})();