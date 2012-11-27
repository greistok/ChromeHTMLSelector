function HSOption(page) {
    this.page = page;
    this.activated = false;
}

function HSOptions() {
    var st = localStorage["hs_options"];
    if(st == undefined || st == null) {
        localStorage["hs_options"] = "{}";
        st = "{}";
    }
    this.pages = JSON.parse(st);
}
HSOptions.prototype.getPageOption = function(page) {
    var option = this.pages[page];
    if(option == undefined || option == null) {
        this.addPageOption(page);
        option = this.pages[page];
    }
    return option;
};
HSOptions.prototype.setActivate = function(page, bool) {
    this.getPageOption(page).activated = bool;
    this.storeOptions();
}

/* private*/

HSOptions.prototype.addPageOption = function(page) {
    this.pages[page] = new HSOption(page);
    this.storeOptions();
}
HSOptions.prototype.storeOptions = function() {
    localStorage["hs_options"] = JSON.stringify(this.pages);
}

var options = new HSOptions();

