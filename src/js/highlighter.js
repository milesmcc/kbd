document.querySelector('body').addEventListener('keypress', function(event) {
    KeyBindings.executeKeyPress(event.key);
    console.log("key pressed: " + event.key)
});

window.onload = function() {
    KeyBindings.init();
}

class KeyBindings {
    static init() {
        var elements = KBD.getElementsInOrder();
        this.loadKeyPresses(elements);
        this.showHighlights();
    }

    static showHighlights() {
        var keys = Object.keys(this.bindings);
        var i = 0;
        for(var key of keys){
            var element = this.bindings[key];
            var rect = element.getBoundingClientRect();
            var width = rect.right - rect.left;
            var height = rect.bottom - rect.top;
            var overlay = $("<div class='kbd-overlay'>"+i+"</div>").appendTo("body");
            overlay.css('top', rect.top);
            overlay.css('left', rect.left - 10);
            overlay.css('width', width);
            overlay.css('height', height);
            i++;
        }
    }

    static executeKeyPress(key) {
        var elementToSelect = this.bindings[key];
        console.log(elementToSelect);
    }

    static loadKeyPresses(elements) {
        var order = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
        var keymap = {};
        for(var i = 0; i < elements.length; i++){
            keymap[order[i]] = elements[i];
        }
        console.log(keymap);
        this.bindings = keymap;
    }
}