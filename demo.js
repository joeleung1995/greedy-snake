// 贪吃蛇实现思想：蛇尾跟着蛇头走

(function () {

	var li = null,				//存放地图的每一个li节点
		len = 3,				//记录蛇身长度，包括蛇头在内
		snakeArr = [],			//储存组成蛇节点li的一个数组
		index = 0,				//用于蛇身跟着蛇头运动，记录第几节蛇身
		location = 428,			//初始化蛇的位置
		direction = "right",	//蛇运动的方向，默认是往右边走
		foodLocation = null,	//记录食物的位置
		lock = true,			//防止多次按键盘造成方向混乱的锁
		btnLock = true,			//防止多次点击造成速度混乱的锁
		timer = null;			//记录setTimeout的timer

	init();

	// 初始化
	function init () {
		var startBtn = document.getElementsByClassName("btn-start")[0],
			pauseBtn = document.getElementsByClassName("btn-pause")[0],
			ul = document.getElementsByTagName("ul")[0];

		//用于点击重新开始时，将数据复原
		ul.innerHTML = "";
		location = 428;
		snakeArr = [];
		len = 3;
		direction = "right";

		// 渲染画面
		rander();

		// 点击开始
		startBtn.onclick = function () {
			if (btnLock) { //防止因为多次点击开始造成速度混乱
				moveInterval();
				btnLock = false;
			}
		}

		// 点击暂停
		pauseBtn.onclick = function () {
			pause();
			btnLock = true;
		}

		// 监听键盘事件
		window.onkeydown = function (e) {
			switch (e.code) {
				case "ArrowUp":
					if (direction != "down" && lock) {//防止因为在往下走时，蛇头也能往上走（那就走到蛇身上去了，就会出现bug）
						direction = "up";
						lock = false;//防止因为多次按键盘造成方向混乱
					}
					break;
				case "ArrowDown":
					if (direction != "up" && lock) {
						direction = "down";
						lock = false;
					}
					break;
				case "ArrowLeft":
					if (direction != "right" && lock) {
						direction = "left";
						lock = false;
					}
					break;
				case "ArrowRight":
					if (direction != "left" && lock) {
						direction = "right";
						lock = false;
					}
					break;
			}
		}

	}

	// 渲染页面
	function rander () {
		var ul = document.getElementsByTagName("ul")[0],
			frag = document.createDocumentFragment();//文档碎片优化

		for (let i = 0; i < 900; i++) {
			let li = document.createElement('li');
			frag.appendChild(li);
		}

		ul.appendChild(frag);

		li = Array.prototype.slice.call(document.getElementsByTagName("li"));//获得数组类型的li节点集合

		// 初始化蛇
		for (let i = 428; i > 425; i--) {
			li[i].className = "snake";
			snakeArr.push(li[i]);//往标记中添加蛇的节点记录
		}

		// 刷一个食物
		food();

		btnLock = true;
	}

	// 刷新食物位置
	function food () {
		var location = Math.floor( Math.random() * 900 )

		if (li[location].className !== "snake") {//防止食物在蛇上出现
			li[location].className = "food";
			foodLocation = location;
		} else {
			food()
		}
	}

	function move (nextLocation) {
		var current = snakeArr[index],
			prevLocation = li.indexOf(current);//记录现在移动的节点的位置，并在后面作为参数传给后面的蛇身，另其移动到该位置，实现蛇尾跟着蛇头走
		
		if (nextLocation < 0 || nextLocation > 900) {//蛇头碰到上下边界
			end();
		} else if (li[nextLocation].className == "snake") {//蛇头碰到蛇身
			end();
		} else if (nextLocation % 30 == 0 && direction == "right" && prevLocation % 30 > 15 ) {//蛇头碰到右边界，同时处理了一个bug
			end();
		} else if ( (nextLocation + 1) % 30 == 0 && direction == "left" && prevLocation  % 30 < 15 ) {//蛇头碰到左边界，同时处理了一个bug
			end();
		} else if (nextLocation == foodLocation) {//蛇头碰到食物，将食物位置的li变为蛇头，从而令蛇长度加1
			snakeArr.unshift(li[foodLocation]);
			len ++ ;
			li[foodLocation].className = "snake";
			food();
		} else {//蛇普通移动
			snakeArr[index].className = ""
			snakeArr[index] = li[nextLocation];
			li[nextLocation].className = "snake"

			index++

			if (index < len) {
				move(prevLocation);//蛇尾跟着蛇头走
			} else {
				index = 0;//蛇已经走完一格，重置蛇身移动的标记
			}			
		}
	}

	//暂停
	function pause () {
		clearInterval(timer);
		timer = null;
	}

	//结束（输了）
	function end () {
		pause();
		confirm("You lost, play again?");
		init();
	}

	function moveInterval () {		
		var speed = speed < 50 ? 100 : 500 - len * 20; //随着蛇身越来越长，蛇运动的速度越来越快
		timer = setTimeout( () => {
			switch (direction) {//根据按键方向改变蛇运动的方向
				case "right":
					location += 1;
					break;
				case "left":
					location -= 1;
					break;
				case "up":
					location -= 30;
					break;
				case "down":
					location += 30;
					break;
			}	
			moveInterval()
			move(location);
			lock = true;
		}, speed)
	}

})()