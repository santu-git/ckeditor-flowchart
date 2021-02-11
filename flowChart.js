/******************************************
 * Websanova.com
 *
 * Resources for web entrepreneurs
 *
 * @author          Santu
 * @copyright       Copyright (c) 2012 Geogo.
 * @license         This flowChart jQuery plug-in is dual licensed under the MIT and GPL licenses.
 * @link            http://www.websanova.com
 * @docs            http://www.websanova.com/plugins/websanova/paint
 * @version         Version x.x
 *
 ******************************************/

(function($){

  $.fn.flowChart = function(option, settings){
		//clean up some variables
		settings = $.extend({}, $.fn.flowChart.defaultSettings, settings || {});
		settings.lineWidthMin = parseInt(settings.lineWidthMin);
		settings.lineWidthMax = parseInt(settings.lineWidthMax);
		settings.lineWidth = parseInt(settings.lineWidth);
		
		return this.each(function()
		{			
			var $settings = jQuery.extend(true, {}, settings);
			
      var canvas = new Canvas($settings);
      canvas.start();
			var menu = new Menu();
			
			$('body')
			.append(menu.generate(canvas));
			//init mode
			menu.set_mode(menu, canvas, $settings.mode);
			
			//pull from css so that it is dynamic
			var buttonSize = $("._flowChart_icon").outerHeight() - (parseInt($("._flowChart_icon").css('paddingTop').split('px')[0]) + parseInt($("._flowChart_icon").css('paddingBottom').split('px')[0]));
      
      menu.menu.find("._flowChart_fillColorPicker").wColorPicker({
				mode: "click",
				initColor: $settings.fillStyle,
				buttonSize: buttonSize,
				onSelect: function(color){
					canvas.settings.fillStyle = color;
				}
			});
			
			menu.menu.find("._flowChart_strokeColorPicker").wColorPicker({
				mode: "click",
				initColor: $settings.strokeStyle,
				buttonSize: buttonSize,
				onSelect: function(color){
					canvas.settings.strokeStyle = color;
				}
			});
			
			//if($settings.image) canvas.setImage($settings.image);
			
			//elem.data('_flowChart_canvas', canvas);
		});
  }
  $.fn.flowChart.defaultSettings = {
		mode			    : 'Start',			// drawing mode - Rectangle, Ellipse, Line, Pencil, Eraser
		lineWidthMin	: '0', 				// line width min for select drop down
		lineWidthMax	: '10',				// line widh max for select drop down
		lineWidth		  : '1', 				// starting line width
		fillStyle		  : '#FFFFFF',		// starting fill style
		strokeStyle		: '#000000',		// start stroke style
		image			    : null,				// preload image - base64 encoded data
		drawDown		  : null,				// function to call when start a draw
		drawMove		  : null,				// function to call during a draw
		drawUp			  : null				// function to call at end of draw
  };

  /**
	 * Canvas class definition
	 */
	function Canvas(settings)
	{
		this.settings = settings;
		this.draw = false;
    this.canvas = null;
		return this;
  }
  Canvas.prototype = {
    
    start: function(){
      this.canvas = new draw2d.Canvas("flowChartCanvas");
      var $this = this;
      this.canvas.getCommandStack().addEventListener(e=>{
        if (e.isPostChangeEvent()) {
          if (e.command.connection) {
            e.command.connection.setTargetDecorator(
              new draw2d.decoration.connection.ArrowDecorator(10, 15)
            );
            e.command.connection.setColor("#000000");
            // console.log(e.command.connection.getTarget());
          }
          $this.exportPng($this);
        }
        
      })
      return this.canvas
    },
    callDraw: function($this,mode){
      var func = $this['draw' + mode];
      var shape = func($this);
      $this.attachPort(shape) 
      $this.exportPng($this);
    },
    attachPort: function (shape){
      shape.createPort('hybrid', new draw2d.layout.locator.TopLocator());
      shape.createPort('hybrid', new draw2d.layout.locator.RightLocator());
      shape.createPort('hybrid', new draw2d.layout.locator.BottomLocator());
      shape.createPort('hybrid', new draw2d.layout.locator.LeftLocator());
    },
    drawTerminator: function($this){
      var shape =  new draw2d.shape.basic.Rectangle({
        x:100,
        y:100, 
        width: 150,
        height: 50,
        radius: 10,
        stroke:$this.settings.lineWidth, 
        color:$this.settings.strokeStyle, 
        bgColor:$this.settings.fillStyle
      });
      var label =  new draw2d.shape.basic.Label({text:"Double Click on me",color: 'none'});
      label.installEditor(new draw2d.ui.LabelInplaceEditor({}));
      shape.add(label, new draw2d.layout.locator.CenterLocator());
      $this.canvas.add(shape);
      return shape;
    },
    drawProcess: function($this){
      var shape =  new draw2d.shape.basic.Rectangle({
        x:100,
        y:100, 
        width: 150,
        height: 50,
        stroke:$this.settings.lineWidth, 
        color:$this.settings.strokeStyle, 
        bgColor:$this.settings.fillStyle
      });
      var label =  new draw2d.shape.basic.Label({text:"Process",color: 'none'});
      label.installEditor(new draw2d.ui.LabelInplaceEditor({}));
      shape.add(label, new draw2d.layout.locator.CenterLocator());
      $this.canvas.add(shape);
      return shape;
    },
    drawConnector: function($this){
      var shape =  new draw2d.shape.basic.Circle({
        x:100,
        y:100, 
        diameter: 75,
        stroke:$this.settings.lineWidth, 
        color:$this.settings.strokeStyle, 
        bgColor:$this.settings.fillStyle
      });
      var label =  new draw2d.shape.basic.Label({text:"Connector",color: 'none'});
      label.installEditor(new draw2d.ui.LabelInplaceEditor({}));
      shape.add(label, new draw2d.layout.locator.CenterLocator());
      $this.canvas.add(shape);
      // shape.on('mouseenter',function(e){
      //   $this.attachPort(shape);
      // })
      // shape.on('mouseleave',function(e){
      //   var ports = shape.getPorts().data;
      //   ports.forEach(function(port){
      //     shape.removePort(port);
      //   });
      // })
      return shape;
    },
    drawDecision: function($this){
      var shape =  new draw2d.shape.basic.Diamond({
        x:100,
        y:100,
        width:100, 
        height:100,
        stroke:$this.settings.lineWidth, 
        color:$this.settings.strokeStyle, 
        bgColor:$this.settings.fillStyle
      });
      var label =  new draw2d.shape.basic.Label({text:"Decision",color: 'none'});
      label.installEditor(new draw2d.ui.LabelInplaceEditor({}));
      shape.add(label, new draw2d.layout.locator.CenterLocator());
      $this.canvas.add(shape);
      return shape;
    },
    exportPng: function($this){
      var writer = new draw2d.io.png.Writer();
      writer.marshal($this.canvas, function(png){
        $("#canvasImage").attr("src",png);
    });
    }

		/*callFunc: function(e, $this, event)
		{
			$e = jQuery.extend(true, {}, e);
			
			var canvas_offset = $($this.canvas).offset();
			
			$e.pageX = Math.floor($e.pageX - canvas_offset.left);
			$e.pageY = Math.floor($e.pageY - canvas_offset.top);
			
			var mode = $.inArray($this.settings.mode, shapes) > -1 ? 'Shape' : $this.settings.mode;
			var func = $this['draw' + mode + '' + event];	
				
			if(func) func($e, $this);
			//if($this.settings['draw' + event]) $this.settings['draw' + event]($e, $this);
		},*/
		
		
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
			
			var lineWidth = $('<div class="_flowChart_lineWidth" title="line width"></div>').append(
				$('<select>' + options + '</select>')
				.change(function(e){
					$canvas.settings.lineWidth = parseInt($(this).val());
				})
      )
      
			//content
			var menuContent = 
			$('<div class="_flowChart_options"></div>')
			.append($('<div class="_flowChart_icon _flowChart_terminator" title="terminator"></div>').click(function(){ $this.add_node($this, $canvas, 'Terminator'); }))
			.append($('<div class="_flowChart_icon _flowChart_rhombus" title="rhombus"></div>').click(function(){ $this.add_node($this, $canvas, 'Decision'); }))
			.append($('<div class="_flowChart_icon _flowChart_rectangle" title="rectangle"></div>').click(function(){ $this.add_node($this, $canvas, 'Process'); }))
			.append($('<div class="_flowChart_icon _flowChart_ellipse" title="ellipse"></div>').click(function(){ $this.add_node($this, $canvas, 'Connector'); }))
			//.append($('<div class="_flowChart_icon _flowChart_line" title="line"></div>').click(function(){ $this.set_mode($this, $canvas, 'Line'); }))
			//.append($('<div class="_flowChart_icon _flowChart_pencil" title="pencil"></div>').click(function(){ $this.set_mode($this, $canvas, 'Pencil'); }))
			//.append($('<div class="_flowChart_icon _flowChart_eraser" title="eraser"></div>').click(function(e){ $this.set_mode($this, $canvas, 'Eraser'); }))
			.append(lineWidth)			
			.append($('<div class="_flowChart_fillColorPicker _flowChart_colorPicker" title="fill color"></div>'))
			.append($('<div class="_flowChart_strokeColorPicker _flowChart_colorPicker" title="stroke color"></div>'))
			.append($('<div class="_flowChart_icon _flowChart_save" title="save"></div>').click(function(e){ javascript:saveImage(); }))
			.append($('<div class="_flowChart_icon _flowChart_clear" title="clear"></div>').click(function(e){ javascript:clearImage(); }))
			//handle
			var menuHandle = $('<!--div class="_flowChart_handle"></div-->')
			
      //get position of canvas
			//var offset = $($canvas.canvas).offset();
			//menu
			return this.menu = 
			$('<div id="_flowChart_menu" class="_flowChart_menu"></div>')
			.css({position: 'absolute', left: 10, top: 'unset'})
			//.draggable({handle: menuHandle})
			.append(menuHandle)
			.append(menuContent);
		},
		add_node: function($this,$canvas,mode){
      $canvas.callDraw($canvas,mode);
    },
		set_mode: function($this, $canvas, mode)
		{
      //$canvas.settings.mode = mode;
			//$canvas.callDraw($canvas);
			$this.menu.find("._flowChart_icon").removeClass('active');
			$this.menu.find("._flowChart_" + mode.toLowerCase()).addClass('active');
		}
	}
})(jQuery);