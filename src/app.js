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
//var gesture = [[{x:'',y:'',z:''},{x:'50',y:'200',z:'20',xpos:'true',xneg:'false',ypos:'true',yneg:'false',zpos:'true',zneg:'true'}]];//lower hertz Values
var gesture = [[{x:null,y:null,z:null},{x:80,y:300,ypos:true,z:20}],[{x:null,y:null,z:null},{x:60,y:300,z:20}]];
Accel.config({
   rate: 25,
   sample: 5,
   subscribe: false
});

//var xAxis = 0;
//var yAxis = 0;
//var zAxis = 0;
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
function onAccelBack(){
   console.log('Close Screen and Stop Loop');
   inWristCount = false;
   CountScreen.hide();   
}
//Get Values for Acelerometer
function onPeek(e){
   //console.log('Accel data: ' + JSON.stringify(e.accels));
   if (inWristCount === true){
      //console.log('Peeking'); 
      var frameArray = [];
      frameArray= arrayToFrames(e);
      var detection = detectGesture(frameArray);
      insertElements(detection);       
   }
   else{
      console.log("emptyfunction");
      CountScreen.hide();
      Accel.config({
         subscribe: false
      });
   
   }      
}
function arrayToFrames(e){
   var frameArray = [];
	for ( var i=0; i<e.accels.length-1; i++){
		frameArray.push([e.accels[i],e.accels[i+1]]);
	}
	return (frameArray);
}
//
function detectGesture(frameArray){ 
   for (var i=0; i<(frameArray.length-1); i++){
      //console.log(frameArray[i][0].vibe);
      if ((frameArray[i][0].vibe === true)||(frameArray[i][0].vibe === true)){
         //moveon , vibration discounts all gestures
         //console.log("frame " + i + "failed" );
      }
      else{
         //console.log("else");
         if (gesture[0][1].ypos===true){
            //start with y
            if (Math.abs(frameArray[i][1].z-frameArray[i][0].z)>=gesture[0][1].z){
               // z 1 first frame
               if(Math.abs(frameArray[i+1][1].z-frameArray[i+1][0].z)>=gesture[1][1].z){
                  //z 2 second frame
                  if (Math.abs(frameArray[i][1].y-frameArray[i][0].y)>=gesture[0][1].y){
                     //y 1 first frame
                     if(Math.abs(frameArray[i+1][1].y-frameArray[i+1][0].y)>=gesture[1][1].y){
                        // y 2nd frame
                        if (Math.abs(frameArray[i][1].x-frameArray[i][0].x)>=gesture[0][1].x){
                           // x 1st frame
                           if(Math.abs(frameArray[i+1][1].x-frameArray[i+1][0].x)>=gesture[1][1].x){
                              // x 2nd frame
                              console.log("Detection");
                              Accel.config({subscribe: false});
                              setTimeout(function(){
                                 Accel.config({subscribe: true});                                 
                              }, 1000);
                              return(true);
                           }
                        }
                     }
                  }
               }
            }
         }
         else{
         }             
         
      }      
   }
   //console.log("No Detecion");
   return(false);  
}

//Insert onto screen
function insertElements(detection) {
   if (detection===true){
      counter++;
   }
   CounterText.text('Number of Occurances: ' + counter);
   CountScreen.insert(1,CounterText);
   CountScreen.show();
}