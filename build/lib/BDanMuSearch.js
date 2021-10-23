function BDanMuSearch() {
    this.api = {
        searchApi: function (keyword) {
            return "https://api.bilibili.com/x/web-interface/search/type?search_type=media_bangumi&keyword=" + keyword;
        },
        searchEPApi: function (sid) {
            return "https://api.bilibili.com/pgc/view/web/season?season_id=" + sid;
        },
        getDanMuApiXML: function (sid) {
            return "https://api.bilibili.com/x/v1/dm/list.so?oid=" + sid;
        },
        getDanMuApiProtobuf: function (sid, idx) {
            return "https://api.bilibili.com/x/v2/dm/web/seg.so?type=1&oid="+ sid +"&segment_index=" + idx;
        }
    };
    this.sites = {
        list: ["www.yinghuacd.com"],
        name_el: {
            "www.yinghuacd.com": [".gohome.l","h1","a"]
        },
        ep_el: {
            "www.yinghuacd.com": [".gohome.l","h1","span"]
        }
    };
    this.currentSite = {
        name: "",
        current_bangumi: "",
        current_ep: ""
    };
    this.data = {
        media_id: "",
        season_id: "",
        current_cid: "",
        title: "",
        org_title: "",
        eps: []
    };
}
BDanMuSearch.prototype.search = function (name, ep) {
    this.searchName = this.currentSite.current_bangumi;
    if (name !== null && name !== undefined) {
        this.searchName = name;
    }
    this.searchEp = this.currentSite.current_ep;
    if (ep !== null && ep !== undefined) {
        this.searchEp = ep;
    }
    return this;
}
// 在B站搜索
BDanMuSearch.prototype.then = function (func) {
    let bDanMuSearch = this;
    GM_xmlhttpRequest({
        url:this.api.searchApi(this.searchName),
        method :"GET",
        headers: {
            "Content-type": "application/x-www-form-urlencoded"
        },
        onload:function(xhr){
            // 获得数据后
            let d = JSON.parse(xhr.responseText);
            if (d.code === 0 && d.message === "0") {
                if (d.data.result.length > 0) {
                    let result = d.data.result[0];
                    bDanMuSearch.data.media_id = result.media_id;
                    bDanMuSearch.data.season_id = result.season_id;
                    bDanMuSearch.data.title = result.title;
                    bDanMuSearch.data.org_title = result.org_title;
                    console.log("get data step one:", bDanMuSearch.data);
                    bDanMuSearch.thenSearchEP(func);
                }
            }
        }
    });
}
// 获取B站剧集对应编号
BDanMuSearch.prototype.thenSearchEP = function (func) {
    let bDanMuSearch = this;
    GM_xmlhttpRequest({
        url:this.api.searchEPApi(this.data.season_id),
        method :"GET",
        headers: {
            "Content-type": "application/x-www-form-urlencoded"
        },
        onload:function(xhr){
            // 获得数据后
            let d = JSON.parse(xhr.responseText);
            if (d.code === 0 && d.message === "success") {
                if (Object.keys(d.result).length > 0) {
                    let result = d.result.episodes;
                    for (let item of result) {
                        let ep = {};
                        ep.aid = item.aid;
                        ep.bvid = item.bvid;
                        ep.cid = item.cid;
                        ep.id = item.id;
                        ep.cover = item.cover;
                        ep.long_title = item.long_title;
                        ep.short_link = item.short_link;
                        ep.title = item.title;
                        bDanMuSearch.data.eps.push(ep);
                    }
                    console.log("get data step two:", bDanMuSearch.data.eps);
                    bDanMuSearch.thenSearchCid(func);
                }
            }
        }
    });
}
// 获取B站对应剧集编号的弹幕id
BDanMuSearch.prototype.thenSearchCid = function (func) {
    for (let ep of this.data.eps) {
        if (this.searchEp === ep.title) {
            this.data.current_cid = ep.cid;
            break;
        }
    }
    console.log("get data step three:", this.data.current_cid);
    this.thenGetDanMu(func);
}
// 获取B站弹幕
BDanMuSearch.prototype.thenGetDanMu = function (func) {
    GM_xmlhttpRequest({
        url:this.api.getDanMuApiXML(this.data.current_cid),
        method :"GET",
        headers: {
            "Content-type": "application/x-www-form-urlencoded"
        },
        onload:function(xhr){
            // 获得数据后
            console.log("get data step four:", xhr.responseText);
            if (func !== null && func !== undefined && typeof func === "function") {
                func(xhr);
            }
        }
    });
}
// 获取要搜索的番剧名
BDanMuSearch.prototype.getSearchName = function () {
    if (this.sites.list.includes(this.currentSite.name)) {
        let elMaps = this.sites.name_el[this.currentSite.name];
        let el = null;
        for (let elMap of elMaps) {
            if (el === null) {
                el = $(elMap);
            } else {
                el = $(el).find(elMap);
            }
            console.log("get searchBangumi --- $("+ elMap+") = ", el);
        }
        this.currentSite.current_bangumi = el[0].innerText;
        console.log("get searchName = ", this.currentSite.current_bangumi);
    }
}
// 获取对应剧集
BDanMuSearch.prototype.getSearchEP = function () {
    if (this.sites.list.includes(this.currentSite.name)) {
        let elMaps = this.sites.ep_el[this.currentSite.name];
        let el = null;
        for (let elMap of elMaps) {
            if (el === null) {
                el = $(elMap);
            } else {
                el = $(el).find(elMap);
            }
            console.log("get searchEP --- $("+ elMap+") = ", el);
        }

        this.currentSite.current_ep = parseInt(el[0].innerText.match(/\d+/g)) + "";
        console.log("get searchEP = ", this.currentSite.current_ep);
    }
}
// 设置当前站点
BDanMuSearch.prototype.setCurrentSite = function (site) {
    this.currentSite.name = site;
}

BDanMuSearch.prototype.init = function (site) {
    this.currentSite.name = location.hostname;
    if (site !== null && site !== undefined && this.currentSite.name === "localhost") {
        this.setCurrentSite(site);
    }
    this.getSearchName();
    this.getSearchEP();
}
window.BDanMuSearch = BDanMuSearch;
export default BDanMuSearch;
