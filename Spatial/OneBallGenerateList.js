// Author: Jerry Zhang

var NUMBER_OF_TOTAL_TRIES = 240;
var NUMBER_OF_DIFFERENT_PROBABILITIES = 3;
var TOLERANCE = 0.03;
var probabilitiesFile = 'https://gist.githubusercontent.com/thejwzhang/29c17f0a217ac6810ee1c30df40c90ee/raw/924c92747deb6c2d11242b5419e955c112f94498/OneBallProbabilities.txt';

readFile(createOutcomes);

//Functions
var finalProbabilitiesList = [];
var outcomesArray = [];
var ballAppearArray = [];
var done = false;

function readFile(callback) {
  var txtFile = new XMLHttpRequest();
  txtFile.open("GET", probabilitiesFile, true);
  txtFile.onreadystatechange = function() {
    if (txtFile.readyState === 4) {  // Ready to parse
      if (txtFile.status === 200) {  // File found
        allText = txtFile.responseText;
        lines = allText.split("\n"); // Separates each line into an array
        // console.log(lines);
        callback(lines, getResult);
      }
    }
  }
  txtFile.send(null);
}

function createOutcomes(linesFromFile, callback) { // Creates list for which place (1,2, or 3) ball is going
  console.log(linesFromFile);
  var NUMBER_OF_POSSIBLE_OUTCOMES = 3;

  var lines = []; // This is a brand new array to hold the valid lines from the txt file in number format
  // console.log(linesFromFile);
  for (var i in linesFromFile) {
    var currentLine = linesFromFile[i];
    if (currentLine) {
      var splitNums = currentLine.split(" ");
      if (splitNums.length != NUMBER_OF_POSSIBLE_OUTCOMES) { // Make sure there are 3 items per line
        console.log("ERROR:  Incorrect number of items");
        alert("ERROR: Incorrect number of items!. Check the probabilities.txt file!");
      } else {
        // console.log(splitNums);
        var tempAdd = 0;
        for (var num in splitNums) {
          var a = Number(splitNums[num]);
          tempAdd = tempAdd + a;
          if (num == 2) {
            if (tempAdd < 0.998 || tempAdd > 1.001) {
              var lineNum = Number(i)+1;
              console.log("ERROR: Probability for line " +  lineNum + " doesn't add up to 1. It adds up to " + tempAdd + ".");
              alert("ERROR: Probability for line " + lineNum + " doesn't add up to 1. It adds up to " + tempAdd + ". Check the probabilities.txt file!");
            }
          }
          if (!isNaN(a)) {
            lines.push(a);
          } else {
            console.log("ERROR: One or more of the items in the file is not a number.");
            alert("ERROR: One or more of the items in the file is not a number. Check the probabilities.txt file!");
          } // end else: if (!isNaN(a))
        } // end for (var num in splitNums)
      } // end else: if (splitNums.length - 1 != NUMBER_OF_POSSIBLE_OUTCOMES - 1)
    } // end if (currentLine)
  } // end for (var i in linesFromFile)

  if (lines.length != NUMBER_OF_DIFFERENT_PROBABILITIES*NUMBER_OF_POSSIBLE_OUTCOMES) {
    console.log("ERROR: Not enough lines");
    alert("ERROR: Not enough lines! Check the probabilities.txt file!")
  }
  finalProbabilitiesList = lines;
  // console.log(finalProbabilitiesList);

  // Create an array of each of the trials using a random number generator
  for (i = 0; i < finalProbabilitiesList.length; i+=NUMBER_OF_POSSIBLE_OUTCOMES) {
    var trueProb1 = -10;
    var trueProb2 = -10;
    var trueProb3 = -10;
    var tempOutcomesArray = [];
    var redo = true;
    while (redo) {
      tempOutcomesArray = [];
      var count1 = 0;
      var count2 = 0;
      var count3 = 0;
      for (j = 0; j < (NUMBER_OF_TOTAL_TRIES/NUMBER_OF_DIFFERENT_PROBABILITIES); j++) {
        var currentVal = Math.random();
        if (currentVal < finalProbabilitiesList[i]) {
          tempOutcomesArray.push(1);
          count1++;
        } else if (currentVal < finalProbabilitiesList[i] + finalProbabilitiesList[i+1]) {
          tempOutcomesArray.push(2);
          count2++;
        } else {
          tempOutcomesArray.push(3);
          count3++;
        }
      }
      trueProb1 = count1/(NUMBER_OF_TOTAL_TRIES/NUMBER_OF_DIFFERENT_PROBABILITIES);
      trueProb2 = count2/(NUMBER_OF_TOTAL_TRIES/NUMBER_OF_DIFFERENT_PROBABILITIES);
      trueProb3 = count3/(NUMBER_OF_TOTAL_TRIES/NUMBER_OF_DIFFERENT_PROBABILITIES);
      console.log("Given Probabilities: " + finalProbabilitiesList[i] + " " + finalProbabilitiesList[i+1] + " " + finalProbabilitiesList[i+2]);
      console.log("True Probabilities: " + trueProb1 + " " + trueProb2 + " " + trueProb3);
      // console.log("T " + (Math.abs(finalProbabilitiesList[i] - trueProb1) > TOLERANCE));
      redo = (Math.abs(finalProbabilitiesList[i] - trueProb1) > TOLERANCE) || (Math.abs(finalProbabilitiesList[i+1] - trueProb2) > TOLERANCE) || (Math.abs(finalProbabilitiesList[i+2] - trueProb3) > TOLERANCE);
      console.log(redo);
    }
    outcomesArray = outcomesArray.concat(tempOutcomesArray);
  }

  // console.log(outcomesArray);
  done = true;
  callback(done);
}

function getResult(done) { // called as the callback of createOutcomes
  // console.log(done);
  if (done != true) { // should always be true to mean that the array has been succesfully created
    alert("The array was not created properly!");
    console.log("The array was not created properly!");
  }
  console.log(outcomesArray);

  var hiddenElement = document.createElement('a');

  hiddenElement.href = 'data:attachment/text,' + encodeURI(outcomesArray) + "N" + encodeURI(ballAppearArray);
  hiddenElement.target = '_blank';
  hiddenElement.download = 'Arrays.txt';
  hiddenElement.click();
}
