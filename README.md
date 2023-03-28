# external-link-auto-redirect
tampermonkey script, auto redirect external link to your target instead of jump page.

- 默认只在url中包含问号?的中间页面起作用(已经覆盖了大部分网站的情形)
- 可以自己添加跳转页面链接的标识符, 比如'?url=','?target=', 直接加在js文件里的redirectIdentifier 列表.

- by default, it just work with the page whose window's location.href(url in address bar) has a question mark ?
- it's easy to add custom jump page url identifier like '?url=','?target='. 
