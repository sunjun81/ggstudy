使用 NodeJS, MarkdownJS, PrettifyJS 打造个人博客写作平台 - 整体思路
==================

## 引言

最近博客更新比较频繁，尝试了几种不同的写作方式，总结如下：

*	第一种很简单了，直接使用[博客园][1]的在线编辑器。	
	优点是方便快捷，适合写些篇幅不大的随笔。
	由于我经常更新的文章比较长，有时间需要花一两个小时来写作，经常会出现 Session 超时而丢失数据的情况。
*	使用 Word 写作，这个可以方便的插入图片，进行排版。
	但是缺点也很明显，保存的 html 源代码里面有太多垃圾数据，并且放到博客上后一些样式就没有了，导致文章严重失真。
*	打开记事本直接写 html 代码。
	这是我最近尝试的一种方式，先说使用的标签也不多，就那么几个 `<br />, <h1>, <h2>, <pre>, <a>, <img>`。
	倒还凑合，写好的文章可以直接放在[我的个人主页][2]，也可以直接粘贴到博客中。
	不过每次写这些标签还是很烦人，而且最让我受不了的是对于 `<pre>` 中的代码都要手工替换 `<, >` 为  `&lt;, &gt;`。

刚好最近在翻译 [JavaScript秘密花园][5]，发现它使用的是 [Markdown][6] 的简单语法，通过 python 下的 Markdown 解析器解析成 html 源代码，
使用非常方便。由于我一直关心前段相关技术，就想能不能用 JavaScript 来实现这个自动编译过程。

[注]：也看到博客园里有人说用 Live Writer，也曾尝试装了个最新版的 [Windows Live Writer 2011][3]，居然发现登录时就报错，也就没下文了。
后来想想还是自己靠得住，程序员嘛，多折腾折腾没啥坏处。

## Markdown 是个神马东西？

首先我们来看下 [Markdown][6] 是何方神圣？可能很多程序员还不了解这个东西，不过你应该知道 BBCode 吧，其实 Markdown 是类似的东西。

不过 Markdown 有更广泛的[用户群体][9]，比如 Stack Overflow, Reddit, GitHub 等都选择 Markdown 作为默认的写作格式，由此可见 Markdown 的魅力。

我们来看下 Markdown 的创建者 [John Gruber][8] 对它的描述：

> Markdown is a text-to-HTML conversion tool for web writers. 
> Markdown allows you to write using an easy-to-read, easy-to-write plain text format, then convert it to structurally valid XHTML (or HTML).
> 
> Thus, “Markdown” is two things: (1) a plain text formatting syntax; and (2) a software tool, written in Perl, that converts the plain text formatting to HTML.

大意是 Markdown 是一个为 Web 写作者创建的一个简便工具，用于把文本信息转换为网页信息。Markdown 包含两方面的内容，一个是普通文本的格式化语法，另一个是把这个用于特定语法的文本转化为网页的工具（Perl）。

为了有一个直观的认识，我们简单看几个 Markdown 的常见语法：

### 段落
Markdown 文本：

    一号标题
    ====================
    
    二号标题
    ---------------------

    这是一个正常的段落。

    ### 三号标题

    > 这是一段引用的文本。
    > 
    > 这是第二段引用的文本。


Html 输出：
	
	<h1>一号标题</h1>
    
    <h2>二号标题<h2>

    <p>这是一个正常的段落。</p>

    <h3>三号标题</h3>
	
	<blockquote>
		<p>这是一段引用的文本。</p>
		
		<p>这是第二段引用的文本。</p>
    </blockquote>
    
	
### 列表
Markdown 文本：

    -   苹果
    -   橘子
    -   香蕉

Html 输出：

	<ol>
		<li>苹果</li>
		<li>橘子</li>
		<li>香蕉</li>
    </ol>
	

	
### 链接
Markdown 文本：

    我的[个人主页地址](http://sanshi.me/)。

Html 输出：

	<p>我的<a href="http://sanshi.me/">个人主页地址</a>。</p>
	

	
### 代码
Markdown 文本：

		var source = "<h1>这个页面标题</h1>";
		document.getElementById("#title").innerHTML = source;

Html 输出：

	<pre><code>var source = "&lt;h1&gt;这个页面标题&lt;/h1&gt;";
	document.getElementById("#title").innerHTML = source;</pre></code>
	

	
## 整体思路
	
我的初步打算是这样的:

* 	首先要有一个 JavaScript 的本机运行库。这个没有多想，直接用 [nodejs][7] 了，
	还特意下载了最新的 0.4.2，在 windows 编译出一个 node.exe 文件。以后可以分享下整个编译过程。
*	其次是如何用 JavaScript 解析 Markdown 语法，本来想自己写的，后来发现有人[捷足先登][18]了，就用它了。
*	最后需要一个语法着色工具，这个着实费了一番功夫，不是不好找而是太多了不好挑选。
	最终我把目光锁定在两款开源的基于 JavaScript 实现的语法着色工具：[SyntaxHighlighter][10] 和 [google-code-prettify][11]。
	虽然我以前一直用的是 SyntaxHighlighter，博客园默认的着色工具也是这个，不过有点遗憾的是必须为每段 `<pre>` 指定语言（比如 `<pre class="brush:js;">`），
	这个 Markdown 默认生成的 `<pre><code>` 不兼容。
	而 google-code-prettify 更加小巧精致，而且不需要指定代码所使用的语言，它会根据代码内容进行猜测，这也是我最终使用它的原因。

## 使用 MarkdownJS

[MarkdownJS][18] 本身已经是 nodejs 的模块了，所以调用方法非常简单：

	var fs = require('fs'),
		markdown = require("./markdown"),
		fileContent;

	// 读入 Markdown 源文件
	fileContent = fs.readFileSync('test.md', 'utf8');
	// 使用 MarkdownJS 模块把源文件转换为 HTML 源代码
	fileContent = markdown.toHTML(fileContent);
	// 保存
	fs.writeFileSync('test.html', fileContent);
	console.log('Done!');
	

## 改造 PrettifyJS

[PrettifyJS][11] 本身不是 nodejs 的模块，我们需要手工改造一下，这里遇到了麻烦。

> 注：可能有人会问为什么要在 nodejs 中调用 PrettifyJS，直接在页面中引入不就行了么？
> 事实的确是这样的，如果你有自己的域名和服务器的话。
> 而一般的博客提供商不会允许你私自引入 JavaScript 的，但是大部分都允许自定义 CSS，
> 所以我们可以直接在本机生成着色后的代码片段，然后再粘贴到博客中去。

首先，下载[最新的版本][12]，我们发现其中有一个不依赖于 DOM 节点的独立调用的函数 prettyPrintOne：

	/**
	* @param sourceCodeHtml {string} The HTML to pretty print.
	* @param opt_langExtension {string} The language name to use.
	*     Typically, a filename extension like 'cpp' or 'java'.
	*/
	function prettyPrintOne(sourceCodeHtml, opt_langExtension) {
		// ...
	}

这应该是个好的入手点，在 Chrome 中直接执行下面代码：
	
	prettyPrintOne('var i = 1;')

居然有错误：

![prettyPrintOne Error](http://sanshi.me/articles/nodejs_markdownjs/images/prettyPrintOne_error.gif)

后来发现这个 BUG 已经被 [Fix][13] 了，于是下载最新的 [prettify.js][14] 的最新源代码，再次运行：

![prettyPrintOne OK](http://sanshi.me/articles/nodejs_markdownjs/images/prettyPrintOne_ok.gif)


目前为止，这只是在浏览器中运行良好，怎么把它改造成 nodejs 的模块呢，首先来大致看下 prettifyjs 的源代码：

	window['PR_SHOULD_USE_CONTINUATION'] = true;
	window['PR_TAB_WIDTH'] = 8;
	window['_pr_isIE6'] = function () {
		var ieVersion = navigator && navigator.userAgent &&
			navigator.userAgent.match(/\bMSIE ([678])\./);
		ieVersion = ieVersion ? +ieVersion[1] : false;
		window['_pr_isIE6'] = function () { return ieVersion; };
		return ieVersion;
	};

	(function () {
		
		function prettyPrintOne(sourceCodeHtml, opt_langExtension) {
			// ...
		}
		
		window['prettyPrintOne'] = prettyPrintOne;
	})();

但是在 nodejs 中并不存在 window 对象。所以我们需要做如下两步改造：

1.	首先手工定义一个 window 变量，这样后面对 window 的操作才不至于出错（因为 nodejs 的上下文中没有这个变量）。
2. 	需要按照 [CommonJS][15] 的写法，对外公开模块。这样才能通过 nodejs 中使用 require("./prettify-nodejs")。

改造后的代码：

	// 这里定义 window 变量，在 nodejs 上下文是没有这个变量的
	var window = {};

	window['PR_SHOULD_USE_CONTINUATION'] = true;
	window['PR_TAB_WIDTH'] = 8;
	window['_pr_isIE6'] = function () {
		var ieVersion = navigator && navigator.userAgent &&
			navigator.userAgent.match(/\bMSIE ([678])\./);
		ieVersion = ieVersion ? +ieVersion[1] : false;
		window['_pr_isIE6'] = function () { return ieVersion; };
		return ieVersion;
	};

	(function () {
		
		function prettyPrintOne(sourceCodeHtml, opt_langExtension) {
			// ...
		}
		
		window["prettyPrintOne"] = prettyPrintOne;
	})();
	
	// Make window as a nodejs module.
	if (typeof module !== 'undefined') {
		module.exports = window;
	}

如果这时直接拿来使用，你会发现 prettifyjs 的返回的结果是不正确的，后经调试发现是 `window['_pr_isIE6']` 的问题，
这里我们只需简单的返回 `false`，告诉  prettifyjs 我们不是在 IE6 下，所以完整的改造后的 prettifyjs 代码如下：
 

	// 修改1：这里定义 window 变量，在 nodejs 上下文是没有这个变量的
	var window = {};

	window['PR_SHOULD_USE_CONTINUATION'] = true;
	window['PR_TAB_WIDTH'] = 8;
	window['_pr_isIE6'] = function () {
		// 修改2：简单的返回 false
		return false;
	};

	(function () {
		
		function prettyPrintOne(sourceCodeHtml, opt_langExtension) {
			// ...
		}
		
		window["prettyPrintOne"] = prettyPrintOne;
	})();
	
	// 修改3：将自定义的 window 对象返回，作为 nodejs 的一个模块
	if (typeof module !== 'undefined') {
		module.exports = window;
	}

	
## 小结

现在万事俱备，只欠整合了。下篇文章，我将会详细介绍如何使用 MarkdownJS 和 改造后的PrettifyJS 在 NodeJS 平台下完成文章的自动编译工作。
并发布一个基于 Markdown 语法的高效博客写作自动编译平台，敬请期待。

注：本篇文章就是使用 Markdown 语法完成并编译的，你可以下载 [文章 Markdown 源代码][16] 和 [编译后的文章 HTML 源代码][17]。




[1]: http://cnblogs.com/
[2]: http://sanshi.me/
[3]: http://explore.live.com/windows-live-writer
[5]: http://www.cnblogs.com/sanshi/archive/2011/03/12/1982394.html
[6]: http://en.wikipedia.org/wiki/Markdown
[7]: http://nodejs.org/
[8]: http://daringfireball.net/projects/markdown/
[9]: http://en.wikipedia.org/wiki/Markdown#Markdown_users
[10]: http://alexgorbatchev.com/SyntaxHighlighter/
[11]: http://code.google.com/p/google-code-prettify/
[12]: http://code.google.com/p/google-code-prettify/downloads/detail?name=prettify-21-Jul-2010.zip&can=2&q=
[13]: http://code.google.com/p/google-code-prettify/issues/detail?id=134
[14]: http://code.google.com/p/google-code-prettify/source/detail?spec=svn134&r=120
[15]: http://wiki.commonjs.org/wiki/CommonJS
[16]: http://sanshi.me/articles/nodejs_markdownjs/basic.md.txt
[17]: http://sanshi.me/articles/nodejs_markdownjs/basic.html.txt
[18]: https://github.com/evilstreak/markdown-js
