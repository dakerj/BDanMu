// ==UserScript==
// @name         BDanMu
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  在樱花看B站弹幕
// @author       uYume
// @match        http://localhost:63342/BDanMu/dom/html/*
// @match        http://www.yinghuacd.com/v/*.html
// @match        http://tup.yinghuacd.com/*
// @icon         https://www.bilibili.com/favicon.ico?v=1
// @grant        GM_xmlhttpRequest
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.min.js
// ==/UserScript==
(function() {
    'use strict';
    let $ = window.$;

    const bDanMuSearch = new BDanMuSearch();
    bDanMuSearch.init("www.yinghuacd.com");
    let bDanMu = this;
    bDanMuSearch.search().then((xhr) => {
        let dom = $(xhr.responseText);
        bDanMu.addXmlToDanMuChi(dom);
        bDanMu.start();
    });
    let el = bDanMuSearch.getVideoParent();
    if ($(el).is("iframe")) {
        let ifm = document.getElementById("b-iframe");
        console.log(ifm.contentWindow);
        ifm.onload = function () {
            console.log(ifm.contentWindow);
            console.log(this.contentWindow);
            let document1 = window.frames["b-iframe"].document;
            let ele = $(document1).find(bDanMuSearch.sites.video_el[bDanMuSearch.currentSite.name].pop());
            console.log("real parent = ", ele);
            const bDanMu = new BDanMu(ele);
            bDanMu.init();
        }
        //
        // $(el).on("load", null,null,function (){
        //     const bDanMu = new BDanMu(bDanMuSearch.getVideoParent());
        //     bDanMu.init();
        // })
    } else {
        const bDanMu = new BDanMu(el)
        bDanMu.init();
    }
})();