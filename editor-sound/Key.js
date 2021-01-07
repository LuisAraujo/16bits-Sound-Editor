
function Key(x, y, type, note){
	this.x = x;
	this.y = y;	
	this.type = type;
	this.selected = false;
	this.note = note;
};



Key.prototype.draw = function(){
		ctx.beginPath();
		ctx.rect(this.x, this.y, this.type == 0 ? widthKeyWhite : widthKeyBlack,this.type == 0 ? heightKeyWhite  :heightKeyBlack );
		color = this.type == 0 ? "#fff" : "#222";
		ctx.fillStyle = this.selected ? "#dd0" : color;
		ctx.strokeStyle = this.type == 0 ? "#444" : "#000";
		ctx.fill();	
		ctx.stroke();	
}


Key.prototype.drawActive= function(){
	
		ctx.beginPath();
		ctx.rect(this.x, this.y, this.type == 0 ? widthKeyWhite : widthKeyBlack,this.type == 0 ? heightKeyWhite  :heightKeyBlack );
		color = this.type == 0 ? "#ff8" : "#220";
		ctx.fillStyle = this.selected ? "#dd0" : color;
		ctx.strokeStyle = this.type == 0 ? "#444" : "#000";
		ctx.fill();	
		ctx.stroke();	
}


Key.prototype.click = function(x, y){
	
	var h = this.type == 0 ? heightKeyWhite :heightKeyBlack;
	var w = this.type == 0 ? widthKeyWhite : widthKeyBlack;
	
	if ( ( (x > this.x)  &&  (x < this.x+w)) && ( (y > this.y)  &&  (y < this.y+h))) {
		console.log(this.note);
		this.selected = true;
		return true;	
	}
	
	return false;
}
