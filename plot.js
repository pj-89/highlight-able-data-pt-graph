/**
 * 8/21/15 - draw a graph with data points, shaded in below line
 * 8/29/15 - need to scale the vertical - horizontal indicator lines of Y values - need % change
 * 2/25/16 - convert from Khan Academy processing/javascript to P5.js
*/


// variables {
// start coordinates of bottom left corner
var vertEdge;
var horizEdge;
var gridSize;
var i; // graph point loop counter
var h; // dataPts[h] for-loop, finding max and min - determineGraphSize()
var hMaxValue; // max Y value - determineGraphSize()
var hMaxPos; // max Y value position
var hMinValue; // min Y value - deteremineGraphSize() -- initialized within the function as dataPts[0].y
var hMinPos; // min Y value position
var hAvg; // (hMaxValue + hMinValue) / 2
var modResult; // for rounding the hAvg, 1 to 5
var modResult2; // for rounding the hAvg, 6 to 9
var f; // gFill snap position to refer to dataPts[f].y
var w; // gFill.pts[w] position - dragPt
var e; // fill selection position
var dragFlag; // graph selection flag
var mX; // constrain(mouseX)
var mY; // constrain(mouseY)
var coord; // displays the current coordinates "(" + (this.posX - vertEdge) + ", " + (horizEdge - this.posY) + ")"
var tH; // textHeight for var coord
var j; // snapToGrid
var snap; // snapToGrid
var bgColor;
var graphBg;
var graphFillDefault;
var graphFillNeg;
var graphFillRight;
var graphFillLeft;
var graphSelection;
var graphStrokeW;

var gPt;
var gFill;

var dataPts = new Array();

// end variables }





var determineGraphSize = function() {
    // hMaxValue is initialized at 0
    hMinValue = dataPts[0].y;
    // goes through each .y element, finds max/min value/position
    // .x is dependent on dataPts.length
    for (h = 0; h < dataPts.length; h++) {
        if (dataPts[h].y > hMaxValue) {
            hMaxValue = dataPts[h].y;
            hMaxPos = h;
        }
        if (dataPts[h].y < hMinValue) {
            hMinValue = dataPts[h].y;
            hMinPos = h;
        }
    }
};

var determineAvg = function() {
    hAvg = (hMaxValue + hMinValue) / 2; // 82.500
    
    hAvg = round(hAvg);
    modResult = hAvg % 10;
    modResult2 = modResult % 5;
    
    if (modResult < 2.5) {
        hAvg = hAvg - modResult;
    }
    else if (modResult >= 2.5 && modResult <= 5) {
        hAvg = hAvg - modResult + 5;
    }
    else if (modResult2 < 2.5) {
        hAvg = hAvg - modResult2;
    }
    else {
        hAvg = hAvg - modResult2 + 5;
    }
    
    //text("hAvg=" + hAvg + "\nmodResult=" + modResult + "\nmodResult2=" + modResult2, 200, 40);
};

var drawGraphBg = function() {
    // graph background
    fill(graphBg);
    noStroke();
    // tH = textHeight
    rect(vertEdge + (((dataPts.length - 1) * gridSize) / 2), horizEdge - (hMaxValue / 2) - (tH * 2) - graphStrokeW, (dataPts.length - 1) * gridSize, hMaxValue + (tH * 4) + graphStrokeW);
    //rect(vertEdge + (axesSize / 2), horizEdge - (axesSize / 2), axesSize + graphStrokeW, axesSize + graphStrokeW);
    
    textAlign(RIGHT, CENTER);
    
    stroke(255, 0, 0);
    fill(255, 0, 0);
    // lowest data point horiz line
    line(vertEdge, horizEdge - dataPts[hMinPos].y, vertEdge + ((dataPts.length - 1) * gridSize) - graphStrokeW, horizEdge - dataPts[hMinPos].y);
    text(hMinValue, vertEdge - tH, horizEdge - dataPts[hMinPos].y);


    // middle/avg data point horiz line
    determineAvg();
    line(vertEdge, horizEdge - hAvg, vertEdge + ((dataPts.length - 1) * gridSize) - graphStrokeW, horizEdge - hAvg);
    text(hAvg, vertEdge - tH, horizEdge - hAvg);
    
    // highest data point horiz line
    line(vertEdge, horizEdge - dataPts[hMaxPos].y, vertEdge + ((dataPts.length - 1) * gridSize) - graphStrokeW, horizEdge - dataPts[hMaxPos].y);
    text(hMaxValue, vertEdge - tH, horizEdge - dataPts[hMaxPos].y); /** need appropriate spacing */
    
    fill(graphBg); // so that the drag selection will be colored appropriately
};

var drawGraph = function() {
    // graph axes
    stroke(0, 0, 0);
    strokeWeight(graphStrokeW);
    line(vertEdge, horizEdge, (vertEdge + ((dataPts.length - 1) * gridSize)) - graphStrokeW, horizEdge); // X-axis (horizontal)
    line(vertEdge, horizEdge - graphStrokeW, vertEdge, horizEdge - hMaxValue - (tH * 4)); // Y-axis (vertical)
};

var drawGraphPts = function() {
    for (i = 0; i < dataPts.length; i++) {
        strokeWeight(5);
        stroke(0, 0, 0);
        point(vertEdge + (gridSize * i), horizEdge - dataPts[i].y); /** need to change spacing*/
    }
};

var drawGraphLine = function() {
    // graph TREND LINE
    for (i = 1; i < dataPts.length; i++) { // i = 1 because you don't fill in to the left of the 1st [0] pt
        strokeWeight(2);
        stroke(0, 0, 0);
        line( // graph trend line
            vertEdge + (gridSize * (i - 1)), horizEdge - dataPts[i - 1].y, 
            vertEdge + (gridSize * i), horizEdge - dataPts[i].y);
    }
};

var drawGraphFill = function() {
    // graph FILL
    for (i = 1; i < dataPts.length; i++) { // i = 1 because you don't fill in to the left of the 1st [0] pt
        fill(graphFillDefault);
        noStroke();
        quad( // fill underneath graph trend line
            vertEdge + (gridSize * (i - 1)), horizEdge - dataPts[i - 1].y, 
            vertEdge + (gridSize * i), horizEdge - dataPts[i].y, 
            vertEdge + (gridSize * i), horizEdge,
            vertEdge + (gridSize * (i - 1)), horizEdge);
    }
};

var GridPt = function() {
    // empty on purpose
}; // empty on purpose

GridPt.prototype.draw = function() {
    stroke(graphSelection);
    textAlign(CENTER,CENTER); // text align
    
    // current data point
    strokeWeight(10);
    point(this.posX, this.posY);
    
    // vertical line of current data point
    strokeWeight(graphStrokeW);
    line(this.posX, this.posY, this.posX, horizEdge - hMaxValue - (tH * 2.5));
    //line(this.posX, this.posY, this.posX, horizEdge - axesSize + 50);
    
    // display box of current coordinates
    //textSize(15);
    coord = "(" + (this.posX - vertEdge) + ", " + (horizEdge - this.posY) + ")";
    //tH = textAscent() + textDescent();
    // rect fill color is determined by drag selection
    if ( (this.posX - (textWidth(coord) / 2) - graphStrokeW > vertEdge) && ((this.posX + (textWidth(coord) / 2)) < (vertEdge + ((dataPts.length - 1) * gridSize) + graphStrokeW)) ) {
    rect(this.posX, horizEdge - hMaxValue - (tH * 3), textWidth(coord) * 1.1, tH * 2, 5);
    fill(0, 0, 0);
    noStroke();
    text(coord, this.posX, horizEdge - hMaxValue - (tH * 3));
    }
    // left edge
    else if ( (this.posX - (textWidth(coord) / 2) - graphStrokeW) <= vertEdge) { // left edge
        rect(vertEdge + (textWidth(coord) / 2) + graphStrokeW/2, horizEdge - hMaxValue - (tH * 3), textWidth(coord) * 1.1, tH * 2, 5);
        fill(0, 0, 0);
        noStroke();
        text(coord, vertEdge + (textWidth(coord) / 2) + graphStrokeW/2, horizEdge - hMaxValue - (tH * 3));
    }
    // right edge
    else if ( (this.posX + (textWidth(coord) / 2) + graphStrokeW) >= ((dataPts.length - 1) * gridSize) ) { // right edge
        rect(vertEdge + ((dataPts.length - 1) * gridSize) - (textWidth(coord) / 1.75) + graphStrokeW/2, horizEdge - hMaxValue - (tH * 3), textWidth(coord) * 1.1, tH * 2, 5);
        fill(0, 0, 0);
        noStroke();
        text(coord, vertEdge + ((dataPts.length - 1) * gridSize) - (textWidth(coord) / 1.75), horizEdge - hMaxValue - (tH * 3));
    }
    
    
    /*
    rect(this.posX, horizEdge - axesSize + 35, textWidth(coord) * 1.1, tH * 2, 5);
    fill(0, 0, 0);
    text(coord, this.posX, horizEdge - axesSize + 35);
    */
};

GridPt.prototype.snapToGrid = function() {
    while (j >= vertEdge && j < vertEdge + ((dataPts.length - 1) * gridSize)) {
        if (this.posX >= j && this.posX < j + gridSize/2) {
            this.posX = j;
        } else if (this.posX > j && this.posX <= j + gridSize) {
            this.posX = j + gridSize;
        }
        j += gridSize;
    }
    j = vertEdge;
    //f = (this.posX / gridSize) - 2;
    f = this.posX - vertEdge; // fixed
    if (f !== 0) {
        f /= gridSize;
    }
    this.posY = horizEdge - dataPts[f].y; // define Y position
};



var dragPt = function(dragFlag) { // gPt, gFill
    if (dragFlag) {
        gFill.posX = gPt.posX;
        //w = (gFill.posX / gridSize) - 2;
        w = gFill.posX - vertEdge;
        if (w !== 0) {
            w /= gridSize;
        }
        gFill.posY = horizEdge - dataPts[w].y;
    }
    
};

function setup()
{
  var myCanvas = createCanvas(500, 400);
  myCanvas.parent('myContainer');
  
  vertEdge = 50;
  horizEdge = 300;
  
  gridSize = 35;
  //axesSize = 350;
  
  hMaxValue = 0; // max Y value - determineGraphSize()
  hMaxPos = 0; // max Y value position
  hMinPos = 0; // min Y value position
  hAvg = 0; // (hMaxValue + hMinValue) / 2

  textSize(15);
  tH = textAscent() + textDescent(); // textHeight for coord
  
  j = vertEdge; // snapToGrid
  snap = true; // snapToGrid
  
  bgColor = color(100);
  graphBg = color(194, 194, 194);
  graphFillDefault = color(186, 186, 186);
  graphFillNeg = color(255, 0, 0);
  graphFillRight = color(21, 255, 0);
  graphFillLeft = color(238, 255, 0);
  graphSelection = color(0, 255, 255);
  graphStrokeW = 2;

  rectMode(CENTER);
  
  
  gPt = new GridPt(); // mouseHOVER point

  // drag selection
  
  gFill = new GridPt(); // drag selection

  dataPts = [
      {
          //1st
          y: 100
      },
      {
          //2nd
          y: 50
      },
      {
          //3rd
          y: 75
      },
      {
          //4th
          y: 25
      },
      {
          //5th
          y: 110
      },
      {
          //6th
          y: 150
      },
      {
          //7th
          y: 125
      },
      {
          //8th
          y: 50
      },
      {
          //9th
          y: 75
      },
      {
          //10th
          y:15
      },
      {
          //11th
          y: 5
      },
      {
          //12th
          y: 10
      }
  ];
}

function draw() 
{
    // {
    background(bgColor);
    
    
    determineGraphSize();
    drawGraphBg();
    //drawGraphFill();
    drawGraphLine();
    drawGraphPts();
    //drawGraph();
    
    mX = constrain(mouseX, vertEdge, vertEdge + ((dataPts.length - 1) * gridSize)); // x
    mY = constrain(mouseY, horizEdge - hMaxValue - (tH * 4) - graphStrokeW, horizEdge); // y
    //mY = constrain(mouseY, horizEdge - axesSize, horizEdge); // y
    
    if ((mouseX >= (vertEdge - gridSize) && mouseX <= (vertEdge + gridSize) + ((dataPts.length - 1) * gridSize)) && mouseY === mY) { // mouseX === mX
    //if ((mouseX >= vertEdge && mouseX <= vertEdge + axesSize) && mouseY === mY) { // mouseX === mX
        gPt.posX = mX;
        gPt.snapToGrid();
        //e = (gPt.posX / gridSize) - 2; // var e
        e = gPt.posX - vertEdge; // var e
        if (e !== 0) {
            e /= gridSize;
        }
        
        if (!mouseIsPressed) {
            dragFlag = true; // flag is TRUE when not being used
        }
        else {
        
            dragPt(dragFlag); // gPt, gFill
            dragFlag = false; // set to FALSE so it only processes ONCE to set the 1st pt
            
            
            if (mX > gFill.posX + (gridSize / 2)) { // mouseIsPressed, and to the RIGHT
                
                if (gPt.posY > gFill.posY) { // if the data pt is less/negative
                    fill(255, 0, 0);
                }
                else {
                    fill(graphFillRight);
                }
                noStroke();
                beginShape(); // fill from the right edge to the center
                vertex(gFill.posX, gFill.posY);
                vertex(gFill.posX, horizEdge);
                vertex(vertEdge + (gridSize * e), horizEdge);
                vertex(vertEdge + (gridSize * e), horizEdge - dataPts[e].y);
                for (e - 1; e > w; e--) {
                    vertex(vertEdge + (gridSize * e), horizEdge - dataPts[e].y);
                    vertex(vertEdge + (gridSize * e), horizEdge);
                    vertex(vertEdge + (gridSize * e), horizEdge);
                    vertex(vertEdge + (gridSize * e), horizEdge - dataPts[e].y);
                }
                endShape();
                
                //drawGraphLine(); // draw last so it overlaps
                //drawGraphPts(); // draw last so it overlaps
            }
            else if (mX < gFill.posX - (gridSize / 2)) { // mouseIsPressed, and to the LEFT
                
                if (gPt.posY > gFill.posY) { // if the data pt is less/negative
                    fill(graphFillNeg);
                }
                else {
                    fill(graphFillLeft);
                }
                noStroke();
                beginShape(); // fill from the left edge to the center
                vertex(gFill.posX, gFill.posY);
                vertex(gFill.posX, horizEdge);
                vertex(vertEdge + (gridSize * e), horizEdge);
                vertex(vertEdge + (gridSize * e), horizEdge - dataPts[e].y);
                for (e; e < w; e++) {
                    vertex(vertEdge + (gridSize * e), horizEdge - dataPts[e].y);
                    vertex(vertEdge + (gridSize * e), horizEdge);
                    vertex(vertEdge + (gridSize * e), horizEdge);
                    vertex(vertEdge + (gridSize * e), horizEdge - dataPts[e].y);
                }
                endShape();
                
                //drawGraphLine(); // draw last so it overlaps
                //drawGraphPts(); // draw last so it overlaps
            }
        }
        //drawGraph();
        //gPt.draw(); // last so it overlaps everything
    }
    drawGraphLine(); // draw last so it overlaps
    drawGraphPts(); // draw last so it overlaps
    drawGraph(); // last so it overlaps the drag selection
    gPt.draw(); // last so it overlaps everything // fill() is determined by drag selection
    
    
    //println(hMinValue);
    fill(0);
    noStroke();
    textSize(15);
    text("hMinValue=" + hMinValue + "\nhMinPos=" + hMinPos, 100, 20);
    text("hMaxValue=" + hMaxValue + "\nhMaxPos=" + hMaxPos, 300, 20);
};






