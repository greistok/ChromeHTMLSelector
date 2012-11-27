function HSDatas() {
    var st = localStorage["hs_datas"];
    if(st == undefined || st == null) {
        localStorage["hs_datas"] = "{}";
        st = "{}";
    }
    this.pages = JSON.parse(st);
}
HSDatas.prototype.getPageDatas = function(page) {
    var options = this.pages[page];
    if(options == undefined || options == null) {
        this.addPageDatas(page);
        options = this.pages[page];
    }
    return options;
};
HSDatas.prototype.addData = function(page, data) {
    this.pages[page].push(data);
    this.storeDatas();
}

/* private*/

HSDatas.prototype.addPageDatas = function(page) {
    this.pages[page] = [];
    this.storeDatas();
}
HSDatas.prototype.storeDatas = function() {
    localStorage["hs_datas"] = JSON.stringify(this.pages);
}

var datas = new HSDatas();

