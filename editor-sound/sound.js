var currentime = 0;
var fntimeline;
var limittime = 10;
var durnote = 0.2;
arrayMusic = [];
var loopmode = true;

startSound();


function startSound( ){

	//arrayMusic = arrayParam;
	
	context = new  AudioContext();
	if(context == null)
		context = new  webkitAudioContext();

	oscillator = context.createOscillator();
	oscillator.connect(context.destination);
	
	//setInterval(function(){console.log(context.currentTime)}, 10);
}



function stopTimeline(){
 currentime = 0;
 oscillator.stop(context.currentTime);
}


//this function get note, calculate the frenquecy and call playsound
function playnote(frenquecy, duration){
	var note = frenquecy.split(".");
	if(note[0] == "P")
		return;
	var n_frenquecy = getValueFrequency(note[0]);
    
	for(var i=1; i < note[1]; i++)
		n_frenquecy += n_frenquecy;
	
	playsound(n_frenquecy,duration);

}


//This function return values of frequency of note in 0 octave
function getValueFrequency(values){
	if(values == "C") return 32.7; 
	if(values == "C#") return 34.6;
	if(values == "D") return 36.7; 
	if(values == "D#") return 38.9;
	if(values == "E")return 41.2;	  
	if(values == "F")return 43.7;	  
	if(values == "F#")return 46.2;	  
	if(values == "G")return 49.0;	  
	if(values == "G#")return 51.9;	  
	if(values == "A") return 55.0;	  
	if(values == "A#") return 58.3;   
	if(values == "B") return 61.7;	  
}

//play sound with oscilator (frequency of note, duration of note)
function playsound(frenquecy, duration){
	oscillator = context.createOscillator();
	oscillator.connect(context.destination);
	//oscillator.type = "square";
	oscillator.type = "sawtooth";
	oscillator.frequency.value = frenquecy;
	oscillator.start(0);
	oscillator.stop(context.currentTime + duration);
}
//})();