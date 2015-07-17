/*
 * User: ShareYu
 * Date: 2015/7/9
 */
define(function(){
	var UI = {
		'ui-dialog': '<div class="ui-dialog"><div class="ui-dialog-header"><span class="ui-dialog-title"></span><i class="icon-remove" data-event="onClose"></i></div><div class="ui-dialog-body"></div><div class="ui-dialog-footer"><button class="ui-button" data-event="onEnsure"><i class="icon-ok-sign"></i>确定</button><button class="ui-button" data-event="onCancel"><i class="icon-remove-sign"></i>取消</button></div></div>',
		'ui-title': '<div class="ui-title" contenteditable="true"><h1>标题：JavaScript是个神奇的语言！</h1></div>',
		'ui-paragraph': '<div class="ui-paragraph" contenteditable="true"><p>春花秋月何时了？往事知多少。小楼昨夜又东风，故国不堪回首月明中。雕栏玉砌应犹在，只是朱颜改。问君能有几多愁？恰似一江春水向东流。</p></div>',
		'ui-blockquote': '<div class="ui-blockquote" contenteditable="true"><blockquote><p>清明时节雨纷纷，路上行人欲断魂。借问酒家何处有？牧童遥指杏花村。</p><small>清明  <cite>杜牧</cite></small> </blockquote></div>',
		'ui-table': '<table class="ui-table" cellpadding="0" cellspacing="0" contenteditable="true"><tr><th>序号</th><th>姓名</th><th>性别</th><th>年龄</th></tr><tr><td>1.</td><td>张三</td><td>男</td><td>26</td></tr><tr><td>2.</td><td>李四</td><td>男</td><td>21</td></tr><tr><td>3.</td><td>小爱</td><td>女</td><td>19</td></tr><tr><td>4.</td><td>小米</td><td>女</td><td>18</td></tr></table>',
		'ui-button': '<button class="ui-button" contenteditable="true"><i class="icon-star"></i>按钮</button>',
		'ui-text': '<input class="ui-text" type="text" contenteditable="true" />',
		'ui-textarea': '<textarea class="ui-textarea" contenteditable="true"></textarea>'
	}

	var getUI = function(uiName, mewTpl){
		if(mewTpl){
			return $(UI[uiName]).appendTo('body');
		}
		else{
			return $('.' + uiName).length ? $('.' + uiName): $(UI[uiName]).appendTo('body');
		}
	}

	return getUI;
});