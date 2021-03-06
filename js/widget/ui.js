define(['jquery'], function($){
	var UI = {
		'ui-dialog': '<div class="ui-dialog"><div class="ui-dialog-header"><span class="ui-dialog-title"></span><i class="icon-remove" data-event="onClose"></i></div><div class="ui-dialog-body"></div><div class="ui-dialog-footer"><button class="ui-button" data-event="onEnsure"><i class="icon-ok-sign"></i>确定</button><button class="ui-button" data-event="onCancel"><i class="icon-remove-sign"></i>取消</button></div></div>',
		'ui-title': '<div class="ui-title" contenteditable="true"><h1>标题：JavaScript是个神奇的语言！</h1></div>',
		'ui-paragraph': '<div class="ui-paragraph" contenteditable="true"><p>春花秋月何时了？往事知多少。小楼昨夜又东风，故国不堪回首月明中。雕栏玉砌应犹在，只是朱颜改。问君能有几多愁？恰似一江春水向东流。</p></div>',
		'ui-blockquote': '<div class="ui-blockquote" contenteditable="true"><blockquote><p>清明时节雨纷纷，路上行人欲断魂。借问酒家何处有？牧童遥指杏花村。</p><small>清明  <cite>杜牧</cite></small> </blockquote></div>',
		'ui-table': '<table class="ui-table" cellpadding="0" cellspacing="0" contenteditable="true"><tr><th>序号</th><th>姓名</th><th>性别</th><th>年龄</th></tr><tr><td>1.</td><td>张三</td><td>男</td><td>26</td></tr><tr><td>2.</td><td>李四</td><td>男</td><td>21</td></tr><tr><td>3.</td><td>小爱</td><td>女</td><td>19</td></tr><tr><td>4.</td><td>小米</td><td>女</td><td>18</td></tr></table>',
		'ui-button': '<button class="ui-button" contenteditable="true"><i class="icon-star"></i>按钮</button>',
		'ui-text': '<input class="ui-text" type="text" contenteditable="true" />',
		'ui-textarea': '<textarea class="ui-textarea" contenteditable="true"></textarea>',
		'ui-select': '<select class="ui-select" contenteditable="true"><option value="选项一">选项一</option><option value="选项二">选项二</option><option value="选项三">选项三</option></select>',
		'ui-tab': '<div class="ui-tab" contenteditable="true" data-ui-js="tab"><div class="ui-tab-title"><button class="ui-tab-btn active">选项一</button><button class="ui-tab-btn">选项二</button></div><div class="ui-tab-content"><div class="ui-tab-item active">内容一</div><div class="ui-tab-item">内容二</div></div></div>',
		'ui-carousel': '<div class="ui-carousel" contenteditable="true" data-ui-js="carousel"><a class="carousel-btn btn-prev" href="javascript:void(0)"><i></i></a><a class="carousel-btn btn-next" href="javascript:void(0)"><i></i></a><ul class="carousel-item-wrap"><li class="carousel-item"><a href="javascript:void(0)"><img src="http://usr.im/1000x300?text=place" /></a></li><li class="carousel-item"><a href="javascript:void(0)"><img src="http://usr.im/1000x300?text=place" /></a></li><li class="carousel-item"><a href="javascript:void(0)"><img src="http://usr.im/1000x300?text=place" /></a></li><li class="carousel-item"><a href="javascript:void(0)"><img src="http://usr.im/1000x300?text=place" /></a></li></ul><ol class="carousel-button-wrap"><li class="carousel-button active"></li><li class="carousel-button"></li><li class="carousel-button"></li><li class="carousel-button"></li></ol></div>',
		'ui-accordion': '<div class="ui-accordion" contenteditable="true" data-ui-js="accordion"><div class="ui-accordion-item"><div class="ui-accordion-header"><i class="icon-chevron-down"></i>这是第一个</div><div class="ui-accordion-content">这是第一个内容</div></div><div class="ui-accordion-item"><div class="ui-accordion-header"><i class="icon-chevron-down"></i>这是第二个</div><div class="ui-accordion-content">这是第二个内容</div></div><div class="ui-accordion-item"><div class="ui-accordion-header"><i class="icon-chevron-down"></i>这是第三个</div><div class="ui-accordion-content">这是第三个内容</div></div></div>'
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