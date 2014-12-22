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

通过在items配置中设置defaultType值为checkbox或者radio即可设置
####复选框

复选框对应Ext.form.Checkbox，但无法控制其样式。复选框和单选按钮独有的属性boxLabel用于显示在其右边的说明性文字，与labelField的区别只是位置不同，为避免出现两个标签，应当把hideLabels设置为true以保证左侧的标签不会显示出来。通过inputValue来指定checkbox的实际值，使用checked：true可默认选中某一个框
####单选按钮

Ext中的单选按钮继承自复选框，因此checkbox具有的所有功能Radio都有，只是在制作单选按钮时要确定一次只能选择一个，而要进行一些有别于checkbox的配置。一组Radio的name值都是一样的，因此inputValue的值则尤为重要，用于判断用户的选择。同时Radio有一个自己独有的函数getGroupValue，用于获得某个分组中被选中的Radio的值。
####CheckboxGroup和RadioGroup控件

这两个控件可用于对复选框和单选按钮进行各种各样的排列。

* 横向排列

	这两个控件的默认排列方式就是横向排列，使用时，只需要在配置xtype：‘checkboxgroup’即可。
* 竖向排列

	只需要在上面的设置基础上再加上columns:1，即可
* 多排列

	即既有横向排列又有竖向排列：只需要设置colunms的值即可，这个值表示没一横排有多少项，然后会子哦对那个进行排列
* 自定义多列排列方式

	这种情况对colunms配置一个两项的数组，分别定义了高和宽，也可以用百分比表示
* 自定义布局排列方式

	可以向items传入一个对象数组，每一个对象用于配置一种选择按钮集合，在每一个按钮集合中设置columnWidth来确定每个选择按钮集区域的宽度即可实现按钮的分区显示。
###滑动条控件

实现滑动条控件需要额外引入文件SlideField.js，引入之后其使用方法与其他控件一样，只需要将配置中的defaultType设置为sliderField即可。可以通过给控件的value值传入一个数组就可以指定多个滑动条，让用户可以一次指定多个值。

###表单布局

表单的默认布局是自上而下的平铺式布局，默认标签左对齐，按钮右对齐，可通过设置labelAlign和buttonAlign进行改变，还可以通过labelWidth强制定义标签宽度。

####平行分布布局

通过指定layout:'column'来说明下面要使用列布局，然后在items指定的每列中使用columnWidth指定每列所占宽度的百分比，此时就不能在表单中直接使用defaultType指定默认的xtype了，否则会影响布局结果。同时在每一列中的items也必须设定layout为form，如此才能在每列中正常显示输入框和对应标签。

PS：layout的form表示表单的默认布局方式，及自上而下的布局方式

####fieldset

* 布局中使用fieldset

	使用fieldset进行内部分组，在items设置的每一项中指定xtype为fieldset即可，可以加上title指定分组的名称。
* fieldset中使用布局

	
####自定义布局

使用xtype：panel来使用panel的其他功能装饰表单。
###数据校验

在文本框的的不能为空校验，只需要设置allowBlank：false即可   
文本框中关于输入长度的校验，只需要设置maxlength和minlength的值即可

Ext提供了一套默认的校验方式vtype，vtype可以指定为email则可以校验用户输入的是否是一个邮箱地址

自定义校验规则：即允许自定义正则表达式，可以传入regex的正则表达式用于检验，regexText用于提示即可。

NumberField：此对象有自身一套特有的校验方式

使用后台返回的校验信息：
###数据提交

默认提交：通过设置url属性指定一个提交地址

HTML原始提交：

单纯Ajax：

文件上传：

###自动填充数据控件


## 第五课：树形结构

###创建树

树控件由Ext.tree.TreePanel定义，控件的名称为TreePanel：

	var tree = new Ext.tree.TreePanel();
	tree.render('treeId');
	//此处的treeId泛指的是树形结构的容器ID，也就是说在HTML中应当有对应的div其ID值为treeId
以上的代码创建了一个树形面板，然后开始创建树之前先要定义树的根：

	store: new Ext.data.TreeStore({
		root: {
			text: '',
			leaf: true
		}
	});
通过store参数将root放到树形里，然后对树形进行渲染，使其出现在容器treeId的位置，然后就可以开始添加枝叶了：

	root: {
		text: '',
		children: [{
			text: '',
			children:[]
		},{
			text: '',
			children: []
		}, {
			text: '',
			leaf: true
		}]
	}
枝叶的添加格式如上，是一个循环的过程，如果有叶子则添加children字段，没有则设置leaf为true。但树枝默认是收起的，也就是需要点击图标前面的加号才能展开树看到叶子，通过设置Tree.getRootNode().expand(true, true)则可以设置树为展开状态。expand方法的第一个参数指定是否要递归地展开所有的子节点，第二个参数指定是否要动画展开。

###配置树

可以将render直接放到tree创建的配置信息中进行指定：

	var tree = new Ext.tree.TreePanel({
		store: new Ext.data.TreeStore(...),
		renderTo: 'treeId'
	});

###TreeStore

前端直接写数据是非常麻烦的，通过TreeStore可以从后台获取数据并组装成树，配置如下：

	var tree = new Ext.tree.TreePanel({
		store: new Ext.data.TreeStore({
			proxy: {
				type: 'ajax',
				url: ...
			},
			root: {
				text: ''
			}
		}),
		renderTo: ''
	});
以上代码中store字段中使用了proxy字段对后台URL进行了配置，但是在后台的数据一定要保证所有的叶子节点都要有leaf:true，否则ajax就会一直不停地请求下去。

除此之外，还可以通过JSP提供后台数据，或者通过XML加载树形结构。

###树事件

Ext的树事件提供非常丰富的有关树变化或动作的信息，注册监听如下：

	tree.on("itemexpand", function(node) {...});//监听但节点被展开时的信息
	tree.on("itemcollapse", function(node) {...});//监听当节点被收起时的信息
	tree.on("itemclick", function(node) {...});//监听当节点被点击时的信息
右键菜单事件，需要注册一个contextmenu的事件如下：

	var contextmenu = new Ext.menu.Menu({
		id: 'theContextMenu',
		items: [{
			text: '',
			handler：function() {...}
		}]
	});
注册之后再进行绑定，如下：

	tree.on("itemcontextmenu", function(viex, record, item, index, e) {
		e.preventDefault();
		...
	});

###其他设置

**修改节点默认图标**

设置每个树形节点的icon和iconCls属性，这两个属性负责制定节点的图标：

	{
		text: '',
		icon: '图片URL',
		...
	}//这是通过icon属性改变图标
	{
		text: '',
		iconCls: 'css类名',
		...
	}//这是通过iconCls属性改变图标，此时HTML中应该有对应的类：
	.x-tree-icon-leaf .css类名 {
		background-image: URL
	}//注意此处的类必须是层叠的写法，否则无效

**节点弹出对话框**

	tree.on("itemclick", function(view, record, item) {
		Ext.Msg.show({
			title: '',
			msg: '',
			animateTarget: item
		});
	});

**节点提示信息**

当鼠标悬浮在节点上方时显示提示信息，这种效果通过设置节点的qtip属性即可。同时还要通过Ext.QuickTips.init()方法对此功能初始化，且这行代码必须在onReady函数的第一行。

**为节点设置超链接**

只需要给节点加上href属性并附上URL即可，类似于超链接的Target属性，叶子节点也有一个对应的hrefTarget属性。

###树形拖放

开启treeviewdragdrop插件即可实现叶子与枝杈、根之间的拖放，但叶子不能拖放到叶子之下：

	var tree = new Ext.tree.TreePanel({
		viewConfig: {
			plugins: { ptype: 'treeviewdragdrop' }
		},
		...
	});

节点（拖之后）放的三种形式：

* append：放下去的节点变成目标节点的子节点，形成父子关系
* above：放下去的节点变成目标节点的兄弟，放下去的节点排行在前
* below：放下去的节点变成目标结点后面的兄弟

PS：叶子节点不能append，但通过nodedragover事件可以将叶子节点的leaf设置为false，则可以打破这个规律了。

判断拖放目标：

通过nodedrop事件，此事件是拖放的节点放下去时触发的：

	tree.view.on("drop", function(node, overModel, dropPosition, dropHandler) {
		...
	});
以上代码中，node即正在拖放的节点，overModel为放下去碰到的节点，dropPosition是放下去的方式（上面介绍的三种之一），通过这些数据可以判定当前节点的状态位置，以通过Ajax发送给后台以更新数据。才用request方法：

	Ext.Ajax.request({
		method: 'POST',
		url: ,
		success: function() {...},
		failure: function() {...},
		params: {
			data: encodeURIComponent(Ext.encode({
				dropNode: node.id,
				target: overModel.get('id'),
				point: dropPosition
			}))
		}
	});

树之间的拖放：

树与树之间的拖放，不一定drag和drop同时存在，因此使用enableDD：true也可以单独设置enableDrag或enableDrop

###其他功能

* 树排序

	通过在store中设置folderSort参数即可实现树排序
* Checkbox树

	为数节点添加checked：true属性即可
* 表格与树的结合

	treecolumn插件可实现表格与树结合的效果
* 选中节点

	使用selectPath函数，传入叶子相对于根的路径即可；使用selectionModel选择，通过treePanel.getSelectionModel方法可获得属性的选择模型
* 刷新

	使用根节点的reload函数
* 缓冲视图

		plugins: [{
			ptype: 'bufferedrenderer'
		}]
* 锁定功能

	grid的锁定功能，哎某一列使用locked：true即可

## 第六课：布局

Ext中的所有布局都是从Ext.Container，Ext.Container的父类Ext.BoxComponent是一个盒子组件可以定义宽高、位置等属性，而作为子类的Ext.Container除继承了这些功能外还可以通过layout和items属性对内部进行布局；因此继承自Ext.Container的子类都可以通过这两个属性进行布局，常用的子类有Ext.Viewport（对页面进行布局）、Ext.Panel、Ext.Window、Ext.form.FormPanel、Ext.form.Fieldset（对表单进行布局）

而对于布局类，它们都有一个共同的子类Ext.layout.ContainerLaout；常用的布局类有BorderLayout、FormLayout、ColumnLayout、FitLayout、AbsoluteLayout等

### FitLayout

自适应布局，即内部元素会根据外部框架的大小变换而变换。使用如下：

	var viewport = new Ext.Viewport({
		layout: 'fit',
		items: ...
	});
上述代码实现了页面内容的自适应布局。

PS：使用FitLayout时要注意，items中只能放一个组件，即使放了几个也只有第一个组件有效，不管是使用什么进行布局的。

### BorderLayout

这是最常见的布局，即将页面分为东、南、西、北、中五个部分，除了中间的部分，其他部分都可以省略的布局方式。用法：

	var viewport = new Ext.Viewport({
		layout: 'border',
		items: [
			{region: 'center', html: 'center'},
			{region: 'south', html: 'south', height:, split: true},
			...
		]
	});
上述代码中items字段是一个对象数组，每个对象用于定义布局的某一块，center部分是必须的，否则就会报错。

东南西北这四个部分的大小可以进行设定，中间部分的大小是通过计算出来的，不能进行设置。大小通过height和width两个字段进行设定，其中**北和南只能设置高度**，而**东和西只能设置宽度**。为某个区域设置了参数split：true，则用户可通过拖动边框改变该区域的大小，但即使加上了此参数，北南只能上下拖动，东西只能左右拖动，而中间部分不支持拖动功能。此外还可以通过minSize和maxSize对用户的拖动范围进行限制。

Ext还实现了子区域（即东南西北四个部分）的折叠与展开功能，设置如下：

	{region: 'north', html: 'north', height: 300, title: 'north', collapsible: true }
此处的title和collapsible必须同时设置。

### Accordion

可伸缩菜单式布局，使用时只需要将layout属性设置为accordion即可，需要注意的是items中的每一项都必须设定title值，其他的配置项如：titleCollapse（是否可通过点击标题栏折叠，否则就只能通过折叠按钮），animate（折叠时是否使用动画效果），activeOnTop（面板顺序是否根据展开情况进行改变，默认false）

### CardLayout

此类布局就相当于一堆重叠在一起的卡片，卡片的顺序可以变换但每一次都只能看到一张卡片，这种布局适用于向导说明，对应的layout为card。

通过activeItem来控制当前显示的卡片，items中的是一个对象数组，一个对象表示一堆卡片，该对象中也有items字段用于定义每一张卡片。通过setActiveItem方法可控制下一个显示的卡片。

### AnchorLayout & AbsoluteLayout

AnchorLayout布局是一种灵活的布局方式，其为items中的每个组件的大小设置一个相对值anchor（可以只有一个值也可以是空格分开的两个值分别代表宽高），可根据整体进行调整，设置方式有三种：

* 百分比（某子组件相对整体的百分比大小）
* 设定右侧和底部的距离像素值
* side（保证其父组件和子组件都没设置宽高或anchorSize），设置anchorSize，一个包含宽高的JSON值

AbsoluteLayout是AnchorLayout的子类，需要对每个子组件设置绝对定位。

### FormLayout

FormLayout也是AnchorLayout的子类，可以使用anchor设置高宽的比例，但其主要用于表单的布局，Ext.form.FormPanel使用它作为默认布局。其提供的布局参数：

* hideLabels：是否隐藏控件的标签
* itemCls：表单显示的样式
* labelAlign：标签的对齐方式
* labelPad：标签空白的像素值
* labelWidth：标签宽度
* clearCls：清除div渲染的css样式
* fieldLabel：对应控件的标签内容
* hideLabel：是否隐藏标签
* itemCls：控件的css样式
* labelSeparator：标签和控件之间的分隔，默认为：
* labelStyle：标签的CSS样式

### ColumnLayout

此布局将整个容器进行竖直切分的布局方式，在每个子组件中设置columnWidth参数，这是一个0到1之间的小数，表示每个子组件在整体中所占的百分比，所有的columnWidth参数加起来应该小于等于1，小于1的时候会填不满。也可以单独给某一列赋值固定的宽度width，给剩下的组件添加columnWidth。

### TableLayout

使用layoutConfig参数定义要分为几列，在items中定义各个子面板，市容rowspan和colspan设置如何进行行和列的合并，其遵从从左到右、从上到下的规律。

* rowspan：合并的行数
* colspan：合并的列数
* cellId：某个单元格的ID
* cellCls：某个单元格的Css样式

### BoxLayout

* **HBox**

	此布局方式用于在一行中排列多个组件，使用layout：hbox，每个子组件通过设置flex定义大小
* **VBox**

	此布局方式用于在一列中排列多个组件，layout：vbox，每个子组件通过设置flex定义大小

### Ext.TabPanel

这一组件用于创建选项卡式的布局，定义如下：

	var tabs = new Ext.TabPanel({
		renderTo: document.body,
		height: 100
	});
上述代码定义了一个选项卡对象，但没有添加任何的选项卡，通过调用该对象的add方法即可添加选项卡：

	tabs.add({
		title: '',
		id: Ext.id(),
		html: '',
		closable: true
	});
上述代码通过add方法向选项卡对象添加了一个选项卡面板，该面板的标题由title定义，id由Ext.id方法生成唯一id值，内容由html定义，而closable参数说明是否可以手动关闭选项卡，漠然为false。

如果添加了多个选项卡，可以通过tabs对象的activate方法传入一个选项卡index索引，默认选中某个选项卡，选项卡的索引从0开始。

还可以通过autoLoad为选项卡内容添加远程页面的内容，只需要传入一个URL值，同时不要html属性即可，注意autoLoad里面还要设置一个script为true才能执行该页面的js脚本：

	tabs.add({
		title: '',
		autoLoad: {url: '', script: true}
	});

* 标签面板的滚动菜单

	设置plugins：[scrollerMenu] ，同时引入TabScrollerMenu.js以及TabScrollerMenu.css文件即可使用，
* 竖直分组的标签面板

	引入GroupTabPanel.js、GroupTab.js、grouptabs.css三个文件，将外层xtype设置为grouptabpanel。

### 其他布局知识

* 超类Ext.Container公共配置

	Ext.Container作为所有可布局组件的超类，提供了两个最主要的参数：layout和items，分别用于设置布局方式和子组件。与这两个参数相对应的还有layoutConfig，用来布局提供特定的配置参数，在实例化过程中，当前类会把自身的layoutConfig参数赋予layout对象并进行配置；activeItem，指定当前显示哪一个子组件。此外还有一个defaultType，当子组件没有设定xtype时，会使用上级组件的defaultType作为自身的xtype，其默认为panel。

	在Ext中，xtype是一大特性，xtype: 'grid'与new Ext.grid.GridPanel的功效一样。
* 超类Ext.layout.ContainerLaout

	作为所有布局类的超类，Ext.layout.ContainerLaout只设置了所有布局类需要的一些配置，其本身不具备布局功能。

* 当不指定布局类型时，布局组件会使用其特定的默认布局。
* 嵌套实现复杂布局

	Ext中的组件可以嵌套，对嵌套的组件可使用不同的布局类型，如此就可实现复杂的布局。

## 第七课：弹出窗口

### Ext.MessageBox

对话框也是一种特殊的窗口，它能提供界面更加美观，功能更加多样的对话框。

* Ext.MessageBox.alert()

	这是Ext中的消息对话框，用法：

		Ext.MessageBox.alert('标题', '内容', function(btn) {
			//处理函数
		});
	处理函数会在用户点击关闭按钮（不论是确认按钮还是右上方的关闭按钮）之后执行。
* Ext.MessageBox.confirm()

	这是Ext中的判断对话框，用法：

		Ext.MessageBox.confirm('标题', '内容', function(btn) {
			//处理函数，此处的btn可表示用户点击的是yes还是no
		});
* Ext.MessageBox.prompt()

	这是Ext中的输入对话框，用法：

		Ext.MessageBox.prompt('标题', '内容', function(btn, text) {
			//btn标识用户点击的是哪个按钮，text是用户输入的内容
		});

### 对话框配置

* 多行输入框

	将prompt对话框改装成可多行输入的对话框，通过Ext.Message.show方法，传入一个JSON配置对象，即可完成这个目标：

		Ext.MessageBox.show({
			title: '',
			msg: '',
			width: 300.
			button: Ext.MessageBox.OKCANCEL,//表示使用预设的OK和CANCEL两个按钮
			multilines: true,
			fn: function (btn, text){
				...
			}
		});
	以上代码通过multilines创建了一个多行文本输入对话框。
* 自定义对话框按钮

	通过给button属性传入{ok: true, cancel: true}这样的对象可自定义按钮，Ext中的按钮有四种：ok、yes、no、cancel
* 进度条

	给Ext.MessageBox.show添加progress：true参数即可变为一个进度条对话框，也可以通过progress方法：

		Ext.MessageBox.progress('标题', '内容');
	然后调用Ext.MessageBox.updateProgress方法更新进度条，同时将show里面的参数closable设置为false以隐藏关闭按钮。

	或者也可以使用Ext.MessageBox.wait
* 动画效果

	同时还可以为对话框设置弹出和关闭的动画效果，使用animEl参数指定一个HTML元素，然后对话框就会根据该元素播放弹出和关闭动画。

此外使用Ext.MessageBox还可以简化为Ext.Msg，且实用它只能弹出一个对话框，而不能一次弹出多个。

### Ext.Window

* 创建窗口

		var win = new Ext.Window({
			layout: 'fit',
			width: 500,
			height: 300,
			closeAction: 'hide',
			items: [{}],
			buttons: [{
				text: ''
			}]
		});
		win.show();
	以上代码创建了一个窗口，其中的items指定窗口内部的组件，buttons指定窗口底部的按钮，closeAction用于指定当用户点击关闭按钮后的执行动作，如果想要禁止关闭按钮，将closable属性设置为false即可，另外设置draggable为false可以禁止用户拖动窗口。最后调用win的show方法用于显示窗口
* 窗口最大化与最小化

	最大化按钮的设置属性为maximizable，将其设置为true即可。而最小化按钮的设置属性为minimizable。
* 窗口隐藏与销毁

	窗口设置的属性中有一个closeAction，其用于指定用户点击关闭按钮之后的动作，可选的有两种动作：销毁(close)和隐藏(hide)，默认情况下为close。如果为销毁则会将窗口有关的DOM全部删除，而如果是隐藏则仅仅是不可见，如果再次调用show方法还是可以看见的。与窗口关闭相关的属性还有closable，当设置为false时会隐藏窗口的关闭按钮，此时就需要调用窗口的close方法或hide方法才能进行销毁或隐藏。
* 防止窗口超出浏览器边界

	使用参数constrain和constrainHeader，分别用于限制窗口整体和窗口顶部不能超越浏览器边界。
* 窗口按钮设置

	按钮的对齐方式由buttonAlign指定；defaultButton参数可以指定默认选择的按钮的索引值，按钮索引从0开始。
* 其他配置

	resizable可指定是否可通过拖放改变窗口大小，然后结合modal:true参数可模拟窗口更改的过程。   
	animateTarget可用于指定窗口弹出关闭时的动画。   
	通过plain：true参数还可以对窗口内容进行部分美化。

### 窗口分组

默认情况下窗口都在Ext.WindowMgr组中，而窗口分组由Ext.WindowGroup类定义，该类的bringToFront、getActive、hideAll、sendToBack方法等可对分组中的窗口进行操作。

### 向窗口中放入控件

* 表格

	此时表格不需要指定render或renderTo，而是直接将表格放入窗口的items中。
* 表单

	其他配置基本不变，只是将title去掉，将窗口布局设置为form
* 复杂布局

## 第八课：工具条和菜单

