(function($) {

  // table
  (function() {
    "use strict"

    function getButtonCells(btn) {
      var cells = btn.data('cells');
      if (!cells || !cells.length) {
        cells = [];
        switch (btn.data('type')) {
          case 'sector':
            var nums = sectors[btn.data('sector')];
            for (var i = 0, len = nums.length; i < len; i++) {
              cells.push(table_nums[nums[i]]);
            }
            return cells;
            break;
          case 'num':
          default:
            var nums = String(btn.data('num')).split(',');
            for (var i = 0, len = nums.length; i < len; i++) {
              cells.push(table_nums[nums[i]]);
            }
            btn.data('cells', cells)
            return btn.data('cells');
            break;
        }
      }
      return cells;
    };

    // props
    var active = true,
      selectors = {
        roulette : '.roulette',
        num : '.num',
        sector : '.sector',
        table_btns : '.controlls .btn'
      },
      classes = {
        red : 'red',
        black : 'black',
        green : 'green',
        hover : 'hover'
      },
      numbers = {
        red : [],
        black : [],
        green : []
      },
      sectors = {
        '1' : [], // 1st row
        '2' : [], // 2nd row
        '3' : [], // 3rd row
        '4' : [], // 1st 12
        '5' : [], // 2nd 12
        '6' : [], // 3rd 12
        '7' : [], // 1 to 18
        '8' : [], // EVEN
        '9' : [], // RED
        '10' : [], // BLACK
        '11' : [], // ODD
        '12' : [], // 19 to 36
      },
      table_nums = {},
      table_sectors = {};

    // init
    $(selectors.num).each(function() {
      var $this = $(this),
        color,
        num = Number($this.text());
      // add to instances array
      table_nums[num] = $this;
      // add to colors array
      for (var color in numbers) {
        if ($this.hasClass(classes[color])) {
          numbers[color].push(num);
          $this.data('color', color);
        }
      }
    })

    $(selectors.sector).each(function() {
      var $this = $(this),
        color;
      if ($this.hasClass(classes.red)) {
        color = 'red';
      } else if ($this.hasClass(classes.black)) {
        color = 'black';
      } else {
        color = 'sector';
      }
      $this.data('color', color);
      table_sectors[$this.data('sector')] = $this;
    });

    // sort numbers
    for (var color in numbers) {
      numbers[color].sort(function(a, b) { return a - b; });
    }

    // populate sectors
    for (var i = 1; i <= 36; i++) {
      // 1st row, 2nd row, 3rd row
      switch (i%3) {
        case 0:
          sectors['1'].push(i);
          break;
        case 1:
          sectors['3'].push(i);
          break;
        case 2:
          sectors['2'].push(i);
          break;
      }

      // 1st 12, 2nd 12, 3rd 12
      if (i <= 12) {
        sectors['4'].push(i);
      } else if (i <= 24) {
        sectors['5'].push(i);
      } else {
        sectors['6'].push(i);
      }

      // 1 to 18, 19 to 36
      if (i <= 18) {
        sectors['7'].push(i);
      } else {
        sectors['12'].push(i);
      }

      // ODD, EVEN
      if (i%2) {
        sectors['11'].push(i);
      } else {
        sectors['8'].push(i);
      }

      if (numbers.red.indexOf(i) != -1) {
        sectors['9'].push(i);
      } else if (numbers.black.indexOf(i) != -1) {
        sectors['10'].push(i);
      }
    }

    // buttons
    var table_btns = $(selectors.table_btns).hover(
      function() {
        hovering=1;
        if (active) {
          var $this = $(this),
            cells = getButtonCells($this);
          for (var i = 0, len = cells.length; i < len; i++) {
            cells[i].addClass(classes.hover);
          }
          var sector = $this.data('sector');
          if (sector) {
            table_sectors[sector].addClass(classes.hover);
          }
        }
      },
      function() {
        hovering=0;
        var $this = $(this),
          cells = getButtonCells($this);
        for (var i = 0, len = cells.length; i < len; i++) {
          cells[i].removeClass(classes.hover);
        }
        var sector = $this.data('sector');
        if (sector) {
          table_sectors[sector].removeClass(classes.hover);
        }
      }
    ).mousedown(function(e) {
      var numbers=[];
      if(typeof $(this).data('sector') != 'undefined'){
        console.log("SECTOR "+$(this).data('sector'));

        if(e.button==2)ChangeBet(36+$(this).data('sector'),-1);
        else ChangeBet(36+$(this).data('sector'),+1);
      }
      else{
        numbers=$(this).data('num');

        if(typeof numbers.length ==='undefined')numbers=[numbers];
        else numbers=numbers.split(',');

        if(e.button==2)for(var i=0;i<numbers.length;i++)ChangeBet(numbers[i],-1);
        else for(var i=0;i<numbers.length;i++)ChangeBet(numbers[i],+1);
      }
    });
  })();

  document.oncontextmenu = function() {if(hovering)return false;};

})(jQuery);


var squares=new Array(48);
var divs=document.getElementsByTagName("div");
for(var i=0;i<divs.length;i++){
  var attr=divs[i].getAttribute("data-num");
  if(attr==null){
    attr=divs[i].getAttribute("data-sector");
    if(attr==null)continue;
    var index=36+parseInt(attr);

    var rekt=divs[i].getBoundingClientRect();
    squares[index]=new Array(2);
    squares[index][1]=rekt.top+10;
    squares[index][0]=rekt.left+16;
  }else{
    if(attr.indexOf(',')!=-1)continue;
    var rekt=divs[i].getBoundingClientRect();
    squares[attr]=new Array(2);
    squares[attr][1]=rekt.top+10;
    squares[attr][0]=rekt.left+16;
  }
}

function UpdateBets(){
  var betdiv=document.getElementById("bets");
  betdiv.innerHTML='';
  for(var i=37;i<bets.length;i++)if(bets[i]>0)betdiv.innerHTML+=sectors[i-37]+": "+(bets[i]*CurrentTier).toFixed(2)+"<br>";
  for(var i=0;i<37;i++)if(bets[i]>0)betdiv.innerHTML+="Number "+i+": "+(bets[i]*CurrentTier).toFixed(2)+"<br>";
}

function Reset(){
  for(var i=0;i<bets.length;i++){
    bets[i]=0;
    if(chips[i]!=null)for(var j=0;chips[i].length>0;j++)document.body.removeChild(chips[i].pop());
  }
  balance=1;

  UpdateBets();
  UpdateBalance();
}

function TotalBets(){
  var r=0;
  for(var i=0;i<bets.length;i++)r+=bets[i];
  return r;
}

function rInt(min,max){
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

var chips=new Array(48);

function ChangeBet(id,amount){
  if(amount>0&&TotalBets()==50){
    //maybe some beep
    return;
  }

  if(amount>0){
    var img = document.createElement('img');
    img.src="https://image.flaticon.com/icons/png/128/138/138528.png";
    img.style.zIndex="0";
    img.style.position="absolute";

    var rX=rInt(-16,16);
    var rY=rInt(-16,16);

    img.style.left=(squares[id][0]+rX)+"px";
    img.style.top=(squares[id][1]+rY)+"px";

    img.style.width="20px";
    img.style.pointerEvents="none";

    document.body.appendChild(img);

    if(chips[id]==null)chips[id]=new Array(0);
    chips[id].push(img);
  }if(amount<0&&chips[id]!=null&&chips[id].length>0)document.body.removeChild(chips[id].pop());

  bets[id]+=amount;
  if(bets[id]<0)bets[id]=0;
  UpdateBets();
  UpdateBalance();
}

function UpdateBalance(){
  var e=document.getElementById("balance");
  e.innerHTML="Balance: "+balance.toFixed(2)+" ETH";
  var tb=TotalBets();
  if(tb>0)e.innerHTML+=" ("+(tb*CurrentTier).toFixed(2)+")";
}

function Place(){
  var bet=0;
  for(var i=0;i<bets.length;i++)if(bets[i]!=0)bet+=bets[i];
  bet*=CurrentTier;

  if(bet>balance){
    var betdiv=document.getElementById("result");
    betdiv.innerHTML="Insufficient balance!";
    return;
  }

  var result=Math.floor(Math.random()*37);

  var win=0;
  if(bets[result]!=0)win+=bets[result]*36;
  for(var i=37;i<bets.length;i++)if(bets[i]!=0)win+=bets[i]*sectormultipliers[i-37][result];

  win*=CurrentTier;
  win-=bet;

  console.log("BET: "+bet+" WIN: "+win);

  var betdiv=document.getElementById("result");
  if(win>=bet)betdiv.innerHTML="Lucky number: "+result+" you won "+win.toFixed(2)+" ETH!";
  else betdiv.innerHTML="Lucky number: "+result+" you lost "+win.toFixed(2)+" ETH!";

  balance+=win;
  UpdateBalance();
}

var balance=1;

var CurrentTier=0.01;

var tiers=[
  0.0001,
  0.0002,
  0.001,
  0.002,
  0.01,
  0.02
];

var sectors=[
  "3rd column",
  "2nd column",
  "1st column",
  "1st 12",
  "2nd 12",
  "3rd 12",
  "1 to 18",
  "Even",
  "Red",
  "Black",
  "Odd",
  "19 to 36"
];

var hovering=0;
var bets=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];

var sectormultipliers=[
  [0,0,0,3,0,0,3,0,0,3,0,0,3,0,0,3,0,0,3,0,0,3,0,0,3,0,0,3,0,0,3,0,0,3,0,0,3],//3rd column
  [0,0,3,0,0,3,0,0,3,0,0,3,0,0,3,0,0,3,0,0,3,0,0,3,0,0,3,0,0,3,0,0,3,0,0,3,0],//2nd column
  [0,3,0,0,3,0,0,3,0,0,3,0,0,3,0,0,3,0,0,3,0,0,3,0,0,3,0,0,3,0,0,3,0,0,3,0,0],//1st column
  [0,3,3,3,3,3,3,3,3,3,3,3,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],//1st 12
  [0,0,0,0,0,0,0,0,0,0,0,0,0,3,3,3,3,3,3,3,3,3,3,3,3,0,0,0,0,0,0,0,0,0,0,0,0],//2nd 12
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,3,3,3,3,3,3,3,3,3,3,3],//3rd 12
  [0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],//1 to 18
  [0,0,2,0,2,0,2,0,2,0,2,0,2,0,2,0,2,0,2,0,2,0,2,0,2,0,2,0,2,0,2,0,2,0,2,0,2],//even
  [0,2,0,2,0,2,0,2,0,2,0,0,2,0,2,0,2,0,2,2,0,2,0,2,0,2,0,2,0,0,2,0,2,0,2,0,2],//Red
  [0,0,2,0,2,0,2,0,2,0,2,2,0,2,0,2,0,2,0,0,2,0,2,0,2,0,2,0,2,2,0,2,0,2,0,2,0],//Black
  [0,2,0,2,0,2,0,2,0,2,0,2,0,2,0,2,0,2,0,2,0,2,0,2,0,2,0,2,0,2,0,2,0,2,0,2,0],//odd
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2] //19 to 36
];
