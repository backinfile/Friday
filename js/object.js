
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
	Object.prototype.extends = function(defaults) {
		var my = this;
		defaults.forEach(function(key) {
			if (!(key in my)) my[key] = defaults[key];
		});
	}
	Array.prototype.remove = function(val) {
		var index = this.indexOf(val);
		if (index>=0) this.splice(index,1);
		return this;
	}
	String.prototype.render = function (context) {
	  return this.replace(/\{\{(.*?)\}\}/g, (match, key) => context[key.trim()]);
	};
})();

var GameObject = {};
var Animation = {};

GameObject.Block = (function() {
	function Block() {
		var width = Resources.Image.back.size.width;
		var height = Resources.Image.back.size.height;
		this.data = {
			visibility: true,
			rotateX:0,
			rotateY:0,
			rotateZ:0,
			translateX:0,
			translateY:0,
			translateZ:0,
			opacity: 1,
			isBorder: false,
			x: 0,
			y: 0,
			width: width,
			height: height,
			zIndex: 0,
			mask: false,
			selected: false
		};
		this.div = document.createElement('div');
		this.div.classList.add('block');
		this.div.style.width = width;
		this.div.style.height = height;
		document.body.appendChild(this.div);
		
		this.container = document.createElement('div');
		this.container.classList.add('container');
		this.container.style.width = width;
		this.container.style.height = height;
		this.div.appendChild(this.container);
		
		
		this.front = document.createElement('div');
		this.front.classList.add('front');
		this.front.style.width = width;
		this.front.style.height = height;
		this.container.appendChild(this.front);
		
		this.back = document.createElement('div');
		this.back.classList.add('back');
		this.back.style.width = width;
		this.back.style.height = height;
		this.container.appendChild(this.back);
		this.mask = document.createElement('div');
		this.mask.classList.add('mask');
		this.container.appendChild(this.mask);
		
		this.selected = document.createElement('div');
		this.selected.classList.add('selected');
		this.container.appendChild(this.selected);
		
		this.init();
	}
	Block.prototype = {
		init: function() {
			this.container.style.transform = ('rotateX({{rotateX}}deg) rotateY({{rotateY}}deg)'+
					' rotateZ({{rotateZ}}deg) translateX({{translateX}})'+ 
					' translateY({{translateY}}) translateZ({{translateZ}})').render(this.data);
			this.div.style.opacity = this.data.opacity;
			if (this.data.isBorder)
				this.div.style.border = '3px solid #22D';
			else this.div.style.border = '3px solid transparent';
			this.div.style.left = this.data.x;
			this.div.style.top = this.data.y;
			this.div.style.width = this.data.width;
			this.div.style.height = this.data.height;
			this.div.style.zIndex = this.data.zIndex;
			this.back.style.backgroundImage = 'url('+Resources.Image.back.path+')';
			
			if (this.data.mask) {
				this.mask.style.visibility = 'visible';
			} else {
				this.mask.style.visibility = 'hidden';
			}
			this.selected.style.backgroundImage = 'url('+Resources.Image.selected.path+')';
			if (this.data.selected) {
				this.selected.style.visibility = 'visible';
			} else {
				this.selected.style.visibility = 'hidden';
			}
			if (this.data.visibility) {
				this.div.style.visibility = 'visible';
			} else {
				this.div.style.visibility = 'hidden';
			}
		},
		showBorder: function(isTrue=true) {
			if (isTrue) {
				this.data.isBorder = true;
				this.div.style.border = '3px solid #22D';
			} else {
				this.data.isBorder = false;
				this.div.style.border = '3px solid transparent';
			}
		},
		cursor: function(isTrue=true) {
			var div = this.div;
			if (isTrue) {
				div.onmouseover = function() {
					div.style.cursor = 'pointer'
				}
				div.onmouseout = function() {
					div.style.cursor = 'default'
				}
			} else {
				div.style.cursor = 'default'
				div.onmouseover = null;
				div.onmouseout = null;
			}
		}
	}
	return Block;
})();

GameObject.Card = (function() {
	function Card(type, data) {
		this.data = data;
		this.type = type;
		this.block = new GameObject.Block();
		var block = this.block;
		
		block.front.style.backgroundImage = 'url('+Resources.Image[type].path+')';
		if (data.skill) data.skill.forEach(function(key) {
			var title = '['+Resources.SkillShortcut[key](data.skill[key])+']';
			title += ' '+Resources.SkillDescription[key](data.skill[key]);
			block.div.title = title;
		});
		block.front.appendChild(_CardDataHtml(type, data));
		this.show(false);
	}
	Card.prototype = {
		setPos: function(pos) {
			var x = pos[0];
			var y = pos[1];
			this.block.div.style.left = x;
			this.block.div.style.top = y;
			this.block.data.x = x;
			this.block.data.y = y;
		},
		getPos: function() {
			return [this.block.data.x, this.block.data.y];
		},
		getRotateY: function() {
			return this.block.data.rotateY;
		},
		setRotateY: function(rotate) {
			var block = this.block;
			if (rotate%360 == 180) {
				block.div.title = '';
			} else if (rotate%360 == 0) {
				var data = this.data;
				if (data.skill) data.skill.forEach(function(key) {
					var title = '['+Resources.SkillShortcut[key](data.skill[key])+']';
					title += ' '+Resources.SkillDescription[key](data.skill[key]);
					block.div.title = title;
				});
			}
			block.data.rotateY = rotate;
			block.container.style.transform = ('rotateX({{rotateX}}deg) rotateY({{rotateY}}deg)'+
					' rotateZ({{rotateZ}}deg) translateX({{translateX}})'+ 
					' translateY({{translateY}}) translateZ({{translateZ}})')
					.render(block.data);
		},
		show: function(isTrue=true) {
			if (isTrue) {
				this.block.data.visibility = true;
				this.block.div.style.visibility = 'visible';
			} else {
				this.block.data.visibility = false;
				this.block.div.style.visibility = 'hidden';
			}
		},
		setAlpha: function(alpha) {
			this.block.div.style.opacity = alpha;
			this.block.data.opacity = alpha;
		},
		setLayer: function(l) {
			this.block.data.zIndex = l;
			this.block.div.style.zIndex = l;
		},
		onclick: function(func) {
			this.block.div.onclick = func;
			if (func) {
				this.block.showBorder(true);
				this.block.cursor(true);
			} else {
				this.block.showBorder(false);
				this.block.cursor(false);
			}
		}
	}
	return Card;
})();

GameObject.Buttons = (function() {
	function Buttons(pos, names) {
		console.log('in');
		this.names = names;
		var div = document.createElement('div');
		div.classList.add('warp');
		var buttons = [];
		this.div = div;
		this.buttons = buttons;
		var onclick = [];
		this.onclick = onclick;
		names.forEach(function(key, index) {
			var btn = document.createElement('button');
			btn.classList.add('buttons');
			btn.innerHTML = key;
			div.appendChild(btn);
			onclick[index] = null;
			btn.onclick = function() {
				if (onclick[index]) onclick[index]();
			}
			buttons[index] = btn;
		});
		div.style.left = pos[0];
		div.style.top = pos[1];
		document.body.appendChild(div);
		this.show(false);
	}
	Buttons.prototype = {
		show: function(isTrue=true) {
			if (isTrue) {
				this.div.style.visibility = 'visible';
			} else {
				this.div.style.visibility = 'hidden';
			}
		},
		showSole: function(i, isTrue) {
			if (isTrue) {
				this.buttons[i].style.visibility = 'visible';
			} else {
				this.buttons[i].style.visibility = 'hidden';
			}
		},
		changeName: function(index, newname) {
			this.buttons[index].innerHTML = newname;
		}
	}
	return Buttons;
})();

GameObject.DataShow = (function() {
	function DataShow(pos) {
		var div = document.createElement('div');
		this.div = div;
		div.classList.add('warp');
		div.style.left = pos[0];
		div.style.top = pos[1];
		document.body.appendChild(div);
	}
	DataShow.prototype = {
		render: function(data) {
			this.div.innerHTML = ('生命:{{health}}/{{maxHealth}}<br>'+
					'战力:{{curAttack}}/{{aimAttack}}<br>').render(data)+
					'阶段:'+Resources.StepName[data.curStep];
		},
		show: function(isTrue=true) {
			if (isTrue) {
				this.div.visibility = 'visible';
			} else {
				this.div.visibility = 'hidden';
			}
		}
	}
	return DataShow;
})();

GameObject.Hands = (function() {
	function Hands() {
		this.cards = [];
	}
	Hands.prototype = {
		push: function(card) {
			this.hands.push(card);
		},
		getPos: function(i, add=0) {
			var cardWidth = Resources.Image.back.size.width;
			var length = this.cards.length+add;
			var offsetLeft = 100;
			var offsetRight = 300;
			var offset = 0;
			var width = window.innerWidth-offsetLeft-offsetRight-2*offset;
			var cell = width/length;
			var gap = cell - cardWidth;
			if (gap > 5) {
				gap = 5;
				cell = gap + cardWidth;
				width = cell*length;
				offset = (window.innerWidth-(width+offsetLeft+offsetRight))/2;
			}
			return [offsetLeft+offset+cell/2+cell*i, 400];
		},
		getPushedPos: function() {
			return this.getPos(this.cards.length, 1);
		}
	}
	return Hands;
})();

GameObject.ShowCards = (function() {
	function Hands() {
		this.cards = [];
		this._mask = document.createElement('div');
		this._mask.classList.add('mask');
		this._mask.style.zIndex = 99;
		this._mask.style.visibility = 'hidden';
		document.body.appendChild(this._mask);
	}
	Hands.prototype = {
		push: function(card) {
			this.hands.push(card);
		},
		getPos: function(i, add=0) {
			var cardWidth = Resources.Image.back.size.width;
			var length = this.cards.length+add;
			var offsetLeft = 100;
			var offsetRight = 300;
			var offset = 0;
			var width = window.innerWidth-offsetLeft-offsetRight-2*offset;
			var cell = width/length;
			var gap = cell - cardWidth;
			if (gap > 120) {
				gap = 120;
				cell = gap + cardWidth;
				width = cell*length;
				offset = (window.innerWidth-(width+offsetLeft+offsetRight))/2;
			}
			return [offsetLeft+offset+cell/2+cell*i, 200];
		},
		getPushedPos: function() {
			return this.getPos(this.cards.length, 1);
		},
		mask: function(isTrue=true) {
			if(isTrue) {
				this._mask.style.visibility = 'visible';
			} else {
				this._mask.style.visibility = 'hidden';
			}
		}
	}
	return Hands;
})();

GameObject.Pile = (function() {
	function Pile(pos) {
		this.cards = [];
		this.pos = pos || [0,0];
	}
	Pile.prototype = {
		getPos: function() {
			return this.pos;
		},
		setPos: function(pos) {
			this.pos = pos.slice();
		},
		getPushedPos: function() {
			return this.getPos(this.cards.length);
		}
	}
	return Pile;
})();

Animation.moveBy = function(card, dx, dy, speed=45*60, delta=1000/60) {
	var pos = card.getPos();
	var aim = [pos[0]+dx, pos[1]+dy];
	var step = speed/(1000/delta);
	var r = Math.sqrt(dx*dx+dy*dy);
	return new Promise(function(resolve, reject) {
		var inter = setInterval(function() {
			var dist = Math.distance(pos, aim);
			if (dist <= step) {
				card.setPos(aim);
				clearInterval(inter);
				resolve(this);
			} else {
				pos[0] += dx/r*step;
				pos[1] += dy/r*step;
				card.setPos(pos);
			}
		}, delta);
	});
}
Animation.moveTo = function(card, x, y, speed=45*60, delta=1000/60) {
	var pos = card.getPos();
	return Animation.moveBy(card, x-pos[0], y-pos[1],speed,delta);
}
Animation.delay = function(t) {
	return new Promise(function(resolve, reject) {
		setTimeout(function() {
			resolve(this);
		}, t);
	});
}
Animation.turnover = function(card, speed=16*60, delta=1000/60) {
	var rotate = card.getRotateY();
	var aim = rotate + 180;
	var dr = speed/(1000/delta);
	return new Promise(function(resolve, reject) {
		var inter = setInterval(function() {
			if (aim-rotate <= dr) {
				card.setRotateY(aim);
				clearInterval(inter);
				resolve(this);
			} else {
				rotate += dr;
				card.setRotateY(rotate);
			}
		}, delta);
	});
}

Animation.fade = function(card, speed=0.05*60, delta=1000/60) {
	var alpha = 1;
	var aim = 0;
	var dr = speed/(1000/delta);
	return new Promise(function(resolve, reject) {
		var inter = setInterval(function() {
			if (Math.abs(aim-alpha) <= dr) {
				card.setAlpha(aim);
				clearInterval(inter);
				resolve(this);
			} else {
				alpha -= dr;
				card.setAlpha(alpha);
			}
		}, delta);
	});
}

Animation.addToPile = function(card, pile, speed=30*60, delta=1000/60) {
	// console.log(pile);
	var aim = pile.getPushedPos();
	return Animation.moveTo(card, aim[0], aim[1], speed, delta);
}
Animation.destroy = function(card) {
	var cnt = 0;
	return new Promise(function(resolve, reject) {
		Animation.moveBy(card, 0, -150, 7*60).then(function() {
			cnt++;
			if (cnt == 2) resolve(this);
		});
		Animation.fade(card, 0.025*60).then(function() {
			cnt++;
			if (cnt == 2) resolve(this);
		});
	});
	
}

Animation.flushHands = function(hands) {
	var cnt = 0;
	var length = hands.cards.length;
	return new Promise(function(resolve, reject) {
		// console.log(hands.cards);
		hands.cards.forEach(function(card, index) {
			let aim = hands.getPos(index);
			card.setLayer(index+1);
			// console.log(aim, index);
			Animation.moveTo(card, aim[0], aim[1]).then(function() {
				cnt++;
				if (cnt == length) {
					resolve();
				}
			});
		});
	});
}

GameObject.Init = function() {
	GameObject.AllCards = {};
	var cnt = 0;
	Resources.CardData.forEach(function(type) {
		GameObject.AllCards[type] = [];
		Resources.CardData[type].forEach(function(data) {
			for(let i=0; i<data.num; i++) {
				var card = new GameObject.Card(type, data);
				// card.setPos([cnt*80, 0]);
				// console.log(cnt*20);
				// card.show();
				cnt++;
				GameObject.AllCards[type].push(card);
			}
		});
	});
}




function _CardDataHtml(type, data) {
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
		return texts;
		
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
		return texts;
		
	} else if (type == 'pirateCard'){
	}
	var texts = document.createElement('div');
	texts.style.position = 'relative';
	texts.innerHTML = title[0];
	return texts;
}


// Animation.moveBy().then(Animation.moveTo).then(function() {
	// console.log('done');
// });

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


