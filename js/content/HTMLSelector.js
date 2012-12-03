function HTMLSelector() {
    this.console = new HSConsole();
    this.rootDatas = [];
    this.allDatas = {};
}
HTMLSelector.prototype.toggle = function(activated, datas) {
    this.rootDatas = [];
    this.allDatas = [];
    var d = JSON.parse(datas);
    for(var i=0;i<d.length;i++) {
        new HSData(d[i]);
    }
    this.console.showDatas(this.rootDatas);
    if (activated) {
        this.console.show();
    } else {
        this.console.hide();
    }
};



HTMLSelector.prototype.enableNewDataInspect = function(parentXPath) {
    var nodes = document.body;
    if(parentXPath != undefined) {
        nodes = hsXPath.applyXPath(parentXPath);
    }
    $(nodes).mouseover(function(event) {
        var target = $(event.target);
        var xpath = hsXPath.getXPath(event.target);
        target.parents().addClass("inspectorOverParents");
        $(hsXPath.applyXPath(xpath)).addClass("inspectorOver");
        htmlSelector.console.changeCurrentXPath(xpath);
    }).mouseout(function(event) {
        var target = $(event.target);
        var xpath = hsXPath.getXPath(event.target);
        target.parents().removeClass("inspectorOverParents");
        $(hsXPath.applyXPath(xpath)).removeClass("inspectorOver");
    }).click(function(event) {
        var target = $(nodes);
        target.removeClass("inspectorAnchor");
        if(event.target.className != 'ui-button-text'){
            var xpath = hsXPath.getXPath(event.target);
            htmlSelector.disableNewDataInspect(target, $(hsXPath.applyXPath(xpath)));
            htmlSelector.console.changeCurrentXPath("");
            htmlSelector.console.showNewDataDialog(xpath, parentXPath);
            return false;
        }
    }).addClass("inspectorAnchor");
};
HTMLSelector.prototype.disableNewDataInspect = function(parent, nodes) {

    nodes.parents().removeClass("inspectorOverParents");
    nodes.removeClass("inspectorOver");
    parent.removeAttr('onmouseover').removeAttr('onmouseout').removeAttr('onclick').unbind('mouseover').unbind('mouseout').unbind('click');
};
HTMLSelector.prototype.addData = function(data) {
    chrome.extension.sendMessage(this.rootDatas);
    this.console.showDatas(this.rootDatas);
}
HTMLSelector.prototype.registerData = function(data) {
    if(data.parentData == undefined) {
        this.rootDatas.push(data);
    }
    this.allDatas[data.xpath] = data;
}
HTMLSelector.prototype.getDataFromXPath = function(xpath) {
    return this.allDatas[xpath];
}

var htmlSelector = new HTMLSelector();

