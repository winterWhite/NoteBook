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

表格由类Ext.grid.GridPanel定义，该类继承自Ext.Panel，其xtype为grid；在Ext中表格必须包含列定义信息，并指定表格的数据储存器。表格的列信息由数组columns定义，而表格的数据储存器由Ext.data.Store定义 

###创建表格的过程：

* 创建表格的列模型：一个JSON数组，每一个JSON对象说明某一列的名称、类型等信息。这个JSON数组赋值给columns配置属性，一个JSON对象包含的信息有首部显示文本(header)、列对应记录集字段(dataIndex)、列是否可排序(sortable)、列的渲染函数(renderer)、宽度(width)、格式化信息(format)等等
* 添加数据：二维格式的数组添加形式，将数组赋值给data数组。
* 转化原始数据：使用Ext.data.ArrayStore类创建一个数据存储对象，赋值给store属性，它负责把各种原始数据(二维数组、JSON对象数组、XML文本)转化为Ext.data.Record类型的对象。store对应两个部分：proxy(获取数据的方式)、reader(解析数据的方式)。Ext.data.ArrayStore方法默认通过内存加载JSON数据作为元数据。同时最后必须执行一次store.load()来初始化数据。
	
		var store = new Ext.data.ArrayStore({
			data: data,
			fields: [
				{name: 'id', mapping: 0},
				{name: 'name', mapping: 1},
				...
			]
		});
注意上面代码中的mapping属性，此属性用于控制列的位置，注意mapping索引从0开始。
* 将列模型和转化后的数据装配在一起，使用Ext.grid.GridPanel初始化：
		
		var grid = new Ext.grid.GridPanel({
			renderTo: 'grid',
			store: store,
			columns: columns
		});

	其中renderTo属性指定Ext表格渲染的父容器即一个div的id，store和columns分别指定列模型对象和转换的数据对象。

###常用功能详解

* 常用属性功能

	* enableColumnMove属性：用于指定表格列是否可拖动，默认为True，可在初始化表格的时候设置为False。
	* enableColumnResize属性：用于指定表格列宽是否可变，默认为True，可在初始化时设置为False
	* stripeRows属性：用于指定表格以斑马线效果，默认为False
	* loadMask属性：指定数据加载时的遮罩和提示功能，默认为False
* 宽度自定：每一列的宽度可分别指定，直接在创建列模型时的JSON数组中的每个JSON对象加上width属性指定宽度，同时在初始化表格时添加forceFit：true属性即可。此时会根据指定的width显示列宽，未制定的默认100px宽。
* 支持列排序：列模型添加sortable属性即可
* 中文排序：可通过sorters属性为Ext.data.ArrayStore设置默认的排序方式
		
		var store = new Ext.data.ArrayStore({
			data: data,
			fields: [...],
			sorters: [{property: "name", direction: "ASC"}]
		});
	注意上诉使用的sorters属性，是对应的JSON数组，每个JSON对象指定一个列的默认排序方式，其中“ASC”表示升序，“DESC”表示降序。而要实现中文的排序则需要重写Ext.data.ArrayStore的createComparator方法
* 显示日期类型数据：在转化数据时，对应日期的JSON对象添加属性type：'date'以及dataFormat: 'Y-m-dTH:i:s'分别制定数据类型为日期，以及日期的显示格式；同时还需要在列模型的日期对应的列JSON对象添加render属性并指定Ext.util.Format.dateRender('Y-m-d')

###表格渲染

为使得表格变得更加丰富，Ext提供了许多扩充功能。可以为列添加渲染函数，渲染函数通过renderer属性指定，通过复杂的判定函数可以更加丰富地渲染表格。

###行号与复选框

* 行号

		var columns = [
			new Ext.grid.RowNumber(),
			{}...
		];
只需要在所有列之前加上一个用于计算行号的Ext.grid.RowNumber对象即可。
* 复选框：首先创建一个Ext.selection.CheckboxModel对象并赋值给表格初始化对象的selModel属性，即可添加一列复选框

###选择模型

选择模型有RowModel模型——行选择；CellModel模型——单元格选择

###表格视图Ext.grid.GridView

当生成表格对象的时候会默认生成对应的GridView对象，使用Ext.grid.GridPanel对象的getView方法可获取当前表格的视图并进行操作，通过此对象可以重新定义整个表格的高宽、数据、以及viewConfig对象

viewConfig对象的常用属性：

* columnsText、sortAscText、sortDescText分别设置表格中每列下拉菜单中的显示的列，升序、降序部分的显示文字
* scrollOffset表示为滚动条预留的宽度，默认20px
* forceFit参数为true时，表格为自动延展每列的长度使内容填满单元格

###表格分页

* 添加分页工具条
		
		var grid = new Ext.grid.GridPanel({
			...
			bbar: new Ext.PagingToolbar({
				pageSize: 10,//每页显示的数据条数
				store: store,
				displayInfo: true,//是否显示数据信息
				displayMsg: '',//当displayInfo为true时才有用
				emptyMsg: ''//没有数据时的显示信息
			})
		});
在初始化表格的时候添加一项bbar属性，工具条属性
* 分页工具与后台的交互