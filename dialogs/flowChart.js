CKEDITOR.dialog.add('flowChartDialog', function( editor ){
  return {
    /*
      title : // title in string,
      minWidth : //number of pixels,
      minHeight : //number of pixels,
      buttons: //array of button definitions,
      onOk: //function,
      onLoad: //function,
      onShow: //function,
      onHide: //function,
      onCancel: //function,
      resizable: // none,width,height or both  ,
      contents: //content definition, basically the UI of the dialog
    */
    title : 'Draw an Diagram',
    minWidth : 900,
    minHeight : 500,
    contents :[{
      id : 'flowChartDialog',
      label : 'flowChartDialog',
      elements :[
        {
          type : 'html',
          html : '<center><iframe id="flowChartDialog" src="plugins/flowChart/index.html" style="height:500px;width:900px;"></iframe></center>',
          setup: function( element ) {
            var iframe = document.getElementById("flowChartDialog");
            var elmnt = iframe.contentWindow.document.getElementById("canvasImage");
            elmnt.setAttribute('data-json',element.getAttribute('data-meta'));
          },
        }
      ]
    }],
    onShow: function(){
      // Get the selection from the editor.
      var selection = editor.getSelection();
      // Get the element at the start of the selection.
      var element = selection.getStartElement();
      
      // Get the <abbr> element closest to the selection, if it exists.
			if ( element )
        element = element.getAscendant( 'img', true );
      // Create a new <abbr> element if it does not exist.
      if ( !element || element.getName() != 'img' ) {
        element = editor.document.createElement( 'img' );
        element.setAttribute( 'class', 'flow-chart-img');
        // Flag the insertion mode for later use.
        this.insertMode = true;
      }
      else
        this.insertMode = false;
      
      if ( !this.insertMode )
				this.setupContent( element );
    },
    onOk: function() {
      //document.getElementById('flowChartDialog').contentWindow.saveImage();
      var iframeWindow = document.getElementById('flowChartDialog');
      var iframeDoc = iframeWindow.contentDocument || iframeWindow.contentWindow.document;
      var element = iframeDoc.getElementById('canvasImage');
      var flowChartImage = editor.document.createElement('img');
      //var  = flowChart.append('img')
      //flowChart.setAttribute( 'meta',element.getAttribute('data-json'));
      flowChartImage.setAttribute( 'class', 'flow-chart-img');
      flowChartImage.setAttribute( 'src', element.src);
      flowChartImage.setAttribute( 'data-meta', element.getAttribute('data-json'));
      editor.insertElement(flowChartImage);
      document.getElementById('flowChartDialog').contentWindow.clearImage();
    },
  };
});
