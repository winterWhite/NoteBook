#初识MutationObserver
##———监测DOM变化的神器

1. <b>初始化MutationObserver对象</b>
   
	new MutationObserver(function callback);

	传入参数callback为回调函数，当制定的DOM节点(目标节点)发生指定的变化时，执行此函数并向此函数传入两个参数:   
	(1)<em>MutationRecord</em>对象数组    
	(2)观察者对象本身,即MutationObserver对象   

2. <b>MutationObserver对象实例方法</b>    

	observe(Node target, optional <em>MutationOberverInit</em> options); 用于给观察者注册需要观察的目标节点以及观察的类型。此方法传入参数有两个:    
	(1)target目标节点，取自页面，可以使用各种取得元素的方法   
	(2)MutationOberverInit对象，表示要观察的DOM变化类型，此对象有一系列表示类型的属性，对属性进行设置以确定观察的DOM类型。
	
	disconnect();使观察者停止观察指定目标的DOM变化，知道再次调用observe()方法。

	takeRecords();清空观察者对象的记录队列并返回里面的内容(Array数组)

3. <b>MutationObserverInit对象简介</b>   

	此对象用于确定观察者观察的DOM变化类型，作为第二个参数传入MutationObserver对象的observe()方法，其具有的属性列表如下：    
	* childList 只观察目标节点的子节点自身的变化(删除，增加，修改)，子节点的子节点变化不进行观测。
	* attributes 观测目标节点的属性变化(新增属性，删除属性，属性值变化)
	* characterData 主要指观察文本节点、注释节点等的内部的文本内容的变化
	* subtree 与childList合用，表示同时观察子节点的子节点直到以下整个DOM树的变化
	* attributeOldValue 与attributes合用，观察的同时回见发生变化的属性的旧值记录在MutationRecord对象的oldValue属性中
	* characterDataOldValue 与characterData合用，观察的同时将发生变化的文本的旧值记录到MutationRecord对象的oldValue属性中
	* attributeFilter 一个属性名的数组(不需要指定命名空间)，只观察指定属性的变化

	以上属性只要设置为true则表示观察者会观察该类型，可以一次指定多种类型。

4. <b>MutationRecord对象简介</b>   

	此对象作为第一个参数回传给MutationObserver的回调函数，其中保存着DOM变化的信息。   
	* type 返回DOM发生变化的类型(参考MutationObserverInit对象的属性)
	* target 返回DOM变化影响到的节点，根据type不同
	* addedNodes 返回被添加的节点(没有则为null) Nodelist
	* removeNodes 返回被删除的节点(没有则为null) NodeList
	* previousSibling 返回被添加或被删除的节点的前一个兄弟节点(没有则为null)
	* nextSibling 返回被添加或被删除的节点的后一个兄弟节点(没有则为null)
	* attributeName 返回变更属性的本地名称(没有则为null)
	* attributeNamespace 返回变更属性的命名空间(没有则为null)
	* oldValue 对应MutationObserverInit对象中的attributeOldvalue和characterDataOldvalue的值

<hr>

#MutationObserver动态添加a标签
##

与使用onscroll事件监测和setTimeout方法动态添加a标签的步骤进行对比如下：
	
