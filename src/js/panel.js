window.onload = function () {
    loadSettings();
    $("#enable-for-site").click(enableForWebsite);
    $("#disable-for-site").click(disableForWebsite);
}

setInterval(function () {
    updateSettings();
}, 500);

function loadSettings() {
    console.log("loading settings");
    chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
        var domain = new URL(tabs[0].url).hostname;
        chrome.storage.local.get("settings", function (data) {
            var settings = data["settings"];
            if (typeof settings === "undefined") {
                settings = {};
            }
            if (typeof settings["global-toggle"] === "undefined") {
                settings["global-toggle"] = true;
            }
            if (typeof settings["disabled-hostnames"] === "undefined") {
                settings["disabled-hostnames"] = [];
            }
            $("#global-toggle").prop('checked', settings["global-toggle"]);
            if(settings["global-toggle"]){
                $("#global-disabled").hide();
                $("#global-enabled").fadeIn();
            }else{
                $("#global-enabled").hide();
                $("#global-disabled").fadeIn();
            }
            if (settings["disabled-hostnames"].indexOf(domain) != -1) {
                $("#disable-for-site").hide();
                $("#enable-for-site").fadeIn();
            }else{
                $("#enable-for-site").hide();
                $("#disable-for-site").fadeIn();
            }
            $(".sitename").text(domain);
        });
    });
}

function updateSettings() {
    console.log("updating settings");
    chrome.storage.local.get("settings", function (data) {
        var settings = data["settings"];
        if (typeof settings === "undefined"){
            settings = {};
        }
        if (typeof settings["disabled-hostnames"] === "undefined") {
            settings["disabled-hostnames"] = [];
        }
        settings["global-toggle"] = $("#global-toggle").is(':checked');
        chrome.storage.local.set({settings: settings}, function (data) {
            loadSettings();
        });
    });
}

function disableForWebsite() {
    console.log("disabling for site");
    chrome.storage.local.get("settings", function (data) {
        var settings = data["settings"];
        if (typeof settings["disabled-hostnames"] === "undefined") {
            settings["disabled-hostnames"] = [];
        }
        chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
            var domain = new URL(tabs[0].url).hostname;
            settings["disabled-hostnames"].push(domain);
            chrome.storage.local.set({settings: settings}, function (data) {
                loadSettings();
            });
        });
    });
}

function enableForWebsite() {
    console.log("enabling for site");
    chrome.storage.local.get("settings", function (data) {
        var settings = data["settings"];
        if (typeof settings["disabled-hostnames"] === "undefined") {
            settings["disabled-hostnames"] = [];
        }
        chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
            var domain = new URL(tabs[0].url).hostname;
            settings["disabled-hostnames"] = $.grep(settings["disabled-hostnames"], function (item) {
                return item !== domain;
            });
            chrome.storage.local.set({settings: settings}, function (data) {
                loadSettings();
            });
        });
    });
}
