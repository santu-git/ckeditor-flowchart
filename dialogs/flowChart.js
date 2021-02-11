CKEDITOR.dialog.add('flowChartDialog', function( editor )
{
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
            elements :
            [{
                type : 'html',
                html : '<center><iframe id="flowChartDialog" src="plugins/flowChart/index.html" style="height:500px;width:900px;"></iframe></center>'
            }]
        }],
        onOk: function() {
            //document.getElementById('flowChartDialog').contentWindow.saveImage();
            var iframeWindow = document.getElementById('flowChartDialog');
            var iframeDoc = iframeWindow.contentDocument || iframeWindow.contentWindow.document;
            var element = iframeDoc.getElementById('canvasImage');
            var flowChart = editor.document.createElement('flowChart');
            var flowChartImage = flowChart.append('img')
            flowChart.setAttribute( 'meta',element.getAttribute('data-json'));
            flowChartImage.setAttribute( 'src', element.src);
            editor.insertElement(flowChart);
            document.getElementById('flowChartDialog').contentWindow.clearImage();
        },
	};
});
