function HSXPath() {}
HSXPath.prototype.getXPath = function(node) {

    if(node == null || node.localName == null) return "";

    var nodePath = node.localName;
    if(node.id && nodePath != "body") nodePath += '[@id=\'' + node.id + '\']';

    return this.getXPath(node.parentNode) + "/" + nodePath;
}
HSXPath.prototype.applyXPath = function (xpath, node) {
    var i, r = [], x = document.evaluate(xpath, node || document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
    while(i=x.iterateNext()) r.push(i);
    return r;
}

var hsXPath = new HSXPath();