

/*
Author:  Steve North
Author URI: http://socialsciences.exeter.ac.uk/sociology/staff/north/ 
License: AGPLv3 or later
License URI: http://www.gnu.org/licenses/agpl-3.0.en.html
Can: Commercial Use, Modify, Distribute, Place Warranty
Can't: Sublicence, Hold Liable
Must: Include Copyright, Include License, State Changes, Disclose Source
This research was originally funded in the UK under EPSRC grant reference EP/I031839/1 and title 'Exploring the potential of networked urban screens for communities and culture'.

Copyright (c) 2017, The University of Exeter

*/

var images = {
	'Average Female' : 'data/female-averaged-cropped.jpg'
	, 'Average Male' : 'data/male-averaged-cropped.jpg'
}

var params = {
	showImage: true
	, showGrid: true
	, overlayStageFeatures: true
	, overlayStages: false
	, haarOpacity: 0.5
	, currentStage: 0
	, currentTree: 0
	, currentImage: images['Average Female']
}


var canvas;
var img;
var imgA;
var gui;
var _data;


function err() {
	throw new Error('Error!', arguments);
}

var raw_XML_from_text_file;

var parseXml;

var cascade_as_XML_DOM_object;

// Next bit happens first...

window.onload = function() {
	
	
// The event handlers for the two HTML file selectors (XML cascade and image)

	// XML cascade file picker
	
	var XML_cascade_HTML_file_picker = document.getElementById('XML_cascade_HTML_file_picker');

			XML_cascade_HTML_file_picker.addEventListener('change', function(e) {
			var file = XML_cascade_HTML_file_picker.files[0];
			var textType = /text.*/;

			

			if (file.type.match(textType)) {
				var reader = new FileReader();

				reader.onload = function(e) {
					raw_XML_from_text_file = reader.result;
					//console.log(raw_XML_from_text_file);
					
				}

				reader.readAsText(file);	
			} else {
				console.log("File not supported!");
			}
		});	
	
	
	// image file picker ... after image is loaded... this triggers everything else with: new p5(sketch);
	
		var image_HTML_file_picker = document.getElementById('image_HTML_file_picker');
	
		image_HTML_file_picker.addEventListener('change', function(e) {
			var file = image_HTML_file_picker.files[0];
			var imageType = /image.*/;

			if (file.type.match(imageType)) {
				
				//console.log("Is an image!");
				var reader = new FileReader();

				reader.onload = function(e) {

				imgA = reader.result;

	// ###########################################
            	new p5(sketch); // Look here!! This is where the graphics get called and everything starts!!

				}

				reader.readAsDataURL(file);	
			} else {
				console.log("File not supported!");
			}
		});


	
		
	
		
				
		
} // close Window onLoad


// Now... the main bit!!

var sketch = function(p) {

	p.setup = function() {
		
		img = p.createImg(imgA).hide();
		
		canvas = p.createCanvas(600, 600);
				
		cascade_as_XML_DOM_object = parseXml(raw_XML_from_text_file);
		
		gui = new dat.GUI();
		
		xmlLoaded(cascade_as_XML_DOM_object);
		
		//gui.add(params, 'currentImage', images).onChange(function(path) {img});   // Took this out, because images are loaded differently
		gui.add(params, 'showImage');
		gui.add(params, 'showGrid');
		gui.add(params, 'overlayStageFeatures');
		gui.add(params, 'overlayStages');
		gui.add(params, 'haarOpacity', 0.0, 1.0);
	}

	p.draw = function() {
		p.background(200);

		if(params.showImage) {
			//console.log("show image");
			p.image(img, 0, 0, p.width, p.height);
		}

		if(_data) {

			if(params.showGrid) {
				drawGrid(_data.sampleSize[0], _data.sampleSize[1]);
			}

	
			//console.log("# Stages = " + _data.stages.length);

			if(params.overlayStageFeatures) {
				// draw all haar shapes up to current
				var start = params.overlayStages ? 0 : params.currentStage;
				for(var i = start; i <= params.currentStage; i++) {
					//console.log("Tree" +i);
	
					drawTreesInStage(_data.stages[i], 0, params.currentTree)
					
					
				}
			} else {
				drawTreesInStage(_data.stages[params.currentStage], params.currentTree-1, params.currentTree)
			}
		}

		p.keyTyped = function() { // From fork: attempt to get rects animating on key presses
			// if(p.key === '.') {
 		// 		params.currentNode++;
			// }

			// if(p.key === ',') {
 		// 		params.currentNode--;
			// }
		}

	}


function drawTreesInStage(stage, min, max) {
	//console.log("# Trees in stage = " + stage.length);
	//console.log("max: " + max);
		stage.forEach(function(tree, i) {
			if(i >= min && i < max) {
				//console.log("draw tree: " + i);
				drawNodesInTree(tree);
			}
		});
	}

	function drawNodesInTree(tree) {
		//console.log("# Haar nodes in tree = " + tree.length);
		tree.forEach(function(node, i) {
			//console.log("draw haar node: " + i);			
			drawHaarRects(node);
		});
	}


function xmlLoaded(data) {
		
		//console.log(data);
		
		_data = parseHaarCascade(data);

		var stageController = gui.add(params, 'currentStage', 0, _data.stages.length-1);
		var treeController = gui.add(params, 'currentTree', 0, _data.stages[params.currentStage].length-1);
		stageController.step(1).listen();
		treeController.step(1).listen();

		stageController.onChange(function(s){
			params.currentTree = 0;
			treeController.max(_data.stages[s].length-1);
		});
		

		//console.log('xmlLoaded', _data);
	}


function drawGrid(w, h, lineColor) {
		var i, j;
		var horizSpace = p.floor(p.width/w);
		var vertSpace = p.floor(p.height/h);
		var c = lineColor || p.color(100);

		p.push();
			p.stroke(c);

			// vertical lines
			for(i = 1; i < w; i++) {
				p.line(i*horizSpace, 0, i*horizSpace, p.height);
			}

			// horizontal lines
			for(j = 1; j < h; j++) {
				p.line(0, j*vertSpace, p.width, j*vertSpace);
			}	
		p.pop();
	}


function drawHaarRects(node, sampleSize) {
		
		//console.log("draw haar rect");

		sampleSize = sampleSize || _data.sampleSize;

		p.noStroke();

		node.rects.forEach(function(r) {
			
			console.log(r);
			
			var weight = r[4];
			// black or white based on weight
		 
			// console.log('weight', weight);
			
			var opacity = Math.floor(params.haarOpacity*255);

			var c = p.color(255, 255, 255, opacity); 

			if(weight < 0) {
				c = p.color(0, 0, 0, opacity);
			}

			var x = p.map(r[0], 0, sampleSize[0], 0, p.width);
			var y = p.map(r[1], 0, sampleSize[1], 0, p.height);
			var w = p.map(r[2], 0, sampleSize[0], 0, p.width);
			var h = p.map(r[3], 0, sampleSize[1], 0, p.height);

			p.fill(c);
			p.rect(x, y, w, h);

		});
	}

	
} // close Sketch function....



if (typeof window.DOMParser != "undefined") {
    parseXml = function(xmlStr) {
        return ( new window.DOMParser() ).parseFromString(xmlStr, "text/xml");
    };
} else if (typeof window.ActiveXObject != "undefined" &&
       new window.ActiveXObject("Microsoft.XMLDOM")) {
    parseXml = function(xmlStr) {
        var xmlDoc = new window.ActiveXObject("Microsoft.XMLDOM");
        xmlDoc.async = "false";
        xmlDoc.loadXML(xmlStr);
        return xmlDoc;
    };
} else {
    throw new Error("No XML parser found");
}



// Helper functions and stuff...

   function xmlToString(xmlData) { 

        var xmlString;
        //IE
        if (window.ActiveXObject){
            xmlString = xmlData.xml;
        }
        // code for Mozilla, Firefox, Opera, etc.
        else{
            xmlString = (new XMLSerializer()).serializeToString(xmlData);
        }
        return xmlString;
    } 