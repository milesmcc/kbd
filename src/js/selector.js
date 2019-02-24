class KBD {
    static getElementsInOrder() {
        var forest = null;
        try {
            forest = chrome.storage.local.get(['kbd-forest']);
        } catch (e) {
            // catch
        }

        var body = document.body;
        var html = document.documentElement;
        var height = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);

        function getRandomForestProbability(elementToSelect) {
            if (forest === null) 
                return 0;

            var metadata = [
                new Date().getUTCHours(),
                elementToSelect.classList.length > 0 ? 1 : 0,
                elementToSelect.offsetHeight,
                elementToSelect.offsetWidth,
                elementToSelect.hasAttribute("href") ? 1 : 0,
                $(elementToSelect).is("img") ? 1 : 0
            ];

            return forest.predictOne(metadata) * 100;
        }

        function score(element) {
            var score = 0;

            if (element.hasAttribute("href") && ($(element).attr("href") == window.location.pathname || $(element).attr("href") == '/'))
                return -1;
            
            if ($(element).visible() === false)
                return -1;
                
            score += Math.pow(($(element).height() * $(element).width()) / (window.innerHeight * window.innerWidth), 2) * 100;
            score += getRandomForestProbability(element);

            if (element.hasAttribute("href")) {
                var links = []
                chrome.storage.local.get(['kbd-everclicked'], function (data) {
                    links = data['kbd-everclicked'];
                });
                if (links.includes(element.href)) {
                    score += 1000;
                }
            }

            return score;
        }


        var elements = ally.query.tabbable();

        for (var i = 0 ; i < elements.length; i++) {
            Object.assign(elements[i], {"score": score(elements[i])});
        }

        return elements.sort(
            (a, b) => {
                if (a.score < b.score) return 1;
                if (a.score > b.score) return -1;
                return 0;
            }
        );
    }
}
