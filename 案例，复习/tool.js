//跨浏览器获取窗口大小，jquery中为 pagX
function getInner(){
	if(typeof window.innerWidth != 'undefined'){
		// for FF  chrome
		return{
		width:window.innerWidth,
		height:window.innerHeight
		}
	}else{
		// for IE  chrome
		return{
		width:document.documentElement.clientWidth,
		height:document.documentElement.clientHeight
		}
	}
};
function getCharCode(evt){
	var e =evt ||window.event; 
	if(typeof e.charCode == "number"){
		return e.charCode;=  
	}else return e.keyCode;
}
//跨浏览器获取style
function getStyle(element, attr) {
	var value;
	if (typeof window.getComputedStyle != 'undefined') {//W3C
		value = window.getComputedStyle(element, null)[attr];
	} else if (typeof element.currentStyle != 'undeinfed') {//IE
		value = element.currentStyle[attr];
	}
	return value;
}
//判断class是否存在
function hasClass(element,className){
	return element.className.match(new RegExp("(\\s|^)"+className+'(\\s|$)'))
}


function getEvent(e){
	return e||window.event;
}

function getScroll(){
	return{
		top:document.documentElement.scrollTop||document.body.scrollTop,
		left:document.documentElement.scrollLeft||document.body.scrollLeft
	}
};


//跨浏览器添加事件
/*function addEvent(obj, type ,fn){
	if(typeof obj.addEventListener!= 'undefined'){
		obj.addEventListener(type, fn, false);
	}
	else if(typeof obj.attachEvent!= 'undefined'){
		obj.attachEvent('on'+type,function(){
			fn.call(obj,window.event);
		});
	}
};*/

//跨浏览器绑定事件
function addEvent(obj,type,fn){
	if(typeof obj.addEventListener !='undefined'){
		obj.addEventListener(type,fn,false);
	}else {
		//创建一个保存对象的哈希表（散列表）
		if(!obj.events)obj.events = {};
		//创建一个保存对象的数组，第一次执行时执行
		if(!obj.events[type]){
			obj.events[type] = [];
		//将第一个事件保存到对象数组的第一个位置；
			if(obj['on'+type])obj.events[type][0] = fn;
		} else{
		//若存在相同注册函数进行屏蔽，不添加到计数器中
			if(addEvent.equal(obj.events[type],fn))
				return false;
		}
		//从第二个事件开始就用事件计数器来计数并保存
		obj.events[type][addEvent.ID++] = fn;
		//执行事件处理函数
		obj['on'+type]=addEvent.exec;
	}
}
addEvent.ID = 1;			//事件计数器
//执行事件处理函数
addEvent.exec = function(event){
	var e = event || addEvent.fixEvent(window.event);
	var es = this.events[e.type];
	for(var i in es){
		es[i].call(this,e);
	}
}
//判断是否有相同的注册函数
addEvent.equal =function(es,fn){
	for(var i in es){
		if(es[i] == fn)return true;
	} return false;
}
//IE常用的Event对象配对到W3C中去
addEvent.fixEvent = function(event){
	event.preventDefault=addEvent.fixEvent.preventDefault;
	event.stopPropagation = addEvent.fixEvent.stopPropagation;
	return event;
}
//IE阻止默认行为
addEvent.fixEvent.preventDefault = function(){
	this.returnValue = false;
}
//IE取消冒泡
addEvent.fixEvent.stopPropagation = function(){
	this.cancelBubble = true;
}
//跨浏览器删除事件
function removeEvent(obj,type,fn){
	if(typeof obj.removeEventListener !="undefined"){
		obj.removeEventListener(type,fn,false);
	}else {
		for(var i in obj.events[type]){
			if(obj.events[type][i] == fn)
				delete obj.events[type][i];
		}
	}
}

//阻止默认行为
function stopDefault(e){
	if(e && e.preventDefault)
		e.preventDefault();
	else
		window.event.returnValue = false;
}
//取消冒泡	
function stopPropagation(){
	if(e && e.stopPropagation)
		e.stopPropagation();
	else
		window.event.cancelBubble = true;
}
//获取‘父元素’下除空白节点以外的所有子‘元素’节点
function childNodes(obj){
	var arr = [];
	for(var i = 0; i<obj.childNodes.length; i++){
		if(obj.childNodes[i].nodeType === 3 && /^\s+$/.test(obj.childNodes[i].nodeValue)){
			continue;
		}else arr.push(obj.childNodes[i])
	}
	return arr
}



//动画效果
		function animate(ele,json,fn){
            clearInterval(ele.timer);
            //var time = 
            ele.timer = setInterval(function () {
                //定义一个开闭原则
                var bool = true;
                for(var k in json){
                    //需求:特殊属性特殊处理。if判断如果是什么属性怎么处理，如果是另外一个属性，怎么处理....
                    //如果是层级，我们这么处理（k的值为z-index）
                    if("z-index" === k){
                        //层级不是缓慢移动到最高的，而是一次性提到最好。(需求决定)
                        //事件触发瞬间，层级立刻提高到最高，不能慢慢移动到最高。
                        ele.style.zIndex = json[k];
                    //如果是透明度我们这么处理
                    }else if("opacity" === k){
                        //问题1：透明度的值是小数，所以应该*100之后计算。（兼容IE678方便计算）
                        //问题2：透明度的兼容性不好。如果想要兼容IE678，要使用filter。(*100)

                        // 先获取透明度，然后*100在取整(小数精度丢失问题)。
                        // 如果没有给opacity属性，那么默认1，*100之后值为100；
                        var leader = parseInt(getStyle(ele,k)*100) || 100;
                        var step = (parseInt(json[k]*100)-leader)/4;
                        step = step>0?Math.ceil(step):Math.floor(step);
                        leader = leader + step;
                        //直接为opacity赋值，不需要加单位px；
                            //opacity要的是0-1之间的小数，所以除以100；
                        ele.style.opacity = leader/100;
                        //兼容ie678,不需要除以100，因为filter的值为100进制。
                        ele.style.filter = "alpha(opacity="+leader+")";
                        console.log(1);
                        if(parseInt(json[k]*100)!=leader){
                            //不能清除定时器
                            bool = false;
                        }
                    //普通属性普通处理
                    }else{
                        var leader = parseInt(getStyle(ele,k)) || 0;//带有单位，需要去掉px
                        var step = (json[k]-leader)/10;

                        step = step>0?Math.ceil(step):Math.floor(step);
                        leader = leader + step;
                        ele.style[k] = leader +"px";
                        //console.log(ele)
                        //console.log(1);
                        //if(Math.abs(json[k]-leader)<=Math.abs(step)){:对小数也可以赋值
                        if(json[k]!=leader){
                            //不能清除定时器
                            bool = false;
                        }
                    }
                }
                if(bool){
                    clearInterval(ele.timer);
                    if(fn){
                       fn();
                    }
                }
            },30);
        }