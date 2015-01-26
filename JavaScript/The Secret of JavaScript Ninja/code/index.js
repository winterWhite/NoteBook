

//由于Opera不支持console.log方法，跨浏览器的log方法

function log() {
	try{
		console.log.apply(cosole, arguments);
	}
	catch(e) {
		try{
			opera.postError.apply(opera, arguments);
		}
		catch(e) {
			alert(Array.prototype.join.call( arguments, " "));
		}
	}
}

//test方法之assert

function assert(value, desc) {
	var li = document.createElement("li");
	li.className = value ? "pass" : "fail";
	li.appendChild(document.createTextNode(desc));
	document.getElementById("results").appendChild(li);
	// if(!value) {
	// 	li.parentNode.parentNode.className = "fail";
	// }
	// return li;
}

//asynchronous test

// (function() {
// 	var queue = [], paused = false, results;
// 	this.test = function(name, fn) {
// 		queue.push(function() {
// 			results = document.getElementById("results");
// 			results = assert(true, name).appendChild(document.createElement("ul"));
// 			fn();
// 		});
// 		runTest();
// 	};

// 	this.pause = function() {
// 		paused = true;
// 	};

// 	this.resume = function() {
// 		paused = false;
// 		setTimeout(runTest, 1);
// 	};

// 	function runTest() {
// 		if (!paused && queue.length) {
// 			queue.shift()();
// 			if (!paused) {
// 				resume();
// 			}  
// 		}
// 	}

// 	this.assert = function assert(value, desc) {
// 		var li = document.createElement("li");
// 		li.className = value ? "pass" : "fail";
// 		li.appendChild(document.createTextNode(desc));
// 		results.appendChild(li);
// 		if (!value) {
// 			li.parentNode.parentNode.className = "fail";
// 		}
// 		return li;
// 	};

// })();

//函数的声明
// function isNimble() {
// 	return true;
// }

// assert(typeof window.isNimble === 'function', "isNimble() defined!");
// assert(isNimble.name === 'isNimble', "isNimble() has a name!");

// var canFly = function() {return true;}

// assert(typeof window.canFly === 'function', "canFly() defined!");
// assert(canFly.name === '', "canFly() has no name!");

// window.isDeadly = function() { return true;}

// assert(typeof window.isDeadly === 'function', "isDeadly() defined!");

// function outer() {
// 	assert(typeof inner === 'function', "inner() in scope before declared");

// 	function inner() {}

// 	assert(typeof inner === 'function', "inner() in scope after declared");
// 	assert(window.inner === undefined, "inner() not in gloable space");
// }

// outer();

// assert(window.inner === undefined, "inner() still not in gloable space");

//检验变量作用范围
// function outer() {
// 	// assert(typeof outer === 'function', "outer is in scope");
// 	// assert(typeof inner === 'function', "inner is in scope");
// 	// assert(typeof a === 'number', "a is in scope");
// 	// assert(typeof b === 'number', "b is in scope");
// 	// assert(typeof c === 'number', "c is in scope");
// 	var a = 1;
// 	// assert(typeof outer === 'function', "outer is in scope");
// 	// assert(typeof inner === 'function', "inner is in scope");
// 	// assert(typeof a === 'number', "a is in scope");
// 	// assert(typeof b === 'number', "b is in scope");
// 	// assert(typeof c === 'number', "c is in scope");
// 	function inner() {}
// 	// assert(typeof outer === 'function', "outer is in scope");
// 	// assert(typeof inner === 'function', "inner is in scope");
// 	// assert(typeof a === 'number', "a is in scope");
// 	// assert(typeof b === 'number', "b is in scope");
// 	// assert(typeof c === 'number', "c is in scope");
// 	var b = 2;
// 	// assert(typeof outer === 'function', "outer is in scope");
// 	// assert(typeof inner === 'function', "inner is in scope");
// 	// assert(typeof a === 'number', "a is in scope");
// 	// assert(typeof b === 'number', "b is in scope");
// 	// assert(typeof c === 'number', "c is in scope");
// 	if(a == 1) {
// 		var c = 3;
// 		// assert(typeof outer === 'function', "outer is in scope");
// 		// assert(typeof inner === 'function', "inner is in scope");
// 		// assert(typeof a === 'number', "a is in scope");
// 		// assert(typeof b === 'number', "b is in scope");
// 		// assert(typeof c === 'number', "c is in scope");
// 	}
// 	// assert(typeof outer === 'function', "outer is in scope");
// 	// assert(typeof inner === 'function', "inner is in scope");
// 	// assert(typeof a === 'number', "a is in scope");
// 	// assert(typeof b === 'number', "b is in scope");
// 	// assert(typeof c === 'number', "c is in scope");
// }

// outer();

// assert(typeof outer === 'function', "outer is in scope");
// assert(typeof inner === 'function', "inner is in scope");
// assert(typeof a === 'number', "a is in scope");
// assert(typeof b === 'number', "b is in scope");
// assert(typeof c === 'number', "c is in scope");

//函数的执行方式
// function creep() {
// 	return this;
// }

// assert(creep() === window, "Creeping in the window");

// var sneak = creep;

// assert(sneak() === window, "Sneaking in the window");

// var ninja1 = {
// 	skulk: creep
// };

// assert(ninja1.skulk() === ninja1, "The 1st ninja is skulking");

// var ninja2 = {
// 	skulk: creep
// };

// assert(ninja2.skulk() === ninja2, "The 2nd ninja is skulking");

//构造函数
// function Ninja() {
// 	this.skulk = function() {
// 		return this;
// 	};
// }

// var ninja1 = new Ninja();
// var ninja2 = new Ninja();

// assert(ninja1.skulk() === ninja1, "The 1st ninja is skulking");
// assert(ninja2.skulk() === ninja2, "The 2nd ninja is skulking");

//apply和call调用方法

// function juggle() {
// 	var result = 0;
// 	for (var n = 0; n < arguments.length; n++) {
// 		result += arguments[n];
// 	}
// 	this.result = result;
// }

// var ninja1 = {};
// var ninja2 = {};

// juggle.apply(ninja1, [1, 2, 3, 4]);
// juggle.call(ninja2, 5, 6, 7, 8);

// assert(ninja1.result === 10, "juggle via apply");
// assert(ninja2.result === 26, "juggle via call");

//在callbacks中使用call或apply

// function forEach(list, callback) {
// 	for(var n = 0; n < list.length; n++) {
// 		callback.call(list[n], n);
// 	}
// }

// var list = ['shuriken', 'katana', 'nunchucks'];

// forEach(list, function(index) {
// 	console.log(index);
// 	console.log(this);
// 	assert(this == list[index], "Got the expected value of " + list[index]);
// });

//函数自调用

// function isPalindrome(text) {
// 	if(text.length <= 1) return true;
// 	if(text.charAt(0) != text.charAt(text.length-1)) return false;
// 	return isPalindrome(text.substr(1, text.length-2));
// }

// assert(isPalindrome("thyyht"), "thyyht is a palindrome");
// assert(isPalindrome("this"), "This is a palindrome");

// function chrip(n) {
// 	return n > 1 ? chrip(n-1) + "-chrip" : "chrip";
// }

// assert(chrip(3) == "chrip-chrip-chrip", "calling the named function comes natrually");

//对象中的函数自调

// var ninja = {
// 	chrip: function(n) {
// 		return n > 1 ? this.chrip(n-1) + "-chrip" : "chrip";
// 	}
// };

// var samurai = { chrip: ninja.chrip };

// ninja = {};

// //assert(ninja.chrip(3) == "chrip-chrip-chrip", "An object property isn't too confusing, either");

// try{
// 	assert(samurai.chrip(3) == "chrip-chrip-chrip", "An object property isn't too confusing, either");
// }catch(e) {
// 	assert(false, "can not do !");
// }

// var ninja = function myNinja() {
// 	assert(ninja == myNinja, "This function is named two things at once");
// };

// ninja();

// assert(typeof myNinja == "undefined", "But myNinja isn't defined outside of the function");

//store functions

// var store = {
// 	nextId: 1,
// 	cache: {},
// 	add: function(fn) {
// 		if(!fn.id) {
// 			fn.id = store.nextId++;
// 			return !!(store.cache[fn.id] = fn);
// 		}
// 	}
// };

// function ninja() {}

// assert(store.add(ninja), "Function was safetly added");

// assert(!store.add(ninja), "But it was only added once");

// function isPrime(value) {
// 	if(!isPrime.answers) isPrime.answers = {};
// 	if(isPrime.answers[value] != null) {
// 		return isPrime.answers[value];
// 	}
// 	var prime = value != 1;
// 	for(var i = 2; i < value; i++) {
// 		if(value % i == 0) {
// 			prime = false;
// 			break;
// 		}
// 	}
// 	return isPrime.answers[value] = prime;
// }

// assert(isPrime(5), "5 is prime");
// assert(isPrime.answers[5], "The answers is cached");

//类数组 

// var elems = {
// 	length: 0,
// 	add: function(elem) {
// 		Array.prototype.push.call(this, elem);
// 	},
// 	find: function(id) {
// 		this.add(document.getElementById(id));
// 	}
// };

// elems.find("first");
// assert(elems.length == 1 && elems[0].nodeType, "Verify that we have an elem in out stash");
// elems.find("second");
// assert(elems.length == 2 && elems[1].nodeType, "Verify that we have two elem in our stash");

function smallest(array) {
	return Math.min.apply(Math, array);
}

function largest(array) {
	return Math.max.apply(Math, array);
}

// assert(smallest([0, 1, 2, 3]) == 0, "Located the smallest value");
// assert(largest([0, 1, 2, 3]) == 3, "Located the largest value");

function merge(root) {
	for(var i = 1; i < arguments.length; i++) {
		for(var key in arguments[i]) {
			root[key] = arguments[i][key];
		}
	}
	return root;
}

var merged = merge({name: "Batou"}, {city: "Niitam"});

// assert(merged.name == "Batou", "The original name is intact");
// assert(merged.city == "Niitam", "And the city is copied over");

//方法重载的高效方法
function addMethod(object, name, fn) {
	var old = object[name];
	object[name] = function() {
		if (fn.length == arguments.length)
			return fn.apply(this, arguments)
		else if (typeof old == "function") 
			return old.apply(this, arguments);
	};
}

var ninjas = {
	values: ["Dean Edwards", "Sam Stephen", "Alex Russ"]
};

addMethod(ninjas, "find", function() {
	return this.values;
});

addMethod(ninjas, "find", function(name) {
	var ret = [];
	for (var i = 0; i < this.values.length; i++) 
		if (this.values[i].indexOf(name) == 0)
			ret.push(this.values[i]);
		return ret; 
});

addMethod(ninjas, "find", function(first, last) {
	var ret = [];
	for (var i = 0; i < this.values.length; i++)
		if (this.values[i] == (first + " " + last))
			ret.push(this.values[i]);
		return ret;
});

// assert(ninjas.find().length == 3, "Found all ninjas");
// assert(ninjas.find("Sam").length == 1, "Found ninja by First name");
// assert(ninjas.find("Dean", "Edwards").length == 1, "Found ninja by first name and last name");
// assert(ninjas.find("Alex", "X", "Russ") == null, "Found nothing");

//如果跨浏览器地识别函数

function ifFunction(fn) {
	return Object.prototype.toString.call(fn) === "[object Function]";
}

//闭包

// var outerValue = 'ninja';

// var later;

// function outerFunction() {
// 	var innerValue = 'samurai';
	
// 	function innerFunction(paramValue) {
// 		assert(outerValue, "Inner can see the ninja");
// 		assert(innerValue, "Inner can see the samurai");
// 		assert(paramValue, "Inner can see the wakizashi");
// 		assert(tooLate, "Inner can see the ronin");
// 		assert(afterinnerFunction, "Inner can see the yes");

// 		var afterinnerFunction = 'yes';
// 	}

	
// 	later = innerFunction;
// }

// assert(!tooLate, "Outer can not see the ronin");

// var tooLate = 'ronin';

// outerFunction();

// later('wakizashi');

//闭包与私有变量

// function Ninja() {
// 	var slices = 0;

// 	this.getSlices = function() {
// 		return slices;
// 	};

// 	this.slice = function() {
// 		slices++;
// 	};
// }

// var ninja = new Ninja();

// ninja.slice();

// assert(ninja.getSlices() == 1, "We're able to access to inner value");
// assert(ninja.slices == undefined, "Can't access to derectly");

//闭包与函数的异步调用方式（回调函数、计时器）

// $("#testButton").click(function() {
// 	var elem$ = $("#div");

// 	elem$.html("loading...");

// 	jQuery.ajax({
// 		url: "test.html",
// 		success: function(html) {
// 			assert(elem$, "We can see elem$, via the closure for this callback");
// 			elem$.html(html);
// 		}
// 	});
// });

// var elem = document.getElementById("div");
// var tick = 0;

// var timer = setInterval(function() {
// 	if(tick < 100) {
// 		elem.style.left = elem.style.top = tick + "px";
// 		tick++;
// 	}
// 	else {
// 		clearInterval(timer);
// 		assert(tick == 100, "Tick accessed via a closure");
// 		assert(elem, "Element also accessed via a closure");
// 		assert(timer, "Timer accessed too");
// 	}
// }, 10);

//闭包与函数上下文

// var elem = document.getElementById("testButton");

// function bind(context, name) {
// 	return function() {
// 		return context[name].apply(context, arguments);
// 	};
// }

// var button = {
// 	clicked: false,
// 	click: function() {
// 		this.clicked = true;
// 		assert(button.clicked, "The Button is clicked");
// 		console.log(this);
// 	}
// };

// elem.addEventListener("click", bind(button, "click"), false);

// Function.prototype.bind = function() {
// 	var fn = this, args = Array.prototype.slice.call(arguments), object = args.shift();

// 	return function() {
// 		return fn.apply(object, args.concat(Array.prototype.slice.call(arguments)));
// 	};
// };

// var myObject = {};

// function MyFunction() {
// 	return this == myObject;
// }

// assert(!MyFunction(), "Context is not set yet");
// var aFunction = MyFunction.bind(myObject);

// assert(aFunction(), "Context is set properly");

//闭包与函数参数预填充

// Function.prototype.curry = function() {
// 	var fn = this, args = Array.prototype.slice.call(arguments);

// 	return function() {
// 		return fn.apply(this, args.concat(Array.prototype.slice.call(arguments)));
// 	};
// };

// Function.prototype.partial = function() {
// 	var fn = this, args = Array.prototype.slice.call(arguments);

// 	return function() {
// 		var arg = 0;
// 		for (var i = 0; i < args.length && arg < arguments.length; i++) {
// 			if (args[i] === undefined) {
// 				args[i] = arguments[arg++];
// 			}
// 		}
// 		return fn.apply(this, args);
// 	};
// };

// String.prototype.csv = String.prototype.split.partial(/, \s*/);

// var results = ("Mugan, Jin, Fuu").csv();

// assert(results[0] == "Mugan" && results[1] == "Jin" && results[2] == "Fuu", "The text values were splited");

//闭包与记忆缓存

// Function.prototype.memorized = function(key) {
// 	this._values = this._values || {};

// 	return this._values[key] !== undefined ? this._values[key] : this._values[key] = this.apply(this, arguments);
// };

// function isPrime(num) {
// 	var prime = num != 1;
// 	for (var i = 2; i < num; i++) {
// 		if (num % i == 0) {
// 			prime = false;
// 			break;
// 		}
// 	}
// 	return prime;
// }

// assert(isPrime.memorized(5), "The Function is worked");
// assert(isPrime._values[5], "the answers is cached");

// Function.prototype.memorized = function(key) {
// 	this._values = this._values || {};
// 	xyz = this._values;

// 	return this._values[key] !== undefined ? this._values[key] : this._values[key] = this.apply(this, arguments); 
// };

// Function.prototype.memorize = function() {
// 	var fn = this;
// 	return function() {
// 		return fn.memorized.apply(fn, arguments);
// 	};
// };

// var isPrime = (function(num) {
// 	var prime = num != 1;
// 	for (var i = 2; i < num; i++) {
// 		if (num % i == 0) {
// 			prime = false;
// 			break;
// 		}
// 	}
// 	return prime;
// }).memorize();

// assert(isPrime.memorized(5), "The Function is worked");
//  assert(isPrime._values[5], "the answers is cached");

//立即执行的函数语法(function(){})();

// (function(v) {
// 	Object.extend(v, {
// 		href: v._getAttr,
// 		src: v._getAttr,
// 		type: v._getAttr,
// 		action: v._getAttrNode,
// 		disabled: v._flag,
// 		checked: v._flag,
// 		readonly: v._flag,
// 		multiple: v._flag,
// 		onload: v._getEv,
// 		onunload: v._getEv,
// 		onclick: v._getEv,
// 		...
// 	});
// })(Element._attributeTranslations.read.values);

//使用立即执行的函数解决闭包的动态改变变量的问题

// var oDiv = document.getElementsByClassName("div");

// for (var i = 0; i < oDiv.length; i++) (function(i) {
// 	oDiv[i].addEventListener("click", function() {
// 		alert("div" + i + "was clicked");
// 	}, false);
// })(i);

//函数原型

// function Ninja() {}

// Ninja.prototype.swingSword = function() {
// 	return true;
// };
// var ninja1 = Ninja();
// assert(ninja1 === undefined, "No instance of Ninja created");
// var ninja2 = new Ninja();
// assert(ninja2 && ninja2.swingSword(), "Instance exists and method is callcable");

// function Ninja() {
// 	this.swung = false;
// 	this.swingSword = function() {
// 		return !this.swung;
// 	};
// }

// Ninja.prototype.swingSword = function() {
// 	return this.swung;
// };

// var ninja = new Ninja();
// assert(ninja.swingSword(), "Called the instance method, not the prototype method");

// function Ninja() {
// 	this.swung = true;
// }

// var ninja = new Ninja();

// Ninja.prototype.swingSword = function() {
// 	return this.swung;
// };

// assert(ninja.swingSword(), "Method exists, even out of order");

// function Ninja() {
// 	this.swung = true;
// 	this.swingSword = function() {
// 		return !this.swung;
// 	};
// }

// var ninja = new Ninja();
// Ninja.prototype.swingSword = function() {
// 	return this.swung;
// };

// assert(!ninja.swingSword(), "Called the instance method, not the prototype method");

//实例类型检测

// function Ninja() {}

// var ninja = new Ninja();

// assert(typeof ninja == "object", "the type of ninja is object");
// assert(ninja instanceof Ninja, "instanceof identifies the constructor");
// assert(ninja.constructor == Ninja, "the ninja was created by Ninja");

//原型链

// function Person() {}

// Person.prototype.dance = function() {};

// function Ninja() {}

// Ninja.prototype = new Person();

// var ninja = new Ninja();
// assert(ninja instanceof Ninja, "ninja receives from the Ninja prototype");
// assert(ninja instanceof Person, "...and Person prototype");
// assert(ninja instanceof Object, "...and Object prototype");

