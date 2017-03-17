define(['jquery'], function($){
	var Tab = function(wrapper, options){
		this.options = $.extend({}, Tab.defaults, options);

		this.$wrapper = $(wrapper || '.ui-tab');
		this.$btns = this.$wrapper.find(this.options.btns);
		this.$contents = this.$wrapper.find(this.options.contents);

		this.init();
	}

	Tab.defaults = {
		btns: '.ui-tab-btn',
		contents: '.ui-tab-item',
		trigger: 'mouseover',
		btnActiveClass: 'active',
		contentActiveClass: 'active'
	}

	Tab.prototype = {
		init: function(){
			var _this = this;

			_this.$btns.bind(_this.options.trigger, function(){
				var _index = $(this).index(),
					curContent = _this.$contents.eq(_index);

				_this.$btns.removeClass(_this.options.btnActiveClass);
				$(this).addClass(_this.options.btnActiveClass);

				_this.$contents.removeClass(_this.options.contentActiveClass);
				curContent.addClass(_this.options.contentActiveClass);
			});
		}
	}

	return Tab;
});