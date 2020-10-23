class TagsLoader {
	
	constructor(mode = true) {
		this.mode = mode;
		this.toGlobalList = [];
		this.toLoaderList = [];
		document.addEventListener("DOMContentLoaded", () => this.load());
	}
	
	load() {
		for(let index = 0; index < this.toGlobalList.length; index++) {
			let listObject = this.toGlobalList[index];
			window[listObject.varName] = document.getElementById(listObject.id);
		}
		this.toGlobalList = [];
		for(let index = 0; index < this.toLoaderList.length; index++) {
			let listObject = this.toLoaderList[index];
			this[listObject.varName] = document.getElementById(listObject.id);
		}
		this.toLoaderList = [];
		
		if(this.onLoad !== undefined)
			this.onLoad();
	}
	
	setMode(mode = true) {
		this.mode = mode;
	}
	
	addToLoad(varName, id, writeToGlobal = undefined) {
		
		if(writeToGlobal === undefined)
			writeToGlobal = this.mode;
		
		var listObject = {
			varName: varName,
			id: id
		};
		
		if(writeToGlobal)
			this.toGlobalList.push(listObject);
		else
			this.toLoaderList.push(listObject);
	}
	
};
