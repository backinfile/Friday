
var Resources = {loaded:false};

Resources.Load = function(callback) {
	if (Resources.loaded) {
		if (callback) callback();
	} else {
		var cnt = 0, num = 0;
		function loaddone() {
			num++;
			return function() {
				cnt++;
				if (cnt >= num) {
					Resources.loaded = true;
					if (callback) callback();
				}
			}
		}
		Resources.LoadImage(loaddone());
	}
}

Resources.SkillDescription = {
	LIFE: v => '生命值'+(v>0?'+':'')+v,
	STOP: v => '免费抽牌数置为0',
	MAX2ZERO: v => '战力最高的牌的战力置为0',
	DESTORY: v => '摧毁一张牌',
	EXCHANGE: v => '交换至多'+v+'张牌',
	DOUBLE: v => '使1张牌的攻击力加倍',
	COPY: v => '复制1张牌的战力',
	CARD: v => '抽'+v+'张牌',
	STEP: v => '当前冒险的阶段-1',
	PLACE: v => '将1张牌放到牌库底部',
	VISION: v => '查看牌库顶至多三张牌, 你可以弃掉其中一张，然后将未弃掉的以任意次数放回牌库顶'
};
Resources.SkillShortcut = {
	LIFE: v => '生命值'+(v>0?'+':'')+v,
	STOP: v => '停止免费抽牌',
	MAX2ZERO: v => '最大战力为0',
	DESTORY: v => '摧毁:1',
	EXCHANGE: v => '交换:'+v+'',
	DOUBLE: v => '加倍:1',
	COPY: v => '复制:1',
	CARD: v => '卡牌'+(v>0?'+':'')+v,
	STEP: v => '阶段-1',
	PLACE: v => '埋葬:'+v,
	VISION: v => '挑选:'+v
};
Resources.CardTypeName = {
	agingCard: ['衰老'],
	battleCard: ['战斗'],
	hazardCard: ['冒险','知识'],
	pirateCard: ['海盗']
};

Resources.Image = {
	agingCard: {path:'img/aging.jpg', size:{width:145, height:231}},
	battleCard: {path:'img/battle.jpg', size:{width:145, height:231}},
	hazardCard: {path:'img/hazard.jpg', size:{width:145, height:231}},
	pirateCard: {path:'img/pirate.jpg', size:{width:145, height:231}},
	back: {path:'img/back.jpg', size:{width:145, height:231}},
	selected: {path:'img/select.png', size:{width:145, height:231}},
};

Resources.LoadImage = function(callback) {
	var keys = Object.keys(Resources.Image);
	var cnt = 0;
	for (var i=0; i<keys.length; i++) {
		var img = new Image();
		img.onload = function() {
			cnt++;
			if (cnt >= keys.length)  {
				if (callback) callback();
			}
		}
		img.src = Resources.Image[keys[i]].path;
	}
}

Resources.CardDate = {
		// 战力 张数 销毁花费 技能
	agingCard: [
		{attack:-1, num:1, 	cost:2, skill:{}},
		{attack:-2, num:2, 	cost:2, skill:{}},
		{attack:-3, num:1, 	cost:2, skill:{}},
		{attack:0, num:1, 	cost:2, skill:{LIFE:-1}},
		{attack:0, num:1, 	cost:2, skill:{STOP:true}},
		{attack:0, num:2, 	cost:2, skill:{MAX2ZERO:true}},
	],
	battleCard: [
		{attack:2, num:1, 	cost:1, skill:{}},
		{attack:1, num:3, 	cost:1, skill:{}},
		{attack:0, num:8, 	cost:1, skill:{}},
		{attack:-1, num:5, 	cost:1, skill:{}},
		{attack:0, num:1, 	cost:1, skill:{LIFE:2}},
	],
	hazardCard: [
		{attack:3,num:1,cost:1,skill:{DESTORY:1},	aim:{white:4,green:4,yellow:7,red:11}},
		{attack:4,num:1,cost:1,skill:{DESTORY:1},	aim:{white:5,green:5,yellow:9,red:14}},
		{attack:4,num:1,cost:1,skill:{DESTORY:1},	aim:{white:5,green:5,yellow:9,red:14}},
		{attack:0,num:1,cost:1,skill:{PLACE:1},	aim:{white:1,green:0,yellow:1,red:3}},
		{attack:2,num:1,cost:1,skill:{EXCHANGE:1},	aim:{white:3,green:2,yellow:5,red:8}},
		{attack:2,num:1,cost:1,skill:{DOUBLE:1},	aim:{white:3,green:2,yellow:5,red:8}},
		{attack:3,num:1,cost:1,skill:{CARD:1},		aim:{white:4,green:4,yellow:7,red:11}},
		{attack:3,num:1,cost:1,skill:{VISION:1},	aim:{white:4,green:4,yellow:7,red:11}},
		{attack:3,num:1,cost:1,skill:{EXCHANGE:1},	aim:{white:4,green:4,yellow:7,red:11}},
		{attack:1,num:1,cost:1,skill:{LIFE:1},		aim:{white:2,green:1,yellow:3,red:6}},
		{attack:2,num:1,cost:1,skill:{DESTORY:1},	aim:{white:2,green:1,yellow:3,red:6}},
		{attack:1,num:1,cost:1,skill:{DOUBLE:1},	aim:{white:2,green:1,yellow:3,red:6}},
		{attack:2,num:1,cost:1,skill:{CARD:1},		aim:{white:3,green:2,yellow:5,red:8}},
		{attack:2,num:1,cost:1,skill:{DESTORY:1},	aim:{white:3,green:2,yellow:5,red:8}},
		{attack:2,num:1,cost:1,skill:{VISION:1},	aim:{white:3,green:2,yellow:5,red:8}},
		{attack:1,num:1,cost:1,skill:{LIFE:1},		aim:{white:2,green:1,yellow:3,red:6}},
		{attack:1,num:1,cost:1,skill:{COPY:1},		aim:{white:2,green:1,yellow:3,red:6}},
		{attack:2,num:1,cost:1,skill:{DESTORY:1},	aim:{white:2,green:1,yellow:3,red:6}},
		{attack:1,num:1,cost:1,skill:{PLACE:1},	aim:{white:2,green:1,yellow:3,red:6}},
		{attack:0,num:1,cost:1,skill:{COPY:1},		aim:{white:1,green:0,yellow:1,red:3}},
		{attack:0,num:1,cost:1,skill:{CARD:2},		aim:{white:1,green:0,yellow:1,red:3}},
		{attack:0,num:1,cost:1,skill:{CARD:2},		aim:{white:1,green:0,yellow:1,red:3}},
		{attack:1,num:1,cost:1,skill:{DESTORY:1},	aim:{white:2,green:1,yellow:3,red:6}},
		{attack:0,num:1,cost:1,skill:{LIFE:1},		aim:{white:1,green:0,yellow:1,red:3}},
		{attack:0,num:1,cost:1,skill:{STEP:-1},	aim:{white:1,green:0,yellow:1,red:3}},
		{attack:0,num:1,cost:1,skill:{DESTORY:1},	aim:{white:1,green:0,yellow:1,red:3}},
		{attack:2,num:1,cost:1,skill:{LIFE:1},		aim:{white:3,green:2,yellow:5,red:8}},
		{attack:0,num:1,cost:1,skill:{LIFE:1},		aim:{white:1,green:0,yellow:1,red:3}},
		{attack:0,num:1,cost:1,skill:{EXCHANGE:2},	aim:{white:1,green:0,yellow:1,red:3}},
		{attack:0,num:1,cost:1,skill:{EXCHANGE:2},	aim:{white:1,green:0,yellow:1,red:3}}
	],
	pirateCard: [
		{no:1,num:1,cost:0, skill:{},skillDescription:'Each Card Worth+1',aim:{white:10,red:35}},
		{no:2,num:1,cost:0, skill:{},skillDescription:'Each Card Worth+1',aim:{white:8 ,red:27}},
		{no:3,num:1,cost:0, skill:{},skillDescription:'Each Card Worth+1',aim:{white:6 ,red:19}},
		{no:4,num:1,cost:0, skill:{},skillDescription:'Each Card Worth+1',aim:{white:5 ,red:15}}
	]
};