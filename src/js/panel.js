window.onload = function () {
    loadSettings();
}

function loadSettings() {
    chrome.storage.local.get("settings", function (data) {
        var settings = data["settings"];
        if (typeof settings["global-toggle"] === "undefined") {
            settings["global-toggle"] = true;
        }
        $("#global-toggle").prop('checked', settings["global-toggle"]);
        if(settings["global-toggle"]){
            $("#global-disabled").hide();
            $("#global-enabled").fadeIn();
        }else{
            $("#global-enabled").hide();
            $("#global-disabled").fadeIn();
        }
    });
}

function updateSettings() {
    chrome.storage.local.get("settings", function (data) {
        var settings = data["settings"];
        settings["global-toggle"] = $("#global-toggle").prop('checked');
        console.log(settings);
        chrome.storage.local.set({settings: settings}, function () {});
    });
    loadSettings();
}

$("#global-toggle").click(updateSettings);