## 第一课：Extjs的使用

项目中使用Extjs：在网站中下载到的Extjs包中含有许多真正在开发时用不到的文件，如文档、示例和源代码，必须的内容包括：ext-all.js adapter/ext/ext-base.js src/locale/ext-lang-zh_CN.js 整个resources目录，其中

1. ext-all.js和adapter/ext/ext-base.js包含了所有的Extjs功能和js脚本
2. src/locale/ext-lang-zh_CN.js是汉化文件
3. resources目录下是CSS样式和图片

注：翻译汉化脚本要放在ext-all.js文件的后面引入

## 第二课：Extjs框架基础

###面向对象：对象模型API

* 创建类：
	
		Ext.define('类名', {
			name: XXX，
			someFun：function () {...}
		});
Ext.define()方法用于创建类，它接收两个参数，第一个参数是字符串类型的类名，第二个参数是一个对象字面量。使用这种方法创建类的一个优点是不用担心命名空间问题。

* 对象继承

		Ext.define('类名', {
			...
			extend: '类名'
		});
Ext.define()方法的extend属性用于指定父类，可以在子类内部使用Ext.apply()方法将一批属性复制给当前对象，通过this.callParent()实现对父类函数的快捷调用。也可以通过Ext.extend()方法实现继承

* 多重继承

Ext.define()遵守单根继承，但通过mixins属性可以在不破坏单根继承的基础上实现多重继承，此属性用于指定多重继承的父类名数组

除此之外，Extjs也支持自动生成代码（如自动生成类的setter和getter方法）

###统一组件模型

* Ext.Component    
	Ext中的所有可视组件都继承自Ext.Component,采用这种单根继承保证了所有组件都拥有相同的通用方法与生命周期，在后续的管理维护也更加便捷，也保证了布局时的便利。可以通过直接初始化一个Ext.Component实例建立一个组件元素，如下：

		var box = new Ext.Component({
			style: '',
			pageX: ,
			pageY: ,
			width: ,
			height: 
		});
	如果要制作一个可控大小和位置的控件可直接从Ext.Component继承

* Ext.Panel    
	此组件继承自Ext.Container,但可以直接使用，通过title、tbar、bbar、collapseFirst等参数可对面板进行配置，实用方式如下：
		
		var panel = new Ext.Panel({
			...参数配置...
		});

* Ext.Container
	此组件直接继承自Ext.Component，提供两个参数：layout指定当前组件采用何种布局；items参数包含当前组件中的所有子组件。

###事件机制

* 自定义事件    
	Ext遵循一种树状的事件模型，所有继承自Ext.util.Observable类的控件都可以支持事件，开发者可以为这些继承自Ext.util.Observable的对象定义一些事件以及相应的监听器。

	添加事件使用on方法，出发事件使用fireEvent方法，移除时间使用un方法

* 浏览器事件    
	Ext使用Ext.EventManager、Ext.EventObject、Ext.lib.Event对原声浏览器的事件进行了封装。

* Ext.EventObjectImpl    
	此类是将自定义事件和浏览器事件结合在一起使用封装的类，其主要的方法有：
	* getX()、getY()、getXY()
	* getTarget()
	* on()、un()
	* preventDefault()
	* stopPropagatioon()
	* stopEvent() 以上两个方法的结合体
	* getRelatedTarget() 返回事件相关元素

* Ext.util.Observable

	使用on绑定事件的时候，可传入参数有四个：
	* 事件名
	* 监听函数
	* 作用域
	* 复合式参数：对事件进行一些说明，使得它能实现更加复杂的情况

	使用on绑定事件的时候，可以一次绑定多个事件
		
		Ext.get('ID').on({
			'click': {},
			'mouseover': {}
			...
		});

* Ext.EventManager

	该类定义了一系列与事件处理相关的函数，如onDocumentReady、onWindowResize、onTextResize。其中最常用的onDocumentReady，也就是常用的方法Ext.onReady

## 第三课：表格控件
