function HSData(name, xpath, regex) {
    if(xpath == undefined) {
        this.name = name.name;
        this.xpath = name.xpath;
        this.regex = name.regex;
    } else {
        this.name = name;
        this.xpath = xpath;
        this.regex = regex;
    }
}
HSData.prototype.getHtml = function() {
    var res = "<li title=\""+this.xpath+"\">"+this.name+" " + this.regex + " " +
        "<span><table><tr>";
    var datas = hsXPath.applyXPath(this.xpath);
    for(var i=0;i<datas.length;i++) {
        var d = $(datas[i]).html();
        if(this.regex != undefined && this.regex != "") {
            var reg = XRegExp(this.regex, 's');
            var data = XRegExp.exec(d, reg);
            if(data != null && data != undefined && data.data != null) {
                d = data.data;
            }
        }
        res += "<td style='border:1px solid black'>"+d+"</td>";
    }
    res += "</tr></table></span>" +
        "</li>";
    return res;
}