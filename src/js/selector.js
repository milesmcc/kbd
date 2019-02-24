class KBD {
    static getElementsInOrder() {
        function compare(a, b){
            if (a.offsetWidth*a.offsetHeight < b.offsetWidth*b.offsetHeight) return 1;
            if (b.offsetWidth*b.offsetHeight < a.offsetWidth*a.offsetHeight) return -1;
            return 0;
        }
          
        var elements = ally.query.tabbable().sort(compare);
        
        return elements;
    }
}
  