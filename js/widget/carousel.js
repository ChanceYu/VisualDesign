define(function(){
	var Carousel = function(wrapper, options){
		var _defaults = {
			width: '1000px',
			height: '300px',
			effect: 'slideLeftRight',
			speed: 800,
			delay: 2000,
			autoPlay: true
		}

		this.oCarousel = $(wrapper || '.ui-carousel');
		this.oPrev = this.oCarousel.find('.btn-prev i');
		this.oNext = this.oCarousel.find('.btn-next i');
		this.oItemsWrap = this.oCarousel.find('.carousel-item-wrap');
		this.oItems = this.oCarousel.find('.carousel-item');
		this.oButtons = this.oCarousel.find('.carousel-button');

		this._options = options || this.getSettings();
		this._settings = $.extend({}, _defaults, this._options);

		this.iWidth = parseInt(this._settings.width, 10);
		this.iHeight = parseInt(this._settings.height, 10);

		this.iSize = this.oItems.size();
		this.oActive = this.oItems.eq(0);

		this.bStop = true;

		this.init();
	}

	Carousel.prototype = {
		/* 获取设置在标签上的参数 */
		getSettings: function(){
			var settings = this.oCarousel.attr('data-options');
			settings = $.parseJSON(settings);
			
			return settings || {};
		},
		init: function(){
			this._initPosition();
			this[this._settings.effect]();
		},
		/* 效果：左右无缝滚动 */
		slideLeftRight: function(){
			this._slide('leftRight');
		},
		/* 效果：上下无缝滚动 */
		slideUpDown: function(){
			this._slide('upDown');
		},
		/* 效果：淡出 */
		fadeOut: function(){
			var _this = this,
				run = function(isPrev, nextIndex){
					if(_this.bStop){
						_this.bStop = false;

						var _nextIndex = _this._getNextIndex(isPrev, nextIndex),
							nextItem = _this.oItems.eq(_nextIndex);

						_this._changeZindex(nextItem);
						_this._changeActive(_nextIndex);

						_this.oActive.fadeOut(_this._settings.speed, function(){
							_this.bStop = true;
							_this.oActive.css({
								display: 'block',
								zIndex: 1
							});
							_this.oActive = nextItem;
						});

					}
				};

			_this.oItems.eq(0).css('z-index', 2);
			_this._triggerRun(run);
		},
		/* 效果：斜线淡出 */
		slashFade: function(){
			var _this = this,
				run = function(isPrev, nextIndex){
					if(_this.bStop){
						_this.bStop = false;

						var _nextIndex = _this._getNextIndex(isPrev, nextIndex),
							nextItem = _this.oItems.eq(_nextIndex);

						_this._changeZindex(nextItem);
						_this._changeActive(_nextIndex);

						_this.oActive.animate(
							{
								left: (isPrev ? _this.iWidth : - _this.iWidth),
								top: (isPrev ? _this.iHeight : - _this.iHeight),
								opacity: 0
							},
							_this._settings.speed,
							function(){
								_this.bStop = true;
								_this.oActive.css({
									zIndex: 1,
									left:0,
									top:0,
									opacity: 1
								});
								_this.oActive = nextItem;
							}
						);

					}
				};

			_this.oItems.eq(0).css('z-index', 2);
			_this._triggerRun(run);
		},
		/* 效果：直线淡出 */
		straightFade: function(){
			var _this = this,
				run = function(isPrev, nextIndex){
					if(_this.bStop){
						_this.bStop = false;

						var _nextIndex = _this._getNextIndex(isPrev, nextIndex),
							nextItem = _this.oItems.eq(_nextIndex);

						_this._changeZindex(nextItem);
						_this._changeActive(_nextIndex);

						_this.oActive.animate(
							{
								left: (isPrev ? _this.iWidth : - _this.iWidth),
								opacity: 0
							},
							_this._settings.speed,
							function(){
								_this.bStop = true;
								_this.oActive.css({
									zIndex: 1,
									left:0,
									opacity: 1
								});
								_this.oActive = nextItem;
							}
						);

					}
				};

			_this.oItems.eq(0).css('z-index', 2);
			_this._triggerRun(run);
		},
		/* 效果：缩小淡出 */
		smallFade: function(){
			var _this = this,
				run = function(isPrev, nextIndex){
					if(_this.bStop){
						_this.bStop = false;

						var _nextIndex = _this._getNextIndex(isPrev, nextIndex),
							nextItem = _this.oItems.eq(_nextIndex);

						_this._changeZindex(nextItem);
						_this._changeActive(_nextIndex);

						_this.oActive.animate(
							{
								left: _this.iWidth / 2,
								top: _this.iHeight / 2,
								width:0,
								height:0,
								opacity: 0
							},
							_this._settings.speed,
							function(){
								_this.bStop = true;
								_this.oActive.css({
									zIndex: 1,
									left:0,
									top:0,
									width: _this.iWidth,
									height: _this.iHeight,
									opacity: 1
								});
								_this.oActive = nextItem;
							}
						);

					}
				};
				
			_this.oItems.eq(0).css('z-index', 2);
			_this._triggerRun(run);
		},
		/* 效果：放大淡出 */
		bigFade: function(){
			var _this = this,
				iScale = 1.5,
				run = function(isPrev, nextIndex){
					if(_this.bStop){
						_this.bStop = false;

						var _nextIndex = _this._getNextIndex(isPrev, nextIndex),
							nextItem = _this.oItems.eq(_nextIndex);

						_this._changeZindex(nextItem);
						_this._changeActive(_nextIndex);

						_this.oActive.animate(
							{
								left: - (_this.iWidth * iScale - _this.iWidth) / 2,
								top: - (_this.iHeight * iScale - _this.iHeight) / 2,
								width: _this.iWidth * iScale,
								height: _this.iHeight * iScale,
								opacity: 0
							},
							_this._settings.speed,
							function(){
								_this.bStop = true;
								_this.oActive.css({
									zIndex: 1,
									left:0,
									top:0,
									width: _this.iWidth,
									height: _this.iHeight,
									opacity: 1
								});
								_this.oActive = nextItem;
							}
						);

					}
				};

			_this.oItems.eq(0).css('z-index', 2);
			_this._triggerRun(run);
		},
		_slide: function(dir){
			var _this = this,
				value = dir == 'leftRight' ? _this.iWidth : _this.iHeight,
				dir =  dir == 'leftRight' ? 'left' : 'top',
				setPos = function(isPrev){
					_this.oItems.not(_this.oActive).css(dir, (isPrev ? - value : value));
				},
				run = function(isPrev, nextIndex){
					if(_this.bStop){
						_this.bStop = false;
						setPos(isPrev);

						var _nextIndex = _this._getNextIndex(isPrev, nextIndex),
							nextItem = _this.oItems.eq(_nextIndex);

						_this.oActive.animate(
							(function(){
								var _value = isPrev ? value : - value;
								return dir == 'left' ? { 'left': _value } : { 'top': _value }
							}()),
							_this._settings.speed,
							function(){
								_this.bStop = true;
								_this.oActive = nextItem;
							}
						);

						nextItem.animate(
							(function(){
								return dir == 'left' ? { 'left': 0} : { 'top': 0}
							}()),
							_this._settings.speed
						);

						_this._changeActive(_nextIndex);
					}
				};

			setPos();
			_this._triggerRun(run);
		},
		_changeZindex: function(nextItem){
			this.oActive.css('z-index', 3);
			nextItem.css('z-index', 2);
		},
		_changeActive: function(_nextIndex){
			this.oButtons.removeClass('active');
			this.oButtons.eq(_nextIndex).addClass('active');
		},
		_getNextIndex: function(isPrev, nextIndex){
			var _this = this;
			if(!isNaN(nextIndex)){
				return nextIndex;
			}
			else{
				if(isPrev){
					return _this.oActive.prev().html() ? _this.oActive.prev().index() : _this.iSize - 1;
				}
				else{
					return _this.oActive.next().html() ? _this.oActive.next().index() : 0;
				}
			}
		},
		_triggerRun: function(fnRun){
			var _this = this;
			_this.oNext.bind('click', function(){
				fnRun(false);
			});

			_this.oPrev.bind('click', function(){
				fnRun(true);
			});

			_this.oButtons.bind('click', function(){
				if(_this.bStop){
					var btnIndex = $(this).index(),
						activeIndex = _this.oActive.index();
					
					if(btnIndex > activeIndex){
						fnRun(false, btnIndex);
					}
					else if(btnIndex < activeIndex){
						fnRun(true, btnIndex);
					}
				}
			});

			if(_this._settings.autoPlay){
				_this.timer = setInterval(function(){
					fnRun(false);
				}, (_this._settings.speed + _this._settings.delay));

				_this.oCarousel.bind({
					'mouseenter': function(){
						clearInterval(_this.timer);
					},
					'mouseleave': function(){
						_this.timer = setInterval(function(){
							fnRun(false);
						},  (_this._settings.speed + _this._settings.delay));
					}
				});
			}
		},
		_initPosition: function(){
			var _this = this;

			_this.oCarousel.css({
				width: _this._settings.width,
				height: _this._settings.height
			});
		}
	}

	return Carousel;
});