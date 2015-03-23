## 基础PHP语法

php脚本以<?php开头，以?>结尾，php文件扩展名为.php，php脚本语句以分号结尾，但因为php标签结尾会自动表明分号，也可不必写分号。

php中有三种注释：

	// 单行注释
	＃ 单行注释
	/**/ 多行注释
	
在php中对所有函数、类和关键字的大小写都不敏感，但对所有变量都大小写敏感

## PHP变量

PHP 变量规则：

- 变量以 $ 符号开头，其后是变量的名称
- 变量名称必须以字母或下划线开头
- 变量名称不能以数字开头
- 变量名称只能包含字母数字字符和下划线（A-z、0-9 以及 _）
- 变量名称对大小写敏感（$y 与 $Y 是两个不同的变量）

ps:php中没有创建变量的命令，变量会在其第一次被赋值的时候被创建，因此php是一门变量松散型的语言

在php中，变量可以在任何位置被声明，而变量的作用域有三种：local（局部）、global（全局）、static（静态）

在函数外部被声明的变量拥有Global，只能在函数外被访问；函数内部声明的变量拥有Local，只能在函数内部被访问；但是global关键字可用于在函数内部访问外部global变量，同时php在$GLOBALS[index]保存了所有的全局变量

一般情况下函数执行完之后会删除其所有变量，除了以static关键字声明的。

## PHP echo和print

这两个php内置函数都用于输出，但有区别

－ echo能够输出一个以上的字符，且因为不需要返回而速度很快
－ print职能输出一个字符

echo和print是个语言结构，用不用括号都可以 如 echo $x & echo($x)

## PHP数据类型

字符串   
整数   
浮点数   
逻辑   
数组   
对象   
NULL

整数规则：

- 整数必须有至少一个数字（0-9）
- 整数不能包含逗号或空格
- 整数不能有小数点
- 整数正负均可
- 可以用三种格式规定整数：十进制、十六进制（前缀是 0x）或八进制（前缀是 0）

在 PHP 中，必须明确地声明对象。
首先我们必须声明对象的类。对此，我们使用 class 关键词。类是包含属性和方法的结构。

通过方法var_dump()可返回变量类型

## PHP字符串函数

- strlen() 返回字符串长度
- stopos() 检索字符串内的字符或文本，如果找到则返回第一个找到的位置，如果没找到则返回false
- echo() 输出字符串
- explode() 把字符串打散成数组
- 更多信息：[http://www.w3school.com.cn/php/php_ref_string.asp](http://www.w3school.com.cn/php/php_ref_string.asp)

## PHP常量

有效的常量名不以$符开头，且为自动全局，通过define方法设置常量：

	define(NAME, Value, false/true);//第三个参数指定常量名是否对大小写敏感，默认为false
	
## PHP运算符

大多数与js一样，一下有几种特殊的：

. 串接符号，用于将两个字符串拼接起来
.= 串接赋值

另外，PHP还有可用与数组的运算符：＋、＝＝、＝＝＝、等等，用法和符号原本的意思差不多

## PHP条件语句

与javascript一样，有if、if...else、switch

## PHP循环语句

for 、 while用法和js一样，另有一个foreach语句仅适用于数组：

	foreach($array as $value) {
	//Do something
	}
	每次数组的元素会被赋值给value变量，然后执行代码
	
## PHP函数

定义方式和js一样，但函数名对大小写不敏感，同时可以为函数默认参数：

	function name($value = 30) {
	} //设置了参数默认值为30

## PHP数组

创建数组使用方法array(),在PHP中数组类型有如下三种：

- 索引数组：带有数字索引的数组
- 关联数组：带有指定键的数组
- 多维数组：带有一个或多个数组的数组

索引定义方式： 

	$cars = array(value1, value2, value3);索引从0开始
	
通过count()方法可返回数组的长度

关联数组定义方式：

	$cars = array("bill"->"34", "amy"->"22");
	or:
	$cars["bill"]="34";
	$cars["amy"]="22";
使用foreach方法遍历关联数组：

	foreach($age as $x=>$x_value) {
  		echo "Key=" . $x . ", Value=" . $x_value;
  		echo "<br>";
	}
	
## PHP数组排序

- sort() 升序对数组排序
- rsort() 降序对数组排序
- asort() 根据值，对关联数组进行升序排序
- ksort() 根据键，对关联数组进行升序排序
- arsort() 根据值，对关联数组进行降序排序
- krsort() 根据键，对关联数组进行降序排序

## PHP超全局

php的超全局变量有如下几个：

- $GLOBALS:引用全局作用域中可用的全部变量
- $_SERVER：保存报头、路径、脚本信息[http://www.w3school.com.cn/php/php_superglobals.asp](http://www.w3school.com.cn/php/php_superglobals.asp)
- $_REQUEST：搜集表单提交的数据
- $_POST：搜集post提交表单的数据
- $_GET：搜集get提交的数据
- $_FILES
- $_ENV
- $_COOKIE
- $_SESSION

## PHP表单处理 （$GET&$POST运用）

通过$_POST("name")的方式即可访问到提交的数据

$_SERVER["PHP_SLEF"] 用于返回当前执行脚本

htmlspecialchars方法用于防止上面的变量被利用，因其可以讲普通字符变成html实体

关于表单验证，php提供了trim函数用于删除数据中不必要的字符；stripslashes用于删除用户输入中的反斜杠

php empty()函数用于检验变量是否为空

php preg_match() 用于检验模式匹配

## PHP多维数组

## PHP文件引入

include 引入文件，并在出错时生成警告，但脚本依然执行
require 功能同上，但在出错时回停止执行脚本

这两种方法都会将制定文件中的所有文本／代码／标记复制到当前文本中

使用 ： require／include ‘filename’

## PHP文件操作

readFile 读取文件并将其写入流中，以下代码会将读的文件内容输出

	<?php echo readFile('we.txt') ?>
	
fopen 方法提供更多的参数以选择打开文件的方式，第二个参数既是

可用参数见 [http://www.w3school.com.cn/php/php_file_open.asp](http://www.w3school.com.cn/php/php_file_open.asp)

fread(fileurl, 待读取的最大字节数)
fclose 用来关闭打开的文件

fgets从文件读取单行
fgetc从文件读取单个字符

文件上传，用到超全局变量$_Files

$_FILES["file"]["name"] - 被上传文件的名称   
$_FILES["file"]["type"] - 被上传文件的类型   
$_FILES["file"]["size"] - 被上传文件的大小，以字节计   
$_FILES["file"]["tmp_name"] - 存储在服务器的文件的临时副本的名称   
$_FILES["file"]["error"] - 由文件上传导致的错误代码   

## PHP cookies

设置使用setcookie方法

获取通过超全局变量$_COOKIE

isset方法确认是否有变量

## PHP session

session_start()启动会话

$_SESSION 获取session

