function HTMLSelector() {
    this.console = new HSConsole();
    this.datas = [];
}
HTMLSelector.prototype.toggle = function(activated, datas) {
    this.datas = [];
    var d = JSON.parse(datas);
    for(var i=0;i<d.length;i++) {
        this.datas[i] = new HSData(d[i]);
    }
    this.console.showDatas(this.datas);
    if (activated) {
        this.console.show();
    } else {
        this.console.hide();
    }
};
HTMLSelector.prototype.enableNewDataInspect = function() {
    $(document.body).mouseover(function(event) {
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
        var target = $(event.target);
        if(event.target.className != 'ui-button-text'){
            htmlSelector.disableNewDataInspect(target);
            htmlSelector.console.changeCurrentXPath("");
            htmlSelector.console.showNewDataDialog(event.target);
            return false;
        }
    });
};
HTMLSelector.prototype.disableNewDataInspect = function(target) {
    var xpath = hsXPath.getXPath(target[0]);
    target.parents().removeClass("inspectorOverParents");
    $(hsXPath.applyXPath(xpath)).removeClass("inspectorOver");
    $(document.body).removeAttr('onmouseover').removeAttr('onmouseout').removeAttr('onclick').unbind('mouseover').unbind('mouseout').unbind('click');
};
HTMLSelector.prototype.addData = function(data) {
    chrome.extension.sendMessage(data);
    this.datas.push(data);
    this.console.showDatas(this.datas);
}

var htmlSelector = new HTMLSelector();

