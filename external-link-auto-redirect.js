// ==UserScript==
// @name         外链自动跳转
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  跳转嘎嘎快,适配语雀,少数派,简书,掘金,CSDN,InfoQ,知乎等大部分网站,打开外链时,自动跳转到目标网站.
// @author       uiliugang
// @run-at       document-start
// @match        *://*/*
// ==/UserScript==

(function() {
    'use strict';
    let url = window.location.href;
    // 经本人观察, 主流网站的重定向页面会包含?, 如果不包含?, 默认不是重定向页面, 不跳转.
    if(url.indexOf('?') == -1) return;
    let processedUrl = processUrl(url);
    if(processedUrl !== url){
        window.location.replace(processedUrl);
    }
    function processUrl(redirectURL) {
        let linkSections;
let redirectIdentifier = ['?target=', '?to=', '?ac=2&url=', '?url=','?remoteUrl=','?redirect=','?u=','?goto=','?link='];
        for (let i = 0; i < redirectIdentifier.length; i++) {
            let identifier = redirectIdentifier[i];
            if (redirectURL.indexOf(identifier) !== -1) {
                linkSections = redirectURL.split(identifier);
                return decodeURIComponent(linkSections[1]);
            }
        }
        return redirectURL;
    }
})();

