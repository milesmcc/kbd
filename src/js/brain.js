// store data

var testData = [];
var testLabels = [];
var prevLen = 0;
var requiredDelta = 10;

// init random forest
RF.init();

// retraining loop
window.setInterval( function(){
    var testDataClicked = chrome.storage.local.get(['kbd-clicked']);
    var testDataUnclicked = chrome.storage.local.get(['kbd-unclicked']);
    if (testDataClicked.length + testDataUnclicked.length >= prevLen + requiredDelta) {
        for (var entry of testDataClicked) {
           testData.append(entry);
           testLabels.append(1);
        }
        for (var entry in testDataUnclicked) {
            testData.append(entry);
            testLabels.append(0);
        }
       console.log("retraining!");
       retrain(testData, testLabels);
       prevLen = testData.length;
    }
},10000)

class RF {
    static init() {
        forest = new forestjs.RandomForest();
    }
    static retrain(data, labels) { // every 100 clicks
        forest.train(data, labels); 
    }
    static oneClickProbability(curInstance) {
        labelProbabilities = forest.predictOne(curInstance);
    }
}