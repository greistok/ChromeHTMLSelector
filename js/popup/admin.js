$(document).ready(function()
{
    $("#hsActivated").change(function(){
        var bg = chrome.extension.getBackgroundPage();
        var chk = $("#hsActivated").attr("checked");
        if(chk == undefined) {
            chk = false;
        } else {
            chk = true;
        }
        bg.saveActivated(chk);
    });
    var bg = chrome.extension.getBackgroundPage();
    bg.getOptions(onOptions);
});
// This callback function is called when the content script has been
// injected and returned its results
function onOptions(page, url, options)
{
    $("#hsActivated").attr("checked",options.getPageOption(url).activated);

    $("#method").html(page.method);
    $("#protocol").html(page.protocol);
    $("#host").html(page.hostname);
    $("#path").html(page.pathname);
    $("#hash").html(page.hash);
    if(page.getParams == null) {
        $("#getParams").hide();
    } else {
        $("#getParams").show();
        var html = "";
        for(var name in page.getParams) {
            html += '<li><input id="selectGetParam" value="'+name+'" type="checkbox"/> <b>'+name+' :</b> '+page.getParams[name][0]+'</li>';
        }
        $("#getParams ul").html(html);
    }

    if(page.postParams == null) {
        $("#postParams").hide();
    } else {
        $("#postParams").show();
        var html = "";
        for(var name in page.postParams) {
            html += '<li><input id="selectPostParam" value="'+name+'" type="checkbox"/> <b>'+name+' :</b> '+page.postParams[name][0]+'</li>';
        }
        $("#postParams ul").html(html);
    }
}