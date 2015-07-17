/*
 * User: ShareYu
 * Date: 2015/7/9
 */
define(['jquery', 'getUI'], function($, GetUI){
	var dialog = function(options, newTpl){
		this.UI = GetUI('ui-dialog', newTpl);
		this.Mask = $('.ui-mask').length ? $('.ui-mask'): $('<div class="ui-mask"></div>').appendTo('body');

		this.options = $.extend({
            title: '信息提示',
			html: '提示内容',
			width: '400px',
			height: '140px',
			top: null,
			left: null,
			hideMask: true,
			draggable: true,
			onEnsure: null,
			onCancel: null,
			onClose: null,
			onBeforeShow: null,
			onBeforeHide: null,
			onAfterHide: null,
			closed: false
		}, options);

		this.isValid = true;
		
		this.init();

		return this;
	}

	dialog.prototype = {
		init: function(){
			var _this = this;

			_this.UI.find('.ui-dialog-title').html(_this.options.title);
			_this.UI.find('.ui-dialog-body').html(_this.options.html);
			_this.setPosition();
			_this.drag();
			_this.handler();
			!_this.options.closed && _this.show();
		},
		setPosition: function(){
			var w = parseInt(this.options.width, 10),
				h = parseInt(this.options.height, 10);
			this.UI.css({
				width: w,
				height: h,
				left: this.options.left || ($(window).width() - w) / 2,
				top: this.options.top || ($(window).height() - h) /2
			});
		},
		drag: function(){
			var _this = this,
				$dragBar = _this.UI.find('.ui-dialog-header');

			$dragBar.unbind('mousedown');

			if(_this.options.draggable){
				var dragBar = $dragBar.get(0),
					disX,
					disY,
					fire = false;

				$dragBar.css('cursor', 'move').bind({
					'mousedown': function(e1){
						disX = e1.offsetX;
						disY = e1.offsetY;
						fire = false;

						dragBar.setCapture && dragBar.setCapture();

						$(document).bind({
							'mousemove': function(e2){
								if(fire){
									return;
								}
								_this.UI.css({
									left: e2.pageX - disX,
									top: e2.pageY - disY
								});
							},
							'mouseup': function(){
								fire = true;
								dragBar.releaseCapture && dragBar.releaseCapture();
							}
						})
					}
				});
			}
			else{
				_this.UI.find('.ui-dialog-header').removeAttr('style');
			}
		},
		show: function(){
			this.options.onBeforeShow && this.options.onBeforeShow.call(this, this.UI);
			this.Mask.show();
			this.UI.show();
		},
		hide: function(ev){
			var _this = this;
			_this.options.onBeforeHide && _this.options.onBeforeHide.call(_this, _this.UI);

			if(!_this.isValid && ev == 'onEnsure'){
				return;
			}
			_this.options.hideMask && _this.Mask.hide();
			_this.UI.hide();
			_this.options.onAfterHide && _this.options.onAfterHide.call(_this, _this.UI);
			
			_this.options[ev] && _this.options[ev].call(_this, _this.UI);
		},
		handler: function(){
			var _this = this;

			_this.UI.find('[data-event]').click(function(e){
				e.stopPropagation();
				var ev = $(this).attr('data-event');
				_this.hide(ev);
			}).bind('mousedown mousemove', function(e){e.stopPropagation();});
		},
		destroy: function(){
			this.UI.remove();
			this.options.hideMask && this.Mask.hide();
		}
	}

	return dialog;
});