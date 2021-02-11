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
        CKEDITOR.dialog.add('flowChartDialog', this.path + 'dialogs/paintIt.js');
        editor.ui.addButton('flowChart',
        {
            label: 'Draw an FLowchart',
            command: 'flowChart',
            icon: this.path + 'images/flowchart.png'
        });
    }
});
