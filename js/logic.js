

(function NumKit() {
	Math.randInt = function (min, max) {
		return Math.floor(Math.random() * (max - min + 1) + min);
	}
	Math.distance = function (posa, posb) {
		var dx = posa[0] - posb[0];
		var dy = posa[1] - posb[1];
		return Math.sqrt(dx * dx + dy * dy);
	}
	if (!Array.prototype.shuffle) {
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
	}
})();

var Game = {};

Game.Init = function () {
	Game.Width = window.innerWidth;
	Game.Height = window.innerHeight;
	Game.CardWidth = 151;
	Game.CardHeight = 273;
	Game.EventPos = [840, 70];
	Game.CardsPos = [80, 70];
	Game.DrawPilePos = [100, 50];
	Game.MessageTipPos = [570, 340];
	Game.ButtonsPos = [Game.EventPos[0] -30, Game.EventPos[1] + 250];
	Resources.Load(function () {
		GameObject.Init();
		
		Game.DataShow = Control.getDataShow(Game.EventPos[0]+200, Game.EventPos[1]);
		// GameObject.HandsDiv Control.getCardUnit
		Game.CardUnit = Control.getCardUnit();	// 用来表示抽牌堆的顶部
		
		Game.hazardPile = GameObject.AllCards['hazardCard'].slice(0,5).shuffle();
		Game.drawPile = GameObject.AllCards['battleCard'].slice(4,8);//.shuffle();
		Game.drawPile = Game.drawPile.concat(GameObject.AllCards['hazardCard'].slice(15,20)).shuffle();
		Game.agingPile = GameObject.AllCards['agingCard'].slice().shuffle();
		Game.discardPile = [];			// 丢弃的冒险牌
		Game.discardBattlePile = [];	// player丢弃的牌
		Game.destroyedPile = [];		// 摧毁的牌
		Game.hands = [];				// 手牌

		Game.cardsTmp = GameObject.getCardWarp();  		// 用来移动抽过来的卡的卡套
		Game.cardsMiddle = [GameObject.getCardWarp(),
				GameObject.getCardWarp()]; 				// 用来冒险牌二选一的卡套
		Game.currentMiddle = null;						// 当前选中的冒险牌的卡套
		Game.curHazardCard = null;						// 当前选中的冒险牌
		Game.selected = null; 							// 当前选择的卡
		Game.Data = {};
		Game.Data.health = 20;
		Game.Data.healthMax = 24;
		Game.Data.freeChoose = 0;		// 总免费次数
		Game.Data.freeChoosed = 0;		// 已用免费次数
		Game.Data.curAttack = 0;		// 当前攻击力
		Game.Data.aimAttack = 0;		// 目标攻击力
		Game.Data.step = 0; 			// 游戏的阶段
		Game.Data.curStep = 0; 			// 当前回合的阶段
		setTimeout(function () {
			Game.Loop();
		}, 0);
	});
}

Game.Loop = function () {
	//GameObject.HandsDiv 
	console.log('loop!');
	GameObject.Mask.show(true);
	GameObject.Message.show(600, 500, '选择一张冒险卡');
	var cardsPos = [[450, 180], [750, 180]];
	var cards = [null, null];
	for (let i = 0; i < 2; i++) {
		cards[i] = Game.hazardPile.pop();
		if (!cards[i]) {
			Game.hazardPile	 = Game.discardPile.slice().shuffle();
			Game.discardPile = [];
			Game.Data.step++;
			console.log('step++');
			cards[i] = Game.hazardPile.pop();
		}
		cards[i].div.setRotate(false);
		cards[i].div.canBeSelect(true);
		Game.cardsMiddle[i].div.setLayer(101);
		Game.cardsMiddle[i].add(cards[i]);
		Game.cardsMiddle[i].div.setPos(cardsPos[i][0], cardsPos[i][1]);
		Game.cardsMiddle[i].div.show(true);
		cards[i].div.div.onclick = function () {
			// 选择第i张冒险牌，弃掉第1-i张冒险牌
			Game.currentMiddle = Game.cardsMiddle[i];
			Game.cardsMiddle[1 - i].remove(cards[1 - i]);
			Game.cardsMiddle[1 - i].div.show(false);
			var rotate = 0;
			cards[i].div.div.onclick = function flip(){
				rotate += 180;
				cards[i].div.div.onclick = null;
				Control.Animation.CardDivFlip(cards[i], rotate, function() {
					cards[i].div.div.onclick = flip;
				});
			};
			cards[1 - i].div.div.onclick = null;
			cards[i].div.canBeSelect(false);
			cards[1 - i].div.canBeSelect(false);
			Game.discardPile.push(cards[1 - i]);
			GameObject.Message.show(false);
			setTimeout(function () {
				Control.Animation.CardsDivMove(Game.cardsMiddle[i], cardsPos[i], Game.EventPos, function () {
					//GameObject.Buttons.show(true);
					Game.curHazardCard = cards[i];
					//console.log('end');
					Game.FirstCheckStates();
				});
			}, 0);
		}
		Game.tmpcard = cards[i];
	}
}

Game.FirstCheckStates = function () {
	Game.Data.freeChoose = Game.curHazardCard.data.aim.white;
	Game.Data.freeChoosed = 0;
	Game.Data.curStep = Game.Data.step;
	GameObject.Buttons.showSole(1);
	GameObject.Buttons.show(Game.ButtonsPos[0],Game.ButtonsPos[1]);
	GameObject.Buttons.onclick[1] = function() {
		// 结算时
		if (Game.selected) {
			Game.selected.div.selected(false);
			Game.selected = null;
		}
		var dAttack = Game.Data.curAttack - Game.Data.aimAttack;
		if (dAttack >= 0) {
			Game.Data.health += 1; 	// 恢复
			Game.DataUpdate();
			
			Game.discardBattlePile.push(Game.curHazardCard);
			for (let i=0; i<Game.hands.length; i++) {
				Game.hands[i].div.recover();
				Game.discardBattlePile.push(Game.hands[i]);
				GameObject.HandsDiv.remove(Game.hands[i]);
			}
			Game.currentMiddle.remove(Game.curHazardCard);
			Game.hands = [];
			Game.Loop();
		} else {
			// 结算摧毁牌时
			
			GameObject.Buttons.showSole(1, false);
			GameObject.Buttons.showSole(0, false);
			
			dAttack *= -1;
			Game.Data.health -= dAttack; 	// 受伤	
			Game.DataUpdate();	
			// GameObject.MessageTip.show(Game.MessageTipPos[0], Game.MessageTipPos[1], 
				// '选择至多消耗'+dAttack+'的牌(已选0)');
				
			var selectedCards = [];
			function CheckDestroyable() {
				var cnt = 0;
				for (let i=0; i<Game.hands.length; i++) {
					if (selectedCards[i]) {
						let card = Game.hands[i];
						cnt += card.data.cost;
					}
				}
				GameObject.Buttons.showSole(2, cnt <= dAttack);
				GameObject.MessageTip.show(Game.MessageTipPos[0], Game.MessageTipPos[1], 
					'选择至多消耗'+dAttack+'的牌(已选'+cnt+')');
			}
			CheckDestroyable();
			for (let i=0; i<Game.hands.length; i++) {
				// console.log('deal', i);
				let card = Game.hands[i];
				selectedCards[i] = false;
				card.onDestroyClickDown =  function() {
					card.div.selected(true);
					selectedCards[i] = true;
					card.div.div.onclick = card.onDestroyClickUp;
					CheckDestroyable();
				}
				card.onDestroyClickUp = function() {
					card.div.selected(false);
					selectedCards[i] = false;
					card.div.div.onclick = card.onDestroyClickDown;
					CheckDestroyable();
				}
				card.div.div.onclick = card.onDestroyClickDown;
			}
			GameObject.Buttons.onclick[2] = function() {
				GameObject.MessageTip.show(false);
				GameObject.Buttons.show([]);
				
				// 摧毁卡牌
				for (let i=0; i<Game.hands.length; i++) {
					if (selectedCards[i]) {
						var card = Game.hands[i];
						card.div.selected(false);
						GameObject.HandsDiv.remove(card);
						Game.destroyedPile.push(card);
					}
				}
				
				// 摧毁完毕 游戏继续
				Game.discardBattlePile.push(Game.curHazardCard);
				for (let i=0; i<Game.hands.length; i++) {
					if (!selectedCards[i]) {
						var card = Game.hands[i];
						card.div.recover();
						Game.discardBattlePile.push(card);
						GameObject.HandsDiv.remove(card);
					}
				}
				Game.currentMiddle.remove(Game.curHazardCard);
				Game.hands = [];
				Game.Loop();
			}
		}
	}
	Game.LoopCheckStates();
}

Game.DataUpdate = function() {
	Game.DataShow.showHealth(Game.Data.health, Game.Data.healthMax);
	Game.DataShow.showAttack(Game.Data.curAttack);
	Game.DataShow.showAimAttack(Game.Data.aimAttack);
	Game.DataShow.showFreeChoose(Game.Data.freeChoose);
	Game.DataShow.showStep(Game.Data.curStep);
}

Game.LoopCheckStates = function() {
	
	// 按钮处理
	if (Game.selected){ //&& Game.selected.data.skill.size()>0) {
		GameObject.Buttons.showSole(0, true);
		var skill = Game.selected.data.skill;
		var card = Game.selected;
		GameObject.Buttons.onclick[0] = function() {
			// 发动技能时
			if (skill.LIFE) {
				Game.Data.health += skill.LIFE;
				if (Game.Data.health > Game.Data.healthMax)
					Game.Data.health = Game.Data.healthMax;
			}
			if (skill.STEP) {
				Game.Data.curStep--;
				if (Game.Data.curStep<0) Game.Data.curStep=0;
			}
			card.div.canBeSelect(false);
			card.div.used(true);
			card.div.selected(false);
			card.onclick = null;
			Game.selected = null;
			Game.LoopCheckStates();
		}
	} else {
		GameObject.Buttons.showSole(0, false);
	}
	
	
	
	// 数值更新
	var stepname = ['green', 'yellow', 'red'];
	var hasFreeCard = true;
	var attackCnt = 0;
	Game.Data.aimAttack = Game.curHazardCard.data.aim[stepname[Game.Data.curStep]];
	Game.hands.forEach(function(card) {
		var tmp = card.data.attack;
		card.buff.forEach(function() {});
		if (card.data.skill['STOP']) hasFreeCard = false;
		
		attackCnt += tmp;
	});
	if (Game.Data.freeChoosed >= Game.Data.freeChoose) hasFreeCard = false;
	
	Game.Data.curAttack = attackCnt;
	Game.DataUpdate();
	
	
	function CardUnitClick() {
		// 抽牌时
		Game.Data.freeChoosed++;
		if (!hasFreeCard) Game.Data.health -= 1;
		
		var card = Game.CardUnit.front;
		Game.CardUnit.unsetFront();
		Game.CardUnit.flip();
		
		Game.cardsTmp.add(card);
		Game.cardsTmp.div.setPos(Game.DrawPilePos[0],Game.DrawPilePos[1]);
		Game.cardsTmp.div.show(true);
		Game.cardsTmp.div.setLayer(80);
		
		
		function MoveCard() {
			// 卡牌移动
			GameObject.HandsDiv.animatePush(function() {
				Control.Animation.CardsDivMove(Game.cardsTmp, Game.DrawPilePos, 
					GameObject.HandsDiv.getPushedPos(), function() {
						
					
					// 处理抽到的卡
					card.buff = [];
					card.div.used(false);
					if (card.data.skill.size()>0) {
						card.div.canBeSelect(true);
						card.onclick = function () {
							console.log('click');
							if (Game.selected) {
								Game.selected.div.div.onclick = Game.selected.onclick;
								Game.selected.div.selected(false);
							}
							Game.selected = card;
							card.div.selected(true);
							card.div.div.onclick = function() {
								console.log('false click');
								if (Game.selected) {
									Game.selected.div.selected(false);
									Game.selected = null;
								}
								card.div.div.onclick = card.onclick;
								Game.LoopCheckStates();
							}
							Game.LoopCheckStates();
						}
						card.div.div.onclick = card.onclick;
						console.log('give click');
						Game.card = card;
					} else {
						card.div.canBeSelect(false);
						card.div.div.onclick = null;
					}
					
					Game.cardsTmp.remove(card);
					Game.cardsTmp.div.show(false);
					Game.hands.push(card);
					GameObject.HandsDiv.push(card);
					
					Game.LoopCheckStates();
				});
			});
		}
		
		card.div.recover();
		if (card.type == 'hazardCard') {
			//card.div.setRotate(true);
			//card.div.setLayer(90);
			Control.Animation.CardDivFlip(card, true, function() {
				console.log('animateRotate done!');
				setTimeout(MoveCard,200);
			});
		} else {
			setTimeout(MoveCard,200);
		}
	}
	
	Game.CardUnit.setTip(true, true, hasFreeCard?'免费':'生命值-1', null, CardUnitClick, Game.drawPile, function() {
		//用完一次牌堆
		console.log('aging....');
		var card = Game.agingPile.pop();
		if (card) Game.discardBattlePile.push(card);
		for (let i=0; i<Game.discardBattlePile.length; i++) {
			var card = Game.discardBattlePile[i];
			card.div.setRotate(false);
		}
		Game.drawPile = Game.discardBattlePile.slice().shuffle();
		Game.discardBattlePile = [];
		Game.CardUnit.data.autoload = Game.drawPile;
	});
}