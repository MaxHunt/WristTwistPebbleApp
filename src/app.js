/**
 * Welcome to Pebble.js!
 *
 * Constant updateing of Accelerometer Value. 
 * Monitors the Accelerometer in real time.
 * By Max Hunt - 609556
 * Date - 15/01/2015
 */

//include Accel Pebble Libary
var Accel = require('ui/accel');
//iniate acceleometer
Accel.init();
//include UI Pebble Libary
var UI = require('ui');
//get vector Pebble Libary
var Vector2 = require('vector2');
//Screen for real time results
var CountScreen = new UI.Window();
//Elements for AccelerometerScreen
var TitleText = new UI.Text({ position: new Vector2(0,0), size: new Vector2(144, 168) });
var CounterText = new UI.Text({ position: new Vector2(0,25), size: new Vector2(144, 168) });

//lower hertz Values
Accel.config({
   rate: 25,
   sample: 5,
   subscribe: false
});

var xAxis = 0;
var yAxis = 0;
var zAxis = 0;
var counter = 0;

var inWristCount = false;

//start App screen
var main = new UI.Card({   
   icon: 'images/menu_icon.png',
   subtitle: 'Wrist Twist',
   body: 'Press the select button to start the counter.',
   scrollable: true
});

//start APP
console.log("App started");
main.show();
main.on('click', 'select', onClick);


function onClick(e) {
   inWristCount = true;
   console.log('Entered Counter');
   TitleText.text('Counter Screen');
   CountScreen.insert(0,TitleText);
   console.log("Title text added");
   CountScreen.show();
   CountScreen.on('click','back',onAccelBack);   
   CountScreen.on('accelData', onPeek);        
}

//Close Screen and Stop loop
function onAccelSelect(e){   
   console.log('Post Array');
   console.log('Current data samples are: ' + e.samples); 
}

//Close Screen and Stop loop
function onAccelBack(){
   console.log('Close Screen and Stop Loop');
   inWristCount = false;
   CountScreen.hide();   
}
//Get Values for Acelerometer
function onPeek(e){
   console.log('Accel data: ' + JSON.stringify(e.accels));
   if (inWristCount === true){
      console.log('Peeking'); 
      xAxis = e.accel.x;
      yAxis = e.accel.y;
      zAxis = e.accel.z;
      insertElements();       
   }
   else{
      console.log("emptyfunction");
      CountScreen.hide();
      Accel.config({
         subscribe: false
      });
   
   }      
}

//
function detectWristRoll(){
      //placeholder
}
//Insert onto screen
function insertElements() { 
   CounterText.text('Number of Occurances: ' + counter);
   CountScreen.insert(1,CounterText);
   CountScreen.show();
}