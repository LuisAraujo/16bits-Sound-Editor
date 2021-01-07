meuStorage = localStorage;

//clearAllProjects();
//setNewProject("Teste_C#.2|10|100,D.2|100|200");
//p = getListProject();
//console.log(p)


function clearAllProjects(){
	localStorage.clear();	
}

function setNewProject(content){
	var cid = 0;
	
	while(getProject("Project"+cid) != null){
		 cid++;
	}
	 
	var name = "Project"+cid;
	localStorage.setItem(name, content);	
	
	return name;
}

function saveProject(name, content){
	localStorage.setItem(name, content);	
}

function getListProject(){
	var a = [];
	for( key in localStorage){
		a.push(key);
	}
	return a;
}

function getProject(item){
	return localStorage.getItem(item);
}

function getNameProject(id){
	return getProject(id).split("_")[0]
}
function deleteProject(item){
	console.log(item);
	localStorage.removeItem(item);
}