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
HSConsole.prototype.changeCurrentXPath = function(xpath) {
    this.currentXPath.text(xpath);
}
HSConsole.prototype.showDatas = function(datas) {
    this.datas.html("");
    for(var i=0;i<datas.length;i++) {
        this.datas.append(datas[i].getHtml());
    }
    $(".hsNewDataDialogFrom").button({
        icons: {primary: "ui-icon-circle-plus"}
    }).click(function() {
            var parentXPath = $(this).parent().attr("title");
            htmlSelector.enableNewDataInspect(parentXPath);
    });
    $(".hsNewDataDialogFrom2").button({
        icons: {primary: "ui-icon-circle-plus"}
    }).click(function() {
            var parentXPath = $(this).parent().attr("title");
            htmlSelector.console.showNewDataDialog(parentXPath, parentXPath);
        });
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
            return false;
        },
        mouseover: function() {
            $(hsXPath.applyXPath(this.title)).addClass("inspectorSame");
            return false;
        },
        mouseout: function() {
            $(hsXPath.applyXPath(this.title)).removeClass("inspectorSame");
            return false;
        }
    },"li");
}

/***** NEW DATA *****/

/*
 * Affichage de la boîte de dialogue d'ajout d'une nouvelle donnée
 */
HSConsole.prototype.showNewDataDialog = function(xpath, parentData) {
    this.populateNewData(xpath, parentData);
    this.newName.val("");
    this.newDataDialog.dialog("open");
}
/*
 * Population des données pour le dialogue d'ajout d'une nouvelle donnée
 */
HSConsole.prototype.populateNewData = function(xpath, parentData) {
    this.parentData = parentData;
    if(parentData == undefined) {
        this.newParentDiv.hide();
        this.newXPath.val(xpath);
    } else {
        this.newParentDiv.show();
        this.newParentXPath.html(parentData);
        this.newXPath.val(xpath.substring(parentData.length));
    }
    this.newXPathValue = xpath;
    this.newRegex.val("");
    this.newValues = hsXPath.getValues(xpath);

    this.changeNewData(0);
    this.nbNewData.html(this.newValues.length);
}
HSConsole.prototype.changeNewData = function(index) {
    $(hsXPath.applyXPath(this.newXPathValue)[this.newCurrentValueIndex]).removeClass("inspectorSame");
    this.newCurrentValueIndex = index;
    $(hsXPath.applyXPath(this.newXPathValue)[this.newCurrentValueIndex]).addClass("inspectorSame");
    this.indexCurrentData.html(this.newCurrentValueIndex+1);
    this.setDataValue();
}
HSConsole.prototype.setDataValue = function() {
    this.newData.val(
        XRegExp.applyRegex(
            this.newValues[this.newCurrentValueIndex],
            this.newRegex.val()
        )
    );
}
/*
 * Constructeur de la boîte de dialogue d'ajout d'une nouvelle donnée
 */
HSConsole.prototype.initNewData = function(console) {
    /* Dialogue d'une nouvelle donnée */
    $(document.body).append("<div id='hsNewDataDialog' title=\"Ajout d'une nouvelle donnée\">" +
        "<div id='hsNewParentDiv'>Chemin du parent : <span id='hsNewParentXPath'></span><br></div>" +
        "<div><button id='hsNewPrev'>P</button> <span id='hsIndexCurrentData'></span> / <span id='hsNbNewData'></span> <button id='hsNewNext'>N</button></div>" +
        "Chemin de la donnée<br><input size='80' id='hsNewXPath'/><br>" +
        "Expression régulière (variable data)<br><input size='80' id='hsNewRegex'/><br>" +
        "Contenu de la donnée<br><textarea rows='10' cols='80' id='hsNewData'></textarea><br>" +
        "Nom de la donnée<br><input size='80' id='hsNewName'/>" +
        "</div>");
    this.newDataDialog = $("#hsNewDataDialog");
    this.newDataDialog.dialog({
        autoOpen: false,
        width:710,
        modal: true,
        buttons: {
            "Ajouter la donnée" : function() {
                htmlSelector.addData(new HSData(console.newName.val(), console.newXPathValue, console.newRegex.val(), htmlSelector.console.parentData));
                $( this ).dialog( "close" );
            },
            "Annuler" : function() {
                $( this ).dialog( "close" );
            }
        }
    });
    this.newXPath = $("#hsNewXPath").focusout(function() {
        var xpath = $(this).val();
        var x = xpath;
        if(console.parentData != undefined) {
            x = console.parentData + xpath;
        }
        var nodes = hsXPath.applyXPath(x);
        if(nodes.length > 0) {
            $(hsXPath.applyXPath(console.newXPathValue)[console.newCurrentValueIndex]).removeClass("inspectorSame");
            console.populateNewData(x, console.parentData);
        } else {
            var x = console.newXPathValue;
            if(console.parentData != undefined) {
                x = x.substring(console.parentData.length);
            }
            $(this).val(x);
        }
    });
    this.newXPathValue = "";
    this.newParentDiv = $("#hsNewParentDiv");
    this.newParentXPath = $("#hsNewParentXPath");
    this.newData = $("#hsNewData");
    this.newRegex = $("#hsNewRegex").focusout(function() {
        htmlSelector.console.setDataValue();
    });
    this.nbNewData = $("#hsNbNewData");
    this.indexCurrentData = $("#hsIndexCurrentData");
    this.newName = $("#hsNewName");

    $("#hsNewPrev").button({
        icons: {primary: "ui-icon-circle-triangle-w"}
    }).click(function() {
            var c = htmlSelector.console;
            c.changeNewData(((c.newValues.length+c.newCurrentValueIndex-1)%c.newValues.length))
    });
    $("#hsNewNext").button({
        icons: {primary: "ui-icon-circle-triangle-e"}
    }).click(function() {
            var c = htmlSelector.console;
            c.changeNewData(((c.newCurrentValueIndex+1)%c.newValues.length))
    });
}

//^.*(?<data>[a-zA-Z0-9 ,]+).*$