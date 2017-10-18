
habit_haar_visualiser
================
Author:  Steve North
Author URI:  http://socialsciences.exeter.ac.uk/sociology/staff/north/
License: AGPLv3 or later
License URI: http://www.gnu.org/licenses/agpl-3.0.en.html
Can: Commercial Use, Modify, Distribute, Place Warranty
Can't: Sublicence, Hold Liable
Must: Include Copyright, Include License, State Changes, Disclose Source

Copyright (c) 2017, The University of Exeter

Note: this app just displays the features from all of the detector stages. It doesn't actually do any detecting.
Also, I am not convinced that this version demonstrates the detector being applied to the test image at different scales.

Inmportant: you have to move the sliders on the control panel (currentStage and currentTree) to actually see anything overlaid on the image!!

TO DO:

Add animation, with variable speed (maybe progressing through each stage and feature / tree and then looping?).
Add output images for each rect that is added... or a video clip.


This is heavily based on 'Haar-Visualizer' (https://github.com/andyinabox/haar-visualizer) by andyinabox and (in turn) Adam Harvey's research for [CV Dazzle](https://cvdazzle.com/), especially his [Processing code for visualizing Haar cascades used in the Viola Jones algorithm](https://github.com/adamhrv/HaarcascadeVisualizer).

Note: Adam Harvey's HaarcascadeVisualizer project is created in the Processing, Wiring and the Arduino IDE. Processing is not C based but Java based and with a syntax derived from java. It is a Java framework that can be used as a java library. It includes a default IDE that uses the .pde extension.

Neither of the above projects have licencing conditions or copyright statements.

The code is JavaScript and HTML5 based.

A major revision in my version is that haar-visualizer was designed to run in https://github.com/mattdesl/budo ( a dev server for rapid prototyping of JavaScript projects) and this version works in a web browser, when run locally.

As haar-visualizer was server-side JavaScript, there were browser security issues with loading images and the XML detectors. 

This currently only runs the old XML Haar cascade file format from OpenCV. It won't work with the new format.

As I had a new format cascade file, I had to retrain the detector, using opencv_traincascade's -baseFormatSave flag. See: http://answers.opencv.org/question/45483/convert-new-format-haarcasccade-xml-file-to-old-format/

So, my training command looked like this: 
opencv_traincascade.exe -data cascades -vec vector/facevector.vec -bg bg.txt -numStages 11 -minHitRate 0.999 -maxFalseAlarmRate 0.3 -numPos 185 -numNeg 1000 -w 20 -h 20 -precalcValBuffSize 1024 -precalcdxbufSize 1024 -baseFormatSave

Even after this, my XML files were not compatible. 

Example snippet from a working file:				  
<stages>
    <_>
      <!-- stage 0 -->
      <trees>
        <_>
          <!-- tree 0 -->
          <_>
            <!-- root node -->
            <feature>
              <rects>
                <_>6 4 12 9 -1.</_>
                <_>6 7 12 3 3.</_></rects>

Example snippet from a broken file:
<stages>
    <_>
      <trees>
        <_>
          <_>
            <feature>
              <rects>
                <_>
                  5 1 11 16 -1.</_>
                <_>
                  5 9 11 8 2.</_></rects>

For each 'rect' element I had to replace:
<_>\r\n[space][space][space][space][space][space][space][space][space][space][space][space][space][space][space][space][space][space]
with: <_>

Note: I actually typed the 18 spaces with the keyboard spacebar, rather than adding a code.

It was safe to do 'replace all'.

I used Notepad++ for this.