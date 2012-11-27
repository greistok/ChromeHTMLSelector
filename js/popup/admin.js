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
function onOptions(page, options)
{
    $("#hsActivated").attr("checked",options.getPageOption(page).activated);
}