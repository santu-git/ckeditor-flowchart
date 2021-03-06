/*
Created by Santu Koley
Date: 14-05-2012
Plugin Name : Flowchart Editor
*/
CKEDITOR.plugins.add('flowChart',
{
  init: function(editor)
  {
    editor.addCommand('flowChart', new CKEDITOR.dialogCommand('flowChartDialog'));
    
    editor.ui.addButton('FlowChart',
    {
        label: 'Draw an FLowchart',
        command: 'flowChart',
        icon: this.path + 'images/flowchart.png'
    });
    if ( editor.contextMenu ) {
      
      editor.addMenuGroup( 'flowChartGroup' );
      editor.addMenuItem( 'flowChartItem', {
        label: 'Edit Flow Chart',
        icon: this.path + 'images/flowchart.png',
        command: 'flowChart',
        group: 'flowChartGroup'
      });
      editor.contextMenu.addListener( function( element ) {
				if ( element.getAscendant( 'img', true ) && (element.getAttribute('class') || "").split(" ").includes('flow-chart-img')) {
					return { flowChartItem: CKEDITOR.TRISTATE_OFF };
				}
      });
    }
    CKEDITOR.dialog.add('flowChartDialog', this.path + 'dialogs/flowChart.js');
    //console.log(editor);
  }
});
