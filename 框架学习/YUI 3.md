## YUI的模块管理

**加载模块调用方式**：   

	YUI().use('模块名', function(Y) {...});

这一行代码调用经过了如下两个阶段：

1. 调用YUI()创建一个YUI实例，它是用来组装自定义的YUI API的宿主对象
2. 调用use()方法给在步骤1种创建的YUI实例增加额外的方法，其接收一个或更多的字符串参数作为要加载的模块或包名，最后的参数是一个回调函数，其工作方式如下：
	1. use()方法确定需要获取哪些模块，根据模块计算依赖并建立要加载的模块列表（注：已经加载过或者在全局YUI对象中已经注册的模块不再加载）
	2. 构造一个合并加载地址，Loader通过一个HTTP请求从Yahoo！远程服务器上获取所有缺失的模块（注：此过程是异步进行的）
	3. 模块加载完毕以后，用请求到的API装饰之前创建的YUI实例
	4. 执行回调函数，并将YUI实例作为参数Y传入。

use方法的回调函数被称作“YUI沙箱”，是一个封装代码的私有的作用域，一个独立的区域，这里面的代码是不可以重用的。但是可以将use里面的可重用代码整合到add方法中成为一个自定义模块，便可以重用了。

识别与加载独立模块：通常我们在加载模块时会选择直接加载一个模块包，这个包里包含了许多关联的模块，且名字易于记忆，但是通常情况下我们都没有用到这个包里的所有的模块，这在某种情况下浪费了资源。YUI提供了一个功能Configurator可以确定精确的依赖列表，因此，在开发时我们使用包，而在正式发布时则具体到某个独立模块。

本地代码的加载：通常直接使用use加载会到Yahoo！远程的服务器加载，但某些情况下不允许在远程进行加载时，我们将YUI 3的完整代码下载至本地，引用本地的种子文件，此时加载会直接从本地加载。但本地加载默认是关闭了合并加载功能的，这回产生大量的重复加载，因此在本地加载时建议安装自己的合并加载程序，并开启合并加载。

**创建模块调用方式**：

	YUI.add('自定义模块名', function(Y) {
		Y.namespace('Name');
		Y.Name.XXX = ...
	 }, 版本, requires);

使用命名空间将变量或者方法添加到命名空间上，而不是添加到Y上，保证了YUI核心模块和自定义模块分开管理。

add方法的第四个可选参数：requires用于指定自定义模块的依赖。

**YUI配置信息**：

	YUI({
		modules:{
			'模块名':{
				fullpath: 模块路径,
				requires: 模块依赖
			}
		},//此配置信息用于注册模块，使得自定义模块真正重用
		groups: {
			'模块组名': {
				base: '基础路径',
				modules:{...}
			}
		},//此配置信息用于创建自定义模块组
	}).use();

如果想要重用YUI配置信息，可以将YUI配置源信息单独用一个文件存储起来，配置时写作：

	YUI({lang: 'jp'}).use();

**YUI的能力加载功能**：

在YUI配置信息用有一个condition字段，此字段与trigger、test字段配合使用可以用作条件加载，其中condition字段指定需要进行条件加载的模块名，trigger指定需要事先加载的模块名数组，test指定一个测试函数。

**特殊加载**：

- 按需加载
	1. 创建一个顶层的showOverlay函数
	2. 在showOnerlay()里，调用Y.use()加载overlay模块
	3. 在Y.use()回调函数里：
		1. 创建一个新的Overlay实例，初始时设置不可见
		2. 重新定义showOverlay()函数来做一些其他事，下次showOverlay被调用的时候将简单的显示隐藏的overlay实例
		3. 在showOverlay里调用重新定义的showOverlay来使overlay实例可见
	4. 为两个按钮添加click时间绑定各自的hide和show毁掉函数：
		1. hide回调首先检查overlay是否已经被创建
		2. show回调调用了showOverlay，第一次单机按钮调用“重版本”的showOverlay，这个版本加载了overlay模块，初始化一个overlay，然后重新定义他自己，随后的单击会调用“轻版本”的showOverlay，他会把overlay切换到可见状态
- 按用户操作进行预加载
	1. loadOverlay函数根据overlay是否已经被初始化，overlay模块当前正在加载或overlay模块需要开始加载有不同的行为
		1. loadOverlay接收一个回调函数，原来是showOverlay。如果overlay已经被初始化了，loadOverlay执行毁掉并立即返回
		2. 如果overlay模块当前正在加载，这意味着overlay还没有准备显示。loadOverlay会把回调函数按照队列放到callbacks数组并立即返回。
		3. 如果这两种情况都不满足，意味着loadOverlay函数是第一次被调用，因此应该开始加载overlay模块了，loadOverlay立即调用Y.use()来加载overlay
		4. Y.use回调初始化overlay，设置overlayLoading为false（标明他可以显示overlay了），最后执行任何showOverlay里的回调函数，这在代码加载的时候已经放在队列里了
	2. showOverlay函数很简单，如果overlay已经被初始化，则函数显示overlay。否则，showOverlay调用loadOverlay并且把它自身作为回调函数，这保证loadOverlay至少有一个showOverlay的实例被放到队列里并准备当overlay初始化后来调用。
	3. hideOverlay函数，如果overlay已经被初始化了，这个函数隐藏overlay
	4. 最后，脚本给Show Button和Hide button添加事件处理，给on()方法添加一个事件处理，而给once()方法添加一个事件处理并且第一次调用的时候自动分离这个事件。