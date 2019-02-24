class KBD {
    static getElementsInOrder() {
        var body = document.body;
        var html = document.documentElement;
        var height = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);

        function getOffset(element) {
            const rect = el.getBoundingClientRect();
            return {
                left: rect.left + window.scrollX,
                top: rect.top + window.scrollY
            };
        }

        function getRandomForestProbability(elementToSelect) {
            var metadata = [
                new Date().getUTCHours(),
                elementToSelect.classList.length > 0 ? 1 : 0,
                elementToSelect.offsetHeight,
                elementToSelect.offsetWidth,
                getOffset(elementToSelect).top,
                getOffset(elementToSelect).left,
                elementToSelect.hasAttribute("href") ? 1 : 0,
                $(elementToSelect).is("img") ? 1 : 0
            ];

            return RF.clickProbability(metadata);
        }

        function score(element) {
            var score = 0;

            if (element.hasAttribute("href") && ($(element).attr("href") == window.location.pathname || $(element).attr("href") == '/'))
                return -1;
            
            if ($(element).visible() === false)
                return -1;
                
            score += Math.pow(($(element).height() * $(element).width()) / (window.innerHeight * window.innerWidth), 2) * 100;
            score += getRandomForestProbability(element);

            return score;
        }


        var elements = ally.query.tabbable();

        for (var i = 0 ; i < elements.length; i++) {
            Object.assign(elements[i], {"score": score(elements[i])});
        }

        return ally.query.tabsequence().sort(
            (a, b) => {
                if (a.score < b.score) return 1;
                if (a.score > b.score) return -1;
                return 0;
            }
        );
    }
}
