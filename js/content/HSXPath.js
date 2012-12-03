function HSXPath() {}
HSXPath.prototype.getXPath = function(node) {

    if(node == null || node.localName == null) return "";

    var nodePath = node.localName;
    if(node.id && nodePath != "body") nodePath += '[@id=\'' + node.id + '\']';

    return this.getXPath(node.parentNode) + "/" + nodePath;
}
HSXPath.prototype.applyXPath = function (xpath, node) {
    var i, r = [], x = document.evaluate(xpath.split("/text()")[0].split("/@")[0], node || document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
    while(i=x.iterateNext()) r.push(i);
    return r;
}
HSXPath.prototype.getValues = function(xpath, parent) {
    var tmp = xpath.split("/@");
    var res = [];
    if(tmp.length == 2) {
        // Attribut
        var nodes = $(this.applyXPath(tmp[0],parent));
        for(var i=0;i<nodes.length;i++) {
            res.push($(nodes[i]).attr(tmp[1]));
        }
    } else {
        tmp = xpath.split("/text()");
        var test = this.applyXPath(tmp[0],parent);
        var nodes = $(this.applyXPath(tmp[0],parent));
        if(tmp.length==2) {
            for(var i=0;i<nodes.length;i++) {
                res.push($(nodes[i]).text());
            }
        } else {
            // HTML
            for(var i=0;i<nodes.length;i++) {
                res.push(nodes[i].outerHTML);
            }
        }
    }
    return res;
}
HSXPath.prototype.isValue = function(xpath) {
    return xpath.split("/@").length>1 || xpath.split("/text()").length>1;
}

var hsXPath = new HSXPath();