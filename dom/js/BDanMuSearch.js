import apiData from "./ApiData"

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
            return "http://api.bilibili.com/x/v2/dm/web/seg.so?type=1&oid="+ sid +"&segment_index=" + idx;
        }
    };
    this.sites = {
        list: [],
        siteEl: {}
    };
    this.currentSite = "";
    this.searchMap = {
        searchName: "",
        searchEP: ""
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
// 在B站搜索
BDanMuSearch.prototype.search = function () {
    // 获得数据后
    let d = apiData.searchResult;
    console.log(d);
    if (d.code === 0 && d.message === "0") {
        if (d.data.result.length > 0) {
            let result = d.data.result[0];
            this.data.media_id = result.media_id;
            this.data.season_id = result.season_id;
            this.data.title = result.title;
            this.data.org_title = result.org_title;
        }
    }
    console.log("get data step one:", this.data);
    return this;
}
// 获取B站剧集对应编号
BDanMuSearch.prototype.thenSearchEP = function () {
    let d = apiData.eps;
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
                this.data.eps.push(ep);
            }
        }
    }
    console.log("get data step two:", this.data);
    return this;
}
// 获取B站对应剧集编号的弹幕id
BDanMuSearch.prototype.thenSearchCid = function () {
    this.data.current_cid = this.data.eps[0].cid;
    console.log("get data step three:", this.data);
    return this;
}
// 获取B站弹幕
BDanMuSearch.prototype.thenGetDanMu = function () {
    console.log("get data step four:", this.data);
    return this;
}
// 获取要搜索的番剧名
BDanMuSearch.prototype.getSearchName = function () {

}
// 获取对应剧集
BDanMuSearch.prototype.getSearchEP = function () {

}
// 设置当前站点
BDanMuSearch.prototype.setCurrentSite = function (site) {
    this.currentSite = site;
}

export default BDanMuSearch;
