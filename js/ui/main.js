define(['jquery', 'dialog', 'getUI'], function($, Dialog, GetUI){
    var mainUI = {
        init: function(){
            this.$contentColumns = null;
            this.$activeEditableElement = null;
            this.layOutDialog = null;
            this.previewDialog = null;
            this.oContextmenu = $('.e-contextmenu');
            this.fixTools = $('.e-fix-tools');

            // this.showLayout();
            this.widgetsOperate();
            this.menuAni();
            this.resizeRender();
            this.slideOperate();
        },
        /* 布局列表 */
        showLayout: function(){
            var _this = this;

            /* 布局列表dialog */
            _this.layOutDialog = new Dialog({
                width: '740px',
                height: $(window).height() * 0.8,
                title:'请选择布局模板',
                draggable: false,
                onBeforeShow: function(){
                    this.UI.find('.icon-remove,.ui-dialog-footer').hide();
                },
                html: (function(){
                   return _this.previewLayout();
                }())
            });

            /* 重新布局按钮 */
            $('.e-top-tools .btn-tool-relayout').click(function(){
                _this.layOutDialog.show();
                _this.layOutDialog.UI.find('.icon-remove').show();
            });
        },
        /* 布局预览 */
        previewLayout: function(){
             var _this = this,
                blockColor = ['#bbb', '#ccc', '#eee', '#999', '#888', '#777', '#666'],
                randomColor = function(){
                    var i = Math.floor(Math.random() * (blockColor.length));
                    return blockColor[i];
                },
                allTmpl = $('<div></div>'),
                layOutMap = [
                    [ '12', '6:6', '4:4:4', '3:3:3:3', '12'],
                    [ '12', '4:4:4', '2:2:2:2:2:2', '6:6', '12'],
                    [ '6:6', '3:3:3:3', '6:6', '12'],
                    [ '4:4:4', '12', '2:2:2:2:2:2', '6:6', '12']
                ];

            /* 随机颜色 */
            _this.randomColor = randomColor;

            for(var i = 0, j = layOutMap.length;i < j; i++){
                var layoutHTML = $('<div class="ui-layout-map"></div>');

                for(var m = 0, n = layOutMap[i].length; m < n; m++){
                    var arr = layOutMap[i][m].split(':'),
                        row = $('<div class="ui-row"></div>');

                    for(var a = 0, b = arr.length; a < b; a++){
                        row.append('<div class="ui-column ui-column-'+ arr[0] +'" style="background:'+ randomColor() +'"></div>');
                    }

                    row.appendTo(layoutHTML);
                }

                /* 点击选择布局模板 */
                layoutHTML.appendTo(allTmpl).bind({
                    'click': function(){
                        _this.layOutDialog.hide();
                        var _thisTmpl = $(this).clone();


                        /* 布局预览dialog */
                        _this.previewDialog = new Dialog({
                            width: '800px',
                            height: '600px',
                            title: '模板预览<span style="color:red;">（左击选择，右击操作）</span>',
                            hideMask: false,
                            html:(function(){
                                var previewHTML = _thisTmpl,
                                    columns = previewHTML.find('.ui-column');

                                previewHTML.removeClass('ui-layout-map').css({
                                    height: '500px',
                                    overflowY: 'scroll',
                                    overflowX: 'hidden'
                                });

                                /* 拖动 */
                               _this.editLayOut(columns);

                                return previewHTML;
                            }()),
                            draggable: false,
                            onCancel: function(){
                                this.destroy();
                                _this.layOutDialog.show();
                                _this.oContextmenu.hide();
                            },
                            onClose: function(){
                                this.destroy();
                                _this.layOutDialog.show();
                                _this.oContextmenu.hide();
                            },
                            onEnsure: function(){
                                var aRow = this.UI.find('.ui-row').clone(),
                                    aCol = aRow.find('.ui-column');

                                aCol.removeAttr('style').removeClass('active');
                                _this.$contentColumns = aCol;
                                $('.e-view-wrapper').html(aRow);
                                _this.layOutDialog.hide();
                                this.destroy();
                                this.Mask.hide();
                                _this.oContextmenu.hide();
                            }
                        }, true);
                    }
                });
            }

            return allTmpl;
        },
        /* 编辑布局 */
        editLayOut: function($columns){
            var _this = this,
                btnMerge = _this.oContextmenu.find('.e-contextmenu-merge'),
                btnSplit = _this.oContextmenu.find('.e-contextmenu-split'),
                thatRow = null,
                selectedColumn = [];

            bindColumns($columns);

            /* 给每列绑定事件 */
            function bindColumns(columns){
                columns
                    .toggle(
                        function(){
                            var thisRow = $(this).closest('.ui-row'),
                                thisRowIndex = thisRow.index();

                            if(thatRow){
                                if(thatRow.index() != thisRowIndex){
                                    thatRow.find('.active').trigger('click');
                                    selectedColumn = [];
                                }
                            }
                            thatRow = thisRow;
                            _this.oContextmenu.hide();
                            $(this).addClass('active');
                            selectedColumn.push($(this));
                        },
                        function(){
                            _this.oContextmenu.hide();
                            $(this).removeClass('active');
                            selectedColumn.pop();
                        }
                    )/* 鼠标右键编辑菜单 */
                    .bind('contextmenu', function(e){
                        if($(this).hasClass('active')){
                            btnMerge.removeClass('disabled').unbind('click');
                            btnSplit.removeClass('disabled').unbind('click');

                            if(selectedColumn.length <= 1){
                                btnMerge.addClass('disabled');
                                btnSplit.bind('click', function(){
                                    fireSplit();
                                });
                            }
                            else{
                                btnSplit.addClass('disabled');
                                btnMerge.bind('click', function(){
                                    fireMerge();
                                });
                            }

                            _this.oContextmenu.css({ left: e.pageX, top: e.pageY}).show();
                        }
                        return false;
                    }
                );
            }


            /* 合并操作 */
            function fireMerge(){
                var colLen = thatRow.find('.ui-column').length,
                    merLen = selectedColumn.length,
                    iCell = (function(){
                        var iNum = 0;

                        for(var i = 0; i < merLen; i++){
                            iNum += parseInt($(selectedColumn[i]).attr('class').match(/\d{1,2}/g).toString(), 10);
                        }

                        return iNum;
                    }());

                var oCol = $('<div class="ui-column ui-column-' + iCell + '" style="background:#ddd"></div>').unbind('click contextmenu');

                thatRow.find('.active').replaceWith(oCol);
                _this.oContextmenu.hide();

                bindColumns(oCol);

                selectedColumn = [];
                thatRow = null;
            }

            /* 拆分操作 */
            function fireSplit(){
                var $selCol = $(selectedColumn[0]),
                    iClassCol = parseInt($selCol.attr('class').match(/\d{1,2}/g).toString(), 10),
                    tempArr = (function(){
                        var arr = [];

                        for(var i = 1; i <= iClassCol; i++){
                            if(!/\./g.test((iClassCol / i).toString())){
                                arr.push('v' + i);
                            }
                        }
                        return arr;
                    }());

                _this.oContextmenu.hide();
                _this.previewDialog.hide();

                /* 选择布局列数dialog */
                var selectColDialog = new Dialog({
                    title: '请选择列数',
                    html: (function(){
                        var html = $('<select></select>').bind('change', function(){
                                var i = parseInt($(this).val(), 10),
                                    tip = selectColDialog.UI.find('select').next();

                                if($.inArray('v'+i, tempArr) != -1){
                                    tip.css('color', '#0099CC').insertAfter($(this));
                                    selectColDialog.isValid = true;
                                    selectColDialog.UI.removeClass('shake animated');
                                }
                                else{
                                    tip.css('color', 'red').insertAfter($(this));
                                    selectColDialog.isValid = false;
                                    selectColDialog.UI.addClass('shake animated');
                                }
                            });

                        for(var i = 0; i < iClassCol; i++){
                            html.append('<option value="' + (i + 1) + '">' + (i + 1) + '列</option>');
                        }
                        html.after('<span style="color:#0099CC;font-size:12px;padding-left:10px;">列数需要符合偶数比</span>');

                        return html;
                    }()),
                    hideMask: false,
                    onAfterHide: function(){
                        this.destroy();
                        _this.previewDialog.show();
                    },
                    onEnsure: function(){
                        var sel = this.UI.find('select'),
                            iValue = sel.val(),
                            iOffset = iClassCol / iValue,
                            html = null;

                        for(var i = 0; i < iValue; i++){
                            if(html){
                                html.after('<div class="ui-column ui-column-' + iOffset + '"  style="background:' + _this.randomColor() + '"></div>');
                            }
                            else{
                                html = $('<div class="ui-column ui-column-' + iOffset + '"  style="background:' + _this.randomColor() + '"></div>');
                            }
                        }

                        bindColumns(html);

                        $selCol.replaceWith(html);

                        selectedColumn = [];
                        thatRow = null;
                    }
                }, true);
            }
        },
        /* 左边菜单操作 */
        widgetsOperate: function(){
            var _this = this,
                wgItems = $('.e-widget .e-widget-item'),
                wgBtns = wgItems.find('.ui-button-drag'),
                fixToolWidth = _this.fixTools.outerWidth(),
                fire = false,
                wgTmpl = null;

            wgBtns.bind({
                'mousedown': function(e_down){
                    var disX = e_down.offsetX,
                        disY = e_down.offsetY,
                        fire = true,
                        $this = $(this),
                        _$this = $this.get(0),
                        dataUI = $this.closest('.e-widget-item').attr('data-ui');

                    wgTmpl = GetUI(dataUI, true);
                    wgTmpl.appendTo('body').css({
                        position: 'absolute',
                        zIndex: 99,
                        borderRadius: '8px',
                        border: '1px dashed #ccc'
                    });

                    _$this.setCapture && _$this.setCapture();

                    $(document).bind({
                        'mousemove': function(e_move){
                            if(fire){
                                wgTmpl.css({
                                    left: e_move.pageX - disX,
                                    top: e_move.pageY - disY
                                });
                            }
                        },
                        'mouseup': function(e_up){
                            if(wgTmpl){
                                var eles = _this.$contentColumns,
                                    pX = e_up.pageX,
                                    pY = e_up.pageY,
                                    appendTarget = (function(){
                                        var ele = null;
                                        eles.each(function(){
                                            if(pX >=  $(this).offset().left && pY >=  $(this).offset().top){
                                                ele = $(this);
                                            }
                                        });

                                        return ele;
                                    }());

                                wgTmpl.clone().removeAttr('style').appendTo(appendTarget).bind({
                                    'mouseenter': function(){
                                        _this.$activeEditableElement = $(this);

                                        _this.fixTools.show().css({
                                            left: $(this).offset().left + $(this).outerWidth() - fixToolWidth,
                                            top: $(this).offset().top
                                        });
                                    }
                                });
                                wgTmpl.remove();
                            }
                            fire = false;
                            wgTmpl = null;

                            _$this.releaseCapture && _$this.releaseCapture();
                        }
                    })
                }
            });
        },
        slideOperate: function(){
            var _this = this,
                viewWrapper = $('.e-view-wrapper'),
                btnEdit = _this.fixTools.find('.btn-tool-edit')
                btnDelete = _this.fixTools.find('.btn-tool-delete'),
                editDialog = null,
                deleteDialog = null;

            btnEdit.click(function(){
                if(_this.$activeEditableElement){
                    editDialog = new Dialog({
                        title: '编辑操作',
                        onAfterHide: function(){
                            this.destroy();
                        }
                    }, true).UI.click(function(e){e.stopPropagation()});
                }
                else{
                    new Dialog({
                        html: '<span style="color:red">请选择要编辑的元素！</span>',
                        onAfterHide: function(){
                            this.destroy();
                        }
                    }, true).UI.addClass('shake animated speed-d6');
                }
            });
            btnDelete.click(function(e){
                if(_this.$activeEditableElement){
                    deleteDialog = new Dialog({
                        title: '删除提示',
                        html: '<span style="color:red">您确定要删除吗？</span>',
                        onEnsure: function(){
                            _this.$activeEditableElement.unbind().remove();
                            _this.$activeEditableElement = null;
                        },
                        onAfterHide: function(){
                            this.destroy();
                        }
                    }, true).UI.click(function(e){e.stopPropagation()});
                }
                else{
                    new Dialog({
                        html: '<span style="color:red">请选择要删除的元素！</span>',
                        onAfterHide: function(){
                            this.destroy();
                        }
                    }, true).UI.addClass('shake animated speed-d6');
                }
            });
        },
        /* 菜单选择 */
        menuAni: function(){
            var group = $('.e-widget-group'),
                title = group.find('.group-title'),
                content = group.find('.group-content'),
                nowTitle = null;

            function hideLast(){
                if(nowTitle){
                    $(nowTitle).parent().find('.group-content').hide();
                    $(nowTitle).find('i').toggleClass('icon-double-angle-right icon-double-angle-down');
                }
            }

            title.click(function(){
                if($(this).find('i').hasClass('icon-double-angle-down')){
                    return;
                }
                hideLast();
                nowTitle = $(this);
                $(this).parent().find('.group-content').slideToggle('fast');
                $(this).find('i').toggleClass('icon-double-angle-right icon-double-angle-down');
            });

            title.first().trigger('click');
        },
        /* 窗口重置 */
        resizeRender: function(){
            var w = function(){
                    return $(window).width();
                },
                h = function(){
                    return $(window).height();
                },
                oCon = $('.e-containter'),
                oView = oCon.find('.e-view'),
                oWidget = oCon.find('.e-widget'),
                btnSwitch = oWidget.find('.e-widget-switch');

            btnSwitch.click(function(){

            });

            setSize();
            function setSize(){
                oCon.css('height', h() - 80);
                oView.css({
                    width: w() - 240,
                });
            }

            $(window).resize(function(){
                setSize();
            });
        }
    };
   return mainUI;
});