canvas = document.getElementById("canvas");
btplay = document.getElementById("bt-play2");
//btpause = document.getElementById("bt-pause");
btstop = document.getElementById("bt-stop2");

btplay.addEventListener('click', playSound);
//btpause.addEventListener('click', pauseSound);
btstop.addEventListener('click', stopSound);

//context of canvas
ctx = canvas.getContext("2d");

//array kayes (for future work: this maybe can are a Keyboard objetec)
arrayKeys = [];

//size of keys
widthKeyWhite = 16;
widthKeyBlack = 8;
heightKeyWhite = 60;
heightKeyBlack = 30;

//inicial octave in keyboard
initial_octave = 2;
//count of octave in keyboard
num_oitava = 5;
//active octave - this octave who user can play with keyboard device
active_octave = 4;

state_mode = "projectclosed";

loopApp  = null;
//flags stop and pause sound
isplay = false;
isstop = true;

//num of natural notes
const num_nnote = 7;
//num of dissonantes notes
const num_dnote = 5;

//variables for GUI
const limitTrack = 530;
const marginLeftTack = 50;
const marginKey = 170;
const marginTrackTop = 30;
const widthTrack = 800;

/*TIMES*/
//current time geral when load aplications
currenttime_geral = 0;
//current time when in play sound
currenttime = 0;


//array of notes
arr_notes =  []; //[new Note("E.4", 20, 30), new Note("E.4", 55, 30) , new Note("D.4", 55, 30),new Note("F.4", 120, 30) ];
arr_notes_aux = arr_notes.slice();

/*CHANGE NOTE*/
//current note for change (duration and starttime)
current_note = null;

/*NEW NOTE*/
//linetime position x in canvas  (for future work: this maybe can are a Line object)
linetime = 0;
//time when user press key
temp_timestart_presskey = 0;

//time when user relase key
temp_timeend_presskey = 0;

//refence for new note
newnote = null;

nameproject = "";
idCurrentProject = -1;

function start(){
	
	var listNote = ["C","D","E","F","G","A", "B"];
	var listNoteSus = ["C#","D#","F#","G#","A#"];
	var withTotalOneOctave = widthKeyWhite*num_nnote;
	var marginBlackKey = widthKeyWhite/2 + widthKeyBlack/2;
	
	ctx.clearRect(0, 0, canvas.width, canvas.height)
	//blacks key
	for(var j=0; j < num_oitava; j++){
		//cont only notes dissonants
		var n=0; 
		for(var i=0; i< num_nnote; i++){
			
			//not exist E# and B#
			if(i!=2 && i!=6){
				var x = marginKey + marginBlackKey + i*(widthKeyWhite) + (withTotalOneOctave*j);
				type = 1;
				//get note concat with octave
				note = listNoteSus[n%5]+"."+ (j + initial_octave);
				k = new Key(x , limitTrack+10, type, note);	
				arrayKeys.push(k);
				n++;
			}
		}
	}
	//whites keys
	
	for(var j=0; j < num_oitava; j++){
		for(var i=0; i< num_nnote; i++){
			var x =  marginKey + i*widthKeyWhite + withTotalOneOctave*j
			var type = 0;
			var note = listNote[i%7]+"."+(j +initial_octave);
			var k = new Key(x, limitTrack + 10,type, note);
			arrayKeys.push(k);
		}	
	}
	
	
	loopApp = setInterval(function(){
		if(isplay){
			updateCanvas();
			currenttime++;
		}		
		currenttime_geral++;	
	}, 10);
	
	//updateCanvas();
}
/** BUTTONS **/

btfile =  document.getElementById("bt-file");

btfile.addEventListener('click', function (evt) {
	var op_menu = document.getElementById("opt-menu-file");
	if(op_menu.style.display == "block")
		op_menu.style.display = "none";
	else
		op_menu.style.display = "block";
});

document.getElementById("bt-newproject").addEventListener("click", function(){
	document.getElementById("modal-new-project").style = "display: block";
	document.getElementById("opt-menu-file").style.display = "none";
	document.getElementById("name-project").value = "Project";
});

document.getElementById("bt-createproject").addEventListener("click", function(){
	document.getElementById("modal-new-project").style.display = "none";
	newProject();
});


document.getElementById("bt-exit-newproject").addEventListener("click", function(){
	document.getElementById("modal-new-project").style = "display: none";	
	inp_nameproject.setAttribute("fistname",true);
});

document.getElementById("bt-openproject").addEventListener("click", function(){
	document.getElementById("modal-open-project").style = "display: block";
	document.getElementById("opt-menu-file").style.display = "none";
	listProject();
});

document.getElementById("bt-exit-openproject").addEventListener("click", function(){
	document.getElementById("modal-open-project").style = "display: none";
});

document.getElementById("bt-saveproject").addEventListener("click", function(){
	//document.getElementById("modal-open-project").style = "display: block";
	document.getElementById("opt-menu-file").style.display = "none";
	savingProject();
});


document.getElementById("bt-exportproject").addEventListener("click",function (evt){
	document.getElementById("opt-menu-file").style.display = "none";
	exportProject();
});

/** FUNCTIONS ABOUT PROJECTS ***/
//list projects
function listProject(){
	document.getElementById("list-project").innerHTML = "";
	var project = getListProject();
	
	for (var i =0; i< project.length; i++){	
		var info = getProject(project[i]).split("_");
		document.getElementById("list-project").innerHTML += "<div idproject='"+project[i]+"' class='item-listproject'><span class='title-project'>"+info[0]+"</span> <span class='bt-delete'>delete</span></div>";
	}
	
	setFunctionsList();
	
}


//function of item list
function setFunctionsList(){
	classname = document.getElementsByClassName("item-listproject");
	
	for (var i = 0; i < classname.length; i++) {
		
		classname[i].addEventListener('click', function(evt){
			idProject = this.getAttribute("idproject");
			nameproject = this.innerHTML;
			
			
			//OPEN
			if(evt.target.className == "title-project"){
				document.getElementById("modal-open-project").style = "display: none";
				openProject(idProject);
			
				
				
			}else if(evt.target.className == "bt-delete"){
				
				deletingProject(idProject);
				listProject();
				
			}
			
		}, false);
	}
}
function deletingProject(idProject){
	
	if(idProject == idCurrentProject){
		state_mode = "projectclosed";
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		idCurrentProject = -1;
	}
	
	deleteProject(idProject);
}

function openProject(idProject){
	state_mode = "projectopened";
	idCurrentProject = idProject;
	arr_notes = [];
	console.log(idProject);
	nameproject =  getNameProject(idCurrentProject);
	document.title = nameproject;
	
	var proj = getProject(idCurrentProject);
	var notes = proj.split("_")[1].split(",");
	
	for(var i =0; i< notes.length; i++){
		
	   
		info_note = notes[i].split("|");
		
		if(isNaN(parseInt(info_note[1])) || isNaN(parseInt(info_note[2]))  )
		   continue;
	   
		arr_notes.push(new Note(info_note[0], parseInt(info_note[1]), parseInt(info_note[2]) ) );
	}
	
	arr_notes.sort(compare);
	arr_notes_aux = arr_notes.slice();
	updateCanvas();
}

function newProject(){
	state_mode = "projectopened";
	nameproject = document.getElementById("name-project").value;
	document.title = nameproject;
	idCurrentProject = setNewProject(nameproject+"_");
	arr_notes = [];
	arr_notes_aux = arr_notes.slice();
	updateCanvas();
	
}


function savingProject(){
	if(idCurrentProject == -1)
		return;
	
	var info = nameproject+"_";
	console.log(info);
	
	for(var i=0; i< arr_notes.length; i++){
		if(i!=0)
			info+=",";
		
		info+=arr_notes[i].note+"|"+arr_notes[i].timestart+"|"+arr_notes[i].duration;			
	}
	console.log(arr_notes);
	console.log(info);
	saveProject(idCurrentProject, info);
}


function exportProject(){
	
	if(idCurrentProject == -1)
		return;

	var text = gerateCode();
	var blob = new Blob([text], {type: "text/plain;charset=utf-8"});
	saveAs(blob, nameproject+".txt");
}

function gerateCode(){
	var outtext = "[";
	
	for(var i=0; i< arr_notes.length; i++){
		if(i!=0)
			outtext += ",";
		
		outtext += "['"+arr_notes[i].note+"',"+arr_notes[i].duration/100+","+arr_notes[i].timestart/100+"]";
	}
	
	outtext += "]";
	console.log(outtext);
	return outtext;
	
}

/** INPUTS **/
inp_note = document.getElementById("current-note");
inp_timestart = document.getElementById("current-note-timestart");
inp_duration = document.getElementById("current-note-duration");
inp_initialkb = document.getElementById("initial-keyboard");
inp_initialoctave = document.getElementById("initial-octave");
inp_nameproject = document.getElementById("name-project");

inp_initialoctave.addEventListener('change', function (evt) { 
     initial_octave = parseInt(this.value);
	 if(state_mode == "projectopened")
		updateCanvas();
});

inp_initialkb.addEventListener('change', function (evt) { 
     active_octave = parseInt(this.value);
	 if(state_mode == "projectopened")
		updateCanvas();
});

inp_note.addEventListener('change', function (evt) { 
	if(current_note != null){
	   arr_notes[current_note].note = inp_note.value;
	   arr_notes_aux = arr_notes.slice();
	   updateCanvas();
	}
});

inp_timestart.addEventListener('change', function (evt) { 
	if(current_note != null){
	   arr_notes[current_note].timestart = parseInt(inp_timestart.value);
	   arr_notes_aux = arr_notes.slice();
	   updateCanvas();
	}
});

inp_duration.addEventListener('change', function (evt) {
	if(current_note != null){	
	   arr_notes[current_note].duration = parseInt(inp_duration.value);
	   arr_notes_aux = arr_notes.slice();
	   updateCanvas();
	}
});


inp_nameproject.addEventListener('focus', function (evt) {
	if(this.getAttribute("firstname")){
		this.setAttribute("firstname", false);
		this.value = "";
	}
});

inp_nameproject.addEventListener('focusout', function (evt) {
	console.log(this.value);
	if(this.value == ""){
		this.setAttribute("firstname", true);
		this.value = "Project";	
	}
});



/** PLAY PAUSE AND STOP **/
function playSound() {
	
	btplay.style.backgroundPosition ="0px";
	
	if(isplay){
		pauseSound();
		return;
	}
	
	isplay  = true;
	isstop = false;
	current_note = null;
	//sort arr_notes by timestart
	arr_notes.sort(compare);
	arr_notes_aux = arr_notes.slice();
 

};

function pauseSound(){
	//	clearInterval(loopApp);
	btplay.style.backgroundPosition ="40px";
	isplay = false;
};

function stopSound(){
	clearInterval(loopApp);
	currenttime = 0;
	arr_notes_aux = arr_notes.slice();
	isplay = false;
	isstop = true;
	//restart canvas for init
	start();
	updateCanvas();
}

/** FUNCTIONS MOUSE **/
canvas.addEventListener('mousedown', function (evt) {
	
	//edit only in pause
	if((!isstop) || (state_mode == "projectclosed"))
	   	return
	
	var mousePos = getMousePos(canvas, evt);
	var posx =  mousePos.x ;
	var posy =  mousePos.y ;
	
	//copy x postion of mouse for linetime, only in track limits
	if((posy < 520) && (posx > marginLeftTack) )
		linetime = posx;

	//turn all keys
	for(var i=0; i< arrayKeys.length; i++){
		//verify clic in key
		if( arrayKeys[i].click(posx, posy)){
			//play a soud
			playnote(arrayKeys[i].note,100);
			//create a new note with note of key and linetime position
			newnote = new Note(arrayKeys[i].note, parseInt(linetime-marginLeftTack) , 10);
			//insert in arr_notes
			arr_notes.push(newnote);
			//update arr_notes_aux
			arr_notes_aux = arr_notes.slice();	
			//get current time
			temp_timestart_presskey	= currenttime_geral;		
			break;
		}
	}
	

	for(var i=0; i< arr_notes_aux.length; i++){
			if(arr_notes_aux[i].click(posx, posy)){
				arr_notes_aux[i].selected = true;
				current_note = i;
				updateInputs();
				playnote(arr_notes_aux[i].note, 0.2);
			}else{
				arr_notes_aux[i].selected = false;
				
			}
	}
	 
	
	updateCanvas();
	
}, false);


canvas.addEventListener('mouseup', function(evt) {
	
	//Has a new note in variable?
	if(newnote != null){
		//calculate duration
		var temp_timeend_presskey = currenttime_geral;	
		var duration = temp_timeend_presskey - temp_timestart_presskey;
		newnote.duration = duration; 	
		linetime = linetime + duration;
		
		arr_notes_aux = arr_notes.slice();
		stopTimeline();
		newnote = null;
		updateCanvas();
	}
	
	for(var i=0; i< arrayKeys.length; i++){
		arrayKeys[i].selected = false;
	}
	
	
}, false);


function getMousePos(canvas, evt) {
	var rect = canvas.getBoundingClientRect();
	return {
	  x: evt.clientX - rect.left,
	  y: evt.clientY - rect.top
	};
}
/** FUNCTIONS KEYBOARD **/


window.onkeydown = function(e) { 

if(state_mode == "projectclosed")
	return; 


SPACE = 32
Q = 81;
W = 87;
E = 69;
R = 82;
T = 84;
Y = 89;
U = 85;
I = 73;
O = 79;
P = 80;

numdnotes = 24;

//press space
  if(e.keyCode == SPACE ){
	  if(isplay)
		 pauseSound();
	  else{
		isplay = false;
		playSound();
	  }
  }else if(e.keyCode == Q){
	  console.log(arrayKeys[numdnotes + (active_octave-initial_octave)*num_nnote + 1].note)
	  playnote(arrayKeys[numdnotes + (active_octave-initial_octave)*num_nnote + 1].note, 1);
	 
  }else if(e.keyCode == W){
	  playnote(arrayKeys[24+ active_octave*num_nnote + 2].note, 1);
	 
  }else if(e.keyCode == E){
	  playnote(arrayKeys[24+ active_octave*num_nnote + 3].note, 1);
	 
  }else if(e.keyCode == R){
	  playnote(arrayKeys[24+ active_octave*num_nnote + 4].note, 1);
	 
  }else if(e.keyCode == T){
	  playnote(arrayKeys[24+ active_octave*num_nnote + 5].note, 1);
	 
  }else if(e.keyCode == U){
	  playnote(arrayKeys[24+ active_octave*num_nnote + 6].note, 1);
	 
  }else if(e.keyCode == I){
	  playnote(arrayKeys[24+ active_octave*num_nnote + 7].note, 1);
	 
  }else if(e.keyCode == O){
	  playnote(arrayKeys[24+ active_octave*num_nnote + 8].note, 1);
	 
  }else if(e.keyCode == P){
	  playnote(arrayKeys[24+ active_octave*num_nnote + 9].note, 1);
	 
  }
  
  
};




/** UPDATES **/

function updateInputs(){
	inp_note.value = arr_notes_aux[current_note].note;
	inp_timestart.value = arr_notes_aux[current_note].timestart;
	inp_duration.value = arr_notes_aux[current_note].duration;	
}


function updateCanvas(){
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	drawKeyboard();
	drawTracks();
	
	printCurrentTime();
	drawNotesTracks();	
	
	drawLineTime();
}




/** FUNCTIONS FOR DRAW **/

//Draw keyborad in canvas
function drawKeyboard(){
	//turn all keys and draw
	for(var i= arrayKeys.length-1; i >= 0; i--){
		if((parseInt(arrayKeys[i].note.split(".")[1]) == active_octave) || (parseInt(arrayKeys[i].note.split(".")[1]) == active_octave+1) )
			arrayKeys[i].drawActive();	
		else{
			arrayKeys[i].draw();
		}
	}
}

//draw tracks in canvas
function drawTracks(){
	var listNote = ["C","B","A#", "A","G#","G","F#","F","E","D#","D","C#"];
	//height of track
	var height = 8;
	//alternate color 
	var color1 = "rgb(170, 170, 170)";
	var color2 = "rgb(200, 200, 200)";
	
	var y =0;
	var n=0;
    currentoc = num_oitava+initial_octave;
	
	for(var i= 0; i < (num_nnote+num_dnote) * num_oitava+1; i++){
		n++;
		ctx.beginPath();
		y = marginTrackTop + i*height;
		ctx.rect(marginLeftTack, y, widthTrack, height);
		ctx.fillStyle = n%2 == 0 ? color1 : color2 ;
		ctx.fill();		
		
		ctx.font = "8px Arial";
		ctx.textAlign = "center";
		ctx.fillStyle = getColorOfNote(listNote[i%12]+"."+parseInt(i/12));
		ctx.fillText(listNote[i%12]+" "+currentoc, 30, marginTrackTop + i*height + 8);
		
		if(i%(num_nnote+num_dnote) == 0)
			currentoc--;
	}
	
	//print time in track
	ctx.font = "10px Arial";
	ctx.fillStyle = "black";
	for(var i=0; i<800; i+=100)
		ctx.fillText( currenttime+i, 50+i, y+height+10);
			
}


/*
* This Method print note in canas 
*/

	
function drawNotesTracks(){
	
	if(arr_notes_aux.length == 0)
       pauseSound()
   
    //console.log(arr_notes_aux.length)
   
	var height = 8;
	
	for(var i= 0; i <  arr_notes_aux.length; i++){
		//console.log( arr_notes_aux[i].note)
		var color2 = getColorOfNote( arr_notes_aux[i].note);
		
		if ( (parseInt(arr_notes_aux[i].note.split(".")[1]) < initial_octave) || (parseInt(arr_notes_aux[i].note.split(".")[1]) > initial_octave+4)){
			continue;
		}
		 
		ctx.beginPath();
		
		var posx =  arr_notes_aux[i].timestart - currenttime;
		
		if((posx == 0) && (isplay))
			playnote( arr_notes_aux[i].note,  arr_notes_aux[i].duration/100);
		
		var width = arr_notes_aux[i].duration;
		
		if(posx < 0){
			width =   arr_notes_aux[i].duration - Math.abs(posx);
			posx = 0;
			
		}else if(posx + width > widthTrack){
			width = widthTrack - posx;
		}
		
		
		if(( posx+width >= 0) && (posx < widthTrack)){ 	
		    var x = posx + 50;
			var y = marginTrackTop + (getPosOfNote(arr_notes_aux[i].note) *height);
			
			//update notes
			arr_notes_aux[i].x = x;
			arr_notes_aux[i].y = y;
			
			ctx.fillStyle = color2 ;
			ctx.rect(x, y, width, height);
			ctx.fill();		
			
			//if selected active border
			if(arr_notes_aux[i].selected){
				ctx.strokeStyle = "#ff0" ;
				ctx.rect(x, y, width, height);
				ctx.stroke();	
			}
			
		}else if(posx+width <= 0){
			
			console.log(posx)
			arr_notes_aux.shift();	
		}	
	}
	
}
	

function drawLineTime(){
	if(linetime > marginLeftTack){
		
	ctx.beginPath();
    ctx.moveTo(linetime,marginTrackTop);
    ctx.lineTo(linetime, 520);
	ctx.strokeStyle = "#000";
    ctx.stroke();
	}
}


function printCurrentTime(){

	ctx.font = "20px Arial";
	ctx.fillStyle = "black";
	ctx.fillText( parseInt(currenttime/60)+":"+ ( (currenttime%60) < 10 ? "0"+(currenttime%60) : (currenttime%60) ),480,20);	
}


/** FUNTIONS NOTES **/

function getColorOfNote(note){
	
	values = note.split(".");
	octave = parseInt(values[1])+1;
	
	if(values[0] == "C") return "rgb("+ (100 + (10*octave))+","+0+","+(50+(10*octave))+")"; 
	if(values[0] == "C#") return "rgb("+ (100 + (10*octave))+","+(20+(10*octave))+","+(50+(10*octave))+")";  
	
	if(values[0] == "D") return "rgb("+ (200 + (10*octave))+","+(0+(10*octave))+","+(70+(10*octave))+")";  
	if(values[0] == "D#") return "rgb("+ (200 + (10*octave))+","+(0+(10*octave))+","+(70+(10*octave))+")";
	
	if(values[0] == "E")return "rgb("+ (200 + (10*octave))+","+(0+(10*octave))+","+(200+(10*octave))+")";
	
	if(values[0] == "F")return "rgb("+ (0 + (10*octave))+","+(20+(10*octave))+","+(100+(10*octave))+")";  
	if(values[0] == "F#")return "rgb("+ (10 + (10*octave))+","+(20+(10*octave))+","+(120+(10*octave))+")";  
	
	if(values[0] == "G")return "rgb("+ (10 + (10*octave))+","+(150+(10*octave))+","+(0+(10*octave))+")";  
	if(values[0] == "G#")return "rgb("+ (20 + (10*octave))+","+(200+(10*octave))+","+(50+(10*octave))+")";
	
	if(values[0] == "A") return "rgb("+ (180 + (10*octave))+","+(180+(10*octave))+","+(0+(10*octave))+")";  
	if(values[0] == "A#") return "rgb("+ (200 + (10*octave))+","+(200+(10*octave))+","+(50+(10*octave))+")";  
	
	if(values[0] == "B") return "rgb("+ (100 + (10*octave))+","+(100+(10*octave))+","+(100+(10*octave))+")";  
}

function getPosOfNote(note){

	values = note.split(".");
	octave = parseInt(values[1]) ;
	num_total_notes = num_nnote+num_dnote;
	heightTrack = ((num_total_notes) * num_oitava) ;
	
	if(values[0] == "C") return  (heightTrack - num_total_notes*octave) + initial_octave*num_total_notes; 
	if(values[0] == "C#") return  (-1 + heightTrack - num_total_notes*octave)+ initial_octave*num_total_notes; 
	if(values[0] == "D") return (-2 + heightTrack - num_total_notes*octave) + initial_octave*num_total_notes; 
	if(values[0] == "D#") return (-3 + heightTrack - num_total_notes*octave) + initial_octave*num_total_notes; 
	if(values[0] == "E")return (-4 + heightTrack - num_total_notes*octave) + initial_octave*num_total_notes; 
	if(values[0] == "F")return (-5 + heightTrack - num_total_notes*octave) + initial_octave*num_total_notes; 
	if(values[0] == "F#")return (-6 + heightTrack - num_total_notes*octave) + initial_octave*num_total_notes; 
	if(values[0] == "G")return (-7 + heightTrack - num_total_notes*octave) + initial_octave*num_total_notes; 
	if(values[0] == "G#")return (-8 + heightTrack - num_total_notes*octave) + initial_octave*num_total_notes; 
	if(values[0] == "A") return (-9 + heightTrack - num_total_notes*octave) + initial_octave*num_total_notes; 
	if(values[0] == "A#") return (-10 + heightTrack - num_total_notes*octave) + initial_octave*num_total_notes; 
	if(values[0] == "B") return (-11 + heightTrack - num_total_notes*octave) + initial_octave*num_total_notes; 
}

/** UTIL **/
function compare(a,b) {
  if (a.timestart < b.timestart)
    return -1;
  if (a.timestart > b.timestart)
    return 1;
  return 0;
}



start();