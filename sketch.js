// Webcam Piano TEMPLATE
var video;
var prevImg;
var currImg;
var diffImg;
var threshold = 0.073;
var grid;
var a,b,c,d,e,f;
var at, bt,ct,dt,et,ft;


function setup() {
    createCanvas(windowWidth, windowHeight);
    pixelDensity(1);
    video = createCapture(VIDEO);
    video.hide();
    grid = new Grid(640, 480);
    a=100;
    b=255;
	c=0;
	d=120;
	e=250;
	f=200;
	at = bt = ct = et = ft = false;
}

function draw() {

	if (at) {
		a+=4;
	}
	if (a>255) {
		at = !at;
	}
	if (!at) {
		a-=4;
	}
	if (bt) {
		b+=4;
	}
	if (b>255) {
		bt = !bt;
	}
	if (!bt) {
		b-=4;
	}
	if (ct) {
		c+=4;
	}
	if (c>255) {
		ct = !ct;
	}
	if (!ct) {
		c-=4;
	}
	if (dt) {
		d+=4;
	}
	if (d>255) {
		dt = !dt;
	}
	if (!dt) {
		d-=4;
	}
	if (et) {
		e+=4;
	}
	if (e>255) {
		et = !et;
	}
	if (!et) {
		e-=4;
	}
	if (ft) {
		f+=4;
	}
	if (f>255) {
		ft = !ft;
	}
	if (!ft) {
		f-=4;
	}
	if (a<0) {
		at = !at;
	}
	if (b<0) {
		bt = !bt;
	}
	if (c<0) {
		ct = !ct;
	}
	if (d<0) {
		dt = !dt;
	}
	if (e<0) {
		et = !et;
	}
	if (f<0) {
		ft = !ft;
	}



	// a = a+=1;
	// a = a%255;
	// b = b+=1;
	// b = b%255;
	// c = c+=1;
	// c = c%255;
	// d = d+=1;
	// d = d%255;
	// e = e+=1;
	// e = e%255;
	// f = f+=1;
	// f = f%255;
    background(125);
    image(video, 0, 0);
    video.loadPixels();

    var w = video.width/4;
    var h = video.height/4;
    currImg = createImage(w, h);
    currImg.copy(video, 0, 0, video.width, video.height, 0, 0, w, h); // save current frame
    currImg.filter('gray');
    currImg.filter('blur', 3);

    diffImg = createImage(w, h);

    currImg.loadPixels();
    diffImg.loadPixels();

    

    

    if (typeof prevImg !== 'undefined') {
    	prevImg.loadPixels();
        for (var x = 0; x < currImg.width; x += 1) {
            for (var y = 0; y < currImg.height; y += 1) {
               // MAGIC HAPPENS HERE

               var index = (x + (y * w)) * 4;

               var currR = currImg.pixels[index + 0];
               var prevR = prevImg.pixels[index + 0];

               var d = abs(currR - prevR);

               diffImg.pixels[index + 0] = d;
               diffImg.pixels[index + 1] = d;
               diffImg.pixels[index + 2] = d;
               diffImg.pixels[index + 3] = 255;
            }
        }
    }
    diffImg.updatePixels();
    diffImg.filter('threshold', threshold);
    prevImg = createImage(w, h);
    prevImg.copy(currImg, 0, 0, currImg.width, currImg.height, 0, 0, prevImg.width, prevImg.height);
    image(currImg, 640, 0);
    image(diffImg, video.width + currImg.width, 0);
    grid.update(diffImg);
}

function mousePressed() {
	if (mouseX < video.width && mouseX > 0 && mouseY > 0 && mouseY < video.height) {
		threshold = mouseX;
		threshold = map(threshold, 0, video.width, 0, 0.1);
	}
}



var Grid = function(_w, _h){
	this.diffImg = 0;
	this.noteWidth = 40;
	this.worldWidth = _w;
	this.worldHeight = _h;
	this.numOfNotesX = int(this.worldWidth/this.noteWidth);
	this.numOfNotesY = int(this.worldHeight/this.noteWidth);
	this.arrayLength = this.numOfNotesX * this.numOfNotesY;
	this.noteStates = [];
	this.noteStates =  new Array(this.arrayLength).fill(0);
	this.colorArray = [];
	console.log(this);
	console.log(_w, _h);

	
	

	// set the original colors of the notes
	

	this.update = function(_img){
		
		var g = color(a,b,c);
		var h = color(d,e,f);
		this.colorArray = [];
		for (var i=0;i<this.arrayLength;i++){
			// var g = color(a,b,c);
			// var h = color(d,e,f);
			// this.colorArray.push(lerpColor(color(a,b,c,150), color(d,e,f,150), i/this.arrayLength));
			this.colorArray.push(lerpColor(g, h, i/this.arrayLength));
			console.log(e);
		}
		this.diffImg = _img;
		this.diffImg.loadPixels();
		for (var x = 0; x < this.diffImg.width; x += 1) {
			for (var y = 0; y < this.diffImg.height; y += 1) {
				var index = (x + (y * this.diffImg.width)) * 4;
				var state = diffImg.pixels[index + 0];
				if (state==255){
				var screenX = map(x, 0, this.diffImg.width, 0, this.worldWidth);
				var screenY = map(y, 0, this.diffImg.height, 0, this.worldHeight);
				var noteIndexX = int(screenX/this.noteWidth);
				var noteIndexY = int(screenY/this.noteWidth);
				var noteIndex = noteIndexX + noteIndexY*this.numOfNotesX;
				this.noteStates[noteIndex] = 1;
			}
		}
	}

	  //this is what "ages" the notes so that as time goes by things can change.
	  for (var i=0; i<this.arrayLength;i++){
	    this.noteStates[i]-= 0.05;
	    this.noteStates[i]=constrain(this.noteStates[i],0,1);
	  }

	  this.draw();
	};

	// this is where each note is drawn
	// use can use the noteStates variable to affect the notes as time goes by
	// after that region has been activated
	this.draw = function(){
	  push();
	  noStroke();
	  for (var x=0; x<this.numOfNotesX; x++){
	    for (var y=0; y<this.numOfNotesY; y++){
	            var posX = this.noteWidth/2 + x*this.noteWidth;
	            var posY = this.noteWidth/2 + y*this.noteWidth;
	            var noteIndex = x + (y * this.numOfNotesX);
	            if (this.noteStates[noteIndex]>0) {
	            	
					fill(red(this.colorArray[noteIndex]), green(this.colorArray[noteIndex]), blue(this.colorArray[noteIndex]), 150*this.noteStates[noteIndex]);
					ellipse(posX,posY,this.noteWidth*this.noteStates[noteIndex],this.noteWidth*this.noteStates[noteIndex]);
	            }
	        }
	  }
	  pop();
	}
};
