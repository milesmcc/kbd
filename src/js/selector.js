class KBD {
    static getElementsInOrder() {
        var body = document.body;
        var html = document.documentElement;
        var height = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);

        function score(element) {
            var score = 0;

            if (element.hasAttribute("href") && ($(element).attr("href") == window.location.pathname || $(element).attr("href") == '/'))
                return -1;
            
            if ($(element).visible() === false)
                return -1;
            score += Math.pow(($(element).width() * $(element).height()) / (window.innerWidth * window.innerHeight), 2) * 100;


            return score;
        }


        var elements = ally.query.tabbable();

        for (var i = 0 ; i < elements.length; i++) {
            Object.assign(elements[i], {"score": score(elements[i])});
        }

        return ally.query.tabsequence().sort((a, b) => 
            {
                if (a.score < b.score) return 1;
                if (a.score > b.score) return -1;
                return 0;
            }
        );
    }
}

document.querySelector('body').addEventListener('keydown', function() {
    if (event.which == 65) {
        console.log("wtf bitch??");
        alert(KBD.getElementsInOrder());
    }
});