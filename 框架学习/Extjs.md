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
可以指定proxy属性作为获取数据的地址，而不是从内存获取。
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

	此时通过ajax从后台获取数据而不是直接从内存中读取，因此需要修改proxy属性

		proxy：{
			type: 'ajax',
			url: '后台获取数据的地址'
		}
	因为获取的数据类型为JSON，所以对reader也要做出相应的修改

		reader: {
			type: 'json',
			totalProperty: 'totalProperty',
			root: 'root',
			idProperty: 'id'
		}
	此处指定了type为JSON，同时增加了totalProperty和root属性，这两个属性对应后台返回的数据名称。最后，在初始化时传递对应的分页参数：

		store.load({params: {start: 0, limit: 10}});
	传递的参数是后台程序规定的。

* 底部的分页工具条

	前面提到的分页工具条bbar位于表格的底部，同样有一种tbar工具条是位于表格顶部的。

* 前台分页

	即一次性从后台获取所有数据，并有前台判定显示数目，Extjs没有直接提供这样的功能，但通过PagingMemoryProxy.js扩展可以实现从内存分页。调用方法：

		Ext.Loader.setPath('Ext.ux', '相对路径');
		Ext.require('Ext.ux.data.PagingMemoryProxy');
	同时将proxy的type修改为pagingmemory；初始化时传入start和limit参数即可。也可在前台生成javascript数组或者使用ajax读取后台数据，再传递给pagingmemoryproxy也可实现内存分页。

###后台排序

前台的排序只能对当前页的数据进行排序，如果要对所有数据进行排序，则需要将排序信息提交到后台，由后台将排序信息组装到SQL中，再有处理好的数据返回给前台。

要实现后台排序，首先要将store对象中的remoteSort属性设置为true，这个属性指定是否允许远程排序。将这个属性设置为true后，在下次请求排序时则会向后台提交sort和dir两个参数，其中sort表示需要排序的字段，dir表示升序或降序，后台根据这些参数对数据进行处理。

###多重排序

可以对多列同时指定排序规则：

	store.sort([{
		property: 'rating',
		direction: 'DESC'
	}, {
		property: 'salary',
		direction: 'ASC'
	}]);
以上代码就指定了rating列和salary列的排序规则。

###可编辑表格控件——EditorGrid

首先在列模型定义时，给每一列都添加一个editor属性并指定allowBlank：false(表示允许为空)，在初始化时启用CellEditing插件：

	var grid = new Ext.grid.GridPanel({
		selType: 'cellmodel',
		plugin: [
			Ext.create('Ext.grid.plugin.CellEditing', {
				clicksToEdit: 1//表示只需要点击以下就可以编辑，默认需要双击
			})
		]
	});

* 添加删除行

通过给tbar或者bbar添加两个按钮，并给按钮加上handler方法，如下

	tbar: ['-', {
		text: '添加',
		handler: function(){
			var p = {
				id: '',
				name: '',
				descn: ''
			};
			//grid.stopEditing();
			store.insert(0, p);
			//grid.startEditing();
		}
	}, '-', {
		text: '删除',
		handler: function() {
			Ext.Msg.confirm('信息', '确定要删除?', function(btn) {
				if(btn == 'yes'){
					var sm = grid.getSelectionModel();
					var record = sm.getSelection()[0];
					store.remove(record);
				}
			});
		}
	}, '-']
* 保存修改结果

同样通过给工具条添加一个保存按钮，并附上操作函数，通过store.getModifiedRecords()方法获取修改过的数据并放到JSON数组里，然后使用Ajax提交给后台。会使用到一些数组操作的方法，比如Slice和each方法
* 限制输入数据类型

Ext提供了许多的数据类型组件：

* NumberField限制只能输入数字   
* ComboBox限制只能输入备选项   
* DateField限制只能输入日期   
* Checkbox限制从true和false中选择其一

需要在定义列模型的时候给对应的列添加对应的editor属性如下：

	var columns = [{
		header: '数字列',
		dataIndex: 'number',
		editor: new Ext.form.NumberField({
			allowBlank: false,
			allowNegative: false,
			maxValue: 10
		})
	}...];
以上的内容定义了一个数字列，且规定了改列不能为空或者为负，且最大值为10；而对于不同的限制输入对象有不同的配置内容，如ComboBox就需要配置备选项，日期可以配置disableDay即不可选日期
###属性表格控件——PropertyGrid

PropertyGrid扩展自EditGrid，创建方式：

	var grid = new Ext.grid.PropertyGrid();
此控件提供更多高级的表格功能，此处不详细说。

###分组表格控件——GroupingGrid

此控件在普通表格的基础上，根据某一列的数据显示表格中的数据分组。只需要在建立数据转换时添加groupField属性，指定分组根据那一列的数据进行。如下:

	var store = new Ext.data.ArrayStore({
		fields:[...],
		data: data,
		groupField: 'sex',
		sorter: ...
	});
同时在表格初始化的时候将features设置为grouping，如下：

	var grid = new Ext.grid.GridPanel({
		...
		features: [{ftype: 'grouping'}]
	});

分组表格视图

通过grid.view.features[0]可以获取分组表格feature的实例并对其进行操作，如expandAll方法展开所有分组，collapseAll方法折叠所有分组，isExpanded方法判断分组是否展开，也有单独的collapse和expand方法，通过调用getGroupId方法获取对应ID之后就可以对该分组进行折叠或展开操作。

###表格拖放

* 拖放改变表格大小

	使用Resizable对象，其参数有
	
	* 表格的父容器ID
	* wrap：true
	* minHeight
	* pinned：true
	* handles：拖动方向s/e/w/n

	定义了rz对象后还必须注册事件，如下：

		var rz = new Ext.Resizable(grid.getEl(), {
			wrap: true,
			minHeight: 100,
			pinned: true,
			handles: 's'
		});
		rz.on('resize', function(resizer, width, height, event) {
			grid.setHeight(height);
		}, grid);
* 表格内部拖放：用于排序

	设置gridviewdragdrop插件即可：

		var grid = new Ext.grid.GridPanel({
			...
			viewConfig: {
				plugins: {
					ptype: 'gridviewdragdrop'
				}
			}
		});
* 表格之间的拖放：两个表格都设置gridviewdragdrop插件即可

###表格右键菜单

使用右键事件：itemcontextmenu

	var contextmenu = new Ext.menu.Menu({
		id: '',
		items: [
			text: '',
			handler: function() {}
		]
	});//定义菜单组件
	grid.on('itemcontextmenu', function(view, record, item, index, e) {
		e.preventDefault();//阻止默认右键事件
		contextmenu.showAt(e.getXY());
	});//注册右键事件
	
###其他扩展插件

* 行编辑器
* 进度条分页组件
* 缓冲表格视图
* 分组表头
* 锁定列
* 树形表格
* 表格过滤组件   
**...**

## 第四课：表单与输入控件

###表单的创建

	var form = new Ext.form.FormPanel({
		title: '',
		defaultType: 'textfield',
		buttonAlign: 'center',
		frame: true,
		width:,
		fieldDefaults: {
			labelAlign: 'right',
			labelWidth:70
		},
		items: [{
			fieldLabel: '文本框',
		}],
		buttons: [{
			text: '按钮'
		}]
	});
	form.render("form");
以上的items用于指定文本框等控件、buttons用于指定按钮等控件
对应的HTML中要有对应的表单容器，<div id="from"></div>。通过创建Ext.form.FormPanel对象并设置里面的field内容我们创建了一个表单。FormPanel继承自Ext.Panel，可以执行一些Panel的操作，而表单的功能是在Ext.form.BasicForm中实现的，通过FormPanel的getForm方法可以获取BasicForm对象，并实行一些表单的操作。

###表单的输入控件

Ext提供的输入控件包括：TextField、TextArea、Checkbox、Radio、ComboBox、DateField、HtmlEditor、Hidden和TimeField

* 基本输入控件

	Ext.form.Field是所有表单输入控件的基类，它定义了输入控件通用的属性和功能方法，大致可以分为页面显示样式、空间参数配置、数据有效性检验三种：

	* 页面显示样式：clearCls、cls、fieldClass、focusClass、itemClass、invalidClass、labelStyle等属性，分别用于定义不同状态下输入框的样式
	* 控件参数配置：autoCreate、disabled、fieldLabel、hideLabel、inputType、labelSeparator、name、readOnly、tabIndex、value等属性，用于设置输入控件生成的DOM内容和标签内容，以及禁用和只读等属性配置
	* 数据有效性校验：invalidText、msgFx、msgTarget、validateOnBlur、validateDelay、validateEvent等属性，用于设置数据校验的方式以及如何显示错误信息。

* 文本输入控件 Ext.form.TextField

	文本输入控件提供特色功能：检验输入是否为空，限制输入内容的最大最小长度，运用到allowBlank、maxLength、minLength这三个属性。

	把创建好的Ext.form.TextField对象放到表单的items属性中即把此文本框放入了表单。

* 多行文本输入框 Ext.form.TextArea

	此控件使用户能一次输入多行文本，对grow属性设置为true使文本框可根据输入的内容自动修改自身的高度，preventScrollbars用于防止出现滚动条。
* 日期输入控件 Ext.form.DateField

	此控件会弹出日历供用户选择日期，format属性用于设置日期的显示格式，而disabledDays可以禁止用户选择一周内的特定日期。
* 时间输入控件 Ext.form.TimeField

	此控件通过制定一天中的始终时间以及时间间隔的方式来为用户提供可供选择的时间点，其中minValue、maxValue分别指示起始时间和终止时间，increment指定时间间隔，时间间隔以分钟为单位。
* 在线编辑器控件(富文本) Ext.form.HtmlEditor

	在此控件中对对应功能的enable选项进行设置。
* 隐藏域 Ext.form.Hidden

	通过设置setValue和getValue方法对其进行赋值和取值的操作，但它不会显示在页面上。
* 如何设置input的type

	通过对Ext.form.TextField的inputType修改即可，比较特殊的type=image的输入框，需要修改autoCreate参数，如下：
	
		{
			fieldLable: '证件照',
			name: 'smallimg',
			inputType: 'image',
			inputAttrTpl: [
				'src="URL"'
			],
			width:,
			height:
		}

###ComboBox

Ext中的ComboBox完全是由Div重写的，如何创建一个ComboBox：

* 使用二维数组data定义ComboBox中将要显示的数据
* 将定义好的数据交给Ext.data.ArrayStore，Ext.data.ArrayStore与Ext.data.Store功能相似，但前者不需要定义proxy和reader就可以直接使用，更方便
* 将ComboBox画到页面上，对应的HTML内容是<input id="combo" type="text"/>

对象Ext.form.ComboBox对象设置的参数：

* store：ComboBox提供的数据，原始数据是二维数据
* emptyText：当没有选择任何数据时ComboBox里面的显示数据
* mode：当设置为local时表示ComboBox的数据已经读取到本地，不需要后台读取
* triggerAction：当设置为all时，如果用默认的query会使用autocomplete功能
* value：设置默认值

**将Select转换成ComboBox**

架设有一个Select元素的id为combo，将其转化为ComboBox，使用该Select的数据：

	var combo = new Ext.form.ComboBox({
		emptyText: '',
		mode: 'local',
		triggerAction: 'all',
		transform: 'combo'  //使用select元素的数据
	});

**ComboBox读取远程数据**

使用Ext.data.Store对象配合proxy和fields获得后台返回的数据：

	var store = new Ext.data.Store({
		proxy: {
			type: 'ajax',
			url: URL,
			reader: {
				type: 'array'
			}
		},
		fields: [
			{name: 'value'},
			{name: 'text'}
		]
	});
然后将ComboBox的mode参数设置为remote。

还有一种方法是使用store.load()，这种方法可以决定何时加载数据。注意两种方式如果同时使用就会加载两次数据。

**ComboBox高级配置**

* 为ComboBox添加分页功能

	需要两个参数：pageSize决定每次显示多少条记录； minListWidth控制下拉列表的宽度，如果不设置则看不到完整的分页条；mode的值必须是remote
* 是否允许用户子弟填写内容

	将editable设置为true则表示可以自行填写。

**监听用户选择的数据**

	combo.on('select', function(comboBox) {
		...
	});
然后通过comboBox的getValue和getRawValue方法可获取用户选定的具体信息

**省市县级联的实现**

此功能的关键点在于on事件的监听，当上一级选定之后，其后一级的数据内容会发生响应的变化。

**MultiSelect以及ItemSelector扩展**

这两个扩展都需要在HTML页面引入相应的js文件才能使用。


###复选框与单选按钮


###滑动条控件



###表单布局


###数据校验


###数据提交



###自动填充数据控件
