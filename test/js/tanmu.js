// ==UserScript==
// @name        B弹幕
// @author      uyume
// @description 获取并展示B站弹幕
// @namespace   YuanuYume
// @license     GPL version 3
// @encoding    utf-8
// @include     https://www.baidu.com/*
// @grant        GM_xmlhttpRequest
// @run-at      document-end
// @version     1.0.0
// ==/UserScript==
let api = "https://api.bilibili.com/x/v1/dm/list.so?oid="
let oid = "72540443"
GM_xmlhttpRequest({
    method: "GET",
    url: api + oid,
    onload: function(res) {
        if (res.status === 200) {
            var text = res.responseText;
            console.log(text);
        }
    }
});
