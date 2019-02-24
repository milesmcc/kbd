// store data
var testDataClicked = chrome.storage.local.get(['kbd-clicked'])
var testDataUnclicked = chrome.storage.local.get(['kbd-unclicked'])
var testData = []
var testLabels = []
var prevLen = 0

// init random forest
RF.init();

// retraining loop
window.setInterval( function(){
    if (testDataClicked.length + testDataUnclicked.length >= prevLen + 100) {
       for (var entry of testDataClicked) {
           testData.append(entry)
           testLabels.append(1)
       }
       for (var entry in testDataUnclicked) {
            testData.append(entry)
            testLabels.append(0)
       }
       retrain(testData, testLabels);
       prevLen = testData.length
    }
},10000)

class RF {
    static init() {
        forest = new forestjs.RandomForest();
    }
    static retrain(data, labels) { // every 100 clicks
        forest.train(data, labels); 
    }
    static clickProbability(curData) {
        labelProbabilities = forest.predict(curData);
    }
}