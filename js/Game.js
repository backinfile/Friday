
var Game = {};

Game.Init = function(){
	Resources.Load(function() {
		var offset = 50;
		GameObject.Init();
		Game.Hands = new GameObject.Hands();
		Game.DrawPile = new GameObject.Pile([250+offset,60]);
		Game.DiscardPile = new GameObject.Pile([450+offset, 60]);
		Game.HazardDrawCard = new GameObject.Pile([850+offset,60]);
		Game.HazardDiscardPile = new GameObject.Pile([1050+offset, 60]);
		Game.HazardSavePile = new GameObject.Pile([50+offset,60]);
		Game.AgingPile = new GameObject.Pile([650+offset, 60]);
		Game.ShowCards = new GameObject.ShowCards();
		
		Game.Buttons = new GameObject.Buttons([600, 350],['使用技能','抽牌','结算','确定']);
		Game.DataShow = new GameObject.DataShow([130, 330]);
		
		var drawPile = GameObject.AllCards.battleCard;
		var hazardPile = GameObject.AllCards.hazardCard;
		var agingPile = GameObject.AllCards.agingCard;
		drawPile.forEach(function(card) {
			card.show();
			card.setRotateY(180);
			card.setPos(Game.DrawPile.getPos());
			Game.DrawPile.cards.push(card);
		});
		hazardPile.forEach(function(card) {
			card.setRotateY(180);
			card.show();
			card.setPos(Game.HazardDrawCard.getPos());
			Game.HazardDrawCard.cards.push(card);
		});
		agingPile.forEach(function(card) {
			card.setRotateY(180);
			card.show();
			card.setPos(Game.AgingPile.getPos());
			Game.AgingPile.cards.push(card);
			//Game.Hands.cards.push(card);
		});
		
		Game.curHazardCard = null;
		Game.curSelected = [];
		Game.Data = {
			aimAttack: 0,
			curAttack: 0,
			
			health: 20,
			maxHealth: 24,
			
			step: 0,
			curStep: 0,
			
			free: 0,
			maxFree: 0,
			cost: 0
		};
		
		Game.Loop();
	});
}


Game.Loop = function() {
	var card1 = Game.HazardDrawCard.cards.pop();
	var card2 = Game.HazardDrawCard.cards.pop();
	Game.ShowCards.cards.push(card1);
	Game.ShowCards.cards.push(card2);
	
	function _selected(card, cardDiscard) {
		Game.ShowCards.mask(false);
		card.setLayer(1);
		cardDiscard.setLayer(1);
		Game.HazardDiscardPile.cards.push(cardDiscard);
		cardDiscard.onclick(null);
		card.onclick(null);
		Game.curHazardCard = card;
		Game.HazardSavePile.cards.push(card);
		Animation.turnover(cardDiscard).then(function() {
			Animation.addToPile(cardDiscard, Game.HazardDiscardPile).then(function() {
				Animation.delay(400).then(function() {
					Animation.addToPile(card, Game.HazardSavePile).then(function() {
						Game.LoopInitCheckState();
					});
				});
			});
		});
	}
	Animation.flushHands(Game.ShowCards).then(function() {
		Game.ShowCards.mask();
		return Animation.turnover(card1);
	}).then(function() {
		card1.setLayer(101);
		return Animation.turnover(card2);
	}).then(function() {
		card2.setLayer(101);
		card1.onclick(function(){_selected(card1,card2);});
		card2.onclick(function(){_selected(card2,card1);});
	});
}

Game.LoopInitCheckState = function() {
	// set
	Game.Buttons.onclick[1] = function() {
		Game.Data.health -= Game.Data.cost;
		Game.draw().then(function(){
			
		});
	}
	
	// data
	Game.Data.curStep = Game.Data.step;
	
	// show
	Game.Buttons.show(true);
	Game.Buttons.showSole(0, false);
	Game.Buttons.showSole(1, true);
	Game.Buttons.showSole(2, true);
	Game.Buttons.showSole(3, false);
	Game.Buttons.changeName(1, '抽牌(免费)');
	Game.DataShow.show(true);
	Game.DataShow.render(Game.Data);
	
	// move
	Game.LoopLoopChechState();
	Game.setSelect(function() {
		var cnt = 0;
		Game.Hands.cards.forEach(function(card, index) {
			if (Game.curSelected[index]) cnt++;
		});
		return cnt==1;
	}, function() {
		
	});
}

Game.LoopLoopChechState = function() {
	// data
	Game.Data.aimAttack = 
		Game.curHazardCard.data.aim[Resources.StepType[Game.Data.curStep]];
	Game.Data.curAttack = 1; ////////////////
	
	// show
	Game.DataShow.render(Game.Data);
}


Game.setSelect = function(pattern, callback) {
	
}

Game.draw = function() {
	return new Promise(function(resolve, reject) {
		var card = Game.DrawPile.cards.pop();
		if (!card) {
			
		}
		Game.Hands.cards.push(card);
		Animation.turnover(card).then(function() {
			return Animation.delay(300);
		}).then(function() {
			return Animation.flushHands(Game.Hands);
		}).then(function() {
			resolve(this);
		});
	});
}


