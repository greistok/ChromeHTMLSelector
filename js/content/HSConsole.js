function HSConsole() {
    $(document.body).append("<div id='hsConsole' title='Console HTMLSelector'>" +
        "<span id='currentXPath'></span><br>" +
        "</div>");
    $(document.body).attr("id","body");
    this.consoleDiv = $("#hsConsole");
    this.currentXPath = $("#currentXPath");
    this.consoleDiv.dialog({
        width: 710,
        height: 300
    });
    this.consoleDiv.parent().scrollFollow({offset:60,container:'body'});
    this.hide();
    this.initUI();
}
HSConsole.prototype.show = function() {
    this.consoleDiv.parent().show();
}
HSConsole.prototype.hide = function() {
    this.consoleDiv.parent().hide();
}
HSConsole.prototype.showNewDataDialog = function(target) {
    this.populateNewData(target);
    this.newDataDialog.dialog("open");
}
HSConsole.prototype.changeCurrentXPath = function(xpath) {
    this.currentXPath.text(xpath);
}
HSConsole.prototype.populateNewData = function(node) {
    var xpath = hsXPath.getXPath(node);
    this.newXPath.val(xpath);
    this.newXPathValue = xpath;
    this.nbNewData.html(hsXPath.applyXPath(xpath).length);
    this.newData.val($(node).html());
    this.newRegex.val("");
    this.newName.val("");
}
HSConsole.prototype.showDatas = function(datas) {
    this.datas.html("");
    for(var i=0;i<datas.length;i++) {
        this.datas.append(datas[i].getHtml());
    }
}

HSConsole.prototype.initUI = function() {
    var console = this;
    this.consoleDiv.append("<button id='addDataButton'>Ajouter une donnée</button>");
    $("#addDataButton").button({
        icons: {primary: "ui-icon-circle-plus"}
    }).click(function() {
            htmlSelector.enableNewDataInspect();
        });

    this.initNewData(console);
    this.initDatas(console);
}

HSConsole.prototype.initDatas = function(console) {
    this.consoleDiv.append("<ul id='hsDatas'></ul>");
    this.datas = $("#hsDatas");
    this.datas.on({
        click: function() {
            alert(this.title);
        },
        mouseover: function() {
            $(hsXPath.applyXPath(this.title)).addClass("inspectorSame");
        },
        mouseout: function() {
            $(hsXPath.applyXPath(this.title)).removeClass("inspectorSame");
        }
    },"li");
}

HSConsole.prototype.initNewData = function(console) {
    /* Dialogue d'une nouvelle donnée */
    $(document.body).append("<div id='hsNewDataDialog' title=\"Ajout d'une nouvelle donnée\">" +
        "Chemin de la donnée / Nb noeuds : <span id='hsNbNewData'></span> <input size='80' id='hsNewXPath'/>" +
        "Expression régulière (variable data) <input size='80' id='hsNewRegex'/>" +
        "Contenu de la donnée <textarea rows='10' cols='80' id='hsNewData'></textarea>" +
        "Nom de la donnée <input size='80' id='hsNewName'/>" +
        "</div>");
    this.newDataDialog = $("#hsNewDataDialog");
    this.newDataDialog.dialog({
        autoOpen: false,
        width:710,
        modal: true,
        buttons: {
            "Ajouter la donnée" : function() {
                htmlSelector.addData(new HSData(console.newName.val(), console.newXPathValue, console.newRegex.val()));
                $( this ).dialog( "close" );
            },
            "Annuler" : function() {
                $( this ).dialog( "close" );
            }
        }
    });
    this.newXPath = $("#hsNewXPath").focusout(function() {
        var nodes = hsXPath.applyXPath($(this).val());
        if(nodes.length > 0) {
            console.populateNewData(nodes[0]);
        } else {
            $(this).val(console.newXPathValue);
        }
    });
    this.newXPathValue = "";
    this.newData = $("#hsNewData");
    this.newRegex = $("#hsNewRegex").focusout(function() {
        var r = $(this).val();
        if(r != "") {
            var reg = XRegExp(r, 's');
            var data = XRegExp.exec(console.newData.val(), reg);
            if(data != null && data != undefined && data.data != null) {
                console.newData.val(data.data);
            }
        }
    });
    this.nbNewData = $("#hsNbNewData");
    this.newName = $("#hsNewName");
}
