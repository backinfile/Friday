
(function NumKit() {
	Math.randInt = function (min, max) {
		return Math.floor(Math.random() * (max - min + 1) + min);
	}
	Math.distance = function (posa, posb) {
		var dx = posa[0] - posb[0];
		var dy = posa[1] - posb[1];
		return Math.sqrt(dx * dx + dy * dy);
	}
	Array.prototype.shuffle = function () {
		for (var i = 0; i < this.length; i++) {
			var rnd = Math.randInt(0, this.length - 1);
			if (rnd == i)
				continue;
			var x = this[i];
			this[i] = this[rnd];
			this[rnd] = x;
		}
		return this;
	}
	Object.prototype.forEach = function(func) {
		var keys = Object.keys(this);
		for (var i=0; i<keys.length; i++) {
			func(keys[i]);
		}
	}
	Object.prototype.size = function() {
		return Object.keys(this).length;
	}
	Array.prototype.remove = function(val) {
		var index = this.indexOf(val);
		if (index>=0) this.splice(index,1);
		return this;
	}
})();

var GameObject = {};

GameObject.Block = (function() {
	function Block() {
		this.data = {
			rotate: [0,0,0],
			translate: [0,0,0],
			alpha: 1,
			borderColor: 'black',
			borderWidth: 3,
			pos: [0,0],
			size: [100,100],
			mask: false,
			selected: false,
			backgroundImage: null,
			backgroundColor: 'black',
			backImage: null,
			backColor: 'black'
		};
		this.div = document.createElement('div');
		this.div.classList.add('block');
		document.body.appendChild(this.div);
	}
	Block.prototype = {
		
	}
	return Block;
})();

GameObject.Card = !function() {
	function Card(type, data) {
		this.data = data;
		this.type = type;
	}
	Card.prototype = {
		
	}
	return Card;
}();


/* 

(function() {
	function span(size, content,isbold=true, color=null){
		var html = '<span style="font-size:'+size+'px;';
		if (isbold) html += ' font-weight:bold;';
		if (color) {
			size += 8;
			html += " background-color:"+color+";";
			html += " display:inline-block;";
			html += " width:"+size+'px;';
			html += " height:"+size+'px;';
			html += " line-height:"+size+'px;';
			html += ' border-radius:5px;';
		}
		html += '">'+content+'</span>';
		return html;
	}
	function CardDiv(type, data) {
		this.type = type;
		this.data = data;
		this.div = document.createElement('div');
		var div = this.div;
		//document.body.appendChild(div);
		div.style.width = Resources.Image[type].size.width;
		div.style.height = Resources.Image[type].size.height;
		div.style.textAlign = 'center';
		div.style.overflow = 'hidden';
		div.style.borderRadius = '10px';
		div.style.backgroundImage = 'url('+Resources.Image[type].path+')';
		//div.style.boxSizing = 'border-box';
		//div.style.border = '3px solid rgba(255,255,255,0)';
		//div.style.border = '3px solid white';
		div.style.position = 'relative';
		div.style.float = 'left';
		div.style.boxShadow = '-1px 1px 1px black';
		
		this.rotate = 0;
		
		var mask = document.createElement('div');
		this.mask = mask;
		mask.style.width = div.style.width;
		mask.style.height = div.style.height;
		mask.style.backgroundColor = 'rgba(255,255,255,0)';
		mask.style.position = 'absolute';
		mask.style.left = 0;
		mask.style.top = 0;
		
		if (data.skill) data.skill.forEach(function(key) {
			var title = '['+Resources.SkillShortcut[key](data.skill[key])+']';
			title += ' '+Resources.SkillDescription[key](data.skill[key]);
			div.title = title;
		});
		
		var title = Resources.CardTypeName[type];
		if (type == 'agingCard' || type == 'battleCard') {
			var t = '<br><br>'+span(24, title[0]);
			t += span(18,'<br><br>')+span(42,data.attack)+span(18,'<br><br>');
			data.skill.forEach(function(key) {
				t += span(14,Resources.SkillShortcut[key](data.skill[key]));
			});
			var texts = document.createElement('div');
			texts.style.position = 'relative';
			texts.innerHTML = t;
			div.appendChild(texts);
			
		} else if (type == 'hazardCard'){
			var isRotate = true;
			var fontsize = 24;
			var t = span(18,'<br>')+span(20, title[0]);
			var alpha = 0.15;
			t += span(14,'<br><br>')+span(fontsize,data.aim.white,false,'rgba(255,255,255,'+alpha+')');
			t += span(fontsize,data.aim.green,false,'rgba(0,255,0,'+alpha+')');
			t += span(fontsize,data.aim.yellow,false,'rgba(255,255,0,'+alpha+')');
			t += span(fontsize,data.aim.red,false,'rgba(255,0,0,'+alpha+')');
			
			if (isRotate) {
				t += span(18, '<br><br>');
				t += '<div style="transform:rotate(180deg)">';
			} else {
				t += span(18, '<br><br>');
			}
			t += span(20, title[1]);
			t += span(12,'<br>')+span(32,data.attack)+span(12,'<br>');
			data.skill.forEach(function(key) {
				t += span(14,Resources.SkillShortcut[key](data.skill[key]));
			});
			if (isRotate) t += '</div>';
			
			var texts = document.createElement('div');
			texts.style.position = 'relative';
			texts.innerHTML = t;
			div.appendChild(texts);
			
		} else if (type == 'pirateCard'){
		}
		div.appendChild(mask);
		
		var selectedDiv = document.createElement('div');
		this.selectedDiv = selectedDiv;
		selectedDiv.style.width = div.style.width;
		selectedDiv.style.height = div.style.height;
		selectedDiv.style.backgroundImage = 'url('+Resources.Image.selected.path+')';
		selectedDiv.style.position = 'absolute';
		selectedDiv.style.left = 0;
		selectedDiv.style.top = 0;
		selectedDiv.style.visibility = 'hidden';
		div.appendChild(selectedDiv);
	}
	CardDiv.prototype = {
		recover: function() {
			this.div.style.transform = 'none';
		},
		show: function(isTrue){
			if (isTrue) {
				this.div.visibility = 'visible';
			} else {
				this.div.visibility = 'hidden';
				this.selectedDiv.style.visibility = 'hidden';
			}
		},
		setRotate: function(isTrue=true) {
			if (isTrue === true) {
				this.div.style.transform = 'rotate(180deg)';
				this.rotate = 180;
			} else if (isTrue === false) {
				this.div.style.transform = '';
				this.rotate = 0;
			} else {
				this.div.style.transform = 'rotate('+isTrue+'deg)';
				this.rotate = isTrue;
			}
		},
		canBeSelect: function(isTrue) {
			if (isTrue) {
				this.div.style.border = '1px solid #33C';
			} else  {
				//this.div.style.border = '3px solid white';//rgba(255,255,255,0)';
				this.div.style.border = 'none';
			}
		},
		used: function(isTrue) {
			if (isTrue) {
				this.mask.style.backgroundColor = 'rgba(255,255,255,0.5)';
				this.canBeSelect(false);
			} else {
				this.mask.style.backgroundColor = 'rgba(255,255,255,0)';
			}
		},
		selected: function(isTrue=true) {
			if (isTrue) {
				this.selectedDiv.style.visibility = 'visible';
			} else {
				this.selectedDiv.style.visibility = 'hidden';
				//this.div.style.visibility = 'hidden';
			}
		}
	};
	Control.newCardDiv = function(type, data) {
		return new CardDiv(type, data);
	}
})();
 */


