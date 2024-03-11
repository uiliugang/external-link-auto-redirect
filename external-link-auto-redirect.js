// ==UserScript==
// @name         External Link Auto Redirect
// @name:zh-CN   外链自动重定向
// @namespace    http://tampermonkey.net/
// @version      0.6
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
    });

    // 情形二：原网页显示的链接是直链，但是监听 click 事件，当点击时，会发生重定向
    let processedUrl = processUrl(window.location.href);
    if(processedUrl){
        window.location.replace(processedUrl);
    }

    function processUrl(redirectURL) {
        const matches = redirectURL.match(redirectRegex);
        if (matches && matches[2]) {
            const realUrl = decodeURIComponent(matches[2]);
            if (isValidUrlAndNotVideo(realUrl)) {
                console.log(`Matches: ${matches}`, `Real URL: ${realUrl}`);
                return realUrl;
              } 
        }
        return null;
    }

    function isValidUrlAndNotVideo(string) {
        try {
          // 创建URL对象
          const url = new URL(string);
          
          // 获取URL的路径名
          const pathname = url.pathname;
          
          // 定义一个包含常见视频文件扩展名的数组
          const videoExtensions = ['.mp4', '.m3u8', '.avi', '.mov', '.wmv', '.mkv', '.flv', '.webm', '.mpeg', '.mpg', '.mp2v', '.m4v', '.svi', '.asx', '.wmv', '.wmx', '.m4p', '.m4b', '.mxf', '.roq', '.nsv', '.flv', '.mpe?g', '.mp3v', '.m1v', '.m2v', '.vob', '.ifo', '.dat', '.divx', '.cpk', '.dirac', '.drc', '.mj2', '.mjv', '.mod', '.tod', '.rec', '.uvh', '.uvu', '.qt', '.rm', '.ram', '.rpm', '.smil', '.ice', '.gifv', '.nsv', '.3ivx', '.3gpp', '.f4v', '.f4p', '.f4a', '.f4b', '.mxf', '.roq', '.nsv', '.flv', '.m4v', '.avi', '.dat', '.divx', '.cpk', '.dirac', '.drc', '.mj2', '.mjp2', '.mjv', '.mod', '.tod', '.rec', 'uvh', 'uvu', 'qt', 'mov', 'movie', 'rm', 'ra', 'ram', 'rpm', 'smil', 'ice', 'mpe?g', 'mp2v', 'mp3v', 'm4v', 'svi', '.asx', 'wmv', 'wmx', 'wm', 'asf', 'amv', 'mpv', 'm1v', 'm2v', 'vob', '.ifo'];
      
          // 检查路径名是否以视频文件扩展名结尾
          for (const ext of videoExtensions) {
            if (pathname.endsWith(ext)) {
              return false; // 如果是视频文件扩展名，返回false
            }
          }
      
          // 如果不是视频文件，返回true
          return true;
        } catch (e) {
          // 如果抛出异常，说明URL不合法，返回false
          return false;
        }
      }

})();



