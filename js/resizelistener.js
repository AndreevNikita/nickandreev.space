class ResizeListener {
	
	constructor(interval = 50) {
		this.items = [];
		this.timer = setInterval(() => this.tick(), interval);
	}
	
	tick() {
		for(let index = 0; index < this.items.length; index++) {
			let item = this.items[index];
			if(!item._resizeListenerInfo) {
				item._resizeListenerInfo = {};
			}
			
			if(item._resizeListenerInfo.lastWidth != item.offsetWidth || item._resizeListenerInfo.lastHeight != item.offsetHeight) {
				item._resizeListenerInfo.lastWidth = item.offsetWidth;
				item._resizeListenerInfo.lastHeight = item.offsetHeight;
				if(item.resizeEvent)
					item.resizeEvent();
			}
		}
		
	}
	
	listen(item) {
		this.items.push(item);
	}
	
};