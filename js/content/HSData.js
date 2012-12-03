function HSData(name, xpath, regex, parentData) {
    if(name == undefined) return undefined;
    if(xpath == undefined) {
        this.name = name.name;
        this.xpath = name.xpath;
        this.parentData = name.parentData;
        this.regex = name.regex;
        this.isValue = name.isValue;
        this.childrensData = {};
        htmlSelector.registerData(this);
        for(var children in name.childrensData) {
            var c = name.childrensData[children];
            this.addChildrenData(new HSData(c));
        }
    } else {
        this.name = name;
        this.xpath = xpath;
        this.parentData = parentData;
        this.regex = regex;
        this.isValue = hsXPath.isValue(xpath);
        this.childrensData = {};
        if(parentData != undefined) {
            htmlSelector.getDataFromXPath(parentData).addChildrenData(this);
        }
        htmlSelector.registerData(this);
    }
}
HSData.prototype.addChildrenData = function(data) {
    this.childrensData[data.xpath] = data;
}
HSData.prototype.getHtmlData = function(tab, index, nodes) {
    var current = tab[index];
    var res = "";
    res += "<table border='1'><tr style='border:1px solid blue'>";

    if(nodes == undefined) {
        res += "<td style='border:1px solid black'>";
        if(current.isValue) {
            var datas = hsXPath.getValues(current.xpath);
            for(var i=0;i<datas.length;i++) {
                var d = null;
                d = XRegExp.applyRegex(datas[i], this.regex);
                res += d;
            }
        } else {
            var ns = hsXPath.applyXPath(current.xpath);
            res += this.getHtmlData(tab, index+1, ns);
        }
        res += "</td>";
    } else {
        for(var i=0;i<nodes.length;i++) {
            var node = nodes[i];
            if(current.isValue) {
                res += "<td>aurel</td>";
                var datas = hsXPath.getValues(current.xpath.substring(current.parentData), node);
                for(var i=0;i<datas.length;i++) {
                    var d = null;
                    d = XRegExp.applyRegex(datas[i], this.regex);
                    res += "<td style='border:1px solid black'>";
                    res += d;
                    res += "</td>";
                }
            } else {
                var ns = hsXPath.applyXPath(current.xpath.substring(current.parentData), node);
                res += "<td style='border:1px solid black'>";
                res += this.getHtmlData(tab, index+1, ns);
                res += "</td>";
            }
        }
    }

    res += "</tr></table>";
    return res;
}
HSData.prototype.getHtml = function() {
    var res = "<li title=\""+this.xpath+"\">"+this.name+" " + this.regex + " ";
    if(this.isValue) {
        res += "<span>";

        var parents = [];
        var current = this;
        while(current != undefined) {
            parents.unshift(current);
            current = htmlSelector.getDataFromXPath(current.parentData);
        }

        res += this.getHtmlData(parents, 0);

        res += "</span>";
    } else {
        res += "<div class='hsNewDataDialogFrom'>Ajout</div><div class='hsNewDataDialogFrom2'>Ajout 2</div>";
    }
    var i=0;
    for(var childrenData in this.childrensData) {
        var c = this.childrensData[childrenData];
        if(i==0) res += "<ul>";
        res += c.getHtml();
        i++;
    }
    if(i!=0) res += "</ul>";
    res += "</li>";
    return res;
}