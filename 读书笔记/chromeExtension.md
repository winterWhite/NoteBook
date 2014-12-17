# OverView

插件的本质—— 一系列打包压缩的文件，这些文件包括HTML、CSS、JavaScript、images文件或者别的什么—— 这一系列文件都是用来为Chrome浏览器扩展功能的。

插件本质上就是一些网页，这些网页可以使用chrome提供的各种API工具。插件可以通过content script或者cross-origin XMLHttpRequests访问或操作网页和浏览器，也可以操作书签和网页选项卡。

每个插件都可以以浏览器动作（browser action）或者页面动作（page action）的形式插入图标，其中浏览器动作的图标是插入在地址栏外部的，而页面动作的图标是插入在地址栏内部的右侧的。一个插件至多有一个浏览器动作或者一个页面动作，当需要处理多个页面时选择浏览器动作，当只需要处理一个页面时选择页面动作。插件还可以通过右键菜单、单独页面、改变网页外观等形式插入图标。

详细地说明，一个插件包中应该至少包含下列文件：

* 一个manifest文件，用于插件的定义，以及各类引用的定义
* 一个或多个HTML文件(除非此插件是一个主题)

另外可选的有下列文件：

* 一个或多个JS文件
* 任何其他你的插件需要用到的文件，如css文件、image文件等

如何在chrome插件中引用文件：

* 可以使用相对URL引用，这与平时的用法一样
* 插件中的所有文件都有一个绝对的地址：chrome-extension://< extentionID >/< pathToFile >，这其中的extensionID是每个插件都会有的一个识别ID，由chrome分配，而pathToFile是该文件相对于插件根目录的地址。在插件正是打包之前，extensionID是可变的，此时可以通过@@extension_id引用。而插件一旦打包发布之后，它的ID就不会变了，即使进行了更新，ID也不会变化，此时就可以将@@extension_id都替换为真正的ID 

Manifest文件：

这是一个json文件，命名为manifest.json，提供一些与插件有关的信息，以及插件需要使用的权限等等，一下是一个典型的manifest文件：

	{
  		"name": "My Extension",
  		"version": "2.1",
  		"description": "Gets information from Google.",
  		"icons": { "128": "icon_128.png" },
  		"background": {
  		  "persistent": false,
  		  "scripts": ["bg.js"]
  		},
  		"permissions": ["http://*.google.com/", "https://*.google.com/"],
  		"browser_action": {
  		  "default_title": "",
  		  "default_icon": "icon_19.png",
  		  "default_popup": "popup.html"
  		}
	}

插件的结构：

background page，这是一个不可见的但支撑整个插件的逻辑的文件，一个插件同时还可以有些其他的提供插件功能的页面（UI pages），如果插件需要与网页进行交互操作，则需要用到content script。

background page：
	
背景页有两种：第一种永久的背景页，一种是事件背景页；前一种一直开启，后一种则只在需要时开启，如果不需要长时间保持背景页处于运行状态，则最好选择后一种背景页。

UI pages：

UI页面可以是简单的HTML页面，比如popup弹出页面就是一个平常的HTML文件；也可以是供用户选择功能的option页面；也可以是override页面。

插件中的页面之间可以互相访问对方的DOM也可以插入方法等等。