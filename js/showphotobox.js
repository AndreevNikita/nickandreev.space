class ShowPhotoBox {
	
	constructor(htmlElement) {
		this.htmlElement = htmlElement;
		this.init();
	}
	
	init() {
		this.htmlElement.onclick = () => { this.hide(); };
		this.photoBox = this.htmlElement.getElementsByClassName("photo-box")[0];
		this.closeButton = this.htmlElement.getElementsByClassName("close-button")[0];
		this.closeButton.onclick = () => { this.hide(); };
	}
	
	show(url) {
		this.htmlElement.style.display = "block";
		this.photoBox.style["background-image"] = "url('" + url + "')";
	}
	
	hide() {
		this.htmlElement.style.display = "none";
	}
	
	static initAll() {
		let showPhotoBoxes = document.getElementsByClassName("show-photo-box");
		for(let index = 0; index < showPhotoBoxes.length; index++) {
			let showPhotoBox = showPhotoBoxes[index];
			showPhotoBox.handler = new ShowPhotoBox(showPhotoBox);
		}
	}
	
	static initAllOnLoad() {
		document.addEventListener("DOMContentLoaded", () => { ShowPhotoBox.initAll(); });
	}
}