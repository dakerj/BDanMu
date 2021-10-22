import data from "./ApiData"

function BDanMuSearch() {
    this.api = {
        searchApi: "",
        searchEPApi: "",
        searchCid: "",
        getDanMuApi: ""
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
}
// 在B站搜索
BDanMuSearch.prototype.search = function () {

}
// 获取B站剧集对应编号
BDanMuSearch.prototype.thenSearchEP = function (data) {

}
// 获取B站对应剧集编号的弹幕id
BDanMuSearch.prototype.thenSearchCid = function (data) {

}
// 获取B站弹幕
BDanMuSearch.prototype.thenGetDanMu = function (data) {

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
