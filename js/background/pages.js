function HSPage(method, url, params) {
    this.method = method;
    this.getParams = null;
    this.postParams = null;
    if(method == 'POST') {
        this.postParams = params;
    }
    var location = getLocation(url);
    this.hostname = location.hostname;
    this.pathname = location.pathname;
    this.hash = location.hash;
    this.protocol = location.protocol;
    if(location.search != undefined && location.search != null && location.search != "") {
        this.getParams = parseParam(location.search);
    }
}

/******************************************/

function HSPageConfig(name, options) {
    this.name = name;
}

/******************************************/

var parseParam = function(query) {
    var res = {};
    var query = query.substring(1);
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        res[decodeURIComponent(pair[0])] = [];
        res[decodeURIComponent(pair[0])][0] = decodeURIComponent(pair[1]);
    }
    return res;
}

var getLocation = function(page) {
    var l = document.createElement("a");
    l.href = page;
    return l;
};