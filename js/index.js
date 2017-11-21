(function() {
	var Model = function(option) {
		var me = this;
		//me.svg = option.svg;
		me.title(option);
		me.tips(option);
		me.pie(option);
	}
		/**
		 * 字体
		 * @param {Object} textProperty
		 */
	Model.prototype.text = function(textProperty) {
			var me = this;
			var tipsText = document.createElementNS("http://www.w3.org/2000/svg", "text");
			tipsText.setAttribute("x", textProperty.x);
			tipsText.setAttribute("y", textProperty.y);
			tipsText.setAttribute("font-size", textProperty.fontSize);
			tipsText.setAttribute("font-family", textProperty.fontFamily);
			tipsText.setAttribute("fill",textProperty.color);
			tipsText.innerHTML = textProperty.text;
			return tipsText;
		}
		/**
		 * 绘制标题
		 */
	Model.prototype.title = function(option) {
			var me = this;
			var mainTitle = document.createElementNS("http://www.w3.org/2000/svg", "text"); //创建主标题text
			var subTitle = document.createElementNS("http://www.w3.org/2000/svg", "text"); //创建副标题text
			var mysvg = document.getElementById("my_svg");
			//var clientWidth = document.body.clientWidth;
			if(mainTitle) {
				mainTitle.innerHTML = option.title.mainTitle.text;
				mainTitle.setAttribute("x", option.title.mainTitle.x);
				mainTitle.setAttribute("y", option.title.mainTitle.y);
				mainTitle.setAttribute("font-size", option.title.mainTitle.fontSize);
				mainTitle.setAttribute("font-family", option.font);
				mainTitle.setAttribute("font-weight", option.title.mainTitle.fontWeight)
				mysvg.appendChild(mainTitle);
			}
			if(subTitle) {
				subTitle.innerHTML = option.title.subTitle.text;
				mainTitleLength = option.title.mainTitle.text.length * option.title.mainTitle.fontSize;
				subTitleLength = option.title.subTitle.text.length * option.title.subTitle.fontSize;
				subTitleX = parseFloat(option.title.mainTitle.x) + parseFloat((mainTitleLength - subTitleLength) / 2);
				subTitleY = parseFloat(option.title.mainTitle.y) + parseFloat(50);
				subTitle.setAttribute("x", subTitleX);
				subTitle.setAttribute("y", subTitleY);
				subTitle.setAttribute("font-size", option.title.subTitle.fontSize);
				subTitle.setAttribute("font-family", option.font);
				subTitle.setAttribute("fill", option.title.subTitle.fontColor);
				subTitle.setAttribute("font-weight", option.title.subTitle.fontWeight);
				mysvg.appendChild(subTitle);
			}
		}
		/**
		 * 绘制方块提示
		 * @param {Object} option
		 */
	Model.prototype.rectTips = function(rectProperty){
		var tipsRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
			tipsRect.setAttribute("x", rectProperty.x);
			tipsRect.setAttribute("y", rectProperty.y);
			tipsRect.setAttribute("rx", rectProperty.rx);
			tipsRect.setAttribute("ry", rectProperty.ry);
			tipsRect.setAttribute("width", rectProperty.width);
			tipsRect.setAttribute("height", rectProperty.height);
			tipsRect.setAttribute("fill", rectProperty.fill);
			return tipsRect;
	}
	Model.prototype.tips = function(option) {
		var me = this;
		for(var i = 0, len = option.series.data.length; i < len; i++) {
			var rectX = option.tips.rect.x;
			var rectY = option.tips.rect.y;
			var rectRx = option.tips.rect.rx;
			var rectRy = option.tips.rect.ry;
			var rectWidth = option.tips.rect.width;
			var rectHeight = option.tips.rect.height;
			var tipTextX = option.tips.tipsText.x;
			var tipTextY = option.tips.tipsText.y;
			var tipsrect = {
				"x": rectX,
				"y": parseFloat(rectY) + parseFloat(i * 50),
				"rx": rectRx,
				"ry": rectRy,
				"width": rectWidth,
				"height": rectHeight,
				"fill": option.color[i]
			};
			var tipstext = {
				"x": tipTextX,
				"y": parseFloat(tipTextY) + parseFloat(i * 50),
				"fontSize": option.tips.tipsText.fontSize,
				"fontFamily": option.font,
				"text": option.series.data[i].name

			};
			var mysvg = document.querySelector("#my_svg");
			mysvg.appendChild(me.rectTips(tipsrect));
			mysvg.appendChild(me.text(tipstext));

		}
	}
	/**
	 * 绘制圆饼
	 * @param {Object} option
	 */
	Model.prototype.pie = function(option) {
		var me = this;
		var sum = 0;
		var sumAngle = 0;
		var mysvg = document.getElementById("my_svg");
		var lastPointX, lastPointY;//扇形的末尾的点的坐标
		var saveAngle = [];//保存每个扇形角度的数组
		var isClick = []; //点击扇形的数组
		for(var i = 0, len = option.series.data.length; i < len; i++) {
			sum += parseInt(option.series.data[i].value);
			isClick[i] = 0; //每个扇形的初始状态为0
		}
		/**
		 * num是data中的元素。index是data的索引
		 */
		option.series.data.forEach(function(num, index){
			var everyPercent = parseFloat(num.value / sum);
			var angle = 360 * everyPercent;
			saveAngle[index] = angle;
			var tipTextLength, tipText, textX; 
			var d, startPointX, startPointY;
			var g = document.createElementNS("http://www.w3.org/2000/svg", "g"); 
			var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
 			var startLinePointX, startLintPointY, moddleLindePointX, moddleLinePointY, lastLinePointX, lastLinePointY;
			var pointX, pointY;//偏移之后圆心的坐标
			var centerX, centerY; //初始圆心的坐标
			if(index === 0) {
				startPointX = option.series.center[0];
				startPointY = option.series.center[1] - option.series.radius;
			} else {
				startPointX = lastPointX;
				startPointY = lastPointY;
			}
			
			sumAngle += angle;
			centerX = option.series.center[0];
			centerY = option.series.center[1];
			lastPointX = quadrant(sumAngle, startPointX, startPointY, angle, centerX, centerY).pointX;
			lastPointY = quadrant(sumAngle, startPointX, startPointY, angle, centerX, centerY).pointY;
			d = quadrant(sumAngle, startPointX, startPointY, angle, centerX, centerY).strD;
			mysvg.appendChild(g);
			var pathPie = {
				"pathD": d,
				"color": option.color[index],
				"strokeLine": option.series.strokeLine,
				"strokeWidthLine": option.series.strokeWidthLine
			}
			g.appendChild(drawPie(pathPie));
			startLinePointX = lineTips(sumAngle, angle).startPointX;
			startLinePointY = lineTips(sumAngle, angle).startPointY;
			moddleLinePointX = lineTips(sumAngle, angle).moddlePointX;
			moddleLinePointY = lineTips(sumAngle, angle).moddlePointY;
			lastLinePointX = lineTips(sumAngle, angle).lastPointX;
			lastLinePointY = lineTips(sumAngle, angle).lastPointY;
			var linetips = {
				"pointx1": startLinePointX,
				"pointy1": startLinePointY,
				"pointx2": moddleLinePointX,
				"pointy2": moddleLinePointY,
				"color": option.color[index],
				"strokeWidth": 3
			}
			g.appendChild(drawLine(linetips));
			linetips = {
				"pointx1": moddleLinePointX,
				"pointy1": moddleLinePointY,
				"pointx2": lastLinePointX,
				"pointy2": lastLinePointY,
				"color": option.color[index],
				"strokeWidth": 3
			}
			g.appendChild(drawLine(linetips));
			tipTextLength = num.name.length * option.series.fontSize;
			var halfAngle = sumAngle - angle/2;
			if(halfAngle <= 180) {
				textX = lastLinePointX - tipTextLength - 10;
			}else {
				textX = parseFloat(lastLinePointX + 10);
			}
			tipText = {
				"x": textX,
				"y": lastLinePointY + 10,
				"fontSize": option.series.fontSize,
				"fontFamily": option.font,
				"color": option.color[index],
				"text": num.name
			}
			g.appendChild(me.text(tipText));
			g.addEventListener("click", function(){
				var allG = document.querySelectorAll("g");
				for(var i = 0, len = option.series.data.length; i < len; i ++){ //判断点击的扇形处于０状态时，其他扇形是否处于１状态
					if(i === index){
						continue;
					}else{ 
						if(isClick[i] === 1){
							isClick[i] = 0;
							allG[i].removeAttribute("transform");
						}
					}
				}
				if(isClick[index] === 0){　//如果当前状态时0,添加transform属性
					var presentAngle = 0; //当前扇形以及前边扇形的角度综合
					for (var i = 0; i <=index ; i++) { //计算当前扇形以及前边扇形的角度之和
						presentAngle += saveAngle[i];
					}
					pointX = positionOffset(presentAngle, angle).pointX;
					pointY = positionOffset(presentAngle, angle).pointY;
					centerX = option.series.center[0];
					centerY = option.series.center[1];
					var str = "translate(" + (pointX - centerX) + " " + (pointY - centerY) + ")";
					this.setAttribute("transform", str);
					isClick[index] = 1;
				}else if(isClick[index] === 1){//如果当前状态时0,移除transform属性
					this.removeAttribute("transform");
					isClick[index] = 0;
				}
			});
		}); 
		/**
		 * 判断在第几象限，确定d
		 * @param {Object} sag 总的角度
		 * @param {Object} startX  起点的x坐标
		 * @param {Object} startY  起点的y坐标
		 * @param {Object} ag    所绘制扇形的角度
		 */
		function quadrant(sag, startX, startY, ag, centerX, centerY) {
			var pointX, pointY, strD;
			var radian = sag / 180 * Math.PI; //转换角度为弧度
			pointX = option.series.center[0] - option.series.radius * Math.sin(radian);
			pointY = option.series.center[1] - option.series.radius * Math.cos(radian);
			if(ag > 180) {
				strD = "M" + startX + "," + startY + " A" +
					option.series.radius + "," + option.series.radius + "," + sag + ",1,0," + pointX + "," +
					pointY + " L" + centerX + "," + centerY + " Z";
			} else {
				strD = "M" + startX + "," + startY + " A" +
					option.series.radius + "," + option.series.radius + "," + sag + ",0,0," + pointX + "," +
					pointY + " L" + centerX + "," + centerY + " Z";
			}
			return {
				pointX,
				pointY,
				strD
			};
		}
		/**
		 * 绘制饼图
		 * @param {Object} pieProperty
		 */
		function drawPie(pieProperty) {
			var everyPie = document.createElementNS("http://www.w3.org/2000/svg", "path");
			everyPie.setAttribute("d", pieProperty.pathD);
			everyPie.setAttribute("fill", pieProperty.color);
			everyPie.setAttribute("stroke", pieProperty.strokeLine);
			everyPie.setAttribute("stroke-width", pieProperty.strokeWidthLine);
			return everyPie;
		}
		/**
		 * 绘制提示线
		 * @param {Object} lineProperty
		 */
		function drawLine(lineProperty) {
			var line = document.createElementNS("http://www.w3.org/2000/svg", "line");
			line.setAttribute("x1", lineProperty.pointx1);
			line.setAttribute("y1", lineProperty.pointy1);
			line.setAttribute("x2", lineProperty.pointx2);
			line.setAttribute("y2", lineProperty.pointy2);
			line.setAttribute("stroke", lineProperty.color);
			line.setAttribute("stroke-width", lineProperty.strokeWidth);
			return line;
		}

		function lineTips(sag, ag) {
			var startPointX, startPointY, moddlePointX, moddlePointY, lastPointX, lastPointY; //提示线在扇形上边的点
			var radian = (sag - (ag / 2)) / 180 * Math.PI;
			startPointX = option.series.center[0] - option.series.radius * Math.sin(radian);
			startPointY = option.series.center[1] - option.series.radius * Math.cos(radian);
			if(radian <= (Math.PI / 2)) {
				moddlePointX = startPointX - 20;
				moddlePointY = startPointY - 20;
				lastPointX = moddlePointX - 20;
				lastPointY = moddlePointY;
			} else if(radian > (Math.PI / 2) && radian <= Math.PI) {
				moddlePointX = startPointX - 20;
				moddlePointY = parseFloat(startPointY) + parseFloat(20);
				lastPointX = moddlePointX - 20;
				lastPointY = moddlePointY;
			} else if(radian > Math.PI && 　radian <= (Math.PI * 3 / 2)) {
				moddlePointX = parseFloat(startPointX) + parseFloat(20);
				moddlePointY = parseFloat(startPointY) + parseFloat(20);
				lastPointX = parseFloat(moddlePointX) + parseFloat(20);
				lastPointY = moddlePointY;
			} else {
				moddlePointX = parseFloat(startPointX) + parseFloat(20);
				moddlePointY = startPointY - 20;
				lastPointX = parseFloat(moddlePointX) + parseFloat(20);
				lastPointY = moddlePointY;
			}
			return {
				startPointX,
				startPointY,
				moddlePointX,
				moddlePointY,
				lastPointX,
				lastPointY
			};
		}
		
		/**
		 * 偏移之后圆心坐标
		 * @param {Object} sag
		 * @param {Object} ag
		 */
		function positionOffset(sag, ag){
			var radian = (sag - (ag / 2)) / 180 * Math.PI;
			pointX = option.series.center[0] - 15 * Math.sin(radian);
			pointY = option.series.center[1] - 15 * Math.cos(radian);
			return {
				pointX,
				pointY
			}
		}
	}
	window.Pie = Model;
}())