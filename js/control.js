

var Control = {};

(function () {
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




(function() {
	function CardsDiv() {
		var div = document.createElement('div');
		this.div = div;
		div.style.overflowY = 'scroll';
		div.style.position = 'fixed';
		div.style.left = 0;
		div.style.top = 0;
		this.scroll = 18;
		//div.style.border = '3px solid skyblue';
		div.style.boxShadow = '0px 1px 1px black';
		div.style.backgroundColor = 'rgba(0,0,0,0)';
		document.body.appendChild(div);
		
		var textdiv = document.createElement('textdiv');
		textdiv.style.width = '100%';
		textdiv.innerHTML = '';
		this.textdiv = textdiv;
		
		var content = document.createElement('div');
		content.style.position = 'relative';
		this.content = content;
		div.appendChild(textdiv);
		div.appendChild(content);
		
		this.setSize(3,2);
	}
	CardsDiv.prototype = {
		add: function(card) {
			this.content.appendChild(card.div.div);
		},
		remove: function(card) {
			//console.log('haha',this.content, card.div.div);
			this.content.removeChild(card.div.div);
		},
		setSize: function(width=1,height=1) {
			var textHeight = 0;
			if (this.textdiv.innerHTML != '') textHeight = 24;
			this.div.style.width = 151*width+this.scroll;
			this.div.style.height = 237*height+textHeight;
			this.size = [width, height];
		},
		setPos: function(x,y) {
			this.div.style.left = x;
			this.div.style.top = y;
		},
		hideBorder: function() {
			this.div.style.boxShadow = 'none';
			this.div.style.overflow = 'visible';
			this.scroll = 0;
			this.setSize(this.size[0], this.size[1]);
		},
		message: function(t) {
			this.textdiv.innerHTML = t;
		},
		setLayer: function(l) {
			this.div.style.zIndex = l;
		},
		show: function(isTrue) {
			if (isTrue) {
				this.div.style.visibility = 'visible';
			} else {
				this.div.style.visibility = 'hidden';
			}
		}
	}
	Control.newCardsDiv = function() {
		return new CardsDiv();
	}
})();

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

//Message
(function() {
	function Message() {
		var div = document.createElement('div');
		div.style.position = 'fixed';
		// div.style.left = x;
		// div.style.top = y;
		// div.innerHTML = msg;
		this.div = div;
		div.style.visibility = 'hidden';
		div.style.zIndex = 100;
		document.body.appendChild(div);
	}
	Message.prototype = {
		message: function(x,y,msg,t=3000) {
			var div = document.createElement('div');
			div.style.position = 'fixed';
			div.style.left = x;
			div.style.top = y;
			div.style.zIndex = 40;
			div.innerHTML = msg;
			document.body.appendChild(div);
			if (t >= 0) {
				setTimeout(function() {
					document.body.removeChild(div);
				}, t);
			}
			return div;
		},
		show: function(x,y,msg) {
			if (x === false) {
				this.div.style.visibility = 'hidden';
			} else {
				this.div.style.left = x;
				this.div.style.top = y;
				this.div.innerHTML = msg;
				this.div.style.visibility = 'visible';
			}
		}
	};
	Control.getMessage = function() {
		return new Message();
	}
})();

// Button
(function() {
	function CButton(contents) {
		var width = 100;
		var height = 40;
		this.buttons = [];
		var div = document.createElement('div');
		div.style.position = 'fixed';
		div.style.zIndex = 101;
		div.style.visibility = 'hidden';
		document.body.appendChild(div);
		this.div = div;
		this.div.style.left = 740;
		this.div.style.top = 500;
		this.onclick = [];
		var my = this;
		for (let i=0; i<contents.length; i++) {
			var div = document.createElement('button');
			div.style.width = width;
			div.style.height = height;
			div.style.borderRadius = '5px';
			div.style.lineHeight = div.style.height;
			div.float = 'left';
			if (i==2)div.style.visibility = 'hidden';
			div.innerHTML = contents[i];
			this.buttons[i] = div;
			this.div.appendChild(div);
			div.onclick = function() {
				if (my.onclick[i]) my.onclick[i]();
			}
		}
	}
	CButton.prototype = {
		show: function(x,y) {
			var my = this;
			if (x instanceof Array) {
				my.buttons.forEach(function(key, index) {
					key.style.visibility = 'hidden';
				});
				x.forEach(function(key) {
					if (x[key]) {
						my.buttons[key].style.visibility = 'visible';
					}
				});
			} else if (x === false) {
				this.div.style.visibility = 'hidden';
			} else if (x === true) {
				this.div.style.visibility = 'visible';
			} else {
				this.div.style.left = x;
				this.div.style.top = y;
				this.div.style.visibility = 'visible';
			}
		},
		showSole: function(index, isTrue=true) {
			if (isTrue) {
				this.buttons[index].style.visibility = 'visible';
			} else {
				this.buttons[index].style.visibility = 'hidden';
			}
		}
	}
	Control.getButtons = function(words) {
		return new CButton(words);
	}
})();

// DataShow
(function() {
	function DataShow(x,y) {
		var DataShowDiv = {};
		this.divs = DataShowDiv;
		DataShowDiv.health = GameObject.Message.message(x,y, '生命值:0', -1);
		DataShowDiv.freeChoose = GameObject.Message.message(x,y+30, '免费抽牌次数:0', -1);
		DataShowDiv.curAttack = GameObject.Message.message(x,y+60, '当前战力:0', -1);
		DataShowDiv.aimAttack = GameObject.Message.message(x,y+90, '需求战力:0', -1);
		DataShowDiv.curStep = GameObject.Message.message(x,y+120, '阶段:绿色', -1);
	}
	DataShow.prototype = {
		showHealth: function(val, max) {
			this.divs.health.innerHTML = '生命值:'+val+'/'+max;
		},
		showAttack: function(val) {
			this.divs.curAttack.innerHTML = '当前战力:'+val;
		},
		showAimAttack: function(val) {
			this.divs.aimAttack.innerHTML = '需求战力:'+val;
		},
		showFreeChoose: function(val) {
			this.divs.freeChoose.innerHTML = '免费抽牌次数:'+val;
		},
		showStep: function(val) {
			var stepname = ['绿色', '黄色', '红色', '海盗'];
			this.divs.curStep.innerHTML = '阶段:'+stepname[val];
		}
	}
	Control.getDataShow = function(x,y) {
		return new DataShow(x,y);
	};
})();

// (function() {
	// function Back() {
		// var div = document.createElement('div');
		// div.style.backgroundImage = 'url('+Resources.Image.back.path+')';
		// div.style.width = Resources.Image.back.size.width;
		// div.style.height = Resources.Image.back.size.height;
		// document.body.appendChild(div);
		// console.log('in');
	// }
	// Back.prototype = {
		
	// };
	// Control.getBack = function() {
		// return new Back();
	// }
// })();


// Cardunit
(function() {
	function CardUnit(front) {
		var warp = document.createElement('div');
		warp.style.perspective = '1000px';
		warp.style.left = '100px';
		warp.style.top = '50px';
		warp.style.position = 'fixed';
		
		var div = document.createElement('div');
		div.style.width = Resources.Image.back.size.width;
		div.style.height = Resources.Image.back.size.height;
		div.style.backfaceVisibility = 'hidden';
		div.style.position = 'relative';
        div.style.transformStyle = 'preserve-3d';
        div.style.backgroundColor = 'rgba(0,0,0,0)';
		
		var back = document.createElement('div');
		back.style.backgroundImage = 'url('+Resources.Image.back.path+')';
		back.style.width = Resources.Image.back.size.width;
		back.style.height = Resources.Image.back.size.height;
		back.style.position = 'absolute';
		back.style.borderRadius = '10px';
		back.style.boxShadow = '-1px 1px 1px black';
		back.style.transform = ' translateZ(1px)';
		
		
		var rotate = 0, rotateb = 0;
		back.style.transform = 'rotateY(0deg) translateZ(1px)';
		
		div.appendChild(back);
		warp.appendChild(div);
		document.body.appendChild(warp);
		
		var mask = document.createElement('div');
		mask.style.position = 'absolute';
		mask.style.backgroundColor = 'rgba(255,255,255,0.8)';
		mask.style.width = back.style.width;
		mask.style.height = back.style.height;
		mask.style.borderRadius = '10px';
		mask.style.top = 0;
		mask.style.left = 0;
		mask.style.lineHeight = mask.style.height;
		mask.style.fontSize = '32px';
		mask.style.color = '#333';
		mask.style.textAlign = 'center';
		mask.style.fontWeight = 'bold';
		mask.innerHTML = '免费抽牌';
		mask.style.visibility = 'hidden';
		
		
		warp.appendChild(mask);
		if (front) {
			this.setFront(front);
		}
		this.mask = mask;
		this.div = div;
		this.warp = warp;
		this.rotate = 0;
		this.data = {};
		this.setTip(false, false, '免费');//'生命值-1');
		
		var my = this;
		warp.onmouseover = function() {
			my.checkState('mouseover');
			//my.mask.style.visibility = 'visible';
		}
		warp.onmousemove = function() {
			my.checkState('mouseover');
			//my.mask.style.visibility = 'visible';
		}
		warp.onmouseout = function() {
			my.checkState('mouseout');
			//my.mask.style.visibility = 'hidden';
		}
		warp.onclick = function() {
			my.checkState('click');
			//my.animateFlip();
		}
	}
	CardUnit.prototype = {
		flip: function() {
			this.rotate += 180;
			this.div.style.transform = 'rotateY('+this.rotate+'deg)';
		},
		animateFlip: function(callback) {
			var my = this;
			var inter = setInterval(function() {
				my.rotate += 10;  // 5,10,20,,, 180%what==0
				my.div.style.transform = 'rotateY('+my.rotate+'deg)';
				if (my.rotate%180 == 0) {
					clearInterval(inter);
					if (callback) callback();
				}
			}, 1000/60);
		},
		setTip: function(isTip, isFlip, tipText, tipCallback, filpCallback, autoload, loadFailCallback) {
			this.data.isTip = isTip;
			this.data.isFlip = isFlip;
			this.data.tipText = tipText;
			this.data.tipCallback = tipCallback;
			this.data.filpCallback = filpCallback;
			this.data.autoload = autoload;
			this.data.loadFailCallback = loadFailCallback;
			this.mask.innerHTML = tipText;
		},
		checkState: function(e) {
			if (e == 'mouseover') {
				if (this.data.isTip) {
					this.mask.style.visibility = 'visible';
					if (this.data.tipCallback)this.data.tipCallback();
				}
			} else if (e == 'mouseout') {
				this.mask.style.visibility = 'hidden';
			} else if (e == 'click') {
				if (this.data.isFlip) {
					if (this.data.autoload) {
						var card = this.data.autoload.pop();
						if (card === undefined) {
							if (this.data.loadFailCallback) {
								this.data.loadFailCallback();
								card = this.data.autoload.pop();
								// console.log('loadFailCallback', card);
							}
						}
						if (card) {
							//console.log('autoload', card);
							this.setFront(card);
						}
					}
					this.mask.style.visibility = 'hidden';
					this.animateFlip(this.data.filpCallback);
				}
				this.data.isTip = false;
				this.data.isFlip = false;
				//////////////////deal
			}
		},
		setFront: function(front) {
			front.div.div.style.transform = 'rotateY(180deg)';
			//if (this.front) this.div.removeChild(this.front.div.div);
			this.div.appendChild(front.div.div);
			this.front = front;
		},
		unsetFront: function() {
			if (this.front)
				this.div.removeChild(this.front.div.div);
		}
	};
	Control.getCardUnit = function(front) {
		return new CardUnit();
	}
})();


/* (function() {
	function DrawPileDiv(num) {
		this.num = 0;
		this.setNum(num);
		this.backDivs = [];//perspective(1400px)
	}
	DrawPileDiv.prototype = {
		setNum: function(num) {
			var dn = num - this.num;
			if (dn > 0) {
				// var back = Control.getBack();
				// this.backDivs.push(back);
				var cardunit = Control.getCardUnit(GameObject.AllCards['agingCard'][5].div.div);
			}
		}
	};
	Control.getDrawPileDiv = function() {
		return new DrawPileDiv(1);
	}
})(); */


Control.Animation = {};

Control.Animation.CardsDivMove = function(cards, pos, aim, callback) {
	//console.log(cards);
	var item = cards.div;
	GameObject.Mask.show(false); 
	//console.log(pos[0], pos[1], aim[0],aim[1]);
	var speed = 40;
	var pos = pos.slice();
	var inter = setInterval(function() {
		speed += 2;
		var r = Math.distance(pos, aim);
		if (r < speed) {
			item.setPos(aim[0], aim[1]);
			clearInterval(inter);
			if (callback) callback();
			// console.log('stop');
		} else {
			var dx = aim[0] - pos[0];
			var dy = aim[1] - pos[1];
			var fx = dx>0?1:-1, ux = dx*fx;
			var fy = dy>0?1:-1, uy = dy*fy;
			var tx = Math.min(ux/r*speed, ux)*fx;
			var ty = Math.min(uy/r*speed, uy)*fy;
			pos[0] += tx;
			pos[1] += ty;
			item.setPos(pos[0], pos[1]);
		}
	}, 1000/60);
}
Control.Animation.CardDivFlip = function(card, isRotate, callback) {
	item = card.div;
	var aim = 0, cur = item.rotate, speed=15;
	if (isRotate === true) aim = 180;
	else if (isRotate === false) aim = 360;
	else aim = isRotate;
	var inter = setInterval(function() {
		var dr = aim - cur;
		var fr = dr>0?1:-1;
		if (dr*fr < speed) {
			item.setRotate(isRotate);
			clearInterval(inter);
			if (callback) callback();
		} else {
			cur += fr*speed;
			item.setRotate(cur);
		}
	}, 1000/60);
}
