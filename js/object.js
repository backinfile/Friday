
var GameObject = {};

GameObject.Card = (function() {
	function Card(type,no, data) {
		this.type = type;
		this.no = no;
		this.div = Control.newCardDiv(type, data);
		this.data = data;
	}
	Card.prototype = {
	};
	return Card;
})();



GameObject.Cards = (function() {
	function Cards() {
		this.div = Control.newCardsDiv();
		this.cardList = [];
	}
	Cards.prototype = {
		add: function(card) {
			if (this.cardList.indexOf(card)<0) {
				this.cardList.push(card);
				this.div.add(card);
			}
		},
		remove: function(card) {
			this.cardList.remove(card);
			this.div.remove(card);
		}
	}
	return Cards;
})();


GameObject.getCardWarp = function() {
	var cardsWarp = new GameObject.Cards();
	cardsWarp.div.setSize(1, 1);
	cardsWarp.div.hideBorder();
	cardsWarp.div.setPos(Game.EventPos[0], Game.EventPos[1]);
	cardsWarp.div.show(false);
	return cardsWarp;
}

GameObject.HandsDiv = (function() {
	function HandsDiv() {
		this.warps = [];
	}
	HandsDiv.prototype = {
		push: function(card) {
			var warp = GameObject.getCardWarp();
			warp.add(card);
			warp.div.show(true);
			this.warps.push(warp);
			this.flush();
		},
		remove: function(card) {
			for (var i=0; i<this.warps.length; i++) {
				var cards = this.warps[i];
				if (cards.cardList[0] === card) {
					cards.div.show(false);
					this.warps.splice(i,1);
					break;
				}
			}
			this.flush();
		},
		animateRemove: function(card, callback) {
			var index = -1;
			var cnt = 0;
			for (let i=0; i<this.warps.length; i++) {
				if (this.warps[i].cardList[0] == card) {
					index = i;
					this.warps[i].div.show(false);
					break;
				}
			}
			if (index < 0) {
				if (callback) callback();
				return;
			}
			var len = this.warps.length;
			if (len <= 0) {
				if (callback) callback();
				return;
			}
			for (let i=0; i<len; i++) {
				Control.Animation.CardsDivMove(cards, this.getPos(i+(i>index?1:0),1), 
					this.getPos(i), function() {
					cnt++;
					if (cnt >= len) {
						if (callback) callback();
					}
				});
			}
		},
		animatePush: function(callback) {
			var len = this.warps.length;
			var cnt = 0;
			if (len <= 0) {
				if (callback) callback();
				return;
			}
			for (let i=0; i<len; i++) {
				var cards = this.warps[i];
				Control.Animation.CardsDivMove(cards, this.getPos(i), this.getPos(i,1), function() {
					cnt++;
					if (cnt >= len) {
						if (callback) callback();
					}
				});
			}
		},
		flush: function() {
			for (let i=0; i<this.warps.length; i++) {
				var pos = this.getPos(i);
				this.warps[i].div.setPos(pos[0], pos[1]);
				this.warps[i].div.setLayer(i+50);
			}
		},
		getPushedPos: function() {
			return this.getPos(this.warps.length, 1);
		},
		getPos: function(i, extra=0) {
			var rightOffset = 100;
			var len = this.warps.length + extra;
			var cardWidth = 151;
			var offsetX = 120;
			var width = window.innerWidth - offsetX*2 - rightOffset;
			var cell = width/len;
			var gap = cell - cardWidth;
			if (gap > 3) {
				var gap = 3;
				var cell = cardWidth+gap;
				var width = cell*len;
				var offsetX = (window.innerWidth-width-rightOffset)/2
				return [offsetX+cell*i+gap/2, 400];
			} else {
				var offsetX = 120;
				var width = window.innerWidth - offsetX*2 - rightOffset;
				var cell = width/len;
				var gap = cell - cardWidth;
				return [offsetX+cell*i+gap/2, 400];
			}
		}
	}
	return HandsDiv;
})();


GameObject.Init = function() {
	GameObject.AllCards = {};
	var no = 0;
	Resources.CardDate.forEach(function(key) {
		GameObject.AllCards[key] = [];
		var datas = Resources.CardDate[key];
		datas.forEach(function(data) {
			for (var k=0; k<data.num; k++) {
				no++;
				var card = new GameObject.Card(key,no,data);
				GameObject.AllCards[key].push(card);
			}
		});
	});
	GameObject.Mask = Control.getMask();
	GameObject.Message = Control.getMessage();
	GameObject.MessageTip = Control.getMessage();
	GameObject.Buttons = Control.getButtons(['使用技能','结算', '确认']);
	GameObject.HandsDiv = new GameObject.HandsDiv();
	// GameObject.HandsDiv.push(GameObject.AllCards['agingCard'][0]);
}




