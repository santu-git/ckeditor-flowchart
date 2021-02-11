/******************************************
 * Websanova.com
 *
 * Resources for web entrepreneurs
 *
 * @author          Websanova
 * @copyright       Copyright (c) 2012 Websanova.
 * @license         This wPaint jQuery plug-in is dual licensed under the MIT and GPL licenses.
 * @link            http://www.websanova.com
 * @docs            http://www.websanova.com/plugins/websanova/paint
 * @version         Version x.x
 *
 ******************************************/
(function($)
{
	var shapes = ['Rhombus', 'Rectangle', 'Ellipse', 'Line', 'Arrow'];

	$.fn.wPaint = function(option, settings)
	{
		if(typeof option === 'object')
		{
			settings = option;
		}
		else if(typeof option == 'string')
		{
			var data = this.data('_wPaint_canvas');
			var hit = true;

			if(data)
			{
				if(option == 'image' && settings === undefined) return data.getImage();
				else if(option == 'image' && settings !== undefined) data.setImage(settings);
				else if($.fn.wPaint.defaultSettings[option] !== undefined)
                {
                    if(settings !== undefined) data.settings[option] = settings;
                    else return data.settings[option];
                }
				else hit = false;
			}
			else hit = false;
			
			return hit;
		}

		//clean up some variables
		settings = $.extend({}, $.fn.wPaint.defaultSettings, settings || {});
		settings.lineWidthMin = parseInt(settings.lineWidthMin);
		settings.lineWidthMax = parseInt(settings.lineWidthMax);
		settings.lineWidth = parseInt(settings.lineWidth);
		
		return this.each(function()
		{			
			var elem = $(this);
			var $settings = jQuery.extend(true, {}, settings);
			
			//test for HTML5 canvas
			var test = document.createElement('canvas');
			if(!test.getContext)
			{
				elem.html("Browser does not support HTML5 canvas, please upgrade to a more modern browser.");
				return false;	
			}
			
			var canvas = new Canvas($settings);
			var menu = new Menu();
			
			elem.append(canvas.generate(elem.width(), elem.height()));
			//elem.append(canvas.generateTemp());
			$('body')
			.append(menu.generate(canvas));

			//init mode
			menu.set_mode(menu, canvas, $settings.mode);
			
			//pull from css so that it is dynamic
			var buttonSize = $("._wPaint_icon").outerHeight() - (parseInt($("._wPaint_icon").css('paddingTop').split('px')[0]) + parseInt($("._wPaint_icon").css('paddingBottom').split('px')[0]));
			
			/*menu.menu.find("._wPaint_fillColorPicker").wColorPicker({
				mode: "click",
				initColor: $settings.fillStyle,
				buttonSize: buttonSize,
				onSelect: function(color){
					canvas.settings.fillStyle = color;
				}
			});
			
			menu.menu.find("._wPaint_strokeColorPicker").wColorPicker({
				mode: "click",
				initColor: $settings.strokeStyle,
				buttonSize: buttonSize,
				onSelect: function(color){
					canvas.settings.strokeStyle = color;
				}
			});*/
			
			if($settings.image) canvas.setImage($settings.image);
			
			elem.data('_wPaint_canvas', canvas);
		});
	}

	$.fn.wPaint.defaultSettings = {
		mode			: 'Rhombus',			// drawing mode - Rectangle, Ellipse, Line, Pencil, Eraser
		lineWidthMin	: '0', 				// line width min for select drop down
		lineWidthMax	: '10',				// line widh max for select drop down
		lineWidth		: '1', 				// starting line width
		fillStyle		: '#FFFFFF',		// starting fill style
		strokeStyle		: '#000000',		// start stroke style
		image			: null,				// preload image - base64 encoded data
		drawDown		: null,				// function to call when start a draw
		drawMove		: null,				// function to call during a draw
		drawUp			: null				// function to call at end of draw
	};

	/**
	 * Canvas class definition
	 */
	function Canvas(settings)
	{
		this.settings = settings;
		
		this.draw = false;

		this.canvas = null;
		this.ctx = null;

		//this.canvasTemp = null;
		//this.ctxTemp = null;
		
		//this.canvasTempLeftOriginal = null;
		//this.canvasTempTopOriginal = null;
		
		//this.canvasTempLeftNew = null;
		//this.canvasTempTopNew = null;
		
		return this;
	}
	
	Canvas.prototype = 
	{
		/*******************************************************************************
		 * Generate canvases and events
		 *******************************************************************************/
		generate: function(width, height)
		{	
			this.canvas = document.createElement('canvas');
			this.ctx = this.canvas.getContext('2d');
			
			//create local reference
			var $this = this;
			
			$(this.canvas)
			.attr('width', width + 'px')
			.attr('height', height + 'px')
			.css({position: 'absolute', left: 0, top: 0})
			.mousedown(function(e)
			{
				e.preventDefault();
				e.stopPropagation();
				$this.draw = true;
				$this.callFunc(e, $this, 'Down');
			});
			
			$(document)
			.mousemove(function(e)
			{
				if($this.draw) $this.callFunc(e, $this, 'Move');
			})
			.mouseup(function(e)
			{
				//make sure we are in draw mode otherwise this will fire on any mouse up.
				if($this.draw)
				{
					$this.draw = false;
					$this.callFunc(e, $this, 'Up');
				}
			});
			
			return $(this.canvas);
		},
		takeSnapshot: function(){
			this.snapshot = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
		},
		restoreSnapshot: function(){
			this.ctx.putImageData(this.snapshot, 0, 0);
		},
		/*generateTemp: function()
		{
			this.canvasTemp = document.createElement('canvas');
			this.ctxTemp = this.canvasTemp.getContext('2d');
			
			$(this.canvasTemp).css({position: 'absolute'}).hide();
			
			return $(this.canvasTemp);
		},*/
		
		callFunc: function(e, $this, event)
		{
			$e = jQuery.extend(true, {}, e);
			
			var canvas_offset = $($this.canvas).offset();
			
			$e.pageX = Math.floor($e.pageX - canvas_offset.left);
			$e.pageY = Math.floor($e.pageY - canvas_offset.top);
			
			var mode = $.inArray($this.settings.mode, shapes) > -1 ? 'Shape' : $this.settings.mode;
			var func = $this['draw' + mode + '' + event];	
				
			if(func) func($e, $this);
			//if($this.settings['draw' + event]) $this.settings['draw' + event]($e, $this);
		},
		
		/*******************************************************************************
		 * draw any shape
		 *******************************************************************************/
		drawShapeDown: function(e, $this)
		{
			
			$this['startPosition']={
				x: e.clientX - $this.canvas.getBoundingClientRect().left,
				y: e.clientY - $this.canvas.getBoundingClientRect().top,
			}
			$this['takeSnapshot']();
			
			
			
			var func = $this['draw' + $this.settings.mode + 'Down'];
			
			if(func) func(e, $this);
		},
		
		drawShapeMove: function(e, $this)
		{
			$this['restoreSnapshot']();
			var func = $this['draw' + $this.settings.mode + 'Move'];
			
			if(func)
			{
				
			    var factor = ['Arrow', 'Line'].includes($this.settings.mode) ? 1 : 2;
				e.x = e.pageX;
				e.y = e.pageY;
				e.w = e.x - $this.startPosition.x
				e.h = e.y - $this.startPosition.y

				$this.ctx.fillStyle = $this.settings.fillStyle;
				$this.ctx.strokeStyle = $this.settings.strokeStyle;
				$this.ctx.lineWidth = $this.settings.lineWidth*factor;
				
				func(e, $this);
			}
		},
		
		drawShapeUp: function(e, $this)
		{
			//$this.ctx.drawImage($this.canvasTemp ,$this.canvasTempLeftNew, $this.canvasTempTopNew);
			//$($this.canvasTemp).hide();
			
			var func = $this['draw' + $this.settings.mode + 'Up'];
			if(func) func(e, $this);
		},
		/*******************************************************************************
		 * draw line
		 *******************************************************************************/	
		drawLineMove: function(e, $this)
		{		
			$this.ctx.beginPath();
    		$this.ctx.moveTo($this.startPosition.x, $this.startPosition.y);
    		$this.ctx.lineTo(e.x, e.y);
    		$this.ctx.stroke();	
		},
		/*******************************************************************************
		 * draw arrow
		 *******************************************************************************/	
		drawArrowMove: function(e, $this)
		{				
			var headlen = 10;
			var fromX = $this.startPosition.x;
			var fromY = $this.startPosition.y;
			var toX = e.x;
			var toY = e.y;
			var dx = e.w;
			var dy = e.h;
			var angle = Math.atan2(dy, dx);
			$this.ctx.lineJoin = "round";
			$this.ctx.beginPath();
			$this.ctx.moveTo(fromX, fromY);
			$this.ctx.lineTo(toX,toY);
			$this.ctx.lineTo(toX - headlen * Math.cos(angle - Math.PI / 6), toY - headlen * Math.sin(angle - Math.PI / 6));
			$this.ctx.moveTo(toX, toY);
			$this.ctx.lineTo(toX - headlen * Math.cos(angle + Math.PI / 6), toY - headlen * Math.sin(angle + Math.PI / 6));
			$this.ctx.closePath();
			$this.ctx.stroke();
		},
		/*******************************************************************************
		 * draw rectangle
		 *******************************************************************************/		
		drawRectangleMove: function(e, $this)
		{	
			$this.ctx.beginPath();
			$this.ctx.rect($this.startPosition.x, $this.startPosition.y, e.w,e.h);
			$this.ctx.closePath();
			$this.ctx.stroke();
			$this.ctx.fill();
		},
		/*******************************************************************************
		 * draw ellipse
		 *******************************************************************************/
		drawEllipseMove: function(e, $this)
		{
			var kappa = .5522848;
			var ox = (e.w / 2) * kappa; 	// control point offset horizontal
			var  oy = (e.h / 2) * kappa; 	// control point offset vertical
			var  xe = $this.startPosition.x + e.w;           	// x-end
			var ye = $this.startPosition.y + e.h;           	// y-end
			var xm = $this.startPosition.x + e.w / 2;       	// x-middle
			var ym = $this.startPosition.y + e.h / 2;       	// y-middle

			$this.ctx.beginPath();
			$this.ctx.moveTo($this.startPosition.x, ym);
			$this.ctx.bezierCurveTo($this.startPosition.x, ym - oy, xm - ox, $this.startPosition.y, xm, $this.startPosition.y);
			$this.ctx.bezierCurveTo(xm + ox, $this.startPosition.y, xe, ym - oy, xe, ym);
			$this.ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
			$this.ctx.bezierCurveTo(xm - ox, ye, $this.startPosition.x, ym + oy, $this.startPosition.x, ym);
			$this.ctx.closePath();
			if($this.settings.lineWidth > 0)$this.ctx.stroke();
			$this.ctx.fill();
		},
		/*******************************************************************************
		 * draw rhombus
		 *******************************************************************************/		
		drawRhombusMove: function(e, $this)
		{	
			var startX=$this.startPosition.x;
			var startY=$this.startPosition.y;
			var endX=startX;
			var endY=startY+e.h;
			var halfWidth = parseInt(e.w / 2);
			var halfHeight = parseInt(e.h / 2);
			var laftX=startX-halfWidth;
			var laftY=startY+halfHeight;
			var rightX=startX+halfWidth;
			var rightY=startY+halfHeight;
			$this.ctx.beginPath();
			$this.ctx.moveTo(startX, startY); // Top
			$this.ctx.lineTo(laftX,laftY); // Left
			$this.ctx.lineTo(endX,endY); // Bottom
			$this.ctx.lineTo(rightX,rightY); // Right
			$this.ctx.lineTo(startX,startY); // Right
    		
    		
    		//$this.ctxTemp.lineTo(e.x, e.y + halfWidth); // Back to Top
			$this.ctx.closePath();
			$this.ctx.stroke();
			$this.ctx.fill();
		},

		/*******************************************************************************
		 * save / load data
		 *******************************************************************************/
		getImage: function()
		{
			return this.canvas.toDataURL();
		},
		
		setImage: function(data)
		{
			var $this = this;
			
			var myImage = new Image();
			myImage.src = data;

			$this.ctx.clearRect(0, 0, $this.canvas.width, $this.canvas.height);			
			
			$(myImage).load(function(){
				$this.ctx.drawImage(myImage, 0, 0);
			});
		}
	}
	
	/**
	 * Menu class definition
	 */
	function Menu()
	{
		this.menu = null;
		
		return this;
	}
	
	Menu.prototype = 
	{
		generate: function(canvas)
		{
			var $canvas = canvas;
			var $this = this;
			
			//setup the line width select
			var options = '';
			for(var i=$canvas.settings.lineWidthMin; i<=$canvas.settings.lineWidthMax; i++) options += '<option value="' + i + '" ' + ($canvas.settings.lineWidth == i ? 'selected="selected"' : '') + '>' + i + '</option>';
			
			var lineWidth = $('<div class="_wPaint_lineWidth" title="line width"></div>').append(
				$('<select>' + options + '</select>')
				.change(function(e){
					$canvas.settings.lineWidth = parseInt($(this).val());
				})
			)
			
			//content
			var menuContent = 
			$('<div class="_wPaint_options"></div>')
			.append($('<div class="_wPaint_icon _wPaint_arrow" title="arrow"></div>').click(function(){ $this.set_mode($this, $canvas, 'Arrow'); }))
			.append($('<div class="_wPaint_icon _wPaint_rhombus" title="rhombus"></div>').click(function(){ $this.set_mode($this, $canvas, 'Rhombus'); }))
			.append($('<div class="_wPaint_icon _wPaint_rectangle" title="rectangle"></div>').click(function(){ $this.set_mode($this, $canvas, 'Rectangle'); }))
			.append($('<div class="_wPaint_icon _wPaint_ellipse" title="ellipse"></div>').click(function(){ $this.set_mode($this, $canvas, 'Ellipse'); }))
			.append($('<div class="_wPaint_icon _wPaint_line" title="line"></div>').click(function(){ $this.set_mode($this, $canvas, 'Line'); }))
			//.append($('<div class="_wPaint_icon _wPaint_pencil" title="pencil"></div>').click(function(){ $this.set_mode($this, $canvas, 'Pencil'); }))
			//.append($('<div class="_wPaint_icon _wPaint_eraser" title="eraser"></div>').click(function(e){ $this.set_mode($this, $canvas, 'Eraser'); }))
			.append(lineWidth)			
			.append($('<div class="_wPaint_fillColorPicker _wPaint_colorPicker" title="fill color"></div>'))
			.append($('<div class="_wPaint_strokeColorPicker _wPaint_colorPicker" title="stroke color"></div>'))
			.append($('<div class="_wPaint_icon _wPaint_save" title="save"></div>').click(function(e){ javascript:saveImage(); }))
			.append($('<div class="_wPaint_icon _wPaint_clear" title="clear"></div>').click(function(e){ javascript:clearImage(); }))
			//handle
			var menuHandle = $('<!--div class="_wPaint_handle"></div-->')
			
			//get position of canvas
			var offset = $($canvas.canvas).offset();
			
			//menu
			return this.menu = 
			$('<div id="_wPaint_menu" class="_wPaint_menu"></div>')
			.css({position: 'absolute', left: offset.left - 2, top: 'unset'})
			//.draggable({handle: menuHandle})
			.append(menuHandle)
			.append(menuContent);
		},
		
		set_mode: function($this, $canvas, mode)
		{
			$canvas.settings.mode = mode;
			
			$this.menu.find("._wPaint_icon").removeClass('active');
			$this.menu.find("._wPaint_" + mode.toLowerCase()).addClass('active');
		}
	}
})(jQuery);