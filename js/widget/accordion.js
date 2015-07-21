define(function(){
	var Accordion = function(wrapper, options){
		this.options = $.extend({}, Accordion.defaults, options);
		
		this.$wrapper = $(wrapper || '.ui-accordion');
		this.$items = this.$wrapper.find(this.options.items);
		this.$headers = this.$wrapper.find(this.options.headers);
		this.$contents = this.$wrapper.find(this.options.contents);

		this.init();

		return this;
	}

	Accordion.defaults = {
		items: '.ui-accordion-item',
		headers: '.ui-accordion-header',
		contents: '.ui-accordion-content',
		activeClass: 'active',
		speed: 'fast'
	}

	Accordion.prototype = {
		init: function(){
			var _this = this;

			_this.$headers.click(function(){
				_this.active($(this).closest(_this.options.items));
			});
		},
		active: function(item){
			var _this = this,
				activeItem = !isNaN(item) ? _this.$items.eq(item) : item,
				_index = activeItem.index();

			if(!activeItem.hasClass(_this.options.activeClass)){
				_this.$items.removeClass(_this.options.activeClass);
				_this.$headers.find('i').attr('class', 'icon-chevron-down');
				_this.$contents.hide();

				activeItem.addClass(_this.options.activeClass);
				_this.$headers.eq(_index).find('i').attr('class', 'icon-chevron-up');
				_this.$contents.eq(_index).slideDown(_this.options.speed);
			}
			else{
				_this.$headers.eq(_index).find('i').attr('class', 'icon-chevron-down');
				_this.$contents.eq(_index).slideUp(_this.options.speed, function(){activeItem.removeClass(_this.options.activeClass);});
			}
		}
	}

	return Accordion;
});