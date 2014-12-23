#新手教程——chrome 插件开发
---
![chromepic](http://gtms03.alicdn.com/tps/i3/TB197N_FVXXXXb8XFXX10_aIVXX-600-233.png)<br/>
*仅在此分享一些个人学习chrome插件开发的心得，希望给有兴趣的小伙伴们提供一点入门参考。*      
##要点归纳
* page, content scripts,background page 之间的关系及交流
* Message passing 详解
* 实践分享之kissyMap

###page, content scripts, background page三者的关系及交流    

石油队在打井之前先要分析地质结构寻找到最佳的位置才能使油井出更多的油，学习chrome插件开发则要先了解它的内容组成，简单来说chrome插件是由一个配置文件manifest.json和多个html页面，js和css文件，以及其他相关文件(如图片、音频等)组成的，关于这一点的详细介绍小伙伴们可以参考[extensions overview Architecture](https://developer.chrome.com/extensions/overview#arch)，本文不做进一步讨论。    
如果将chrome插件比作是一座房屋，那么page、content scripts和background page则是这座房屋的顶梁柱，这三者之间的信息交流使得chrome插件多种多样的功能得以实现，是学习chrome插件开发的基础之基础。
![chromepic](http://gtms04.alicdn.com/tps/i4/TB1ub1gFVXXXXccXXXXjQmyOFXX-1683-924.png)     
首先分别介绍一下这三根顶梁柱的含义：    

 
1. page     
或者也可以说成browser page、web page，即用户用浏览器打开的网页，它们一般是信息的来源和插件作用的对象。   
2. content scripts   
content即内容，这里的意思是注入网页内容的js文件，不能将其看成是插件的一部分，而应该将其看作网页的一部分。content scripts的内容可在manifest.json文件的content_scripts域中进行设置。( manifest.json是chrome插件的配置文件，这一部分内容请戳[Manifest file](https://developer.chrome.com/extensions/manifest) )        
当用户运行插件，content scirpts则会被注入到访问的web页面中，它和网页共用一个DOM结构，于是我们的插件就可以动态地操作网页的DOM结构了（操作DOM节点或者动态加载js和css）。content scripts与page的执行空间实际是隔离开来的，content scripts和page的window并不相同，这样能防止冲突，因此content scripts不能直接访问网页的js内容，包括js定义的变量和方法。 于此同时content scripts还不能访问其他content scripts的内容。   
3. background page    
可以看作是chrome插件的管家，它存在于整个插件进程中，管理插件的任务和状态，并且可以和插件中的其他页面进行沟通。
4. communication    
举个例子，我们希望插件能访问到当前页面js中自定义的某个变量，来看看我们面临的问题！首先，background page不能直接访问到网页的DOM或者js内容，它必须借助content scripts的力量。其次，content scripts无法直接访问page的js中定义的变量和方法，需要借助跨域信息传递的工具。当然，这里所说的不能都有一个形容词——直接，直着来不行那就弯着来吧！
	1. content scripts和background page的交流——sendMessage    
		chrome的API提供了一个方法：sendMessage来传递消息，使用给onMessage事件添加Listener接收消息，详见下方 Message passing内容。
    2. content scripts和web page之间的交流——postMessage    
    	由于content scripts和web page的运行环境实际上是隔离的，他们之间的消息传递则涉及到跨域问题，使用HTML5的postMessage和window的message事件可实现这两者之间的信息传递， 详见下方 Message passing内容。    
整个过程大概的描述就是，content scripts 通过操作DOM节点动态地向网页添加postMessage方法，并通过message事件接收从网页传递的信息，接着它使用chrome API的sendMessage给background传递信息，background通过onMessage接收。如此通过曲折的方式实现了网页和background page的信息传递。（
page——>content scripts——>background page ）

###Message passing

刚刚讲述了chrome插件内三个顶梁柱之间信息传递的过程，也简单提到了一些函数方法和API，怎么去用这些跨越交流障碍的神器呢？ 
  
1. postMessage    
window.postMessage 是一个用于安全的实现跨域通信的方法，当调用这个方法时会触发一个MessageEvent事件向目标窗口发送消息：    
	<pre>Otherwindow.postMessage(message,targetOrigin);
	  Otherwindow：指要接收消息的窗口
	  message:发送的信息内容
	  targetOrigin：发送目标窗口的源，若“*”表示发送给所有页面
	</pre>    
使用这个方法发送消息，而在接收消息方的window需要监听MessageEvent：
	<pre>Otherwindow.addEventListener("message",function(event){...},false);
	  event对象的属性：
		* data 接收的消息
		* origin 消息发送方窗口的源
		* source 消息发送方window对象
	</pre> 
之前举的例子，现在要用content scripts访问web page的js定义的变量，但由于这两者的执行环境是隔离开来的，因此要考虑使用跨域postMessage。也就是说web page的window对象需要向content scripts发送跨域消息，之前提到的content scripts可以访问web page的DOM结构，可以动态插入scripts：
	<pre>
		/*contentscript.js*/
		function postMeg(){
			window.postMessage(message,"*");
		}
		var sprits=document.createElement("script");
		script.innerHTML="("+postMeg.toString()+")();"

		document.getElementsByTagName("head")[0].appendChild(scripts);
		
		window.addEventListener("message",function(event){
			console.log(event.data);
		},false);
	</pre>
综上所述，content scripts通过添加script标签让web page使用postMessage给content scripts发送message，因为是加入到web page中的js是可以访问到web page 的js自定义变量和方法的，content scripts使用addEventListener中的方法访问MessageEvent的data属性获得了message。
2. sendMessage
此方法实现content scripts和插件页面（如：background page）以及插件页面之间的通信，调用的方式有：    
	<pre>chrome.runtime.sendMessage(extensionID,message,responseCallback);
	extensionID:插件ID,每个chrome插件都有一个唯一的ID,默认向本插件发送消息
	message:发送的信息，任何序列化JSON信息
	responseCallback:函数，当接收消息的一方有返回消息时，处理返回的消息，参数为接收的返回消息
	</pre>
与postMessage使用的方式类似的，在接收方需要通过监听事件来获取发送的消息：
	<pre>
	chrome.runtime.onMessage.addListener(function(request,sender,senResponse){...});
	request:接收到的消息message
	sender：发送方
	sendResponse：发送返回消息的函数，参数是需要返回的消息
	</pre>
例如，上文的content scripts接收的message希望再传递给background的话，过程如下：
	<pre>
		/*content scripts*/
		window.addEventListener("message",function(event){
			console.log(event.data);
			chrome.runtime.sendMessage(message,function(request){
				console.log(request);
		});
		},false);
		/*background page*/
		chrome.runtime.onMessage.addListener(function(request,sender,sendResponse){
			console.log(request);
			sendResponse(backmessage);
		});
	</pre>
content scripts接收到来自web page的消息之后立即将消息发送给background page，background接收content scripts的消息后返回了一则消息，contentscripts 接收返回的消息后在控制台输出。    
不过这样看起来感觉十分混乱，因此在发送消息的时候最好给消息加上一个认证信息，在接收消息的时候先判断是来自何处的消息，发送消息的目的是什么，然后再进行相应的处理，则能提高效率。比如发送的Message内容使用json格式：{src： "content", content: message},接收时判断event.data或者request.data的src内容是什么，再根据不同的src内容，进行不同的工作。
接收消息，使用onMessage事件。

###实践分享之kissyMap

首先介绍一下kissyMap，这是一个chrome小插件，它可以找到网页中存在的kissy模块，并用直观的图形显示这些模块和模块之间的依赖关系：
![kissyMap](http://gtms02.alicdn.com/tps/i2/TB1xOWeFVXXXXbGXFXXqFoqNVXX-400-302.png)
![kissyMap](http://gtms03.alicdn.com/tps/i3/TB1exKcFVXXXXcFXFXXqFoqNVXX-400-302.png)    
在做这个小插件的过程中即涉及到许多web page 和 content scripts、background page之间的信息传递，当然此处的background是作为popup page的中间人去获取页面的kissy模块信息。 当然关于信息的存储，还有许多的问题，更深入了解就会有更多的问题等待我们解决，希望喜欢插件开发的小伙伴们能在这个过程中挖掘更多的知识。

参考文献：
1. [https://developer.mozilla.org/en-US/docs/Web/API/Window.postMessage](https://developer.mozilla.org/en-US/docs/Web/API/Window.postMessage)    
2. [https://developer.chrome.com/extensions/overview#arch](https://developer.chrome.com/extensions/overview#arch)    
3. [https://developer.chrome.com/extensions/manifest](https://developer.chrome.com/extensions/manifest)    
4. [https://developer.chrome.com/extensions/runtime#method-sendMessage](https://developer.chrome.com/extensions/runtime#method-sendMessage)    