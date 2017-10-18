/*var p5 = require('p5')
	, dat = require('exdat')
	, parseHaarCascade = require('./parseHaarCascade.js');
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

//new p5(sketch);
//sketch();
//steveDraw();

//var img;
var XML_detector;

var xml;


window.onload = function() {

		var fileInput = document.getElementById('fileInput');
		
		var fileInput2 = document.getElementById('fileInput2');
		
		//var fileDisplayArea = document.getElementById('fileDisplayArea');


		fileInput.addEventListener('change', function(e) {
			var file = fileInput.files[0];
			var imageType = /image.*/;

			if (file.type.match(imageType)) {
				
				//console.log("Is an image!");
				var reader = new FileReader();

				reader.onload = function(e) {
				//	fileDisplayArea.innerHTML = "";

				imgA = reader.result;
				//imgA.src = reader.result;
				
			
					
					//img.src = "data/female-averaged-cropped.jpg";
					
					
					//img = reader.result;
					//console.log(reader.result);
					//console.log(imgA);
					

				//	fileDisplayArea.appendChild(img);
				
				//steveDraw();
				new p5(sketch2);
				}

				reader.readAsDataURL(file);	
			} else {
				//fileDisplayArea.innerHTML = "File not supported!"
				console.log("File not supported!");
			}
		});


		
		
		fileInput2.addEventListener('change', function(e) {
			var file = fileInput2.files[0];
			var textType = /text.*/;

			

			if (file.type.match(textType)) {
				var reader = new FileReader();

				reader.onload = function(e) {
					//fileDisplayArea.innerText = reader.result;
					XML_detector = reader.result;
					//console.log(XML_detector);
					
				}

				reader.readAsText(file);	
			} else {
				//fileDisplayArea.innerText = "File not supported!"
				console.log("File not supported!");
			}
		});		
		
		
		
		
}


var sketch2 = function(p) {



	p.setup = function() {
		
		img = p.createImg(imgA).hide();
		
		canvas = p.createCanvas(600, 600);

		//p.loadXML('data/haarcascade_frontalface_default.xml', xmlLoaded);
		//p.loadXML('data/haarcascade_frontalface_default.xml');
		//p.loadXML('F:\Google Drive 2\dev\GitHub\haar-visualizer\data\haarcascade_frontalface_default.xml');
		
		
		//p.loadXML(XML_detector);
		
		xml = parseXml(XML_detector);
		
		gui = new dat.GUI();
		
		xmlLoaded(xml);
		
		//alert(xml.documentElement.nodeName);
		
		//gui.add(params, 'currentImage', images).onChange(function(path) {
		//	img = p.loadImage(path)
		//});
		
		gui.add(params, 'currentImage', images).onChange(function(path) {img});
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

			// var nodes = _data.flattened;
			
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

		p.keyTyped = function() {
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
		// _data.flattened = [];

		
		// _data.stages.forEach(function(trees) {
		// 	trees.forEach(function(nodes, j) {
		// 		nodes.forEach(function(node, k) {
		// 			_data.flattened.push(node);
		// 		});
		// 	});
		// });


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

	
}



var parseXml;

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

//var xml = parseXml("<foo>Stuff</foo>");
//alert(xml.documentElement.nodeName);

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