## 变量

一个变量会从模版的上下文中去进行查找，如果你只想单独显示一个变量，则语法格式如下：

	{{ variablename }}
	
查找到之后模版会将该变量的值显示在网页上，变量可以使用点语法或者是中括号语法，就像javascript一样，如下：

	{{ variablename.propertyname }}
	{{ variablename['propertyname'] }}
	
这两种方式的结果是一样的。但当值为undefined或者是null的时候则不会再网页上显示，对object也一样。XTemplate支持所有基本格式的变量，如Boolean、Array、Object、Null、Undefined、String、Number

## 转义

{{ }}直接将对HTML标签进行转义（即显示在网页上的内容是作为字符串的），而{{{ }}}则不会将HTML标签进行转义（即显示在网页上的HTML标签就是作为HTML标签的），如下：

	var username = '<a>';
	{{ username }} //显示 <a>
	{{{ username }}} //显示 ‘’（a标签开头）
	
如果你想要显示‘{{ x }}'最原始的数据内容（不做任何转义）则最好使用 {{% {{ x }} %}}

如果想在模版中加入字符串注释则使用 {{! comment }} 这部分内容是不会被模版渲染的。
	
## 作用域

每个模版都有其自身的作用域，内部作用域可以访问外部作用域但内部作用域定义的变量不可以改变外部作用域，内部作用域通过include引入，如下：

	parent.xtpl:
	 {{ set (a=1, b=2) }}
	 {{ include (sub.xtpl) }}
	 in parent: 
	 a = {{ a }};
	 b = {{ b }};
	 
	 sub.xtpl:
	 in sub：
	 {{ set b = 3 }}
	 a = {{ a }};
	 b = {{ b }};
将parent模版渲染（render）之后的结果如下：

	in sub:
	a = 1;
	b = 3;
	in parent:
	a = 1;
	b = 2;
	
## 根数据

使用root.foo可以快速访问到根数据的属性，如数据｛name: 'foo', array:[name: 'bar']｝使用下面的模版：

	{{#each (array) }}
	{{root.name}} {{name}}
	{{/each}}
本身的命令时只对array中的内容进行处理的，但通过root仍然可以访问到根数据。

## 方法和逻辑

在模版中可以调用javascript的原生方法：

	var x = [1,2,3];
	{{#each (x.slice(1)) }} {{ this }} {{/each}} //2 3
	
### 操作符

＋、－、＊、／、％ 基本操作符 例子：

	{{ x+y }}
	{{ x + "1" }}
	{{ y - 1 }}
=== !== > >= < <= 比较符 例子：

	{{#if( x===1 )}}
	1
	{{elseif (x===2)}}
	2
	{{else}}
	3
	{{/if}}
		
	{{#if ( (x+1) > 2 )}}
	{{/if}}
|| && ! 逻辑符 例子：

	{{#if(x>1 && y<2)}}
	{{/if}}

	{{#if(!x)}}
	{{/if}}

### 调用方法

如果你传递了一个javascript方法给你的模版，那么你就可以正常调用它：

	{{ foo(1,2,3) }}
	{{#each range(0,3)}}{{this}}{{/each}} 012
	{{#each range(3,0)}}{{this}}{{/each}} 321
	{{#each range(3,0,2)}}{{this}}{{/each}} 31
	
## 命令

特殊：   
	set命令：{{set(key = value[,key1 = value1,key2 = value2...])}}

首先命令是具有特殊功效的语句块，其次你可以自己写一些命令

if命令

	{{#if (varible) }}
	It is true//DO SOMETHING
	{{/if}}
加上else之后是这样的：

	{{#if (varible)}}
	do something
	{{else if (varible1)}}
	do something
	{{else}}
	do something
	{{/if}}
if not命令

	{{^if(varible)}}
	do something
	{{/if}}
	
with命令

	var a = {
		b:1
	};

	{{#with (a)}}
	{{b}}
	{{/with}}
	与javascript中的with一样一样的。

each命令（主要用于遍历数组或对象）

	{{#each(array)}}
	{{xindex}}{{this.name}} //xindex表示索引值，this表示遍历到的数组元素
	{{/each}}

使用with和each再加上../命令可以访问外部变量：

	{{#with(x)}}
		{{#each(b)}}
			{{../a}}{{a}}
		{{/each}}
	{{/with}}
以上代码使用数据{a:1, b:[{a:2}]},输出结果是12

macro命令，此命令允许你定义一块可重用的语块，就像在javascript中定义方法一样

	{{#macro("test", "param", default=1)}}
		param is {{param}} {{deault}}
	{{/macro}}
使用时如下：

	{{macro("test","2")}} param is 2 1
	{{macro("test","2",default=2)}} param is 2 2
ps:在macro中不可以访问父作用域元素，但可以通过root访问根数据 

include命令：用于引入其他模版，并且还可以通过参数传递的方式将数据传递到该模版

	{{set(x=1,y=2)}}
	{{include ("sub.html", xx=x,yy=y)}} 如果子模版中也有x和y变量将会继承父模版中的x和y值
如果你希望子模版有独立的作用域，使用parse命令，用法和这个一样，但子模版中的同名变量不会继承父模版中的同名变量的值。

## 模版继承

模版继承是一个很好的模版重用的方法，通过block命令可以创建子模版可重写的语法块，例子如下

parent.xtpl:

	<!Doctype html>
	<html>
	<head>
		<meta name="charset" content="utf-8">
		<title>{{ title }} </title>
		{{{ block("head")}}}
	</head>
	<body>
		{{{block(body)}}}
	</body>
	</html>
child.xtpl:

	{{extend (parent.xtpl)}}
	
	{{#block("head")}}
		<link type="text/css" href="test.css" rev="stylesheet" rel="stylesheet" />
	{{/block}}
	
	{{#block("body")}}
		<h2>{{title}}</h2>
	{{/block}}
data:{title: "XTemplate"}

render:

	<!doctype html>
	<html>
    <head>
        <meta name="charset" content="utf-8" />
        <title>XTemplate</title>
        <link type="text/css" href="test.css" rev="stylesheet" rel="stylesheet"/>
    </head>
    <body>
        <h2>XTemplate</h2>
    </body>
	</html>
	
## 保留字

debugger   
each   
extend   
include   
macro   
parse   
range   
set   
with   

## 命令扩展

即自定义命令
