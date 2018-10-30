



// Mask
(function() {
	function Mask() {
		var div = document.createElement('div');
		div.style.width = window.innerWidth;
		div.style.height = window.innerHeight;
		div.style.position = 'fixed';
		div.style.left = 0;
		div.style.right = 0;
		div.style.zIndex = 100;
		div.style.backgroundColor = 'rgba(255,255,255,0.9)';
		this.div = div;
		document.body.appendChild(div);
	}
	Mask.prototype = {
		show: function(isTrue=true) {
			if (isTrue) {
				this.div.style.visibility = 'visible';
			} else {
				this.div.style.visibility = 'hidden';
			}
		}
	}
	Control.getMask = function() {
		return new Mask();
	}
})();


