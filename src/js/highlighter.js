document.querySelector('body').addEventListener('keypress', function (event) {
    if (document.activeElement.nodeName == "INPUT" || document.activeElement.nodeName == "TEXTAREA") {
        return;
    }
    if (event.key == "r") {
        KeyBindings.init();
    }
    if (event.key == "t") {
        KeyBindings.toggle();
    }
    action = KeyBindings.executeKeyPress(event.key);
    if (action) {
        event.preventDefault();
    }
});

window.onload = function () {
    KeyBindings.init();
}

class KeyBindings {
    static toggle() {
        if (this.shown == true) {
            this.hideOverlays();
            this.shown = false;
        } else {
            this.showOverlays();
            this.shown = true;
        }
    }

    static init() {
        var elements = KBD.getElementsInOrder();
        this.loadKeyPresses(elements);
        this.showHighlights(true);

        setTimeout(function () {
            setInterval(function () {
                KeyBindings.showHighlights(false);
            }, 50);
        }, 2000);

        this.showOverlays();
    }

    static showOverlays() {
        $(".kbd-overlay").fadeIn(400);
    }

    static hideOverlays() {
        $(".kbd-overlay").fadeOut(400);
    }

    static showHighlights(firstpaint) {
        var keys = Object.keys(this.bindings);
        var i = 0;
        $(".kbd-common").remove();
        for (var key of keys) {
            var element = this.bindings[key];
            var loc = offset(element);
            var overlay = $("<div class='kbd-overlay kbd-common'><div class='kbd-keymark kbd-common'>" + key + "&nbsp;</div></div>").appendTo("body");
            overlay.css('top', loc.top - 5);
            overlay.css('left', loc.left - 5);
            overlay.css('width', loc.width + 15);
            overlay.css('height', loc.height + 5);
            if (firstpaint) {
                overlay.addClass("kbd-firstpaint");
            }
            // var keymark = $("<div class='kbd-key kbd-common'>" + key + "</div>").appendTo("body");
            // keymark.css('top', loc.top);
            // keymark.css('left', loc.left - 32);
            i++;
        }
    }

    static getOffset(element) {
        const rect = element.getBoundingClientRect();
        return {
            left: rect.left + window.scrollX,
            top: rect.top + window.scrollY
        };
    }

    static executeKeyPress(key) {
        // if (key.toLowerCase() === "escape") {
        //     console.log("escape");
        //     return false;
        // }

        var ret = true;
        var elementToSelect = this.bindings[key];
        console.log(key);
        if (elementToSelect == null) {
            console.log("null");
            ret = false;
            return ret;
        }
        
        elementToSelect.click();
        elementToSelect.focus();

        var clicked_ones = [];
        chrome.storage.local.get(['kbd-clicked'], function (data) {
            clicked_ones = Array.from(data['kbd-clicked']);
        });
        var metadata = [
            new Date().getUTCHours(),
            elementToSelect.classList.length > 0 ? 1 : 0,
            elementToSelect.offsetHeight,
            elementToSelect.offsetWidth,
            elementToSelect.hasAttribute("href") ? 1 : 0,
            $(elementToSelect).is("img") ? 1 : 0
        ];
        clicked_ones.push(metadata);
        chrome.storage.local.set({ 'kbd-clicked': clicked_ones });
        chrome.storage.local.set({ 'kbd-unclicked': clicked_ones });
        var links = []
        chrome.storage.local.get(['kbd-everclicked'], function (data) {
            links = data['kbd-everclicked'];
        });
        if (elementToSelect.hasAttribute("href")) {
            links.push(elementToSelect.href);
        }
        chrome.storage.local.set({'kbd-everclicked': links});
        if (clicked_ones.length % 1 === 0) {
            chrome.runtime.sendMessage("train");
        }
        return ret;
    }

    static loadKeyPresses(elements) {
        var order = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
        
        var unclicked_ones = [];
        chrome.storage.local.get(['kbd-unclicked'], function (data) {
            unclicked_ones = Array.from(data['kbd-unclicked']);
        });
        
        var keymap = {};
        for (var i = 0; i < elements.length && i < 8; i++) {
            keymap[order[i]] = elements[i];
            var metadata = [
                new Date().getUTCHours(),
                elements[i].classList.length > 0 ? 1 : 0,
                elements[i].offsetHeight,
                elements[i].offsetWidth,
                elements[i].hasAttribute("href") ? 1 : 0,
                $(elements[i]).is("img") ? 1 : 0
            ];
            unclicked_ones.push(metadata);
        }
        chrome.storage.local.set({'kbd-unclicked': unclicked_ones});
        this.bindings = keymap;
    }
}

function offset(element) {
    var rect = element.getBoundingClientRect(),
        scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
        scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    return { top: rect.top + scrollTop, left: rect.left + scrollLeft, width: rect.width, height: rect.height }
}