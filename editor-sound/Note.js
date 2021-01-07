function Note(note, timestart, duration){
	this.note = note;
	this.timestart = timestart;	
	this.duration = duration;
	this.selected = false;
	this.x = 0;
	this.y = 0;
};

Note.prototype.click = function(x, y){
	
	var h = 8;
	var w = this.duration;
	
	if ( ( (x > this.x)  &&  (x < this.x+w)) && ( (y > this.y)  &&  (y < this.y+h))) {
		return true;	
	}
	
	return false;
}

